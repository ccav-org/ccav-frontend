"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Coins,
  Gift,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Star,
  Users,
  MessageSquare,
  Award,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import {
  COST,
  EARNING,
  INITIAL_CREDITS,
  LEVEL_LABELS,
  MODEL_MULTIPLIER,
} from "@/lib/credits";
import Link from "next/link";

export default function CreditsPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "积分体系" }]} />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-5">
          {/* 返回链接 */}
          <div className="mb-6">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 text-sm text-[rgba(0,0,0,0.5)] hover:text-[#2563eb] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回 AI 工坊
            </Link>
          </div>

          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium mb-4">
              <Coins className="w-5 h-5" />
              积分系统
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-3">
              积分获取与消耗规则
            </h1>
            <p className="text-[rgba(0,0,0,0.5)] max-w-2xl mx-auto">
              平台采用积分机制管理 AI 服务资源
            </p>
          </motion.div>

          {/* 积分获取 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[rgba(37,99,235,0.08)] flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#22c55e]" />
              <h2 className="text-lg font-bold text-[#1e293b]">获取积分</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(EARNING).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[rgba(37,99,235,0.08)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {{
                          daily_checkin: "☀️",
                          complete_lesson: "📝",
                          complete_course: "🎓",
                          work_featured: "⭐",
                          invite_friend: "👥",
                          community_post: "📢",
                          instructor_rating: "🏆",
                        }[key] || "💎"}
                      </span>
                      <div>
                        <p className="text-sm text-[rgba(0,0,0,0.6)] font-medium">
                          {{
                            daily_checkin: "每日签到",
                            complete_lesson: "完成一节课",
                            complete_course: "完成一门课（过考）",
                            work_featured: "作品被精选",
                            invite_friend: "邀请好友注册",
                            community_post: "社区投稿（审核通过）",
                            instructor_rating: "教师获得好评",
                          }[key] || key}
                        </p>
                      </div>
                    </div>
                    <span className="text-[#22c55e] font-bold text-lg">
                      +{val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 积分消耗 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[rgba(37,99,235,0.08)] flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-[#d2991d]" />
              <h2 className="text-lg font-bold text-[#1e293b]">消耗积分</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(COST).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[rgba(37,99,235,0.08)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {{
                          prompt_optimize: "✨",
                          text_to_image: "🖼️",
                          text_to_video: "🎬",
                          image_to_video: "🎞️",
                        }[key] || "⚡"}
                      </span>
                      <div>
                        <p className="text-sm text-[rgba(0,0,0,0.6)] font-medium">
                          {{
                            prompt_optimize: "提示词优化",
                            text_to_image: "文生图",
                            text_to_video: "文生视频",
                            image_to_video: "图生视频",
                          }[key] || key}
                        </p>
                        <p className="text-xs text-[rgba(0,0,0,0.5)]">
                          基准价 · 不同模型有倍率
                        </p>
                      </div>
                    </div>
                    <span className="text-[#d2991d] font-bold text-lg">
                      {val}分
                    </span>
                  </div>
                ))}
              </div>

              {/* 模型倍率 */}
              <div className="mt-5 p-4 rounded-xl bg-white border border-[rgba(37,99,235,0.08)]">
                <p className="text-sm text-[rgba(0,0,0,0.5)] mb-3 font-medium">
                  模型倍率（消耗 = 基准分 × 倍率）
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(MODEL_MULTIPLIER).filter(([k]) => k !== "default").map(([model, multiplier]) => (
                    <span
                      key={model}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-xs text-[rgba(0,0,0,0.6)]"
                    >
                      {{
                        kling: "🇨🇳 可灵",
                        chatgpt: "🤖 ChatGPT",
                        midjourney: "🎨 Midjourney",
                        runway: "🎥 Runway",
                        sora: "✨ Sora",
                      }[model] || model}
                      ：<span className="text-[#d2991d] font-medium">{multiplier}x</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 初始积分 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[rgba(37,99,235,0.08)] flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#bc8cff]" />
              <h2 className="text-lg font-bold text-[#1e293b]">初始积分</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-[rgba(0,0,0,0.5)] mb-4">
                注册时根据用户身份一次性发放：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(INITIAL_CREDITS).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-white border border-[rgba(37,99,235,0.08)] text-center"
                  >
                    <p className="text-sm text-[rgba(0,0,0,0.6)] font-medium">
                      {LEVEL_LABELS[key] || key}
                    </p>
                    <p className="text-2xl font-bold text-[#bc8cff] mt-1">
                      {val}
                    </p>
                    <p className="text-xs text-[rgba(0,0,0,0.5)] mt-1">初始积分</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 使用提示 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-gradient-to-br from-white to-[rgba(37,99,235,0.03)] border border-[rgba(37,99,235,0.08)] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-[rgba(37,99,235,0.08)] flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#d2991d]" />
              <h2 className="text-lg font-bold text-[#1e293b]">积分使用技巧</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-[rgba(0,0,0,0.6)]">
                <CheckCircle className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <p>每日签到是稳定获取积分的方式，别忘了每天来打卡</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-[rgba(0,0,0,0.6)]">
                <CheckCircle className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <p>选择国内模型（可灵）消耗积分更少，性价比高</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-[rgba(0,0,0,0.6)]">
                <CheckCircle className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <p>完成课程考核可获得大量积分，还能提升等级</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-[rgba(0,0,0,0.6)]">
                <CheckCircle className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
                <p>邀请好友注册，双方都能获得积分加成</p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
