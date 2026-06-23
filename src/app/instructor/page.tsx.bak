"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Star, Award, Mail, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const requirements = [
  "热爱AI教育事业，愿意将所学传授给更多人",
  "已完成平台对应等级的课程学习并通过考核",
  "具备基本的表达能力与教学热情",
  "能够独立完成教案设计与课堂教学",
];

const benefits = [
  { icon: Award, title: "官方认证", desc: "获得平台认证讲师证书，提升个人品牌价值" },
  { icon: Star, title: "分成收益", desc: "按授课情况获得收益分成，多劳多得" },
  { icon: CheckCircle, title: "持续成长", desc: "定期讲师研修营，跟上AI技术前沿" },
];

export default function InstructorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-[#161b22] to-[#0d1117]">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-[#f0f6fc] mb-6">
                成为ccav.com认证讲师
              </h1>
              <p className="text-lg text-[#8b949e] max-w-2xl mx-auto mb-8">
                加入我们的讲师团队，将你的AI视频制作经验传授给更多学员
              </p>
              <a
                href="mailto:contact@ccav.com"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#e53e3e] to-[#c53030] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#e53e3e]/20 transition-all"
              >
                <Mail className="w-5 h-5" />
                邮件申请
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* 创始人简介 */}
        <section className="py-16 bg-[#0d1117]">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d]"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#f0f6fc] mb-1">Jin Wang</h2>
                  <p className="text-[#58a6ff] mb-4">ccav.com 创始人 · AI视频制作专家</p>
                  <p className="text-[#c9d1d9] leading-relaxed mb-4">
                    深耕AI视频制作与教学领域，致力于将AIGC技术转化为普通人也能掌握的实际技能。
                    从零代码提示词到全流程AI视频制作，在实践中总结出一套「学得会、用得上、教得出去」的教学体系。
                  </p>
                  <p className="text-[#8b949e] text-sm">
                    核心方向：AI视频创作、提示词工程、AI教学工具研发、师培训练营
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-[#0d1117]">
          <div className="max-w-4xl mx-auto px-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-[#f0f6fc] text-center mb-10"
            >
              申请条件
            </motion.h2>

            <div className="space-y-4">
              {requirements.map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#161b22] border border-[#30363d]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#3fb950]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#3fb950]" />
                  </div>
                  <p className="text-[#c9d1d9]">{req}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gradient-to-b from-[#0d1117] to-[#161b22]">
          <div className="max-w-6xl mx-auto px-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-[#f0f6fc] text-center mb-10"
            >
              讲师权益
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center hover:border-[#58a6ff]/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#58a6ff]/10 flex items-center justify-center mx-auto mb-4">
                    <b.icon className="w-6 h-6 text-[#58a6ff]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#f0f6fc] mb-2">{b.title}</h3>
                  <p className="text-sm text-[#8b949e]">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
