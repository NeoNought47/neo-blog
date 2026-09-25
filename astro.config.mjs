// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMark from "./src/plugins/remark-mark.mjs";

// 绑定自定义域名后把这里改掉，RSS 和 sitemap 的绝对链接都取自它。
// 注意 neo-blog.pages.dev 是别人的站，不要填那个。
export default defineConfig({
  site: "https://neo-blog.kaito-neyo.workers.dev",

  // 必须显式声明静态模式。Cloudflare 的构建环境会把项目当成服务端模式，
  // 结果 HTML 里留下 /_image?href=... 这种运行时图片接口地址，
  // 而纯静态部署没有这个接口，全站图片 404。
  output: "static",

  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMark],
    shikiConfig: {
      // 双主题：Shiki 只输出 --shiki-light / --shiki-dark 两套颜色变量，
      // 由 CSS 决定用哪套，背景则完全交给我们自己的玻璃样式
      // one-light 每种元素都有自己的颜色，比 github-light 显眼得多；
      // one-dark-pro 是它的深色搭档，两边风格一致
      themes: { light: "one-light", dark: "one-dark-pro" },
      defaultColor: false,
      wrap: true,
    },
  },
  image: {
    // 默认质量抬到 95，见 src/plugins/image-service.mjs
    service: { entrypoint: "./src/plugins/image-service.mjs" },
    // 全部图片本地优化成 webp，构建时一次性完成
    responsiveStyles: true,

    // 正文里的 ![](...) 自动出 srcset，浏览器按屏幕挑一档下载。
    // 组件里的 <Image> 都显式写了 layout="none"，不受这里影响。
    layout: "constrained",
    // 正文图最宽 880 CSS px：1x 屏取 880，3x 手机取 1320，2x 桌面取 1760。
    // 再往上就超过显示需要了，点开看大图时由灯箱单独加载原尺寸。
    breakpoints: [880, 1320, 1760],
  },
});
