# ccav-web 作品墙 — 字段清单 & 部署配置 & 上线检查表

> 项目路径：`~/Desktop/AI视频制作/ccav-web/`
> 文档日期：2026-06-17
> 编写者：王万维（大哥）

---

## 一、作品墙完整字段列表

### 1.1 核心数据表：`gallery`（SQLite）

| 字段名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `id` | INTEGER PK AUTOINCREMENT | ✅ | 作品唯一 ID |
| `title` | TEXT | ✅ | 作品标题（中文标题） |
| `description` | TEXT | ✅ | 作品简介/描述 |
| `image_url` | TEXT | ✅ | 封面图/截图（必填，即使视频类也有封面） |
| `video_url` | TEXT | ❌ | 视频文件 URL（仅视频类/音乐类需要） |
| `media_type` | TEXT | ✅ | 媒体类型：`image` / `video` |
| `category` | TEXT | ✅ | 创作分类（6种，见下方） |
| `scene` | TEXT | ❌ | 应用场景（后端动态聚合） |
| `style` | TEXT | ❌ | 艺术风格（后端动态聚合） |
| `stage` | TEXT | ❌ | 课程学段（L1-L5） |
| `author` | TEXT | ✅ | 创作者名称 |
| `avatar_url` | TEXT | ❌ | 创作者头像 URL |
| `user_id` | INTEGER | ❌ | 关联用户 ID（内置管理员上传时可关联） |
| `course_id` | INTEGER | ❌ | 关联课程 ID |
| `course_name` | TEXT | ❌ | 关联课程名称 |
| `tags` | TEXT(JSON) | ❌ | 标签数组（JSON 字符串，如 `["AI视频","国风"]`） |
| `likes_count` | INTEGER DEFAULT 0 | ✅ | 点赞数 |
| `dislikes_count` | INTEGER DEFAULT 0 | ✅ | 鄙视数 |
| `views_count` | INTEGER DEFAULT 0 | ✅ | 浏览量 |
| `duration_seconds` | INTEGER | ❌ | 视频时长（秒），仅视频类 |
| `unlock_cost` | INTEGER DEFAULT 0 | ❌ | 解锁所需积分（0 表示免费） |
| `unlocked` | INTEGER DEFAULT 0 | ❌ | 布尔值（SQLite 无 BOOL，用 0/1） |
| `created_at` | TEXT | ✅ | 创建时间（ISO 8601 字符串） |
| `updated_at` | TEXT | ❌ | 更新时间 |

### 1.2 `category` 创作分类（6种）

| 后端值 | 前端标签 | 媒体类型 | 说明 |
|--------|----------|----------|------|
| `text-to-image` | 文生图 | `image` | 文本生成图片 |
| `image-to-image` | 图生图 | `image` | 图片风格迁移/图生图 |
| `text-to-video` | 文生视频 | `video` | 文本生成视频 |
| `image-to-video` | 图生视频 | `video` | 图片生成视频/动态化 |
| `video-to-video` | 视频转译 | `video` | 视频风格迁移 |
| `song-video` | 歌曲短视频/AI音乐 | `video` | AI 音乐/MV |
| `course-demo` | 教学示范 | `image`/`video` | 教学演示作品 |

> **注意**：`course-demo` 是 mock 数据里出现的值，后端 `techTypeCategoryMap` 不包含它，意味着它不会被 `techType` 筛选匹配到。

### 1.3 `tech_type` 技术形态（前端映射）

由后端 `formatGalleryItem()` 根据 `category` 映射：

| `category` | `tech_type` |
|------------|-------------|
| `text-to-image`, `image-to-image` | `image` |
| `text-to-video`, `image-to-video`, `video-to-video` | `video` |
| `song-video` | `music` |
| 其他 | `image`（默认） |

前端 `GalleryItem.tech_type` 额外包含 `vtuber`（虚拟主播）：

```typescript
// 前端 TECH_TYPES 定义
['image', 'video', 'music', 'vtuber']
```

### 1.4 6维筛选体系

实际实现为 **4维筛选**（筛选器为前端纯静态定义），另有 2 维由后端 `tags` 提供二级标签。

| 维度 | 键名 | 筛选标签（前端硬编码） | 后端数据来源 |
|------|------|----------------------|-------------|
| ① 创作技术 | `tech` | 全部、文生图、文生视频、图生图、图生视频、AI音乐 | `category` 映射为 `tech_type` |
| ② 应用场景 | `scene` | 全部、故事短片、AI电影、商业广告、品牌宣传、课程微课、创意混剪、实验艺术、🎤 词曲演唱、🎵 纯音乐/BGM | 后端 `SELECT DISTINCT scene FROM gallery` |
| ③ 艺术风格 | `style` | 全部、国风水墨、国潮复古、科幻赛博、极简现代、手绘插画、抽象概念 | 后端 `SELECT DISTINCT style FROM gallery` |
| ④ 课程学段 | `stage` | 全部、L1·基础工坊、L2·进阶工具、L3·超清精修、L4·综合实战、L5·商业交付 | 数据库 `stage` 字段 |
| ⑤ 二级标签 | `tags` | 自由标签（不在筛选器里直接展示） | 数据库 `tags` JSON 字段 |
| ⑥ 媒体类型 | （无前端独立筛选器） | 通过 `tech_type` 隐含 | 见 1.3 |

> **设计说明**：前 4 维有前端筛选器 UI（四行标签按钮行），后 2 维通过 `tags` 和 `tech_type` 隐含支持。

### 1.5 关联表：`gallery_likes`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER PK | 主键 |
| `gallery_id` | INTEGER FK | 作品 ID |
| `user_id` | INTEGER FK | 用户 ID |
| `created_at` | TEXT | 点赞时间（SQLite 无自动，需手动） |

### 1.6 关联表：`gallery_dislikes`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER PK | 主键 |
| `gallery_id` | INTEGER FK | 作品 ID |
| `user_id` | INTEGER FK | 用户 ID |
| `created_at` | TEXT | 鄙视时间 |

### 1.7 关联表：`gallery_comments`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER PK | 主键 |
| `gallery_id` | INTEGER FK | 作品 ID |
| `user_id` | INTEGER FK (nullable) | 用户 ID |
| `author` | TEXT | 评论者显示名 |
| `author_avatar` | TEXT (nullable) | 评论者头像 URL |
| `content` | TEXT | 评论内容 |
| `created_at` | TEXT | 评论时间（后端自动填充 `new Date().toISOString()`） |

### 1.8 前端 GalleryItem 字段（最终展示）

```typescript
export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  media_type?: 'image' | 'video';
  image_url: string;
  video_url?: string;
  author: string;
  avatar_url: string;
  category?: string;
  tech_type?: string;        // image/video/music/vtuber
  scene?: string;            // 应用场景
  style?: string;            // 艺术风格
  stage?: string;            // 课程学段
  likes_count: number;
  dislikes_count: number;
  views_count: number;
  liked: boolean;
  disliked: boolean;
  tags: string[];
  course_name?: string;
  course_id?: number;
  created_at: string;
  comments_count?: number;
  duration_seconds?: number; // Phase C 预留
  unlocked?: boolean;        // Phase C 预留
  unlock_cost?: number;      // Phase C 预留
}
```

### 1.9 后台管理字段

目前**没有独立的管理后台页面**。后端 `POST /api/gallery` 路由需要 `authMiddleware`（需登录），使用 JWT token 认证。发布接口：

```typescript
POST /api/gallery
Headers: { Authorization: "Bearer <jwt>" }
Body: {
  title, description, image_url, video_url,
  media_type, category, scene, style, stage,
  tags, author, avatar_url, course_id,
  duration_seconds, unlock_cost
}
```

当前**尚无**：
- 删除作品 API (`DELETE /api/gallery/:id`)
- 编辑作品 API (`PUT /api/gallery/:id`)
- 批量管理功能（列表编辑、批量导入等）

---

## 二、当前部署配置

### 2.1 项目架构概览

```
┌─────────────┐   静态文件    ┌─────────────┐
│  用户浏览器  │ ◄────────── │   Nginx     │
│  (ccav.com) │             │   Port 80   │
└─────────────┘             └──────┬──────┘
                                   │ 代理 /api/
                                   ▼
                            ┌─────────────┐
                            │  Express    │
                            │  Port 3001  │
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │   SQLite    │
                            │  ccav.db    │
                            └─────────────┘
```

### 2.2 前端（Next.js）

| 项目 | 值 |
|------|-----|
| 框架 | Next.js 16.2.6 (React 19.2.4) |
| 构建输出 | `output: 'export'`（纯静态导出） |
| 输出目录 | `dist/` |
| 图片优化 | `images.unoptimized: true`（静态导出必须） |
| 路径别名 | `@/ → ./src/*` |
| CSS 框架 | Tailwind CSS v4 |
| 动画 | framer-motion |
| 图标 | lucide-react |
| 构建命令 | `npm run build` → `next build` |
| 本地开发端口 | `next dev -p 3000`（配合后端 3001） |
| 环境变量 | `.env.local`（只在本地读取） |

**.env.local 内容：**
```
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_KLING_COOKIE=xxx
NEXT_PUBLIC_KLING_TOKEN=xxx
```

**注意：** 前端是纯静态导出，**`NEXT_PUBLIC_API_BASE` 只在开发构建时有效**。生产环境下，API 请求路径是相对路径 `/api/gallery/...`，Nginx 反向代理到 `127.0.0.1:3001`。

### 2.3 后端（Express）

| 项目 | 值 |
|------|-----|
| 框架 | Express 4.18+ |
| 运行时端口 | **3001** |
| 数据库 | SQLite (better-sqlite3) |
| 认证 | JWT (jsonwebtoken) |
| 密码哈希 | bcryptjs |
| CORS | 已启用（`app.use(cors())`） |
| Body 限制 | `1mb` |
| 启动命令 | `node server/server.mjs` |
| 环境变量 | `server/.env` |

**server/.env 内容：**
```
API_PORT=3001
KIMI_API_KEY=sk-xxx
KLING_COOKIE=xxx
KLING_TOKEN=xxx
JWT_SECRET=xxx（autogenerated if not set）
```

### 2.4 API 路由表

| 端点 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/gallery` | GET | 无 | 获取作品列表（支持 `?tag=`, `?category=`, `?techType=`, `?page&pageSize`） |
| `/api/gallery/filters` | GET | 无 | 获取动态场景+风格选项 |
| `/api/gallery/:id` | GET | 无 | 获取单个作品详情 |
| `/api/gallery/:id/view` | POST | 无 | 增加浏览量 |
| `/api/gallery/:id/like` | POST | JWT | 点赞/取消点赞 |
| `/api/gallery/:id/dislike` | POST | JWT | 鄙视/取消鄙视 |
| `/api/gallery/:id/comments` | GET | 无 | 获取评论列表 |
| `/api/gallery/:id/comments` | POST | JWT | 提交评论 |
| `/api/gallery/:id/unlock` | POST | JWT | 🔒 Phase C 预留（前端已实现，后端路由未确认） |
| `/api/gallery` | POST | JWT | 发布作品 |

### 2.5 Nginx 配置

**配置文件：** `server/nginx-ccav.conf`（生产环境使用）

```
server {
    listen 80;
    server_name ccav.com www.ccav.com;

    # 前端静态文件
    root /var/www/ccav;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**备份配置：** 项目根 `nginx.conf` 有简化版本，仅包含静态文件部分。

### 2.6 服务器信息

| 项目 | 值 |
|------|-----|
| 服务器 IP | **43.159.170.161**（腾讯云） |
| SSH 用户 | `root` |
| SSH 端口 | 22（默认） |
| 远程路径 | `/var/www/ccav` |
| Nginx 管理 | `systemctl reload nginx` |
| DNS | **ccav.com**（指向 43.159.170.161） |

### 2.7 部署流程

```
1. 本地：npm run build           # 构建静态文件到 dist/
2. 本地：rsync dist/ → 43.159.170.161:/var/www/ccav/
3. 服务器：nginx -t && systemctl reload nginx
4. 服务器：确保 API 后端已在端口 3001 运行
```

**部署脚本：** `deploy.sh`（全流程自动化）
**二期部署脚本：** `deploy-phase2.sh`（前端 + 后端包一起上传）

### 2.8 开发环境

- **代理：** 本地开发走 `http://127.0.0.1:7897`（mihomo）
- **开发启动：** `./dev.sh`（同时启动 Next.js dev server + API server）
- **端口：** 前端 3000，后端 3001

---

## 三、上线检查表

### ⬜ 3.1 前端检查

- [ ] **静态导出验证**：`npm run build` 成功生成 `dist/` 目录
- [ ] **所有图片 URL 可达**：Mock 数据中的可灵 AI 图片 URL（`klingai.com`/`kechuangai.com` 等）需在公网可访问
- [ ] **视频链接可达**：Mock 视频 URL（`interactive-examples.mdn.mozilla.org`、`samplelib.com` 等）需可用
- [ ] **相对路径 API**：前端 API 请求路径为 `/api/gallery/...` 而非绝对路径
- [ ] **Trailing Slash**：`trailingSlash: true` 配置生效，确保 `/gallery/` 正常工作
- [ ] **404 页面**：自定义 404 页面需处理 SPA 路由
- [ ] **SEO 元信息**：`generate.ts` 已配置 `generateStaticParams`
- [ ] **图片懒加载**：封面图使用 `loading="lazy"`（Next.js Image 组件或原生）
- [ ] **响应式适配**：移动端 4 维筛选器在窄屏可用
- [ ] **浏览器回退**：`/gallery/:id` → 回退 → `/gallery` 的哨兵机制验证

### ⬜ 3.2 后端检查

- [ ] **API 服务运行**：`node server/server.mjs` 在端口 3001 成功启动
- [ ] **SQLite 数据库**：`ccav.db` 文件在正确路径、可读写
- [ ] **数据库表结构**：`gallery`、`gallery_likes`、`gallery_dislikes`、`gallery_comments` 表已创建
  - ⚠️ **当前问题**：`gallery` 及其关联表在代码中**没有 CREATE TABLE 语句**，需要在首次运行时手动创建或添加迁移脚本
- [ ] **JWT 认证**：`authMiddleware` 能正确解析 Bearer token
- [ ] **POST /api/gallery 测试**：能成功通过 JWT 认证后发布作品
- [ ] **CORS 跨域**：生产环境 Nginx 代理后，CORS 头不需要额外配置
- [ ] **评论功能**：登录后能发表评论，未登录只能查看
- [ ] **点赞/鄙视互斥**：点赞后点击鄙视应取消点赞（已验证代码实现正确）
- [ ] **浏览量递增**：每次访问详情页增加 1 次（已实现）

### ⬜ 3.3 Nginx & 网络检查

- [ ] **Nginx 配置语法**：`nginx -t` 通过
- [ ] **静态文件路径**：`/var/www/ccav` 目录存在且有 `index.html`
- [ ] **403/404 错误页**：Nginx 是否需要自定义 404
- [ ] **API 代理路径**：`/api/` → `127.0.0.1:3001` 代理正确（注意尾部斜杠）
- [ ] **WebSocket**：当前无 WebSocket 需求，不需要额外配置
- [ ] **SSL/HTTPS**：当前配置**仅 HTTP（端口 80）**，生产应配置 HTTPS
- [ ] **HTTP 强跳 HTTPS**：如果配置了证书，应有 80→443 重定向
- [ ] **gzip 压缩**：Nginx 配置静态文件 gzip 压缩
- [ ] **缓存策略**：`dist/` 静态文件应配置 `Cache-Control: public, max-age=3600` 或类似

### ⬜ 3.4 安全检查

- [ ] **HTTPS 证书**：申请 SSL 证书（Let's Encrypt / 腾讯云免费证书）
- [ ] **API 端口不对外暴露**：Nginx 代理后，端口 3001 不应直接公网可达
- [ ] **JWT Secret**：`JWT_SECRET` 使用强随机密码，不要用默认值
- [ ] **SQLite 文件权限**：`ccav.db` 不应是 777 权限
- [ ] **请求限流**：评论/点赞接口应限制频率（当前未实现）
- [ ] **输入验证**：title/content 长度限制（当前 `POST /api/gallery` 内无长度校验）
- [ ] **XSS 防护**：Nginx 应配置 `X-Content-Type-Options: nosniff`、`X-Frame-Options: DENY` 等安全头
- [ ] **API Key 保护**：`.env` 文件不应在服务器上暴露给非 root 用户
- [ ] **图片上传安全**：当前作品图片都是外链 URL，无上传功能。如果后续加上传，要有文件类型/大小验证
- [ ] **SSH 安全**：`root@43.159.170.161` 是否使用密钥登录，关闭密码登录

### ⬜ 3.5 性能检查

- [ ] **静态资源打包大小**：检查 `dist/` 各 JS Bundle 大小，优化过大的第三方包
- [ ] **图片懒加载**：所有 gallery 封面图懒加载
- [ ] **视频预加载**：视频文件不应自动预加载（`preload="metadata"`）
- [ ] **API 响应时间**：`/api/gallery` 返回时间 < 200ms（SQLite 查询+格式化）
- [ ] **SQLite 索引**：`gallery` 表的 `scene`、`style`、`category` 字段应加索引
- [ ] **分页优化**：列表 API 默认 `pageSize=50`，需确认大数据量下性能
- [ ] **Nginx 缓存**：静态文件配置浏览器缓存过期时间
- [ ] **未使用代码**：检查 bundle 中是否有未使用的 Tailwind CSS 类

### ⬜ 3.6 域名/DNS 检查

- [ ] **DNS 解析**：`ccav.com` → `43.159.170.161`（A 记录）
- [ ] **www 重定向**：`www.ccav.com` → `ccav.com` 或直接解析
- [ ] **TTL 值**：上线前可设短 TTL（如 300 秒），稳定后改回默认
- [ ] **SSL 证书**：如果配置 HTTPS，确认续期方式（certbot / 腾讯云自动续期）
- [ ] **备案**：`ccav.com` 确认已备案（国内服务器必须）
- [ ] **CDN**：当前无 CDN，图片/视频直接服务器负载，若后续流量大考虑 CDN

### ⬜ 3.7 运营检查

- [ ] **空作品墙**：无作品时的占位提示（目前无独立空状态组件）
- [ ] **Mock 数据清理**：生产环境应移除 `MOCK_GALLERY` fallback 数据
- [ ] **作品上传流程**：管理员如何上传新作品？（当前只有 API 没有管理界面）
- [ ] **作品管理功能**：需要补充删除、编辑 API
- [ ] **错误监控**：后端 `console.error` 日志应接入日志收集（pm2 logs / journald）
- [ ] **数据备份**：`ccav.db` 每日定时备份（cron + rsync 到本地或 COS）

### ⬜ 3.8 部署前最终测试

- [ ] **全链路测试**：浏览器打开 `http://ccav.com` → 作品墙加载正常 → 4 维筛选切换正常
- [ ] **详情页测试**：点击作品 → 图片/视频显示 → 点赞/鄙视互斥工作 → 评论发布正常
- [ ] **无登录流**：未登录可浏览、查看、不可点赞/评论
- [ ] **登录流**：登录后可点赞/评论
- [ ] **API 异常处理**：数据库连接失败 → 返回 500 且不泄露敏感信息
- [ ] **Nginx reload 安全**：`nginx -t` 通过后再 reload

---

## 四、已知问题 & 待办项

| 优先级 | 问题 | 说明 |
|--------|------|------|
| 🔴 **高** | gallery 表未在代码中创建 | `server/db.js` 和 `server/server.mjs` 均无 `CREATE TABLE gallery`，现有表仅在手动创建或迁移时存在。需要补充 DDL。 |
| 🔴 **高** | gallery 相关路由未注册 | `gallery.mjs` 未被 `server.mjs` `app.use()` 注册（查看源码未找到 `import galleryRoutes` 行），需要确认是否有接入。 |
| 🟡 **中** | 缺少 HTTPS | 当前仅 HTTP（端口 80），需要 SSL 证书 |
| 🟡 **中** | 缺少管理 API | 无 `DELETE`/`PUT /api/gallery/:id` 接口 |
| 🟡 **中** | 缺少空状态 | 当无作品时前端没有友好提示 |
| 🟡 **中** | 请求限流 | 评论/点赞接口无频率限制 |
| 🟢 **低** | Mock 数据保留 | 生产环境应考虑移除 `MOCK_GALLERY` |
| 🟢 **低** | 数据库备份 | 无自动备份机制 |
| 🟢 **低** | stage 字段未定义筛选后端 | `stage` 筛选仅在前端做，后端的 `GET /api/gallery?stage=X` 未实现 |

---

## 附录：关键文件路径

| 文件 | 说明 |
|------|------|
| `~/Desktop/AI视频制作/ccav-web/package.json` | 前端依赖 |
| `~/Desktop/AI视频制作/ccav-web/next.config.ts` | Next.js 配置（静态导出） |
| `~/Desktop/AI视频制作/ccav-web/.env.local` | 前端环境变量 |
| `~/Desktop/AI视频制作/ccav-web/nginx.conf` | Nginx 简化配置 |
| `~/Desktop/AI视频制作/ccav-web/src/lib/api.ts` | API 客户端 + GalleryItem 类型 |
| `~/Desktop/AI视频制作/ccav-web/src/app/gallery/page.tsx` | 作品墙主页面（4 维筛选器） |
| `~/Desktop/AI视频制作/ccav-web/src/app/gallery/[id]/page.tsx` | 作品详情页 |
| `~/Desktop/AI视频制作/ccav-web/src/components/gallery/CommentsList.tsx` | 评论组件 |
| `~/Desktop/AI视频制作/ccav-web/server/package.json` | 后端依赖 |
| `~/Desktop/AI视频制作/ccav-web/server/.env` | 后端环境变量 |
| `~/Desktop/AI视频制作/ccav-web/server/server.mjs` | 后端入口 |
| `~/Desktop/AI视频制作/ccav-web/server/gallery.mjs` | 作品墙 API 路由 |
| `~/Desktop/AI视频制作/ccav-web/server/db.js` | 数据库（无 gallery 表创建） |
| `~/Desktop/AI视频制作/ccav-web/server/nginx-ccav.conf` | 生产 Nginx 配置 |
| `~/Desktop/AI视频制作/ccav-web/deploy.sh` | 部署脚本 |
| `~/Desktop/AI视频制作/ccav-web/dev.sh` | 本地开发启动脚本 |
