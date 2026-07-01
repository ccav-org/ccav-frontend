/**
 * ccav.com API 后端服务
 * 提供 Kimi 2.6 对话 + 可灵 AI 文生图/文生视频 的 API 代理
 *
 * 使用方式：node server/server.mjs
 * 部署到服务器后配合 nginx 反向代理 /api/ → localhost:3001
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { createServer } from 'http';
import authRoutes from './auth.js';
import courseRoutes from './courses.mjs';
import commentRoutes from './comments.mjs';
import galleryRoutes from './gallery.mjs';

// 手动加载 .env
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envContent = readFileSync(resolve(__dirname, '.env'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
} catch {}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ============ Phase 2: 用户认证 & 课程系统 ============
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/gallery', galleryRoutes);

// ============ 配置 ============

const CONFIG = {
  kimi: {
    apiKey: process.env.KIMI_API_KEY || '',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-32k',
  },
  kling: {
    accessKey: process.env.KLING_ACCESS_KEY || '',
    secretKey: process.env.KLING_SECRET_KEY || '',
    baseUrl: 'https://api-beijing.klingai.com',
    imageModel: 'kling-v1-6',
    videoModel: 'kling-v2-6',
  },
  replicate: {
    apiKey: process.env.REPLICATE_API_KEY || '',
    baseUrl: 'https://api.replicate.com/v1',
    imageModel: 'black-forest-labs/flux-schnell',
    videoModel: 'stability-ai/stable-video-diffusion-img2vid-xt',
    // flux-schnell: Turbo mode, ~2s/image, $0.003/image
    // svd-xt: img2vid, ~30s/video, $0.01/video
  },
};

// ============ 可灵 JWT Token 生成 ============

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateKlingToken(accessKey, secretKey) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: accessKey,
    exp: now + 7200,
    nbf: now,
  };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = crypto
    .createHmac('sha256', Buffer.from(secretKey, 'utf-8'))
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${signingInput}.${signature}`;
}

async function klingRequest(accessKey, secretKey, method, path, bodyObj = null) {
  const token = generateKlingToken(accessKey, secretKey);
  const bodyStr = bodyObj ? JSON.stringify(bodyObj) : undefined;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const res = await fetch(`${CONFIG.kling.baseUrl}${path}`, {
    method,
    headers,
    body: bodyStr,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ============ Replicate API ============

async function replicateRequest(method, path, bodyObj = null) {
  const bodyStr = bodyObj ? JSON.stringify(bodyObj) : undefined;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${CONFIG.replicate.apiKey}`,
  };
  if (method === 'POST' && bodyStr) {
    headers['Prefer'] = 'wait';
  }

  const res = await fetch(`${CONFIG.replicate.baseUrl}${path}`, {
    method,
    headers,
    body: method === 'POST' ? bodyStr : undefined,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ============ Kimi 提示词优化 ============

const OPTIMIZE_SYSTEM_PROMPT = `你是一个专业的 AI 视颟创作提示词工程师。请将用户的简略描述优化为高质量的可灵 AI 提示词。\n\n要求：\n1. 保持中文提示词，增加画面细节（光影、色彩、构图、风格）\n2. 视频类提示词需要加入运镜描述（推、拉、摇、移、固定）\n3. 确保画面动态自然流畅，避免人物或物体出现异常变形\n4. 描述要具体，避免模糊词汇\n5. 输出仅优化后的提示词，不要有前置说明\n\n格式：直接输出优化后的提示词文本，不要加引号或额外解释。`;

app.post('/api/optimize', async (req, res) => {
  try {
    const { prompt, type } = req.body;
    if (!prompt) return res.status(400).json({ error: '缺少 prompt 参数' });

    if (!CONFIG.kimi.apiKey) {
      return res.status(500).json({ error: 'Kimi API Key 未配置' });
    }

    const typeHint = type === 'video'
      ? '这是一个视频生成任务，请优化为适合文生视频的提示词。'
      : '这是一个图像生成任务，请优化为适合文生图的提示词。';

    const response = await fetch(`${CONFIG.kimi.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.kimi.apiKey}`,
      },
      body: JSON.stringify({
        model: CONFIG.kimi.model,
        messages: [
          { role: 'system', content: OPTIMIZE_SYSTEM_PROMPT },
          { role: 'user', content: `${typeHint}\n\n用户原文：${prompt}` },
        ],
        temperature: 1.0,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || '优化失败' });
    }

    const optimized = data.choices?.[0]?.message?.content?.trim() || prompt;
    res.json({ optimizedPrompt: optimized });
  } catch (err) {
    console.error('[/api/optimize Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ Kimi 对话 ============

app.post('/api/kimi/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: '缺少 messages 参数' });
    }
    if (!CONFIG.kimi.apiKey) {
      return res.status(500).json({ error: 'Kimi API Key 未配置' });
    }

    const response = await fetch(`${CONFIG.kimi.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.kimi.apiKey}`,
      },
      body: JSON.stringify({
        model: CONFIG.kimi.model,
        messages: [
          { role: 'system', content: systemPrompt || '你是一个专业的AI视频创作助手，帮助用户设计和优化提示词。你的回答要简洁、实用、有干货。' },
          ...messages,
        ],
        temperature: 1.0,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Kimi API 调用失败' });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
    });
  } catch (err) {
    console.error('[Kimi API Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ 可灵 API 代理（平台模式） ============

app.post('/api/kling/generate', async (req, res) => {
  try {
    const { type, prompt, negative_prompt, width, height, duration, aspect_ratio, image, accessKey, secretKey } = req.body;
    if (!prompt) return res.status(400).json({ error: '缺少 prompt 参数' });

    // 如果前端传了密钥（学生模式），用学生的密钥生成 JWT
    const ak = accessKey || CONFIG.kling.accessKey;
    const sk = secretKey || CONFIG.kling.secretKey;

    let result;
    if (type === 'image') {
      result = await klingRequest(ak, sk, 'POST', '/v1/images/generations', {
        model: CONFIG.kling.imageModel,
        prompt,
        negative_prompt: negative_prompt || '',
        n: 1,
        ...(width && height ? { width, height } : {}),
      });
    } else {
      result = await klingRequest(ak, sk, 'POST', '/v1/videos/text2video', {
        model_name: CONFIG.kling.videoModel,
        prompt,
        negative_prompt: negative_prompt || '',
        duration: duration || 5,
        mode: 'std',
        aspect_ratio: aspect_ratio || '16:9',
        ...(image ? { image } : {}),
      });
    }

    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[/api/kling/generate Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling/task', async (req, res) => {
  try {
    const { taskId, type, accessKey, secretKey } = req.query;
    if (!taskId) return res.status(400).json({ error: '缺少 taskId 参数' });

    const ak = accessKey || CONFIG.kling.accessKey;
    const sk = secretKey || CONFIG.kling.secretKey;

    const path = type === 'image'
      ? `/v1/images/generations/${taskId}`
      : `/v1/videos/text2video/${taskId}`;

    const result = await klingRequest(ak, sk, 'GET', path);
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[/api/kling/task Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 兼容旧接口
app.post('/api/kling/text2video', async (req, res) => {
  try {
    const { prompt, duration, mode, aspect_ratio } = req.body;
    if (!prompt) return res.status(400).json({ error: '缺少 prompt 参数' });

    const result = await klingRequest(CONFIG.kling.accessKey, CONFIG.kling.secretKey, 'POST', '/v1/videos/text2video', {
      model_name: CONFIG.kling.videoModel,
      prompt,
      duration: duration || 5,
      mode: mode || 'std',
      aspect_ratio: aspect_ratio || '16:9',
    });

    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[/api/kling/text2video Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await klingRequest(CONFIG.kling.accessKey, CONFIG.kling.secretKey, 'GET', `/v1/videos/text2video/${taskId}`);
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[/api/kling/status Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/kling/balance', async (_req, res) => {
  try {
    const result = await klingRequest(CONFIG.kling.accessKey, CONFIG.kling.secretKey, 'GET', '/v1/account/balance');
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[/api/kling/balance Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ 健康检查 ============

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    kimi: CONFIG.kimi.apiKey ? 'configured' : 'missing',
    kling: CONFIG.kling.accessKey ? 'configured' : 'missing',
    replicate: CONFIG.replicate.apiKey ? 'configured' : 'missing',
    db: 'sqlite',
    auth: 'enabled',
    timestamp: new Date().toISOString(),
  });
});

// ============ Replicate API 代理 ============

app.post('/api/replicate/generate', async (req, res) => {
  try {
    const { type, prompt, image } = req.body;
    if (!prompt) return res.status(400).json({ error: '缺少 prompt 参数' });
    if (!CONFIG.replicate.apiKey) {
      return res.status(503).json({ error: 'Replicate API Key 未配置' });
    }

    let input;
    if (type === 'image') {
      input = {
        prompt,
        num_outputs: 1,
        aspect_ratio: '16:9',
        output_format: 'png',
        output_quality: 90,
      };
      const result = await replicateRequest('POST', `/models/${CONFIG.replicate.imageModel}/predictions`, { input });
      return res.status(result.status).json({
        ...result.data,
        provider: 'replicate',
        type: 'image',
      });
    } else {
      // Video: use stable-video-diffusion (img2vid) — needs an initial image
      input = {
        cond_aug: 0.02,
        decoding_t: 7,
        input_image: image || null,
        video_length: '14_frames_with_svd_xt',
        sizing_strategy: 'maintain_aspect_ratio',
        frames_per_second: 6,
        motion_bucket_id: 127,
      };
      if (!image) {
        // Fallback: generate image first, then video
        const imgResult = await replicateRequest('POST', `/models/${CONFIG.replicate.imageModel}/predictions`, {
          input: { prompt, num_outputs: 1, aspect_ratio: '16:9', output_format: 'png' },
        });
        return res.status(imgResult.status).json({
          ...imgResult.data,
          provider: 'replicate',
          type: 'image',
          note: 'Replicate暂不支持文生视频，已生成初始图像。后续可上传此图做图生视频。',
        });
      }
      const result = await replicateRequest('POST', `/models/${CONFIG.replicate.videoModel}/predictions`, { input });
      return res.status(result.status).json({
        ...result.data,
        provider: 'replicate',
        type: 'video',
      });
    }
  } catch (err) {
    console.error('[/api/replicate/generate Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/replicate/task', async (req, res) => {
  try {
    const { predictionId } = req.query;
    if (!predictionId) return res.status(400).json({ error: '缺少 predictionId 参数' });
    if (!CONFIG.replicate.apiKey) {
      return res.status(503).json({ error: 'Replicate API Key 未配置' });
    }

    const result = await replicateRequest('GET', `/predictions/${predictionId}`);
    // Normalize to match kling task format
    const status = result.data.status; // 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
    let task_status = status;
    if (status === 'succeeded') task_status = 'succeed';
    if (status === 'failed') task_status = 'fail';

    const task_result = {};
    if (status === 'succeeded' && result.data.output) {
      // Replicate output is usually an array of URLs or a single URL
      const output = result.data.output;
      if (Array.isArray(output)) {
        task_result.images = output.map(url => ({ url }));
      } else if (typeof output === 'string') {
        task_result.images = [{ url: output }];
      } else {
        task_result.images = [{ url: output }];
      }
    }

    res.status(result.status).json({
      data: {
        task_id: predictionId,
        task_status,
        task_result,
        provider: 'replicate',
      },
    });
  } catch (err) {
    console.error('[/api/replicate/task Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ 统一生成接口（自动降级） ============

app.post('/api/generate', async (req, res) => {
  try {
    const { type, prompt, provider, image } = req.body;
    if (!prompt) return res.status(400).json({ error: '缺少 prompt 参数' });

    const useProvider = provider || 'auto';

    // Auto: try Kling first, fallback to Replicate
    if (useProvider === 'auto') {
      if (CONFIG.kling.accessKey) {
        // Forward to kling/generate
        req.body.accessKey = CONFIG.kling.accessKey;
        req.body.secretKey = CONFIG.kling.secretKey;
        // Re-route internally
        let result;
        if (type === 'image') {
          result = await klingRequest(CONFIG.kling.accessKey, CONFIG.kling.secretKey, 'POST', '/v1/images/generations', {
            model: CONFIG.kling.imageModel,
            prompt,
            n: 1,
          });
        } else {
          result = await klingRequest(CONFIG.kling.accessKey, CONFIG.kling.secretKey, 'POST', '/v1/videos/text2video', {
            model_name: CONFIG.kling.videoModel,
            prompt,
            duration: 5,
            mode: 'std',
            aspect_ratio: '16:9',
          });
        }
        if (result.ok) {
          return res.json({ ...result.data, provider: 'kling' });
        }
        console.log('[auto] Kling failed, falling back to Replicate:', result.status);
      }

      // Fallback to Replicate
      if (CONFIG.replicate.apiKey) {
        let input;
        if (type === 'image') {
          input = { prompt, num_outputs: 1, aspect_ratio: '16:9', output_format: 'png', output_quality: 90 };
        } else {
          if (image) {
            input = { cond_aug: 0.02, decoding_t: 7, input_image: image, video_length: '14_frames_with_svd_xt', sizing_strategy: 'maintain_aspect_ratio', frames_per_second: 6, motion_bucket_id: 127 };
          } else {
            input = { prompt, num_outputs: 1, aspect_ratio: '16:9', output_format: 'png' };
          }
        }
        const model = type === 'image' ? CONFIG.replicate.imageModel : CONFIG.replicate.videoModel;
        const result = await replicateRequest('POST', `/models/${model}/predictions`, { input });

        // Transform to match kling format
        return res.json({
          code: 0,
          data: {
            task_id: result.data.id,
            task_status: result.data.status,
            provider: 'replicate',
            type,
          },
          message: result.ok ? 'success' : (result.data.error || '生成排队中'),
        });
      }

      return res.status(503).json({ error: '无可用生成服务（可灵和Replicate均未配置）' });
    }

    // Explicit provider choice
    if (useProvider === 'kling') {
      req.url = '/api/kling/generate';
      return app._router.handle(req, res, () => {
        res.status(500).json({ error: '路由错误' });
      });
    }
    if (useProvider === 'replicate') {
      req.url = '/api/replicate/generate';
      return app._router.handle(req, res, () => {
        res.status(500).json({ error: '路由错误' });
      });
    }

    res.status(400).json({ error: `不支持的 provider: ${useProvider}` });
  } catch (err) {
    console.error('[/api/generate Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/generate/task', async (req, res) => {
  try {
    const { taskId, type, provider } = req.query;
    if (!taskId) return res.status(400).json({ error: '缺少 taskId 参数' });

    // Auto-detect provider from taskId prefix or parameter
    if (provider === 'replicate' || (!provider && taskId && !taskId.startsWith('kl_'))) {
      const result = await replicateRequest('GET', `/predictions/${taskId}`);
      const status = result.data.status;
      let task_status = status;
      if (status === 'succeeded') task_status = 'succeed';
      if (status === 'failed') task_status = 'fail';

      const task_result = {};
      if (status === 'succeeded' && result.data.output) {
        const output = result.data.output;
        if (Array.isArray(output)) {
          task_result.images = output.map(url => ({ url }));
        } else if (typeof output === 'string') {
          task_result.images = [{ url: output }];
        }
      }

      return res.json({
        code: 0,
        data: { task_id: taskId, task_status, task_result, provider: 'replicate' },
      });
    }

    // Default to Kling
    const path = type === 'image'
      ? `/v1/images/generations/${taskId}`
      : `/v1/videos/text2video/${taskId}`;
    const result = await klingRequest(CONFIG.kling.accessKey, CONFIG.kling.secretKey, 'GET', path);
    res.status(result.status).json({
      code: 0,
      data: { ...result.data.data, provider: 'kling' },
    });
  } catch (err) {
    console.error('[/api/generate/task Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ 启动服务 ============

const PORT = process.env.API_PORT || 3001;
createServer(app).listen(PORT, () => {
  const warnings = [];
  if (!CONFIG.kimi.apiKey) warnings.push('⚠️ KIMI_API_KEY 未设置');
  if (!CONFIG.kling.accessKey) warnings.push('⚠️ KLING_ACCESS_KEY 未设置');
  if (!CONFIG.replicate.apiKey) warnings.push('⚠️ REPLICATE_API_KEY 未设置');

  console.log(`\n🔌 ccav.com API 服务已启动`);
  console.log(`   端口: ${PORT}`);
  console.log(`   模型: 可灵 ${CONFIG.kling.imageModel} / ${CONFIG.kling.videoModel}`);
  console.log(`   端点:`);
  console.log(`     POST /api/auth/send-code     - 发送短信验证码`);
  console.log(`     POST /api/auth/register      - 用户注册`);
  console.log(`     POST /api/auth/login         - 用户登录`);
  console.log(`     GET  /api/auth/me            - 当前用户信息`);
  console.log(`     POST /api/optimize           - Kimi 提示词优化`);
  console.log(`     POST /api/kimi/chat         - Kimi 对话`);
  console.log(`   POST /api/generate          - 统一生成（自动降级）`);
  console.log(`   GET  /api/generate/task     - 统一查询`);
  console.log(`   POST /api/kling/generate    - 可灵 文生图/视频`);
  console.log(`   GET  /api/kling/task        - 可灵 查询任务`);
  console.log(`   POST /api/replicate/generate- Replicate 文生图`);
  console.log(`   GET  /api/replicate/task    - Replicate 查询`);
  console.log(`     POST /api/kling/text2video  - 可灵 文生视频(兼容)`);
  console.log(`     GET  /api/kling/status/:id  - 可灵 查询任务(兼容)`);
  console.log(`     GET  /api/kling/balance     - 可灵 余额查询`);
  console.log(`     GET  /api/health            - 健康检查\n`);

  if (warnings.length) warnings.forEach(w => console.log(w));
});
