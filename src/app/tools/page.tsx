"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import {
  Sparkles, Image, Video, Music, FileText, Code, Wand2,
  Cpu, Globe, Shield, Zap, ExternalLink, Search, ChevronRight,
  Star, Clock, BookOpen,
} from "lucide-react";

// ===== 工具数据 =====
type ToolCategory = "image" | "video" | "audio" | "text" | "code" | "all";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  url: string;
  icon: React.ReactNode;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  free: boolean;
  highlight: boolean;
  relatedLessons?: string[];
}

const tools: Tool[] = [
  // 🖼️ 图像生成
  {
    id: "kling",
    name: "可灵 Kling",
    description: "快手AI视频生成，支持图生视频/文生视频，最新1.6模型效果优异",
    category: "video",
    url: "https://klingai.com",
    icon: <Sparkles className="w-5 h-5" />,
    tags: ["文生视频", "图生视频", "1.6"],
    difficulty: "beginner",
    free: true,
    highlight: true,
    relatedLessons: ["M1-2: 提示词基础"],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "全球最流行的AI图像生成器，通过Discord使用，创意质量顶尖",
    category: "image",
    url: "https://midjourney.com",
    icon: <Image className="w-5 h-5" />,
    tags: ["文生图", "Discord", "付费"],
    difficulty: "beginner",
    free: false,
    highlight: true,
    relatedLessons: ["M1-2: 提示词基础"],
  },
  {
    id: "dalle",
    name: "DALL·E 3",
    description: "OpenAI最强图像模型，通过ChatGPT Plus使用，理解力出众",
    category: "image",
    url: "https://openai.com/dall-e-3",
    icon: <Image className="w-5 h-5" />,
    tags: ["文生图", "ChatGPT", "付费"],
    difficulty: "beginner",
    free: false,
    highlight: true,
    relatedLessons: ["M1-2: 提示词基础"],
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    description: "开源AI图像生成模型，ComfyUI/A1111本地部署，可完全自主控制",
    category: "image",
    url: "https://stability.ai",
    icon: <Cpu className="w-5 h-5" />,
    tags: ["开源", "本地部署", "ComfyUI"],
    difficulty: "advanced",
    free: true,
    highlight: false,
    relatedLessons: ["M3-2: ComfyUI入门"],
  },
  {
    id: "ideogram",
    name: "Ideogram",
    description: "文字生成能力最强的AI图像工具，适合海报和带文字的图片",
    category: "image",
    url: "https://ideogram.ai",
    icon: <FileText className="w-5 h-5" />,
    tags: ["文字生成", "海报", "免费"],
    difficulty: "beginner",
    free: true,
    highlight: false,
    relatedLessons: ["M1-3: AI海报实战"],
  },
  // 🎬 视频生成
  {
    id: "runway",
    name: "Runway Gen-3",
    description: "专业级AI视频生成，支持文生视频/图生视频/视频编辑",
    category: "video",
    url: "https://runwayml.com",
    icon: <Video className="w-5 h-5" />,
    tags: ["文生视频", "编辑", "专业"],
    difficulty: "intermediate",
    free: false,
    highlight: true,
    relatedLessons: ["M2-1: Runway进阶"],
  },
  {
    id: "sora",
    name: "Sora",
    description: "OpenAI视频生成模型，物理模拟和镜头控制能力顶级",
    category: "video",
    url: "https://sora.com",
    icon: <Video className="w-5 h-5" />,
    tags: ["文生视频", "OpenAI", "前沿"],
    difficulty: "beginner",
    free: false,
    highlight: false,
    relatedLessons: ["M2-1: 视频生成入门"],
  },
  {
    id: "pika",
    name: "Pika Labs",
    description: "轻量级AI视频工具，操作简单，适合快速出片",
    category: "video",
    url: "https://pika.art",
    icon: <Wand2 className="w-5 h-5" />,
    tags: ["文生视频", "简单", "免费额度"],
    difficulty: "beginner",
    free: true,
    highlight: false,
    relatedLessons: ["M2-3: 轻量视频工具"],
  },
  {
    id: "capcut",
    name: "剪映专业版",
    description: "国内最主流的视频剪辑工具，内置AI字幕/图文成片/数字人",
    category: "video",
    url: "https://www.capcut.cn",
    icon: <Zap className="w-5 h-5" />,
    tags: ["剪辑", "AI功能", "免费"],
    difficulty: "beginner",
    free: true,
    highlight: true,
    relatedLessons: ["M1-5: 短视频实战"],
  },
  // 🎵 音频
  {
    id: "suno",
    name: "Suno AI",
    description: "AI音乐生成器，输入歌词描述即可生成完整歌曲",
    category: "audio",
    url: "https://suno.com",
    icon: <Music className="w-5 h-5" />,
    tags: ["音乐", "歌词", "免费额度"],
    difficulty: "beginner",
    free: true,
    highlight: true,
    relatedLessons: ["M2-2: AI音乐创作"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "最逼真的AI语音克隆与配音工具，支持多语种情感语音",
    category: "audio",
    url: "https://elevenlabs.io",
    icon: <Music className="w-5 h-5" />,
    tags: ["语音克隆", "配音", "多语种"],
    difficulty: "intermediate",
    free: false,
    highlight: true,
    relatedLessons: ["M3-5: AI配音"],
  },
  // 📝 文本
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI旗舰大模型，写提示词/脚本/文案的最佳助手",
    category: "text",
    url: "https://chatgpt.com",
    icon: <Sparkles className="w-5 h-5" />,
    tags: ["对话", "文案", "付费"],
    difficulty: "beginner",
    free: false,
    highlight: true,
    relatedLessons: ["M1-1: AI基础认知"],
  },
  {
    id: "doubao",
    name: "豆包",
    description: "字节跳动AI助手，免费、中文理解力强，适合写提示词",
    category: "text",
    url: "https://www.doubao.com",
    icon: <Globe className="w-5 h-5" />,
    tags: ["免费", "中文", "助手"],
    difficulty: "beginner",
    free: true,
    highlight: true,
    relatedLessons: ["M1-1: AI基础认知"],
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    description: "Google AI笔记工具，上传资料后自动生成播客对话",
    category: "text",
    url: "https://notebooklm.google.com",
    icon: <BookOpen className="w-5 h-5" />,
    tags: ["笔记", "播客", "Google"],
    difficulty: "beginner",
    free: true,
    highlight: false,
    relatedLessons: ["M4-1: 全流程项目"],
  },
  // 💻 代码/工作流
  {
    id: "comfyui",
    name: "ComfyUI",
    description: "节点式AI工作流工具，SD文生图/图生视频最灵活方案",
    category: "code",
    url: "https://github.com/comfyanonymous/ComfyUI",
    icon: <Code className="w-5 h-5" />,
    tags: ["工作流", "开源", "本地"],
    difficulty: "advanced",
    free: true,
    highlight: true,
    relatedLessons: ["M3-2: ComfyUI入门"],
  },
];

const categories: { id: ToolCategory; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "全部", icon: <Search className="w-4 h-4" /> },
  { id: "image", label: "图像生成", icon: <Image className="w-4 h-4" /> },
  { id: "video", label: "视频生成", icon: <Video className="w-4 h-4" /> },
  { id: "audio", label: "音频", icon: <Music className="w-4 h-4" /> },
  { id: "text", label: "文本/文案", icon: <FileText className="w-4 h-4" /> },
  { id: "code", label: "工作流", icon: <Code className="w-4 h-4" /> },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = tools.filter((tool) => {
    if (activeCategory !== "all" && tool.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const highlightTools = tools.filter((t) => t.highlight);

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "AI工具导航" }]} />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-white to-[rgba(37,99,235,0.03)]">
          <div className="max-w-5xl mx-auto px-5 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563eb]/8 border border-[#58a6ff]/20 text-[#2563eb] text-sm mb-6">
                <Wand2 className="w-4 h-4" />
                AI Tools · 持续更新
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#1e293b] mb-4">
                AI 工具矩阵
              </h1>
              <p className="text-lg text-[rgba(0,0,0,0.5)] max-w-2xl mx-auto mb-8">
                精选AI视频制作全流程工具，图像→音频→视频→剪辑，一条龙指导
              </p>

              {/* 搜索 */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.35)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索工具名称、功能或标签..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[rgba(37,99,235,0.08)] text-sm text-[rgba(0,0,0,0.6)] placeholder-[rgba(0,0,0,0.35)] focus:border-[#58a6ff] focus:outline-none"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 分类 Filter */}
        <section className="py-6 bg-white sticky top-16 z-40 border-b border-[rgba(37,99,235,0.08)]">
          <div className="max-w-5xl mx-auto px-5">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-[#2563eb]/10 text-[#2563eb] border border-[#58a6ff]/30"
                      : "bg-white text-[rgba(0,0,0,0.5)] border border-[rgba(37,99,235,0.08)] hover:border-[#2563eb]/30"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 工具列表 */}
        <section className="py-8 bg-white min-h-[50vh]">
          <div className="max-w-5xl mx-auto px-5">
            {activeCategory === "all" && !searchQuery && (
              <>
                {/* 推荐工具 */}
                <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#d29922]" />
                  推荐工具
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {highlightTools.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i} />
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-[#1e293b] mb-4">全部工具</h2>
              </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-[rgba(0,0,0,0.35)]">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">没有找到匹配的工具</p>
                <p className="text-sm mt-1">试试其他关键词</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group p-5 rounded-xl border transition-all hover:-translate-y-1 block ${
        tool.highlight
          ? "bg-white border-[rgba(37,99,235,0.08)] hover:border-[#2563eb]/40"
          : "bg-white border-[rgba(37,99,235,0.08)] hover:border-[rgba(37,99,235,0.08)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          tool.category === "image" ? "bg-[#2563eb]/10 text-[#2563eb]" :
          tool.category === "video" ? "bg-[#bc8cff]/15 text-[#bc8cff]" :
          tool.category === "audio" ? "bg-[#3fb950]/15 text-[#3fb950]" :
          tool.category === "text" ? "bg-[#d29922]/15 text-[#d29922]" :
          "bg-[#f78166]/15 text-[#f78166]"
        }`}>
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#1e293b] group-hover:text-[#2563eb] transition-colors truncate">
              {tool.name}
            </h3>
            {tool.free && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3fb950]/15 text-[#3fb950] flex-shrink-0">免费</span>
            )}
            {tool.difficulty === "beginner" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2563eb]/10 text-[#2563eb] flex-shrink-0">入门</span>
            )}
            {tool.difficulty === "advanced" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f78166]/15 text-[#f78166] flex-shrink-0">进阶</span>
            )}
          </div>
          <p className="text-xs text-[rgba(0,0,0,0.5)] line-clamp-2">{tool.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tool.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.35)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-[rgba(0,0,0,0.35)] flex-shrink-0 mt-1 group-hover:text-[#2563eb] transition-colors" />
      </div>
      {tool.relatedLessons && tool.relatedLessons.length > 0 && (
        <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-[rgba(37,99,235,0.06)]">
          <BookOpen className="w-3 h-3 text-[#206683]/50 flex-shrink-0" />
          <span className="text-[10px] text-[#206683]/50 mr-1">关联课时:</span>
          {tool.relatedLessons.map((lesson, j) => (
            <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-[#206683]/8 text-[#206683]/60">
              {lesson}
            </span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
