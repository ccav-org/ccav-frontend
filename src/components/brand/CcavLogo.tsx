type CcavLogoProps = {
  variant?: "nav" | "hero";
  className?: string;
};

function CcavWordmark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 286 112" role="img" aria-label="CCAV">
      <defs>
        <linearGradient id="ccavBlue" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0b63ce" />
          <stop offset="100%" stopColor="#1746b8" />
        </linearGradient>
        <linearGradient id="ccavGreen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#78c943" />
          <stop offset="100%" stopColor="#18b89b" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="84"
        fill="url(#ccavBlue)"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="86"
        fontWeight="900"
        letterSpacing="0"
      >
        CCAV
      </text>
      <path d="M56 39 L56 73 L84 56 Z" fill="url(#ccavGreen)" />
    </svg>
  );
}

export default function CcavLogo({ variant = "nav", className = "" }: CcavLogoProps) {
  if (variant === "hero") {
    return (
      <div className={className}>
        <CcavWordmark className="h-auto w-[210px] sm:w-[250px] md:w-[300px]" />
        <div className="mt-2 text-[18px] font-semibold leading-tight text-[#111827] sm:text-[21px] md:text-[24px]">
          AI 视频创作教育机构
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <CcavWordmark className="h-auto w-[92px] shrink-0 md:w-[104px]" />
      <div className="hidden -ml-5 min-w-[104px] leading-tight sm:block">
        <div className="text-[12px] font-bold text-[#111827]">—— AI 视频创作教育机构</div>
      </div>
    </div>
  );
}
