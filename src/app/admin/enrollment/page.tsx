"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut, Shield, Search, Download, ChevronDown, ChevronUp,
  Loader2, RefreshCw, User, Phone, Tag, Calendar, FilterX,
  ArrowLeft, ExternalLink, FileText
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// ========== Types ==========
interface Enrollment {
  id: number;
  student_id: string;
  name: string;
  mobile: string;
  email?: string | null;
  class_name?: string | null;
  branch_name?: string | null;
  type: string;
  status: string;
  total_fee?: number | null;
  paid_fee?: number | null;
  refund_fee?: number | null;
  remark?: string | null;
  created_at: string;
  updated_at?: string;
}

// ========== Helpers ==========
function statusLabel(s: string): string {
  const m: Record<string, string> = {
    pending: "待处理", new: "新报名", confirmed: "已确认",
    active: "进行中", cancelled: "已取消", rejected: "已拒绝",
  };
  return m[s] || s;
}

function statusBadge(s: string) {
  const colors: Record<string, string> = {
    pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
    new:       "bg-blue-50 text-blue-700 border-blue-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    active:    "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    rejected:  "bg-red-50 text-red-700 border-red-200",
  };
  const c = colors[s] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c}`}>
      {statusLabel(s)}
    </span>
  );
}

function typeLabel(t: string): string {
  const m: Record<string, string> = {
    "teacher-training": "教培师培训", "partner": "合伙人",
    "student": "学员", "teacher": "教培师",
  };
  return m[t] || t;
}

// ========== Page ==========
export default function AdminEnrollmentPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<{ username: string } | null>(null);

  // Data
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15;

  // Expanded row
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Auth check
  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) { router.replace("/admin/login"); return; }
    const u = localStorage.getItem("admin_username") || "admin";
    setToken(t);
    setAdmin({ username: u });
  }, [router]);

  // Fetch list
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(pageSize));
      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`${API_BASE}/enrollment/list?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) { setError(`请求失败 (${res.status})`); return; }
      const d = await res.json();
      const data = d.data || d;
      setItems(data.items || data.rows || []);
      setTotal(data.total || data.count || data.items?.length || 0);
    } catch (e: any) {
      setError(e.message || "网络错误");
    } finally {
      setLoading(false);
    }
  }, [token, page, search, status, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Export CSV
  function exportCSV() {
    if (!token) return;
    const a = document.createElement("a");
    a.href = `${API_BASE}/enrollment/export?token=${encodeURIComponent(token)}`;
    a.download = `报名数据_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  // Logout
  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    router.replace("/admin/login");
  }

  // Stats summary
  const [stats, setStats] = useState<{ total: number; pending: number; today: number; confirmed: number } | null>(null);
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const s = d?.data || d || {};
        setStats({
          total: s.total_enrollments ?? 0,
          pending: s.pending_enrollments ?? 0,
          today: s.today_enrollments ?? 0,
          confirmed: s.confirmed_enrollments ?? 0,
        });
      })
      .catch(() => {});
  }, [token]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===== Admin Header ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/account" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">报名列表</h1>
              <p className="text-xs text-gray-400">{admin?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="刷新">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ===== Stats Row ===== */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "总报名", value: stats.total, cls: "text-blue-600", bg: "bg-blue-50" },
              { label: "待处理", value: stats.pending, cls: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "今日新增", value: stats.today, cls: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "已确认", value: stats.confirmed, cls: "text-green-600", bg: "bg-green-50" },
            ].map(s => (
              <div key={s.label} className={`p-4 rounded-xl ${s.bg} border border-gray-200`}>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className={`text-2xl font-bold mt-1 ${s.cls}`}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Search + Filter ===== */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、手机号..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:border-blue-400"
          >
            <option value="">全部状态</option>
            <option value="new">新报名</option>
            <option value="pending">待处理</option>
            <option value="confirmed">已确认</option>
            <option value="cancelled">已取消</option>
          </select>
          {(search || status) && (
            <button
              onClick={() => { setSearch(""); setStatus(""); setPage(1); }}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-200"
            >
              <FilterX className="w-4 h-4" />
              清除筛选
            </button>
          )}
        </div>

        {/* ===== Results ===== */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header row (desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
            <div className="col-span-1">编号</div>
            <div className="col-span-2">姓名</div>
            <div className="col-span-2">手机号</div>
            <div className="col-span-2">班级</div>
            <div className="col-span-2">类型</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-2 text-right">报名时间</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              加载中...
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-red-500 text-sm mb-2">{error}</p>
              <button onClick={fetchData} className="text-blue-600 text-sm hover:underline">重试</button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">暂无报名记录</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={item.id}>
                {/* Row */}
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  {/* Mobile: single row */}
                  <div className="md:hidden flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {statusBadge(item.status)}
                      <span className="font-medium text-sm text-gray-800">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="text-xs">{item.mobile}</span>
                      {expandedId === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Desktop columns */}
                  <div className="hidden md:block col-span-1 text-xs text-gray-400">#{item.id}</div>
                  <div className="hidden md:block col-span-2 text-sm font-medium text-gray-800">{item.name}</div>
                  <div className="hidden md:block col-span-2 text-sm text-gray-600">{item.mobile}</div>
                  <div className="hidden md:block col-span-2 text-sm text-gray-600">{item.class_name || "-"}</div>
                  <div className="hidden md:block col-span-2 text-xs text-gray-500">{typeLabel(item.type)}</div>
                  <div className="hidden md:block col-span-1">{statusBadge(item.status)}</div>
                  <div className="hidden md:block col-span-2 text-xs text-gray-400 text-right">
                    {new Date(item.created_at).toLocaleDateString("zh-CN")}
                  </div>

                  {/* Mobile extra info */}
                  <div className="md:hidden flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{item.class_name || "-"}</span>
                    <span>{typeLabel(item.type)}</span>
                    <span>{new Date(item.created_at).toLocaleDateString("zh-CN")}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedId === item.id && (
                  <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-white border border-gray-100">
                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> 学员信息
                        </div>
                        <div className="text-sm font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {item.mobile}
                        </div>
                        {item.email && <div className="text-xs text-gray-500 mt-0.5">{item.email}</div>}
                        {item.student_id && <div className="text-xs text-gray-400 mt-1">编号: {item.student_id}</div>}
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-gray-100">
                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> 报名信息
                        </div>
                        <div className="text-sm text-gray-800">
                          班级: <span className="font-medium">{item.class_name || "-"}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">类型: {typeLabel(item.type)}</div>
                        {item.branch_name && <div className="text-xs text-gray-500">来源: {item.branch_name}</div>}
                        {item.remark && <div className="text-xs text-gray-500 mt-1">备注: {item.remark}</div>}
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-gray-100">
                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 费用 & 时间
                        </div>
                        <div className="text-sm text-gray-800">
                          费用: {item.total_fee ? `¥${item.total_fee}` : "-"}
                          {item.paid_fee ? ` / 已付 ¥${item.paid_fee}` : ""}
                          {item.refund_fee ? ` / 退费 ¥${item.refund_fee}` : ""}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          状态: {statusLabel(item.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          报名: {new Date(item.created_at).toLocaleString("zh-CN")}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Link
                        href={`/admin/enrollment/detail?id=${item.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors border border-blue-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        查看详情 & 操作
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-400">
              共 {total} 条，第 {page}/{totalPages} 页
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                上一页
              </button>
              {(() => {
                const pages: (number | string)[] = [];
                for (let i = 1; i <= totalPages; i++) {
                  if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
                    pages.push(i);
                  } else if (pages[pages.length - 1] !== "...") {
                    pages.push("...");
                  }
                }
                return pages;
              })().map((p, i) =>
                typeof p === "string" ? (
                  <span key={`el-${i}`} className="px-1 text-gray-300">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
