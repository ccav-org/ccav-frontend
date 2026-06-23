"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, FileText, Lightbulb, Target, ListChecks } from "lucide-react";

type LectureSection = {
  title: string;
  content: string;
};

type LectureMaterial = {
  title: string;
  duration: string;
  objectives: string[];
  sections: LectureSection[];
};

type Props = {
  lecture?: LectureMaterial;
  lessonTitle: string;
};

export default function LessonLecture({ lecture, lessonTitle }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!lecture) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* 折叠头部 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 text-sm">讲师讲义</h3>
            <p className="text-xs text-gray-400">{lecture.duration}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* 折叠内容 */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200 pt-4">
          {/* 学习目标 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-semibold text-gray-700">学习目标</h4>
            </div>
            <ul className="space-y-1">
              {lecture.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* 讲义章节 */}
          {lecture.sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                {i === 0 ? (
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                ) : (
                  <FileText className="w-4 h-4 text-indigo-600" />
                )}
                <h4 className="text-sm font-semibold text-gray-700">{section.title}</h4>
              </div>
              <div className="ml-6 text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== 数据工具函数：从讲师讲义HTML提取结构化内容 =====

export function extractLectureMaterial(
  dayModuleTitle: string,
  lessonTitle: string,
  htmlContent: string
): LectureMaterial | null {
  // 简化解析：根据HTML内容标题匹配
  const material: LectureMaterial = {
    title: lessonTitle,
    duration: "",
    objectives: [],
    sections: [],
  };

  const lowerHtml = htmlContent.toLowerCase();
  const lines = htmlContent.split("\n");

  // 提取课时
  const durationMatch = htmlContent.match(/(?:课时|时长|时间)[：:]\s*([^<\n]+)/);
  if (durationMatch) material.duration = durationMatch[1].trim();

  // 提取学习目标（li 标签或序号列表）
  const objectives: string[] = [];
  let inObjectives = false;
  for (const line of lines) {
    const trimmed = line.replace(/<[^>]*>/g, "").trim();
    if (/学习目标|教学目标|掌握/.test(trimmed) && trimmed.length < 30) {
      inObjectives = true;
      continue;
    }
    if (inObjectives) {
      const clean = trimmed.replace(/^[•·\-—\d.、\s]+/, "").trim();
      if (clean.length > 5 && clean.length < 120) {
        objectives.push(clean);
      }
      if (/[\u{4e00}-\u{9fff}]{3,}/u.test(trimmed) && trimmed.length < 120) { // approximate check of Chinese char count
        // keep collecting
      } else if (trimmed.includes("</") || trimmed.includes("</ul>") || trimmed.includes("</ol>")) {
        if (objectives.length >= 2) inObjectives = false;
      }
      if (objectives.length >= 6) inObjectives = false;
    }
  }
  material.objectives = objectives.slice(0, 5);

  // 提取主要章节内容
  const sections: LectureSection[] = [];
  const sectionPattern = /<(?:h[234]|p|div)[^>]*>([^<]{4,80})<\/(?:h[234]|p|div)>/g;
  let match;
  let currentSection: LectureSection | null = null;

  while ((match = sectionPattern.exec(htmlContent)) !== null) {
    const text = match[1].trim();
    // 跳过导航/无关标题
    if (/下一页|上一页|目录|返回|导航|footer|header|navbar/i.test(text)) continue;
    if (/课时|时长|讲师|作者/i.test(text) && sections.length === 0) continue;

    if (text.length >= 4 && text.length <= 60 && !currentSection) {
      currentSection = { title: text, content: "" };
    } else if (currentSection && text.length > 30) {
      currentSection.content += text + "\n\n";
    }
  }

  // 如果 section 解析不理想，fallback 到段落提取
  if (sections.length < 2) {
    // 尝试按大段落分
    const paraPattern = /<(?:p|div)[^>]*>([\s\S]{50,500}?)<\/(?:p|div)>/g;
    let chunkIndex = 0;
    while ((match = paraPattern.exec(htmlContent)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, "").trim();
      if (text.length < 30) continue;
      if (/导航|footer|header|版权|备案/i.test(text)) continue;

      sections.push({
        title: chunkIndex === 0 ? "核心内容" : `要点 ${chunkIndex + 1}`,
        content: text,
      });
      chunkIndex++;
      if (chunkIndex >= 5) break;
    }
  }

  material.sections = sections.slice(0, 5);

  if (material.sections.length === 0 && material.objectives.length === 0) {
    return null; // 没有提取到有效内容
  }

  if (!material.duration) material.duration = "约30分钟";

  return material;
}
