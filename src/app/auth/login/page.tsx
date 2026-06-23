"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User, KeyRound, LogIn, Loader2, Eye, EyeOff,
  ChevronRight, AlertCircle
} from "lucide-react";

export default function MemberLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/public/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.code === 0) {
        const d = data.data;
        localStorage.setItem("user_token", d.token);
        localStorage.setItem("user_info", JSON.stringify({
          username: d.username,
          name: d.name,
          role: d.role,
        }));
        setSuccess(true);
        setTimeout(() => router.push("/account"), 800);
      } else {
        setError(data.msg || "登录失败，请检查用户名和密码");
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
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#14b8a6] flex items-center justify-center shadow-lg shadow-[#2563eb]/25">
                <User className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#1e293b]">用户登录</h1>
              <p className="text-sm text-[rgba(0,0,0,0.45)] mt-1.5">
                登录后即可查看课程和个人中心
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1.5 font-medium">用户名</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    placeholder="输入用户名"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1.5 font-medium">密码</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#f8fafc] border border-[rgba(37,99,235,0.08)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 focus:outline-none focus:bg-white transition-all"
                    required
                    autoComplete="current-password"
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

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f85149]/5 border border-[#f85149]/15">
                  <AlertCircle className="w-4 h-4 text-[#f85149] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#f85149]">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-[#3fb950]/10 border border-[#3fb950]/20 text-sm text-[#3fb950] text-center">
                  登录成功！正在跳转...
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.35)] cursor-not-allowed"
                    : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-lg shadow-[#2563eb]/25 hover:shadow-xl hover:shadow-[#2563eb]/30"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    登录
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link
                href="/auth/register"
                className="block text-sm text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors"
              >
                还没有账号？去注册 →
              </Link>
              <Link
                href="/login"
                className="block text-xs text-[rgba(0,0,0,0.35)] hover:text-[rgba(0,0,0,0.5)] transition-colors"
              >
                使用手机号+验证码登录（旧版）
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
