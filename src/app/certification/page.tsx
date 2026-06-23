"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function CertificationPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "能力认证" }]} />
      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[rgba(37,99,235,0.15)]/20 text-xs text-[#2563eb] mb-4">
            能力评价与认证
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl serif font-bold text-[#1e293b] mb-4">
            AIGC视频创作能力认证
          </h1>
          <p className="text-[rgba(0,0,0,0.55)] max-w-2xl mx-auto mb-8">
            依据《人工智能视频制作人员要求》团体标准，建立初级→中级→高级三级能力认证体系。
            证书+作品集双轨认证，让能力有据可查。
          </p>
        </section>

        {/* 三级认证 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">三级认证体系</h2>
          <div className="space-y-4">
            {[
              {
                level: "初级",
                title: "AI视频创作基础能力",
                icon: "🥇",
                color: "#2563eb",
                target: "完成基础课程的学员",
                method: "理论考试 + 基础实操",
                outcome: "初级能力证书",
                content: ["AI视频基础概念", "常用工具认知", "基础提示词编写", "简单图像/视频生成", "简短作品提交"],
              },
              {
                level: "中级",
                title: "独立项目制作能力",
                icon: "🥈",
                color: "#a0a0a0",
                target: "能独立完成作品的学员",
                method: "项目作业 + 作品评审",
                outcome: "中级能力证书",
                content: ["项目脚本写作", "分镜设计与图像生成", "图生视频与动画", "配音配乐剪辑合成", "完整作品与创作说明"],
              },
              {
                level: "高级",
                title: "综合创作与商业应用能力",
                icon: "🏆",
                color: "#2563eb",
                target: "专业创作者、教师、企业内容负责人",
                method: "综合项目 + 答辩展示",
                outcome: "高级能力证书",
                content: ["商业项目策划", "完整项目成片", "作品集整理", "答辩与展示", "合规与伦理判断", "团队协作与项目管理"],
              },
            ].map((item, i) => (
              <div key={i} className="ink-card p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-xl" style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-[#1e293b]">第{item.level}级</span>
                      <span className="text-[10px] text-white bg-[#2563eb]/80 px-2 py-0.5 rounded-full">{item.target}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1e293b] mb-1">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[rgba(0,0,0,0.5)] mb-4">
                      <span>考核方式：{item.method}</span>
                      <span>→ {item.outcome}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {item.content.map((c, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-xs text-[rgba(0,0,0,0.55)]">
                          <span className="text-green-500/70">✓</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 认证流程 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">认证流程</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["报名申请", "资格审核", "理论考试", "实操考核", "作品评审", "证书发放"].map((step, j) => (
              <div key={j} className="flex items-center gap-2">
                <div className="ink-card px-5 py-3 text-sm text-[rgba(0,0,0,0.5)]">{step}</div>
                {j < 5 && <span className="text-[#206683] text-lg">▸</span>}
              </div>
            ))}
          </div>
        </section>

        {/* 证书体系 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">证书体系</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { cert: "AIGC视频创作初级能力证书", for: "通过初级考核的学员" },
              { cert: "AIGC视频创作中级能力证书", for: "通过中级考核的学员" },
              { cert: "AIGC视频创作高级能力证书", for: "通过高级考核的学员" },
              { cert: "CCAV认证讲师证书", for: "通过教师培训及讲师考核的教师" },
            ].map((item, i) => (
              <div key={i} className="ink-card p-5 text-center">
                <div className="text-lg mb-2">📜</div>
                <h3 className="text-sm font-bold text-[#1e293b] mb-2">{item.cert}</h3>
                <p className="text-xs text-[rgba(0,0,0,0.5)]">{item.for}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 作品示例 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">作品示例</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "水墨层峦 · AI山水画", level: "初级作品", image: "/placeholder-example.svg", author: "张三" },
              { title: "星际穿越 · AI科幻短片", level: "中级作品", image: "/placeholder-example.svg", author: "赵六" },
              { title: "丝路飞天 · AI敦煌MV", level: "高级作品", image: "/placeholder-example.svg", author: "齐小天" },
            ].map((work, i) => (
              <div key={i} className="ink-card overflow-hidden group cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2563eb]/10 text-[#2563eb]">{work.level}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#d97706] ml-1">⏳占位示例</span>
                  </div>
                  <h3 className="text-sm font-medium text-[#1e293b] line-clamp-1">{work.title}</h3>
                  <p className="text-xs text-[rgba(0,0,0,0.4)] mt-1">{work.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <div className="ink-card p-8 md:p-12">
            <h2 className="text-2xl serif font-bold text-[#1e293b] mb-4">开始认证</h2>
            <p className="text-[rgba(0,0,0,0.55)] mb-6">认证报名、证书查询、合作考点申请，请与我们联系。</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/contact" className="ink-btn inline-block">认证咨询</a>
              <a href="#cert-search" className="inline-block px-7 py-2.5 rounded-lg font-semibold cursor-pointer text-[#2563eb]" style={{ border: "1px solid rgba(37,99,235,0.3)" }}>
                证书查询
              </a>
            </div>
          </div>
        </section>

        {/* 证书查询占位 */}
        <section id="cert-search" className="mb-16">
          <div className="ink-card p-6 md:p-8 text-center">
            <h2 className="text-xl serif font-bold text-[#1e293b] mb-4">证书查询</h2>
            <p className="text-[rgba(0,0,0,0.5)] text-sm mb-6">输入证书编号或姓名，查询证书信息（查询系统开发中，敬请期待）</p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="请输入证书编号或姓名"
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.15)", color: "#1e293b" }}
                  disabled
                />
                <button className="px-5 py-2.5 rounded-lg text-sm font-medium" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", color: "rgba(0,0,0,0.35)", cursor: "not-allowed" }}>
                  查询
                </button>
              </div>
              <p className="text-[10px] text-[rgba(0,0,0,0.4)] mt-2">查询功能即将上线</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
