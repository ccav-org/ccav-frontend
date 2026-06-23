"use client";

import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Sparkles, Star, Shield, Zap } from "lucide-react";
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
      <main className="min-h-screen pb-20"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(60,80,70,0.15) 0%, transparent 60%), " +
          "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(40,60,50,0.12) 0%, transparent 60%), " +
          "#0d0d0d",
      }}
    >
      {/* 远处的山水装饰 */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[300px] opacity-[0.04] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 200px 100px at 10% 80%, #4a6, transparent), " +
            "radial-gradient(ellipse 150px 120px at 40% 90%, #5a7, transparent), " +
            "radial-gradient(ellipse 180px 80px at 70% 85%, #3a5, transparent)"
        }}
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="text-center pt-20 pb-12 px-4">
          <div
            className="inline-block px-4 py-1.5 rounded-full border text-xs mb-6"
            style={{ borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.4)" }}
          >
            对标 T/CCPS 0041—2026团体标准 · 6级98课时
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <span className="block mb-1" style={{ color: "#c8b898" }}>
              不写一行代码
            </span>
            <span style={{ color: "#c8b898" }}>
              把你的文字灵感变成高质感大片
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            专为学习AI 视频创作者打造。从注册到成片，全流程在浏览器内完成。
            <br />
            <span style={{ color: "rgba(255,255,255,0.5)" }}>
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
                    border: "1px solid rgba(32,102,131,0.15)",
                    color: "#c8c0b0",
                  }}
                >
                  <span style={{ color: "#206683" }}>{s.n}.</span> {s.label}
                </span>
                {i < stepLabels.length - 1 && (
                  <span className="inline-block text-lg font-bold mx-1"
                    style={{ color: "rgba(185,58,50,0.3)" }}>▸</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            全程鼠标点选，无需任何代码基础
          </p>

          {/* CTA 按钮 */}
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/courses/"
              className="inline-block px-7 py-[10px] rounded-lg font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #b93a32, #8b1a1a)",
              }}
            >
              探索课程
            </Link>
            <Link
              href="/playground/"
              className="inline-block px-7 py-[10px] rounded-lg font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #20b8c8, #0d8a9a)",
              }}
            >
              AI 工坊
            </Link>
          </div>
        </section>

        {/* 学生课程体系 */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <div className="text-lg text-[#c8b898]/60 -mt-4 mb-3">——✦——✦——✦——</div>
            <h2 className="text-2xl md:text-3xl serif font-bold text-white mt-2 mb-3">
              学生课程体系
            </h2>
            <p className="max-w-xl mx-auto text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}>
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
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="p-6">
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-lg font-bold"
                        style={{ color: "white", fontFamily: "'Noto Serif SC', serif" }}
                      >
                        {course.level} · {course.title}
                      </h3>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2"
                        style={{
                          color: "#206683",
                          background: "rgba(32,102,131,0.10)",
                          border: "1px solid rgba(32,102,131,0.20)",
                        }}
                      >
                        {course.duration}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {course.subtitle}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium px-3 py-1 rounded"
                      style={{
                        background: "rgba(180,160,120,0.1)",
                        border: "1px solid rgba(180,160,120,0.2)",
                        color: "#c8b898",
                      }}
                    >
                      {course.price}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {course.format}
                    </span>
                  </div>
                  {course.outcomes && course.outcomes.length > 0 && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded whitespace-nowrap"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        🎯 学习成果：{course.outcomes[0]}
                      </span>
                      <Link
                        href={`/courses/${course.id}/`}
                        className="float-right flex items-center gap-1 text-xs transition-all"
                        style={{ color: "#4a90a8" }}
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
              style={{ color: "white", fontFamily: "'Noto Serif SC', serif" }}>
              专业方向 · 即将上线
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
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
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.08)",
                  opacity: 0.85,
                }}
              >
                <span
                  className="absolute top-2 right-2 text-[9px] px-2 py-[2px] rounded"
                  style={{
                    background: "rgba(75,192,216,0.15)",
                    border: "1px solid rgba(75,192,216,0.25)",
                    color: "#4ac0d8",
                  }}
                >
                  选修
                </span>
                <div className="text-[40px] mb-3" style={{ opacity: 0.85 }}>
                  {dir.icon}
                </div>
                <div className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {dir.title}
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {dir.desc}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            学完L1-L4基础后可选修 · 敬请期待
          </p>
        </section>

        {/* 师资培训 */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div
            className="p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">

              <div className="flex-1">
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  师训课程
                </span>
                <h2 className="text-xl font-bold mt-2 mb-2" style={{ color: "white", fontFamily: "'Noto Serif SC', serif" }}>
                  师资培训 · 从学员到认证讲师
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  专为想成为AI视频讲师的学员设计。5天线下集训，全部实操使用免费API，零代码实现从文生图到完整教学视频的全流程。
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <span>📚 30课时</span>
                  <span>📅 线下集训（5天）</span>
                  <span>🏅 通过即获认证</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold" style={{ color: "#c8b898", fontFamily: "'Noto Serif SC', serif" }}>
                    ¥3,999
                  </span>
                  <Link
                    href="/training/"
                    className="inline-block px-7 py-[10px] rounded-lg font-semibold text-white text-sm transition-all"
                    style={{
                      background: "linear-gradient(135deg, #b93a32, #8b1a1a)",
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
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  backdropFilter: "blur(5px)",
                }}
              >
                {i === 0 ? (
                  <>
                    <div className="text-[30px] font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.06em", color: "rgba(255,255,255,0.5)" }}>T/CCPS</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: "white", fontFamily: "'Noto Serif SC', serif" }}>{item.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {item.desc.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3" style={{ opacity: 0.5 }}>
                      <span className="text-[56px]">{item.icon}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: "white", fontFamily: "'Noto Serif SC', serif" }}>
                      {item.title}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
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
