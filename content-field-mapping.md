# 内容-字段映射表

## 频道导航清单（基于 Navbar）

| 频道名称 | 路由 | 说明 |
|----------|------|------|
| 首页 | `/` | 品牌介绍、专家团队、课程入口、项目入口 |
| 教师培训 | `/teacher-training` | 5天师训课程介绍、报名入口 |
| 合作教学点 | `/partner` | 线下合作网点申请 |
| 课程体系 | `/courses` | 学生课程列表（含课时模块） |
| 标准教材 | `/textbooks` | 教材体系介绍 |
| 能力认证 | `/certification` | 等级认证体系介绍 |
| 作品展示 | `/gallery` | 作品集展示 + 筛选器 |
| 关于CCAV | `/about` | 机构信息 |
| 联系我们 | `/contact` | 联系方式 |
| 用户登录/注册 | `/auth/login` | 登录注册 |
| AI实践工坊 | `/playground` | AI创作实验场（积分制） |
| 工具链 | `/tools` | AI工具目录与简介 |
| 训练入口 | `/training` | 训练相关（可能废弃/备用） |
| 管理员后台 | `/admin` | 管理面板 |

## 作品展示（Gallery）维度筛选

作品展示页面的筛选维度 `DIMS`：

| 维度 Key | 维度标签 | 可选值 |
|----------|----------|--------|
| `tech` | 🔑 创作技术 | 全部, 文生图, 文生视频, 图生图, 图生视频, AI音乐 |
| `scene` | 📂 应用场景 | 全部, 故事短片, AI电影, 商业广告, 品牌宣传, 课程微课, 创意混剪, 实验艺术, 🎤 词曲演唱, 🎵 纯音乐/BGM |
| `style` | 🎨 艺术风格 | 全部, 国风水墨, 国潮复古, 科幻赛博, 极简现代, 手绘插画, 抽象概念 |
| `stage` | 📊 课程阶段 | （从数据中的 stage 字段提取） |

## GalleryItem 类型字段

```typescript
interface GalleryItem {
  id: number;
  title: string;           // 作品标题
  description: string;     // 作品描述
  media_type: 'image' | 'video';  // 媒体类型
  image_url: string;       // 封面/作品URL
  video_url?: string;      // 视频URL
  author: string;          // 作者
  avatar_url: string;      // 作者头像
  category?: string;       // 分类(英文key)
  tech_type?: string;      // 技术形态：image/video/music/vtuber
  scene?: string;          // 应用场景
  style?: string;          // 艺术风格
  stage?: string;          // 课程学段
  likes_count: number;     // 点赞数
  dislikes_count: number;  // 点踩数
  views_count: number;     // 浏览数
  liked: boolean;          // 当前用户是否已赞
  disliked: boolean;       // 当前用户是否已踩
  tags: string[];          // 标签
  course_name?: string;    // 关联课程名
  course_id?: number;      // 关联课程ID
  created_at: string;      // 创建时间
  comments_count?: number; // 评论数
  duration_seconds?: number; // 视频时长(秒)
  unlocked?: boolean;      // 是否已解锁(积分锁)
  unlock_cost?: number;    // 解锁所需积分
}
```

## 内容类型 → 展示字段映射

| 内容类型 | 页面路由 | 核心展示字段 | 关键筛选/分类维度 |
|----------|----------|-------------|-------------------|
| 视频作品 | `/gallery` | title, image_url(video_url), author, views_count, likes_count, tags, description, duration_seconds, comments_count | tech_type(文生视频/图生视频), scene(场景), style(风格), stage(学段) |
| 图片作品 | `/gallery` | title, image_url, author, views_count, likes_count, tags, description, comments_count | tech_type(文生图/图生图), scene, style, stage |
| AI音乐MV | `/gallery` | title, image_url(video_url), author, views_count, likes_count, tags | tech_type(music), scene, style, stage |
| 课程 | `/courses` | title, subtitle, description, duration, price, level, tags, gradient(样式), lessons[] | category(分类), level(等级) |
| 课程模块 | `/courses/[id]` | title, description, lessons[], sort_order, duration_minutes | course_id |
| 工具 | `/tools` | name, description, category, url, tags, difficulty, free(true/false), highlight | category(image/video/audio/text/code), difficulty |
| 教师培训 | `/teacher-training` | day(天数), theme, duration, modules(time, title), color | level(L1/L2/L3), day |
| 师训报名 | `/teacher-training/apply` | 表单字段(报名人信息) | — |
| 作品详情 | `/gallery/[id]` | title, description, image_url/video_url, author, avatar_url, tags, likes_count, views_count, comments[], comments_count, course_name, category | — |
| AI实验任务 | `/playground` | id, type(image/video), status, prompt, optimizedPrompt?, resultUrl? | type, status, provider(auto/kling/replicate) |
| 能力认证 | `/certification` | 等级说明、标准、模块列表 | level(L0-L3) |
| 标准教材 | `/textbooks` | 教材介绍内容 | — |

## 作品展示维度与字段对应

| GalleryItem 字段 | 对应展示筛选维度 |
|-----------------|-----------------|
| `tech_type` | 🔑 创作技术：文生图(text-to-image)、文生视频(text-to-video)、图生图(image-to-image)、图生视频(image-to-video)、AI音乐(song-video/music) |
| `scene` | 📂 应用场景：故事短片、AI电影、商业广告、品牌宣传、课程微课、创意混剪、实验艺术、词曲演唱、纯音乐/BGM |
| `style` | 🎨 艺术风格：国风水墨、国潮复古、科幻赛博、极简现代、手绘插画、抽象概念 |
| `stage` | 📊 课程阶段：对应课程学段等级标签（如 L1·基础、L2·进阶、L3·高级、L4·综合实战） |
