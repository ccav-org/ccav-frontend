"use client";

import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function TextbooksPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "标准教材" }]} />
      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[rgba(37,99,235,0.15)] text-xs text-[#2563eb] mb-4">
            团体标准配套教材
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl serif font-bold text-[#1e293b] mb-4">
            标准教材体系
          </h1>
          <p className="text-[rgba(0,0,0,0.55)] max-w-2xl mx-auto mb-8">
            教材不是孤立出版物，而是"课程、教案、作业、考评、认证"的标准化依据。
          </p>
        </section>

        {/* 教材体系 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">教材体系</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "学生用书",
                desc: "《AIGC视频制作规范与实践》",
                icon: "📖",
                features: [
                  "对标T/CCPS 0041—2026团体标准",
                  "六大部分、98课时，覆盖L1-L6能力等级",
                  "提示词→图像→视频→配音→剪辑→项目的完整流程",
                  "含作业模板、项目案例、提示词模板",
                ],
                status: "📌 已出版",
              },
              {
                title: "教师用书",
                desc: "配套教学指导手册",
                icon: "📘",
                features: [
                  "教学大纲与课时安排",
                  "教案设计与课堂组织方案",
                  "重点难点解析与教学技巧",
                  "作品点评标准与评分细则",
                ],
                status: "⏳ 开发中",
              },
              {
                title: "考评手册",
                desc: "能力认证考评标准",
                icon: "📋",
                features: [
                  "初级/中级/高级三级考评标准",
                  "理论考试题库与实操任务",
                  "项目作品评审标准",
                  "教师评价指南",
                ],
                status: "⏳ 开发中",
              },
            ].map((item, i) => (
              <div key={i} className="ink-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{item.icon}</div>
                  <span className="text-[10px] text-[#2563eb] bg-[#2563eb]/10 border border-[#2563eb]/20 px-2 py-0.5 rounded-full">{item.status}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] mb-1">{item.title}</h3>
                <p className="text-[#2563eb]/60 text-sm mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((f, j) => (
                    <li key={j} className="text-xs text-[rgba(0,0,0,0.5)] flex items-start gap-1.5">
                      <span className="text-[#2563eb] mt-0.5">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 教辅资源 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">配套教辅资源</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "课件PPT", "作业模板", "项目案例库",
              "提示词模板库", "工具清单", "授课指南",
              "题库系统", "考试系统",
            ].map((item, i) => (
              <div key={i} className="ink-card p-4 text-center">
                <div className="text-sm text-[#2563eb]/80">{item}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 出版信息 */}
        <section className="mb-16">
          <div className="ink-card p-6 md:p-8">
            <h2 className="text-2xl serif font-bold text-[#1e293b] mb-4">出版信息</h2>
            <p className="text-[rgba(0,0,0,0.5)] text-sm mb-4">
              本教材由CCAV教育机构组织编写，依据《人工智能视频制作人员要求》（T/CCPS 0041—2026）团体标准制定。
              教材既是学习资源，也是教学指南与考评依据。
            </p>
            <p className="text-[rgba(0,0,0,0.5)] text-sm">
              适用对象：职业院校学生、AI视频创作学习者、企业培训学员。
              教材定位为"学生教材、教师用书、考评手册一体化"，满足院校教学、企业培训和个人自学等多种场景。
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <div className="ink-card p-8 md:p-12">
            <h2 className="text-2xl serif font-bold text-[#1e293b] mb-4">获取教材</h2>
            <p className="text-[rgba(0,0,0,0.55)] mb-6">批量采购、院校合作、网点配套教材采购请联系我们。</p>
            <a
              href="/contact"
              className="ink-btn inline-block"
            >
              联系咨询
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(37,99,235,0.08)] py-8 text-center relative z-10">
        <p className="text-sm text-[rgba(0,0,0,0.5)] mb-2 serif">CCAV — AI视频创作教育机构</p>
        <p className="text-xs text-[rgba(0,0,0,0.35)]">以 T/CCPS 0041—2026 团体标准为核心的AI视频创作教育体系 · © 2026</p>
      </footer>
    </>
  );
}
