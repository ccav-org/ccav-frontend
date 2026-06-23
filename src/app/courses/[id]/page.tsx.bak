import { Clock, Users, Award, ArrowLeft, BookOpen, CheckCircle, Flame, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LessonCard from "@/components/courses/LessonCard";
import { studentCourses, trainingCourse } from "@/lib/courseData";

export function generateStaticParams() {
  const allCourses = [...studentCourses, trainingCourse];
  return allCourses.map((course) => ({
    id: course.id,
  }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const allCourses = [...studentCourses, trainingCourse];
  const course = allCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-32 text-center">
          <h1 className="text-2xl text-[#f0f6fc]">课程不存在</h1>
          <Link href="/courses/" className="text-[#58a6ff] mt-4 inline-block">
            返回课程列表
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        {/* ===== Hero ===== */}
        <section className={`py-16 bg-gradient-to-br ${course.gradient || "from-[#1e1e2e] to-[#181825]"}`}>
          <div className="max-w-4xl mx-auto px-5">
            <Link
              href="/courses/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回课程列表
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                {course.level}
              </span>
              {course.tags?.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 text-white/90 text-xs">
                  <Flame className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-white/90 mb-6">{course.subtitle}</p>
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> {course.modules}个模块
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {course.format}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" /> {course.certification}
              </span>
            </div>
          </div>
        </section>

        {/* ===== Content ===== */}
        <section className="py-12 bg-[#0d1117]">
          <div className="max-w-4xl mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* --- Main --- */}
              <div className="lg:col-span-2 space-y-10">
                {/* 课程介绍 */}
                <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                  <h2 className="text-xl font-semibold text-[#f0f6fc] mb-4">课程介绍</h2>
                  <p className="text-[#c9d1d9] leading-relaxed">{course.description}</p>
                </div>

                {/* 模块 & 每节课详情 */}
                {course.modules_list.map((module, index) => (
                  <div key={module.title} className="space-y-4">
                    {/* 模块标题 */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-[#f0f6fc]">
                        <span className="text-[#58a6ff] mr-2">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {module.title}
                      </h2>
                      <span className="text-sm text-[#8b949e] bg-[#161b22] px-3 py-1 rounded-full">
                        {module.duration}
                      </span>
                    </div>

                    {/* 模块内容列表 */}
                    <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d]">
                      <ul className="space-y-2">
                        {module.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#c9d1d9]">
                            {item.startsWith("🔥") ? (
                              <Flame className="w-4 h-4 text-[#d2991d] mt-0.5 shrink-0" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-[#3fb950] mt-0.5 shrink-0" />
                            )}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 每节课详情（如果有 lessons 数据） */}
                    {module.lessons && module.lessons.length > 0 && (
                      <div className="space-y-3">
                        {module.lessons.map((lesson, li) => {
                          // 综合计算全局课时序号
                          const lessonGlobalIndex = (() => {
                            let gi = 0;
                            for (const m of course.modules_list) {
                              if (m === module && m.lessons) {
                                // 当前模块，计算偏移
                                const start = gi;
                                return start + li + 1;
                              }
                              gi += m.lessons ? m.lessons.length : 0;
                            }
                            return li + 1;
                          })();
                          // 第1课永远是当前课
                          const isFirstLesson = lessonGlobalIndex === 1;
                          return (
                            <LessonCard
                              key={li}
                              lesson={lesson}
                              index={lessonGlobalIndex}
                              courseId={course.id}
                              isCurrentLesson={isFirstLesson}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* 学习成果 */}
                <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                  <h2 className="text-xl font-semibold text-[#f0f6fc] mb-4">学习成果</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.outcomes.map((outcome, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#c9d1d9]">
                        <Award className="w-5 h-5 text-[#58a6ff]" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- Sidebar --- */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] sticky top-24">
                  <div className="text-3xl font-bold text-[#f0f6fc] mb-2">{course.price}</div>
                  <div className="text-sm text-[#8b949e] mb-6">含证书费用</div>

                  <div className="space-y-3">
                    <a
                      href="mailto:contact@ccav.com"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#e53e3e] to-[#c53030] text-white font-semibold hover:shadow-lg hover:shadow-[#e53e3e]/20 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      邮件咨询
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] font-semibold hover:border-[#58a6ff]/50 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      在线咨询（即将上线）
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#30363d] space-y-3 text-sm">
                    <div className="flex justify-between text-[#c9d1d9]">
                      <span className="text-[#8b949e]">目标学员</span>
                      <span className="text-right ml-4">{course.targetAudience}</span>
                    </div>
                    <div className="flex justify-between text-[#c9d1d9]">
                      <span className="text-[#8b949e]">学习形式</span>
                      <span>{course.format}</span>
                    </div>
                    <div className="flex justify-between text-[#c9d1d9]">
                      <span className="text-[#8b949e]">课程时长</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-[#c9d1d9]">
                      <span className="text-[#8b949e]">证书</span>
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
