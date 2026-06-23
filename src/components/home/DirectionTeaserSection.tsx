"use client";

import { motion } from "framer-motion";

const directions = [
  { icon: "🎬", title: "商业广告", desc: "产品广告全链路" },
  { icon: "🚀", title: "科幻短片", desc: "VFX特效合成" },
  { icon: "🎭", title: "动漫短剧", desc: "角色一致性创作" },
  { icon: "📱", title: "自媒体口播", desc: "数字人批量产出" },
];

export default function DirectionTeaserSection() {
  return (
    <section className="relative z-10 pb-16" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="text-2xl mb-2">🚀</div>
          <h2
            className="text-xl md:text-2xl font-bold mb-2"
            style={{
              color: "#fff",
              fontFamily: "'Noto Serif SC', serif",
            }}
          >
            专业方向 · 即将上线
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            完成基础课程后，按职业方向选修深造
          </p>
        </motion.div>

        {/* 4方向卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {directions.map((dir, i) => (
            <motion.div
              key={dir.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-5 text-center rounded-xl transition-all relative"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.08)",
                opacity: 0.55,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(32,102,131,0.30)";
                e.currentTarget.style.background = "rgba(32,102,131,0.04)";
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(32,102,131,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.opacity = "0.55";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded"
                style={{
                  background: "rgba(32,102,131,0.10)",
                  border: "1px solid rgba(32,102,131,0.18)",
                  color: "#206683",
                }}
              >
                选修
              </span>
              <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.85 }}>
                {dir.icon}
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.60)" }}>
                {dir.title}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>
                {dir.desc}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.15)" }}>
          学完L1-L4基础后可选修 · 敬请期待
        </p>
      </div>
    </section>
  );
}
