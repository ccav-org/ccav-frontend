import { Router } from 'express';

const router = Router();

// === 内存存储（重启即重置，上线换数据库） ===
const commentsByLesson = new Map(); // lessonKey -> Comment[]

function getStore(key) {
  if (!commentsByLesson.has(key)) {
    commentsByLesson.set(key, []);
  }
  return commentsByLesson.get(key);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// GET /api/comments/:lessonKey — 获取某节课的评论
router.get('/:lessonKey', (req, res) => {
  const { lessonKey } = req.params;
  const comments = getStore(lessonKey);
  // 按时间倒序
  comments.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  res.json({ code: 0, data: comments, total: comments.length });
});

// POST /api/comments/:lessonKey — 发表评论
router.post('/:lessonKey', (req, res) => {
  const { lessonKey } = req.params;
  const { author, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ code: 1, message: '评论内容不能为空' });
  }

  const comment = {
    id: generateId(),
    author: (author || '').trim() || '匿名学员',
    content: content.trim(),
    time: new Date().toISOString(),
    likes: 0,
  };

  const store = getStore(lessonKey);
  store.push(comment);

  res.json({ code: 0, data: comment, message: '发表成功' });
});

// POST /api/comments/:lessonKey/like — 点赞评论
router.post('/:lessonKey/like', (req, res) => {
  const { lessonKey } = req.params;
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({ code: 1, message: '缺少commentId' });
  }

  const store = getStore(lessonKey);
  const comment = store.find(c => c.id === commentId);
  if (!comment) {
    return res.status(404).json({ code: 1, message: '评论不存在' });
  }

  comment.likes += 1;
  res.json({ code: 0, data: { likes: comment.likes }, message: '点赞成功' });
});

export default router;
