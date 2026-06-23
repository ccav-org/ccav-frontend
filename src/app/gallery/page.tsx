"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GalleryItem, getGalleryItems, galleryFetch, toggleLike as apiToggleLike, toggleDislike as apiToggleDislike, recordView as apiRecordView } from "@/lib/api";
import CommentsList from "@/components/gallery/CommentsList";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";

// ── 6 维筛选维度定义 ──
// 单选维度：creation_type, art_style, difficulty
// 多选维度：application_scenes, tool_chain, secondary_tags
type Dim = 'creation_type' | 'application_scenes' | 'tool_chain' | 'art_style' | 'secondary_tags' | 'difficulty';

// 维度元信息
const DIM_META: Record<Dim, { label: string; icon: string; multi: boolean }> = {
  creation_type:       { label: '创作类型',   icon: '🌐', multi: false },
  application_scenes:  { label: '应用场景',   icon: '🎬', multi: true },
  tool_chain:          { label: '工具链',     icon: '🔧', multi: true },
  art_style:           { label: '艺术风格',   icon: '🎨', multi: false },
  secondary_tags:      { label: '二级标签',   icon: '🏷️', multi: true },
  difficulty:          { label: '难度/学段',  icon: '🪜', multi: false },
};

// 后端值 → 前端标签
const CREATION_TYPE_LABEL: Record<string, string> = {
  'ai-image': 'AI图片',
  'ai-video': 'AI视频',
  'ai-music': 'AI音乐',
};
const CREATION_TYPE_VALUE: Record<string, string> = {
  'AI图片': 'ai-image',
  'AI视频': 'ai-video',
  'AI音乐': 'ai-music',
};

// 后端旧 tech_type → 前端标签（保留旧兼容）
const TECH_LABEL: Record<string, string> = {
  'image': 'AI图片',
  'video': 'AI视频',
  'music': 'AI音乐',
};

// 难度中文标签
const DIFFICULTY_LABEL: Record<string, string> = {
  'M1': 'M1·基础工坊',
  'M2': 'M2·进阶工具',
  'M3': 'M3·超清精修',
  'M4': 'M4·综合实战',
  'M5': 'M5·商业交付',
};

export default function GalleryPage() {
  // ── 作品数据 ──
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // ── 后端动态筛选选项 ──
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});

  // ── 各维度选中状态 ──
  // 单选维度：存储选中的值（'' 表示未选）
  // 多选维度：存储选中的列表 []（空数组表示未选）
  const [singleFilters, setSingleFilters] = useState<Record<string, string>>({
    creation_type: '',
    art_style: '',
    difficulty: '',
  });
  const [multiFilters, setMultiFilters] = useState<Record<string, string[]>>({
    application_scenes: [],
    tool_chain: [],
    secondary_tags: [],
  });

  // ── 加载筛选选项 ──
  useEffect(() => {
    galleryFetch('/filters', {}).then((res: any) => {
      if (res) {
        setFilterOptions(res);
      }
    }).catch(() => {});
  }, []);

  // ── 单选标签点击 ──
  const handleSingleClick = (dim: string, value: string) => {
    setSingleFilters(prev => ({
      ...prev,
      [dim]: prev[dim] === value ? '' : value,
    }));
  };

  // ── 多选标签点击 ──
  const handleMultiClick = (dim: string, value: string) => {
    setMultiFilters(prev => {
      const current = prev[dim] || [];
      if (current.includes(value)) {
        return { ...prev, [dim]: current.filter(v => v !== value) };
      }
      return { ...prev, [dim]: [...current, value] };
    });
  };

  // ── 清除所有筛选 ──
  const clearFilters = () => {
    setSingleFilters({ creation_type: '', art_style: '', difficulty: '' });
    setMultiFilters({ application_scenes: [], tool_chain: [], secondary_tags: [] });
  };

  const hasActiveFilters =
    Object.values(singleFilters).some(v => v !== '') ||
    Object.values(multiFilters).some(arr => arr.length > 0);

  // ── 加载作品数据 ──
  useEffect(() => {
    const params: any = {};

    // 单选
    if (singleFilters.creation_type) params.creation_type = singleFilters.creation_type;
    if (singleFilters.art_style) params.art_style = singleFilters.art_style;
    if (singleFilters.difficulty) params.difficulty = singleFilters.difficulty;

    // 多选 —— 后端用 LIKE 单值匹配，一次只传一个
    // 多选时使用第一个选中值传参，其余值靠前端过滤
    // 或者后端支持逗号分隔？看后端实现用的是单个 LIKE
    // 这里取第一个选中值传给后端，其余值靠前端过滤
    if (multiFilters.application_scenes.length > 0) {
      params.application_scene = multiFilters.application_scenes[0];
    }
    if (multiFilters.tool_chain.length > 0) {
      params.tool_chain = multiFilters.tool_chain[0];
    }
    if (multiFilters.secondary_tags.length > 0) {
      params.secondary_tag = multiFilters.secondary_tags[0];
    }

    setLoading(true);
    getGalleryItems(params).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [
    singleFilters.creation_type,
    singleFilters.art_style,
    singleFilters.difficulty,
    multiFilters.application_scenes,
    multiFilters.tool_chain,
    multiFilters.secondary_tags,
  ]);

  // ── 前端二次过滤（多选维度需要客户端交叉匹配） ──
  const displayedWorks = items.filter(it => {
    // 单选过滤（服务端已做，前端辅助）
    if (singleFilters.creation_type && it.creation_type !== singleFilters.creation_type) return false;
    if (singleFilters.art_style && it.art_style !== singleFilters.art_style) return false;
    if (singleFilters.difficulty && it.difficulty !== singleFilters.difficulty) return false;

    // 多选过滤（前端检查多个值）
    if (multiFilters.application_scenes.length > 0) {
      const scenes = it.application_scenes || [];
      if (!multiFilters.application_scenes.some(s => scenes.includes(s))) return false;
    }
    if (multiFilters.tool_chain.length > 0) {
      const chains = it.tool_chain || [];
      if (!multiFilters.tool_chain.some(t => chains.includes(t))) return false;
    }
    if (multiFilters.secondary_tags.length > 0) {
      const tags = it.secondary_tags || [];
      if (!multiFilters.secondary_tags.some(t => tags.includes(t))) return false;
    }

    return true;
  });

  // ── 浏览器回退处理 ──
  const selectedRef = useRef<GalleryItem | null>(null);
  useEffect(() => { selectedRef.current = selectedItem; }, [selectedItem]);

  const closeDetail = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (selectedRef.current) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // ── 记录浏览量 ──
  const openDetail = async (item: GalleryItem) => {
    if (!selectedItem) {
      window.history.pushState({ galleryModalOpen: true }, "");
    }
    setSelectedItem(item);
    apiRecordView(item.id).then((count) => {
      if (count !== null) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, views_count: count } : it
          )
        );
        setSelectedItem((prev) =>
          prev && prev.id === item.id ? { ...prev, views_count: count } : prev
        );
      }
    });
  };

  const toggleLike = async (id: number) => {
    const result = await apiToggleLike(id);
    if (!result) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, ...result } : it
      )
    );
    setSelectedItem((prev) =>
      prev?.id === id ? { ...prev, ...result } : prev
    );
  };

  const toggleDislike = async (id: number) => {
    const result = await apiToggleDislike(id);
    if (!result) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, ...result } : it
      )
    );
    setSelectedItem((prev) =>
      prev?.id === id ? { ...prev, ...result } : prev
    );
  };

  // ── 渲染单选行 ──
  const renderSingleRow = (dim: string, options: string[], labelMap?: Record<string, string>) => {
    const meta = DIM_META[dim as Dim];
    const active = singleFilters[dim] || '';

    return (
      <div className="mb-2 last:mb-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: "rgba(0,0,0,0.3)" }}>
            {meta.icon} {meta.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {options.map(opt => {
            const label = labelMap?.[opt] ?? opt;
            const isActive = active === opt;
            return (
              <button
                key={opt}
                onClick={() => handleSingleClick(dim, opt)}
                className={[
                  'px-2.5 py-1 rounded-md border transition-all duration-150 text-xs',
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 border-blue-500/30'
                    : 'text-zinc-400 border-zinc-300/30 hover:text-zinc-600 hover:border-zinc-400/50',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ── 渲染多选行（标签云风格） ──
  const renderMultiRow = (dim: string, options: string[], labelMap?: Record<string, string>) => {
    const meta = DIM_META[dim as Dim];
    const active = multiFilters[dim] || [];

    return (
      <div className="mb-2 last:mb-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: "rgba(0,0,0,0.3)" }}>
            {meta.icon} {meta.label}
          </span>
          {active.length > 0 && (
            <span className="text-[10px] text-blue-400/60">已选 {active.length}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {options.map(opt => {
            const label = labelMap?.[opt] ?? opt;
            const isActive = active.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => handleMultiClick(dim, opt)}
                className={[
                  'px-2.5 py-1 rounded-md border transition-all duration-150 text-xs',
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 border-blue-500/30'
                    : 'text-zinc-400 border-zinc-300/30 hover:text-zinc-600 hover:border-zinc-400/50',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "作品展示" }]} />
      <div className="min-h-screen"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(14,165,233,0.03) 0%, transparent 60%), " +
            "#f8fafc",
        }}>
        {/* Hero */}
        <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "#1e293b" }}>
            作品墙
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: "rgba(0,0,0,0.45)" }}>
            学员AI作品展示区 · 用AI创造文化之美
          </p>

          {/* ── 6 维筛选面板（全部展开，视觉降权） ── */}
          <div className="max-w-2xl mx-auto mt-6 p-4 rounded-xl"
            style={{ background: "#ffffff", border: "1px solid rgba(37,99,235,0.08)" }}>

            {/* 创作类型（单选） */}
            {renderSingleRow('creation_type', (filterOptions.creation_types as string[]) || ['ai-image', 'ai-video', 'ai-music'], CREATION_TYPE_LABEL)}

            {/* 应用场景（多选） */}
            {(filterOptions.application_scenes as string[] || []).length > 0 && renderMultiRow('application_scenes', filterOptions.application_scenes as string[])}

            {/* 工具链（多选） */}
            {(filterOptions.tool_chains as string[] || []).length > 0 && renderMultiRow('tool_chain', filterOptions.tool_chains as string[])}

            {/* 艺术风格（单选） */}
            {(filterOptions.art_styles as string[] || []).length > 0 && renderSingleRow('art_style', filterOptions.art_styles as string[])}

            {/* 二级标签（多选） */}
            {(filterOptions.secondary_tags as string[] || []).length > 0 && renderMultiRow('secondary_tags', filterOptions.secondary_tags as string[])}

            {/* 难度（单选） */}
            {(filterOptions.difficulties as string[] || []).length > 0 && renderSingleRow('difficulty', filterOptions.difficulties as string[], DIFFICULTY_LABEL)}

            {/* 清除筛选按钮 */}
            {hasActiveFilters && (
              <div className="mt-3 pt-2 border-t border-zinc-100">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-xs rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition"
                >
                  清除筛选
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 作品网格 */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-[#c8b898]/30 border-t-[#c8b898] rounded-full animate-spin" />
            </div>
          ) : displayedWorks.length === 0 ? (
            <div className="text-center py-32" style={{ color: "rgba(0,0,0,0.2)" }}>
              <p className="text-lg">暂无作品</p>
              <p className="text-sm mt-2">调整筛选条件后试试</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-xs rounded-lg border border-blue-500/20 text-blue-500/60 hover:text-blue-500 hover:border-blue-500/40 transition"
                >
                  显示全部
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-left mb-4 text-xs" style={{ color: "rgba(0,0,0,0.3)" }}>
                共 {displayedWorks.length} 个作品
              </div>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {displayedWorks.map((item) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid cursor-pointer group rounded-lg overflow-hidden border border-white/5 hover:border-[#c8b898]/20 transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                    onClick={() => openDetail(item)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {item.media_type === 'video' && item.video_url && item.video_url !== '无' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                              <polygon points="8,5 19,12 8,19" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {/* 创作类型角标 */}
                      {item.creation_type && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}>
                          {CREATION_TYPE_LABEL[item.creation_type] || item.creation_type}
                        </div>
                      )}
                      {/* 难度角标 */}
                      {item.difficulty && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ background: "rgba(200,184,152,0.2)", color: "#c8b898" }}>
                          {item.difficulty}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <img
                          src={item.avatar_url}
                          alt={item.author}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
                          {item.author}
                        </span>
                        <span className="text-[10px]" style={{ color: "rgba(0,0,0,0.2)" }}>·</span>
                        <span className="text-[10px]" style={{ color: "rgba(0,0,0,0.25)" }}>
                          {item.created_at}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium line-clamp-1" style={{ color: "rgba(0,0,0,0.8)" }}>
                        {item.title}
                      </h3>
                      {item.instructor && (
                        <div className="mt-1 text-[10px]" style={{ color: "rgba(229,62,62,0.5)" }}>
                          指导老师: {item.instructor}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: "rgba(0,0,0,0.3)" }}>
                        <span>❤️ {item.likes_count - item.dislikes_count}</span>
                        <span>👁 {item.views_count}</span>
                        {item.course_name && (
                          <span className="truncate">{item.course_name}</span>
                        )}
                      </div>
                      {/* 工具链标签 */}
                      {item.tool_chain && item.tool_chain.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.tool_chain.slice(0, 3).map(tc => (
                            <span key={tc} className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(0,0,0,0.03)", color: "rgba(0,0,0,0.35)" }}>
                              {tc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ── 作品详情弹窗 ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-auto"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={closeDetail}
        >
          <div
            className="relative w-full max-w-4xl mx-auto my-8 rounded-xl overflow-hidden"
            style={{ background: "#1a1a2e" }}
            onClick={e => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* 媒体区域 */}
            <div className="relative w-full max-h-[70vh] overflow-hidden bg-black/30 flex items-center justify-center">
              {selectedItem.media_type === 'video' && selectedItem.video_url && selectedItem.video_url !== '无' ? (
                <video
                  src={selectedItem.video_url}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                  poster={selectedItem.image_url}
                />
              ) : (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full max-h-[70vh] object-contain"
                />
              )}
              {/* 媒体信息角标 */}
              {selectedItem.creation_type && (
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium"
                  style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}>
                  {CREATION_TYPE_LABEL[selectedItem.creation_type] || selectedItem.creation_type}
                  {selectedItem.difficulty && <> · {selectedItem.difficulty}</>}
                </div>
              )}
              {selectedItem.media_type === 'video' && selectedItem.duration_seconds && (
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs"
                  style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.6)" }}>
                  {Math.floor(selectedItem.duration_seconds / 60)}:{String(selectedItem.duration_seconds % 60).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* 信息区域 */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white/90">{selectedItem.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                    <img src={selectedItem.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                    <span>{selectedItem.author}</span>
                    {selectedItem.instructor && (
                      <>
                        <span>·</span>
                        <span className="text-[#e53e3e]/50">指导老师: {selectedItem.instructor}</span>
                      </>
                    )}
                    {selectedItem.course_name && (
                      <>
                        <span>·</span>
                        <span className="text-[#c8b898]/60">{selectedItem.course_name}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{selectedItem.created_at}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(selectedItem.id)}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition ${
                      selectedItem.liked ? 'bg-[#c8b898]/10' : ''
                    }`}
                    style={{
                      borderColor: selectedItem.liked ? "rgba(200,184,152,0.3)" : "rgba(255,255,255,0.1)",
                      color: selectedItem.liked ? "#c8b898" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={selectedItem.liked ? "#c8b898" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {selectedItem.likes_count - selectedItem.dislikes_count}
                  </button>
                  <button
                    onClick={() => toggleDislike(selectedItem.id)}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition ${
                      selectedItem.disliked ? 'bg-red-900/20' : ''
                    }`}
                    style={{
                      borderColor: selectedItem.disliked ? "rgba(255,80,80,0.3)" : "rgba(255,255,255,0.1)",
                      color: selectedItem.disliked ? "#ff6666" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={selectedItem.disliked ? "#ff6666" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M17 14V2M9 18.12l-4-6.3V4h11.2l1.2 5.46a2 2 0 0 1-.24 1.73L12 20" />
                    </svg>
                    {selectedItem.dislikes_count}
                  </button>
                </div>
              </div>

              {/* 6 维标签展示 */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {/* 创作类型 */}
                {selectedItem.creation_type && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(59,130,246,0.1)", color: "rgba(59,130,246,0.6)" }}>
                    {CREATION_TYPE_LABEL[selectedItem.creation_type] || selectedItem.creation_type}
                  </span>
                )}
                {/* 艺术风格 */}
                {selectedItem.art_style && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(168,85,247,0.1)", color: "rgba(168,85,247,0.6)" }}>
                    {selectedItem.art_style}
                  </span>
                )}
                {/* 难度 */}
                {selectedItem.difficulty && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(200,184,152,0.1)", color: "rgba(200,184,152,0.7)" }}>
                    {DIFFICULTY_LABEL[selectedItem.difficulty] || selectedItem.difficulty}
                  </span>
                )}
                {/* 应用场景 */}
                {selectedItem.application_scenes?.map(s => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(16,185,129,0.1)", color: "rgba(16,185,129,0.6)" }}>
                    {s}
                  </span>
                ))}
                {/* 工具链 */}
                {selectedItem.tool_chain?.map(tc => (
                  <span key={tc} className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(245,158,11,0.1)", color: "rgba(245,158,11,0.6)" }}>
                    {tc}
                  </span>
                ))}
                {/* 二级标签 */}
                {selectedItem.secondary_tags?.map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(236,72,153,0.1)", color: "rgba(236,72,153,0.6)" }}>
                    #{t}
                  </span>
                ))}
                {/* 旧标签 */}
                {selectedItem.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm text-white/50 leading-relaxed">{selectedItem.description}</p>

              <div className="my-4 border-t border-white/5" />

              <div>
                <CommentsList galleryId={selectedItem.id} />
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
