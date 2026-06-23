"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  VideoIcon,
  Sparkles,
  Zap,
  Loader2,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Send,
  Wand2,
  Coins,
  ExternalLink,
  User as UserIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import { COST, EARNING, INITIAL_CREDITS, LEVEL_LABELS, computeCost } from "@/lib/credits";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

type TaskType = "image" | "video";
type TaskStatus = "idle" | "optimizing" | "queued" | "generating" | "done" | "error";

type ProviderType = "auto" | "kling" | "replicate";

interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  prompt: string;
  optimizedPrompt?: string;
  resultUrl?: string;
  message?: string;
  progress?: number;
  provider?: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function PlaygroundPage() {
  const [taskType, setTaskType] = useState<TaskType>("image");
  const [prompt, setPrompt] = useState("");
  const [useKimiOptimize, setUseKimiOptimize] = useState(true);
  const [provider, setProvider] = useState<ProviderType>("auto");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const generatingStartRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const activeTask = tasks.find(t => t.status === "generating" || t.status === "queued" || t.status === "optimizing");
  const isGenerating = !!activeTask;

  // 计时器
  useEffect(() => {
    if (isGenerating && generatingStartRef.current === 0) {
      generatingStartRef.current = Date.now();
    }
    if (!isGenerating) {
      generatingStartRef.current = 0;
      setElapsed(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - generatingStartRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isGenerating]);



  const optimizePrompt = async (rawPrompt: string): Promise<string> => {
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: rawPrompt, type: taskType }),
      });
      const data = await res.json();
      if (data.code === 0 && data.data?.optimized_prompt) {
        return data.data.optimized_prompt;
      }
      console.warn("优化失败，使用原始提示词", data);
      return rawPrompt;
    } catch (err) {
      console.error("优化接口异常，降级到原始提示词", err);
      return rawPrompt;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const taskId = generateId();
    const task: Task = {
      id: taskId,
      type: taskType,
      status: useKimiOptimize ? "optimizing" : "queued",
      prompt: prompt.trim(),
    };
    setTasks((prev) => [task, ...prev]);
    setPrompt("");

    let finalPrompt = task.prompt;

    if (useKimiOptimize) {
      setOptimizing(true);
      try {
        finalPrompt = await optimizePrompt(task.prompt);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, optimizedPrompt: finalPrompt, status: "queued" as TaskStatus } : t
          )
        );
      } catch {
        // ignore
      } finally {
        setOptimizing(false);
      }
    }

    // 调后端 API 提交生成任务
    const genProvider = provider === "auto" ? "kling" : provider;
    const endpoint = taskType === "image" ? "/api/kling/generate" : "/api/kling/generate";

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "generating", progress: 0, provider: genProvider } : t))
    );

    try {
      const generateRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          type: taskType,
          provider: genProvider,
        }),
      });
      const generateData = await generateRes.json();

      if (generateData.code === 0 && generateData.data?.task_id) {
        // 提交成功，开始轮询
        pollTask(taskId, generateData.data.task_id, taskType, genProvider);
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: "error", message: generateData.message || "提交失败" }
              : t
          )
        );
      }
    } catch (err) {
      console.error("提交生成请求失败", err);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: "error", message: "网络异常，请稍后重试" }
            : t
        )
      );
    }
  };

  const pollTask = useCallback(
    async (
      localId: string,
      genTaskId: string,
      type: TaskType,
      genProvider: string
    ) => {
      const maxAttempts = 60;
      let attempts = 0;

      const interval = setInterval(async () => {
        attempts++;
        if (attempts > maxAttempts) {
          clearInterval(interval);
          setTasks((prev) =>
            prev.map((t) =>
              t.id === localId
                ? { ...t, status: "error", message: "超时，请稍后手动刷新" }
                : t
            )
          );
          return;
        }

        try {
          let status = "";
          let resultUrl: string | undefined;

          // 走后端代理查询任务状态
          const res = await fetch(`/api/kling/task?taskId=${genTaskId}&type=${type}`);
          const data = await res.json();

          if (data.code === 0 && data.data) {
            const taskData = data.data;
            status = taskData.task_status || taskData.status || "";
            if (status === "succeed" || status === "succeeded") {
              const works = taskData.task_result?.images || taskData.task_result?.videos || [];
              if (works.length > 0) resultUrl = works[0].url;
            }
          }

          if (status === "succeed" || status === "succeeded") {
            if (resultUrl) {
              clearInterval(interval);
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === localId ? { ...t, status: "done", resultUrl, provider: data.data?.provider || genProvider } : t
                )
              );
            }
          } else if (status === "failed" || status === "fail") {
            clearInterval(interval);
            setTasks((prev) =>
              prev.map((t) =>
                t.id === localId ? { ...t, status: "error", message: "生成失败" } : t
              )
            );
          } else {
            // 剩余轮次数算百分比进度，最大95%
            const pct = Math.round(((attempts) / maxAttempts) * 95);
            setTasks((prev) =>
              prev.map((t) =>
                t.id === localId ? { ...t, progress: Math.min(pct, 95) } : t
              )
            );
          }
        } catch {
          // keep polling
        }
      }, 5000);
    },
    []
  );

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "AI 实践工坊" }]} />
      <main className="flex-1 pt-16">
        <section className="py-12"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), " +
              "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(14,165,233,0.03) 0%, transparent 60%), " +
              "#f8fafc",
          }}>
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#1e293b" }}>
                AI 实操工坊
              </h1>
              <p style={{ color: "rgba(0,0,0,0.45)" }}>
                输入提示词 → Kimi 优化 → AI 生成，零代码体验多平台 AI 创作全流程
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#238636] text-white text-sm font-medium">
                <Zap className="w-4 h-4" />
                体验课（平台代付）
              </span>

              {/* 当前积分余额 */}
              <CreditsDisplay />

              {/* 积分规则链接 */}
              <Link
                href="/credits"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[#d2991d] text-sm font-medium hover:bg-[#1c2333] hover:border-[#d2991d] transition-all"
              >
                <Coins className="w-4 h-4" />
                积分规则
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setTaskType("image")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    taskType === "image"
                      ? "bg-[#2563eb]/10 border-[#58a6ff] text-[#2563eb]"
                      : "bg-white border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.5)] hover:border-[#2563eb]/30"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> 文生图
                </button>
                <button
                  onClick={() => setTaskType("video")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    taskType === "video"
                      ? "bg-[#e53e3e]/10 border-[#e53e3e] text-[#e53e3e]"
                      : "bg-white border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.5)] hover:border-[#e53e3e]/30"
                  }`}
                >
                  <VideoIcon className="w-4 h-4" /> 文生视频
                </button>
                <div className="flex items-center gap-1 rounded-xl bg-white border border-[rgba(37,99,235,0.08)] p-0.5">
                  {(["auto", "kling", "replicate"] as ProviderType[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        provider === p
                          ? "bg-[#bc8cff]/20 text-[#bc8cff]"
                          : "text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.6)]"
                      }`}
                    >
                      {p === "auto" ? "🚀 自动" : p === "kling" ? "🇨🇳 可灵" : "🌍 Replicate"}
                    </button>
                  ))}
                </div>
                <label className="ml-auto flex items-center gap-2 text-sm text-[rgba(0,0,0,0.5)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useKimiOptimize}
                    onChange={(e) => setUseKimiOptimize(e.target.checked)}
                    className="rounded border-[rgba(37,99,235,0.08)] bg-white text-[#2563eb] focus:ring-[#58a6ff]"
                  />
                  <Wand2 className="w-4 h-4" /> Kimi 优化
                </label>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                  placeholder={
                    taskType === "image"
                      ? "描述你想要的画面，例如：一只橘猫在樱花树下打盹..."
                      : "描述你想要的视频，例如：一只橘猫缓缓走过樱花树下..."
                  }
                  rows={4}
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.6)] placeholder:text-[rgba(0,0,0,0.5)] focus:border-[#58a6ff] outline-none resize-none transition-colors"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || optimizing}
                  className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] text-white flex items-center justify-center hover:shadow-lg hover:shadow-[#58a6ff]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {optimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-[rgba(0,0,0,0.5)]">
                按 Cmd/Ctrl + Enter 快速发送 · 
                本次消耗 <span className="text-[#d2991d] font-medium">{computeCost(taskType === "image" ? "text_to_image" : "text_to_video", "kling")}</span> 积分
                {useKimiOptimize && <> · Kimi 优化 <span className="text-[#d2991d] font-medium">+{COST.prompt_optimize}</span> 分</>}
              </p>
            </div>
          </div>
        </section>

        <section className="py-8" style={{ background: "#f1f5f9" }}>
          <div className="max-w-5xl mx-auto px-5">
            {tasks.length === 0 ? (
              <div className="text-center py-16 text-[rgba(0,0,0,0.5)]">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>还没有生成记录，在上方输入提示词开始创作吧</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-[rgba(37,99,235,0.08)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {task.type === "image" ? <ImageIcon className="w-4 h-4 text-[#2563eb]" /> : <VideoIcon className="w-4 h-4 text-[#e53e3e]" />}
                        <span className="text-sm text-[rgba(0,0,0,0.6)]">{task.type === "image" ? "文生图" : "文生视频"}</span>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-xs text-[rgba(0,0,0,0.5)] mb-1">原始提示词</p>
                        <p className="text-sm text-[rgba(0,0,0,0.6)]">{task.prompt}</p>
                      </div>
                      {task.optimizedPrompt && (
                        <div className="p-3 rounded-xl bg-white border border-[rgba(37,99,235,0.08)]">
                          <p className="text-xs text-[#2563eb] mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Kimi 优化后
                          </p>
                          <p className="text-sm text-[rgba(0,0,0,0.6)]">{task.optimizedPrompt}</p>
                        </div>
                      )}
                      {(task.status === "optimizing" || task.status === "queued" || task.status === "generating") && (
                        <div className="py-8 text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#2563eb]" />
                          <p className="text-sm text-[rgba(0,0,0,0.5)]">
                            {task.status === "optimizing" ? "Kimi 正在优化提示词..." : task.status === "queued" ? "排队中..." : `${task.provider === 'replicate' ? 'Replicate' : '可灵'}正在生成中，请稍候...`}
                          </p>
                          {task.progress !== undefined && (
                            <div className="mt-3 max-w-xs mx-auto h-1.5 rounded-full bg-white overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] transition-all duration-500" style={{ width: `${task.progress}%` }} />
                            </div>
                          )}
                        </div>
                      )}
                      {task.status === "error" && (
                        <div className="py-4 text-center text-[#e53e3e]">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">{task.message || "生成失败"}</p>
                        </div>
                      )}
                      {task.status === "done" && task.resultUrl && (
                        <div className="space-y-3">
                          {task.type === "image" ? (
                            <img src={task.resultUrl} alt="AI 生成图片" className="w-full rounded-xl" loading="lazy" />
                          ) : (
                            <video src={task.resultUrl} controls className="w-full rounded-xl" />
                          )}
                          <div className="flex gap-2">
                            <a href={task.resultUrl} target="_blank" download className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#238636] text-white text-sm font-medium hover:bg-[#2ea043] transition-colors">
                              <Download className="w-4 h-4" /> 下载
                            </a>
                            <button onClick={() => { setPrompt(task.optimizedPrompt || task.prompt); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 text-[rgba(0,0,0,0.6)] text-sm hover:bg-gray-300 transition-colors">
                              <RotateCcw className="w-4 h-4" /> 再试一次
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 居中生成进度覆盖层 */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center px-8 py-10 rounded-3xl bg-white border border-[rgba(37,99,235,0.08)] shadow-2xl max-w-sm w-full"
            >
              {/* 类型图标 */}
              <div className="mb-5">
                {activeTask.type === "image" ? (
                  <ImageIcon className="w-10 h-10 mx-auto text-[#2563eb]" />
                ) : (
                  <VideoIcon className="w-10 h-10 mx-auto text-[#e53e3e]" />
                )}
              </div>

              {/* 旋转动画 */}
              <div className="relative mx-auto w-20 h-20 mb-5">
                <div className="absolute inset-0 rounded-full border-[3px] border-[rgba(37,99,235,0.08)]" />
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#58a6ff] animate-spin" />
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#2563eb] animate-spin" />
                </div>
              </div>

              {/* 标题 */}
              <h2 className="text-lg font-bold text-[#1e293b] mb-1">
                {activeTask.status === "optimizing"
                  ? "Kimi 正在优化提示词..."
                  : activeTask.status === "queued"
                  ? "排队等待中..."
                  : "AI 正在创作中..."}
              </h2>
              <p className="text-sm text-[rgba(0,0,0,0.5)] mb-4">
                {activeTask.type === "image" ? "文生图" : "文生视频"} · 请耐心等候
              </p>

              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[rgba(0,0,0,0.5)]">完成度</span>
                  <span className="text-sm font-bold text-[#2563eb]">
                    {activeTask.progress !== undefined ? `${Math.round(activeTask.progress)}%` : "—"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#58a6ff] to-[#bc8cff]"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeTask.progress || 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* 计时器 */}
              <div className="flex items-center justify-center gap-2 text-sm text-[rgba(0,0,0,0.5)]">
                <span>⏱</span>
                <span>
                  {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <p className="text-xs text-[#6e7681] mt-1">
                可灵 AI 正在生成{activeTask.type === "image" ? "图片" : "视频"}（约{activeTask.type === "image" ? "5～15" : "30～60"}秒）
              </p>

              {/* 提示词预览 */}
              <div className="mt-5 pt-4 border-t border-[rgba(37,99,235,0.08)] text-left">
                <p className="text-xs text-[rgba(0,0,0,0.5)] mb-1">提示词</p>
                <p className="text-sm text-[rgba(0,0,0,0.6)] line-clamp-2">
                  {activeTask.optimizedPrompt || activeTask.prompt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

/** 当前用户积分余额显示组件 */
function CreditsDisplay() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.5)] text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        加载中...
      </span>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/admin/login"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.5)] text-sm font-medium hover:text-[#2563eb] hover:border-[#2563eb] transition-all"
      >
        <UserIcon className="w-4 h-4" />
        登录后可查看积分
      </Link>
    );
  }

  const credits = user?.credits ?? 0;
  const level = credits >= 5000 ? "高级" : credits >= 2000 ? "中级" : credits >= 500 ? "初级" : "注册";

  return (
    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white border border-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.6)] text-sm font-medium">
      <Coins className="w-4 h-4 text-[#d2991d]" />
      <span>
        <span className="text-[#d2991d] font-bold">{credits}</span>
        <span className="text-[rgba(0,0,0,0.5)] ml-1">积分</span>
      </span>
      <span className="text-gray-300">|</span>
      <span className="text-[rgba(0,0,0,0.5)] text-xs">{level}学员</span>
    </span>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { text: string; className: string; icon: React.ReactNode }> = {
    idle: { text: "待开始", className: "bg-gray-200 text-[rgba(0,0,0,0.5)]", icon: null },
    optimizing: { text: "优化中", className: "bg-[#2563eb]/10 text-[#2563eb]", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    queued: { text: "排队中", className: "bg-[#d2991d]/10 text-[#d2991d]", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    generating: { text: "生成中", className: "bg-[#bc8cff]/10 text-[#bc8cff]", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    done: { text: "已完成", className: "bg-[#238636]/10 text-[#3fb950]", icon: <CheckCircle className="w-3 h-3" /> },
    error: { text: "失败", className: "bg-[#e53e3e]/10 text-[#e53e3e]", icon: <AlertCircle className="w-3 h-3" /> },
  };
  const { text, className, icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      {icon}{text}
    </span>
  );
}
