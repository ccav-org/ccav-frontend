"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  desktopNavGroups,
  navActions,
  sidebarLinks,
  NavGroup,
} from "@/lib/navLinks";

/** 单个下拉分组（悬停展开） */
function DropdownGroup({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-sm cursor-pointer transition no-underline"
        style={{ color: open ? "#2563eb" : "rgba(0,0,0,0.55)" }}
        onClick={() => setOpen((v) => !v)}
      >
        {group.title}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 rounded-lg shadow-lg border overflow-hidden"
          style={{
            minWidth: "160px",
            background: "#ffffff",
            borderColor: "rgba(0,0,0,0.06)",
            zIndex: 100,
          }}
        >
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 text-sm no-underline transition"
              style={{ color: "rgba(0,0,0,0.55)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37,99,235,0.04)";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(0,0,0,0.55)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭汉堡菜单
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <nav
        className="flex items-center pl-8 pr-4 py-4 border-b relative"
        style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.06)", zIndex: 50 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 no-underline"
        >
          <span
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#2563eb", fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            CCAV
          </span>
          <span className="text-xs hidden sm:inline" style={{ color: "rgba(37,99,235,0.6)" }}>
            AI视频创作教育机构
          </span>
        </Link>

        {/* 桌面端导航 - 三组下拉 */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          {desktopNavGroups.map((group) => (
            <DropdownGroup key={group.title} group={group} />
          ))}
        </div>

        {/* 桌面端右侧按钮 */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            href={navActions[0].href}
            className="text-xs px-4 py-1.5 rounded-md border no-underline transition"
            style={{
              borderColor: "rgba(0,0,0,0.15)",
              color: "rgba(0,0,0,0.55)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.color = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
              e.currentTarget.style.color = "rgba(0,0,0,0.55)";
            }}
          >
            {navActions[0].label}
          </Link>
          <Link
            href={navActions[1].href}
            className="ink-btn text-xs px-4 py-1.5 no-underline"
            style={{ animation: "none" }}
          >
            {navActions[1].label}
          </Link>
        </div>

        {/* 手机端：报名按钮 + 汉堡 */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <Link
            href={navActions[1].href}
            className="ink-btn text-xs no-underline"
            style={{ animation: "none", padding: "4px 10px", fontSize: "11px" }}
          >
            报名
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 transition"
            style={{ color: "rgba(0,0,0,0.4)" }}
            aria-label="菜单"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* 手机端汉堡菜单面板 */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t"
          style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.06)", zIndex: 100 }}
        >
          <div className="px-8 py-4">
            {/* 分组标题和链接 */}
            {desktopNavGroups.map((group) => (
              <div key={group.title} className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "rgba(0,0,0,0.25)" }}
                >
                  {group.title}
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm no-underline py-1 transition"
                      style={{ color: "rgba(0,0,0,0.55)" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <hr className="my-4" style={{ borderColor: "rgba(0,0,0,0.06)" }} />

            {/* 登录/注册 */}
            <Link
              href={navActions[0].href}
              className="block text-sm no-underline py-2 transition"
              style={{ color: "rgba(0,0,0,0.55)" }}
              onClick={() => setMenuOpen(false)}
            >
              {navActions[0].label}
            </Link>

            {/* 教师培训报名 */}
            <Link
              href={navActions[1].href}
              className="ink-btn text-xs px-4 py-2 no-underline text-center mt-2 block"
              style={{ animation: "none", color: "#fff" }}
              onClick={() => setMenuOpen(false)}
            >
              {navActions[1].label}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
