"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import {
  User, KeyRound, Send, ChevronRight, LogIn, UserPlus,
  Loader2, Eye, EyeOff, DoorOpen
} from "lucide-react";

export default function LoginPage() {
  const { login, register, sendCode, isAuthenticated } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  // 如果已登录，重定向
  if (isAuthenticated) {
    router.push("/account");
    return null;
  }

  const handleSendCode = async () => {
    if (!phone || phone.length < 11) {
      setError("请输入正确的手机号");
      return;
    }
    setError("");
    const res = await sendCode(phone);
    if (res.success) {
      setCodeSent(true);
      setCodeCountdown(60);
      setSuccessMsg("验证码已发送（测试环境统一为：888888）");
      // 倒计时
      const timer = setInterval(() => {
        setCodeCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError(res.error || "发送失败");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let res;
    if (mode === "login") {
      res = await login(phone, password);
    } else {
      res = await register(phone, password, code, name);
    }

    setLoading(false);
    if (res.success) {
      setSuccessMsg("登录成功！正在跳转...");
      setTimeout(() => router.push("/account"), 800);
    } else {
      setError(res.error || "操作失败");
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setSuccessMsg("");
    setCode("");
    setCodeSent(false);
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "后台管理登录" }]} />
      <main className="flex-1 min-h-screen flex items-center justify-center px-4"
        style={{
          background: "radial-gradient(ellipse at 50% -20%, rgba(229,62,62,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 40%, rgba(88,166,255,0.08) 0%, transparent 50%), #f9fafb"
        }}>
        <div className="w-full max-w-md">

          {/* 毛玻璃卡片 */}
          <div className="relative">
            {/* 装饰光晕 */}
            <div className="absolute -top-20 -right-16 w-40 h-40 rounded-full bg-[#e53e3e]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-16 w-36 h-36 rounded-full bg-[#2563eb]/15 blur-3xl pointer-events-none" />

            <div
              className="relative p-8 rounded-3xl border border-white/[0.15] shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(30,40,55,0.9) 0%, rgba(20,28,40,0.85) 100%)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {/* 顶部亮线 */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              {/* Logo / 标题 */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#e53e3e] to-[#ff6b6b] flex items-center justify-center shadow-lg shadow-[#e53e3e]/30">
                  <DoorOpen className="w-8 h-8 text-[#1e293b]" />
                </div>
                <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
                  {mode === "login" ? "欢迎回来" : "注册账号"}
                </h1>
                <p className="text-sm text-[rgba(0,0,0,0.5)] mt-1.5">
                  {mode === "login"
                    ? "登录后继续学习课程"
                    : "注册ccav.com账号，开启AI视频学习之旅"}
                </p>
              </div>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 手机号 */}
                <div>
                  <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1.5 font-medium">手机号</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.5)] group-focus-within:text-[#e53e3e] transition-colors z-10 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="text-xs">+86</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                      placeholder="请输入手机号"
                      className="w-full pl-[4.8rem] pr-4 py-3 rounded-xl bg-white/80 border border-[rgba(37,99,235,0.08)] text-sm text-[rgba(0,0,0,0.6)] placeholder-[rgba(0,0,0,0.35)] focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* 验证码（注册模式） */}
                {mode === "register" && (
                  <div>
                    <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1.5 font-medium">验证码</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6位验证码"
                        maxLength={6}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/80 border border-[rgba(37,99,235,0.08)] text-sm text-[rgba(0,0,0,0.6)] placeholder-[rgba(0,0,0,0.35)] focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 focus:outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={codeCountdown > 0}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                          codeCountdown > 0
                            ? "bg-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.35)] cursor-not-allowed"
                            : "bg-[#e53e3e]/10 text-[#e53e3e] hover:bg-[#e53e3e]/20 border border-[#e53e3e]/30"
                        }`}
                      >
                        {codeCountdown > 0 ? `${codeCountdown}s` : "获取验证码"}
                      </button>
                    </div>
                    <p className="text-xs text-[#d29922] mt-1.5">测试验证码：888888</p>
                  </div>
                )}

                {/* 昵称（注册模式） */}
                {mode === "register" && (
                  <div>
                    <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1.5 font-medium">昵称（选填）</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="给自己取个名字吧"
                      className="w-full px-4 py-3 rounded-xl bg-white/80 border border-[rgba(37,99,235,0.08)] text-sm text-[rgba(0,0,0,0.6)] placeholder-[rgba(0,0,0,0.35)] focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* 密码 */}
                <div>
                  <label className="block text-xs text-[rgba(0,0,0,0.5)] mb-1.5 font-medium">密码</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.5)] group-focus-within:text-[#e53e3e] transition-colors z-10">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "login" ? "输入密码" : "设置密码（至少6位）"}
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/80 border border-[rgba(37,99,235,0.08)] text-sm text-[rgba(0,0,0,0.6)] placeholder-[rgba(0,0,0,0.35)] focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 focus:outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.35)] hover:text-[rgba(0,0,0,0.5)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 错误提示 */}
                {error && (
                  <div className="p-3 rounded-xl bg-[#f85149]/10 border border-[#f85149]/20 text-sm text-[#f85149]">
                    {error}
                  </div>
                )}

                {/* 成功提示 */}
                {successMsg && (
                  <div className="p-3 rounded-xl bg-[#3fb950]/10 border border-[#3fb950]/20 text-sm text-[#3fb950]">
                    {successMsg}
                  </div>
                )}

                {/* 红色 CTA 按钮 */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-[rgba(37,99,235,0.08)] text-[rgba(0,0,0,0.35)] cursor-not-allowed"
                      : "bg-[#e53e3e] text-white hover:bg-[#c53030] active:bg-[#9b2c2c] shadow-lg shadow-[#e53e3e]/25 hover:shadow-xl hover:shadow-[#e53e3e]/30"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {mode === "login" ? "登录" : "注册"}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 切换登录/注册 */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-sm text-[#e53e3e] hover:text-[#c53030] hover:underline transition-colors"
                >
                  {mode === "login" ? "没有账号？去注册 →" : "已有账号？去登录 →"}
                </button>
              </div>
            </div>
          </div>

          {/* 测试账号提示 — 美化后 */}
          <div className="mt-5 p-4 rounded-2xl bg-white/60 border border-[rgba(37,99,235,0.08)]/60 backdrop-blur-sm"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d29922]/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-[#d29922]" />
              </div>
              <div>
                <p className="text-xs text-[#d29922] font-semibold mb-1">🔑 测试账号信息</p>
                <div className="space-y-0.5">
                  <p className="text-xs text-[rgba(0,0,0,0.5)]">
                    <span className="text-[rgba(0,0,0,0.6)]">手机：</span>13800138000
                  </p>
                  <p className="text-xs text-[rgba(0,0,0,0.5)]">
                    <span className="text-[rgba(0,0,0,0.6)]">密码：</span>123456
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
