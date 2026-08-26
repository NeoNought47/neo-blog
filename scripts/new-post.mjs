#!/usr/bin/env node
// 新建一篇文章：npm run new "文章标题"
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('用法: npm run new "文章标题"');
  process.exit(1);
}

// 中文标题没法直接做 slug，退化成日期 + 序号，之后可以手动改文件名
const slug =
  title
    .toLowerCase()
    .replace(/[^\w一-龥\s-]/g, "")
    .replace(/[一-龥]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `post-${Date.now().toString(36)}`;

const date = new Date().toISOString().slice(0, 10);
const postPath = join("src/content/posts", `${slug}.md`);
const assetDir = join("src/assets/posts", slug);

if (existsSync(postPath)) {
  console.error(`已存在：${postPath}`);
  process.exit(1);
}

mkdirSync(assetDir, { recursive: true });
writeFileSync(
  postPath,
  `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
tags: []
draft: true
---

正文从这里开始。

图片放进 ${assetDir}/ 然后这样引用：

![说明文字](../../assets/posts/${slug}/图片名.jpg)
`,
);

console.log(`✓ 文章  ${postPath}`);
console.log(`✓ 图片目录 ${assetDir}/`);
console.log(`\n写完后把 frontmatter 里的 draft: true 删掉就会发布。`);
