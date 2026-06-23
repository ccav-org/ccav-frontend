"use client";

import { Lock, CheckCircle, Circle } from "lucide-react";
import { useProgress } from "@/lib/useProgress";

type Props = {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
};

export default function ProgressBar({ courseId, moduleIndex, lessonIndex }: Props) {
  const { status, getCompletionPercent } = useProgress(courseId, moduleIndex, lessonIndex);

  // Map course IDs to lesson counts
  const courseTotals: Record<string, number> = {
    part1: 16, part2: 20, part3: 22, part4: 16, part5: 16, part6: 8,
    training: 30,
  };
  const total = courseTotals[courseId] || 98;
  const percent = getCompletionPercent(courseId, total);

  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
          {status === "passed" ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : status === "unlocked" ? (
            <Circle className="w-4 h-4 text-indigo-600" />
          ) : (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
          学习进度
        </span>
        <span className="text-xs text-gray-500">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-[#39d2c0] rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
