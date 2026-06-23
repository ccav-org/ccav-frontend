"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User, KeyRound, Smartphone, BadgeCheck, UserPlus, Loader2,
  Eye, EyeOff, ChevronRight, AlertCircle
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (password.length < 6) {
      setError("密码至少6位");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, mobile }),
      });
      const data = await res.json();

      if (res.ok && data.code === 0) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        setError(data.msg || "注册失败，请稍后重试");
      }
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen flex items-center justify-center px-4 ink-bg">
        <div className="w-full max-w-md py-12">
          <div className="ink-card p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#2563eb] flex items-center justify-center shadow-lg shadow-[#14b8a6]/25">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#1e293b]">创建账号</h1>
              <p className="text-sm text-[rgba(0,0,0,0.45)] mt-1.5">
                注册 CCAV 账号，开始你的 AI 视频创作之旅
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1 font-medium">用户名 *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    placeholder="用于登录的用户名"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1 font-medium">姓名</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="你的真实姓名（可选）"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1 font-medium">手机号</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="手机号（可选）"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1 font-medium">密码 *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少6位密码"
                    className="w-full pl-10 pr-10 py-2.5 rounded-[10px] bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1 font-medium">确认密码 *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f85149]/5 border border-[#f85149]/15">
                  <AlertCircle className="w-4 h-4 text-[#f85149] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#f85149]">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-[#3fb950]/10 border border-[#3fb950]/20 text-sm text-[#3fb950] text-center">
                  注册成功！正在跳转到登录页...
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.35)] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#14b8a6] to-[#2563eb] text-white hover:from-[#0d9488] hover:to-[#1d4ed8] shadow-lg shadow-[#14b8a6]/25 hover:shadow-xl hover:shadow-[#14b8a6]/30"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    注册中...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    注册
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-[rgba(0,0,0,0.45)]">已有账号？</span>
              <Link
                href="/auth/login"
                className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors ml-1"
              >
                去登录 →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
