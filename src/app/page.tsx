"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ArrowRight,
  BookOpen,
  Building2,
  Clapperboard,
  GraduationCap,
  ImageIcon,
  MonitorPlay,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const modules = [
  {
    icon: BookOpen,
    title: "标准教材",
    desc: "团体标准教材体系\n学生用书、教师用书、考评手册",
    href: "/textbooks",
    color: "from-[#2563eb] to-[#38bdf8]",
    bg: "bg-[#eff6ff]",
  },
  {
    icon: MonitorPlay,
    title: "线上课程",
    desc: "系统化在线课程\n随时随地学习提升",
    href: "/courses",
    color: "from-[#14b8a6] to-[#10b981]",
    bg: "bg-[#ecfdf5]",
  },
  {
    icon: Building2,
    title: "线下教学网点",
    desc: "全国授权教学网点\n线下实训、本地服务",
    href: "/partner",
    color: "from-[#f59e0b] to-[#f97316]",
    bg: "bg-[#fff7ed]",
  },
  {
    icon: GraduationCap,
    title: "教师培训",
    desc: "认证讲师培养体系\n专业成长、教学赋能",
    href: "/teacher-training",
    color: "from-[#7c3aed] to-[#a855f7]",
    bg: "bg-[#f5f3ff]",
  },
  {
    icon: Clapperboard,
    title: "项目实训",
    desc: "真实项目驱动学习\n从创意到成片实战",
    href: "/workshop",
    color: "from-[#0284c7] to-[#38bdf8]",
    bg: "bg-[#f0f9ff]",
  },
  {
    icon: ShieldCheck,
    title: "能力认证",
    desc: "初级、中级、高级认证\n权威认证、能力证明",
    href: "/certification",
    color: "from-[#0f766e] to-[#14b8a6]",
    bg: "bg-[#ecfdf5]",
  },
];

const audiences = [
  {
    title: "学生",
    desc: "用 AI 完成故事短片、知识视频和创意表达，建立作品意识与数字创作能力。",
    points: ["青少年兴趣学习", "职业院校项目实训"],
    image: "/images/home/hero-ai-video-training.png",
    href: "/courses",
  },
  {
    title: "创作者 / 职场人",
    desc: "把工具流程转化为稳定产出能力，用项目训练提升内容制作和商业表达效率。",
    points: ["内容创作者", "企业内容团队"],
    image: "/images/home/hero-commercial-project.png",
    href: "/workshop",
  },
  {
    title: "机构 / 学校",
    desc: "获得课程、教材、师资培训和网点运营支持，快速落地标准化 AI 视频教学。",
    points: ["培训机构", "学校与线下网点"],
    image: "/images/home/hero-image-to-video.png",
    href: "/partner",
  },
];

const works = [
  {
    title: "初级示范：纸飞机知识短片",
    desc: "基础提示词、镜头运动和画面修正过程",
    tag: "初级示范",
    process: ["提示词拆解", "2轮迭代", "成图说明"],
    image: "/images/samples/cert-sample-beginner.png",
  },
  {
    title: "中级示范：文旅镜头短片",
    desc: "分镜提示词、风格控制和画面连贯迭代",
    tag: "中级示范",
    process: ["分镜脚本", "风格迭代", "视频流程"],
    image: "/images/samples/cert-sample-intermediate.png",
  },
  {
    title: "高级示范：品牌叙事短片",
    desc: "商业 brief、关键帧设计和多场景制作流程",
    tag: "高级示范",
    process: ["项目 brief", "关键帧迭代", "成片流程"],
    image: "/images/samples/cert-sample-advanced.png",
  },
];

const experts = [
  {
    name: "金城",
    title: "广东省当代美术院院长",
    desc: "中国美术家协会理事，长期参与动漫、插画与数字创意教育建设。",
    image: "/images/experts/jincheng.jpg",
    accent: "linear-gradient(135deg, #0b63ce 0%, #38bdf8 100%)",
  },
  {
    name: "王晟",
    title: "浙江光影空间文化创意有限公司副总经理",
    desc: "深耕 IP 商业化、动漫游戏、文旅与数字产业内容运营。",
    image: "/images/experts/wangsheng.jpg",
    accent: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
  },
  {
    name: "柳洪博",
    title: "北京神灯时代总经理",
    desc: "专注数字交互艺术、AI 视觉内容与沉浸式创意项目实践。",
    image: "/images/experts/liuhongbo.jpg",
    accent: "linear-gradient(135deg, #1746b8 0%, #0ea5b7 100%)",
  },
  {
    name: "刘道勇",
    title: "杭州赤兔数字科技有限公司总经理",
    desc: "动画行业二十年经验，参与多部动画影视项目与 AIGC 制作转型。",
    image: "/images/experts/liudaoyong.jpg",
    accent: "linear-gradient(135deg, #2563eb 0%, #12b89a 100%)",
  },
];

const abilityCertificates = ["初级", "中级", "高级"];
const teacherCertificates = ["初级", "中级", "高级"];

const stats = [
  { value: "100+", label: "培养教师" },
  { value: "300+", label: "授权教学网点" },
  { value: "10000+", label: "在线学员" },
  { value: "500+", label: "认证讲师" },
  { value: "10000+", label: "优秀作品" },
  { value: "500+", label: "合作机构与企业" },
];

const actions = [
  { icon: MonitorPlay, title: "个人学习", desc: "预约体验课，了解课程体系与教材资料", href: "/courses", action: "预约体验" },
  { icon: Building2, title: "机构合作", desc: "咨询合作方案，申请共建教学网点", href: "/partner", action: "合作加盟" },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white">
        <section className="border-b border-slate-100 bg-gradient-to-br from-white via-[#f8fbff] to-[#eaf4ff]">
          <div className="mx-auto max-w-[1600px] px-5 pt-4 md:px-8 md:pt-6">
            <div className="flex flex-col gap-3 rounded-xl border border-[#dbeafe] bg-white/75 p-3 shadow-[0_16px_40px_rgba(37,99,235,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between md:rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="relative hidden h-12 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eff6ff] sm:block">
                  <Image
                    src="/images/home/hero-reference-ai-studio.jpg"
                    alt="AI视频创作作品学习"
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#14213d] md:text-base">
                    让每个学习者都能用 AI 创作自己的视频作品
                  </p>
                  <p className="mt-0.5 text-xs font-medium leading-snug text-slate-500">
                    从方法训练到项目创作，最终形成自己的作品。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-5 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[minmax(500px,0.92fr)_minmax(390px,1.08fr)] lg:gap-5 lg:py-10 xl:grid-cols-[minmax(620px,0.9fr)_minmax(560px,1.1fr)] xl:gap-8">
            <div>
              <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#14213d] sm:text-[46px] lg:whitespace-nowrap lg:text-[44px] xl:text-[56px] 2xl:text-[62px]">
                <span className="bg-gradient-to-r from-[#0ea5b7] to-[#2563eb] bg-clip-text text-transparent">AI</span>
                <span className="ml-3">视频创作教育机构</span>
              </h1>
              <p className="mt-3 text-base font-medium leading-relaxed text-[#24324f] md:mt-4 md:text-xl">
                依据 T/CCPS 0041—2026《人工智能视频制作人员要求》团体标准，把课程训练、项目作品和能力评价连接成完整学习路径。
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-8">
                <Link
                  href="/courses"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0b63ce] px-6 text-sm font-semibold text-white no-underline shadow-[0_12px_30px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 md:h-12 md:px-7"
                >
                  预约体验课
                  <ArrowRight size={17} />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-[#0b63ce]/30 bg-white px-6 text-sm font-semibold text-[#0b63ce] no-underline shadow-sm transition hover:bg-[#eff6ff] md:h-12 md:px-7"
                >
                  查看课程体系
                </Link>
              </div>
            </div>

            <div className="relative min-h-[180px] overflow-hidden rounded-2xl bg-white/40 sm:min-h-[280px] lg:-mr-2 lg:min-h-[350px] xl:-mr-4 xl:min-h-[390px]">
              <Image
                src="/images/home/hero-reference-ai-studio.jpg"
                alt="AI视频创作学习场景"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/18 via-transparent to-[#dbeafe]/10" />
            </div>
          </div>

          <div className="mx-auto max-w-[1600px] px-5 pb-6 md:px-8 md:pb-8 lg:pb-10">
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#dbeafe] bg-white/70 p-2 shadow-[0_16px_40px_rgba(37,99,235,0.06)] md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-3 md:rounded-2xl md:p-3">
              {[
                { step: "01", title: "学方法", desc: "掌握提示词、分镜、镜头语言与工具流程" },
                { step: "02", title: "做作品", desc: "围绕真实项目完成自己的 AI 视频作品" },
                { step: "03", title: "获取证书", desc: "用作品和考核结果完成能力评价" },
              ].map((item, index) => (
                <div key={item.step} className="contents">
                  <div className="flex min-h-[72px] flex-col items-start justify-center gap-1 rounded-lg bg-[#f8fbff] px-3 py-2.5 sm:min-h-0 sm:flex-row sm:items-center sm:gap-3 md:rounded-xl md:px-4 md:py-3">
                    <span className="text-base font-bold text-[#2563eb] md:text-lg">{item.step}</span>
                    <span>
                      <span className="block text-sm font-bold text-[#14213d]">{item.title}</span>
                      <span className="hidden text-xs font-medium leading-snug text-slate-500 sm:inline">{item.desc}</span>
                    </span>
                  </div>
                  {index < 2 && (
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#bfdbfe] bg-white text-[#2563eb] shadow-sm md:flex">
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0b63ce] px-5 py-6 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl font-bold leading-none">{item.value}</div>
                <div className="mt-1 text-xs text-white/75">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white px-5 py-10 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold text-[#2563eb]">证书体系</p>
                <h2 className="mt-1 text-xl font-bold text-[#14213d] md:text-2xl">
                  学习结果既落在作品上，也落在可评价的证书上
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                围绕 AI 视频创作能力，分为面向学习者的能力证书和面向教学者的认证讲师证书两条路径。
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b63ce] text-white">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#14213d]">AIGC视频创作能力证书</h3>
                    <p className="text-sm text-slate-500">初级、中级、高级，对应不同阶段的作品能力。</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {abilityCertificates.map((level, index) => (
                    <div key={level} className="relative overflow-hidden rounded-xl border border-[#bfdbfe] bg-white p-4 shadow-sm">
                      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#eff6ff]" />
                      <div className="relative">
                        <div className="mb-8 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2563eb]">CCAV</span>
                          <Award size={18} className="text-[#12b89a]" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">AI 视频创作</p>
                        <h4 className="mt-1 text-xl font-bold text-[#14213d]">{level}能力证书</h4>
                        <p className="mt-1 text-xs font-semibold text-[#2563eb]">AIGC视频创作{level}能力证书</p>
                        <div className="mt-5 h-1.5 rounded-full bg-[#dbeafe]">
                          <div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${45 + index * 22}%` }} />
                        </div>
                        <p className="mt-3 text-xs font-medium text-slate-500">作品提交 · 能力考核 · 结果评价</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#ccfbf1] bg-[#f0fdfa] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12b89a] text-white">
                    <GraduationCap size={23} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#14213d]">CCAV认证讲师证书</h3>
                    <p className="text-sm text-slate-500">初级、中级、高级，对应不同阶段的教学与指导能力。</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {teacherCertificates.map((level) => (
                    <div key={level} className="rounded-xl border border-[#99f6e4] bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#0f766e]">CCAV 教师培养</p>
                          <h4 className="mt-1 text-lg font-bold text-[#14213d]">{level}讲师证书</h4>
                          <p className="mt-1 text-xs font-semibold text-[#0f766e]">CCAV认证{level}讲师证书</p>
                        </div>
                        <Award size={28} className="text-[#12b89a]" />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-500">
                        用于教师培训、教学实施与项目作品指导能力的等级评价。
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-10 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-bold text-[#14213d] md:text-2xl">六大核心业务板块</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {modules.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`flex min-h-[170px] flex-col rounded-xl ${item.bg} p-5 text-center no-underline transition hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#14213d]">{item.title}</h3>
                    <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f8fbff] px-5 py-10 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#2563eb]">专家与师资队伍</p>
                <h2 className="mt-1 text-xl font-bold text-[#14213d] md:text-2xl">
                  由行业专家和一线讲师共同参与课程建设、项目实训和能力评价
                </h2>
              </div>
              <Link href="/experts" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#2563eb] no-underline md:inline-flex">
                查看全部师资
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {experts.map((expert) => (
                <Link
                  key={expert.name}
                  href="/experts"
                  className="group overflow-hidden rounded-xl border border-[#dbeafe] bg-white text-[#14213d] no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative flex h-36 items-center justify-center overflow-hidden" style={{ background: expert.accent }}>
                    {expert.image ? (
                      <>
                        <Image src={expert.image} alt={`${expert.name}专家照片`} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover object-center transition duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14213d]/55 via-[#14213d]/10 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.32),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.24))]" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/35 bg-white/18 text-3xl font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] backdrop-blur">
                          {expert.name.slice(0, 1)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold">{expert.name}</h3>
                      <span className="rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">导师</span>
                    </div>
                    <p className="mt-1 min-h-[34px] text-xs font-semibold leading-relaxed text-[#2563eb]">{expert.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{expert.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/experts" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] no-underline md:hidden">
              查看全部师资
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="bg-[#f8fbff] px-5 py-9 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-bold text-[#14213d] md:text-2xl">适合谁学习</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {audiences.map((item) => (
                <Link key={item.title} href={item.href} className="overflow-hidden rounded-xl border border-[#dbeafe] bg-white text-[#14213d] no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-32">
                    <Image src={item.image} alt={item.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14213d]/50 via-transparent to-transparent" />
                    <h3 className="absolute bottom-3 left-4 text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.points.map((point) => (
                        <span key={point} className="rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-10 md:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_390px]">
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#14213d] md:text-2xl">官方示范作品展示</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    展示初 / 中 / 高三级作品结果、提示词拆解、迭代记录和制作流程；学生作品上线后逐步补充。
                  </p>
                </div>
                <Link href="/gallery" className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] no-underline">
                  查看更多
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {works.map((item) => (
                  <Link key={item.title} href="/gallery" className="group no-underline">
                    <div className="relative h-28 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 18vw, 50vw" className="object-cover transition group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/15" />
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-[#0b63ce]">
                        {item.tag}
                      </span>
                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                        <ImageIcon size={16} />
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-[#14213d]">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.process.map((point) => (
                        <span key={point} className="rounded-full bg-[#eff6ff] px-2 py-1 text-[10px] font-semibold text-[#2563eb]">
                          {point}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8fbff] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#14213d]">全国线下教学网点</h2>
                <Link href="/partner" className="text-sm font-semibold text-[#2563eb] no-underline">查看网点</Link>
              </div>
              <div className="mt-5 space-y-2">
                <p className="text-sm text-slate-500">覆盖全国 <span className="text-2xl font-bold text-[#14213d]">30+</span> 省市自治区</p>
                <p className="text-sm text-slate-500"><span className="text-2xl font-bold text-[#14213d]">300+</span> 授权教学网点</p>
              </div>
              <Link
                href="/partner"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#0b63ce] px-6 py-3 text-sm font-semibold text-white no-underline"
              >
                查询附近网点
              </Link>
              <div className="relative mt-5 h-44 rounded-xl bg-white">
                <div className="absolute inset-5 rounded-[45%] bg-[#dbeafe]" />
                {Array.from({ length: 24 }).map((_, index) => (
                  <span
                    key={index}
                    className="absolute h-2 w-2 rounded-full bg-[#2563eb]"
                    style={{
                      left: `${18 + ((index * 17) % 64)}%`,
                      top: `${22 + ((index * 23) % 58)}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#12b89a] px-5 py-6 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="flex flex-col gap-3 rounded-xl px-4 py-4 text-white no-underline transition hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon size={25} className="shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-base font-bold">{item.title}</span>
                      <span className="block text-xs leading-relaxed text-white/75">{item.desc}</span>
                    </span>
                  </span>
                  <span className="shrink-0">
                    <span className="inline-flex rounded-lg bg-white/18 px-3 py-2 text-sm font-semibold">{item.action}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
