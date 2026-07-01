/**
 * ccav.com Phase 2 — 用户认证模块
 * 手机号注册/登录 + JWT + 短信验证码
 */
import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from './db.js';

const router = Router();

// JWT Secret — 必须通过环境变量设置
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('');
  console.error('❌ JWT_SECRET 环境变量未设置');
  console.error('   生产环境必须使用固定密钥，否则每次重启会导致所有已签发 token 失效。');
  console.error('   开发环境可用任意 32 字符以上字符串。');
  console.error('   设置方式: JWT_SECRET=your-secret-here node server.mjs');
  console.error('');
  process.exit(1);
}
const JWT_EXPIRES = '7d';

// ============ 工具函数 ============

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'ccav-salt-2026').digest('hex');
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6位数字
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// ============ Auth 中间件 ============

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }
  try {
    const token = authHeader.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

// ============ API 路由 ============

// POST /api/auth/send-code — 发送短信验证码
router.post('/send-code', (req, res) => {
  try {
    const { phone, country_code } = req.body;
    if (!phone) return res.status(400).json({ error: '请输入手机号' });

    // 频率限制：同手机号60秒内只能发一次
    const recent = db.prepare(
      "SELECT created_at FROM verify_codes WHERE phone = ? AND created_at > datetime('now', '-60 seconds')"
    ).get(phone);
    if (recent) {
      return res.status(429).json({ error: '验证码已发送，请60秒后再试' });
    }

    const code = generateCode();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5分钟有效

    db.prepare(
      'INSERT INTO verify_codes (phone, code, expires_at) VALUES (?, ?, ?)'
    ).run(phone, code, expires_at);

    // TODO: 接入腾讯云 SMS API 发送真实短信
    // 开发阶段：验证码通过 API 响应返回（生产环境删除此字段）
    console.log(`[SMS] 验证码已生成 → ${phone}: ${code}`);

    res.json({
      success: true,
      message: '验证码已发送',
      expires_in: 300,
      // ⚠️ 开发环境：返回验证码便于测试，生产环境删除此行
      _dev_code: code,
    });
  } catch (err) {
    console.error('[send-code Error]', err.message);
    res.status(500).json({ error: '发送失败' });
  }
});

// POST /api/auth/register — 手机号注册
router.post('/register', (req, res) => {
  try {
    const { phone, password, code, country_code, display_name } = req.body;
    if (!phone) return res.status(400).json({ error: '请输入手机号' });
    if (!password || password.length < 6) return res.status(400).json({ error: '密码至少6位' });

    // 验证码校验
    const validCode = db.prepare(
      "SELECT * FROM verify_codes WHERE phone = ? AND code = ? AND used = 0 AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1"
    ).get(phone, code);

    if (!validCode) {
      return res.status(400).json({ error: '验证码错误或已过期' });
    }

    // 标记验证码已使用
    db.prepare('UPDATE verify_codes SET used = 1 WHERE id = ?').run(validCode.id);

    // 检查手机号是否已注册
    const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existing) {
      return res.status(409).json({ error: '该手机号已注册，请直接登录' });
    }

    // 创建用户
    const password_hash = hashPassword(password);
    const result = db.prepare(
      'INSERT INTO users (phone, country_code, password_hash, display_name, credits) VALUES (?, ?, ?, ?, 100)'
    ).run(phone, country_code || '+86', password_hash, display_name || `用户${phone.slice(-4)}`);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        country_code: user.country_code,
        display_name: user.display_name,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error('[register Error]', err.message);
    res.status(500).json({ error: '注册失败' });
  }
});

// POST /api/auth/login — 手机号登录
router.post('/login', (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: '请输入手机号和密码' });
    }

    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (!user) {
      return res.status(401).json({ error: '手机号未注册' });
    }

    if (user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: '密码错误' });
    }

    // 更新最后登录时间
    db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        country_code: user.country_code,
        display_name: user.display_name,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error('[login Error]', err.message);
    res.status(500).json({ error: '登录失败' });
  }
});

// GET /api/auth/me — 获取当前用户信息
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, phone, country_code, email, display_name, avatar_url, role, credits, created_at, last_login_at FROM users WHERE id = ?'
    ).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ user });
  } catch (err) {
    console.error('[me Error]', err.message);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// POST /api/auth/update-profile — 更新用户信息
router.post('/update-profile', authMiddleware, (req, res) => {
  try {
    const { display_name, email } = req.body;
    const updates = [];
    const params = [];

    if (display_name) { updates.push('display_name = ?'); params.push(display_name); }
    if (email) { updates.push('email = ?'); params.push(email); }

    if (updates.length === 0) {
      return res.status(400).json({ error: '无更新内容' });
    }

    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const user = db.prepare(
      'SELECT id, phone, country_code, email, display_name, avatar_url, role, credits FROM users WHERE id = ?'
    ).get(req.user.id);

    res.json({ success: true, user });
  } catch (err) {
    console.error('[update-profile Error]', err.message);
    res.status(500).json({ error: '更新失败' });
  }
});

export default router;
