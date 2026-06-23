"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      className="flex items-center gap-1.5 text-xs sm:text-sm flex-wrap px-4 sm:px-8 pt-6 pb-0"
      style={{ color: "rgba(0,0,0,0.4)" }}
      aria-label="面包屑导航"
    >
      <Link href="/" className="hover:text-[#2563eb] transition no-underline flex items-center gap-1" style={{ color: "inherit" }}>
        <Home size={14} />
        <span className="hidden sm:inline">首页</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#2563eb] transition no-underline" style={{ color: "inherit" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "rgba(0,0,0,0.65)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
