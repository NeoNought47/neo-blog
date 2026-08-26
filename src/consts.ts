export const SITE = {
  title: "Neo's Blog",
  /** 首页大标题，<em> 里的部分会被渐变高亮 */
  heroTitle: "记录游戏、卡牌<br />与一些<em>技术碎片</em>",
  description: "一个人的记录本 — 游戏、万智牌、CS2、技术笔记。",
  author: "NeoNought",
  startYear: 2025,
  nav: [
    { href: "/", label: "首页" },
    { href: "/archive", label: "归档" },
    { href: "/tags", label: "标签" },
    { href: "/about", label: "关于" },
  ],
} as const;
