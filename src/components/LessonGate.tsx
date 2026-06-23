"use client";

import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { useAuth } from "@/lib/auth";

type Props = {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  requireAuth?: boolean;  // 学生课程需要登录
  children: React.ReactNode;
};

export default function LessonGate({ courseId, moduleIndex, lessonIndex, requireAuth = false, children }: Props) {
  const { isLessonUnlocked } = useProgress(courseId, moduleIndex, lessonIndex);
  const { isAuthenticated } = useAuth();
  const unlocked = isLessonUnlocked(courseId, moduleIndex, lessonIndex);

  // ===== 未登录阻止 =====
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm flex items-center justify-center pt-16">
        <div className="text-center px-6 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
            <LogIn className="w-10 h-10 text-gray-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">🔒 请先登录</h1>
          <p className="text-gray-500 mb-2">学习课程需要登录账号</p>
          <p className="text-sm text-gray-400 mb-8">登录后自动记录学习进度和考试结果</p>

          <div className="flex flex-col gap-3 items-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-[#bc8cff] text-white font-semibold hover:shadow-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              登录 / 注册
            </Link>
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:border-indigo-400/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              返回课程目录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===== 进度锁定（不遮罩，显示内容 + 提示条） =====
  if (!unlocked) {
    return (
      <div className="relative">
        {/* 提示条 */}
        <div className="sticky top-0 z-40 w-full bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-sm text-amber-800">
            ⚠️ 请先完成上一课 Quiz，本课进度不保存
          </p>
          <Link
            href={findLastUnlockedUrl(courseId, moduleIndex, lessonIndex)}
            className="text-xs text-amber-600 underline hover:text-amber-800"
          >
            返回最近可学课程
          </Link>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

function findLastUnlockedUrl(courseId: string, mIdx: number, lIdx: number): string {
  let cm = mIdx;
  let cl = lIdx - 1;
  if (cl < 0) {
    cm = mIdx - 1;
    if (cm < 0) {
      return `/courses/${courseId}/lessons/0/0`;
    }
    cl = 5;
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("ccav-progress-v1");
      if (raw) {
        const data = JSON.parse(raw);
        for (let m = mIdx; m >= 0; m--) {
          const lastL = m === mIdx ? lIdx - 1 : 20;
          for (let l = lastL; l >= 0; l--) {
            const key = `${courseId}:${m}:${l}`;
            if (key === `${courseId}:${mIdx}:${lIdx}`) continue;
            const status = data[key];
            if (status === "passed" || status === "unlocked") {
              return `/courses/${courseId}/lessons/${m}/${l}`;
            }
            if (m === 0 && l === 0) {
              return `/courses/${courseId}/lessons/0/0`;
            }
          }
        }
      }
    } catch { /* ignore */ }
  }

  return `/courses/${courseId}/lessons/0/0`;
}
