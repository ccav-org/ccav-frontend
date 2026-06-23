/**
 * 积分系统配置
 *
 * 后续可迁移至数据库/后端配置，当前作为前端常量和文档
 */

// ─── 初始积分（注册时一次性发放）──────────────────────────────
export const INITIAL_CREDITS = {
  register: 100,       // 注册用户（试玩）
  primary:  500,       // 初级学生（L0–L1 通过后）
  intermediate: 2000,  // 中级学生（L2–L3 通过后）
  advanced:  5000,     // 高级学生（师训）
  instructor: 500,     // 认证教师
} as const;

// ─── 消耗公式（基准分，以可灵为基准）─────────────────────────
export const COST = {
  prompt_optimize: 1,   // 每次 Kimi 提示词优化
  text_to_image:   5,   // 每张文生图
  text_to_video:   20,  // 每条文生视频
  image_to_video:  8,   // 每张图生视频
} as const;

// ─── 模型倍率（相对于基准分）────────────────────────────────
export const MODEL_MULTIPLIER: Record<string, number> = {
  kling:    1,    // 可灵（基准）
  chatgpt:  5,    // ChatGPT Image/Video
  midjourney: 3,  // Midjourney
  runway:   4,    // Runway Gen
  sora:     6,    // OpenAI Sora
  default:  1,
};

/** 计算实际消耗积分 = 基准分 × 模型倍率 */
export function computeCost(task: keyof typeof COST, model: string): number {
  const base = COST[task] || 1;
  const multiplier = MODEL_MULTIPLIER[model] ?? MODEL_MULTIPLIER.default;
  return base * multiplier;
}

// ─── 赚取方式 ──────────────────────────────────────────────
export const EARNING = {
  daily_checkin:   5,   // 每日签到
  complete_lesson: 10,  // 交作业
  complete_course: 100, // 通过考核（过考）
  work_featured:   15,  // 作品被精选
  invite_friend:   200, // 推荐好友注册（好友完成首课）
  community_post:  1,   // 社区发布作品/教程（经审核）
  instructor_rating: 5, // 教师获得好评
} as const;

// ─── 显示用标签 ────────────────────────────────────────────
export const LEVEL_LABELS: Record<string, string> = {
  register: "注册用户",
  primary: "初级学员",
  intermediate: "中级学员",
  advanced: "高级学员（师训）",
  instructor: "认证教师",
};
