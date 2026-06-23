"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CcavLogo from "@/components/brand/CcavLogo";

const navItems = [
  { label: "首页", href: "/" },
  { label: "关于 CCAV", href: "/about" },
  { label: "课程中心", href: "/courses" },
  { label: "教材资源", href: "/textbooks" },
  { label: "线下网点", href: "/partner" },
  { label: "项目实训", href: "/workshop" },
  { label: "教师培训", href: "/teacher-training" },
  { label: "能力认证", href: "/certification" },
  { label: "合作加盟", href: "/partner" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex h-[66px] items-center border-b border-[#dbeafe] bg-[#f7fbff]/95 px-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur md:px-8">
        <Link href="/" className="flex shrink-0 items-center no-underline">
          <CcavLogo />
        </Link>

        <div className="ml-10 hidden flex-1 items-center justify-center gap-5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-[13px] font-semibold text-[#111827] no-underline transition hover:text-[#0b63ce]"
            >
              {item.label}
              {item.href === "/" && <span className="absolute -bottom-5 left-0 right-0 mx-auto h-0.5 w-6 rounded-full bg-[#0b63ce]" />}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden items-center xl:flex">
          <Link href="/auth/login" className="text-[13px] font-semibold text-[#111827] no-underline transition hover:text-[#0b63ce]">
            登录/注册
          </Link>
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-3 xl:hidden">
          <Link href="/auth/login" className="shrink-0 rounded-lg bg-[#0b63ce] px-3 py-1.5 text-xs font-semibold text-white no-underline">
            登录/注册
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-nav-menu"
          role="menu"
          className="fixed left-0 right-0 top-[66px] z-50 max-h-[calc(100vh-66px)] overflow-y-auto border-b border-slate-100 bg-white shadow-lg xl:hidden"
        >
          <div className="grid grid-cols-2 gap-2 px-5 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                role="menuitem"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 no-underline transition hover:bg-[#eff6ff] hover:text-[#0b63ce]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
