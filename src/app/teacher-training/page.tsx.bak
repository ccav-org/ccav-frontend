"use client";

import Navbar from "@/components/layout/Navbar";

export default function TeacherTrainingPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#c8b898]/20 text-xs text-[#c8b898] mb-4">
            CCAV 教师培训项目
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl serif font-bold text-white mb-4">
            CCAV AI视频创作教师培训班
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto mb-8">
            以团体标准为依据，以标准教材为核心。面向院校教师、培训机构老师和AI视频教育从业者的系统化师资培训。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://jinshuju.net/f/xxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="ink-btn inline-block"
            >
              立即报名
            </a>
            <a
              href="#details"
              className="inline-block px-7 py-2.5 rounded-lg font-semibold cursor-pointer transition duration-300"
              style={{
                background: "rgba(0,200,220,0.10)",
                border: "1px solid rgba(0,210,230,0.5)",
                color: "#20d8e8",
              }}
            >
              了解详情
            </a>
          </div>
        </section>

        {/* 培训对象 */}
        <section id="details" className="mb-16">
          <h2 className="text-2xl serif font-bold text-white mb-6">培训对象</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏫", title: "职业院校教师", desc: "数字媒体、影视制作、动漫、广告、电商、视觉传达等专业的教师" },
              { icon: "🎯", title: "培训机构老师", desc: "艺术培训、科技教育、传媒培训机构的在岗教师" },
              { icon: "👨‍🏫", title: "AI视频教育从业者", desc: "希望转型或从事AI视频教学的个人和团队" },
            ].map((item, i) => (
              <div key={i} className="ink-card p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/30 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 培训内容 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-white mb-6">培训内容</h2>
          <div className="ink-card p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "团体标准解读与课程体系说明",
                "AI视频工具全景与选型策略",
                "提示词工程教学法",
                "文生图与图像生成教学",
                "图生视频与运动控制教学",
                "AI配音、配乐与音频处理教学",
                "视频剪辑与工作流搭建教学",
                "项目制课堂组织与作品点评",
                "考评标准与认证流程",
                "教学安全与伦理规范",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/40">
                  <span className="text-[#c8b898]">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 培训形式 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-white mb-6">培训形式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="ink-card p-6">
              <div className="text-lg font-bold text-white mb-2">📘 3天基础班</div>
              <p className="text-white/30 text-sm mb-4">覆盖AI视频核心技能与教学法，适合有教学基础的老师快速上手</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/25">
                <span className="bg-white/5 px-2 py-1 rounded">¥2,980</span>
                <span className="bg-white/5 px-2 py-1 rounded">含教材</span>
                <span className="bg-white/5 px-2 py-1 rounded">含工具额度</span>
                <span className="bg-white/5 px-2 py-1 rounded">结业证书</span>
              </div>
            </div>
            <div className="ink-card p-6">
              <div className="text-lg font-bold text-white mb-2">📗 5天深度班</div>
              <p className="text-white/30 text-sm mb-4">全面掌握AI视频教学体系与项目管理，适合希望成为认证讲师的教师</p>
              <div className="flex flex-wrap gap-2 text-xs text-white/25">
                <span className="bg-white/5 px-2 py-1 rounded">¥4,980</span>
                <span className="bg-white/5 px-2 py-1 rounded">含教材+教辅</span>
                <span className="bg-white/5 px-2 py-1 rounded">含工具额度</span>
                <span className="bg-white/5 px-2 py-1 rounded">认证讲师资格</span>
              </div>
            </div>
          </div>
        </section>

        {/* 培训成果 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-white mb-6">培训成果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📜", title: "教师培训结业证书", desc: "完成培训并通过考核后颁发" },
              { icon: "🏅", title: "认证讲师申请资格", desc: "可继续申请CCAV认证讲师评定" },
              { icon: "🎓", title: "CCAV课程开设授权", desc: "可申请开设CCAV标准课程" },
            ].map((item, i) => (
              <div key={i} className="ink-card p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/30 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 报名CTA */}
        <section className="text-center mb-16">
          <div className="ink-card p-8 md:p-12">
            <h2 className="text-2xl serif font-bold text-white mb-4">立即报名</h2>
            <p className="text-white/40 mb-6">点击下方按钮，填写报名信息。我们的课程顾问将在1个工作日内与您联系。</p>
            <a
              href="https://jinshuju.net/f/xxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="ink-btn inline-block"
            >
              填写报名表
            </a>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-white/5 py-8 text-center relative z-10">
        <p className="text-sm text-white/50 mb-2 serif">CCAV — AI视频创作教育机构</p>
        <p className="text-xs text-white/35">以 T/CCPS 0041—2026 团体标准为核心的AI视频创作教育体系 · © 2026</p>
      </footer>
    </>
  );
}
