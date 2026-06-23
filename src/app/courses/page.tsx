"use client";

import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Sparkles, Star, Shield, Zap, BookOpen, Target, Award } from "lucide-react";
import { studentCourses } from "@/lib/courseData";
import { Course } from "@/lib/courseData";

const nCourses = studentCourses.filter((c) => c.outcomes && c.outcomes.length > 0);

const stepLabels = [
  { n: "1", label: "接入免费API" },
  { n: "2", label: "输入故事灵感" },
  { n: "3", label: "一键分镜生图" },
  { n: "4", label: "画面动态渲染" },
  { n: "5", label: "智能配乐配音" },
];

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "课程体系" }]} />
      <main className="min-h-screen pb-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(14,165,233,0.03) 0%, transparent 60%), " +
            "#f8fafc",
        }}
      >
      <div className="relative z-10">
        {/* Hero */}
        <section className="text-center pt-20 pb-12 px-4">
          <div
            className="inline-block px-4 py-1.5 rounded-full border text-xs mb-6"
            style={{ borderColor: "rgba(37,99,235,0.15)", color: "#2563eb" }}
          >
            对标 T/CCPS 0041—2026团体标准 · 6级98课时
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <span className="block mb-1" style={{ color: "#1e293b" }}>
              不写一行代码
            </span>
            <span style={{ color: "#2563eb" }}>
              把你的文字灵感变成高质感大片
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: "rgba(0,0,0,0.5)" }}>
            专为AI视频创作者打造。从注册到成片，全流程在浏览器内完成。
            <br />
            <span style={{ color: "rgba(0,0,0,0.4)" }}>
              无需高配电脑，用免费API即可开启AI视觉创作之路。
            </span>
          </p>

          {/* 五步骤条 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {stepLabels.map((s, i) => (
              <span key={i}>
                <span
                  className="inline-block px-[18px] py-[8px] rounded-full text-sm transition-all cursor-pointer"
                  style={{
                    border: "1px solid rgba(37,99,235,0.15)",
                    color: "#475569",
                    background: "rgba(37,99,235,0.03)",
                  }}
                >
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>{s.n}.</span> {s.label}
                </span>
                {i < stepLabels.length - 1 && (
                  <span className="inline-block text-lg font-bold mx-1"
                    style={{ color: "rgba(37,99,235,0.3)" }}>▸</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
            全程鼠标点选，无需任何代码基础
          </p>

          {/* CTA 按钮 */}
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/playground/"
              className="inline-block px-7 py-[10px] rounded-lg font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              }}
            >
              AI 工坊
            </Link>
          </div>
        </section>

        {/* 学生课程体系 */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <div className="text-lg -mt-4 mb-3" style={{ color: "rgba(37,99,235,0.4)" }}>——✦——✦——✦——</div>
            <h2 className="text-2xl md:text-3xl serif font-bold mt-2 mb-3"
              style={{ color: "#1e293b" }}>
              学生课程体系
            </h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: "rgba(0,0,0,0.4)" }}>
              不讲废话，全部动手。从第一条提示词到完整AI视频作品，每一步都在浏览器里完成。
            </p>
          </div>

          {/* 6部课程卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nCourses.map((course: Course, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer transition-all"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="p-6">
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-lg font-bold"
                        style={{ color: "#1e293b", fontFamily: "'Noto Serif SC', serif" }}
                      >
                        {course.level} · {course.title}
                      </h3>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2"
                        style={{
                          color: "#2563eb",
                          background: "rgba(37,99,235,0.08)",
                          border: "1px solid rgba(37,99,235,0.15)",
                        }}
                      >
                        {course.duration}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: "rgba(0,0,0,0.4)" }}>
                      {course.subtitle}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(0,0,0,0.5)" }}>
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium px-3 py-1 rounded"
                      style={{
                        background: "rgba(37,99,235,0.06)",
                        border: "1px solid rgba(37,99,235,0.12)",
                        color: "#2563eb",
                      }}
                    >
                      {course.price}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
                      {course.format}
                    </span>
                  </div>
                  {course.outcomes && course.outcomes.length > 0 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                      <div className="flex flex-col gap-1 mb-2">
                        <span className="text-[11px] font-medium" style={{ color: "rgba(0,0,0,0.45)" }}>🎯 学习成果</span>
                        <div className="flex flex-col gap-0.5">
                          {course.outcomes.slice(0, 3).map((o: string, oi: number) => (
                            <span key={oi} className="text-xs" style={{ color: "rgba(0,0,0,0.5)" }}>
                              · {o}
                            </span>
                          ))}
                          {course.outcomes.length > 3 && (
                            <span className="text-[10px]" style={{ color: "rgba(0,0,0,0.35)" }}>
                              +{course.outcomes.length - 3} 项更多
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/courses/${course.id}/`}
                        className="float-right flex items-center gap-1 text-xs transition-all"
                        style={{ color: "#2563eb" }}
                      >
                        查看详情 <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 专业方向预告 — 四方向 */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-10">
            <div className="text-2xl mb-2">🚀</div>
            <h2 className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: "#1e293b", fontFamily: "'Noto Serif SC', serif" }}>
              专业方向 · 即将上线
            </h2>
            <p className="text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>
              完成基础课程后，按职业方向选修深造
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🎬", title: "商业广告", desc: "产品广告全链路" },
              { icon: "🚀", title: "科幻短片", desc: "VFX特效合成" },
              { icon: "🎭", title: "动漫短剧", desc: "角色一致性创作" },
              { icon: "📱", title: "自媒体口播", desc: "数字人批量产出" },
            ].map((dir, i) => (
              <div
                key={i}
                className="relative rounded-xl p-6 text-center transition-all"
                style={{
                  background: "#ffffff",
                  border: "1px dashed rgba(0,0,0,0.12)",
                  opacity: 0.85,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <span
                  className="absolute top-2 right-2 text-[9px] px-2 py-[2px] rounded"
                  style={{
                    background: "rgba(14,165,233,0.10)",
                    border: "1px solid rgba(14,165,233,0.20)",
                    color: "#0ea5e9",
                  }}
                >
                  选修
                </span>
                <div className="text-[40px] mb-3" style={{ opacity: 0.85 }}>
                  {dir.icon}
                </div>
                <div className="text-sm font-medium mb-1" style={{ color: "#334155" }}>
                  {dir.title}
                </div>
                <div className="text-xs" style={{ color: "rgba(0,0,0,0.45)" }}>
                  {dir.desc}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "rgba(0,0,0,0.4)" }}>
            学完L1-L4基础后可选修 · 敬请期待
          </p>
        </section>

        {/* 师资培训 */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div
            className="p-6 md:p-8"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">

              <div className="flex-1">
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    color: "rgba(0,0,0,0.5)",
                  }}
                >
                  师训课程
                </span>
                <h2 className="text-xl font-bold mt-2 mb-2" style={{ color: "#1e293b", fontFamily: "'Noto Serif SC', serif" }}>
                  师资培训 · 从学员到认证讲师
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(0,0,0,0.5)" }}>
                  专为想成为AI视频讲师的学员设计。5天线下集训，全部实操使用免费API，零代码实现从文生图到完整教学视频的全流程。
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs mb-5" style={{ color: "rgba(0,0,0,0.4)" }}>
                  <span>📚 30课时</span>
                  <span>📅 线下集训（5天）</span>
                  <span>🏅 通过即获认证</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold" style={{ color: "#2563eb", fontFamily: "'Noto Serif SC', serif" }}>
                    ¥3,999
                  </span>
                  <Link
                    href="/teacher-training/"
                    className="inline-block px-7 py-[10px] rounded-lg font-semibold text-white text-sm transition-all"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    }}
                  >
                    了解详情
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 底部背书 */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📜", title: "6大团标等级", desc: "严格对标 T/CCPS 0041\n含金量十足的学习路径" },
              { icon: "🎓", title: "5天师资跃升", desc: "专为教育者设计的实操课\n通过考核解锁官方认证讲师" },
              { icon: "⚡", title: "0硬件门槛", desc: "告别昂贵显卡与繁琐配置\n有浏览器就能开启AI创作" },
            ].map((item, i) => (
              <div
                key={i}
                className={"rounded-2xl p-6 transition-all " + (i === 0 ? "text-right" : "text-center -mt-8")}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {i === 0 ? (
                  <>
                    <div className="text-[30px] font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.06em", color: "rgba(37,99,235,0.4)" }}>T/CCPS</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: "#1e293b", fontFamily: "'Noto Serif SC', serif" }}>{item.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.45)" }}>
                      {item.desc.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3" style={{ opacity: 0.5 }}>
                      <span className="text-[56px]">{item.icon}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: "#1e293b", fontFamily: "'Noto Serif SC', serif" }}>
                      {item.title}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.45)" }}>
                      {item.desc.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
