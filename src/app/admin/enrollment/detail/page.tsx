"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut, Shield, ArrowLeft, User, Phone, Tag, Calendar,
  DollarSign, RefreshCw, X, Check, Loader2,
  FileText, CreditCard, RotateCcw, History, AlertCircle,
  CheckCircle2, Mail, Edit3
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// ========== Date helpers ==========
function safeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  // 兼容 "2026-06-13 21:51:10" 格式（无T、无Z）
  const normalized = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("zh-CN");
}

// ========== Types ==========
interface EnrollmentDetail {
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
  payments?: Payment[];
  student?: {
    name: string;
    mobile?: string | null;
    email?: string | null;
    student_no?: string | null;
  };
  payment?: {
    id?: number;
    paid_amount?: number | null;
    payment_method?: string | null;
    remark?: string | null;
    created_at?: string | null;
  };
  refunds?: Refund[];
  logs?: LogEntry[];
}

interface Payment {
  id: number;
  paid_amount: number;
  payment_method?: string;
  remark?: string;
  created_at: string;
}

interface Refund {
  id: number;
  amount: number;
  status: string;
  reason?: string;
  created_at: string;
}

interface LogEntry {
  id: number;
  action: string;
  detail?: string;
  created_at: string;
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

function getActionIcon(action: string) {
  if (action.includes("创建") || action.includes("create") || action.includes("insert"))
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (action.includes("支付") || action.includes("payment") || action.includes("更新") || action.includes("update"))
    return <Edit3 className="w-4 h-4 text-blue-500" />;
  if (action.includes("退费") || action.includes("refund") || action.includes("取消") || action.includes("cancel"))
    return <RotateCcw className="w-4 h-4 text-red-500" />;
  return <History className="w-4 h-4 text-gray-400" />;
}

// ========== Modal Component ==========
function Modal({ open, title, children, onClose }: {
  open: boolean; title: string; children: React.ReactNode; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ========== Main Page ==========
export default function AdminEnrollmentDetailPage() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [detail, setDetail] = useState<EnrollmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showPayment, setShowPayment] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Form states
  const [paidAmount, setPaidAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Init: get id from URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eid = params.get("id");
    if (eid) setId(eid);
  }, []);

  // Auth check
  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) { router.replace("/admin/login"); return; }
    setToken(t);
  }, [router]);

  // Fetch detail
  useEffect(() => {
    if (!token || !id) return;
    fetchDetail();
  }, [token, id]);

  async function fetchDetail() {
    if (!token || !id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/enrollment/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) { setError(`请求失败 (${res.status})`); return; }
      const d = await res.json();
      const raw = d.data || d;
      // 后端返回嵌套结构 { enrollment, student, payment, refunds, logs }
      // 需要映射成扁平结构供页面组件使用
      const enrollment = raw.enrollment || raw;
      const student = raw.student || {};
      const payment = raw.payment || {};
      const mapped: EnrollmentDetail = {
        id: enrollment.id,
        student_id: enrollment.student_no || enrollment.student_id || '',
        name: enrollment.name || student.name || '',
        mobile: enrollment.mobile || student.mobile || '',
        email: student.email || null,
        class_name: enrollment.class_name || null,
        branch_name: enrollment.branch_name || null,
        type: enrollment.type || '',
        status: enrollment.status || '',
        total_fee: enrollment.amount != null ? enrollment.amount : null,
        paid_fee: enrollment.paid_amount != null ? enrollment.paid_amount : null,
        refund_fee: enrollment.refund_amount != null ? enrollment.refund_amount : null,
        remark: enrollment.remark || null,
        created_at: enrollment.created_at || '',
        updated_at: enrollment.updated_at || null,
        student: student,
        payment: payment,
        refunds: raw.refunds || [],
        logs: raw.logs || [],
      };
      setDetail(mapped);
    } catch (e: any) {
      setError(e.message || "网络错误");
    } finally {
      setLoading(false);
    }
  }

  // --- Actions ---
  async function updateStatus() {
    if (!token || !id || !newStatus) return;
    setActionLoading(true);
    setActionError(""); setActionSuccess("");
    try {
      const res = await fetch(`${API_BASE}/enrollment/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const d = await res.json();
      if ((d.code === 200 || res.ok) && !d.error) {
        setActionSuccess("状态更新成功");
        setShowStatus(false);
        setTimeout(fetchDetail, 500);
      } else {
        setActionError(d.msg || d.error || "更新失败");
      }
    } catch (e: any) {
      setActionError(e.message || "网络错误");
    } finally {
      setActionLoading(false);
    }
  }

  async function updatePayment() {
    if (!token || !id || !paidAmount) return;
    setActionLoading(true);
    setActionError(""); setActionSuccess("");
    try {
      const res = await fetch(`${API_BASE}/payment/update/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paid_amount: Number(paidAmount) }),
      });
      const d = await res.json();
      if ((d.code === 200 || res.ok) && !d.error) {
        setActionSuccess("支付更新成功");
        setShowPayment(false);
        setTimeout(fetchDetail, 500);
      } else {
        setActionError(d.msg || d.error || "更新失败");
      }
    } catch (e: any) {
      setActionError(e.message || "网络错误");
    } finally {
      setActionLoading(false);
    }
  }

  async function createRefund() {
    if (!token || !id || !refundAmount) return;
    setActionLoading(true);
    setActionError(""); setActionSuccess("");
    try {
      const res = await fetch(`${API_BASE}/refund/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          enrollment_id: Number(id),
          amount: Number(refundAmount),
          reason: refundReason,
        }),
      });
      const d = await res.json();
      if ((d.code === 200 || res.ok) && !d.error) {
        setActionSuccess("退费申请已提交");
        setShowRefund(false);
        setRefundAmount(""); setRefundReason("");
        setTimeout(fetchDetail, 500);
      } else {
        setActionError(d.msg || d.error || "申请失败");
      }
    } catch (e: any) {
      setActionError(e.message || "网络错误");
    } finally {
      setActionLoading(false);
    }
  }

  // Compute
  const remaining = detail
    ? (detail.total_fee ?? 0) - (detail.paid_fee ?? 0) - (detail.refund_fee ?? 0)
    : 0;

  // ===== Render =====
  if (!token) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===== Admin Header ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/enrollment" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                报名详情
                {id && <span className="text-sm font-normal text-gray-400 ml-2">#{id}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { localStorage.removeItem("admin_token"); router.replace("/admin/login"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> 退出
            </button>
          </div>
        </div>
      </header>

      {/* ===== Flash Messages ===== */}
      {actionSuccess && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
            <Check className="w-4 h-4" /> {actionSuccess}
            <button onClick={() => setActionSuccess("")} className="ml-auto text-green-500 hover:text-green-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> 加载中...
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-300" />
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button onClick={fetchDetail} className="text-blue-600 text-sm hover:underline">重试</button>
          </div>
        ) : !detail ? (
          <div className="py-20 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">未找到报名记录</p>
          </div>
        ) : (
          <>
            {/* ===== Info Cards ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Student Info */}
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> 学员信息
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{detail.student?.name || ''}</div>
                    {detail.student_id && (
                      <div className="text-xs text-gray-400 mt-0.5">编号: {detail.student_id}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {detail.student?.mobile || ''}
                  </div>
                  {detail.student?.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {detail.student?.email}
                    </div>
                  )}
                  <div className="pt-2">{statusBadge(detail.status)}</div>
                </div>
              </div>

              {/* Enrollment Info */}
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> 报名信息
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">班级</span>
                    <span className="font-medium text-gray-800">{detail.class_name || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">类型</span>
                    <span className="text-gray-800">{typeLabel(detail.type)}</span>
                  </div>
                  {detail.branch_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">来源</span>
                      <span className="text-gray-800">{detail.branch_name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">报名时间</span>
                    <span className="text-gray-800">{safeDate(detail.created_at)}</span>
                  </div>
                  {detail.remark && (
                    <div className="pt-1">
                      <span className="text-gray-500 block mb-0.5">备注</span>
                      <span className="text-gray-700 text-xs bg-gray-50 px-2 py-1 rounded block">{detail.remark}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Info */}
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> 费用信息
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">总费用</span>
                    <span className="font-bold text-gray-900">
                      {detail.total_fee != null ? `¥${detail.total_fee}` : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">已支付</span>
                    <span className="font-medium text-emerald-600">
                      {detail.paid_fee != null ? `¥${detail.paid_fee}` : "¥0"}
                    </span>
                  </div>
                  {detail.refund_fee != null && detail.refund_fee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">已退费</span>
                      <span className="font-medium text-red-500">¥{detail.refund_fee}</span>
                    </div>
                  )}
                  <div className="pt-1 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">待收/应退</span>
                      <span className={`font-bold ${remaining > 0 ? "text-orange-600" : remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                        {remaining >= 0 ? `¥${remaining}` : `-¥${Math.abs(remaining)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Action Buttons ===== */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => { setNewStatus(detail.status); setShowStatus(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
              >
                <Edit3 className="w-4 h-4 text-blue-500" />
                更新状态
              </button>
              <button
                onClick={() => { setPaidAmount(String(detail.paid_fee || "")); setShowPayment(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
              >
                <CreditCard className="w-4 h-4 text-emerald-500" />
                更新支付
              </button>
              <button
                onClick={() => { setRefundAmount(""); setRefundReason(""); setShowRefund(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:bg-red-50 hover:border-red-200 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-red-500" />
                退费申请
              </button>
            </div>

            {/* ===== Payment History ===== */}
            {detail.payment && detail.payment.paid_amount != null && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  支付记录
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="hidden md:grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                    <div>金额</div>
                    <div>方式</div>
                    <div>备注</div>
                    <div>时间</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2 px-4 py-3 text-sm">
                      <div className="font-medium text-emerald-600">¥{detail.payment.paid_amount}</div>
                      <div className="text-gray-600">{detail.payment.payment_method || "-"}</div>
                      <div className="text-gray-400 text-xs">{detail.payment.remark || "-"}</div>
                      <div className="text-gray-400 text-xs">{safeDate(detail.payment?.created_at)}</div>
                    </div>
                </div>
              </div>
            )}

            {/* ===== Refund Records ===== */}
            {detail.refunds && detail.refunds.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-500" />
                  退费记录
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="hidden md:grid grid-cols-4 gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                    <div>金额</div>
                    <div>原因</div>
                    <div>状态</div>
                    <div>时间</div>
                  </div>
                  {detail.refunds.map(r => (
                    <div key={r.id} className="grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2 px-4 py-3 border-b border-gray-100 last:border-0 text-sm">
                      <div className="font-medium text-red-500">¥{r.amount}</div>
                      <div className="text-gray-600 text-xs">{r.reason || "-"}</div>
                      <div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                          r.status === "approved" ? "bg-green-50 text-green-700 border-green-200"
                          : r.status === "rejected" ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}>
                          {r.status === "approved" ? "已通过" : r.status === "rejected" ? "已拒绝" : "待审核"}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs">{safeDate(r.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== Operation Log ===== */}
            {detail.logs && detail.logs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-500" />
                  操作日志
                </h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {detail.logs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="mt-0.5">{getActionIcon(log.action)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-800">{log.action}</div>
                        {log.detail && <div className="text-xs text-gray-400 mt-0.5">{log.detail}</div>}
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">{safeDate(log.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ====== Modals ====== */}

      {/* Status Update Modal */}
      <Modal open={showStatus} title="更新状态" onClose={() => setShowStatus(false)}>
        {actionError && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 mb-3">{actionError}</div>
        )}
        <div className="space-y-2 mb-4">
          {["new", "pending", "confirmed", "active", "cancelled"].map(s => (
            <label key={s} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              newStatus === s ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
            }`}>
              <input
                type="radio"
                name="status"
                value={s}
                checked={newStatus === s}
                onChange={e => setNewStatus(e.target.value)}
                className="accent-blue-600"
              />
              <div>
                <div className="text-sm font-medium text-gray-800">{statusLabel(s)}</div>
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={updateStatus}
          disabled={actionLoading || !newStatus || newStatus === detail?.status}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            actionLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {actionLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 更新中...</> : "确认更新"}
        </button>
      </Modal>

      {/* Payment Modal */}
      <Modal open={showPayment} title="更新支付" onClose={() => setShowPayment(false)}>
        {actionError && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 mb-3">{actionError}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">实付金额 (¥)</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                placeholder="输入金额"
                min="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>
          <button
            onClick={updatePayment}
            disabled={actionLoading || !paidAmount}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              actionLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {actionLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 更新中...</> : "确认支付"}
          </button>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal open={showRefund} title="退费申请" onClose={() => setShowRefund(false)}>
        {actionError && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 mb-3">{actionError}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">退费金额 (¥)</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
                placeholder="退费金额"
                min="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">退费原因</label>
            <textarea
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
              placeholder="选填"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none"
            />
          </div>
          <button
            onClick={createRefund}
            disabled={actionLoading || !refundAmount}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              actionLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {actionLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 提交中...</> : "提交退费申请"}
          </button>
        </div>
      </Modal>
    </main>
  );
}
