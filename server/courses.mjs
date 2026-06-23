/**
 * ccav.com Phase 2 — 课程 API 路由
 * 课程目录 + 章节树 + 课时内容 + 学习进度
 */
import { Router } from 'express';
import db from './db.js';
import { authMiddleware } from './auth.js';
import './models.mjs';   // 确保表已建

const router = Router();

// ============ 课程目录 ============

// GET /api/courses — 课程列表
router.get('/', (req, res) => {
  try {
    const { category, level } = req.query;
    let sql = 'SELECT * FROM courses WHERE status = ?';
    const params = ['published'];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (level) {
      sql += ' AND level = ?';
      params.push(level);
    }

    sql += ' ORDER BY sort_order ASC, id ASC';
    const courses = db.prepare(sql).all(...params);
    res.json({ courses });
  } catch (err) {
    console.error('[courses/list Error]', err.message);
    res.status(500).json({ error: '获取课程列表失败' });
  }
});

// ============ 学习进度（必须在 /:slug 前注册）============

// GET /api/courses/progress — 用户学习进度总览
router.get('/progress', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;

    // 按课程统计进度
    const progress = db.prepare(`
      SELECT 
        up.course_id,
        c.title as course_title,
        c.slug as course_slug,
        COUNT(CASE WHEN up.status = 'completed' THEN 1 END) as completed_lessons,
        COUNT(*) as total_lessons,
        ROUND(CAST(COUNT(CASE WHEN up.status = 'completed' THEN 1 END) AS REAL) / GREATEST(COUNT(*), 1) * 100) as percent
      FROM user_progress up
      JOIN courses c ON up.course_id = c.id
      WHERE up.user_id = ?
      GROUP BY up.course_id
      ORDER BY up.updated_at DESC
    `).all(userId);

    res.json({ progress });
  } catch (err) {
    console.error('[progress/list Error]', err.message);
    res.status(500).json({ error: '获取进度失败' });
  }
});

// POST /api/courses/progress/update — 更新课时进度
router.post('/progress/update', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id, lesson_id, status, progress_percent, last_position } = req.body;

    if (!course_id || !lesson_id) {
      return res.status(400).json({ error: 'course_id和lesson_id必填' });
    }

    const existing = db.prepare(
      'SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?'
    ).get(userId, lesson_id);

    if (existing) {
      db.prepare(`
        UPDATE user_progress 
        SET status = COALESCE(?, status),
            progress_percent = COALESCE(?, progress_percent),
            last_position = COALESCE(?, last_position),
            completed_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE completed_at END,
            updated_at = datetime('now')
        WHERE id = ?
      `).run(status || null, progress_percent ?? null, last_position ?? null, status || null, existing.id);
    } else {
      db.prepare(`
        INSERT INTO user_progress (user_id, course_id, lesson_id, status, progress_percent, last_position)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, course_id, lesson_id, status || 'in_progress', progress_percent || 0, last_position || 0);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[progress/update Error]', err.message);
    res.status(500).json({ error: '更新进度失败' });
  }
});

// POST /api/courses/quiz/submit — 提交测验结果（前端已自判分，后端只存储）
router.post('/quiz/submit', authMiddleware, (req, res) => {
  try {
    const { courseId, lessonId, score, total } = req.body;
    const userId = req.user.id;

    if (!courseId || lessonId === undefined || score === undefined || total === undefined) {
      return res.status(400).json({ error: '缺少必要参数：courseId, lessonId, score, total' });
    }

    // 查用户已有该lesson的测验记录（取最近一次）
    const existing = db.prepare(`
      SELECT id, score FROM quiz_results
      WHERE user_id = ? AND quiz_id = (
        SELECT id FROM quizzes WHERE lesson_id = ? LIMIT 1
      )
      ORDER BY created_at DESC LIMIT 1
    `).get(userId, lessonId);

    // 如果没有课关联的quiz记录，走直接lesson_id关联路径
    // quiz_results 表是 quiz_id 关联，但为了简化前端对接，直接用 lessonId 当 quiz_id
    // 实际上是每节课只有一个测验
    const quizId = lessonId; // 简化：前端传的lessonId当quizId用

    const previousBest = existing ? Math.max(existing.score, score) : score;

    // 插入新记录
    db.prepare(`
      INSERT INTO quiz_results (user_id, quiz_id, score, passed, answers, attempt_number)
      VALUES (?, ?, ?, ?, ?, (
        SELECT COALESCE(MAX(attempt_number), 0) + 1 FROM quiz_results
        WHERE user_id = ? AND quiz_id = ?
      ))
    `).run(
      userId,
      quizId,
      score,
      score >= Math.ceil(total * 0.6) ? 1 : 0,
      JSON.stringify({ score, total }),
      userId,
      quizId
    );

    // 如果通过，自动完成该课进度
    if (score >= Math.ceil(total * 0.6)) {
      const existingProgress = db.prepare(
        'SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?'
      ).get(userId, lessonId);

      if (existingProgress) {
        db.prepare(`
          UPDATE user_progress SET status = 'completed', completed_at = datetime('now'), updated_at = datetime('now')
          WHERE id = ?
        `).run(existingProgress.id);
      } else {
        db.prepare(`
          INSERT INTO user_progress (user_id, course_id, lesson_id, status, completed_at)
          VALUES (?, ?, ?, 'completed', datetime('now'))
        `).run(userId, courseId || '', lessonId);
      }
    }

    res.json({
      success: true,
      score,
      total,
      passed: score >= Math.ceil(total * 0.6),
      previousBest: existing ? existing.score : null,
    });
  } catch (err) {
    console.error('[quiz/submit Error]', err.message);
    res.status(500).json({ error: '提交测验失败' });
  }
});

// GET /api/courses/quiz/results — 用户所有测验历史
router.get('/quiz/results', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;

    const results = db.prepare(`
      SELECT
        qr.id,
        qr.quiz_id as lessonId,
        qr.score,
        qr.passed,
        qr.attempt_number as attemptNumber,
        qr.created_at as date
      FROM quiz_results qr
      WHERE qr.user_id = ?
      ORDER BY qr.created_at DESC
    `).all(userId);

    res.json({ results });
  } catch (err) {
    console.error('[quiz/results Error]', err.message);
    res.status(500).json({ error: '获取测验记录失败' });
  }
});

// GET /api/courses/:slug — 单课程详情（含模块树）
router.get('/:slug', (req, res) => {
  try {
    const course = db.prepare('SELECT * FROM courses WHERE slug = ? AND status = ?')
      .get(req.params.slug, 'published');

    if (!course) {
      return res.status(404).json({ error: '课程不存在' });
    }

    // 获取模块 + 课时
    const modules = db.prepare(
      'SELECT * FROM modules WHERE course_id = ? ORDER BY sort_order ASC'
    ).all(course.id);

    for (const mod of modules) {
      mod.lessons = db.prepare(
        'SELECT id, title, content_type, video_url, duration_minutes, sort_order, is_free FROM lessons WHERE module_id = ? ORDER BY sort_order ASC'
      ).all(mod.id);
    }

    course.modules = modules;
    res.json({ course });
  } catch (err) {
    console.error('[courses/detail Error]', err.message);
    res.status(500).json({ error: '获取课程详情失败' });
  }
});

// GET /api/courses/:slug/lessons/:lessonId — 课时内容
router.get('/:slug/lessons/:lessonId', (req, res) => {
  try {
    const lesson = db.prepare(
      `SELECT l.*, m.title as module_title, c.title as course_title, c.slug as course_slug
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       JOIN courses c ON l.course_id = c.id
       WHERE l.id = ? AND c.slug = ?`
    ).get(req.params.lessonId, req.params.slug);

    if (!lesson) {
      return res.status(404).json({ error: '课时不存在' });
    }

    res.json({ lesson });
  } catch (err) {
    console.error('[courses/lesson Error]', err.message);
    res.status(500).json({ error: '获取课时内容失败' });
  }
});

// POST /api/courses — 创建课程（管理员用）
router.post('/', (req, res) => {
  try {
    const { slug, title, subtitle, description, category, level, price, sort_order } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug和title必填' });

    const result = db.prepare(
      `INSERT INTO courses (slug, title, subtitle, description, category, level, price, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(slug, title, subtitle || '', description || '', category || 'training', level || 'all', price || 0, sort_order || 0);

    res.status(201).json({ id: result.lastInsertRowid, slug });
  } catch (err) {
    console.error('[courses/create Error]', err.message);
    res.status(500).json({ error: '创建课程失败' });
  }

});

export default router;
