export const SITE = {
  title: "Neo's Buffet Infinity",
  /** 导航栏左上角品牌名，<em> 里的部分会被渐变高亮 */
  brand: "Neo's <em>Buffet Infinity</em>",
  /** 首页大标题，<em> 里的部分会被渐变高亮 */
  heroTitle: "All you <em>can eat</em>",
  /** 只用于 SEO meta 和 RSS，首页不再显示 */
  description: "记录收藏，技术碎片，爱好。",
  author: "NeoNought",
  startYear: 2025,
  nav: [
    { href: "/", label: "首页" },
    { href: "/archive", label: "归档" },
    { href: "/tags", label: "标签" },
    { href: "/about", label: "关于" },
  ],
} as const;
