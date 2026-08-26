// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// 绑定自定义域名后把这里改掉，RSS 和 sitemap 的绝对链接都取自它。
// 注意 neo-blog.pages.dev 是别人的站，不要填那个。
export default defineConfig({
  site: "https://neo-blog.kaito-neyo.workers.dev",
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
