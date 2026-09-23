#!/usr/bin/env node
/**
 * 把一篇 Obsidian 笔记导入成网站文章。
 *
 *   npm run import-obsidian -- <笔记.md> <slug> [--date 2026-09-21] [--posted 2026-09-23] [--force]
 *
 * 做的事：
 *   1. 笔记正文复制到 src/content/posts/<slug>.md
 *   2. 笔记里 ![[xxx.png]] 引用的图片复制到 src/assets/posts/<slug>/
 *      （先找笔记所在目录，找不到再在整个 vault 里按文件名找，和 Obsidian 的解析方式一致）
 *   3. ![[xxx.png]] 改写成 ![](../../assets/posts/<slug>/xxx.png)
 *   4. 顶部加 frontmatter 和课程来源说明
 *
 * 只动格式，不改正文内容。文件名里的空格换成 -，否则 Markdown 链接会断。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--force") flags.force = true;
  else if (a === "--date" || a === "--posted") flags[a.slice(2)] = args[++i];
  else positional.push(a);
}

const [notePathRaw, slug] = positional;
if (!notePathRaw || !slug) {
  console.error(
    '用法: npm run import-obsidian -- "<笔记.md>" <slug> [--date YYYY-MM-DD] [--posted YYYY-MM-DD] [--force]',
  );
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`slug 只能是小写字母、数字和 -：${slug}`);
  process.exit(1);
}
for (const k of ["date", "posted"]) {
  if (flags[k] && !/^\d{4}-\d{2}-\d{2}$/.test(flags[k])) {
    console.error(`--${k} 格式应为 YYYY-MM-DD：${flags[k]}`);
    process.exit(1);
  }
}

const notePath = path.resolve(notePathRaw.replace(/^~(?=\/|$)/, os.homedir()));
if (!fs.existsSync(notePath)) {
  console.error(`找不到笔记：${notePath}`);
  process.exit(1);
}

const postPath = path.join("src/content/posts", `${slug}.md`);
const assetDir = path.join("src/assets/posts", slug);
if (fs.existsSync(postPath) && !flags.force) {
  console.error(`已存在：${postPath}（确认要覆盖就加 --force）`);
  process.exit(1);
}

// ---------- 找图片 ----------

const noteDir = path.dirname(notePath);

// 往上找 .obsidian 目录确定 vault 根，找不到就只在笔记目录里找
function findVaultRoot(dir) {
  for (let d = dir; ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, ".obsidian"))) return d;
    if (path.dirname(d) === d) return null;
  }
}
const vaultRoot = findVaultRoot(noteDir);

let vaultIndex = null;
function indexVault() {
  vaultIndex = new Map();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (!vaultIndex.has(e.name)) vaultIndex.set(e.name, p);
    }
  };
  walk(vaultRoot);
}

function resolveImage(ref) {
  const direct = path.join(noteDir, ref);
  if (fs.existsSync(direct)) return direct;
  if (!vaultRoot) return null;
  const inVault = path.join(vaultRoot, ref);
  if (fs.existsSync(inVault)) return inVault;
  if (!vaultIndex) indexVault();
  return vaultIndex.get(path.basename(ref)) ?? null;
}

// ---------- 改写正文 ----------

let body = fs.readFileSync(notePath, "utf8").replace(/\r\n/g, "\n");

// 笔记自己带的 frontmatter（Obsidian 属性）去掉，由脚本重新生成
body = body.replace(/^---\n[\s\S]*?\n---\n/, "");

const copied = new Map(); // 原引用 -> 网站里的文件名
const missing = [];

// ![[1.png]]、![[1.png|300]]、![[sub/1.png|说明]]
body = body.replace(/!\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (m, ref, alias) => {
  ref = ref.trim();
  if (!IMAGE_EXT.test(ref)) return m; // 嵌入的是笔记不是图片，原样保留

  let name = copied.get(ref);
  if (!name) {
    const src = resolveImage(ref);
    if (!src) {
      missing.push(ref);
      return m;
    }
    name = path.basename(ref).replace(/\s+/g, "-");
    fs.mkdirSync(assetDir, { recursive: true });
    fs.copyFileSync(src, path.join(assetDir, name));
    copied.set(ref, name);
  }
  // |300 这种是 Obsidian 的宽度，不是说明文字
  const alt = alias && !/^\d+(x\d+)?$/.test(alias.trim()) ? alias.trim() : "";
  return `![${alt}](../../assets/posts/${slug}/${name})`;
});

// ---------- 标题 ----------

// 「小迪安全 008-基础入门-算法分析&传输加密」→「小迪安全 008：基础入门 - 算法分析、传输加密」
const rawTitle = path.basename(notePath, ".md");
let title = rawTitle;
let num = null;
const m = rawTitle.match(/^小迪安全\s*(\d+)\s*[-：:]\s*(.+)$/);
if (m) {
  num = m[1];
  title = `小迪安全 ${num}：${m[2]
    .split(/\s*-\s*/)
    .map((s) => s.split(/\s*&\s*/).join("、"))
    .join(" - ")}`;
}
const titleEn = num ? `XiaoDi Security ${num}: TODO` : "TODO";

// ---------- 写出 ----------

const date = flags.date ?? new Date().toISOString().slice(0, 10);
const q = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

const front = [
  "---",
  `title: ${q(title)}`,
  `titleEn: ${q(titleEn)}`,
  `date: ${date}`,
  ...(flags.posted ? [`posted: ${flags.posted}`] : []),
  `tags: ["Cybersecurity", "Learning Notes"]`,
  "---",
  "",
  `<span class="post-note"><span class="i18n" data-lang="zh">课程为小迪安全官方 2024 年上传，本文为个人学习笔记。</span><span class="i18n" data-lang="en">Course published by XiaoDi Security in 2024. These are my personal study notes.</span></span>`,
  "",
  "",
].join("\n");

fs.mkdirSync(path.dirname(postPath), { recursive: true });
fs.writeFileSync(postPath, front + body.replace(/^\n+/, ""));

console.log(`✓ 文章   ${postPath}`);
console.log(`✓ 图片   ${copied.size} 张 → ${assetDir}/`);
for (const [ref, name] of copied) {
  console.log(`         ${ref}${ref === name ? "" : `  →  ${name}`}`);
}
if (missing.length) {
  console.log(`\n⚠ 这些图片没找到，引用原样保留了，记得手动处理：`);
  for (const r of missing) console.log(`         ${r}`);
}
console.log(`\n标题：${title}`);
console.log(`还要做：把 titleEn 里的 TODO 换成英文标题，检查一遍后 git push。`);
