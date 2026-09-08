import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";

/** 每篇正文进索引的上限。小迪 001 有两万多字，全塞进去索引会没必要地大 */
const MAX_BODY = 6000;

/** 把 Markdown 语法剥掉，只留可搜索的文字 */
function toPlain(md: string): string {
  return md
    // 图片整条去掉，路径没有搜索价值
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // 链接只留文字
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 围栏代码块保留内容，去掉围栏本身（命令和配置是要能搜到的）
    .replace(/```[^\n]*\n/g, " ")
    .replace(/```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(_context: APIContext) {
  const posts = await getPosts();

  const index = posts.map((p) => ({
    id: p.id,
    title: p.data.title,
    titleEn: p.data.titleEn ?? "",
    tags: p.data.tags,
    date: p.data.date.toISOString().slice(0, 10),
    body: toPlain(p.body ?? "").slice(0, MAX_BODY),
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
