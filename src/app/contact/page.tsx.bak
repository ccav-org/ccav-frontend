"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Clock, MapPin, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
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
                联系我们
              </h1>
              <p className="text-lg text-[#8b949e] max-w-2xl mx-auto">
                对课程或师训有任何问题？随时联系我们，我们将尽快回复。
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-[#0d1117]">
          <div className="max-w-4xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 邮件 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d] text-center hover:border-[#58a6ff]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#58a6ff]/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#58a6ff]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f0f6fc] mb-2">邮件咨询</h3>
                <p className="text-sm text-[#8b949e] mb-4">
                  课程报名、合作咨询、讲师申请
                </p>
                <a
                  href="mailto:contact@ccav.com"
                  className="inline-flex items-center gap-2 text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  contact@ccav.com
                </a>
              </motion.div>

              {/* 在线咨询 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d] text-center hover:border-[#58a6ff]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#d2991d]/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-[#d2991d]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f0f6fc] mb-2">在线咨询</h3>
                <p className="text-sm text-[#8b949e] mb-4">
                  即时问答，快速了解课程详情
                </p>
                <span className="inline-flex items-center gap-2 text-[#8b949e] text-sm">
                  🚧 即将上线
                </span>
              </motion.div>
            </div>

            {/* 响应时间 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 rounded-2xl bg-[#161b22] border border-[#30363d]"
            >
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#8b949e]">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#58a6ff]" />
                  响应时间：工作日24小时内回复
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#3fb950]" />
                  国内服务（ICP备案中）
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
