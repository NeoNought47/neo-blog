# Neo's Blog

Astro 静态博客。写 Markdown、放图片、推上去，就完事了。

## 日常操作

```bash
npm run dev
```

开发服务器在 http://localhost:4321，改完文件自动刷新。**草稿只在 dev 下可见。**

### 写一篇新文章

```bash
npm run new "文章标题"
```

会生成两样东西：

- `src/content/posts/<slug>.md` — 正文
- `src/assets/posts/<slug>/` — 这篇文章的图片目录

图片丢进那个目录，在正文里这样引用：

```markdown
![说明文字](../../assets/posts/<slug>/图片名.jpg)
```

写完把 frontmatter 里的 `draft: true` 删掉，就会出现在正式站上。

### frontmatter 字段

```yaml
---
title: "标题"           # 必填
date: 2026-08-26        # 必填
tags: ["标签A", "标签B"] # 可选，自动生成标签页
description: "摘要"      # 可选，用于 SEO 和 RSS
cover: ../../assets/posts/<slug>/封面.jpg  # 可选，首页卡片和文章头图
draft: true             # 可选，true 则不发布
---
```

## 目录结构

```
src/
├── content/posts/     # 文章 Markdown，一篇一个文件
├── assets/posts/      # 文章图片，按文章 slug 分目录
├── styles/global.css  # 全站设计系统（颜色/字体/间距都在这里）
├── consts.ts          # 站点标题、导航、首页大标题
├── lib/posts.ts       # 取文章、算阅读时长、统计标签
├── components/        # PostCard
├── layouts/Base.astro # 母版：导航、页脚、主题切换、灯箱、进度条
└── pages/             # 路由（文件即路由）
```

## 想改外观

几乎所有视觉都由 `src/styles/global.css` 顶部的 CSS 变量控制，改那里就够了：

- `--accent` / `--accent-2` — 主强调色（青绿 + 靛紫），渐变标题、hover 光晕都取自这两个
- `--bg` — 页面底色
- `--measure` — 正文行宽，默认 68ch
- `--radius` / `--radius-lg` — 圆角

亮色模式是同一套变量的另一组取值，在 `:root[data-theme="light"]` 里。

首页大标题改 `src/consts.ts` 的 `heroTitle`，`<em>` 包住的部分会被渐变高亮。

## 外观还原点

每套满意的外观都会打一个 `design/*` 标签。想推倒重做又怕回不来时，先看这里。

```bash
git tag -n5 -l "design/*"
```

当前有：

| 标签 | 色调 | 亮色光晕 | favicon |
|---|---|---|---|
| `design/retro-diner-v2` | 奶油纸 + 砖红（**当前线上**） | 有 | 握寿司，深色底 |
| `design/retro-diner-v1` | 奶油纸 + 砖红 | 无 | 握寿司，奶油底（16px 下辨识差） |
| `design/frutiger-aero-v1` | 草绿/水青/天蓝 | 无 | N 字母 |

三套的玻璃结构完全一样，差别只在颜色变量和 favicon，所以互相切换很安全。

想直接看某个标签存了什么，不用切分支：

```bash
git show design/retro-diner-v1:public/favicon.svg
```

### 只想看看当时长什么样

```bash
git stash && git checkout design/frutiger-aero-v1 && npm run dev
```

看完回到最新：`git checkout main && git stash pop`

### 确定要还原

只还原外观、保留之后写的所有文章：

```bash
git checkout design/frutiger-aero-v1 -- src/styles/global.css src/consts.ts src/layouts/Base.astro
```

改完记得 `npm run build` 跑一遍再提交 —— 如果期间改过组件结构，光还原样式可能对不上。

### 存下新的一套

```bash
git tag -a design/<名字> -m "描述"
git push origin design/<名字>
```

## 部署

静态站，`npm run build` 产出 `dist/`，扔哪都能跑。

**Cloudflare Pages（推荐，国内访问相对稳）**

1. 把仓库推到 GitHub
2. Cloudflare Dashboard → Workers & Pages → 连接仓库
3. 构建命令 `npm run build`，输出目录 `dist`

**Vercel** 同理，它会自动认出 Astro，零配置。

部署完记得把 `astro.config.mjs` 里的 `site` 改成真实域名 —— RSS 和 sitemap 的绝对链接靠它。

## 说明

- 没有评论功能，刻意的
- 没有任何追踪脚本
- 图片在构建时统一压成 WebP 并生成多档尺寸，源图放心用原始大小
- 从旧的 Flask 博客迁移而来，11 篇文章、66 张图
