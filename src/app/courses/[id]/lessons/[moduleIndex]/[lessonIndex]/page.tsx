import { ArrowLeft, Flame, Play, Send, ChevronLeft, ChevronRight, Lightbulb, Video, Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import { studentCourses, trainingCourse, type LessonDetail } from "@/lib/courseData";
import QuizGate from "@/components/QuizGate";
import ProgressBar from "@/components/ProgressBar";
import LessonGate from "@/components/LessonGate";
import LessonComments from "@/components/LessonComments";

export function generateStaticParams() {
  const allCourses = [...studentCourses, trainingCourse];
  const params: { id: string; moduleIndex: string; lessonIndex: string }[] = [];
  for (const course of allCourses) {
    for (let m = 0; m < course.modules_list.length; m++) {
      const mod = course.modules_list[m];
      const max = mod.lessons?.length || mod.content.length;
      for (let l = 0; l < max; l++) {
        params.push({ id: course.id, moduleIndex: String(m), lessonIndex: String(l) });
      }
    }
  }
  return params;
}

type Props = {
  params: Promise<{ id: string; moduleIndex: string; lessonIndex: string }>;
};

export default async function LessonDetailPage({ params }: Props) {
  const { id, moduleIndex: mIdxStr, lessonIndex: lIdxStr } = await params;
  const mIdx = parseInt(mIdxStr, 10);
  const lIdx = parseInt(lIdxStr, 10);

  const allCourses = [...studentCourses, trainingCourse];
  const course = allCourses.find((c) => c.id === id);
  if (!course) return notFound();

  const isStudentCourse = studentCourses.some((sc) => sc.id === id);

  const mod = course.modules_list[mIdx];
  if (!mod) return notFound();

  // Build lesson from lessons array or fallback to content
  let lesson: LessonDetail;
  const totalLessons = mod.lessons?.length || mod.content.length;
  if (lIdx >= totalLessons) return notFound();

  if (mod.lessons && mod.lessons[lIdx]) {
    lesson = mod.lessons[lIdx];
  } else {
    // Fallback: build minimal lesson from content string
    const raw = mod.content[lIdx];
    const isPractical = raw.startsWith("🔥") || raw.includes("实操");
    const cleanTitle = raw.startsWith("🔥 ") ? raw.replace("🔥 ", "") : raw;
    lesson = {
      title: cleanTitle,
      isPractical,
      summary: "",
      keyConcept: { title: "", description: "" },
      homework: "待补充",
    };
  }

  const lessonNum = (() => {
    const match = mod.title.match(/第(\d+)-(\d+)课/);
    return match ? parseInt(match[1]) + lIdx : lIdx + 1;
  })();

  const prevLesson = lIdx > 0
    ? `/courses/${id}/lessons/${mIdx}/${lIdx - 1}`
    : mIdx > 0
      ? `/courses/${id}/lessons/${mIdx - 1}/${(course.modules_list[mIdx - 1].lessons?.length || course.modules_list[mIdx - 1].content.length) - 1}`
      : null;

  const nextLesson = lIdx < totalLessons - 1
    ? `/courses/${id}/lessons/${mIdx}/${lIdx + 1}`
    : mIdx < course.modules_list.length - 1
      ? `/courses/${id}/lessons/${mIdx + 1}/0`
      : null;

  return (
    <LessonGate courseId={id} moduleIndex={mIdx} lessonIndex={lIdx} requireAuth={isStudentCourse}>
      <Navbar />
      <Breadcrumbs items={[{ label: "课程体系", href: "/courses" }, { label: course.title, href: `/courses/${course.id}` }, { label: mod.title, href: `/courses/${course.id}/lessons/${mIdx}` }, { label: lesson.title }]} />
      <main className="flex-1">
        {/* ===== HEADER ===== */}
        <section className={`py-10 bg-gradient-to-br ${course.gradient}`}>
          <div className="max-w-5xl mx-auto px-5">
            <Link
              href={`/courses/${id}/lessons/${mIdx}`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回模块
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">{course.level}</span>
              <span className="text-white/50 text-xs">第{lessonNum}课 / 共98课</span>
              {lesson.isPractical && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">
                  <Flame className="w-3 h-3" /> 实操课
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              📚 第{lessonNum}课：{lesson.title}
            </h1>
            <p className="text-white/80 text-sm max-w-2xl">{lesson.summary}</p>
          </div>
        </section>

        {/* ===== 三层内容 ===== */}
        <section className="py-10 bg-white">
          <div className="max-w-5xl mx-auto px-5 space-y-8">

            {/* ─── ① 课前·自学层 ─── */}
            <LayerCard
              number="①"
              title="课前 · 自学"
              subtitle="对标课本阅读 · 约15分钟"
              color="border-l-[#22c55e]"
              bg="bg-[#22c55e]/5"
            >
  // 关键概念卡片
              {(() => { const concepts = Array.isArray(lesson.keyConcept) ? lesson.keyConcept : [lesson.keyConcept]; return concepts.length > 0 && concepts.map((kc, i) => (
                <div key={i} className="p-5 rounded-xl bg-white border border-[#22c55e]/20 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#22c55e]/15 flex items-center justify-center text-xl shrink-0">
                      {kc.icon || "💡"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e293b] mb-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-[#22c55e]" />
                        {kc.title}
                      </h3>
                      <p className="text-sm text-[rgba(0,0,0,0.5)] leading-relaxed">{kc.description}</p>
                    </div>
                  </div>
                </div>
              )); })()}

              {/* 先动手试试 */}
              {lesson.tryItPrompt && (
                <div className="p-5 rounded-xl bg-[#2563eb]/5 border border-[#2563eb]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-4 h-4 text-[#2563eb]" />
                    <span className="font-semibold text-[#2563eb] text-sm">先动手试试</span>
                  </div>
                  <p className="text-sm text-[rgba(0,0,0,0.6)] mb-3">别等老师讲，现在就打开Playground跑一次：</p>
                  <div className="p-4 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] font-mono text-sm text-[rgba(0,0,0,0.6)] mb-3">
                    {lesson.tryItPrompt}
                  </div>
                  <a
                    href="/playground/"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#39d2c0] text-white text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    去Playground试试 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* 🌍 海外学员：先动手试试 */}
              {lesson.tryItInternational && (
                <div className="mt-3 p-5 rounded-xl bg-[#d2991d]/5 border border-[#d2991d]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🌍</span>
                    <span className="font-semibold text-[#d2991d] text-sm">海外学员替代方案</span>
                  </div>
                  <p className="text-xs text-[rgba(0,0,0,0.5)] mb-2">无法注册可灵/即梦？用以下国际工具替代：</p>
                  <div className="p-4 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] font-mono text-sm text-[rgba(0,0,0,0.6)]">
                    {lesson.tryItInternational}
                  </div>
                </div>
              )}
            </LayerCard>

            {/* ─── ② 直播·课中层 ─── */}
            <LayerCard
              number="②"
              title="直播 · 课中"
              subtitle="对标视频课 · 约45分钟"
              color="border-l-[#bc8cff]"
              bg="bg-[#bc8cff]/5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#bc8cff]/15 flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6 text-[#bc8cff]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1e293b] mb-2">视频号直播 · 老师现场演示</h3>
                  <ul className="space-y-2 text-sm text-[rgba(0,0,0,0.5)]">
                    <li>• 老师不念书，直接屏幕演示操作全流程</li>
                    <li>• 学员跟练 + 实时连麦提问</li>
                    <li>• 每节课产出一个小作品</li>
                  </ul>
                  <div className="mt-4 p-4 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-center">
                    <p className="text-sm text-[rgba(0,0,0,0.5)]">📅 直播排期即将公布</p>
                    <p className="text-xs text-[rgba(0,0,0,0.35)] mt-1">直播回放将在课后自动归档到本页</p>
                  </div>
                </div>
              </div>
            </LayerCard>

            {/* ─── ③ 课后·巩固层 ─── */}
            <LayerCard
              number="③"
              title="课后 · 巩固"
              subtitle="对标练习册 · 灵活时间"
              color="border-l-[#d2991d]"
              bg="bg-[#d2991d]/5"
            >
              {/* 录播回放 */}
              <div className="p-4 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] mb-4 flex items-center gap-3">
                <Play className="w-5 h-5 text-[rgba(0,0,0,0.35)]" />
                <span className="text-sm text-[rgba(0,0,0,0.5)]">录播回放（课程上线后自动关联）</span>
              </div>

              {/* 课后作业 */}
              <div className="p-5 rounded-xl bg-white border border-[#d2991d]/20 mb-4">
                <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#d2991d]" />
                  课后作业
                </h3>
                <p className="text-sm text-[rgba(0,0,0,0.6)] leading-relaxed">{lesson.homework}</p>
              </div>

              {/* 🌍 海外学员：替代作业 */}
              {lesson.homeworkInternational && (
                <div className="p-5 rounded-xl bg-[#d2991d]/5 border border-[#d2991d]/20 mb-4">
                  <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
                    <span>🌍</span>
                    海外学员作业
                  </h3>
                  <p className="text-sm text-[rgba(0,0,0,0.6)] leading-relaxed">{lesson.homeworkInternational}</p>
                </div>
              )}

              {/* 进阶挑战 */}
              {lesson.advancedChallenge && (
                <div className="p-5 rounded-xl bg-white border border-[#e53e3e]/20 mb-4">
                  <h3 className="font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#e53e3e]" />
                    进阶挑战（选做）
                  </h3>
                  <p className="text-sm text-[rgba(0,0,0,0.6)] leading-relaxed">{lesson.advancedChallenge}</p>
                </div>
              )}

              {/* 下节预告 */}
              {lesson.nextPreview && (
                <div className="p-4 rounded-lg bg-white border border-[rgba(37,99,235,0.08)]">
                  <h3 className="text-xs text-[rgba(0,0,0,0.35)] uppercase mb-1">下节预告</h3>
                  <p className="text-sm text-[rgba(0,0,0,0.5)]">{lesson.nextPreview}</p>
                </div>
              )}
            </LayerCard>

            {/* ===== 进度考核层 ===== */}
            <ProgressBar courseId={id} moduleIndex={mIdx} lessonIndex={lIdx} />
            <QuizGate
              courseId={id}
              moduleIndex={mIdx}
              lessonIndex={lIdx}
              nextLessonUrl={nextLesson || undefined}
              selfTest={(mod.lessons && mod.lessons[lIdx]?.selfTest) ? mod.lessons[lIdx].selfTest : undefined}
            />

            {/* ===== 讨论区 ===== */}
            <LessonComments lessonKey={`day${mIdx+1}_lesson${lIdx+1}`} lessonTitle={`「${mod.title}」- ${lesson.title}`} />

            {/* ===== 底部导航 ===== */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(37,99,235,0.08)]">
              {prevLesson ? (
                <Link
                  href={prevLesson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.5)] hover:border-[#2563eb]/50 hover:text-[rgba(0,0,0,0.6)] text-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一课
                </Link>
              ) : <div />}

              <Link
                href={`/courses/${id}`}
                className="text-sm text-[rgba(0,0,0,0.35)] hover:text-[rgba(0,0,0,0.5)] transition-colors"
              >
                返回课程
              </Link>

              {nextLesson ? (
                <Link
                  href={nextLesson}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#bc8cff] text-white text-sm font-semibold hover:shadow-lg transition-all"
                >
                  下一课
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : <div />}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </LessonGate>
  );
}

// ===== 通用层卡片组件 =====
function LayerCard({
  number, title, subtitle, color, bg, children,
}: {
  number: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-[rgba(37,99,235,0.08)] ${bg} border-l-4 ${color} overflow-hidden`}>
      <div className="px-6 py-4 border-b border-[rgba(37,99,235,0.04)]">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] flex items-center justify-center text-sm font-bold text-[#1e293b]">
            {number}
          </span>
          <div>
            <h2 className="font-semibold text-[#1e293b]">{title}</h2>
            <p className="text-xs text-[rgba(0,0,0,0.5)]">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function notFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 text-center min-h-[60vh]">
        <h1 className="text-2xl text-[#1e293b]">课程不存在</h1>
        <Link href="/courses/" className="text-[#2563eb] mt-4 inline-block">返回课程列表</Link>
      </main>
      <Footer />
    </>
  );
}
