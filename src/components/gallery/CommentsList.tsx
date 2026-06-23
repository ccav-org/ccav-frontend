'use client';

import { useState, useEffect } from 'react';
import { GalleryComment, getGalleryComments, submitComment } from '@/lib/api';

interface Props {
  galleryId: number;
}

export default function CommentsList({ galleryId }: Props) {
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getGalleryComments(galleryId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [galleryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    const ok = await submitComment(galleryId, text.trim());
    if (ok) {
      setText('');
      // 重新获取评论列表
      const updated = await getGalleryComments(galleryId);
      setComments(updated);
    }
    setSending(false);
  };

  return (
    <div>
      <h3 className="text-sm text-white/40 mb-3">
        评论 <span className="text-white/20">({comments.length})</span>
      </h3>

      {/* 评论输入 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="说点什么..."
          className="flex-1 px-3 py-2 text-sm rounded-lg border text-white/60 placeholder-white/20 outline-none transition"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'rgba(200,184,152,0.3)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
        <button
          type="submit"
          disabled={sending}
          className="px-4 py-2 text-xs rounded-lg transition text-white/60 border border-white/10 hover:border-[#c8b898]/30 hover:text-[#c8b898] disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          {sending ? '...' : '发送'}
        </button>
      </form>

      {/* 评论列表 */}
      {loading ? (
        <div className="py-8 text-center text-white/20 text-xs">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-white/15 text-xs">暂无评论，来发表第一条吧</div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <img
                src={c.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.author}&backgroundColor=206683&textColor=ffffff`}
                alt=""
                className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs text-white/40">
                  {c.author}
                  <span className="text-white/20 ml-2">{formatTime(c.created_at)}</span>
                </p>
                <p className="text-sm text-white/50 mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}
