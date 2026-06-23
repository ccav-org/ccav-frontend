/**
 * ccav.com Phase 2 — 数据库Schema扩展
 * 课程管理 + 学习进度 + 测验
 */
import db from './db.js';

// 扩展表结构
db.exec(`
  -- ============ 课程体系 ============
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,              -- URL友好标识: 'training', 'img-gen-master'...
    title TEXT NOT NULL,
    subtitle TEXT,                           -- 副标题
    description TEXT,
    cover_url TEXT,
    category TEXT DEFAULT 'training',        -- training, vivid, img-gen, video-gen, special
    level TEXT DEFAULT 'all',                -- beginner, intermediate, advanced, all
    duration_hours REAL DEFAULT 0,
    lesson_count INTEGER DEFAULT 0,
    student_count INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    price INTEGER DEFAULT 0,               -- 价格（分），0=免费
    status TEXT DEFAULT 'published' CHECK(status IN ('draft','published','archived')),
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- ============ 模块/章节 ============
  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL ,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    lesson_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ============ 课时 ============
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL ,
    course_id INTEGER NOT NULL ,
    title TEXT NOT NULL,
    subtitle TEXT,
    content_type TEXT DEFAULT 'markdown' CHECK(content_type IN ('markdown','video','quiz','lecture','live')),
    content TEXT,                            -- markdown 或 lecture JSON
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_free INTEGER DEFAULT 0,
    require_pass INTEGER DEFAULT 0,         -- 通过测验才解锁下一课
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ============ 测验 ============
  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL ,
    course_id INTEGER NOT NULL ,
    title TEXT,
    questions TEXT,                          -- JSON: [{type:'choice',question:'',options:[],answer:''}]
    pass_score INTEGER DEFAULT 60,
    max_attempts INTEGER DEFAULT 3,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ============ 学习进度 ============
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL ,
    course_id INTEGER NOT NULL ,
    lesson_id INTEGER NOT NULL ,
    status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started','in_progress','completed')),
    progress_percent REAL DEFAULT 0,        -- 视频播放百分比
    last_position INTEGER DEFAULT 0,        -- 秒
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, lesson_id)
  );

  -- ============ 测验结果 ============
  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL ,
    quiz_id INTEGER NOT NULL ,
    score REAL DEFAULT 0,
    passed INTEGER DEFAULT 0,
    answers TEXT,                           -- JSON
    attempt_number INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- ============ 订单 ============
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL ,
    course_id INTEGER NOT NULL ,
    amount INTEGER NOT NULL,                -- 分
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','paid','refunded','cancelled')),
    payment_method TEXT,
    payment_id TEXT,                        -- 第三方支付订单号
    created_at TEXT DEFAULT (datetime('now')),
    paid_at TEXT
  );

  -- ============ 索引 ============
  CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id, course_id);
  CREATE INDEX IF NOT EXISTS idx_progress_lesson ON user_progress(user_id, lesson_id);
  CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id, quiz_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_course ON orders(course_id);

  -- ============ 作品墙 ============
  -- Phase 2: 6 维字段一次性建表，旧字段 category/scene/style 保留兼容
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    media_type TEXT DEFAULT 'image',
    image_url TEXT,
    video_url TEXT,
    user_id INTEGER,
    author TEXT DEFAULT '',
    avatar_url TEXT,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    -- 旧字段（保留兼容）
    category TEXT,                          -- 原6类: text-to-image, text-to-video...
    scene TEXT,                             -- 旧应用场景（单值）
    style TEXT,                             -- 旧风格（单值）
    tags TEXT DEFAULT '[]',                 -- JSON 标签数组
    sort_order INTEGER DEFAULT 0,
    course_name TEXT,
    course_id INTEGER,
    -- 新 6 维字段（Phase 2）
    creation_type TEXT,                     -- 创作类型: ai-image / ai-video / ai-music
    application_scenes TEXT DEFAULT '[]',   -- 应用场景（JSON 多选）
    tool_chain TEXT DEFAULT '[]',           -- 工具链（JSON 多选）
    art_style TEXT,                         -- 艺术风格（单选）
    secondary_tags TEXT DEFAULT '[]',       -- 二级标签（JSON 多选）
    difficulty TEXT,                        -- 难度: M1 / M2 / M3 / M4 / M5
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- gallery 辅助表（已存在的）
  CREATE TABLE IF NOT EXISTS gallery_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(gallery_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS gallery_dislikes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(gallery_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS gallery_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id INTEGER NOT NULL,
    user_id INTEGER,
    author TEXT DEFAULT '',
    author_avatar TEXT,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_gallery_creation ON gallery(creation_type);
  CREATE INDEX IF NOT EXISTS idx_gallery_art_style ON gallery(art_style);
  CREATE INDEX IF NOT EXISTS idx_gallery_difficulty ON gallery(difficulty);
  CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
  CREATE INDEX IF NOT EXISTS idx_gallery_comments_gallery ON gallery_comments(gallery_id);
  CREATE INDEX IF NOT EXISTS idx_gallery_likes_gallery ON gallery_likes(gallery_id);
`);

export default db;
