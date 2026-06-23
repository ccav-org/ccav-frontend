/**
 * ccav.com Phase 2 — API 客户端
 * 前端调用后端API，回退到静态数据
 */
import { studentCourses, trainingCourse } from '@/lib/courseData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Gallery API 直接指向后端服务器（静态导出下 API 代理不可用）
 * 生产部署时通过 nginx 反代到同域下的 /api/gallery
 * 开发/调试时直连 3001 端口
 */
const GALLERY_API_BASE = typeof window !== 'undefined'
  ? (window.__NEXT_DATA__?.props?.galleryApiBase ?? process.env.NEXT_PUBLIC_GALLERY_API_URL ?? '/api')
  : (process.env.NEXT_PUBLIC_GALLERY_API_URL ?? '/api');

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ============ 课程 ============

export async function getCourses() {
  const data = await fetchAPI<{ courses: any[] }>('/courses');
  if (data?.courses && data.courses.length > 0) {
    return data.courses.map(c => ({
      id: c.slug,
      title: c.title,
      subtitle: c.subtitle || '',
      description: c.description || '',
      slug: c.slug,
      category: c.category,
      level: c.level?.charAt(0).toUpperCase() || 'A',
      duration: c.lesson_count + '节课',
      modules: 0,
      format: '线上线下结合',
      price: c.price > 0 ? `¥${(c.price/100).toFixed(0)}` : '免费',
      tags: [],
      gradient: 'from-blue-400 to-purple-500',
      lessons: [],
    }));
  }

  // 回退到静态数据
  return studentCourses;
}

export async function getCourse(slug: string) {
  // 尝试从API获取
  const data = await fetchAPI<{ course: any }>(`/courses/${slug}`);
  if (data?.course) {
    const c = data.course;
    return {
      id: c.slug,
      title: c.title,
      subtitle: c.subtitle || '',
      description: c.description || '',
      slug: c.slug,
      duration: c.lesson_count + '节课',
      modules: (c.modules || []).length,
      format: '线上线下结合',
      price: c.price > 0 ? `¥${(c.price/100).toFixed(0)}` : '免费',
      level: c.level?.charAt(0).toUpperCase() || 'A',
      tags: [],
      gradient: 'from-blue-400 to-purple-500',
      lessons: [],
      modulesArr: (c.modules || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        sort_order: m.sort_order,
        lessons: (m.lessons || []).map((l: any) => ({
          title: l.title,
          duration: l.duration_minutes,
          completed: false,
        })),
      })),
    };
  }

  // 回退到静态数据
  return slug === 'training' ? trainingCourse : studentCourses.find(c => c.id === slug) || null;
}

// ============ 学习进度 ============

export async function getProgress(): Promise<any[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return [];

  const data = await fetchAPI<{ progress: any[] }>('/courses/progress', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.progress || [];
}

export async function updateProgress(courseId: number, lessonId: number, status?: string, progressPercent?: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return;

  await fetchAPI('/courses/progress/update', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, status, progress_percent: progressPercent }),
  });
}

// ============ 测验 ============

/** 提交测验结果（前端已自判分，后端只存分） */
export async function submitQuizResult(courseId: string, lessonId: number, score: number, total: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return null;

  return fetchAPI<{ success: boolean; score: number; total: number; passed: boolean; previousBest: number | null }>('/courses/quiz/submit', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId, lessonId, score, total }),
  });
}

/** 获取用户所有测验历史 */
export async function getQuizResults() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return [];

  const data = await fetchAPI<{ results: any[] }>('/courses/quiz/results', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.results || [];
}

// ============ 作品墙 ============

/** GalleryItem 类型 — 前端统一使用 snake_case */
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
  /** 技术形态：image/video/music/vtuber */
  tech_type?: string;
  /** 应用场景 */
  scene?: string;
  /** 艺术风格 */
  style?: string;
  /** 课程学段 */
  stage?: string;
  likes_count: number;
  dislikes_count: number;
  views_count: number;
  liked: boolean;
  disliked: boolean;
  tags: string[];
  course_name?: string;
  course_id?: number;
  instructor?: string;
  created_at: string;
  comments_count?: number;
  /** 视频时长（秒） */
  duration_seconds?: number;
  /** Phase 3: 6 维筛选字段 */
  creation_type?: string;
  application_scenes?: string[];
  tool_chain?: string[];
  art_style?: string;
  secondary_tags?: string[];
  difficulty?: string;
  /** Phase C: 积分锁 */
  unlocked?: boolean;
  unlock_cost?: number;
}

/** GalleryComment 类型 */
export interface GalleryComment {
  id: number;
  gallery_id: number;
  user_id?: number;
  author: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

// 后端 category 英文值 → 前端中文显示
const CATEGORY_LABEL: Record<string, string> = {
  'text-to-image': '文生图',
  'text-to-video': '文生视频',
  'image-to-image': '图生图',
  'image-to-video': '图生视频',
  'song-video': '歌曲短视频',
  'virtual-streamer': '虚拟主播',
};

/**
 * 将后端 camelCase 数据映射为前端 snake_case
 * 后台 API 服务器 (3001) 返回 { imageUrl, avatarUrl, likes, comments, courseName, createdAt }
 */
export function normalizeGalleryItem(raw: any): GalleryItem {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    media_type: raw.media_type ?? raw.mediaType ?? 'image',
    scene: raw.scene ?? undefined,
    style: raw.style ?? undefined,
    tech_type: raw.tech_type ?? raw.techType ?? undefined,
    image_url: raw.imageUrl ?? raw.image_url ?? '',
    video_url: raw.videoUrl ?? raw.video_url ?? undefined,
    author: raw.author ?? '匿名',
    avatar_url: raw.avatarUrl ?? raw.avatar_url ?? '',
    category: raw.category ?? undefined,
    likes_count: raw.likes ?? raw.likes_count ?? 0,
    dislikes_count: raw.dislikes_count ?? 0,
    views_count: raw.views_count ?? 0,
    liked: raw.liked ?? false,
    disliked: raw.disliked ?? false,
    creation_type: raw.creation_type ?? undefined,
    application_scenes: raw.application_scenes ?? [],
    tool_chain: raw.tool_chain ?? [],
    art_style: raw.art_style ?? undefined,
    secondary_tags: raw.secondary_tags ?? [],
    difficulty: raw.difficulty ?? undefined,
    tags: raw.tags ?? [],
    course_name: raw.courseName ?? raw.course_name ?? undefined,
    course_id: raw.course_id ?? undefined,
    instructor: raw.instructor ?? undefined,
    created_at: raw.createdAt ?? raw.created_at ?? '',
    comments_count: raw.comments ?? raw.comments_count ?? 0,
    duration_seconds: raw.duration_seconds ?? raw.durationSeconds ?? undefined,
    unlocked: raw.unlocked ?? false,
    unlock_cost: raw.unlockCost ?? raw.unlock_cost ?? 0,
  };
}

// 降级用 Mock 数据
const MOCK_GALLERY: GalleryItem[] = [
  // === 文生图 (text-to-image) ×3 ===
  { id: 1, title: "水墨层峦 · AI山水画", description: "可灵AI文生图：层峦叠嶂，云海翻涌，古寺隐现于山间，飞鸟盘旋天际，意境悠远。", media_type: 'image', image_url: "https://p4-fdl.klingai.com/ksc2/uZgqi_xvE-0oyPgMhpqNVvXbitzbGhnVjl20bpetQpzO1r1b", author: "张三", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=张三&backgroundColor=c8b898&textColor=0d0d0d", likes_count: 42, dislikes_count: 3, views_count: 1256, liked: false, disliked: false, category: "text-to-image", tech_type: "image", scene: "风景", style: "水墨国风", tags: ["水墨","山水","国风","意境"], course_name: "M2 · 提示词入门", created_at: "2026-06-01", comments_count: 8 },
  { id: 2, title: "赛博霓虹 · 雨夜街巷", description: "可灵AI文生图：赛博朋克中国风城市夜景，霓虹灯与全息光影交织，雨夜路面反射彩色灯光，电影感十足。", media_type: 'image', image_url: "https://p4-fdl.klingai.com/ksc2/GMXfBl1oH0u8k-nHPIFf-EQO68V3odgW3IRmtk6kOeM6Bu8q", author: "李四", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=李四&backgroundColor=206683&textColor=ffffff", likes_count: 38, dislikes_count: 1, views_count: 892, liked: false, disliked: false, category: "text-to-image", tech_type: "image", scene: "城市", style: "赛博朋克", tags: ["赛博朋克","城市","霓虹","夜景"], course_name: "M2 · 提示词入门", created_at: "2026-06-01", comments_count: 5 },
  { id: 3, title: "敦煌飞天 · AI数字艺术", description: "可灵AI文生图：敦煌壁画风格数字艺术，飞天仙女手持琵琶，飘带翻飞，金色沙漠与石窟背景，高细节高画质。", media_type: 'image', image_url: "https://p4-fdl.klingai.com/ksc2/NI90PAbb1Q8Bsgn5y9TudfvE-LxokGttrOyHFeR5C67QdrPR", author: "王五", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=王五&backgroundColor=b93a32&textColor=ffffff", likes_count: 56, dislikes_count: 4, views_count: 2103, liked: false, disliked: false, category: "text-to-image", tech_type: "image", scene: "奇幻", style: "敦煌国潮", tags: ["敦煌","飞天","国潮","数字艺术"], course_name: "M2 · 提示词入门", created_at: "2026-06-01", comments_count: 12 },

  // === 文生视频 (text-to-video) ×3 ===
  { id: 4, title: "星际穿越 · AI科幻短片", description: "可灵AI文生视频：宇宙飞船穿越绚丽星门，星云流转，光影交错，史诗级视觉体验。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/uZgqi_xvE-0oyPgMhpqNVvXbitzbGhnVjl20bpetQpzO1r1b", video_url: 'https://v4-fdl.kechuangai.com/ksc2/mGrKhc0b4bIpEdRpYFwRRW9LYzp6_xolVnwvS5YROWvcP', author: "赵六", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=赵六&backgroundColor=4a90a8&textColor=ffffff", likes_count: 29, dislikes_count: 5, views_count: 667, liked: false, disliked: false, category: "text-to-video", tech_type: "video", scene: "太空", style: "科幻", tags: ["科幻","星际","AI视频","短片"], course_name: "M1 · AI视频工具全景", created_at: "2026-06-02", comments_count: 4 },
  { id: 5, title: "汉服美人 · AI古风短片", description: "可灵AI文生视频：汉服美人立于古建筑前，微风拂动衣袂和发丝，落花纷飞，电影级画质。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/GMXfBl1oH0u8k-nHPIFf-EQO68V3odgW3IRmtk6kOeM6Bu8q", video_url: 'https://v4-fdl.kechuangai.com/ksc2/k0yReGSKx4FCrV-Z4nRTQYjf4wZxfk8sYJV5-lBgRcSdi', author: "孙七", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=孙七&backgroundColor=c8b898&textColor=0d0d0d", likes_count: 71, dislikes_count: 6, views_count: 3201, liked: false, disliked: false, category: "text-to-video", tech_type: "video", scene: "古风", style: "古典唯美", tags: ["古风","汉服","国风","AI视频"], course_name: "M1 · AI视频工具全景", created_at: "2026-06-02", comments_count: 15 },
  { id: 6, title: "日照金山 · AI自然奇观", description: "可灵AI文生视频：航拍视角喜马拉雅山脉日照金山，云海翻涌，金色阳光洒在雪山顶上，震撼壮丽。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/NI90PAbb1Q8Bsgn5y9TudfvE-LxokGttrOyHFeR5C67QdrPR", video_url: 'https://v4-fdl.kechuangai.com/ksc2/UsfpmRFKH_clZ2TQ8qrEbAmy4eoZeMAJ_EXQBy7JdVEmM', author: "周八", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=周八&backgroundColor=206683&textColor=ffffff", likes_count: 94, dislikes_count: 8, views_count: 4500, liked: true, disliked: false, category: "text-to-video", tech_type: "video", scene: "自然", style: "写实风光", tags: ["自然","雪山","航拍","风光"], course_name: "M1 · AI视频工具全景", created_at: "2026-06-02", comments_count: 22 },

  // === 图生视频 (image-to-video) ×3 ===
  { id: 7, title: "墨韵流转 · 图生视频", description: "静态水墨山水画转化为动态影像，云雾在山间流动，飞鸟盘旋，古寺在晨光中若隐若现。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/uZgqi_xvE-0oyPgMhpqNVvXbitzbGhnVjl20bpetQpzO1r1b", video_url: 'https://media.w3.org/2010/05/sintel/trailer.mp4', author: "吴九", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=吴九&backgroundColor=b93a32&textColor=ffffff", likes_count: 63, dislikes_count: 2, views_count: 1845, liked: false, disliked: false, category: "image-to-video", tech_type: "video", scene: "风景", style: "水墨国风", tags: ["图生视频","水墨","动态","意境"], course_name: "M3 · AI视频制作入门", created_at: "2026-06-03", comments_count: 9 },
  { id: 8, title: "霓虹幻动 · 图生视频", description: "赛博朋克夜景动态化，霓虹灯闪烁，雨夜街道光影变幻，氛围感十足。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/GMXfBl1oH0u8k-nHPIFf-EQO68V3odgW3IRmtk6kOeM6Bu8q", video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm', author: "郑十", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=郑十&backgroundColor=4a90a8&textColor=ffffff", likes_count: 48, dislikes_count: 2, views_count: 1567, liked: false, disliked: false, category: "image-to-video", tech_type: "video", scene: "城市", style: "赛博朋克", tags: ["图生视频","赛博朋克","夜景","动态"], course_name: "M3 · AI视频制作入门", created_at: "2026-06-03", comments_count: 11 },

  // === 歌曲MV (song-video) ×3 ===
  { id: 9, title: "烟雨行舟 · AI音乐MV", description: "AI国风原创音乐MV，烟雨江南轻舟而行，古筝琵琶相伴，如诗如画。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/uZgqi_xvE-0oyPgMhpqNVvXbitzbGhnVjl20bpetQpzO1r1b", video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', author: "陈小北", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=陈小北&backgroundColor=8b1a1a&textColor=ffffff", likes_count: 44, dislikes_count: 1, views_count: 1340, liked: false, disliked: false, category: "song-video", tech_type: "music", scene: "古风", style: "水墨国风", tags: ["MV","国风","音乐","烟雨"], course_name: "M4 · 综合创作", created_at: "2026-06-03", comments_count: 7 },
  { id: 10, title: "霓虹旋律 · AI潮流MV", description: "赛博朋克风格AI音乐MV，霓虹灯光随节奏律动，城市夜景与电音完美融合。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/GMXfBl1oH0u8k-nHPIFf-EQO68V3odgW3IRmtk6kOeM6Bu8q", video_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', author: "林小南", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=林小南&backgroundColor=c8b898&textColor=0d0d0d", likes_count: 87, dislikes_count: 3, views_count: 2780, liked: false, disliked: false, category: "song-video", tech_type: "music", scene: "城市", style: "赛博朋克", tags: ["MV","赛博朋克","音乐","潮流"], course_name: "M4 · 综合创作", created_at: "2026-06-03", comments_count: 14 },
  { id: 11, title: "丝路飞天 · AI敦煌MV", description: "敦煌主题AI音乐MV，飞天壁画与国潮音乐融合，金色沙漠与绚丽彩带交织，视觉盛宴。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/NI90PAbb1Q8Bsgn5y9TudfvE-LxokGttrOyHFeR5C67QdrPR", video_url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', author: "齐小天", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=齐小天&backgroundColor=206683&textColor=ffffff", likes_count: 52, dislikes_count: 2, views_count: 1890, liked: false, disliked: false, category: "song-video", tech_type: "music", scene: "奇幻", style: "敦煌国潮", tags: ["MV","敦煌","国潮","音乐"], course_name: "M4 · 综合创作", created_at: "2026-06-03", comments_count: 9 },

  // === 图生图 (image-to-image) ×3 ===
  { id: 12, title: "水墨幻境 · 风格迁移", description: "写实摄影通过AI风格迁移转化为水墨画意境，真实与艺术的完美融合。", media_type: 'image', image_url: "https://p4-fdl.klingai.com/ksc2/uZgqi_xvE-0oyPgMhpqNVvXbitzbGhnVjl20bpetQpzO1r1b", author: "黄小海", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=黄小海&backgroundColor=b93a32&textColor=ffffff", likes_count: 35, dislikes_count: 1, views_count: 980, liked: false, disliked: false, category: "image-to-image", tech_type: "image", scene: "风景", style: "水墨国风", tags: ["风格迁移","水墨","图生图","AI滤镜"], course_name: "M5 · 进阶技巧", created_at: "2026-06-04", comments_count: 6 },
  { id: 13, title: "夜色重构 · 风格迁移", description: "AI风格迁移将日景转化为赛博朋克夜景，色彩重构与光影渲染，普通街景变科幻大片。", media_type: 'image', image_url: "https://p4-fdl.klingai.com/ksc2/GMXfBl1oH0u8k-nHPIFf-EQO68V3odgW3IRmtk6kOeM6Bu8q", author: "龙小飞", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=龙小飞&backgroundColor=4a90a8&textColor=ffffff", likes_count: 41, dislikes_count: 1, views_count: 1150, liked: false, disliked: false, category: "image-to-image", tech_type: "image", scene: "城市", style: "赛博朋克", tags: ["风格迁移","赛博朋克","图生图","色彩重构"], course_name: "M5 · 进阶技巧", created_at: "2026-06-04", comments_count: 5 },
  { id: 14, title: "古韵新生 · 风格迁移", description: "敦煌壁画的AI风格迁移作品，不同风格艺术元素融合，创造全新视觉体验。", media_type: 'image', image_url: "https://p4-fdl.klingai.com/ksc2/NI90PAbb1Q8Bsgn5y9TudfvE-LxokGttrOyHFeR5C67QdrPR", author: "唐小风", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=唐小风&backgroundColor=c8b898&textColor=0d0d0d", likes_count: 52, dislikes_count: 2, views_count: 1890, liked: false, disliked: false, category: "image-to-image", tech_type: "image", scene: "奇幻", style: "敦煌国潮", tags: ["风格迁移","敦煌","图生图","融合"], course_name: "M5 · 进阶技巧", created_at: "2026-06-04", comments_count: 9 },

  // === 额外图生视频 (image-to-video) ×1 补齐4类 ===
  { id: 15, title: "敦煌飞天 · 动态壁画", description: "敦煌飞天图化为动态，仙女飘带随风舞动，金色沙漠光芒流动，充满神秘感的动态壁画。", media_type: 'video', image_url: "https://p4-fdl.klingai.com/ksc2/NI90PAbb1Q8Bsgn5y9TudfvE-LxokGttrOyHFeR5C67QdrPR", video_url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Volcano_Lava_Sample.webm', author: "白小墨", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=白小墨&backgroundColor=206683&textColor=ffffff", likes_count: 78, dislikes_count: 3, views_count: 2340, liked: false, disliked: false, category: "image-to-video", tech_type: "video", scene: "奇幻", style: "敦煌国潮", tags: ["图生视频","敦煌","飞天","国潮"], course_name: "M3 · AI视频制作入门", created_at: "2026-06-04", comments_count: 10 },

  // === 教学作品 (course-demo) — L4·综合实战 ×6 ===
  { id: 16, title: "5W1H提示词对比", description: "同一主题（猫）的5W1H不同提示词对比，展示提示词结构对AI生成结果的影响。", media_type: 'image', image_url: "https://ccav.com/images/gallery/work_01.png", author: "AI视频制作教材", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=教材&backgroundColor=c8b898&textColor=0d0d0d", likes_count: 0, dislikes_count: 0, views_count: 0, liked: false, disliked: false, category: "course-demo", tech_type: "image", scene: "教学", style: "教学示范", stage: "L4·综合实战", tags: ["教学","5W1H","提示词","对比"], course_name: "M4 · 综合创作", created_at: "2026-06-04", comments_count: 0 },
  { id: 17, title: "月下抚琴 · 水墨画", description: "月夜下古人在山巅抚琴，墨色渲染，意境幽远，展示AI水墨画创作技巧。", media_type: 'image', image_url: "https://ccav.com/images/gallery/work_02.png", author: "AI视频制作教材", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=教材&backgroundColor=c8b898&textColor=0d0d0d", likes_count: 0, dislikes_count: 0, views_count: 0, liked: false, disliked: false, category: "course-demo", tech_type: "image", scene: "古风", style: "水墨国风", stage: "L4·综合实战", tags: ["教学","水墨","古风","月下抚琴"], course_name: "M4 · 综合创作", created_at: "2026-06-04", comments_count: 0 },
  { id: 18, title: "赛博朋克概念艺术", description: "赛博朋克风格未来城市概念艺术图，展示AI在概念设计中的创作能力。", media_type: 'image', image_url: "https://ccav.com/images/gallery/work_03.png", author: "AI视频制作教材", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=教材&backgroundColor=206683&textColor=ffffff", likes_count: 0, dislikes_count: 0, views_count: 0, liked: false, disliked: false, category: "course-demo", tech_type: "image", scene: "城市", style: "赛博朋克", stage: "L4·综合实战", tags: ["教学","赛博朋克","概念艺术","城市"], course_name: "M4 · 综合创作", created_at: "2026-06-04", comments_count: 0 },
  { id: 19, title: "AI视频素材链", description: "AI视频创作全流程素材链展示，从文字脚本到分镜再到成片的完整工作流。", media_type: 'image', image_url: "https://ccav.com/images/gallery/work_04.png", author: "AI视频制作教材", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=教材&backgroundColor=b93a32&textColor=ffffff", likes_count: 0, dislikes_count: 0, views_count: 0, liked: false, disliked: false, category: "course-demo", tech_type: "image", scene: "教学", style: "教学示范", stage: "L4·综合实战", tags: ["教学","素材链","工作流","AI视频"], course_name: "M4 · 综合创作", created_at: "2026-06-04", comments_count: 0 },
  { id: 20, title: "同主题四宫格", description: "同一主体（竹）四种不同风格的四宫格对比图，展示AI风格迁移与多风格应用。", media_type: 'image', image_url: "https://ccav.com/images/gallery/work_05.png", author: "AI视频制作教材", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=教材&backgroundColor=4a90a8&textColor=ffffff", likes_count: 0, dislikes_count: 0, views_count: 0, liked: false, disliked: false, category: "course-demo", tech_type: "image", scene: "古风", style: "多风格对比", stage: "L4·综合实战", tags: ["教学","四宫格","风格对比","AI创作"], course_name: "M4 · 综合创作", created_at: "2026-06-04", comments_count: 0 },
  { id: 21, title: "景别合集", description: "远景、全景、中景、近景、特写五种景别的AI生成对比图，展示AI对不同景别构图的控制能力。", media_type: 'image', image_url: "https://ccav.com/images/gallery/work_06.jpg", author: "AI视频制作教材", avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=教材&backgroundColor=8b1a1a&textColor=ffffff", likes_count: 0, dislikes_count: 0, views_count: 0, liked: false, disliked: false, category: "course-demo", tech_type: "image", scene: "教学", style: "教学示范", stage: "L4·综合实战", tags: ["教学","景别","镜头","构图"], course_name: "M4 · 综合创作", created_at: "2026-06-04", comments_count: 0 },
];

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/** 获取作品列表（先请求后端 API 再降级到 Mock，支持 tech_type/scene/style 三维交叉查询） */
export async function getGalleryItems(opts?: {
  tech_type?: string;
  scene?: string;
  style?: string;
  tag?: string;
  category?: string;
  // Phase 3: 6 维筛选参数
  creation_type?: string;
  application_scene?: string;
  tool_chain?: string;
  art_style?: string;
  secondary_tag?: string;
  difficulty?: string;
  page?: number;
  pageSize?: number;
}): Promise<GalleryItem[]> {
  const { tech_type, scene, style, tag, category,
          creation_type, application_scene, tool_chain, art_style, secondary_tag, difficulty,
          page, pageSize } = opts || {};
  // 优先请求后端 API (直连 3001)
  const params = new URLSearchParams();
  if (tech_type) params.set('tech_type', tech_type);
  if (scene) params.set('scene', scene);
  if (style) params.set('style', style);
  if (tag) params.set('tag', tag);
  if (category) params.set('category', category);
  // Phase 3: 6 维参数
  if (creation_type) params.set('creation_type', creation_type);
  if (application_scene) params.set('application_scenes', application_scene);
  if (tool_chain) params.set('tool_chain', tool_chain);
  if (art_style) params.set('art_style', art_style);
  if (secondary_tag) params.set('secondary_tags', secondary_tag);
  if (difficulty) params.set('difficulty', difficulty);
  if (page) params.set('page', String(page));
  if (pageSize) params.set('pageSize', String(pageSize));
  const queryStr = params.toString();
  const url = `${GALLERY_API_BASE}/gallery${queryStr ? '?' + queryStr : ''}`;
  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const body = await res.json();
      // 后端格式: { code: 0, data: [] }
      const rawItems: any[] = body.data ?? [];
      if (rawItems.length > 0) {
        return rawItems.map(normalizeGalleryItem);
      }
    }
  } catch (e) {
    console.warn('Gallery API unavailable, falling back to Mock', e);
  }
  // 降级到Mock — 前端模拟交叉查询
  let mock = MOCK_GALLERY.map(it => ({ ...it }));
  if (category) mock = mock.filter(it => it.category === category);
  if (tag) mock = mock.filter(it => it.tags.includes(tag));
  if (tech_type) mock = mock.filter(it => it.tech_type === tech_type);
  if (scene) mock = mock.filter(it => it.scene === scene);
  if (style) mock = mock.filter(it => it.style === style);
  return mock;
}

/** Gallery API 统一请求封装 */
export async function galleryFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  const base = GALLERY_API_BASE;
  const url = `${base}/gallery${path.startsWith('/') ? path : '/' + path}`;
  try {
    const merged = { ...options };
    merged.headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options?.headers as Record<string, string> ?? {}),
    };
    const res = await fetch(url, merged);
    if (res.ok) {
      const body = await res.json();
      return body.data ?? body ?? null;
    }
  } catch {
    // API 不可用时静默失败
  }
  return null;
}

/** 点赞/取消点赞（返回当前态度） */
export async function toggleLike(itemId: number): Promise<{ liked: boolean; disliked: boolean; likes_count: number; dislikes_count: number } | null> {
  return galleryFetch<{ liked: boolean; disliked: boolean; likes_count: number; dislikes_count: number }>(
    `${itemId}/like`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
  );
}

/** 鄙视/取消鄙视（返回当前态度） */
export async function toggleDislike(itemId: number): Promise<{ liked: boolean; disliked: boolean; likes_count: number; dislikes_count: number } | null> {
  return galleryFetch<{ liked: boolean; disliked: boolean; likes_count: number; dislikes_count: number }>(
    `${itemId}/dislike`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
  );
}

/** 记录浏览量 */
export async function recordView(itemId: number): Promise<number | null> {
  const result = await galleryFetch<{ views_count?: number }>(
    `${itemId}/view`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
  );
  return result?.views_count ?? null;
}

/** 提交评论 */
export async function submitComment(itemId: number, content: string): Promise<boolean> {
  const result = await galleryFetch<{ success?: boolean }>(
    `${itemId}/comments`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    },
  );
  return result?.success ?? false;
}

/** 获取作品评论列表 */
export async function getGalleryComments(galleryId: number): Promise<GalleryComment[]> {
  const result = await galleryFetch<GalleryComment[]>(`${galleryId}/comments`);
  return result ?? [];
}

/** Phase C: 解锁作品（消耗积分） — 后端反代路径 /api/gallery/{id}/unlock */
export async function unlockWork(
  itemId: number
): Promise<{ success: boolean; message?: string } | null> {
  return galleryFetch<{ success: boolean; message?: string }>(
    `${itemId}/unlock`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
  );
}
