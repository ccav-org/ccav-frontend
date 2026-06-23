"use client";

import { motion } from "framer-motion";
import { Shield, Target, Users, Zap, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";

const values = [
  {
    icon: Shield,
    title: "团标为底",
    desc: "T/CCPS 0041—2026是所有课程与认证的核心底线，保证教学质量与专业标准。",
  },
  {
    icon: Target,
    title: "实操为王",
    desc: "每个知识点配备实操任务，浏览器内完成全流程，即学即用。",
  },
  {
    icon: Users,
    title: "师资先行",
    desc: "先培训讲师，再开学生端。讲师定骨架，平台保底线，每个老师保持教学特色。",
  },
  {
    icon: Zap,
    title: "零安装体验",
    desc: "所有AI工具浏览器内直接使用，无需下载、安装、配置，降低学习门槛。",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "关于CCAV" }]} />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), " +
              "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(14,165,233,0.03) 0%, transparent 60%), " +
              "#f8fafc",
            borderBottom: "1px solid rgba(37,99,235,0.08)",
          }}
        >
          <div className="max-w-4xl mx-auto px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: "#1e293b" }}>
                关于 ccav.com
              </h1>
              <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(0,0,0,0.55)" }}>
                以国家团标为核心的AI视频制作教学平台。
                学生缴费上课是主体，所有课程、认证、考核均对标团标1-6级。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16" style={{ background: "#f1f5f9" }}>
          <div className="max-w-6xl mx-auto px-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-center mb-12"
              style={{ color: "#1e293b" }}
            >
              平台核心原则
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] shadow-sm hover:border-[#2563eb]/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{v.title}</h3>
                  <p className="text-sm text-[rgba(0,0,0,0.5)] leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Standard Info */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1e293b] mb-4">
                📋 T/CCPS 0041—2026 团标对标
              </h3>
              <p className="text-[rgba(0,0,0,0.5)] mb-4">
                本平台所有课程体系、师资认证、学员考核均弥紧围绕T/CCPS 0041—2026《AIGC视频制作规范与实践》团体标准开展，确保教学质量与专业度。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["L1 入门", "L2 进阶", "L2+ 高级", "L3 大师", "L4 专家", "L5 传奇"].map((l) => (
                  <div key={l} className="px-3 py-2 rounded-lg bg-white text-sm text-[rgba(0,0,0,0.6)] text-center">
                    {l}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 团队介绍 */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-[#1e293b] text-center mb-12"
            >
              平台团队
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 王万维 — CEO */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] shadow-sm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">👑</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1e293b] mb-1">王万维</h3>
                <p className="text-sm text-[#2563eb] mb-3">CEO · 平台建设</p>
                <p className="text-sm text-[rgba(0,0,0,0.5)] leading-relaxed">
                  OpenClaw 驱动，主抓平台架构、前端开发与项目推进。
                </p>
              </motion.div>

              {/* 王千里 — CTO */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] shadow-sm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1e293b] mb-1">王千里</h3>
                <p className="text-sm text-[#22c55e] mb-3">CTO · 方案审核</p>
                <p className="text-sm text-[rgba(0,0,0,0.5)] leading-relaxed">
                  Hermes 驱动，负责技术方案评审、架构设计与质量验收。
                </p>
              </motion.div>

              {/* 王万里 — CIO */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 rounded-2xl bg-white border border-[rgba(37,99,235,0.08)] shadow-sm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d2991d] to-[#b0880f] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">🐎</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1e293b] mb-1">王万里</h3>
                <p className="text-sm text-[#d2991d] mb-3">CIO · 部署运维</p>
                <p className="text-sm text-[rgba(0,0,0,0.5)] leading-relaxed">
                  服务器运维专家，负责腾讯云部署、Nginx配置与API开发。
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-sm text-[rgba(0,0,0,0.5)] mt-8"
            >
              三兄弟各司其职，共同打造以团标为底线的AI视频制作教学平台。
            </motion.p>
          </div>
        </section>

        {/* 联系 CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e293b] mb-4">
                想了解更多？
              </h2>
              <p className="text-[rgba(0,0,0,0.5)] mb-8">
                对课程体系、师资认证或合作机会感兴趣？欢迎通过联系页面与我们取得联系。
              </p>
              <a
                href="/contact/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] transition-colors"
              >
                联系我们
                <Send className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
