// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// 部署到自己的域名后改这里，RSS 和 sitemap 会跟着走
export default defineConfig({
  site: "https://neoblog.pages.dev",
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
