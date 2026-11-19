---
title: "xiaodisec 014：信息打点 - JS架构、框架识别、泄漏提取、API接口枚举、FUZZ爬虫、插件项目"
titleEn: "XiaoDi Security 014: Recon - JS Architecture, Framework Detection, Leak Extraction, API Enumeration, Fuzzing & Crawlers, Plugins and Tools"
date: 2026-11-14
posted: 2026-11-14
tags: ["Cybersecurity", "Learning Notes"]
---

<span class="post-note"><span class="i18n" data-lang="zh">课程为小迪安全官方 2024 年上传，本文为个人学习笔记。</span><span class="i18n" data-lang="en">Course published by XiaoDi Security in 2024. These are my personal study notes.</span></span>

「==打点==」是网络安全中的口语，指**收集、识别并标记有价值的信息或潜在突破口**，接近「信息收集」和「侦察」。

**演示案例**

- JS 前端架构：手工搜索分析
- JS 前端架构：半自动 Burp 分析
- JS 前端架构：自动化项目分析

## 0. 基础概念

> **为什么要学**：后面分析 JS 的所有方法都建立在这些概念上。先弄清前后端的区别和 JS 能暴露什么，才知道为什么 JS 值得花时间去看。

### 0.1 CMS

> **为什么要学**：大量网站都是用现成的 CMS 搭的，认出是哪个 CMS 就能查它的历史漏洞和默认路径，这是指纹识别和找源码的基础。

==CMS== 是 **Content Management System** 的缩写，中文叫**内容管理系统**。它让用户不必从零写代码，也能通过后台发布和管理网站内容，比如发布、编辑文章，上传图片和文件。WordPress、Z-Blog 都是 CMS。

### 0.2 前端和后端：为什么 JS 能看到源码

> **为什么要学**：前端代码要发到浏览器里运行，所以任何人都能看到。理解这一点，就明白为什么 JS 是信息收集里成本最低、收获可能最大的一块。

- **后端语言**：PHP、Java、Python、.NET，浏览器端看不到真实的源代码
- **前端语言**：JavaScript（JS）和 JS 框架，浏览器端能看到真实的源代码

PHP 开发的网站看不到源代码，JS 能看到，F12 就能直接看。

### 0.3 什么是 JS 渗透测试

> **为什么要学**：JS 应用相当于自带源码，接口地址、参数和校验逻辑都写在里面。从 JS 入手，能找到页面上看不到的测试点，比盲目测试高效得多。

JavaScript 中也存在变量和函数，当存在可控变量及函数调用时，就可能产生漏洞。

JS 开发的 Web 应用和 PHP、Java、.NET 的区别在于：即使没有源代码，也可以通过浏览器查看源代码，获取真实的测试点，比如获取 URL、获取 JS 敏感信息、获取代码传参等。所以 JS 开发的 Web 应用相当于**白盒测试**（默认有源码参考）。

==一般会在 JS 中寻找更多的 URL 地址（接口地址）==，再针对 JS 代码逻辑（加密算法、API key 配置、验证逻辑等）进行后期安全测试。

**接口地址（API URL）**是前端与服务器交换数据时请求的网络地址。例如登录时，网页中的 JS 可能向下面的地址发送账号和密码：

```text
https://example.com/api/login
```

### 0.4 JS 安全问题

> **为什么要学**：知道 JS 里通常会泄露哪几类东西，分析时就有明确目标，不会只看个热闹。开发者也能据此检查自己的前端有没有带出不该带的信息。

- **源码泄漏**
- **未授权访问**：从 JS 里分析出更多的 URL，访问并确定接口路径
- **敏感 key 泄漏**：JS 文件中可能配置了接口信息（云应用、短信、邮件、数据库等）
- **API 接口安全**：代码中加载、提交的参数传递，以及更多的 URL 路径

### 0.5 流行的 JS 框架

> **为什么要学**：不同框架的打包方式、路由写法和文件结构不一样，认出框架才知道接口和路由大概藏在哪里，也方便查框架本身的已知问题。

Vue、Node.js、jQuery、Angular 等。

### 0.6 如何判定是 JS 开发的应用

> **为什么要学**：先判断目标是不是以 JS 为主的应用，再决定要不要把精力放在 JS 分析上，避免方向选错白费功夫。

- 插件：Wappalyzer
- 源程序代码简短
- 引入多个 `.js` 文件
- 一般有 `/static/js/app.js` 这类按顺序命名的 JS 文件
- Cookie 中一般有 `connect.sid`

### 0.7 如何获取更多的 JS 文件

> **为什么要学**：页面直接加载的 JS 往往只是一部分，按需加载或没被引用的 JS 里可能藏着后台接口。收集得越全，能发现的测试点越多。

三种方式，对应下面三章：

1. **手工**：浏览器搜索
2. **半自动**：Burp Suite 插件
3. **工具化**：各类提取及 FUZZ 项目

## 1. 手工：F12 搜索 JS

> **为什么要学**：手工看 JS 不依赖任何工具，是理解自动化工具在做什么的基础。工具漏掉或误报的地方，最后也要靠人工确认。

用 F12 查看 JS 源代码。==主要目的之一是从前端 JS 中找到接口、链接地址和隐藏路径==，但不只是找地址，也要从中获取其他有用信息。

在 JS 内容中搜索这些关键字，找连接地址和路径：

```text
src=
path=
method:"get"
http.get("
method:"post"
http.post("
$.ajax
http://service.httppost
http://service.httpget
```

## 2. 半自动：Burp Suite

> **为什么要学**：Burp 本来就是抓包测试的主力工具，在它上面装插件，可以边正常浏览边自动整理接口和敏感信息，省去大量手工翻找。

### 2.1 工具一览

> **为什么要学**：插件很多，功能有重叠，也有主动和被动之分。先了解各自的作用和是否会主动发请求，才能选对工具，也避免在授权范围外产生多余请求。

1. **自带功能**：`Target -> Site map -> Engagement tools -> Find scripts`
2. **官方插件**：JS Link Finder、JS Miner
3. **第三方插件**：HaE、Unexpected_information
   - HaE：[https://github.com/gh0stkey/HaE](https://github.com/gh0stkey/HaE)，规则配置：[Config.yml](https://raw.githubusercontent.com/gh0stkey/HaE/gh-pages/Config.yml)
   - Unexpected_information：[https://github.com/ScriptKid-Beta/Unexpected_information](https://github.com/ScriptKid-Beta/Unexpected_information)，用来标记请求包中的敏感信息、JS 接口和特殊字段，防止疏忽了一些数据包，可能会有意外的收获
4. **插件加载器**：`jython-standalone-2.7.2`

这些工具都是帮你从 Burp 捕获的网页流量和 JavaScript 文件中，快速整理接口、路径及敏感信息：

| 工具 | 主要作用 | 是否主动发请求 |
|---|---|---|
| Find scripts | 找出网站加载的 JavaScript 文件 | 通常不额外扫描 |
| JS Link Finder | 从 JS 文件中提取接口、URL、路径 | 主要是被动分析 |
| JS Miner | 接口、密钥、子域名、云地址、Source Map | 部分功能会主动请求 |
| HaE Network | 按 YAML 规则匹配任何 HTTP 信息，提取和高亮 HTTP 数据（邮箱、手机号、Token、路径） | 通常被动分析 |
| Unexpected_information | 固定类型的敏感信息和 JS 接口（身份证、内网 IP、JWT、URL） | 通常被动分析 |
| Jython | 为 Python 编写的 Burp 插件提供运行环境 | 不分析流量 |

**主动和被动的区别**

- **被动分析**：只检查浏览器正常访问网站时，已经经过 Burp 的请求和响应，通常不会为了扫描而额外请求服务器
- **主动分析**：根据已有线索，另外构造并发送请求，检查某个路径或情况。流程是：发现线索 → 插件构造新请求 → 发送给服务器 → 根据响应判断结果

### 2.2 Find scripts

> **为什么要学**：分析 JS 的第一步是知道网站到底加载了哪些 JS 文件。Burp 自带这个功能，不用装插件，适合用来列出要分析的目标清单。

Burp 自带功能，不是插件。作用是从 Site map 中整理目标使用的脚本文件，例如：

```text
/app.js
/static/js/main.js
/login.js
```

适合先找出「需要分析哪些 JS 文件」。

### 2.3 JS Link Finder

> **为什么要学**：JS 里的接口地址往往是后续测试未授权访问、越权等问题的入口，这个插件能把它们自动提出来，省去逐行阅读。

专门从 JavaScript 内容中查找可能的：

- API 接口
- 相对路径
- 后台路径
- 文件地址
- 外部链接

例如从 JS 中发现：

```js
url: "/api/user/login"
```

它比较专一，重点就是「从 JS 找链接和接口」。

### 2.4 JS Miner

> **为什么要学**：它除了接口还能找密钥、云地址、子域名等，覆盖面更广。了解它会主动发请求这一点，才能在授权范围内合理使用。

功能比 JS Link Finder 更全面，可以检查：

- API 接口
- 子域名
- 云服务地址
- 疑似密钥或凭证
- Source Map 文件
- JavaScript 和 JSON 中的其他信息

部分功能会猜测 `.map` 文件地址并发出请求，所以使用主动功能前要确认目标在授权范围内。它也可能产生误报，需要人工判断。

#### 补充：Source Map

> **为什么要学**：Source Map 能把压缩后看不懂的代码还原成原始源码，泄露后基本等于前端源码公开。测试时值得留意，开发上线时也要记得不要对外暴露。

Source Map 是一种**把压缩、打包后的前端代码对应回原始源代码**的文件，通常以 `.map` 结尾，比如 `app.js` 对应 `app.js.map`。

压缩后的代码：

```js
function a(b){return fetch("/api/user/"+b)}
```

通过 Source Map 还原出的原始代码：

```js
// src/api/user.js
function getUser(userId) {
    return fetch("/api/user/" + userId);
}
```

### 2.5 HaE Network

> **为什么要学**：测试时 Burp 里的流量非常多，人眼很难一条条看。用规则自动高亮敏感信息，能避免重要数据包被淹没在大量请求里。

HaE 是一个**流量高亮和信息提取框架**，利用正则规则检查 Burp 捕获的请求和响应。

可以发现：

- 接口路径
- 身份令牌
- 邮箱、手机号
- 内网 IP
- 敏感字段
- 特殊响应内容

匹配后会：

- 给 Proxy History 中的请求着色
- 添加标记或注释
- 把匹配结果集中显示在数据面板

它的优势是规则可以自定义，适合持续查看大量 HTTP 流量。

### 2.6 Unexpected_information

> **为什么要学**：规则固定、开箱即用，适合新手快速发现流量里的敏感字段。知道它和 HaE 功能重合，可以按需二选一。

作用和 HaE 有些相似，但功能更固定、简单。主要自动识别：

- 手机号、邮箱、身份证号
- 内网 IP
- JWT
- JS 中的接口和 URL
- `password`、`method: "post"` 等特殊字段

匹配后会给请求行着色，并在 `Unexpected information` 标签中显示结果。

由于它和 HaE 的功能重合，同时开启可能出现重复高亮。

### 2.7 推荐搭配

> **为什么要学**：插件全开容易重复和干扰，按目的搭配几个就够了，分析起来更清楚，也减少不必要的请求。

初学时不需要全部同时开启，建议：

| 目的 | 工具 |
|---|---|
| 找 JS 文件 | Find scripts |
| 提取 JS 接口 | JS Link Finder 或 JS Miner |
| 检查并高亮所有流量 | HaE Network |
| 运行旧 Python 插件 | Jython |

Unexpected_information 和 HaE 二选一即可。

## 3. 自动化：插件与工具

> **为什么要学**：目标多、JS 文件多的时候，手工和半自动都太慢。自动化工具能批量爬取和提取，适合 SRC 这类需要大范围打点的场景。

### 3.1 FindSomething 浏览器插件

> **为什么要学**：浏览网页时自动被动提取信息，不需要额外操作，也不会额外发请求，适合日常打点时顺手收集线索。

全自动、被动提取：

- 网站域名和外部链接
- 接口及文件路径
- Vue 组件路径，例如 `/components/.../*.vue`
- 手机号、身份证号、邮箱
- JWT 等可能的敏感信息

### 3.2 URLFinder：分析 JS

> **为什么要学**：它能一次性完成爬取、提取和验证可访问性，直接告诉你哪些接口是活的，方便快速筛出值得深入测试的地址。

[https://github.com/pingc0y/URLFinder](https://github.com/pingc0y/URLFinder)

一款用于快速提取、检测页面中 JS 与 URL 的命令行工具，是 JSFinder 的升级版。JSFinder 是快速从网站 JS 文件中提取 URL、子域名的工具，但已经很久没更新了。

URLFinder 能做到：

- 爬取网页中的链接
- 收集 JS 文件
- 从 JS 中提取接口和 URL
- 查找相关域名和子域名
- 验证发现的地址是否可以访问
- 显示状态码及响应大小
- 整理结果并生成报告

![](../../assets/posts/xiaodi-security-014/Screenshot-2026-11-14-at-8.16.01-pm.png)

工具也帮着自动访问了，能看到状态码：

![](../../assets/posts/xiaodi-security-014/Screenshot-2026-11-14-at-8.16.49-pm.png)

### 3.3 JSINFO-SCAN：分析 JS

> **为什么要学**：递归爬取能顺着一个 JS 找到更多 JS 和域名，挖得更深，补充单次爬取发现不了的内容。

[https://github.com/plg3/JSINFO-SCAN](https://github.com/plg3/JSINFO-SCAN)

递归爬取域名（netloc / domain），以及递归从 JS 中获取信息的工具。

### 3.4 ffuf：找到更多 JS 文件

> **为什么要学**：爬虫只能找到页面里已经引用的资源，没被引用的 JS 和路径只能靠猜。模糊测试能补上这一块，发现隐藏的文件和接口。

- [https://github.com/ffuf/ffuf](https://github.com/ffuf/ffuf)
- 字典：[https://wordlists.assetnote.io](https://wordlists.assetnote.io)

**ffuf 是一个高速模糊测试工具**。它读取字典里的内容，逐条替换请求中的 `FUZZ`，然后向服务器发送请求并比较响应。

和爬虫的区别：

- **爬虫**：跟随网页中已经存在的链接（F12 页面中展示的 JS 也就那么几个）
- **ffuf**：根据字典猜测没有显示出来的路径

比如字典里有 admin、login、api、backup，请求 `https://example.com/FUZZ` 时，就会把 `FUZZ` 依次换成字典里的词去请求。`FUZZ` 可以放在不同的位置：

```text
https://example.com/js/FUZZ
https://FUZZ.example.com
https://example.com/search?id=FUZZ
```

### 3.5 Packer-Fuzzer

> **为什么要学**：很多现代网站用 Webpack 打包，接口和逻辑都打在一起。针对打包特点的专用工具，比通用工具更容易把里面的接口和问题找出来。

[https://github.com/rtcatc/Packer-Fuzzer](https://github.com/rtcatc/Packer-Fuzzer)

一款针对 Webpack 等前端打包工具所构造的网站，进行快速、高效安全检测的扫描工具。

Webpack 是给 JS 代码打包的工具，有一些项目用 Webpack 打包。

## 4. 完整流程：先分析，再补漏

> **为什么要学**：单个工具各有盲区，把它们串成一个循环流程，才能既全面又高效。先分析再补漏，也能减少盲目扫描带来的大量请求。

核心原则：**先分析已知内容，再用 ffuf 补漏。**

### 4.1 步骤

```text
1. 正常浏览网站并抓取流量
2. Find scripts / F12 找到网站实际加载的 JS
3. JSFinder、JS Miner 或 AI 分析 JS
4. 提取接口、目录和 JS 命名规律
5. 根据已有线索选择小而准确的字典
6. 用 ffuf 在授权范围内查找遗漏路径
7. 再分析新发现的 JS 或接口
```

### 4.2 例子

先发现网站加载了：

```text
/static/js/app.abc123.js
/static/js/chunk-user.def456.js
```

分析后知道它的命名规律是：

```text
/static/js/chunk-业务名.哈希.js
```

再有针对性地寻找可能遗漏的业务分包，比直接拿几百万条字典盲猜更有效。

### 4.3 工具分工

> **为什么要学**：弄清每个环节用什么工具、解决什么问题，实际打点时就不会重复劳动，也知道某一步没结果时该换哪种方法。

```text
F12 / Burp / Find scripts
→ 收集页面实际使用的资源

JS 分析工具 / AI
→ 阅读 JS，提取接口、路由和命名规律

ffuf
→ 根据字典猜测没有直接加载或引用的资源

再次分析
→ 检查新发现的 JS 和路径
```

所以这是一个循环：

```text
发现已知 JS → 分析线索 → 定向 Fuzz 补漏 → 分析新结果
```

### 4.4 注意事项

> **为什么要学**：不加控制的扫描会给目标造成压力，乱调用操作型接口可能改动真实数据，还可能超出授权范围带来法律风险。守住这些边界是做测试的前提。

- 不建议一开始就使用两百多万条字典和高并发，会产生大量请求、误报和服务器压力
- 发现含 `delete`、`remove`、`sendCode`、`pay` 等操作型接口时，不要直接批量访问
- 只在自己或明确授权的系统中进行
