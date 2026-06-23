"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function TeacherApplyPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [batch, setBatch] = useState("");
  const [remark, setRemark] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/register/teacher-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || "",
          unit,
          batch,
          remark: remark || "",
          source: "teacher-training-apply",
          time: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("提交失败");
      setStep("success");
    } catch (err) {
      alert("提交失败，请稍后重试或直接联系我们");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "教师培训", href: "/teacher-training" }, { label: "在线报名" }]} />
      <main className="flex-1 pt-16">
        {/* 顶部导航条 */}
        <div className="bg-white border-b border-[rgba(37,99,235,0.08)] py-3">
          <div className="max-w-4xl mx-auto px-5">
            <Link
              href="/teacher-training/"
              className="inline-flex items-center gap-1.5 text-sm text-[rgba(0,0,0,0.45)] hover:text-[#2563eb] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回教师培训介绍
            </Link>
          </div>
        </div>

        {step === "form" && (
          <>
            {/* Hero */}
            <section className="py-12 bg-gradient-to-b from-white to-[rgba(37,99,235,0.03)]">
              <div className="max-w-4xl mx-auto px-5 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-block px-4 py-1.5 rounded-full border border-[rgba(37,99,235,0.15)] text-xs text-[#2563eb] mb-4">
                    CCAV 教师培训报名
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
                    教师培训班报名
                  </h1>
                  <p className="text-[rgba(0,0,0,0.5)] max-w-xl mx-auto">
                    填写以下信息，我们的课程顾问将在 1 个工作日内与您联系，
                    确认培训班次及缴费事宜。
                  </p>
                </motion.div>
              </div>
            </section>

            {/* 表单 */}
            <section className="py-12 bg-white">
              <div className="max-w-2xl mx-auto px-5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 姓名 */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-1.5">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入您的姓名"
                      className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.12)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all"
                    />
                  </div>

                  {/* 手机号 */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-1.5">
                      手机号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="请输入手机号"
                      className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.12)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all"
                    />
                  </div>

                  {/* 邮箱 */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-1.5">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="选填，用于发送培训资料"
                      className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.12)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all"
                    />
                  </div>

                  {/* 所在单位 */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-1.5">
                      所在单位 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="请输入学校/机构名称"
                      className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.12)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all"
                    />
                  </div>

                  {/* 培训班次 */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-1.5">
                      培训班次 <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.12)] text-sm text-[#1e293b] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='rgba(0,0,0,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 5.646a.5.5 0 0 1 .708 0L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      <option value="">请选择培训班次</option>
                      <option value="3day">3天基础班（¥2,980）</option>
                      <option value="5day">5天深度班（¥4,980）</option>
                      <option value="undecided">暂不确定，由顾问推荐</option>
                    </select>
                  </div>

                  {/* 备注 */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e293b] mb-1.5">
                      备注
                    </label>
                    <textarea
                      rows={3}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="其他需要说明的事项…"
                      className="w-full px-4 py-2.5 rounded-lg border border-[rgba(0,0,0,0.12)] text-sm text-[#1e293b] placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all resize-none"
                    />
                  </div>

                  {/* 提交按钮 */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "white",
                    }}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        提交中…
                      </span>
                    ) : (
                      "提交报名信息"
                    )}
                  </button>

                  <p className="text-xs text-center text-[rgba(0,0,0,0.35)]">
                    提交即表示您同意我们收集上述信息用于处理报名事宜。
                    我们承诺不会将您的信息用于其他用途。
                  </p>
                </form>
              </div>
            </section>
          </>
        )}

        {step === "success" && (
          <section className="py-20 bg-white">
            <div className="max-w-lg mx-auto px-5 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#3fb950]/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-[#3fb950]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e293b] mb-3">
                  报名信息已提交
                </h2>
                <p className="text-[rgba(0,0,0,0.55)] mb-8">
                  感谢您的报名！我们的课程顾问将在 1 个工作日内与您联系，
                  确认培训班次及后续事宜。请保持手机畅通。
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/teacher-training/"
                    className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    style={{
                      background: "rgba(37,99,235,0.08)",
                      color: "#2563eb",
                    }}
                  >
                    返回介绍页
                  </Link>
                  <Link
                    href="/"
                    className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    style={{
                      background: "#2563eb",
                      color: "white",
                    }}
                  >
                    返回首页
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
