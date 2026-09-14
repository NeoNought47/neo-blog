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
    date: "2026-09-15",
    kind: "feature",
    zh: {
      title: "整篇文章可以出中英两版",
      items: [
        "以前只有图注这种短句能做中英对照，长文没法整篇翻。现在正文外面套一层语言块就行，块里照常写 Markdown，切换语言时整篇换掉。",
        "有英文版的文章，正文顶上自动出现一句提示，告诉你可以切到另一种语言，中英各提示对方那版。",
      ],
    },
    en: {
      title: "Whole posts can now run in two languages",
      items: [
        "Only short things like photo captions could be bilingual before. A post body can now be wrapped in a language block, with normal Markdown inside, and the whole thing swaps when you change language.",
        "Posts that have a translation get an automatic line at the top of the body pointing at the other version.",
      ],
    },
  },
  {
    date: "2026-09-15",
    kind: "feature",
    zh: {
      title: "正文可以插旁注浮窗",
      items: [
        "正文里点一个带虚线的词，跳出一个毛玻璃浮窗放补充内容，看完按 Esc 或点旁边就关掉，不用离开文章。适合放那种展开写会打断主线、但又不想砍掉的背景材料。",
        "旁注的正文其实一直在页面 DOM 里，只是平时藏着，所以站内搜索照样能搜到里面的内容。",
      ],
    },
    en: {
      title: "Side notes in a popover",
      items: [
        "Clicking a dashed term in a post opens a frosted-glass panel with supplementary material. Press Escape or click outside to dismiss it without leaving the article. Good for background that would derail the main thread but is worth keeping.",
        "The note text stays in the page DOM and is only hidden visually, so site search still finds what is inside it.",
      ],
    },
  },
  {
    date: "2026-09-15",
    kind: "look",
    zh: {
      title: "竖构图的照片不再高过一屏",
      items: [
        "正文图加了 82vh 的高度上限。之前竖图按栏宽算出来有 1059px 高，比屏幕还高，一张照片要滚两下才过得去。",
        "横图本来就不到这个高度，看起来没有变化。只会缩小不会放大，和原来「该多大就多大」的规矩不冲突。",
        "终结者那篇从 16 屏缩到 12 屏。",
      ],
    },
    en: {
      title: "Portrait photos now fit on one screen",
      items: [
        "Body images are capped at 82vh. A portrait photo at full column width came out 1059px tall, taller than the window, so you could never see one whole photo at once.",
        "Landscape photos were already shorter than that and look unchanged. The cap only shrinks, never enlarges, so it does not conflict with the no-upscaling rule.",
        "The Terminator post went from 16 screens down to 12.",
      ],
    },
  },
  {
    date: "2026-09-14",
    kind: "look",
    zh: {
      title: "没有封面的文章垫一张图",
      items: [
        "首页方格和侧栏里没有配图的文章，以前只放一行标签文字，现在按标签垫一张图。目前 Cybersecurity 和 Linux 两类有。",
        "填充图的白底在导入前抠掉了，透明背景，深浅两套主题都能直接用。",
      ],
    },
    en: {
      title: "Artwork for posts without a cover",
      items: [
        "Posts with no image used to show just a line of tag text in the homepage tiles and the sidebar. They now fall back to per-tag artwork, currently for Cybersecurity and Linux.",
        "The white backgrounds were keyed out before import, so the transparent artwork works in both light and dark themes.",
      ],
    },
  },
  {
    date: "2026-09-14",
    kind: "image",
    zh: {
      title: "正文图片按屏幕挑尺寸",
      items: [
        "每张正文图现在出 880、1320、1760 和原尺寸四档，浏览器按自己的屏幕挑一档下载，不再是所有人都下最大的那张。",
        "图多的文章流量降了一半以上，铁血那篇滚动浏览从 36MB 降到 14.4MB，手机上单张从 5.2MB 降到 0.46MB。",
        "屏幕上的显示尺寸和清晰度都没变，点开看大图仍然加载原尺寸。",
      ],
    },
    en: {
      title: "Body images sized to the screen",
      items: [
        "Each body image now ships in four sizes (880, 1320, 1760 and full). The browser picks one that fits its screen instead of everyone downloading the largest.",
        "Image-heavy posts dropped by more than half. Scrolling the Predator post went from 36MB to 14.4MB, and a single image on a phone from 5.2MB to 0.46MB.",
        "On-screen size and sharpness are unchanged, and the lightbox still loads the full-resolution file.",
      ],
    },
  },
  {
    date: "2026-09-11",
    kind: "feature",
    zh: {
      title: "加了这个更新日志",
      items: [
        "就是你正在看的这一页。只记这个站本身的改动，发文章不算，那些在归档里。",
        "入口在关于页「关于这个站」下面。",
      ],
    },
    en: {
      title: "Added this changelog",
      items: [
        "The page you are reading. It only tracks changes to the site itself. New posts are not listed here, they live in the archive.",
        "Linked from the about page under About this site.",
      ],
    },
  },
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
