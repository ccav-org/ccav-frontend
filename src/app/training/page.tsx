"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Flame, Mail, MessageCircle, Lightbulb } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import { useState, useEffect, useRef } from "react";
import { getCourse } from "@/lib/api";
import { trainingCourse as staticTrainingCourse } from "@/lib/courseData";
import type { Course, LessonDetail } from "@/lib/courseData";

// 防止 hydrate mismatch：确保 SSR 和首次客户端渲染完全一致
// 仅在客户端真正 mount 后才用 API 数据覆盖
function useSafeClientState<T>(staticValue: T, loader?: () => Promise<T>): [T, boolean] {
  const [state, setState] = useState(staticValue);
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    if (loader) {
      loader().then((data) => {
        if (data && mounted.current) {
          setState(data);
          setLoaded(true);
        }
      }).catch(() => {
        setLoaded(true); // 加载失败也不影响
      });
    } else {
      setLoaded(true);
    }
    return () => { mounted.current = false; };
  }, [loader]);

  return [state, loaded];
}

export default function TrainingPage() {
  // SSR 时使用静态数据保证 hydrate 一致
  // 客户端 mount 后尝试获取 API 数据覆盖（但只更新可用字段，保留静态数据兜底）
  const [apiCourse, setApiCourse] = useState<Partial<Course> | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    getCourse("training").then((data) => {
      if (data) {
        setApiCourse(data as Partial<Course>);
      }
    });
  }, []);

  // 合并静态数据和 API 数据：API 字段优先，缺失字段回退到静态数据
  const course = apiCourse
    ? { ...staticTrainingCourse, ...apiCourse }
    : staticTrainingCourse;

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "面授培训" }]} />
      <main className="min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(14,165,233,0.03) 0%, transparent 60%), " +
            "#f8fafc",
        }}
      >
        {/* Hero */}
        <section className="pt-20 pb-12"
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(14,165,233,0.03) 100%)",
            borderBottom: "1px solid rgba(37,99,235,0.08)",
          }}
        >
          <div className="max-w-4xl mx-auto px-5">
            <Link
              href="/courses/"
              className="inline-flex items-center gap-2 mb-6 transition-colors no-underline"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              返回课程列表
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: "rgba(37,99,235,0.08)", color: "#2563eb" }}
              >
                {course.level}
              </span>
              {course.tags?.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{ background: "rgba(37,99,235,0.05)", color: "rgba(0,0,0,0.5)" }}
                >
                  <Flame className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
            <div className="mb-4 flex items-center gap-4">
              <span className="text-5xl leading-none">🎓</span>
              <h1 className="text-3xl md:text-4xl font-bold flex-1"
                style={{ color: "#1e293b" }}
              >
                {course.title}
              </h1>
            </div>
            <p className="text-lg mb-6" style={{ color: "rgba(0,0,0,0.55)" }}>{course.subtitle}</p>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>
              <span>5天高强度集训</span>
              <span>30课时</span>
              <span>{course.format}</span>
            </div>

          </div>
        </section>

        {/* Content */}
        <section className="py-12" style={{ background: "#f8fafc" }}>
          <div className="max-w-4xl mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="p-6 rounded-2xl border shadow-sm"
                  style={{ background: "#ffffff", borderColor: "rgba(37,99,235,0.08)" }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"
                    style={{ color: "#1e293b" }}
                  >
                    <span className="w-1 h-5 rounded-full" style={{ background: "#2563eb" }} />
                    培训介绍
                  </h2>
                  <p className="leading-relaxed" style={{ color: "rgba(0,0,0,0.6)" }}>{course.description}</p>
                </div>

                {/* Day by Day — 30课时详细课程列表 */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2"
                    style={{ color: "#1e293b" }}
                  >
                    <span className="w-1 h-5 rounded-full" style={{ background: "#2563eb" }} />
                    5天 · 30课时详细课程
                  </h2>
                  {course.modules_list?.length > 0 && course.modules_list.map((mod: any, mi: number) => (
                    <div key={mi} className="space-y-3">
                      {/* 模块标题 */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg" style={{ color: "#1e293b" }}>
                          <span style={{ color: "rgba(0,0,0,0.4)" }}>Day {mi + 1}</span> · {mod.title.replace(/^Day \d+[：: ]?/, '')}
                        </h3>
                        <span className="text-sm" style={{ color: "rgba(0,0,0,0.4)" }}>{mod.duration} · {mod.lessons?.length || mod.content?.length || 0}课时</span>
                      </div>
                      
                      {/* 课时列表 */}
                      <div className="grid grid-cols-1 gap-2">
                        {(mod.lessons?.length > 0 ? mod.lessons : (mod.content || []).map((c: string) => ({
                          title: c.replace(/^🔥 /, ''),
                          isPractical: c.startsWith('🔥'),
                          summary: '',
                          keyConcept: { title: '', description: '' },
                          homework: ''
                        }))).map((lesson: any, li: number) => (
                          <Link
                            key={li}
                            href={`/courses/training/lessons/${mi}/${li}`}
                            className="block group"
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: li * 0.05 }}
                              className="relative p-4 rounded-xl border transition-all duration-300 cursor-pointer"
                              style={{
                                background: "#ffffff",
                                borderColor: "rgba(37,99,235,0.08)",
                              }}
                            >
                              <div className="flex items-start gap-3">
                                {/* 序号 */}
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                  style={{
                                    background: "rgba(37,99,235,0.05)",
                                    border: "1px solid rgba(37,99,235,0.15)",
                                    color: "#2563eb",
                                  }}
                                >
                                  {li + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium truncate"
                                      style={{ color: "#1e293b" }}
                                    >
                                      {lesson.title}
                                    </h4>
                                    {lesson.isPractical && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs shrink-0"
                                        style={{ background: "rgba(234,179,8,0.1)", color: "#a37c0e" }}
                                      >
                                        <Flame className="w-3 h-3" />实操
                                      </span>
                                    )}
                                  </div>
                                  {lesson.summary && (
                                    <p className="text-xs leading-relaxed line-clamp-2"
                                      style={{ color: "rgba(0,0,0,0.45)" }}
                                    >
                                      {lesson.summary}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-1.5">
                                    {lesson.keyConcept?.icon && (
                                      <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(0,0,0,0.3)" }}>
                                        <Lightbulb className="w-3 h-3" />
                                        {lesson.keyConcept.icon} {lesson.keyConcept.title?.slice(0, 15)}…
                                      </span>
                                    )}
                                    {lesson.selfTest && lesson.selfTest.length > 0 && (
                                      <span className="text-xs" style={{ color: "rgba(0,0,0,0.3)" }}>
                                        {lesson.selfTest.length}题·自测
                                      </span>
                                    )}
                                    <span className="ml-auto text-xs transition-opacity"
                                      style={{ color: "#2563eb", opacity: 0 }}
                                    >
                                      查看详情 →
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Outcomes */}
                <div className="p-6 rounded-2xl border shadow-sm"
                  style={{ background: "#ffffff", borderColor: "rgba(37,99,235,0.08)" }}
                >
                  <h2 className="text-xl font-semibold mb-4" style={{ color: "#1e293b" }}>培训成果</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(course.outcomes || []).map((outcome: string, i: number) => (
                      <div key={i} className="flex items-center gap-2" style={{ color: "rgba(0,0,0,0.6)" }}>
                        <CheckCircle className="w-5 h-5" style={{ color: "#2563eb" }} />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border shadow-sm lg:sticky lg:top-24"
                  style={{ background: "#ffffff", borderColor: "rgba(37,99,235,0.08)" }}
                >
                  <div className="text-3xl font-bold mb-2" style={{ color: "#1e293b" }}>{course.price}</div>
                  <div className="text-sm mb-6" style={{ color: "rgba(0,0,0,0.4)" }}>含证书费用</div>
                  
                  <div className="space-y-3">
                    <a
                      href="mailto:contact@ccav.com?subject=师资培训报名咨询"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold transition-all active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
                    >
                      <Mail className="w-4 h-4" />
                      邮件咨询报名
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border font-semibold transition-all"
                      style={{
                        background: "#f8fafc",
                        borderColor: "rgba(37,99,235,0.15)",
                        color: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      在线咨询（即将上线）
                    </a>
                  </div>

                  <div className="mt-6 pt-6 space-y-3 text-sm"
                    style={{ borderTop: "1px solid rgba(37,99,235,0.08)" }}
                  >
                    <div className="flex justify-between" style={{ color: "rgba(0,0,0,0.6)" }}>
                      <span style={{ color: "rgba(0,0,0,0.4)" }}>目标学员</span>
                      <span className="text-right ml-4">{course.targetAudience}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: "rgba(0,0,0,0.6)" }}>
                      <span style={{ color: "rgba(0,0,0,0.4)" }}>学习形式</span>
                      <span>{course.format}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: "rgba(0,0,0,0.6)" }}>
                      <span style={{ color: "rgba(0,0,0,0.4)" }}>认证证书</span>
                      <span>{course.certification}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
