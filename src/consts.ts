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
  /** 页脚的"餐厅信息"。地址和电话都是虚构的：
   *  Huntington Ave 在 02115 段门牌最高到 880 左右，36000 不存在；
   *  555-01xx 是北美保留给虚构作品的号段，永远打不通。 */
  shop: {
    address: "36000 Huntington Avenue, Boston, MA 02115",
    phone: "+1 (617) 555-0142",
    hours: "全天营业 · 无限续盘",
  },
  nav: [
    { href: "/", label: "首页" },
    { href: "/archive", label: "归档" },
    { href: "/tags", label: "标签" },
    { href: "/about", label: "关于" },
  ],
} as const;
