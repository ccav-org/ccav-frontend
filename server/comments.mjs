import { Router } from 'express';
import db from './db.js';
import './models.mjs'; // 确保 lesson_comments 表已建

const router = Router();

// GET /api/comments/:lessonKey — 获取某节课的评论（按时间降序）
router.get('/:lessonKey', (req, res) => {
  const { lessonKey } = req.params;
  const rows = db.prepare(
    `SELECT id, lesson_key, author, content, likes, created_at
     FROM lesson_comments
     WHERE lesson_key = ?
     ORDER BY created_at DESC`
  ).all(lessonKey);

  const data = rows.map(row => ({
    id: String(row.id),
    author: row.author,
    content: row.content,
    time: row.created_at.replace(' ', 'T') + 'Z',
    likes: row.likes,
  }));

  res.json({ code: 0, data, total: data.length });
});

// POST /api/comments/:lessonKey — 发表评论
router.post('/:lessonKey', (req, res) => {
  const { lessonKey } = req.params;
  const { author, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ code: 1, message: '评论内容不能为空' });
  }

  const displayAuthor = (author || '').trim() || '匿名学员';

  const stmt = db.prepare(
    `INSERT INTO lesson_comments (lesson_key, author, content)
     VALUES (?, ?, ?)`
  );
  const result = stmt.run(lessonKey, displayAuthor, content.trim());

  const row = db.prepare(
    'SELECT id, lesson_key, author, content, likes, created_at FROM lesson_comments WHERE id = ?'
  ).get(result.lastInsertRowid);

  const comment = {
    id: String(row.id),
    author: row.author,
    content: row.content,
    time: row.created_at.replace(' ', 'T') + 'Z',
    likes: row.likes,
  };

  res.json({ code: 0, data: comment, message: '发表成功' });
});

// POST /api/comments/:lessonKey/like — 点赞评论
router.post('/:lessonKey/like', (req, res) => {
  const { lessonKey } = req.params;
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({ code: 1, message: '缺少commentId' });
  }

  // 验证评论属于该 lesson
  const existing = db.prepare(
    'SELECT id FROM lesson_comments WHERE id = ? AND lesson_key = ?'
  ).get(Number(commentId), lessonKey);

  if (!existing) {
    return res.status(404).json({ code: 1, message: '评论不存在' });
  }

  db.prepare(
    'UPDATE lesson_comments SET likes = likes + 1 WHERE id = ?'
  ).run(Number(commentId));

  const updated = db.prepare(
    'SELECT likes FROM lesson_comments WHERE id = ?'
  ).get(Number(commentId));

  res.json({ code: 0, data: { likes: updated.likes }, message: '点赞成功' });
});

export default router;
