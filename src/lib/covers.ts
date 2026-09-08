import type { ImageMetadata } from "astro";
import type { Post } from "./posts";

/**
 * 文章封面。
 *
 * frontmatter 里写了 cover 就用它；没写就取正文里第一张图。
 * 这样列表页不用每篇都手动指定封面，也不会因为漏写就少一张图。
 *
 * import.meta.glob 是构建期展开的，所以这些图仍然会走 Astro 的优化管线。
 */
const assets = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/posts/**/*.{jpg,jpeg,png,webp,gif,avif}",
);

/** 正文里的相对路径形如 ../../assets/posts/<slug>/x.jpg，转成 glob 的绝对键 */
function toAssetKey(rel: string): string {
  return "/src/" + rel.replace(/^(\.\.\/)+/, "");
}

export async function getCover(post: Post): Promise<ImageMetadata | undefined> {
  if (post.data.cover) return post.data.cover;

  const m = post.body?.match(/!\[[^\]]*\]\((\.\.\/[^)]+)\)/);
  if (!m) return undefined;

  const loader = assets[toAssetKey(m[1].trim())];
  if (!loader) return undefined;
  return (await loader()).default;
}

/** 首页侧栏的统计数字 */
export function countImages(): number {
  return Object.keys(assets).length;
}
