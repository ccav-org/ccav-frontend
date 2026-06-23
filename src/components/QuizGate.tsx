"use client";

import { useState, useMemo } from "react";
import { Lock, CheckCircle, XCircle, Award, ArrowRight, Cloud } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { submitQuizResult } from "@/lib/api";
import type { SelfTestQuestion } from "@/lib/courseData";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

// Fallback quiz generator for lessons without specific questions
function generateFallbackQuiz(): QuizQuestion[] {
  return [
    {
      question: "本课的核心概念你理解了吗？",
      options: ["完全理解", "基本理解，还需复习", "不太理解", "完全不懂"],
      correct: 0,
    },
    {
      question: "AI视频制作相比传统方式的优势是什么？",
      options: ["速度更快成本更低", "质量永远更高", "不需要任何人类参与", "只能做简单动画"],
      correct: 0,
    },
    {
      question: "学习AI视频最重要的基础技能是什么？",
      options: ["会写代码", "会用提示词表达需求", "会操作摄像机", "会画画"],
      correct: 1,
    },
  ];
}

/** Convert SelfTestQuestion[] → QuizQuestion[] */
function convertSelfTest(st: SelfTestQuestion[]): QuizQuestion[] {
  return st.map((q) => {
    if (q.type === "judge") {
      return {
        question: q.question,
        options: q.options?.length ? q.options : ["对", "错"],
        correct: q.answer === "对" ? 0 : 1,
      };
    }
    if (q.type === "single" && q.options) {
      const correctIdx = q.options.indexOf(q.answer as string);
      return {
        question: q.question,
        options: q.options,
        correct: correctIdx >= 0 ? correctIdx : 0,
      };
    }
    // For multiple-choice, pick only the first correct answer to keep QuizGate simple
    if (q.type === "multiple" && q.options) {
      const correctIdx = q.options.indexOf((q.answer as string[])[0]);
      return {
        question: q.question,
        options: q.options,
        correct: correctIdx >= 0 ? correctIdx : 0,
      };
    }
    return generateFallbackQuiz()[0];
  });
}

type Props = {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  nextLessonUrl?: string;
  selfTest?: SelfTestQuestion[]; // 从 lesson.selfTest 传入，优先于硬编码
};

export default function QuizGate({ courseId, moduleIndex, lessonIndex, nextLessonUrl, selfTest }: Props) {
  const { status, passLesson } = useProgress(courseId, moduleIndex, lessonIndex);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = useMemo(() => {
    if (selfTest && selfTest.length > 0) {
      return convertSelfTest(selfTest);
    }
    return generateFallbackQuiz();
  }, [selfTest]);

  const totalQuestions = questions.length;
  const passThreshold = Math.ceil(totalQuestions * 0.6); // ≥60%
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(totalQuestions).fill(null));

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correct = 0;
    answers.forEach((ans, i) => {
      if (ans === questions[i].correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    // 提交结果到后端
    const total = questions.length;
    const lessonIdx = lessonIndex + 1; // 数据库lessonId从1开始
    submitQuizResult(courseId, lessonIdx, correct, total);

    if (correct >= passThreshold) {
      passLesson();
    }
  };

  const allAnswered = answers.every((a) => a !== null);
  const passed = score >= passThreshold;

  if (status === "passed") {
    return (
      <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <Award className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-600">✅ 本节已通过</h3>
            <p className="text-sm text-gray-500">得分：{score}/3</p>
          </div>
        </div>
        {nextLessonUrl && (
          <Link
            href={nextLessonUrl}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-[#39d2c0] text-white text-sm font-semibold hover:shadow-lg transition-all"
          >
            进入下一课 <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-yellow-600" />
        <h3 className="font-semibold text-gray-900">📝 课后考核（{totalQuestions}题 · 答对{passThreshold}题即通过）</h3>
      </div>

      <div className="space-y-5 mb-4">
        {questions.map((q, qi) => (
          <div key={qi} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">
              {qi + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = submitted && oi === q.correct;
                const isWrong = submitted && isSelected && oi !== q.correct;

                let borderClass = "border-gray-200";
                if (submitted) {
                  if (isCorrect) borderClass = "border-[#3fb950] bg-green-50";
                  else if (isWrong) borderClass = "border-[#e53e3e] bg-[#e53e3e]/5";
                } else if (isSelected) {
                  borderClass = "border-[#58a6ff] bg-[#58a6ff]/10";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-lg border ${borderClass} text-sm text-gray-700 hover:border-indigo-400/30 transition-all flex items-center gap-2`}
                  >
                    {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
                    {submitted && isWrong && <XCircle className="w-4 h-4 text-[#e53e3e] shrink-0" />}
                    {!submitted && <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 shrink-0">{String.fromCharCode(65 + oi)}</span>}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            allAnswered
              ? "bg-gradient-to-r from-indigo-500 to-[#bc8cff] text-white hover:shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {allAnswered ? "提交答案" : `请回答全部 ${questions.length} 题`}
        </button>
      ) : (
        <div className={`p-4 rounded-xl ${passed ? "bg-green-50 border border-green-300" : "bg-red-50 border border-red-300"}`}>
          <div className="flex items-center gap-2 mb-2">
            {passed ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">恭喜通过！得分 {score}/{totalQuestions}</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-[#e53e3e]" />
                <span className="font-semibold text-[#e53e3e]">未通过，得分 {score}/{totalQuestions}（需要≥{passThreshold}分）</span>
              </>
            )}
          </div>
          {passed && nextLessonUrl && (
            <Link
              href={nextLessonUrl}
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-[#39d2c0] text-white text-sm font-semibold hover:shadow-lg transition-all"
            >
              进入下一课 <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {!passed && (
            <button
              onClick={() => { setSubmitted(false); setAnswers(new Array(totalQuestions).fill(null)); }}
              className="mt-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-all"
            >
              重新答题
            </button>
          )}
        </div>
      )}
    </div>
  );
}
