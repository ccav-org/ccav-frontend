"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TrainingSection() {
  return (
    <section className="relative z-10 pb-16" style={{ background: "#ffffff" }}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 md:p-8 rounded-xl transition-all"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(180,200,160,0.2)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* 🎓 图标 */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(180,160,80,0.12)",
                borderRadius: "12px",
                fontSize: "44px",
              }}
            >
              🎓
            </div>

            {/* 内容 */}
            <div className="flex-1">
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  color: "rgba(255,255,255,0.20)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                🎓 师训课程
              </span>
              <h2
                className="text-xl font-bold mt-2 mb-2"
                style={{ color: "#fff" }}
              >
                师资培训 · 从学员到认证讲师
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.30)" }}>
                专为想成为AI视频讲师的学员设计。5天线下集训，全部实操使用免费API，零代码实现从文生图到完整教学视频的全流程。
              </p>

              {/* 标签行 */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>
                <span>📚 30课时</span>
                <span>📅 线下集训（5天）</span>
                <span>🏅 通过即获认证</span>
              </div>

              {/* 价格 + 按钮 */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="text-xl font-bold"
                  style={{
                    color: "#c8b898",
                    fontFamily: "'Noto Serif SC', serif",
                  }}
                >
                  ¥3,999
                </span>
                <Link
                  href="/training/"
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #c0392b, #8b1a1a)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(185,58,50,0.3)";
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  了解详情 →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
