/**
 * 站点本身的更新日志。只记技术和外观上的改动，发文章不算。
 * 新的一条加在数组最前面，页面直接按这个顺序渲染。
 */

export type LogKind = "infra" | "look" | "feature" | "image";

export interface LogEntry {
  /** YYYY-MM-DD */
  date: string;
  kind: LogKind;
  zh: { title: string; items: string[] };
  en: { title: string; items: string[] };
}

export const KIND_LABEL: Record<LogKind, { zh: string; en: string }> = {
  infra: { zh: "部署", en: "Infra" },
  look: { zh: "外观", en: "Look" },
  feature: { zh: "功能", en: "Feature" },
  image: { zh: "图片", en: "Images" },
};

export const CHANGELOG: LogEntry[] = [
  {
    date: "2026-09-11",
    kind: "feature",
    zh: {
      title: "一篇文章记两个日期",
      items: [
        "加了个内部字段 posted，只记真正动笔写的日期，页面上任何地方都不显示。",
        "文章标注的日期继续是照片的拍摄日期，首页侧栏的「最近更新」改成按 posted 排，所以一篇写于今天、拍于上个月的文章会排在最前面，但显示的还是上个月。",
      ],
    },
    en: {
      title: "Two dates per post",
      items: [
        "Added an internal posted field that records when a post was actually written. It never appears on the page.",
        "The date shown on a post is still when the photo was taken. Recent in the homepage sidebar now sorts by posted, so something written today about last month's purchase sits at the top while still showing last month's date.",
      ],
    },
  },
  {
    date: "2026-09-10",
    kind: "look",
    zh: {
      title: "重写关于页",
      items: [
        "改成左右两栏，左边放头像、统计和运行日期。",
        "运行天数在浏览器里现算，不重新部署也会跟着往上涨。",
        "导航栏的站名点回首页，正文里的 Neo 链接加上悬浮变色。",
      ],
    },
    en: {
      title: "Rewrote the about page",
      items: [
        "Split into two columns, with the avatar, counters and timeline on the left.",
        "The running day count is computed in the browser, so it keeps climbing without a redeploy.",
        "The site name in the nav goes back to the homepage, and the Neo links now change colour on hover.",
      ],
    },
  },
  {
    date: "2026-09-08",
    kind: "feature",
    zh: {
      title: "首页重做，加搜索",
      items: [
        "首页换成侧栏加横向文章行的布局，靠后的文章压成方格，页面不会拉得太长。",
        "列表页的封面没写的话，自动取正文里第一张图。",
        "加了全站搜索，索引在构建时生成，标题、标签和正文都能搜，支持键盘上下选择和回车打开。",
      ],
    },
    en: {
      title: "New homepage, plus search",
      items: [
        "The homepage is now a sidebar next to wide post rows, with older posts collapsed into tiles so the page stays short.",
        "When a post has no cover, the first image in its body is used instead.",
        "Added site-wide search. The index is built at deploy time and covers titles, tags and body text, with arrow keys and enter to navigate.",
      ],
    },
  },
  {
    date: "2026-09-07",
    kind: "image",
    zh: {
      title: "HEIC 转换脚本",
      items: [
        "写了个脚本把相机和手机拍的 HEIC 转成无损 WebP，分辨率保持原样，一个像素都不缩。",
        "修掉了转换过程里 EXIF 方向丢失、照片躺倒的问题。",
      ],
    },
    en: {
      title: "HEIC conversion script",
      items: [
        "A script that converts HEIC files from the camera and phone into lossless WebP at their original resolution, with no downscaling.",
        "Fixed photos coming out sideways because EXIF orientation was lost during conversion.",
      ],
    },
  },
  {
    date: "2026-09-06",
    kind: "feature",
    zh: {
      title: "界面双语",
      items: [
        "导航栏加了 中 | EN 切换，界面文案和所有文章标题都有英文版。",
        "有英文正文的文章打上 EN 标记，切到英文时弹窗说明翻译覆盖到哪一步。",
      ],
    },
    en: {
      title: "Bilingual interface",
      items: [
        "A 中 | EN switch in the nav. Every interface string and every post title has an English version.",
        "Posts with a full English body carry an EN badge, and switching to English explains how far the translation goes.",
      ],
    },
  },
  {
    date: "2026-08-30",
    kind: "image",
    zh: {
      title: "图片按真实像素显示",
      items: [
        "正文图不再强制拉满容器宽度。小图就按自己的尺寸显示，绝不放大，不会糊。",
        "构建时的压缩质量提到 95，最大边放宽到 3840，点开可以看大图。",
      ],
    },
    en: {
      title: "Images render at their real size",
      items: [
        "Body images no longer stretch to fill the column. A small image stays small rather than being upscaled into mush.",
        "Build-time quality raised to 95 and the long edge cap raised to 3840, so the lightbox has something to show.",
      ],
    },
  },
  {
    date: "2026-08-29",
    kind: "look",
    zh: {
      title: "代码块跟着主题走",
      items: [
        "代码块改成毛玻璃，深浅两套配色可以单独切换，不跟页面主题绑死。",
        "正文支持 Obsidian 的 ==高亮== 写法。",
      ],
    },
    en: {
      title: "Themed code blocks",
      items: [
        "Code blocks are frosted glass now, and their light or dark syntax colours can be switched independently of the page theme.",
        "Body text supports Obsidian's ==highlight== syntax.",
      ],
    },
  },
  {
    date: "2026-08-27",
    kind: "look",
    zh: {
      title: "定下现在这套外观",
      items: [
        "站名改成 Neo's Buffet Infinity，配上握寿司 favicon 和一套餐厅信息。",
        "外观试过一版 Frutiger Aero，最后定在现在这套复古暖色板。",
      ],
    },
    en: {
      title: "Settled on the current look",
      items: [
        "Renamed to Neo's Buffet Infinity, with a nigiri favicon and a set of restaurant details to match.",
        "Tried a Frutiger Aero pass first, then settled on the retro warm palette that is here now.",
      ],
    },
  },
  {
    date: "2026-08-26",
    kind: "infra",
    zh: {
      title: "建站，从 Flask 搬到 Astro",
      items: [
        "旧站是用 Flask 手写的，每篇文章一个路由。文章和图片全部迁到 Astro，一篇都没丢。",
        "部署到 Cloudflare，推代码就自动构建上线。",
        "修掉线上图片全部 404 的问题，原因是构建跑成了服务端模式而不是静态站。",
        "旧笔记里的真实 IP 和密码换成了文档用的占位值。",
      ],
    },
    en: {
      title: "Built the site, moved off Flask",
      items: [
        "The old site was hand-written in Flask, one route per post. Every post and image was migrated to Astro with nothing lost.",
        "Deployed on Cloudflare. Pushing code builds and ships it.",
        "Fixed every image 404ing in production. The build was running in server mode instead of producing a static site.",
        "Real IPs and passwords in the old notes were replaced with documentation placeholders.",
      ],
    },
  },
];
