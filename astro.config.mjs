// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// 绑定自定义域名后把这里改掉，RSS 和 sitemap 的绝对链接都取自它
export default defineConfig({
  site: "https://neo-blog.pages.dev",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      wrap: true,
    },
  },
  image: {
    // 84 张图全部本地优化成 webp/avif，构建时一次性完成
    responsiveStyles: true,
  },
});
