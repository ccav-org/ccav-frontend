# 作品墙数据库迁移方案评审

---

## 一、当前 gallery 表结构（DDL）

**⚠️ 实际状态：ccav.db 中 gallery 表尚未创建。**

代码 `server/gallery.mjs` 直接引用的表 `gallery`, `gallery_likes`, `gallery_dislikes`, `gallery_comments` 均不存在于数据库中。

以下是 gallery.mjs 代码隐式依赖的字段结构：

```sql
-- gallery 表（代码中引用但未创建）
CREATE TABLE gallery (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    description     TEXT,
    media_type      TEXT DEFAULT 'image',       -- 'image' | 'video'
    image_url       TEXT NOT NULL,
    video_url       TEXT,
    user_id         INTEGER,
    author          TEXT DEFAULT '匿名',
    avatar_url      TEXT DEFAULT '',
    likes_count     INTEGER DEFAULT 0,
    dislikes_count  INTEGER DEFAULT 0,
    views_count     INTEGER DEFAULT 0,
    category        TEXT,                        -- 'text-to-image'|'text-to-video'|'image-to-image'|'image-to-video'|'song-video'|'video-to-video'
    tags            TEXT DEFAULT '[]',           -- JSON 数组
    scene           TEXT,                        -- 应用场景
    style           TEXT,                        -- 艺术风格
    course_name     TEXT,
    course_id       INTEGER,
    sort_order      INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now'))
);

-- 辅助表
CREATE TABLE gallery_likes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    UNIQUE(gallery_id, user_id)
);

CREATE TABLE gallery_dislikes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    UNIQUE(gallery_id, user_id)
);

CREATE TABLE gallery_comments (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id      INTEGER NOT NULL,
    user_id         INTEGER,
    author          TEXT NOT NULL,
    author_avatar   TEXT,
    content         TEXT NOT NULL,
    created_at      TEXT DEFAULT (datetime('now'))
);
```

**当前拥有字段（3 个标签字段）：**
| 字段 | 类型 | 说明 |
|------|------|------|
| `category` | TEXT | 创作类型（6个值：text-to-image 等） |
| `scene` | TEXT | 应用场景（单值） |
| `style` | TEXT | 艺术风格（单值） |

---

## 二、二哥 6 维字段 vs 现有字段差异表

| # | 维度 | 要求 | 现有字段 | 差异 |
|---|------|------|----------|------|
| 1 | 🌐 创作类型 | 单选：AI图片/AI视频/AI音乐 | `category`（英文值，6类） | 字段存在，但前端需要的 UI 值不同。现有 category 粒度更细（6类），前端显示用 tech_type 映射为 4 类。✅ 基本满足，需增加映射。 |
| 2 | 🎬 应用场景 | 多选 | `scene`（单值 TEXT） | ❌ 当前是单值字段，需要多选（创意混剪/商业广告/品牌宣传/教学课程/短片故事/MV音乐视频/AI电影/实验艺术） |
| 3 | 🔧 工具链 | 多选：M1~M5 | 无 | ❌ 全缺 |
| 4 | 🎨 艺术风格 | 单选：写实胶片/国潮/国风水墨/抽象概念/科幻赛博/极简现代/手绘插画 | `style`（单值 TEXT，使用英文） | ❌ 现有 style 是英文自由文本，需要规范化到固定可选值 |
| 5 | 🏷️ 二级标签 | 多选，动态匹配 | `tags` (JSON TEXT) | ✅ 已有 JSON tags 字段，可继续使用，但需要规范化标签体系 |
| 6 | 🪜 难度/课程阶段 | 单选：M1~M5 | 无 | ❌ 全缺 |

**总结：**
- ✅ 可直接复用：创作类型（映射改造）、二级标签（规范化）
- ❌ 需新增/改造：应用场景（单值→多选）、工具链（全新增）、艺术风格（规范化枚举）、难度（全新增）

---

## 三、迁移方案

### 方案 A：在 gallery 表上加字段

```sql
-- 保留旧字段兼容
-- 新增 6 维字段
ALTER TABLE gallery ADD COLUMN creation_type TEXT;          -- 'image'|'video'|'music'
ALTER TABLE gallery ADD COLUMN application_scenes TEXT;     -- JSON 数组: '["创意混剪","商业广告"]'
ALTER TABLE gallery ADD COLUMN tool_chain TEXT;             -- 'M1'|'M2'|'M3'|'M4'|'M5'
ALTER TABLE gallery ADD COLUMN art_style TEXT;              -- '写实胶片'|'国潮'|'国风水墨' 等规范化值
ALTER TABLE gallery ADD COLUMN secondary_tags TEXT;         -- JSON 数组: '["文生图","产品展示"]'
ALTER TABLE gallery ADD COLUMN difficulty TEXT;             -- 'M1'|'M2'|'M3'|'M4'|'M5'

-- 保持旧字段 scene, style, category, tags 不变

-- 新增索引
CREATE INDEX IF NOT EXISTS idx_gallery_creation_type ON gallery(creation_type);
CREATE INDEX IF NOT EXISTS idx_gallery_difficulty ON gallery(difficulty);
```

**优点：**
- 单表查询简单，不需要 JOIN
- 所有数据在一条记录里，前端筛选直接 WHERE 过滤
- 旧字段无需迁移

**缺点：**
- 表列数膨胀（从8个业务字段→14个）
- 应用场景（多选）和二级标签（多选）存 JSON，SQLite 的 JSON 过滤性能一般
- 当筛选维度增加时表结构会继续膨胀

**预估影响范围：**
- gallery.mjs：所有 SQL 查询需加新字段（约 10 处）
- api.ts（前端）：GalleryItem 接口加新字段（约 5 处）
- 前端筛选组件：无需改造，因为 filters API 已返回筛选项
- nginx.conf：无影响

---

### 方案 B：新建作品元数据表

```sql
-- gallery 表保留不变

-- 新建作品元数据表（一对多/多对多）
CREATE TABLE IF NOT EXISTS gallery_meta (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id      INTEGER NOT NULL UNIQUE REFERENCES gallery(id) ON DELETE CASCADE,
    creation_type   TEXT,            -- 'image'|'video'|'music'
    tool_chain      TEXT,            -- 'M1'|'M2'|'M3'|'M4'|'M5'
    art_style       TEXT,            -- 规范化风格值
    difficulty      TEXT,            -- 'M1'|'M2'|'M3'|'M4'|'M5'
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- 应用场景多选表（一对多）
CREATE TABLE IF NOT EXISTS gallery_scenes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id  INTEGER NOT NULL REFERENCES gallery(id) ON DELETE CASCADE,
    scene       TEXT NOT NULL,
    UNIQUE(gallery_id, scene)
);

-- 二级标签多选表（一对多）
CREATE TABLE IF NOT EXISTS gallery_tags (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    gallery_id  INTEGER NOT NULL REFERENCES gallery(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    UNIQUE(gallery_id, tag)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_gallery_meta_creation ON gallery_meta(creation_type);
CREATE INDEX IF NOT EXISTS idx_gallery_meta_tool ON gallery_meta(tool_chain);
CREATE INDEX IF NOT EXISTS idx_gallery_meta_style ON gallery_meta(art_style);
CREATE INDEX IF NOT EXISTS idx_gallery_meta_difficulty ON gallery_meta(difficulty);
CREATE INDEX IF NOT EXISTS idx_gallery_scenes_gallery ON gallery_scenes(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_scenes_scene ON gallery_scenes(scene);
CREATE INDEX IF NOT EXISTS idx_gallery_tags_gallery ON gallery_tags(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_tags_tag ON gallery_tags(tag);
```

**优点：**
- 现有 gallery 表零改动，零风险
- 多选维度（场景、标签）走标准 RELATION 表，SQL 查询灵活
- 后续增加维度只需要加新表，不碰主表
- 减少单一表列数

**缺点：**
- 查询需要 JOIN（但 with_index 性能可忽略）
- API 端组装数据需要多查几次（或一次 JOIN）
- 过度设计了？（现在才 6 维，单表够用）

**预估影响范围：**
- gallery.mjs：约 10 处 SQL 查询需改写（JOIN 或子查询）
- api.ts：GalleryItem 接口字段名保持一致
- 前端筛选组件：需要适配 filters API 返回格式（多层级）

---

## 四、推荐方案

**推荐：方案 A（单表加字段）**

理由：
1. **当前只有 6 维，单表足够** — 不像需要几十个维度的复杂系统
2. **SQLite 特性** — SQLite 是单进程嵌入式数据库，多表 JOIN 在高并发下反而劣化
3. **迁移成本最低** — ALTER TABLE ADD COLUMN 是零数据迁移的元操作
4. **前端接口不变** — gallery.mjs 的 formatGalleryItem() 加几个字段映射就行
5. **保留旧字段兼容** — 旧代码不会断链
6. **V2 如需 TIDB/分布式再做分表**，到时再考虑方案 B

如果未来维度突破 15 个（不大可能），再考虑方案 B 或文档型数据库。

---

## 五、迁移脚本

### 5.1 迁移脚本 `server/migrate-v1-gallery-fields.mjs`

```javascript
#!/usr/bin/env node
/**
 * gallery 表 6 维字段迁移
 * V1: 现有 3 个标签字段（category, scene, style）+ JSON tags
 * V2: 补充 creation_type, application_scenes, tool_chain, art_style, secondary_tags, difficulty
 *
 * 保留旧字段兼容，新增字段在 column 不存在时才 ALTER，幂等安全。
 */

import db from './db.js';

const MIGRATIONS = [
  { column: 'creation_type',       type: 'TEXT', comment: '创作类型: image|video|music' },
  { column: 'application_scenes',  type: 'TEXT', comment: '应用场景 JSON' },
  { column: 'tool_chain',          type: 'TEXT', comment: '工具链: M1~M5' },
  { column: 'art_style',           type: 'TEXT', comment: '艺术风格（规范化枚举值）' },
  { column: 'secondary_tags',      type: 'TEXT', comment: '二级标签 JSON' },
  { column: 'difficulty',          type: 'TEXT', comment: '难度/课程阶段: M1~M5' },
];

console.log('🔍 检查 gallery 表字段...');

for (const { column, type } of MIGRATIONS) {
  // SQLite 查 column 是否存在
  const exists = db.prepare(`
    SELECT COUNT(*) as cnt FROM pragma_table_info('gallery') WHERE name = ?
  `).get(column);
  if (exists.cnt === 0) {
    const sql = `ALTER TABLE gallery ADD COLUMN ${column} ${type}`;
    db.exec(sql);
    console.log(`  ✅ 新增字段: ${column} (${type})`);
  } else {
    console.log(`  ⏭️  已存在: ${column}`);
  }
}

// 新增索引（幂等）
const INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_gallery_creation_type ON gallery(creation_type)',
  'CREATE INDEX IF NOT EXISTS idx_gallery_difficulty ON gallery(difficulty)',
];

for (const sql of INDEXES) {
  db.exec(sql);
}

console.log('✅ 迁移完成');
```

### 5.2 回滚脚本 `server/rollback-v1-gallery-fields.mjs`

```javascript
#!/usr/bin/env node
/**
 * gallery 表 6 维字段回滚
 *
 * SQLite 不支持 DROP COLUMN。
 * 回滚方式：备份数据 → 重建表（不包含新字段）→ 恢复数据
 *
 * 注意：此操作不可逆，请确认已备份 ccav.db
 */

import db from './db.js';

const NEW_COLUMNS = [
  'creation_type', 'application_scenes', 'tool_chain',
  'art_style', 'secondary_tags', 'difficulty',
];

console.log('⚠️  正在检查新字段数据是否为空（空数据才安全回滚）...');

const count = db.prepare(`
  SELECT COUNT(*) as cnt FROM gallery WHERE
    ${NEW_COLUMNS.map(c => `${c} IS NOT NULL`).join(' OR ')}
`).get();

if (count.cnt > 0) {
  console.error(`❌ ${count.cnt} 条记录已写入新字段，回滚会丢数据！`);
  console.error('   请先备份数据到新字段旧字段，或手动处理。');
  process.exit(1);
}

console.log('✅ 新字段无有效数据，安全回滚。');

// 重建表（SQLite 的 DDL 回滚方式）
db.exec(`
  CREATE TABLE gallery_backup AS SELECT
    id, title, description, media_type, image_url, video_url,
    user_id, author, avatar_url, likes_count, dislikes_count,
    views_count, category, tags, scene, style, course_name,
    course_id, sort_order, created_at
  FROM gallery;

  DROP TABLE gallery;

  CREATE TABLE gallery (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    description     TEXT,
    media_type      TEXT DEFAULT 'image',
    image_url       TEXT NOT NULL,
    video_url       TEXT,
    user_id         INTEGER,
    author          TEXT DEFAULT '匿名',
    avatar_url      TEXT DEFAULT '',
    likes_count     INTEGER DEFAULT 0,
    dislikes_count  INTEGER DEFAULT 0,
    views_count     INTEGER DEFAULT 0,
    category        TEXT,
    tags            TEXT DEFAULT '[]',
    scene           TEXT,
    style           TEXT,
    course_name     TEXT,
    course_id       INTEGER,
    sort_order      INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now'))
  );

  INSERT INTO gallery SELECT * FROM gallery_backup;
  DROP TABLE gallery_backup;
`);

console.log('✅ 回滚完成，新字段已移除。');
```

---

## 六、兼容性保障

| 兼容层级 | 具体措施 |
|----------|----------|
| **旧 DB 数据** | ALTER TABLE ADD COLUMN 允许 NULL，现有作品的新字段全部为 NULL，筛选时忽略 |
| **旧 API 调用** | 新字段不改变现有 gallery.mjs 的 formatGalleryItem() 输出签名 |
| **旧前端筛选** | `/api/gallery/filters` 继续返回 scenes/styles，前端旧代码不感知新维度 |
| **旧字段值保留** | category → creation_type 通过 techTypeMap 保持映射不变 |
| **frontend api.ts** | GalleryItem 接口新字段设为 `?` 可选，现有代码无需修改 |

**关键风险：** 当前 gallery 表在 SQLite 中不存在（gallery.mjs 路由也未在 server.mjs 注册）。所以实际上这是一次**初始化创建**，更准确地说是在 `server/models.mjs` 中添加 gallery 表 DDL + 字段，让服务器启动时自动创建。

建议修改为在 `server/models.mjs` 中添加 gallery 表完整 DDL（含 6 维字段），替代在 gallery.mjs 中运行时依赖的模式。

---

*评审人：王万维 | 2026-06-17 14:22*
