"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { quickEntries } from "@/lib/navLinks";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ==================== Hero ==================== */}
      <section
        className="px-4 py-12 md:py-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(37,99,235,0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 85% 60%, rgba(14,165,233,0.03) 0%, transparent 60%), " +
            "#f8fafc",
        }}
      >
        {/* 标签条 */}
        <div className="text-center">
          <div
            className="inline-block px-4 py-1.5 rounded-full border text-xs mb-6"
            style={{ borderColor: "rgba(37,99,235,0.15)", color: "#2563eb" }}
          >
            标准教材 · 线上平台 · 线下网点 · 教师培训 · 项目实训 · 能力认证
          </div>
        </div>

        {/* 品牌标题（视觉焦点） */}
        <div className="text-center mb-8 md:mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl serif font-bold leading-tight mb-4"
            style={{ color: "#1e293b" }}
          >
            CCAV
            <span className="block text-3xl md:text-4xl mt-1" style={{ color: "#2563eb" }}>
              AI 视频创作教育机构
            </span>
          </h1>
          <p
            className="max-w-3xl mx-auto leading-relaxed"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            以团体标准为依据，以标准教材为核心，以教师培训为启动点，以线下网点为落地渠道，
            <br />
            以项目实训形成作品能力，以能力认证完成学习闭环。
          </p>
        </div>

        {/* 四大场景入口卡片 */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-14">
          {quickEntries.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="block p-4 md:p-5 rounded-xl border transition"
              style={{
                background: "#ffffff",
                borderColor: "rgba(0,0,0,0.06)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-2xl mb-2">{entry.icon}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: "#1e293b" }}>
                {entry.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
                {entry.desc} →
              </div>
            </Link>
          ))}
        </div>

        {/* CTA 按钮组 */}
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          <Link href="/courses" className="ink-btn inline-block">
            🎬 浏览课程体系
          </Link>
          <Link
            href="/teacher-training/apply"
            className="inline-block px-7 py-2.5 rounded-lg font-semibold cursor-pointer transition duration-300"
            style={{
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.4)",
              color: "#0ea5e9",
            }}
          >
            教师培训报名
          </Link>
          <Link
            href="/partner"
            className="inline-block px-7 py-2.5 rounded-lg font-semibold cursor-pointer transition duration-300"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            了解教材 →
          </Link>
        </div>
      </section>

      {/* ==================== 机构定位 ==================== */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl serif font-bold mb-3" style={{ color: "#1e293b" }}>
            我们不是单纯卖AI课程
          </h2>
          <p className="text-lg" style={{ color: "#2563eb" }}>
            而是建设AI视频创作教育标准体系
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "📜", title: "以团体标准为依据", desc: "《人工智能视频制作人员要求》T/CCPS 0041—2026" },
            { icon: "📚", title: "以标准教材为核心", desc: "学生用书、教师用书、考评手册一体化体系" },
            { icon: "🎓", title: "以教师培训为启动点", desc: "建立认证讲师体系，解决AI教育『没人会教』的问题" },
            { icon: "🏛️", title: "以线下网点为落地渠道", desc: "全国线下教学网点，让学习有教室、有老师、有氛围" },
            { icon: "🛠️", title: "以项目实训形成作品能力", desc: "10大项目库，从国风短片到企业宣传片的完整训练" },
            { icon: "🏅", title: "以能力认证完成学习闭环", desc: "初级→中级→高级三级认证，证书+作品集双轨制" },
          ].map((item, i) => (
            <div key={i} className="ink-card p-5 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: "#1e293b" }}>
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.45)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 专家与讲师团队 ==================== */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl serif font-bold mb-2" style={{ color: "#1e293b" }}>
            专家与讲师团队
          </h2>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.4)" }}>
            AI视频创作领域的资深专家与一线讲师，为你的学习保驾护航
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { name: "金城", photo: "https://ccav.com/images/experts/EXP-008_金城.jpg", title: "广东省当代美术院院长", desc: "中国美术家协会理事，教育部高校动画、数字媒体专业教指委副主任。创办漫友杂志、中国动漫金龙奖赛事、CIAC全国插画扶持计划。" },
            { name: "王晟", photo: "https://ccav.com/images/experts/EXP-007_王晟.jpg", title: "浙江光影空间文化创意有限公司副总经理", desc: "深耕IP商业化领域十余年，业务覆盖动漫、游戏、文旅、数字产业。擅长打造景区内容IP与文创产品。" },
            { name: "柳洪博", photo: "https://ccav.com/images/experts/EXP-001_柳洪博.jpg", title: "北京神灯时代总经理/自由光数字科技副总经理", desc: "MagicLamp创始人，四川师大硕士导师。主持20余项数字交互艺术作品，打造《寻梦海洋》《Hi浮世绘》特展IP。" },
            { name: "刘道勇", photo: "https://ccav.com/images/experts/EXP-005_刘道勇.jpg", title: "杭州赤兔数字科技有限公司总经理", desc: "动画行业20年，参与《天生我刺》《龙之谷》《熊出没》等数十部动画影视剧。2025年转型AIGC制作。" },
            { name: "杨好刚", photo: "https://ccav.com/images/experts/EXP-006_杨好刚.jpg", title: "环球墨非（GMM.US）创始人、董事长兼CEO", desc: "纳斯达克上市公司实控人。获2025年度中国经济十大创新人物、年度最佳CEO。" },
            { name: "方志宏", photo: "https://ccav.com/images/experts/EXP-004_方志宏.jpg", title: "技术总监", desc: "专注大模型体系化落地、多模态大模型集成、提示词工程与模型微调、AI影视动漫跨界融合。" },
            { name: "王云飞", photo: "https://ccav.com/images/experts/EXP-002_王云飞.jpg", title: "北京其卡通董事长/CEO", desc: "知名动画导演，执导《西游记之再世妖王》《神秘世界历险记》两部过亿票房动画电影。获华表奖、星光奖。" },
            { name: "胡月明", photo: "https://ccav.com/images/experts/EXP-003_胡月明.jpg", title: "中国文化娱乐行业协会艺术品分会会长", desc: "原皇城艺术品交易中心董事长。国家财政部文化产业专项资金评审专家。出版《连环画情缘》《胡说动漫》等。" },
          ].map((t, i) => (
            <a
              key={i}
              href="/experts/"
              className="ink-card p-5 flex items-start gap-4 block"
              style={{ textDecoration: "none" }}
            >
              <img
                src={t.photo}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><rect width="56" height="56" rx="28" fill="%234f46e5"/><text x="28" y="28" text-anchor="middle" dominant-baseline="central" fill="white" font-size="20" font-weight="bold">${t.name[0]}</text></svg>`
                  )}`;
                }}
              />
              <div className="min-w-0">
                <h4 className="text-base font-bold" style={{ color: "#1e293b" }}>
                  {t.name}
                </h4>
                <p className="text-xs font-medium mb-1" style={{ color: "#2563eb" }}>
                  {t.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.45)" }}>
                  {t.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a href="/experts/" className="text-sm font-medium" style={{ color: "#2563eb" }}>
            查看全部师资 →
          </a>
        </div>
      </section>

      {/* ==================== 六大业务板块 ==================== */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl serif font-bold mb-2" style={{ color: "#1e293b" }}>
            六大业务板块
          </h2>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.4)" }}>
            构建完整的AI视频创作教育服务体系
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "📖", title: "标准教材", href: "/textbooks", desc: "学生用书、教师用书、考评手册，及配套课件PPT、作业模板、项目案例库、提示词模板" },
            { icon: "💻", title: "线上教学平台", href: "/courses", desc: "课程中心、提示词训练、项目实训、作品点评、教师后台、认证考试" },
            { icon: "🏫", title: "线下教学网点", href: "/partner", desc: "校园教学点、机构培训点、企业培训中心、城市运营中心" },
            { icon: "👩‍🏫", title: "教师培训", href: "/teacher-training", desc: "初级讲师→中级讲师→高级讲师的三级培训与认证体系" },
            { icon: "🎬", title: "项目实训", href: "/courses", desc: "国风短片、品牌宣传、电商视频、文旅推广等10大项目库" },
            { icon: "📜", title: "能力认证", href: "/certification", desc: "初级→中级→高级三级认证，企业招聘与职业能力评价依据" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="ink-card p-5 block">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="text-base font-bold mb-1" style={{ color: "#1e293b" }}>
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.45)" }}>
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== 团体标准 ==================== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="ink-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div
              className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl"
              style={{
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.15)",
              }}
            >
              <span className="text-2xl font-bold" style={{ color: "#2563eb" }}>
                标
              </span>
            </div>
            <div className="flex-1">
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.5)" }}
              >
                团体标准
              </span>
              <h2 className="text-xl font-bold mt-2 mb-2" style={{ color: "#1e293b" }}>
                《人工智能视频制作人员要求》T/CCPS 0041—2026
              </h2>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                本标准由CCAV教育机构牵头制定，适用于从事人工智能视觉内容创作、图像生成、视频合成、数字艺术设计等岗位人员。
                可用于企业招聘、人才培养、职业能力评价与职业发展规划。
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="px-3 py-1 rounded"
                  style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.5)" }}
                >
                  标准引领
                </span>
                <span
                  className="px-3 py-1 rounded"
                  style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.5)" }}
                >
                  能力本位
                </span>
                <span
                  className="px-3 py-1 rounded"
                  style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.5)" }}
                >
                  实践导向
                </span>
                <span
                  className="px-3 py-1 rounded"
                  style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.5)" }}
                >
                  人机协同
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 数据统计 ==================== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "1", label: "团体标准", sub: "T/CCPS 0041—2026" },
            { num: "3", label: "标准教材", sub: "学生/教师/考评" },
            { num: "3", label: "认证等级", sub: "初级→中级→高级" },
            { num: "10+", label: "项目案例", sub: "10大AI视频项目库" },
          ].map((item, i) => (
            <div key={i} className="stat-card text-center">
              <div className="text-3xl font-bold mb-1 serif" style={{ color: "#2563eb" }}>
                {item.num}
              </div>
              <div className="text-sm mb-1" style={{ color: "rgba(0,0,0,0.55)" }}>
                {item.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(0,0,0,0.35)" }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 最终 CTA ==================== */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="ink-card p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl serif font-bold mb-3" style={{ color: "#1e293b" }}>
            让AI视频创作教育可学习、可训练、可评价、可认证、可落地
          </h2>
          <p className="mb-8" style={{ color: "rgba(0,0,0,0.45)" }}>
            CCAV — 以团体标准为依据的AI视频创作教育体系
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/teacher-training" className="ink-btn inline-block">
              教师培训报名
            </a>
            <a
              href="/partner"
              className="inline-block px-7 py-2.5 rounded-lg font-semibold cursor-pointer transition duration-300"
              style={{
                background: "rgba(14,165,233,0.08)",
                border: "1px solid rgba(14,165,233,0.4)",
                color: "#0ea5e9",
              }}
            >
              申请合作教学点
            </a>
          </div>
        </div>
      </section>

      {/* ==================== 页脚 ==================== */}
      <footer
        className="border-t py-8 text-center"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <p className="text-sm mb-2 serif" style={{ color: "rgba(0,0,0,0.5)" }}>
          CCAV — AI视频创作教育机构
        </p>
        <p className="text-xs" style={{ color: "rgba(0,0,0,0.35)" }}>
          以 T/CCPS 0041—2026团体标准为核心的AI视频创作教育运营平台 · © 2026
        </p>
        <div
          className="flex items-center justify-center gap-4 mt-3 text-xs"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          <a
            href="/about"
            className="hover:transition"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            关于CCAV
          </a>
          <a
            href="/contact"
            className="hover:transition"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            联系我们
          </a>
          <a
            href="/partner"
            className="hover:transition"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            合作教学点
          </a>
        </div>
      </footer>
    </>
  );
}
