/**
 * ccav.com 作品墙 API 路由
 * GET   /api/gallery/filters       — 获取筛选选项（场景+风格）
 * GET   /api/gallery              — 获取作品列表（支持 ?tag= 过滤，?page&pageSize 分页）
 * GET   /api/gallery/:id          — 获取单个作品详情（同时增加浏览量）
 * POST  /api/gallery              — 发布作品（需登录）
 * POST  /api/gallery/:id/like    — 点赞/取消点赞（需登录，与鄙视互斥）
 * POST  /api/gallery/:id/dislike — 鄙视/取消鄙视（需登录，与点赞互斥）
 * POST  /api/gallery/:id/view    — 增加浏览量
 * POST  /api/gallery/:id/comments — 提交评论（需登录）
 * GET   /api/gallery/:id/comments — 获取评论列表
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from './db.js';
import './models.mjs';          // 确保 gallery 扩展表已创建
import { authMiddleware } from './auth.js';

const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();

// 辅助：统一格式化作品行（含用户的态度和解锁状态）
function formatGalleryItem(row, userId = null) {
  let liked = false;
  let disliked = false;
  let unlocked = false;

  if (userId) {
    const likeRow = db.prepare('SELECT id FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').get(row.id, userId);
    if (likeRow) liked = true;
    const dislikeRow = db.prepare('SELECT id FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').get(row.id, userId);
    if (dislikeRow) disliked = true;
    const unlockRow = db.prepare('SELECT id FROM gallery_unlocks WHERE gallery_id = ? AND user_id = ?').get(row.id, userId);
    if (unlockRow) unlocked = true;
  }

  // 取评论数
  const commentsRow = db.prepare('SELECT COUNT(*) as cnt FROM gallery_comments WHERE gallery_id = ?').get(row.id);

  // tech_type 字段：根据 category 映射为媒体类型（前端筛选按钮值）
  // 前端 TECH_TYPES = [{value:'image'},{value:'video'},{value:'music'},{value:'vtuber'}]
  const techTypeMap = {
    'text-to-image': 'image',
    'image-to-image': 'image',
    'text-to-video': 'video',
    'image-to-video': 'video',
    'song-video': 'music',
    'video-to-video': 'video',
  };
  const tech_type = techTypeMap[row.category] || 'image';

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    media_type: row.media_type || 'image',
    tech_type,
    image_url: row.image_url,
    video_url: row.video_url || undefined,
    user_id: row.user_id || undefined,
    author: row.author,
    avatar_url: row.avatar_url,
    likes_count: row.likes_count ?? 0,
    dislikes_count: row.dislikes_count ?? 0,
    views_count: row.views_count ?? 0,
    liked,
    disliked,
    category: row.category || undefined,
    tags: JSON.parse(row.tags || '[]'),
    course_name: row.course_name || undefined,
    course_id: row.course_id || undefined,
    // Phase 2: 6 维字段
    creation_type: row.creation_type || undefined,
    application_scenes: JSON.parse(row.application_scenes || '[]'),
    tool_chain: JSON.parse(row.tool_chain || '[]'),
    art_style: row.art_style || undefined,
    secondary_tags: JSON.parse(row.secondary_tags || '[]'),
    difficulty: row.difficulty || undefined,
    created_at: row.created_at,
    comments_count: commentsRow.cnt,
    // Phase C: 积分锁
    unlock_cost: row.unlock_cost ?? 0,
    unlocked,
  };
}

// ============ GET /api/gallery/filters — 获取筛选选项（6 维）============
router.get('/filters', (req, res) => {
  try {
    const scenes    = db.prepare(`SELECT DISTINCT scene FROM gallery WHERE scene IS NOT NULL AND scene != '' ORDER BY scene`).all().map(r => r.scene);
    const styles    = db.prepare(`SELECT DISTINCT style FROM gallery WHERE style IS NOT NULL AND style != '' ORDER BY style`).all().map(r => r.style);

    // Phase 2: 6 维筛选选项
    const creationTypes = db.prepare(`SELECT DISTINCT creation_type FROM gallery WHERE creation_type IS NOT NULL AND creation_type != '' ORDER BY creation_type`).all().map(r => r.creation_type);
    const artStyles     = db.prepare(`SELECT DISTINCT art_style FROM gallery WHERE art_style IS NOT NULL AND art_style != '' ORDER BY art_style`).all().map(r => r.art_style);
    const difficulties  = db.prepare(`SELECT DISTINCT difficulty FROM gallery WHERE difficulty IS NOT NULL AND difficulty != '' ORDER BY difficulty`).all().map(r => r.difficulty);

    // 枚举定义（即使数据库没数据也返回可选值）
    const creationTypeOptions = ['ai-image', 'ai-video', 'ai-music'];
    const artStyleOptions     = ['写实胶片', '国潮', '国风水墨', '抽象概念', '科幻赛博', '极简现代', '手绘插画'];
    const difficultyOptions   = ['M1', 'M2', 'M3', 'M4', 'M5'];

    // 动态取应用场景和工具链（JSON 反序列化后去重）
    const sceneRows = db.prepare(`SELECT application_scenes FROM gallery WHERE application_scenes IS NOT NULL AND application_scenes != '[]'`).all();
    const toolRows  = db.prepare(`SELECT tool_chain FROM gallery WHERE tool_chain IS NOT NULL AND tool_chain != '[]'`).all();
    const tagRows   = db.prepare(`SELECT secondary_tags FROM gallery WHERE secondary_tags IS NOT NULL AND secondary_tags != '[]'`).all();

    const allScenes = new Set();
    const allTools  = new Set();
    const allTags   = new Set();
    for (const r of sceneRows) { try { for (const s of JSON.parse(r.application_scenes)) allScenes.add(s); } catch {} }
    for (const r of toolRows)  { try { for (const t of JSON.parse(r.tool_chain)) allTools.add(t); } catch {} }
    for (const r of tagRows)   { try { for (const t of JSON.parse(r.secondary_tags)) allTags.add(t); } catch {} }

    res.json({
      code: 0,
      data: {
        // 旧字段（兼容）
        scenes,
        styles,
        // 新 6 维
        creation_types: creationTypeOptions,
        application_scenes: [...allScenes].sort(),
        tool_chains: [...allTools].sort(),
        art_styles: artStyleOptions,
        secondary_tags: [...allTags].sort(),
        difficulties: difficultyOptions,
      }
    });
  } catch (err) {
    console.error('[GET /api/gallery/filters Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ GET /api/gallery — 获取作品列表（支持分类+标签+6维筛选）============
router.get('/', (req, res) => {
  try {
    const { tag, category, techType, page = 1, pageSize = 50,
            scene, style,
            creation_type, application_scenes, tool_chain, art_style, secondary_tags, difficulty } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    // techType → 对应的 category 集合
    const techTypeCategoryMap = {
      'image': ['text-to-image', 'image-to-image'],
      'video': ['text-to-video', 'image-to-video', 'video-to-video'],
      'music': ['song-video'],
    };

    const conditions = [];
    const params = [];

    if (tag) {
      conditions.push('tags LIKE ?');
      params.push(`%${tag}%`);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    // Phase 2: 6 维筛选
    if (scene) {
      conditions.push('scene = ?');
      params.push(scene);
    }
    if (style) {
      conditions.push('style = ?');
      params.push(style);
    }
    if (creation_type) {
      conditions.push('creation_type = ?');
      params.push(creation_type);
    }
    if (application_scenes) {
      conditions.push('application_scenes LIKE ?');
      params.push(`%${application_scenes}%`);
    }
    if (tool_chain) {
      conditions.push('tool_chain LIKE ?');
      params.push(`%${tool_chain}%`);
    }
    if (art_style) {
      conditions.push('art_style = ?');
      params.push(art_style);
    }
    if (secondary_tags) {
      conditions.push('secondary_tags LIKE ?');
      params.push(`%${secondary_tags}%`);
    }
    if (difficulty) {
      conditions.push('difficulty = ?');
      params.push(difficulty);
    }
    if (techType) {
      const cats = techTypeCategoryMap[String(techType).toLowerCase()];
      if (cats && cats.length > 0) {
        conditions.push(`category IN (${cats.map(() => '?').join(',')})`);
        params.push(...cats);
      }
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const items = db.prepare(`
      SELECT * FROM gallery
      ${where}
      ORDER BY sort_order ASC, id DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    const total = db.prepare(
      `SELECT COUNT(*) as cnt FROM gallery ${where}`
    ).get(...params).cnt;

    const formatted = items.map(i => formatGalleryItem(i, null));

    res.json({ code: 0, data: formatted, total, page: Number(page) });
  } catch (err) {
    console.error('[GET /api/gallery Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ GET /api/gallery/:id — 获取单个作品详情（不增加浏览量） ============
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });

    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });

    // 尝试从 auth header 获取 userId（可选，用于返回解锁状态）
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      }
    } catch { /* 未登录或 token 过期，userId 保持 null */ }

    res.json({ code: 0, data: formatGalleryItem(item, userId) });
  } catch (err) {
    console.error('[GET /api/gallery/:id Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ POST /api/gallery/:id/view — 增加浏览量 ============
router.post('/:id/view', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });

    const item = db.prepare('SELECT id FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });

    db.prepare('UPDATE gallery SET views_count = views_count + 1 WHERE id = ?').run(id);

    const updated = db.prepare('SELECT views_count FROM gallery WHERE id = ?').get(id);
    res.json({ code: 0, data: { views_count: updated.views_count } });
  } catch (err) {
    console.error('[POST /api/gallery/view Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ POST /api/gallery/:id/like — 点赞（与鄙视互斥） ============
router.post('/:id/like', authMiddleware, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });

    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });

    const userId = req.user.id;

    // 查是否已点赞
    const liked = db.prepare('SELECT id FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').get(id, userId);

    if (liked) {
      // 取消点赞
      db.prepare('DELETE FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').run(id, userId);
      db.prepare('UPDATE gallery SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(id);
    } else {
      // 先删除鄙视（互斥）
      const disliked = db.prepare('SELECT id FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').get(id, userId);
      if (disliked) {
        db.prepare('DELETE FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').run(id, userId);
        db.prepare('UPDATE gallery SET dislikes_count = MAX(0, dislikes_count - 1) WHERE id = ?').run(id);
      }
      // 点赞
      db.prepare('INSERT INTO gallery_likes (gallery_id, user_id) VALUES (?, ?)').run(id, userId);
      db.prepare('UPDATE gallery SET likes_count = likes_count + 1 WHERE id = ?').run(id);
    }

    const updated = db.prepare('SELECT likes_count, dislikes_count FROM gallery WHERE id = ?').get(id);

    // 查最终态度
    const finalLiked = !!db.prepare('SELECT id FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').get(id, userId);
    const finalDisliked = !!db.prepare('SELECT id FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').get(id, userId);

    res.json({
      code: 0,
      data: {
        liked: finalLiked,
        disliked: finalDisliked,
        likes_count: updated.likes_count,
        dislikes_count: updated.dislikes_count,
      },
    });
  } catch (err) {
    console.error('[POST /api/gallery/like Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ POST /api/gallery/:id/dislike — 鄙视（与点赞互斥） ============
router.post('/:id/dislike', authMiddleware, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });

    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });

    const userId = req.user.id;

    // 查是否已鄙视
    const disliked = db.prepare('SELECT id FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').get(id, userId);

    if (disliked) {
      // 取消鄙视
      db.prepare('DELETE FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').run(id, userId);
      db.prepare('UPDATE gallery SET dislikes_count = MAX(0, dislikes_count - 1) WHERE id = ?').run(id);
    } else {
      // 先删除点赞（互斥）
      const liked = db.prepare('SELECT id FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').get(id, userId);
      if (liked) {
        db.prepare('DELETE FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').run(id, userId);
        db.prepare('UPDATE gallery SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(id);
      }
      // 鄙视
      db.prepare('INSERT INTO gallery_dislikes (gallery_id, user_id) VALUES (?, ?)').run(id, userId);
      db.prepare('UPDATE gallery SET dislikes_count = dislikes_count + 1 WHERE id = ?').run(id);
    }

    const updated = db.prepare('SELECT likes_count, dislikes_count FROM gallery WHERE id = ?').get(id);

    // 查最终态度
    const finalLiked = !!db.prepare('SELECT id FROM gallery_likes WHERE gallery_id = ? AND user_id = ?').get(id, userId);
    const finalDisliked = !!db.prepare('SELECT id FROM gallery_dislikes WHERE gallery_id = ? AND user_id = ?').get(id, userId);

    res.json({
      code: 0,
      data: {
        liked: finalLiked,
        disliked: finalDisliked,
        likes_count: updated.likes_count,
        dislikes_count: updated.dislikes_count,
      },
    });
  } catch (err) {
    console.error('[POST /api/gallery/dislike Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ POST /api/gallery/:id/comments — 提交评论（需登录） ============
router.post('/:id/comments', authMiddleware, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ code: 1, error: '评论内容不能为空' });
    }

    const item = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });

    const user = req.user;
    const userInfo = db.prepare('SELECT id, display_name, avatar_url FROM users WHERE id = ?').get(user.id);
    const authorName = userInfo?.display_name || `用户${user.phone?.slice(-4)}`;

    db.prepare(`
      INSERT INTO gallery_comments (gallery_id, user_id, author, author_avatar, content)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id,
      user.id,
      authorName,
      userInfo?.avatar_url || null,
      content.trim(),
    );

    const commentsCount = db.prepare('SELECT COUNT(*) as cnt FROM gallery_comments WHERE gallery_id = ?').get(id);
    res.json({ code: 0, data: { success: true, comments_count: commentsCount.cnt } });
  } catch (err) {
    console.error('[POST /api/gallery/comments Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ GET /api/gallery/:id/comments — 获取评论列表 ============
router.get('/:id/comments', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });

    const item = db.prepare('SELECT id FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });

    const { page = 1, pageSize = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const comments = db.prepare(`
      SELECT * FROM gallery_comments
      WHERE gallery_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(id, limit, offset);

    const total = db.prepare(
      'SELECT COUNT(*) as cnt FROM gallery_comments WHERE gallery_id = ?'
    ).get(id).cnt;

    res.json({ code: 0, data: comments, total, page: Number(page) });
  } catch (err) {
    console.error('[GET /api/gallery/comments Error]', err.message);
    res.status(500).json({ code: 1, error: err.message });
  }
});

// ============ POST /api/gallery/:id/unlock — 解锁作品（消耗积分，需登录） ============
router.post('/:id/unlock', authMiddleware, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ code: 1, error: '缺少作品 ID' });
    const userId = req.user.id;

    // 查作品
    const item = db.prepare('SELECT id, unlock_cost FROM gallery WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ code: 1, error: '作品不存在' });
    const cost = item.unlock_cost || 0;
    if (cost <= 0) {
      return res.json({ code: 0, data: { success: false, message: '该作品无需解锁' } });
    }

    // 幂等检查：已解锁则直接返回 success
    const existing = db.prepare(
      'SELECT id FROM gallery_unlocks WHERE gallery_id = ? AND user_id = ?'
    ).get(id, userId);
    if (existing) {
      return res.json({ code: 0, data: { success: true, already_unlocked: true, message: '已解锁' } });
    }

    // 积分检查
    const user = db.prepare('SELECT credits FROM users WHERE id = ?').get(userId);
    if (!user || user.credits < cost) {
      return res.json({
        code: 0,
        data: { success: false, message: `积分不足（当前 ${user?.credits ?? 0}，需要 ${cost}）` }
      });
    }

    // 事务：扣分 + 解锁记录
    const doUnlock = db.transaction(() => {
      db.prepare('UPDATE users SET credits = credits - ? WHERE id = ?').run(cost, userId);
      db.prepare(
        'INSERT INTO gallery_unlocks (gallery_id, user_id, cost) VALUES (?, ?, ?)'
      ).run(id, userId, cost);
    });
    doUnlock();

    res.json({ code: 0, data: { success: true, message: '解锁成功' } });
  } catch (err) {
    console.error('[POST /api/gallery/unlock Error]', err.message);
    // UNIQUE 约束冲突兜底（并发场景）
    if (err.message?.includes('UNIQUE constraint')) {
      return res.json({ code: 0, data: { success: true, already_unlocked: true, message: '已解锁' } });
    }
    res.status(500).json({ code: 1, error: err.message });
  }
});

export default router;
