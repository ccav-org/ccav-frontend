"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import CommentsList from "@/components/gallery/CommentsList";
import {
  normalizeGalleryItem,
  galleryFetch,
  toggleLike as apiToggleLike,
  toggleDislike as apiToggleDislike,
  recordView as apiRecordView,
  unlockWork,
} from "@/lib/api";
import type { GalleryItem } from "@/lib/api";

export default function GalleryDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockMsg, setUnlockMsg] = useState<string | null>(null);

  // ── 浏览器回退修复 ──
  // 用户从 /gallery 进入 /gallery/:id，回退时应回到 /gallery
  // 原理：pushState 推入一个带标记的哨兵条目（URL 不变但 state 不同）
  // 回退到哨兵时触发 popstate → 检测到标记 → 硬导航到 /gallery
  useEffect(() => {
    const SENTINEL = '__gallery_back__';
    // 推入哨兵条目（URL 不变，但 state 对象不同，浏览器一定触发 popstate）
    window.history.pushState({ [SENTINEL]: true }, '');
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state[SENTINEL]) {
        window.location.href = '/gallery';
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("无效的作品ID");
      setLoading(false);
      return;
    }

    galleryFetch<any>(`${id}`).then((raw) => {
      if (raw) {
        const normalized = normalizeGalleryItem(raw);
        setItem(normalized);
        setLoading(false);
        apiRecordView(id).then((count) => {
          if (count !== null) {
            setItem((prev) =>
              prev ? { ...prev, views_count: count } : prev
            );
          }
        });
      } else {
        setError("作品不存在");
        setLoading(false);
      }
    });
  }, [id]);

  const toggleLike = async () => {
    if (!item) return;
    const result = await apiToggleLike(item.id);
    if (!result) return;
    setItem((prev) => (prev ? { ...prev, ...result } : prev));
  };

  const toggleDislike = async () => {
    if (!item) return;
    const result = await apiToggleDislike(item.id);
    if (!result) return;
    setItem((prev) => (prev ? { ...prev, ...result } : prev));
  };

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-[#c8b898] transition mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回作品墙
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#c8b898]/30 border-t-[#c8b898] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-lg text-white/30 mb-2">{error}</p>
            <Link href="/gallery" className="text-xs text-[#c8b898]/60 hover:text-[#c8b898] transition">
              ← 返回作品墙
            </Link>
          </div>
        ) : item ? (
          <div className="space-y-8">
            <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#111" }}>
              {item.media_type === "video" && item.video_url ? (
                <video
                  src={item.video_url}
                  controls
                  autoPlay
                  muted
                  className="w-full max-h-[70vh] object-contain"
                  style={{ background: "#0a0a0a" }}
                />
              ) : (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full max-h-[70vh] object-contain"
                  style={{ background: "#0a0a0a" }}
                />
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-white/90">{item.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-xs text-white/40 flex-wrap">
                      {item.avatar_url && (
                        <img src={item.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                      )}
                      <span>{item.author}</span>
                      {item.course_name && (
                        <>
                          <span>·</span>
                          <span className="text-[#c8b898]/60">{item.course_name}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{item.created_at}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border transition ${
                        item.liked ? "bg-[#c8b898]/10" : ""
                      }`}
                      style={{
                        borderColor: item.liked
                          ? "rgba(200,184,152,0.3)"
                          : "rgba(255,255,255,0.1)",
                        color: item.liked ? "#c8b898" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={item.liked ? "#c8b898" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {item.likes_count}
                    </button>
                    <button
                      onClick={toggleDislike}
                      className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border transition ${
                        item.disliked ? "bg-red-900/20" : ""
                      }`}
                      style={{
                        borderColor: item.disliked
                          ? "rgba(255,80,80,0.3)"
                          : "rgba(255,255,255,0.1)",
                        color: item.disliked ? "#ff6666" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={item.disliked ? "#ff6666" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M17 14V2M9 18.12l-4-6.3V4h11.2l1.2 5.46a2 2 0 0 1-.24 1.73L12 20" />
                      </svg>
                      {item.dislikes_count}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {(item.views_count ?? 0).toLocaleString()}
                  </span>
                  <span>❤️ {item.likes_count}</span>
                  <span>💩 {item.dislikes_count}</span>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-white/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.description && (
                  <p className="mt-5 text-sm text-white/50 leading-relaxed">{item.description}</p>
                )}

                {(item.tech_type || item.scene || item.style) && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {item.tech_type && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-white/10 text-white/40">
                        <span className="text-[#4ac0d8]/50">⚙</span>
                        {item.tech_type}
                      </span>
                    )}
                    {item.scene && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-white/10 text-white/40">
                        <span className="text-[#c8b898]/50">🎬</span>
                        {item.scene}
                      </span>
                    )}
                    {item.style && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-white/10 text-white/40">
                        <span className="text-[#c8b898]/50">🎨</span>
                        {item.style}
                      </span>
                    )}
                  </div>
                )}

                {/* Phase C: 积分锁面板 */}
                {(item.unlock_cost ?? 0) > 0 && !item.unlocked && (
                  <div className="my-8 p-6 rounded-xl border border-white/5 text-center" style={{ background: "#0a0a0a" }}>
                    <div className="text-4xl mb-3">🔒</div>
                    <p className="text-sm text-white/50 mb-1">该作品需要解锁才能查看完整内容</p>
                    <p className="text-xs text-white/30 mb-4">解锁后可查看评论、给作品打分</p>
                    <button
                      onClick={async () => {
                        if (unlocking) return;
                        setUnlocking(true);
                        setUnlockMsg(null);
                        const result = await unlockWork(item.id);
                        if (result?.success) {
                          setItem((prev) =>
                            prev ? { ...prev, unlocked: true } : prev
                          );
                          setUnlockMsg("🎉 解锁成功！");
                        } else {
                          setUnlockMsg(result?.message || "解锁失败，请稍后重试");
                        }
                        setUnlocking(false);
                      }}
                      disabled={unlocking}
                      className="w-full max-w-[280px] mx-auto block text-sm font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
                      style={{
                        background: unlocking ? "#555" : "linear-gradient(135deg, #c8b898, #a08050)",
                        color: "#000",
                      }}
                    >
                      {unlocking ? "解锁中..." : `🔓 ${item.unlock_cost || 50} 积分解锁`}
                    </button>
                    {unlockMsg && (
                      <p className={`mt-3 text-xs ${unlockMsg.includes("成功") ? "text-green-400" : "text-red-400"}`}>
                        {unlockMsg}
                      </p>
                    )}
                  </div>
                )}

                {(item.unlocked || !((item.unlock_cost ?? 0) > 0)) && (
                  <>
                    <div className="my-6 border-t border-white/5" />
                    <CommentsList galleryId={item.id} />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
