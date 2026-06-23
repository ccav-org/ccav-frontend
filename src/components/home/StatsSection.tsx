"use client";

import { motion } from "framer-motion";

const stats = [
  {
    textLogo: "T/CCPS",
    title: "6大团标等级",
    desc: "严格对标 T/CCPS 0041\n含金量十足的学习路径",
  },
  {
    icon: "🎓",
    title: "5天师资跃升",
    desc: "专为教育者设计的实操课\n通过考核解锁官方认证讲师",
  },
  {
    icon: "⚡",
    title: "0硬件门槛",
    desc: "告别昂贵显卡与繁琐配置\n有浏览器就能开启AI创作",
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-10 pb-20" style={{ background: "#ffffff" }}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="text-center p-6 rounded-2xl transition-all"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(180,160,120,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
              }}
            >
              {stat.textLogo ? (
                <div className="h-9 flex items-center justify-center mb-3">
                  <span
                    className="text-lg font-bold tracking-widest"
                    style={{ color: "rgba(200,184,152,0.6)" }}
                  >
                    {stat.textLogo}
                  </span>
                </div>
              ) : (
                <div className="text-2xl mb-3" style={{ opacity: 0.6 }}>
                  {stat.icon}
                </div>
              )}
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: "#fff", fontFamily: "'Noto Serif SC', serif" }}
              >
                {stat.title}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
                {stat.desc.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < stat.desc.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
