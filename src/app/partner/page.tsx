"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function PartnerPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs items={[{ label: "合作教学点" }]} />
      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[rgba(37,99,235,0.15)] text-xs text-[#2563eb] mb-4">
            CCAV 合作招募
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl serif font-bold text-[#1e293b] mb-4">
            CCAV 全国合作教学点招募
          </h1>
          <p className="text-[rgba(0,0,0,0.55)] max-w-2xl mx-auto mb-8">
            以团体标准为依据，以标准教材为核心，以教师培训为启动点，面向全国招募线下教学合作伙伴。
          </p>
          <Link href="/partner/apply/" className="ink-btn inline-block">
            申请成为合作教学点
          </Link>
        </section>

        {/* 合作模式 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">合作模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                level: "授权教学点",
                icon: "🏠",
                for: "普通培训机构",
                permissions: ["开设CCAV标准课程", "使用CCAV标准教材", "组织认证报名与考试"],
                fee: "¥5-10万/年",
              },
              {
                level: "标准教学中心",
                icon: "🏢",
                for: "优质机构",
                permissions: ["开设多等级课程", "举办公开课与师训", "承接区域教师培训"],
                fee: "¥15-25万/年",
              },
              {
                level: "城市运营中心",
                icon: "🏛️",
                for: "区域合作伙伴",
                permissions: ["发展下级教学网点", "组织区域师训和活动", "协助区域招生推广"],
                fee: "区域协商",
              },
            ].map((item, i) => (
              <div key={i} className="ink-card p-6 hover:border-[#2563eb]/30 transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="inline-block px-2 py-0.5 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded text-[10px] text-[#2563eb] mb-2">{item.level}</div>
                <p className="text-[rgba(0,0,0,0.5)] text-xs mb-4">适合：{item.for}</p>
                <div className="space-y-2 mb-4">
                  {item.permissions.map((p, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-xs text-[rgba(0,0,0,0.55)]">
                      <span className="text-green-500/70">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[#2563eb] text-sm font-bold">{item.fee}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 总部支持 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">总部支持</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🏷️", title: "品牌支持", items: ["CCAV品牌授权", "统一宣传模板", "宣传册/海报/易拉宝"] },
              { icon: "📚", title: "教学支持", items: ["课程大纲与教案", "标准课件与作业模板", "项目案例与点评标准"] },
              { icon: "👨‍🏫", title: "师资支持", items: ["教师培训与认证", "教研直播与答疑", "课堂示范课"] },
              { icon: "📋", title: "运营支持", items: ["体验课与招生方案", "寒暑假班方案", "家长沟通话术"] },
            ].map((item, i) => (
              <div key={i} className="ink-card p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-base font-bold text-[#1e293b] mb-3">{item.title}</h3>
                <ul className="space-y-1">
                  {item.items.map((s, j) => (
                    <li key={j} className="text-xs text-[rgba(0,0,0,0.5)]">✦ {s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 准入条件 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">准入条件</h2>
          <div className="ink-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "合法办学或培训资质",
                "固定教学场地",
                "基本电脑设备（联网即可）",
                "至少1-2名可培训教师",
                "本地招生能力",
                "认可CCAV课程体系与教学标准",
                "接受总部统一培训与督导",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[rgba(0,0,0,0.55)]">
                  <span className="text-[#2563eb]">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 合作流程 */}
        <section className="mb-16">
          <h2 className="text-2xl serif font-bold text-[#1e293b] mb-6">合作流程</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["合作咨询", "资质审核", "签署协议", "教师培训", "配发教材", "开通平台", "公开课", "正式开班"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="ink-card px-4 py-2 text-sm text-[rgba(0,0,0,0.5)]">{step}</div>
                {i < 7 && <span className="text-[#206683]">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <div className="ink-card p-8 md:p-12">
            <h2 className="text-2xl serif font-bold text-[#1e293b] mb-4">立即申请合作</h2>
            <p className="text-[rgba(0,0,0,0.55)] mb-6">填写合作意向表，我们的渠道经理将在3个工作日内与您联系。</p>
            <Link href="/partner/apply/" className="ink-btn inline-block">
              申请成为合作教学点
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(37,99,235,0.08)] py-8 text-center relative z-10">
        <p className="text-sm text-[rgba(0,0,0,0.5)] mb-2 serif">CCAV — AI视频创作教育机构</p>
        <p className="text-xs text-[rgba(0,0,0,0.45)]">以 T/CCPS 0041—2026 团体标准为核心的AI视频创作教育体系 · © 2026</p>
      </footer>
    </>
  );
}
