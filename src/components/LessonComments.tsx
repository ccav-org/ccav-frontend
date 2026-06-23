"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, Send, ThumbsUp, Clock, User, Loader2 } from "lucide-react";

type Comment = {
  id: string;
  author: string;
  content: string;
  time: string;
  likes: number;
};

type Props = {
  lessonKey: string;
  lessonTitle: string;
};

const API_BASE = "/api/comments";

export default function LessonComments({ lessonKey, lessonTitle }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 加载评论
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/${lessonKey}`);
      const json = await res.json();
      if (json.code === 0) {
        setComments(json.data || []);
      }
    } catch {
      // 静默失败
    } finally {
      setLoading(false);
    }
  }, [lessonKey]);

  // 初始加载
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 加载保存的昵称
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ccav_comment_author");
      if (saved) setAuthor(saved);
    }
  }, []);

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const authorName = author.trim() || "匿名学员";
      const res = await fetch(`${API_BASE}/${lessonKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: authorName, content: trimmed }),
      });
      const json = await res.json();
      if (json.code === 0) {
        setNewComment("");
        if (author.trim()) {
          localStorage.setItem("ccav_comment_author", author.trim());
        }
        // 重新加载最新评论列表
        await fetchComments();
      }
    } catch {
      // 静默失败
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`${API_BASE}/${lessonKey}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      const json = await res.json();
      if (json.code === 0) {
        setComments(prev =>
          prev.map(c => (c.id === commentId ? { ...c, likes: json.data.likes } : c))
        );
      }
    } catch {
      // 静默
    }
  };

  const formatDisplayTime = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">
          课程讨论 ({comments.length})
        </h3>
      </div>

      {/* 输入框 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="你的昵称（选填）"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition-colors"
        />
        <div className="flex gap-2">
          <textarea
            placeholder={`对「${lessonTitle}」有什么想法或问题？`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none transition-colors resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
            className={`px-4 rounded-xl font-semibold text-sm transition-all flex items-center gap-1 ${
              newComment.trim() && !submitting
                ? "bg-gradient-to-r from-indigo-500 to-[#39d2c0] text-white hover:shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            发送
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">提示：Ctrl+Enter / ⌘+Enter 快捷发送</p>
      </div>

      {/* 评论列表 */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">加载讨论...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            还没有讨论，来第一个发言吧 💬
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{comment.author}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDisplayTime(comment.time)}
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap mb-2">
                {comment.content}
              </p>
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                {comment.likes > 0 ? comment.likes : "点赞"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
