import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CCAV — AI视频创作教育机构",
  description: "以团体标准为依据、以标准教材为核心、以教师培训为启动点、以线下网点为落地渠道的AI视频创作教育运营平台。",
  keywords: "AI视频, AIGC, 视频创作, 教育机构, 团体标准, 教师培训, 能力认证, CCAV",
  openGraph: {
    title: "CCAV — AI视频创作教育机构",
    description: "标准教材 + 线上平台 + 线下网点 + 教师培训 + 项目实训 + 能力认证",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col ink-bg">
        <div className="ink-mountain" aria-hidden="true" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
