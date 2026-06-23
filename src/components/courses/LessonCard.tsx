"use client";

import { useState, useCallback } from "react";
import {
  Lightbulb, Sparkles, Play, GraduationCap,
  Link as LinkIcon, Monitor, BookOpenText, Lock,
  CheckCircle, XCircle, HelpCircle, AlertCircle
} from "lucide-react";
import type { LessonDetail, SelfTestQuestion, QuestionType } from "@/lib/courseData";

/* ===== 进度锁 localStorage key ===== */
function lockKey(courseId: string, lessonIndex: number) {
  return `ccav_lesson_${courseId}_${lessonIndex}`;
}

/* ===== 单节课三层面板 ===== */
export default function LessonCard({
  lesson,
  index,
  courseId,
  isCurrentLesson,
}: {
  lesson: LessonDetail;
  index: number;
  courseId: string;
  isCurrentLesson: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem(lockKey(courseId, index)) === "done"
  );

  // 锁定状态
  const locked = !isCurrentLesson && !completed;

  return (
    <div className={`border rounded-xl overflow-hidden bg-white transition-all ${
      locked ? "border-gray-200 opacity-60" : "border-gray-200"
    }`}>
      {/* 标题栏 */}
      <button
        onClick={() => {
          if (locked) return;
          setExpanded(!expanded);
        }}
        disabled={locked}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors text-left disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            locked
              ? "bg-gray-100 text-gray-400"
              : "bg-indigo-100 text-indigo-600"
          }`}>
            {locked ? <Lock className="w-3.5 h-3.5" /> : index}
          </span>
          <div>
            <span className={`font-medium ${locked ? "text-gray-400" : "text-gray-900"}`}>
              {locked ? "🔒 " : ""}{lesson.title}
            </span>
            {lesson.isPractical && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-600">
                实操
              </span>
            )}
            {completed && !locked && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-600">
                ✅ 已完成
              </span>
            )}
          </div>
        </div>
        {!locked && (
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {locked && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-3 flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            需完成上一课自测才能解锁
          </div>
        </div>
      )}

      {expanded && !locked && (
        <div className="px-4 pb-5 space-y-4 border-t border-gray-200 pt-4">
          {/* ① 课前/自学 */}
          <LayerSection
            icon={<BookOpenText className="w-4 h-4 text-indigo-600" />}
            label="课前 · 自学层"
            accent="text-indigo-600"
          >
            <p className="text-sm text-gray-700 leading-relaxed">{lesson.summary}</p>

            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-600">关键概念</span>
              </div>
              {(() => { const concepts = Array.isArray(lesson.keyConcept) ? lesson.keyConcept : [lesson.keyConcept]; return concepts.map((kc, i) => (
                <div key={i}>
                  <div className="text-sm text-gray-900 font-medium">
                    {kc.icon} {kc.title}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{kc.description}</p>
                </div>
              )); })()}
            </div>

            {lesson.tryItPrompt && (
              <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">先动手试试</span>
                </div>
                <code className="block text-sm text-gray-900 mt-1 bg-gray-50 p-2 rounded border border-gray-200">
                  {lesson.tryItPrompt}
                </code>
                <a
                  href="/playground"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 hover:underline"
                >
                  <LinkIcon className="w-3 h-3" />
                  去 Playground 跑一跑
                </a>
              </div>
            )}
          </LayerSection>

          {/* ② 课中/直播 */}
          <LayerSection
            icon={<Play className="w-4 h-4 text-yellow-600" />}
            label="课中 · 直播互动层"
            accent="text-yellow-600"
          >
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▸</span>
                主讲老师现场演示 + 实时跟练
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▸</span>
                即时答疑 + 作品点评
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▸</span>
                每节课产出一个可展示作品
              </li>
            </ul>
            {lesson.liveStreamDate && (
              <p className="mt-2 text-xs text-gray-500">
                直播时间：{lesson.liveStreamDate}
              </p>
            )}
          </LayerSection>

          {/* ③ 课后/巩固 */}
          <LayerSection
            icon={<GraduationCap className="w-4 h-4 text-green-600" />}
            label="课后 · 巩固层"
            accent="text-green-600"
          >
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="text-gray-500 text-xs font-medium block mb-1">
                  📝 课后作业
                </span>
                <p>{lesson.homework}</p>
              </div>
              {lesson.advancedChallenge && (
                <div>
                  <span className="text-gray-500 text-xs font-medium block mb-1">
                    🔥 进阶挑战（选做）
                  </span>
                  <p>{lesson.advancedChallenge}</p>
                </div>
              )}
              {lesson.nextPreview && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 text-xs font-medium block mb-1">
                    📖 下节课预告
                  </span>
                  <p className="italic">{lesson.nextPreview}</p>
                </div>
              )}
              {lesson.recordingUrl && (
                <a
                  href={lesson.recordingUrl}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Monitor className="w-3 h-3" />
                  观看录播回放
                </a>
              )}
            </div>
          </LayerSection>

          {/* ④ 自测题 */}
          {lesson.selfTest && lesson.selfTest.length > 0 && (
            <SelfTestSection
              questions={lesson.selfTest}
              courseId={courseId}
              lessonIndex={index}
              onPass={() => setCompleted(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ===== 自测题组件 ===== */
function SelfTestSection({
  questions,
  courseId,
  lessonIndex,
  onPass,
}: {
  questions: SelfTestQuestion[];
  courseId: string;
  lessonIndex: number;
  onPass: () => void;
}) {
  const total = questions.length;
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const calcScore = useCallback(() => {
    let correct = 0;
    for (let i = 0; i < total; i++) {
      const q = questions[i];
      const userAns = answers[i];
      if (!userAns) continue;
      const correctAns = q.answer;
      if (q.type === "multiple") {
        // 多选：完全匹配才算对
        const ua = (userAns as string[]).slice().sort();
        const ca = (correctAns as string[]).slice().sort();
        if (JSON.stringify(ua) === JSON.stringify(ca)) correct++;
      } else {
        // 单选/填空/判断
        if (String(userAns).trim() === String(correctAns).trim()) correct++;
      }
    }
    return Math.round((correct / total) * 100);
  }, [answers, questions, total]);

  const handleSubmit = () => {
    const s = calcScore();
    setScore(s);
    setSubmitted(true);
    if (s >= 60) {
      localStorage.setItem(lockKey(courseId, lessonIndex), "done");
      onPass();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <LayerSection
      icon={<HelpCircle className="w-4 h-4 text-purple-500" />}
      label="自测题 · 完成 ≥60% 解锁下一课"
      accent="text-purple-500"
    >
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <QuestionItem
            key={qi}
            question={q}
            index={qi}
            value={answers[qi]}
            onChange={(v) => {
              if (submitted) return;
              setAnswers((prev) => ({ ...prev, [qi]: v }));
            }}
            showResult={submitted}
          />
        ))}

        {/* 提交/重置按钮 */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#bc8cff] to-[#8b5cf6] text-white font-medium text-sm hover:shadow-lg hover:shadow-[#bc8cff]/20 transition-all"
          >
            提交自测
          </button>
        ) : (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg text-center text-sm font-semibold ${
              score >= 60
                ? "bg-green-100 text-green-600"
                : "bg-[#e53e3e]/20 text-red-600"
            }`}>
              {score >= 60 ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  通过！得分 {score}%（{Math.round(score * total / 100)}/{total}）
                  {score >= 60 && " ✅ 下一课已解锁"}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  未通过（{score}%），需 ≥60% 才能解锁下一课
                </span>
              )}
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-100 transition-all"
            >
              {score >= 60 ? "重新做一遍" : "再试一次"}
            </button>
          </div>
        )}
      </div>
    </LayerSection>
  );
}

/* ===== 单道自测题 ===== */
function QuestionItem({
  question,
  index,
  value,
  onChange,
  showResult,
}: {
  question: SelfTestQuestion;
  index: number;
  value?: string | string[];
  onChange: (v: string | string[]) => void;
  showResult: boolean;
}) {
  const isCorrect = showResult && value !== undefined && (
    question.type === "multiple"
      ? JSON.stringify((value as string[]).slice().sort()) === JSON.stringify((question.answer as string[]).slice().sort())
      : String(value).trim() === String(question.answer).trim()
  );

  const isWrong = showResult && value !== undefined && !isCorrect;
  const hasValue = value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== "");

  const borderColor = showResult
    ? isCorrect
      ? "border-green-500"
      : isWrong
        ? "border-red-500"
        : "border-gray-200"
    : "border-gray-200";

  const icons: Record<QuestionType, string> = {
    single: "单选",
    multiple: "多选",
    fill: "填空",
    judge: "判断",
  };

  return (
    <div className={`p-3 rounded-lg bg-gray-50 border ${borderColor}`}>
      {/* 题干 */}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xs font-bold text-purple-500 mt-0.5 shrink-0">
          Q{index + 1}
        </span>
        <div>
          <span className="text-[10px] text-gray-400 mr-2">[{icons[question.type]}]</span>
          <span className="text-sm text-gray-900">{question.question}</span>
        </div>
      </div>

      {/* 答案区域 */}
      {question.type === "single" && question.options && (
        <div className="space-y-1 ml-5">
          {question.options.map((opt, oi) => (
            <label key={oi} className={`flex items-center gap-2 cursor-pointer text-sm py-1 ${
              showResult && opt === question.answer
                ? "text-green-600"
                : showResult && hasValue && String(value) === opt
                  ? "text-red-600"
                  : "text-gray-700"
            }`}>
              <input
                type="radio"
                name={`q_${index}`}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                disabled={showResult}
                className="accent-purple-500"
              />
              {opt}
              {showResult && opt === question.answer && " ✅"}
            </label>
          ))}
        </div>
      )}

      {question.type === "multiple" && question.options && (
        <div className="space-y-1 ml-5">
          {question.options.map((opt, oi) => {
            const selected = Array.isArray(value) && value.includes(opt);
            const isCorrectOpt = (question.answer as string[]).includes(opt);
            return (
              <label key={oi} className={`flex items-center gap-2 cursor-pointer text-sm py-1 ${
                showResult && isCorrectOpt
                  ? "text-green-600"
                  : showResult && selected && !isCorrectOpt
                    ? "text-red-600"
                    : "text-gray-700"
              }`}>
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={showResult}
                  onChange={() => {
                    const arr = (Array.isArray(value) ? [...value] : []) as string[];
                    if (arr.includes(opt)) {
                      onChange(arr.filter((x) => x !== opt));
                    } else {
                      onChange([...arr, opt]);
                    }
                  }}
                  className="accent-purple-500"
                />
                {opt}
                {showResult && isCorrectOpt && " ✅"}
                {showResult && selected && !isCorrectOpt && " ❌"}
              </label>
            );
          })}
        </div>
      )}

      {question.type === "judge" && (
        <div className="space-y-1 ml-5">
          {["对", "错"].map((opt) => (
            <label key={opt} className={`flex items-center gap-2 cursor-pointer text-sm py-1 ${
              showResult && opt === question.answer
                ? "text-green-600"
                : showResult && hasValue && String(value) === opt
                  ? "text-red-600"
                  : "text-gray-700"
            }`}>
              <input
                type="radio"
                name={`q_${index}`}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                disabled={showResult}
                className="accent-purple-500"
              />
              {opt === "对" ? "✓ 正确" : "✗ 错误"}
              {showResult && opt === question.answer && " ✅"}
            </label>
          ))}
        </div>
      )}

      {question.type === "fill" && (
        <div className="ml-5">
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={showResult}
            placeholder="请输入答案..."
            className={`w-full px-3 py-1.5 rounded border bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 ${
              showResult ? (isCorrect ? "border-green-500" : "border-red-500") : "border-gray-200"
            }`}
          />
        </div>
      )}

      {/* 解析 */}
      {showResult && (
        <div className={`mt-2 ml-5 flex items-start gap-1 text-xs ${
          isCorrect ? "text-green-600" : "text-red-600"
        }`}>
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{question.explanation}</span>
        </div>
      )}
    </div>
  );
}

/* ===== 一套层次卡片组件 ===== */
function LayerSection({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className={`text-xs font-semibold uppercase tracking-wider ${accent}`}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
