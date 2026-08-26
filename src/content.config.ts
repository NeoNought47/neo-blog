import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      description: z.string().optional(),
      // 封面走 image()，Astro 会校验路径并在构建时优化
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
