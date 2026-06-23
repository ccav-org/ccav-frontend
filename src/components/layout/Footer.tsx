export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "32px 0",
        textAlign: "center",
        background: "#1f2937",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.2)",
          marginBottom: "8px",
          fontFamily: "'Noto Serif SC', serif",
        }}
      >
        ccav.com — 用 AI，讲好每一个高质感的中国故事
      </p>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.1)" }}>
        以 T/CCPS 为核心的AI视频制作教学平台 · © 2026
      </p>
    </footer>
  );
}
