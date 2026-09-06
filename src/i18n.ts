/**
 * 界面文案的中英对照。
 *
 * 只放界面字符串。文章标题在各自的 frontmatter 里用 titleEn，
 * 正文不在这里（正文走文章页的按需翻译）。
 */
export const UI = {
  nav: {
    home: { zh: "首页", en: "Home" },
    archive: { zh: "归档", en: "Archive" },
    tags: { zh: "标签", en: "Tags" },
    about: { zh: "关于", en: "About" },
  },

  home: {
    /** {n} 会被替换成文章数 */
    count: { zh: "{n} 篇记录", en: "{n} entries" },
    latest: { zh: "最新", en: "Latest" },
    viewAll: { zh: "查看全部 →", en: "View all →" },
    hours: { zh: "全天营业 · 无限续盘", en: "Open 24 hours · Endless refills" },
  },

  post: {
    readingTime: { zh: "约 {n} 分钟", en: "~{n} min read" },
    draft: { zh: "草稿", en: "Draft" },
    prev: { zh: "← 上一篇", en: "← Previous" },
    next: { zh: "下一篇 →", en: "Next →" },
    sourceNote: {
      zh: "课程为小迪安全官方 2024 年上传，本文为个人学习笔记。",
      en: "Course published by XiaoDi Security in 2024. These are my personal study notes.",
    },
  },

  archive: {
    title: { zh: "归档", en: "Archive" },
    total: { zh: "共 {n} 篇", en: "{n} in total" },
  },

  tags: {
    title: { zh: "标签", en: "Tags" },
    count: { zh: "{n} 个标签", en: "{n} tags" },
    postCount: { zh: "{n} 篇", en: "{n} posts" },
    backToAll: { zh: "← 所有标签", en: "← All tags" },
  },

  about: {
    title: { zh: "关于", en: "About" },
    founded: {
      zh: "本站成立于 2026 年 8 月 28 日。站内文章标注的日期，均为照片的拍摄日期或文章的创作日期，不一定是发布到这里的时间。",
      en: "This site was founded on 28 August 2026. The date shown on each post is when the photo was taken or the piece was written, not necessarily when it was published here.",
    },
    aboutSiteHeading: { zh: "关于这个站", en: "About this site" },
    aboutSite: {
      zh: '用 <a href="https://astro.build">Astro</a> 搭的静态站，写完 Markdown 推上去就自动部署。图片在构建时统一压成 AVIF/WebP。',
      en: 'A static site built with <a href="https://astro.build">Astro</a>. Write Markdown, push, and it deploys itself. Images are converted to AVIF/WebP at build time.',
    },
  },

  footer: {
    poweredBy: {
      zh: '由 <a href="https://astro.build">Astro</a> 驱动',
      en: 'Powered by <a href="https://astro.build">Astro</a>',
    },
  },

  /** 有英文正文的文章上的小标记 */
  enBadge: {
    label: "EN",
    title: { zh: "这篇有英文正文", en: "Full English version available" },
  },

  /** 首次切到英文时弹一次，说明翻译覆盖到什么程度 */
  enNotice: {
    title: "Heads up",
    body:
      "The interface and all post titles are fully translated. " +
      "Post bodies are another matter: only entries marked " +
      "<strong>EN</strong> have a full English version. Everything else " +
      "is still in Chinese.",
    dismiss: "Got it",
  },

  langToggle: {
    /** 按钮显示的是「切换到哪一种」，所以中英是反着的 */
    zh: "EN",
    en: "中",
    label: { zh: "Switch to English", en: "切换到中文" },
  },
} as const;

/** 把 {n} 之类的占位符替换掉 */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => String(vars[k] ?? m));
}

/** 日期按语言各出一份，中文「2026年9月1日」，英文「1 September 2026」 */
export function formatDateBoth(d: Date) {
  return {
    zh: d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }),
    en: d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
  };
}
