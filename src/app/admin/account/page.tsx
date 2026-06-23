"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Shield, BarChart3, Users, Download, ChevronDown, ChevronUp
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// ---------- Types (匹配后端API实际字段) ----------
interface Enrollment {
  id: number;
  name: string;
  mobile: string;              // 后端字段：手机号
  email?: string | null;
  class_name?: string | null; // 报的班级（初级/中级/高级/师训班）
  branch_name?: string | null; // 来源/分支机构
  type: string;                // 报名类型（teacher-training/partner/student）
  status: string;
  remark?: string | null;      // 备注
  created_at: string;
  updated_at?: string;
  // 金额字段目前后端没有，先预留
  total_fee?: number | null;
  paid_fee?: number | null;
}

interface DashboardData {
  total_enrollments: number;
  pending_enrollments: number;
  confirmed_enrollments: number;
  cancelled_enrollments: number;
  today_enrollments: number;
  total_courses: number;
  total_partners: number;
  enrollment_by_type?: Record<string, number>;
  enrollment_by_status?: Record<string, number>;
  recent_enrollments?: Array<Enrollment>;
}

// ---------- Helpers ----------
function statusLabel(status: string): string {
  const m: Record<string, string> = {
    pending: "待处理", new: "新报名", confirmed: "已确认",
    active: "进行中", cancelled: "已取消", rejected: "已拒绝",
  };
  return m[status] || status;
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-800 border-yellow-300",
    new:       "bg-blue-100 text-blue-800 border-blue-300",
    confirmed: "bg-green-100 text-green-800 border-green-300",
    active:    "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
    rejected:  "bg-red-100 text-red-800 border-red-300",
  };
  const c = colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${c}`}>
      {statusLabel(status)}
    </span>
  );
}

function typeLabel(t: string): string {
  const m: Record<string, string> = {
    "teacher-training": "教培师培训",
    "partner": "合伙人",
    "student": "学员",
    "teacher": "教培师",
  };
  return m[t] || t;
}

// ---------- Main Page ----------
export default function AdminAccountPage() {
  const router = useRouter();

  // Auth
  const [adminInfo, setAdminInfo] = useState<{ username: string; role: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Expand detail
  const [detailId, setDetailId] = useState<number | null>(null);

  // Init
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const username = localStorage.getItem("admin_username") || "admin";
    const role = localStorage.getItem("admin_role") || "admin";
    setAdminInfo({ username, role });
    setAuthLoading(false);
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      // Fetch dashboard stats
      const statsRes = await fetch(`${API_BASE}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsRes.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      const statsData = statsRes.ok ? await statsRes.json() : null;
      const s = statsData?.data || statsData || {};

      // Fetch enrollment list
      const listRes = await fetch(`${API_BASE}/enrollment/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (listRes.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      let list: Enrollment[] = [];
      if (listRes.ok) {
        const ld = await listRes.json();
        list = ld.data?.items || ld.data || ld.items || [];
      }

      setEnrollments(list);
      setDashboard({
        total_enrollments:   s.total_enrollments ?? list.length,
        pending_enrollments: s.pending_enrollments ?? list.filter((e: Enrollment) => e.status === "pending" || e.status === "new").length,
        confirmed_enrollments: s.confirmed_enrollments ?? list.filter((e: Enrollment) => e.status === "confirmed" || e.status === "active").length,
        cancelled_enrollments: s.cancelled_enrollments ?? list.filter((e: Enrollment) => e.status === "cancelled" || e.status === "rejected").length,
        today_enrollments:   s.today_enrollments ?? 0,
        total_courses:       s.total_courses ?? 0,
        total_partners:      s.total_partners ?? 0,
        enrollment_by_type:  s.enrollment_by_type,
        enrollment_by_status: s.enrollment_by_status,
        recent_enrollments:  list.slice(0, 5),
      });
    } catch (err: any) {
      setError(err.message || "网络错误");
    } finally {
      setLoading(false);
    }
  }

  // Export CSV
  function exportCSV() {
    const headers = ["姓名", "手机号", "报名类型", "班级", "来源/分支机构", "状态", "应付金额", "实付金额", "备注", "报名时间"];
    const rows = filtered.map((e) => [
      e.name,
      e.mobile,
      typeLabel(e.type),
      e.class_name || "",
      e.branch_name || "",
      statusLabel(e.status),
      e.total_fee != null ? String(e.total_fee) : "",
      e.paid_fee != null ? String(e.paid_fee) : "",
      e.remark || "",
      new Date(e.created_at).toLocaleString("zh-CN"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `报名数据_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Computed
  const filtered = enrollments
    .filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!e.name?.toLowerCase().includes(q) && !e.mobile?.includes(q)) return false;
      }
      if (statusFilter && e.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const selected = detailId ? enrollments.find((e) => e.id === detailId) : null;

  // Auth loading
  if (authLoading) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ========= Admin Header ========= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">CCAV 报名管理</h1>
              <p className="text-xs text-gray-400">{adminInfo?.username} · {adminInfo?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem("admin_token"); router.replace("/admin/login"); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ========= Stats Row ========= */}
        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "总报名", value: dashboard.total_enrollments, cls: "text-blue-600", bg: "bg-blue-50" },
              { label: "待处理", value: dashboard.pending_enrollments, cls: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "今日新增", value: dashboard.today_enrollments, cls: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "已确认", value: dashboard.confirmed_enrollments, cls: "text-green-600", bg: "bg-green-50" },
            ].map((s) => (
              <div key={s.label} className={`p-4 rounded-xl ${s.bg} border border-gray-200`}>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className={`text-2xl font-bold mt-1 ${s.cls}`}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ========= Search + Filter + Export ========= */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              placeholder="搜索姓名、手机号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:border-blue-400"
          >
            <option value="">全部状态</option>
            <option value="new">新报名</option>
            <option value="pending">待处理</option>
            <option value="confirmed">已确认</option>
            <option value="cancelled">已取消</option>
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出CSV
          </button>
          <button
            onClick={fetchAllData}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            刷新
          </button>
        </div>

        {/* ========= Error ========= */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ========= Loading ========= */}
        {loading && (
          <div className="text-center py-12 text-sm text-gray-400">
            加载中...
          </div>
        )}

        {/* ========= Enrollment List ========= */}
        {!loading && (
          <div className="space-y-2">
            {/* Table Header (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-[40px_1fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-2 px-4 py-2 text-xs text-gray-400 font-medium bg-white rounded-t-xl border-b border-gray-100">
              <span>#</span>
              <span>姓名</span>
              <span>手机号</span>
              <span>报名类型</span>
              <span>班级</span>
              <span>来源</span>
              <span>状态</span>
              <span></span>
            </div>

            {filtered.length === 0 && !loading && (
              <div className="text-center py-12 text-sm text-gray-400 bg-white rounded-xl border border-gray-200">
                暂无报名记录
              </div>
            )}

            {filtered.map((e, idx) => (
              <div key={e.id}>
                <div
                  onClick={() => setDetailId(detailId === e.id ? null : e.id)}
                  className="bg-white rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:border-blue-300 transition-colors"
                >
                  {/* Mobile view */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">{e.name}</span>
                        <span className="text-xs text-gray-400 truncate">{e.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {statusBadge(e.status)}
                        {detailId === e.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span>{typeLabel(e.type)}</span>
                      {e.class_name && <span>· {e.class_name}</span>}
                      {e.branch_name && <span>· {e.branch_name}</span>}
                    </div>
                  </div>
                  {/* Desktop view */}
                  <div className="hidden md:grid grid-cols-[40px_1fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-2 items-center">
                    <span className="text-xs text-gray-400">{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{e.name}</span>
                    <span className="text-sm text-gray-600">{e.mobile}</span>
                    <span className="text-sm text-gray-600">{typeLabel(e.type)}</span>
                    <span className="text-sm text-gray-600">{e.class_name || '-'}</span>
                    <span className="text-sm text-gray-600">{e.branch_name || '-'}</span>
                    <span>{statusBadge(e.status)}</span>
                    {detailId === e.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* ========= Detail Panel ========= */}
                {detailId === e.id && selected && (
                  <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-4 py-4 -mt-1 mb-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">姓名</div>
                        <div className="text-gray-700 font-medium">{selected.name}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">手机号</div>
                        <div className="text-gray-700">{selected.mobile}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">报名类型</div>
                        <div className="text-gray-700">{typeLabel(selected.type)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">状态</div>
                        <div>{statusBadge(selected.status)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">报读班级</div>
                        <div className="text-gray-700">{selected.class_name || '-'}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">来源/分支机构</div>
                        <div className="text-gray-700">{selected.branch_name || '-'}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">应付金额</div>
                        <div className="text-gray-700">{selected.total_fee != null ? `¥${selected.total_fee}` : '-'}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">实付金额</div>
                        <div className="text-gray-700">{selected.paid_fee != null ? `¥${selected.paid_fee}` : '-'}</div>
                      </div>
                      {selected.email && (
                        <div className="p-2.5 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400 mb-0.5">邮箱</div>
                          <div className="text-gray-700">{selected.email}</div>
                        </div>
                      )}
                      {selected.remark && (
                        <div className="md:col-span-2 p-2.5 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400 mb-0.5">备注</div>
                          <div className="text-gray-700">{selected.remark}</div>
                        </div>
                      )}
                      <div className="p-2.5 rounded-lg bg-gray-50">
                        <div className="text-xs text-gray-400 mb-0.5">报名时间</div>
                        <div className="text-gray-700">{new Date(selected.created_at).toLocaleString("zh-CN")}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========= Quick Stats (bottom row) ========= */}
        {dashboard && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Status distribution */}
            <div className="p-5 rounded-xl bg-white border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
               报名状态分布
              </h3>
              {dashboard.enrollment_by_status && Object.keys(dashboard.enrollment_by_status).length > 0 ? (
                <div className="space-y-2.5">
                  {Object.entries(dashboard.enrollment_by_status).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">{statusLabel(k)}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${Math.min(100, (v / (dashboard.total_enrollments || 1)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 py-4 text-center">
                  暂无统计
                </div>
              )}
            </div>

            {/* Type distribution */}
            <div className="p-5 rounded-xl bg-white border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
               报名类型分布
              </h3>
              {dashboard.enrollment_by_type && Object.keys(dashboard.enrollment_by_type).length > 0 ? (
                <div className="space-y-2.5">
                  {Object.entries(dashboard.enrollment_by_type).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">{typeLabel(k)}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${Math.min(100, (v / (dashboard.total_enrollments || 1)) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 py-4 text-center">
                  暂无统计
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
