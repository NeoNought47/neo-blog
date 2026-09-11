import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** 已发布的文章，按日期倒序。草稿只在 dev 下可见。 */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection("posts");
  return all
    .filter((p) => import.meta.env.DEV || !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 写作日期。没标 posted 的老文章就按显示日期算 */
export function postedAt(p: Post): Date {
  return p.data.posted ?? p.data.date;
}

/** 「最近更新」用的顺序：按什么时候写的排，不是按文章标的日期排 */
export async function getRecent(n: number): Promise<Post[]> {
  const all = await getPosts();
  return [...all]
    .sort((a, b) => postedAt(b).getTime() - postedAt(a).getTime())
    .slice(0, n);
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 按中文 ~350 字/分钟、英文 ~220 词/分钟粗估阅读时长 */
export function readingTime(body: string): number {
  const cjk = (body.match(/[一-龥]/g) ?? []).length;
  const words = body.replace(/[一-龥]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 350 + words / 220));
}

export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
