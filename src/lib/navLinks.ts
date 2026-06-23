// 导航链接统一数据源
// 所有页面（React组件）引用此模块，避免手写重复

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// 桌面端导航分组（三组下拉 + 右侧独立 action）
export const desktopNavGroups: NavGroup[] = [
  {
    title: "教学体系",
    items: [
      { label: "课程体系", href: "/courses" },
      { label: "标准教材", href: "/textbooks" },
      { label: "作品展示", href: "/gallery" },
      { label: "工具", href: "/tools" },
    ],
  },
  {
    title: "标准与认证",
    items: [
      { label: "能力认证", href: "/certification" },
      { label: "教师培训", href: "/teacher-training" },
      { label: "合作教学点", href: "/partner" },
    ],
  },
  {
    title: "关于",
    items: [
      { label: "关于CCAV", href: "/about" },
      { label: "联系我们", href: "/contact" },
      { label: "专家与讲师", href: "/experts" },
    ],
  },
];

// 右侧独立按钮（不放在下拉中）
export const navActions = [
  { label: "登录/注册", href: "/auth/login", style: "outline" as const },
  { label: "教师培训报名", href: "/teacher-training/apply", style: "primary" as const },
];

// 移动端汉堡菜单的四个场景入口（Hero 也用）
export const quickEntries = [
  { icon: "🎬", label: "课程体系", desc: "从零到精通的学习路径", href: "/courses" },
  { icon: "🏅", label: "能力认证", desc: "初级→中级→高级三级认证", href: "/certification" },
  { icon: "👩‍🏫", label: "教师培训", desc: "认证讲师体系培训与考核", href: "/teacher-training" },
  { icon: "🏫", label: "合作教学点", desc: "全国线下教学网点加盟", href: "/partner" },
];

// 导航栏常规链接文本（供移动端显示用）
export const sidebarLinks: NavItem[] = [
  { label: "首页", href: "/" },
  ...desktopNavGroups.flatMap((g) => g.items),
];

// Footer 链接
export const footerPrimaryLinks: NavItem[] = [
  { label: "关于CCAV", href: "/about" },
  { label: "联系我们", href: "/contact" },
  { label: "合作教学点", href: "/partner" },
];

export const footerBusinessLinks: NavItem[] = [
  { label: "课程体系", href: "/courses" },
  { label: "标准教材", href: "/textbooks" },
  { label: "教师培训", href: "/teacher-training" },
  { label: "能力认证", href: "/certification" },
  { label: "作品展示", href: "/gallery" },
  { label: "工具", href: "/tools" },
];
