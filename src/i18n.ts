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
    name: "Neo",
    interestsHeading: { zh: "这里会写什么", en: "What you will find here" },
    timelineHeading: { zh: "运行日期", en: "Timeline" },
    oldSite: { zh: "旧站 · Flask", en: "Old site · Flask" },
    newSite: { zh: "本站 · Astro", en: "This site · Astro" },
    retired: { zh: "已停用", en: "Retired" },
    running: { zh: "运行中", en: "Running" },
    days: { zh: "{n} 天", en: "{n} days" },
  },

  /** 关于页里按主题分组的兴趣说明 */
  interests: [
    {
      tag: "Neo's Collection",
      zh: { title: "收藏", body: "Hot Toys 的 1:6 人偶、CS2 饰品，还有一些万智牌套牌的实物。买回来拍照存档，顺便记一下当时的想法。" },
      en: { title: "Collecting", body: "Hot Toys 1:6 figures, CS2 skins, and a few Magic decks in paper. I photograph them and note down what I was thinking at the time." },
    },
    {
      tag: "Cybersecurity",
      zh: { title: "安全与技术", body: "跟着课程做的学习笔记，抓包、反弹 shell、Web 架构这类基础内容，也有装系统折腾双系统的记录。" },
      en: { title: "Security & tech", body: "Study notes from courses I follow: packet capture, reverse shells, web architecture, plus the occasional dual-boot install log." },
    },
    {
      tag: "Photography",
      zh: { title: "拍照", body: "出门带着相机拍的东西。目前主要是黄石那趟。" },
      en: { title: "Photography", body: "Whatever I point a camera at. Mostly the Yellowstone trip so far." },
    },
    {
      tag: "Magic the Gathering",
      zh: { title: "万智牌", body: "主要玩 cEDH，偶尔写写套牌构筑和对局思路。" },
      en: { title: "Magic: The Gathering", body: "Mostly cEDH. Occasionally I write up a deck or a line of play." },
    },
  ],

  aboutSite: {
    founded: {
      zh: "本站成立于 2026 年 8 月 28 日。站内文章标注的日期，均为照片的拍摄日期或文章的创作日期，不一定是发布到这里的时间。",
      en: "This site was founded on 28 August 2026. The date shown on each post is when the photo was taken or the piece was written, not necessarily when it was published here.",
    },
    aboutSiteHeading: { zh: "关于这个站", en: "About this site" },
    aboutSite: {
      zh: '用 <a href="https://astro.build">Astro</a> 搭的静态站，写完 Markdown 推上去就自动部署。图片在构建时统一压成 AVIF/WebP。',
      en: 'A static site built with <a href="https://astro.build">Astro</a>. Write Markdown, push, and it deploys itself. Images are converted to AVIF/WebP at build time.',
    },
    /** 指向 /changelog 的入口 */
    changelogLink: { zh: "站点更新日志", en: "Site changelog" },
    changelogLinkNote: {
      zh: "这个站自己的改动记录，发文章不算在里面",
      en: "What changed about the site itself, not counting new posts",
    },
  },

  changelog: {
    title: { zh: "更新日志", en: "Changelog" },
    count: { zh: "{n} 次改动", en: "{n} entries" },
    lead: {
      zh: "这个站自己的更新记录：外观、功能、部署和图片处理上的改动。新发的文章不记在这里，那些在<a href=\"/archive\">归档</a>里。",
      en: "What changed about the site itself: look, features, deployment and image handling. New posts are not listed here, they live in the <a href=\"/archive\">archive</a>.",
    },
    back: { zh: "← 关于", en: "← About" },
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
    body:
      "The interface and all post titles are fully translated. " +
      "Only articles marked <strong>EN</strong> have a full English version. " +
      "Everything else is still in Chinese.",
    dismiss: "Got it",
  },

  search: {
    open: { zh: "搜索", en: "Search" },
    placeholder: { zh: "搜索文章、标签、正文…", en: "Search titles, tags, content…" },
    empty: { zh: "没有匹配的文章", en: "No matching posts" },
    hint: { zh: "输入关键词开始搜索", en: "Type to start searching" },
    countLabel: { zh: "{n} 条结果", en: "{n} results" },
    loading: { zh: "正在载入索引…", en: "Loading index…" },
    navHint: { zh: "选择", en: "to navigate" },
    openHint: { zh: "打开", en: "to open" },
    closeHint: { zh: "关闭", en: "to close" },
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
