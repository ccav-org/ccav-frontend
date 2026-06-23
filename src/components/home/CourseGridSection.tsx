"use client";

import { motion } from "framer-motion";

const courses = [
  {
    title: "第一部 · 基础认知",
    hours: "16课时",
    subtitle: "零基础扫盲 · 建立AI视频全局认知",
    desc: "从零开始认识AIGC，掌握提示词基础写法，建立AI视频工具的全局视野。适合完全零基础的学员。",
    price: "¥199",
    format: "线上录播 + 社群答疑",
    outcome: "静态AI海报+提示词作品集",
  },
  {
    title: "第二部 · 文本与图像",
    hours: "20课时",
    subtitle: "从文案到画面 · 核心创作技能",
    desc: "掌握AI剧本写作、分镜设计、文生图、图生视频等核心技能。打通从文字到画面的完整创作链路。",
    price: "¥399",
    format: "每周直播答疑",
    outcome: "30秒意境短视频+分镜脚本",
  },
  {
    title: "第三部 · 视频实战",
    hours: "22课时",
    subtitle: "完整视频作品输出能力",
    desc: "从音频配音到AI剪辑到短剧制作，打通视频创作全链路。包含声音克隆、虚拟角色驱动等进阶技巧。",
    price: "¥599",
    format: "直播实操 + 作业批改",
    outcome: "完整AI短片+声音克隆demo",
  },
  {
    title: "第四部 · 综合项目",
    hours: "16课时",
    subtitle: "端到端完成完整AI视频项目",
    desc: "通过两个大型实战项目，将前三部所学融会贯通。从选题策划到成片交付，模拟真实商业项目全流程。",
    price: "¥799",
    format: "线上辅导 + 项目实训",
    outcome: "商业级项目作品+作品集",
  },
  {
    title: "第五部 · 行业应用",
    hours: "16课时",
    subtitle: "行业视野 · 商业落地 · 伦理合规",
    desc: "深入各行业AI视频应用场景，掌握从创作到变现的商业路径，了解版权法规与伦理规范。",
    price: "¥699",
    format: "案例分析 + 导师连线",
    outcome: "商业变现方案+行业案例库",
  },
  {
    title: "第六部 · 教学认证",
    hours: "8课时",
    subtitle: "从会做到会教 · 认证考核",
    desc: "6+2模式：6课时辅导冲刺 + 2课时纯考核。通过机考与试讲演示即获平台认证。",
    price: "¥499",
    format: "6课时辅导 + 2课时考核",
    outcome: "平台认证讲师资格+教学资质",
  },
];

export default function CourseGridSection() {
  return (
    <section className="relative z-10 pb-16" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="text-lg text-[#c8b898]/60 mb-2">——✦——✦——✦——</div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{
              color: "#fff",
              fontFamily: "'Noto Serif SC', serif",
            }}
          >
            学生课程体系
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.30)" }}>
            不讲废话，全部动手。从第一条提示词到完整AI视频作品，每一步都在浏览器里完成。
          </p>
        </div>

        {/* 6部课程 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-xl cursor-pointer transition-all"
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
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{course.title}</h3>
                  <span
                    className="text-[10px] font-medium whitespace-nowrap ml-2 px-2 py-0.5 rounded-full"
                    style={{
                      color: "#206683",
                      background: "rgba(32,102,131,0.10)",
                      border: "1px solid rgba(32,102,131,0.20)",
                    }}
                  >
                    {course.hours}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
                  {course.subtitle}
                </p>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.20)" }}>
                {course.desc}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{
                    color: "#c8b898",
                    background: "rgba(180,160,120,0.1)",
                    border: "1px solid rgba(180,160,120,0.2)",
                    padding: "4px 12px",
                    borderRadius: "6px",
                  }}
                >
                  {course.price}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>
                  {course.format}
                </span>
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span
                  className="text-[10px]"
                  style={{
                    color: "#fff",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  学习成果：{course.outcome}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
