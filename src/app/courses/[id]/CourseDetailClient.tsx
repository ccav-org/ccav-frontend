"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, Award, ArrowLeft, BookOpen, CheckCircle, Flame,
  Mail, MessageCircle, ChevronRight, MapPin, GraduationCap,
  Users, BadgeCheck, Star, PlayCircle, Shield, Target,
  Layers, FileText, Download, Headphones, BarChart3
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { studentCourses, trainingCourse } from "@/lib/courseData";
import { getGalleryItems, GalleryItem } from "@/lib/api";

// ── 教材章节对照表：课程ID → 教材对应章节 ──
const TEXTBOOK_MAP: Record<string, { chapter: string; pages: string }> = {
  part1: { chapter: "第一篇", pages: "p.1-48" },
  part2: { chapter: "第二篇", pages: "p.48-96" },
  part3: { chapter: "第三篇", pages: "p.97-144" },
  part4: { chapter: "第四篇", pages: "p.145-192" },
  part5: { chapter: "第五篇", pages: "p.193-240" },
  part6: { chapter: "第六篇", pages: "p.241-288" },
};

// ── 每个模块对应的「产出/实训成果」标签 ──
const MODULE_OUTCOME_MAP: Record<string, Record<string, string[]>> = {
  part1: {
    "认识AIGC": ["审美基准建立", "工具注册"],
    "动手尝试": ["第一个AI作品"],
    "持续成长": ["学习路径规划"],
  },
  part2: {
    "AI文本生成": ["3分钟视频剧本"],
    "文生图实战": ["故事版分镜头"],
    "图生视频": ["多镜头视频片段"],
    "创作整合": ["完整AI短片"],
  },
  part3: {
    "AI视频生成": ["连续动态视频片段"],
    "AI音乐生成": ["背景音乐+音效"],
    "AI画外音": ["AI配音解说"],
    "多素材整合": ["图文声乐完整作品"],
  },
  part4: {
    "精修技法": ["瑕疵修复+画质增强"],
    "调色进阶": ["3种风格调色预设"],
    "剪辑技巧": ["节奏剪辑卡点"],
    "综合精修": ["商业级精修片段"],
  },
  part5: {
    "品牌视频": ["30秒品牌视频"],
    "广告短片": ["15秒信息流广告"],
    "课程微课": ["5分钟教学视频"],
    "音乐MV": ["AI音乐MV"],
    "全流程实战": ["完整商业项目"],
  },
  part6: {
    "独立创作": ["选题立项+全流程制作"],
    "作品打磨": ["迭代优化"],
    "系列创作": ["系列作品"],
    "作品集制作": ["个人作品集"],
    "投递展示": ["投稿+面世"],
  },
};

// ── 输出标签的颜色映射 ──
const OUTCOME_COLORS = [
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-sky-50 text-sky-700 border-sky-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
];

export default function CourseDetailClient({ id }: { id: string }) {
  const allCourses = [...studentCourses, trainingCourse];
  const course = allCourses.find((c) => c.id === id);

  // ── 作品墙懒加载 ──
  const [galleryWorks, setGalleryWorks] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    getGalleryItems({}).then((data) => {
      setGalleryWorks(data.slice(0, 4));
      setGalleryLoading(false);
    }).catch(() => {
      setGalleryLoading(false);
    });
  }, []);

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-32 text-center">
          <h1 className="text-2xl text-gray-900">课程不存在</h1>
          <Link href="/courses/" className="text-indigo-600 mt-4 inline-block">
            返回课程列表
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const textbook = TEXTBOOK_MAP[id];
  const moduleOutcomes = MODULE_OUTCOME_MAP[id];

  const textbookSuffix = textbook
    ? `对应教材${textbook.chapter}（${textbook.pages}）`
    : "";

  // ── Stat 数据 ──
  const stats = [
    { icon: Users, label: "累计学员", value: "500+", color: "text-blue-600 bg-blue-50" },
    { icon: Star, label: "好评率", value: "98%", color: "text-yellow-600 bg-yellow-50" },
    { icon: Award, label: "结业作品", value: "200+", color: "text-emerald-600 bg-emerald-50" },
    { icon: Flame, label: "活跃社群", value: "10+ 群", color: "text-rose-600 bg-rose-50" },
  ];

  // ── 侧边栏信息 ──
  const sidebarInfo = [
    { icon: Clock, label: "课程时长", value: course.duration },
    { icon: Layers, label: "模块数量", value: `${course.modules}个模块` },
    { icon: GraduationCap, label: "难度等级", value: course.level },
    { icon: FileText, label: "学习形式", value: course.format },
    { icon: Shield, label: "认证证书", value: course.certification },
    { icon: Target, label: "目标学员", value: course.targetAudience },
    { icon: GraduationCap, label: "授课专家", value: course.instructor || "CCAV专家教研组" },
  ];

  // ── 学习收获列表 ──
  const outcomes = course.outcomes || [];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* 背景装饰网格 */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
          <div className="relative max-w-6xl mx-auto px-5 py-12 md:py-16">
            <Link
              href="/courses/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              返回课程列表
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-end">
              {/* 左侧：标题 + 描述 */}
              <div className="lg:col-span-3 space-y-5">
                {/* 标签行 */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/20">
                    {course.level}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 text-xs font-medium border border-yellow-400/30">
                    <BadgeCheck className="w-3 h-3" />
                    {course.certification}
                  </span>
                  {course.tags && course.tags.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white/70 text-[11px]">
                      <Flame className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-base md:text-lg text-white/70 max-w-xl">
                  {course.subtitle}
                </p>

                {/* 讲师简卡 */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    A
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">讲师团队</p>
                    <p className="text-xs text-white/50">AI视频创作 · 行业资深</p>
                  </div>
                </div>

                {/* 统计条 */}
                <div className="flex flex-wrap gap-6 pt-2">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <stat.icon className="w-4 h-4 text-white/50" />
                      <div>
                        <span className="text-white font-bold text-sm">{stat.value}</span>
                        <span className="text-white/50 text-xs ml-1">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右侧：封面/CTA */}
              <div className="lg:col-span-2 space-y-4">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <PlayCircle className="w-12 h-12 mx-auto mb-2 text-white/30" />
                      <p className="text-xs text-white/30">课程预告片</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div>
                    <span className="text-2xl font-bold text-white">{course.price}</span>
                    <span className="text-xs text-white/50 ml-2">含证书</span>
                  </div>
                  <a
                    href="mailto:contact@ccav.com"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#e53e3e] to-[#c53030] text-white font-semibold text-sm hover:shadow-lg hover:shadow-red-500/20 transition-all shrink-0"
                  >
                    立即报名
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 主体内容区（左右分栏） ═══════════════════ */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ─── 左侧主内容 ─── */}
              <div className="lg:col-span-2 space-y-8">

                {/* ① 课程简介 */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    课程简介
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{course.description}</p>
                  {textbook && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg px-4 py-3">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>搭配{textbookSuffix}</span>
                    </div>
                  )}
                </div>

                {/* ② 你将获得（学习收获）*/}
                {outcomes.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      你将获得
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ③ 课程大纲 */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    课程大纲
                  </h2>
                  <div className="space-y-3">
                    {course.modules_list.map((module, index) => {
                      const outcomes = moduleOutcomes?.[module.title.replace(/ ·.*$/, "").replace(/^M\d+：/, "")];
                      return (
                        <Link
                          key={module.title}
                          href={`/courses/${course.id}/lessons/${index}`}
                        >
                          <div className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-300/50 hover:bg-white transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 text-xs font-bold">
                                  {index + 1}
                                </span>
                                <h3 className="font-medium text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                                  {module.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">{module.duration}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                            {outcomes && outcomes.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2 ml-10">
                                {outcomes.map((oc, oi) => (
                                  <span
                                    key={oc}
                                    className={`text-[10px] px-2 py-0.5 rounded-full border ${OUTCOME_COLORS[oi % OUTCOME_COLORS.length]}`}
                                  >
                                    🎯 {oc}
                                  </span>
                                ))}
                              </div>
                            )}
                            <ul className="space-y-1 ml-10">
                              {module.content.slice(0, 3).map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                                  {item.startsWith("🔥") ? (
                                    <Flame className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                                  )}
                                  {item}
                                </li>
                              ))}
                              {module.content.length > 3 && (
                                <li className="text-[11px] text-indigo-600 ml-5">+{module.content.length - 3} 节课 →</li>
                              )}
                            </ul>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ─── 右侧边栏 ─── */}
              <div className="space-y-6">

                {/* 课程信息卡 */}
                <div className="p-5 rounded-2xl bg-white border border-gray-200 sticky top-24">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    课程信息
                  </h3>
                  <div className="space-y-3">
                    {sidebarInfo.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <item.icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-400">{item.label}</p>
                          <p className="text-sm text-gray-800">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 价格 + 报名按钮 */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-gray-900">{course.price}</span>
                      <span className="text-xs text-gray-400">含证书</span>
                    </div>
                    <a
                      href="mailto:contact@ccav.com"
                      className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e53e3e] to-[#c53030] text-white font-semibold text-sm text-center hover:shadow-lg hover:shadow-red-400/20 transition-all"
                    >
                      立即报名
                    </a>
                    <p className="text-[10px] text-gray-400 text-center mt-2">报名后即可开始学习</p>
                  </div>

                  {/* 咨询入口 */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <a
                      href="mailto:contact@ccav.com"
                      className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>邮件咨询</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      <MessageCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>在线客服</span>
                    </a>
                  </div>
                </div>

                {/* 教材样章下载 */}
                {textbook && (
                  <div className="p-5 rounded-2xl bg-white border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      教材样章
                    </h4>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900">《AIGC视频创作完全指南》</p>
                        <p className="text-[10px] text-gray-400">{textbook.chapter} · {textbook.pages}</p>
                      </div>
                      <button
                        onClick={() => alert("教材样章物料准备中，敬请期待 🚧")}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-700 transition-colors shrink-0"
                      >
                        <Download className="w-3 h-3 inline-block mr-1" />
                        下载
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 推荐课程 ═══════════════════ */}
        <section className="py-10 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">推荐课程</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allCourses.filter(c => c.id !== course.id).slice(0, 4).map((rec) => (
                <Link key={rec.id} href={`/courses/${rec.id}`}>
                  <div className="p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:border-indigo-300/50 transition-all h-full">
                    <div className={`w-full h-20 rounded-lg mb-3 bg-gradient-to-br ${rec.gradient} flex items-center justify-center`}>
                      <span className="text-2xl">{rec.level?.includes("第") ? rec.level.replace("部", "") : "M"}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{rec.title}</h3>
                    <p className="text-xs text-gray-400">{rec.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 作品墙 — ⑤项目实训 ═══ */}
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                学员作品展示
              </h2>
              <Link href="/gallery/" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                查看全部 <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {galleryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-video rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : galleryWorks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryWorks.map((work) => (
                  <Link key={work.id} href={`/gallery/${work.id}`}>
                    <div className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-md transition-all">
                      {work.image_url ? (
                        <img
                          src={work.image_url}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          暂无封面
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs font-medium truncate">{work.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* ═══ 业务关联入口 ═══ */}
        <section className="py-10 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ③ 线下网点入口 */}
              <Link href="/contact/" className="group p-5 rounded-2xl bg-white border border-gray-200 hover:border-indigo-400/50 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">线下网点</p>
                    <p className="text-xs text-gray-500">全国线下合作网点查询</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 shrink-0" />
                </div>
              </Link>

              {/* ④ 教师培训入口 */}
              <Link href="/teacher-training/" className="group p-5 rounded-2xl bg-white border border-gray-200 hover:border-indigo-400/50 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">教师认证培训咨询</p>
                    <p className="text-xs text-gray-500">成为持证AI视频讲师</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 shrink-0" />
                </div>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 底部留白 */}
      <div className="h-4" />

      <Footer />
    </>
  );
}
