import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** 英文标题。留空则英文界面下回退显示中文标题 */
      titleEn: z.string().optional(),
      /** 对外显示的日期：照片的拍摄日期，或者内容本身发生的日期 */
      date: z.coerce.date(),
      /**
       * 真正动笔写这篇的日期。只在内部用，页面上任何地方都不显示，
       * 唯一的用途是给首页侧栏的「最近更新」排序。
       * 不填就回退到 date。
       */
      posted: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      description: z.string().optional(),
      descriptionEn: z.string().optional(),
      /** 正文是否有英文版。true 时列表页会打一个 EN 标记 */
      hasEnglish: z.boolean().default(false),
      // 封面走 image()，Astro 会校验路径并在构建时优化
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
