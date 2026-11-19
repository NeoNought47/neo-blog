---
title: "xiaodisec 016：信息打点 - CDN绕过、业务部署、漏洞回链、接口探针、全网扫描、反向邮件"
titleEn: "XiaoDi Security 016: Recon - CDN Bypass, Business Deployment, Vulnerability Callbacks, API Lookups, Internet-wide Scanning, Reverse Email"
date: 2026-11-17
posted: 2026-11-17
tags: ["Cybersecurity", "Learning Notes"]
---

<span class="post-note"><span class="i18n" data-lang="zh">课程为小迪安全官方 2024 年上传，本文为个人学习笔记。</span><span class="i18n" data-lang="en">Course published by XiaoDi Security in 2024. These are my personal study notes.</span></span>

## 0. 前置知识：CDN 访问流程

> **为什么要学**：现在很多网站都接了 CDN，直接查到的 IP 只是 CDN 节点。先弄清访问流程，才明白为什么要找真实 IP，以及从哪些环节可能找到。

1. 传统访问：用户访问域名 → 解析服务器 IP → 访问目标主机
2. 普通 CDN：用户访问域名 → CDN 节点 → 真实服务器 IP → 访问目标主机
3. 带 WAF 的 CDN：用户访问域名 → CDN 节点（WAF）→ 真实服务器 IP → 访问目标主机

## 1. 业务部署：从 CDN 配置找突破口

> **为什么要学**：CDN 通常不会覆盖所有域名、地区和资源，这些没覆盖到的地方就可能直连源站。理解 CDN 的配置方式，就知道该从哪里找漏网之处。

### 1.1 CDN配置1：加速域名

> **为什么要学**：主站接了 CDN，不代表所有子域名都接了。没加速的子域名可能和主站在同一台服务器或同一网段，是找真实 IP 的常见线索。

==加速域名——需要启用加速的域名==

子域名获取真实 IP 失效（加速配置有关系）

[www.xiaodi8.com](http://www.xiaodi8.com)　加速
bbs.xiaodi8.com　不加速

bbs这个如果不加速的话就会被找出真实IP

子域名和域名又可能是在同一 IP 或网段
主站和子站可能部署在：
- 同一台服务器，即相同 IP；
- 同一组服务器；
- 同一机房或相邻网段。

所以发现某个未接入 CDN 的子域名后，可以据此判断它是否与主站共用源站。但“同网段”只能作为线索，不能直接证明二者属于同一服务器。

### 1.2 CDN配置2：加速区域

> **为什么要学**：很多网站只在部分地区开了 CDN，其他地区访问可能直接解析到源站。从多个地区对比解析结果，就能发现这种差异。

加速区域——需要启用加速的地区

国外访问获取真实 IP：从不同国家或地区查询、访问域名，观察其 DNS 解析结果是否不同。如果某些地区没有进入 CDN 调度，就可能返回源站地址。比如说一个网站开启了中国大陆CDN服务，用一个伊朗的服务器访问就会有真实地址。
==但是子域名和主站不在一个服务器也是可能的==

#### 超级ping

超级ping：17ce.com
它会从国内外多个地区的探测节点查询或访问同一个域名，比较返回结果，用于CDN配置2。

![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-16-at-5.21.43-pm.png)
⬆️ 这个就是启用了CDN

### 1.3 CDN配置3：加速类型

> **为什么要学**：CDN 可能只代理部分资源或端口，没被代理的部分仍会直连源站。证书和历史记录也能提供关联线索，这些都是找源站的切入点。

加速类型——需要启用加速的资源

- **加速类型**
    CDN 可以只代理特定业务或资源，例如：
    - 静态文件、图片和视频；
    - 动态网页；
    - 下载业务；
    - API 或全站内容。
    如果某类资源或某个端口没有经过 CDN，它仍可能直接连接源站。

- **证书**
    HTTPS 网站接入 CDN 时，CDN 边缘节点通常需要配置对应域名的 TLS/SSL 证书，才能代表该域名与用户建立 HTTPS 连接。证书本身通常不会直接显示源站 IP，但证书中的域名信息、历史证书记录等可能提供关联域名线索。

### 1.4 验证候选 IP：绑定 hosts

> **为什么要学**：找到的 IP 只是候选，必须验证才能确认是不是源站，否则后续测试可能打错目标，甚至超出授权范围。

![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-16-at-5.24.16-pm.png)
ping www.zoro9.com和zoro9.com的IP区别

绑定hosts：上面的图片中 怀疑47.122.10.150是网站真实IP
就在hosts文件里写出47.122.10.150 www.zoro9.com
但是无法访问**不能直接说明 47.122.10.150 不是源站 IP**，但至少说明它不能以当前方式直接承载 `www.zoro9.com`。

## 2. 漏洞回链：使用漏洞来查看真实IP

> **为什么要学**：有些漏洞会让服务器主动向外发起连接或输出自身信息，这时暴露出来的就是源站地址。理解这一点，也能明白这类漏洞为什么会削弱 CDN 的隐藏效果。

### 2.1 SSRF.php漏洞查询真实IP

> **为什么要学**：SSRF 让服务器替你发请求，请求是从源站发出来的，所以接收端能看到它的真实出口 IP。这也是 SSRF 危害之外常被忽略的一个信息泄露点。

开一个服务器 python2 -m SimpleHTTPServer
然后把地址提交到网站的输入框 http://47.94.236.117:22
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-16-at-5.46.45-pm.png)
⬆️ 得到结果

### 2.2 遗留文件

> **为什么要学**：测试文件、探针页面上线后忘了删，可能直接显示服务器的 IP 和环境配置。打点时值得检查，运维时也要注意清理。

phpinfo.php。里面的遗留信息 比如访问www.zoro9.com/phpinfo.php
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-16-at-5.50.31-pm.png)
⬆️ 找到内网IP。是不是公网IP 要看服务器是不是公网ip

什么情况下会显示真实公网 IP？
- Web 服务直接绑定在公网网卡上；
- 服务器没有经过 NAT、容器或内部反向代理；
- `phpinfo.php` 由源站直接执行，而不是 CDN/WAF 的节点执行。

## 3. 反向邮件：邮件系统绕过CDN

> **为什么要学**：CDN 只代理网站流量，邮件一般由服务器直接发出，所以邮件里常带着真实 IP。这是绕开 CDN 找源站的一条独立路线。

一般邮件服务没有CDN

### 3.1 让网站主动发邮件给你

> **为什么要学**：注册验证、找回密码这类功能会让网站服务器主动给你发信，邮件头里可能记录了发信服务器的真实地址，获取成本很低。

注册邮箱，激活处是网站（邮箱）服务器主动发东西给你
点击忘记密码：
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-16-at-5.59.25-pm.png)
⬆️ 显示原文
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-16-at-5.59.11-pm.png)
⬆️ 真实IP地址

上面的网站使用的邮件是自己域名的邮件服务器，如果使用其他公司的邮件系统就不能查到目标的IP地址。

### 3.2 你给未知邮箱发

> **为什么要学**：网站没有发信功能时，可以借助退信机制让对方邮件服务器主动回信，同样可能暴露它的真实 IP。

（需要自己的邮件服务器，不能第三方）

通过发送邮件给一个不存在的邮箱地址，因为该用户邮箱不存在，所以发送将失败，
并且还会收到一个包含发送该电子邮件给你的服务器的真实 IP 通知。

比如给dijsakldjsalk@mail.mozhe.cn发送邮件
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-17-at-12.01.12-am.png)
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-17-at-12.01.04-am.png)

## 4. 接口探针：查询真实IP的网站

> **为什么要学**：这些平台积累了历史解析记录和全网扫描数据，能查到网站接入 CDN 之前的 IP，作为快速的第一步很省事。

https://get-site-ip.com

## 5. 全网扫描

> **为什么要学**：前面的方法都失效时，还可以在候选 IP 段里逐个比对网页内容，找出能直接返回目标页面的服务器。这是最后的兜底手段，但请求量大，要控制范围。

### 5.1 思路

> **为什么要学**：全网扫描量大，必须先理清从判断厂商、圈定 IP 段到比对内容的整体思路，才能把范围缩小到可行的程度。

**在一批候选 IP 中，寻找能够直接返回目标网站内容的服务器**，从而判断是否存在绕过 CDN 直接访问源站的地址。

```
域名 → 判断 CDN/云厂商 → 收集候选 IP 段
     → 扫描 80/443 端口
     → 用目标域名请求候选 IP
     → 比较网页标题或特征字符串
     → 保存疑似匹配的 IP
```

1. 判断加速厂商
2. IP库筛地址段
3. 配置范围扫描

先从IP段去扫描符合开放端口，再从IP去访问看看关键字，再将符合的结果进行保存

### 5.2 步骤

> **为什么要学**：按步骤先确定厂商和地址段，再配置工具扫描，可以避免盲目扫描整个互联网，节省时间也减少对无关主机的影响。

#### I. 判断加速厂商

tools.ipip.net/cdn.php 能识别出加速厂商
![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-17-at-12.19.26-am.png)

#### II. IP库筛地址段

![](../../assets/posts/xiaodi-security-016/Screenshot-2026-11-17-at-12.22.41-am.png)

#### III. 配置fuckCDN

配置文件 set.ini
```
[Set]
ScanType=tcp
ScanPort=端口号80/443
WorkThread=5
FuckThread=100
FindUrl=目标网站
FindStr=一般选标题
```

配置文件 ip.txt
写出要扫描的IP网段，按照上面的运营商网段和信息收集

运行脚本输入网站IP:端口

## 6. 参考知识

超级Ping：http://www.17ce.com/

超级Ping：https://ping.chinaz.com/

接口查询：https://get-site-ip.com/

接口查询：https://fofa.info/extensions/source

国外请求：https://tools.ipip.net/cdn.php

国外请求：https://boce.aliyun.com/detect/

IP社区库：https://www.cz88.net/geo-public

全网扫描：https://github.com/Tai7sy/fuckcdn

全网扫描：https://github.com/boy-hack/w8fuckcdn

全网扫描：https://github.com/Pluto-123/Bypass_cdn
