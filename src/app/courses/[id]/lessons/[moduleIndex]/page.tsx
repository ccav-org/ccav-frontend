import { ArrowLeft, Clock, Flame, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import { studentCourses, trainingCourse } from "@/lib/courseData";
import LessonCardLock from "@/components/LessonCardLock";

export function generateStaticParams() {
  const allCourses = [...studentCourses, trainingCourse];
  const params: { id: string; moduleIndex: string }[] = [];
  for (const course of allCourses) {
    for (let i = 0; i < course.modules_list.length; i++) {
      params.push({ id: course.id, moduleIndex: String(i) });
    }
  }
  return params;
}

type Props = {
  params: Promise<{ id: string; moduleIndex: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { id, moduleIndex: mIdxStr } = await params;
  const mIdx = parseInt(mIdxStr, 10);

  const allCourses = [...studentCourses, trainingCourse];
  const course = allCourses.find((c) => c.id === id);

  if (!course || !course.modules_list[mIdx]) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-32 text-center min-h-[60vh]">
          <h1 className="text-2xl text-[#1e293b]">模块不存在</h1>
          <Link href="/courses/" className="text-[#2563eb] mt-4 inline-block">
            返回课程列表
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const mod2 = course.modules_list[mIdx];
  const totalModules = course.modules_list.length;
  const prevModule = mIdx > 0 ? `/courses/${id}/lessons/${mIdx - 1}` : null;
  const nextModule = mIdx < totalModules - 1 ? `/courses/${id}/lessons/${mIdx + 1}` : null;

  const lessonRangeMatch = mod2.title.match(/第(\d+)-(\d+)课/);
  const lessonStart = lessonRangeMatch ? parseInt(lessonRangeMatch[1]) : 1;
  const lessonEnd = lessonRangeMatch ? parseInt(lessonRangeMatch[2]) : mod2.content.length;

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "课程体系", href: "/courses" }, { label: course.title, href: `/courses/${course.id}` }, { label: mod2.title }]} />
      <main className="flex-1">
        {/* Module Header */}
        <section className={`py-12 bg-gradient-to-br ${course.gradient}`}>
          <div className="max-w-4xl mx-auto px-5">
            <Link
              href={`/courses/${id}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回{course.title}
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                {course.level}
              </span>
              <span className="text-white/60 text-sm">
                模块 {mIdx + 1} / {totalModules}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {mod2.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {mod2.duration}
              </span>
              <span className="flex items-center gap-1">
                {mod2.content.length} 节课
              </span>
            </div>
          </div>
        </section>

        {/* Lesson Content */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-5">
            {/* Module Overview */}
            <div className="p-6 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] mb-8">
              <h2 className="text-xl font-semibold text-[#1e293b] mb-4">📋 模块概览</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.6)]">
                  所属课程：{course.title}
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.6)]">
                  课时范围：第{lessonStart}-{lessonEnd}课
                </span>
                <span className="px-3 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.6)]">
                  学习时长：{mod2.duration}
                </span>
              </div>
            </div>

            {/* Lesson Cards */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#1e293b]">📖 课程内容</h2>
              {mod2.content.map((lesson, i) => {
                const lessonNum = lessonStart + i;
                const isPractical = lesson.includes("🔥") || lesson.includes("实操");
                const cleanTitle = lesson.startsWith("🔥 ") ? lesson.replace("🔥 ", "") : lesson;
                // Check if detailed lesson data exists
                const kc = mod2.lessons?.[i]?.keyConcept;
                const hasDetail = mod2.lessons && mod2.lessons[i] && (Array.isArray(kc) ? kc.length > 0 : !!kc);
                return (
                  <LessonCardLock
                    key={i}
                    courseId={id}
                    moduleIndex={mIdx}
                    lessonIndex={i}
                    lessonUrl={`/courses/${id}/lessons/${mIdx}/${i}`}
                  >
                    <div className="p-5 rounded-xl bg-white border border-[rgba(37,99,235,0.08)] hover:border-[#2563eb]/50 hover:bg-[rgba(37,99,235,0.04)] transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isPractical 
                            ? "bg-gradient-to-br from-[#d2991d] to-[#e53e3e]" 
                            : "bg-gradient-to-br from-[#58a6ff] to-[#39d2c0]"
                        }`}>
                          <span className="text-white font-bold text-sm">{lessonNum}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[#1e293b] group-hover:text-[#2563eb] transition-colors">{cleanTitle}</h3>
                            {isPractical && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[#d2991d]/10 text-[#d2991d] border border-[#d2991d]/20">
                                <Flame className="w-3 h-3" />实操
                              </span>
                            )}
                            {hasDetail && (
                              <span className="text-xs text-[#3fb950] group-hover:underline">查看教案 →</span>
                            )}
                          </div>
                          {hasDetail && mod2.lessons![i].summary && (
                            <p className="text-xs text-[rgba(0,0,0,0.5)] line-clamp-2 mb-2">{mod2.lessons![i].summary}</p>
                          )}
                          <div className="mt-2 p-3 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] flex items-center justify-center h-10 text-xs text-[rgba(0,0,0,0.5)]">
                            <Play className="w-3 h-3 mr-1 text-[rgba(0,0,0,0.35)]" />
                            视频（即将上线）
                          </div>
                        </div>
                      </div>
                    </div>
                  </LessonCardLock>
                );
              })}
            </div>

            {/* Learning Checkpoints */}
            <div className="mt-8 p-6 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)]">
              <h2 className="text-xl font-semibold text-[#1e293b] mb-4">✅ 学习检查点</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mod2.content.map((lesson, i) => (
                  <div key={i} className="flex items-center gap-3 text-[rgba(0,0,0,0.6)]">
                    <div className="w-6 h-6 rounded-full border-2 border-[rgba(37,99,235,0.08)] flex items-center justify-center shrink-0">
                      <span className="text-xs text-[rgba(0,0,0,0.35)]">{i + 1}</span>
                    </div>
                    <span className="text-sm">
                      {lesson.startsWith("🔥 ") ? lesson.replace("🔥 ", "") : lesson}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between">
              {prevModule ? (
                <Link
                  href={prevModule}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.6)] hover:border-[#2563eb]/50 hover:text-[#2563eb] transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  上一模块
                </Link>
              ) : (
                <div />
              )}
              {nextModule && (
                <Link
                  href={nextModule}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] text-white font-semibold hover:shadow-lg transition-all"
                >
                  下一模块
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
