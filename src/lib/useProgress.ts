"use client";

import { useState, useCallback } from "react";

export type LessonStatus = "locked" | "unlocked" | "passed";

interface ProgressData {
  [lessonKey: string]: LessonStatus;
}

const STORAGE_KEY = "ccav-progress-v1";

// Build lesson key: "part1:0:0" = courseId:moduleIndex:lessonIndex
export function makeLessonKey(courseId: string, moduleIndex: number, lessonIndex: number): string {
  return `${courseId}:${moduleIndex}:${lessonIndex}`;
}

function loadProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress(courseId: string, moduleIndex: number, lessonIndex: number) {
  const [allProgress, setAllProgress] = useState<ProgressData>(() => loadProgress());
  const [status, setStatus] = useState<LessonStatus>(() => {
    const data = loadProgress();
    const key = makeLessonKey(courseId, moduleIndex, lessonIndex);
    // Training course: all lessons always unlocked
    if (courseId === "training") {
      if (!data[key]) {
        data[key] = "unlocked";
        saveProgress(data);
      }
      return "unlocked";
    }
    // First 2 lessons (student trial courses) always unlocked
    if (moduleIndex === 0 && (lessonIndex === 0 || lessonIndex === 1)) {
      if (!data[key]) {
        data[key] = "unlocked";
        saveProgress(data);
      }
      return data[key] || "unlocked";
    }
    return data[key] || "locked";
  });

  const passLesson = useCallback(() => {
    const data = loadProgress();
    const key = makeLessonKey(courseId, moduleIndex, lessonIndex);
    data[key] = "passed";
    // Unlock next lesson
    const nextKey = getNextLessonKey(courseId, moduleIndex, lessonIndex);
    if (nextKey && !data[nextKey]) {
      data[nextKey] = "unlocked";
    }
    saveProgress(data);
    setStatus("passed");
    setAllProgress(data);
  }, [courseId, moduleIndex, lessonIndex]);

  const isLessonUnlocked = useCallback((cid: string, mid: number, lid: number): boolean => {
    const key = makeLessonKey(cid, mid, lid);
    // Training course: always unlocked
    if (cid === "training") return true;
    // First 2 lessons of any student course always unlocked
    if (mid === 0 && (lid === 0 || lid === 1)) return true;
    return allProgress[key] === "unlocked" || allProgress[key] === "passed";
  }, [allProgress]);

  const getCompletionPercent = useCallback((cid: string, totalLessons: number): number => {
    let passed = 0;
    for (const [key, val] of Object.entries(allProgress)) {
      if (key.startsWith(cid) && val === "passed") passed++;
    }
    return Math.round((passed / totalLessons) * 100);
  }, [allProgress]);

  return { status, passLesson, isLessonUnlocked, getCompletionPercent };
}

// Determine the next lesson key (simple linear progression per course)
function getNextLessonKey(courseId: string, mIdx: number, lIdx: number): string | null {
  // Hardcoded module structure for progression
  const courseModules: Record<string, number[]> = {
    part1: [6, 5, 5],        // M1:6 M2:5 M3:5 = 16
    part2: [5, 5, 5, 5],     // M4-M7: 5 each = 20
    part3: [5, 4, 5, 4, 4],  // M8-M12 = 22
    part4: [8, 8],           // M13-M14 = 16
    part5: [6, 5, 5],        // M15-M17 = 16
    part6: [6, 2],           // M18-M19 = 8
    training: [5, 4, 4, 4, 4],       // 5 modules: Day1=5, Day2=4, Day3=4, Day4=4, Day5=4
  };

  const sizes = courseModules[courseId];
  if (!sizes) return null;

  const currentModuleSize = sizes[mIdx];
  if (lIdx + 1 < currentModuleSize) {
    // Next lesson in same module
    return makeLessonKey(courseId, mIdx, lIdx + 1);
  } else if (mIdx + 1 < sizes.length) {
    // First lesson of next module
    return makeLessonKey(courseId, mIdx + 1, 0);
  }
  // End of course
  return null;
}
