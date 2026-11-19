---
title: "写了个脚本：查万智牌的外语版和签名卡"
titleEn: "A Script to Find Foreign-Language and Signed MTG Cards"
date: 2026-11-18
posted: 2026-11-18
tags: ["Magic the Gathering", "Trading Card Games"]
description: "输入一张牌的英文名，查出 TCGplayer、Card Kingdom 和 Cardmarket 上哪些版本有外语或签名卡在卖。"
descriptionEn: "Give it a card's English name and it finds which printings are sold in other languages, or signed, on TCGplayer, Card Kingdom and Cardmarket."
---

项目地址：[NeoNought47/mtg-foreign-signed-finder](https://github.com/NeoNought47/mtg-foreign-signed-finder)

一个 Python 命令行脚本。输入一张万智牌的英文名，它会去 **TCGplayer** 和 **Card Kingdom** 查这张牌的所有版本，告诉你哪些版本有外语（非英文）或者签名卡在卖，还能加上 **Cardmarket**。可以按语言、闪/平、签名过滤。

## 1. 为什么要写

在 TCGplayer 上找一张牌的外语版很麻烦。一张常见的牌往往有几十个版本，比如 Sol Ring 有 100 多个，语言筛选要在每个版本的页面里单独点。想知道「这张牌有没有法语闪在卖」，就得一个一个版本点进去看。

签名卡更难找。网站没有「签名」这个筛选项，签名卡都是卖家拍照上传的挂单，有没有签名只写在卖家自己的标题和描述里。

Card Kingdom 和 Cardmarket 又是两套完全不同的网站。所以干脆写个脚本，一条命令把几家都查一遍。

## 2. 怎么用

### 2.1 安装

需要 Python 3.8+ 和 `requests`：

```bash
pip install requests
git clone https://github.com/NeoNought47/mtg-foreign-signed-finder.git
cd mtg-foreign-signed-finder
```

有两个脚本，功能完全一样，只是输出语言不同：

| 脚本 | 输出 |
| --- | --- |
| `mtg-foreign-signed-finder.py` | 英文 |
| `mtg-foreign-signed-finder-zh.py` | 中文，`-l` 也能直接写 `法语` 这样的中文名 |

### 2.2 常用命令

```bash
# 两家网站所有外语版本
python3 mtg-foreign-signed-finder-zh.py "Lightning Bolt"

# 只看法语闪
python3 mtg-foreign-signed-finder-zh.py "Simic Signet" -l 法语 --foil

# 法语、德语或日语
python3 mtg-foreign-signed-finder-zh.py "Sol Ring" -l fr,de,jp

# 任何语言的签名卡
python3 mtg-foreign-signed-finder-zh.py "Lightning Bolt" --signed

# 加上 Cardmarket
python3 mtg-foreign-signed-finder-zh.py "Demonic Tutor" --signed --cardmarket
```

### 2.3 实际输出

查 Sol Ring 的日文版，只查 TCGplayer 的前 6 个版本：

```text
$ python3 mtg-foreign-signed-finder-zh.py "Sol Ring" -l 日语 --site tcg --max-products 6
正在 TCGplayer 上找日语的 Sol Ring...
=== TCGplayer：找到 6 个匹配的版本，逐个查挂单 ===

[Universes Beyond: Fallout] Sol Ring
  https://www.tcgplayer.com/product/539393
    JP 日语         闪    2 条挂单 / 共  12 张   最低 $5.00

TCGplayer 小结：6 个版本里，1 个有符合条件的挂单。
```

每个有货的版本会列出系列、商品链接，以及每种语言和闪/平的挂单数、总张数和最低价。

## 3. 主要功能

### 3.1 牌名匹配

- 用牌的英文名，精确匹配，不分大小写。
- 括号里的版本说明会被忽略，`Lightning Bolt (Borderless)` 也算 `Lightning Bolt`。
- 双面牌用正面的名字，分体牌输入任意一半都行，比如 `Fire` 能找到 `Fire // Ice`。
- `--fuzzy` 放宽成「名字里包含输入内容」。

### 3.2 语言过滤

- `-l` 指定一种或多种语言，多种语言是「其中之一」。
- 代码、别名、英文全名都能写，中文版还能写中文名：`-l 法语、德语，日语`。
- 不加 `-l` 时查除英语以外的所有语言。
- 支持 12 种语言，包括简中、繁中和 Phyrexian 语。

### 3.3 闪/平和签名

- `--foil` 只看闪，`--nonfoil` 只看平。
- `--signed` 只看签名卡，这时默认包含英文在内的所有语言。`--unsigned` 排除签名卡。
- 签名是从 TCGplayer 卖家的标题和描述里认出来的。`Signed`、`Artist signed`、`Autographed`、`Artist Proof` 这类写法会算进去。*Signature Spellbook* 系列、`Signature Foil`、`not signed`，还有寄件用的 `signature confirmation` 这类长得像但不是签名的词会被排除。
- 用 `--signed` 时每张签名卡单独一行，显示语言、价格、品相、卖家和卖家写的标题。

### 3.4 Cardmarket（可选）

默认不查 Cardmarket，要加 `--cardmarket` 或 `--site cm`。它能做的事和另外两家不一样，原因见下一节。

## 4. 原理

### 4.1 TCGplayer：网页用的内部接口

脚本调用的是 TCGplayer 网页前端自己用的接口：

1. 搜索牌名，只保留名字完全匹配的版本
2. 对每个版本，按语言、闪/平去查挂单
3. 开了 `--signed` 时，再读每条挂单的标题和描述，判断是不是签名卡

版本多的牌要跑几分钟，可以用 `--max-products` 限制查几个版本。请求之间默认停 0.7 秒，遇到限流或服务器错误（429、5xx）会自动重试，最多 3 次。

### 4.2 Card Kingdom：全量价格表

Card Kingdom 有一份公开的全量价格表。脚本第一次运行时把它下载下来，缓存在 `~/.cache/mtg-foreign-signed-finder/`，默认 12 小时内不重复下载。

麻烦在于这份表没有语言字段，而且 Card Kingdom 基本只卖英文卡。所以脚本是从版本描述和系列名里认语言的，只能找到它单独列成一个版本的外语卡，比如 WAR 的日文异画鹏洛客、Phyrexian 语版本。查不到通常就是真的没有。Card Kingdom 也不卖签名卡，用 `--signed` 时会直接跳过。

### 4.3 Cardmarket：只能给链接

Cardmarket 的网站有 Cloudflare 反爬，API 又需要审核过的卖家账号，所以脚本读不到它的挂单。退而求其次，它做三件事：

1. 从 Cardmarket 公开的商品目录里找出这张牌的所有版本，系列名从 [Scryfall](https://scryfall.com) 对上
2. 显示每个版本的价格指导（最低价和趋势价）。这是所有语言合在一起的价格
3. 给每个版本生成一个已经带好筛选条件的链接，包括语言、闪/平、签名，在浏览器里打开就能看到符合条件的挂单

## 5. 限制

- TCGplayer 用的是没有公开的接口，它一改，脚本就可能失效。这时可以用 `--debug` 看接口返回了什么。
- 签名卡只能靠卖家自己写。卖家没提签名的话，脚本认不出来。
- Card Kingdom 只能查到单独列出来的外语版本。
- Cardmarket 看不到有没有货，只能给价格指导和链接。
