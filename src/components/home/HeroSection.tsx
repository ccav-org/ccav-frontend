"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  { num: "1", label: "AI 认识与提示词" },
  { num: "2", label: "写文案到做画面" },
  { num: "3", label: "做完整的短片" },
  { num: "4", label: "大型项目实战" },
  { num: "5", label: "行业应用与变现" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 装饰光晕 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 35%, rgba(32,102,131,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 55%, rgba(32,102,131,0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 80% 20%, rgba(200,184,152,0.03) 0%, transparent 60%)",
        }}
      />

      {/* 细横线装饰 */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(200,184,152,0.3) 30%, rgba(200,184,152,0.5) 50%, rgba(200,184,152,0.3) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(200,184,152,0.3) 30%, rgba(200,184,152,0.5) 50%, rgba(200,184,152,0.3) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        {/* Badge — 团体标准 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            background: "rgba(32,102,131,0.10)",
            border: "1px solid rgba(32,102,131,0.20)",
            color: "#206683",
          }}
        >
          <span>对标 T/CCPS 0041—2026</span>
          <span className="opacity-40">·</span>
          <span>6级98课时</span>
        </motion.div>

        {/* CCAV.COM */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-[0.05em] mb-4"
          style={{
            color: "#fff",
            fontFamily: "'system-ui', 'Noto Serif SC', serif",
            fontOpticalSizing: "auto",
          }}
        >
          CCAV.COM
        </motion.h1>

        {/* 双破折号副标题 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg tracking-widest mb-4"
          style={{
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Noto Serif SC', serif",
          }}
        >
          —— Creative Culture AI Video
        </motion.p>

        {/* Hero 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          专为学习AI视频创作者打造的6级体系化课程
          <br />
          不讲废话，全部动手
        </motion.p>

        {/* 五步骤 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {steps.map((step) => (
            <span
              key={step.num}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <span
                className="w-5 h-5 flex items-center justify-center rounded-full text-[10px]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.30)",
                  fontWeight: 600,
                }}
              >
                {step.num}
              </span>
              {step.label}
            </span>
          ))}
        </motion.div>

        {/* 全程鼠标点选 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-sm mb-10"
          style={{ color: "rgba(255,255,255,0.20)" }}
        >
          全程鼠标点选，无需任何代码基础
        </motion.p>

        {/* CTA 按钮行 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/courses/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #c0392b, #8b1a1a)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(185,58,50,0.3)";
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
            </svg>
            探索课程
          </Link>

          <Link
            href="/playground/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-base font-semibold transition-all"
            style={{
              background: "transparent",
              border: "1px solid #20d8e8",
              color: "#20d8e8",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(32,216,232,0.2)";
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.background = "rgba(32,216,232,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            AI工坊
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
