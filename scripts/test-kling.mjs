#!/usr/bin/env node
/**
 * 可灵 AI API 本地测试脚本
 * 测试流程：JWT鉴权 → 文生视频 → 轮询查询结果
 *
 * 可灵 JWT 签名算法：HS256
 * Header: {"alg":"HS256","typ":"JWT"}
 * Payload: {"iss":"<AccessKey>","exp":<unix_ts>,"nbf":<unix_ts>}
 * Secret: SecretKey (UTF-8 bytes)
 */

import crypto from 'crypto';

const ACCESS_KEY = process.env.KLING_ACCESS_KEY || '';
const SECRET_KEY = process.env.KLING_SECRET_KEY || '';
const BASE_URL = 'https://api-beijing.klingai.com';

// --- JWT Token 生成 ---
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateToken(expHours = 2) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: ACCESS_KEY,
    exp: now + expHours * 3600,
    nbf: now,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const signature = crypto
    .createHmac('sha256', Buffer.from(SECRET_KEY, 'utf-8'))
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signingInput}.${signature}`;
}

// --- HTTP 请求封装 ---
async function apiCall(method, path, body = null) {
  const token = generateToken();
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const data = await res.json();
  return { status: res.status, data };
}

// --- 主测试流程 ---
async function main() {
  console.log('🔧 可灵 AI API 测试脚本\n');
  console.log(`Token 有效期: 2 小时`);

  // Step 1: 测试 JWT Token 生成
  const token = generateToken();
  console.log(`\n📝 JWT Token 生成成功`);
  console.log(`   Token 前40位: ${token.substring(0, 40)}...`);

  // Step 2: 查询账户余额
  console.log(`\n📡 Step 1: 查询账户余额...`);
  const balanceRes = await apiCall('GET', '/v1/account/balance');
  console.log(`   响应状态: ${balanceRes.status}`);
  console.log(`   响应数据: ${JSON.stringify(balanceRes.data, null, 2)}`);

  // Step 3: 文生视频（简单提示词，节省配额）
  console.log(`\n📡 Step 2: 提交文生视频任务...`);
  const videoRes = await apiCall('POST', '/v1/videos/text2video', {
    model_name: 'kling-v3',
    prompt: '一只橘猫在阳光下打哈欠，特写镜头，温暖色调',
    duration: 5,
    mode: 'std',
    aspect_ratio: '16:9',
  });
  console.log(`   响应状态: ${videoRes.status}`);
  console.log(`   响应数据: ${JSON.stringify(videoRes.data, null, 2)}`);

  // Step 4: 如果有 task_id，轮询查询
  const taskId = videoRes.data?.data?.task_id;
  if (taskId) {
    console.log(`\n📡 Step 3: 查询任务状态 (task_id: ${taskId})...`);
    // 等 10 秒后第一次查询
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 10000));
      const queryRes = await apiCall('GET', `/v1/videos/text2video/${taskId}`);
      const status = queryRes.data?.data?.task_status;
      console.log(`   第${i + 1}次轮询: status=${status}`);
      console.log(`   响应: ${JSON.stringify(queryRes.data, null, 2)}`);
      if (status === 'succeed' || status === 'failed') break;
    }
  } else {
    console.log(`\n⚠️ 未获取到 task_id，停止轮询`);
  }

  console.log(`\n✅ 测试完成`);
}

main().catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
