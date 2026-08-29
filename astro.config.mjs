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
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
      wrap: true,
    },
  },
  image: {
    // 默认质量抬到 92，见 src/plugins/image-service.mjs
    service: { entrypoint: "./src/plugins/image-service.mjs" },
    // 84 张图全部本地优化成 webp/avif，构建时一次性完成
    responsiveStyles: true,
  },
});
