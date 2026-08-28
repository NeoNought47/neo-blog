---
title: "小迪安全 001：基础入门 - Web 演示源码、资源与工具箱"
date: 2026-07-24T09:00:00
tags: ["Cybersecurity", "Learning Notes"]
---

## 1. 搭建环境
视频里好像是用的阿里云
但是我用的虚拟机+宝塔

#### Ubuntu虚拟机服务器凭证：
`ubuntu:<你的密码>`
`ssh -p 2222 ubuntu@127.0.0.1`

原理：NAT 模式下虚拟机藏在主机后面，主机没法直接连它的内网 IP。所以在虚拟机软件里设了一条**端口转发规则**把主机的 `2222` 端口映射到虚拟机的 `22` 端口（22 是 SSH 默认端口）。于是你连主机自己的 2222 端口，==流量就被转进虚拟机的 SSH 了==。用 2222 而不是 22，是为了不跟主机自己可能占用的 22 端口冲突，纯属习惯性选个好记的数字。
要注意的是：**这个 2222 不是自动就有的**，得在虚拟机软件里配过那条转发规则才生效。如果你（或某个教程）之前配过，那直接上面的命令就能连。如果连不上报 `Connection refused`，通常是两个原因之一——转发规则没设，或者虚拟机里的 SSH 服务(`openssh-server`)没装/没开。

#### 宝塔凭证： 
【云服务器】请在安全组放行 8888 端口
 外网ipv4面板地址: https://203.0.113.10:8888/abcd1234
 外网ipv6面板地址: https://[2001:db8::1]:8888/abcd1234
 内网面板地址:     https://10.0.2.15:8888/abcd1234
`username: admin`
`password: <你的密码>`
https://127.0.0.1:8888/abcd1234

#### **配好端口转发**。
宿主机装宝塔、访问后台
先在 VirtualBox 里把 SSH(2222→22)、宝塔面板端口、web 端口这些转发规则配好。不然装完宝塔你连不进它的后台

#### 进入宝塔后台
**宝塔没有"连接"这个动作**。==宝塔面板本身是装在虚拟机里、跑在虚拟机里的一个程序==。它管理的永远是它自己所在的那台机器,也就是你的虚拟机。==你宿主机浏览器打开的,只是它的一个网页界面而已。==
能从宿主机访问到宝塔后台,靠的就是端口转发那座桥。
你在宿主机浏览器输入的是 `https://127.0.0.1:8888/abcd1234`(或者你配的那个宿主机端口)。这个 8888 是你在 VirtualBox 里亲手配的端口转发规则,它唯一指向的就是虚拟机里宝塔的端口。走这个地址进去的,只可能是虚拟机里那个宝塔。宿主机自己没装宝塔,不存在"连错"的可能。

`宿主机 127.0.0.1:8888` → `虚拟机 IP:宝塔面板端口`
设置端口转发，是为了让宿主机浏览器能够穿过虚拟机的 NAT 网络，访问虚拟机内部的宝塔面板。

#### 中间件四件套LNMP
Linux Nginx MySQL PHP
第一个就是刚才的linux虚拟机
用宝塔安装后三个
1. Nginx -- Web服务器，负责收发
	用户发的请求先到这，判断怎么处理，在把最终的网页发回去。监听80端口。
2. PHP -- 运算引擎
	Z-blog就是php写的。当用户访问一个.php页面 Nginx转交给php处理出结果给他，生成一个html
3. MySQL -- 数据库 负责存取
   网站的所有数据——文章、用户、评论、后台配置——都存在这儿。PHP 运行时会去连它、查数据,再把数据拼进网页。它和"网站文件"是彻底两回事:文件是代码,数据库是内容,分开放。

#### 安装Z-Blog

**第一步:在宝塔里建站点**  
左侧菜单进"网站"→ 添加站点。域名填 `test0.local`。这一步宝塔会自动做两件事:在 `/www/wwwroot/` 下建好你的网站目录(就是那个 `test0.local/` 文件夹),同时在 Nginx 里生成这个站点的配置(告诉 Nginx"以后 Host 是 test0.local 的请求,归这个目录管")。建站时它一般会问要不要顺便建数据库——可以勾上一起建,省一步。

**第二步:建数据库**(如果上一步没顺带建)  
在"数据库"菜单里新建一个,记好**数据库名、用户名、密码**——等会Z-Blog 安装向导要填这三样,把 PHP 和 MySQL 接上。这就是你前面理解的"文件和数据库分开"那回事:现在建的是那个空的"数据仓库",等着 Z-Blog 往里写东西。

**第三步:上传 Z-Blog 程序文件**  
把 Z-BlogPHP 1.7.5 的程序包传到网站目录 `/www/wwwroot/test0.local/` 下,解压。传完 `ls` 一下应该能看到 `index.php`、`zb_system`、`zb_users`、还有那个 `zb_install` 目录——这些就是你之前 `ls` 认过的文件。这一层是"网站程序本身",靠底下的 PHP 引擎跑、靠 MySQL 存数据。

**第四步:跑安装向导 + 配 hosts**  
这是"让它真正活起来"的最后一步,有两个动作要配合:
- **配 hosts**:宿主机 hosts(`127.0.0.1 test0.local`)让你浏览器能访问;**虚拟机内部 hosts** 也要有那行——就是你上次踩 502 坑最后补上的那行,让 Z-Blog 运行时自己能解析 test0.local。这两处最好在跑向导前就确认到位。
- **跑安装向导**:浏览器访问 `http://test0.local:8080`,因为 `zb_install` 目录还在,Z-Blog 会自动进入安装界面。按提示填数据库信息(第二步记的那三样)、设管理员账号密码,点安装。装完它会提示你**删除 zb_install 目录**(安全考虑,装完就没用了,留着是隐患)——删掉,网站就正式上线了。

http://127.0.0.1:8080
http://test0.local:8080

###### 整体来说
访问网站的时候：
   Nginx 接收请求并读取网站目录
   PHP 执行 `index.php` 等程序
   MySQL 保存文章、用户和评论等数据
   每次请求都可能动态生成页面

## 2. Web应用基础知识
> 一个完整的 Web 应用，不只是网页源码，而是由**服务器系统、网站部署方式、中间件、数据库、程序源码和路由规则**共同组成。

例如访问：
```text
https://shop.example.com/products/123
```
经历：
```text
浏览器
  ↓
域名 / 端口
  ↓
Nginx、Apache、IIS 等中间件
  ↓
后端程序的路由
  ↓
身份验证和业务逻辑
  ↓
数据库
  ↓
返回网页或 JSON 数据
```

---
### 一、系统
指运行 Web 应用的服务器操作系统及其运行环境
```text
Linux + Nginx + PHP
Linux + Nginx + Python
Linux + Nginx + Node.js
Linux + Tomcat + Java

上课的：
Windows Server + IIS + ASP.NET
```
#### 例子
假设你购买了一台 EC2：
那么系统负责提供：

- 文件系统
    
- 用户和权限
    
- 网络连接
    
- 进程管理
    
- 软件运行环境
    
- 日志和服务管理
    

例如：

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

这里就是由 Linux 系统负责启动并管理 Nginx。

---

## ===二、搭建方式===

- 1. 子域站
    
- 2. 目录站
    
- 3. 端口站
    

它们主要区别在于：**用户通过什么地址访问不同的网站或功能。**

---
###  网站类型
1. 子域站
2. 目录站
3. 端口站

### 1. 子域站

子域站是使用不同的==子域名==部署不同的网站或系统。

```text
www.example.com       主网站
blog.example.com      博客
admin.example.com     后台管理系统
api.example.com       API接口
mail.example.com      邮件系统
```

虽然它们都属于example.com, 但可以指向完全不同的服务器或应用。

一家购物网站可能这样部署：

```text
www.shop.com       商城前台
admin.shop.com     商城管理后台
api.shop.com       手机App调用的接口
```

#### 特点

优点：

- 不同系统比较容易分开管理
    
- ==可以部署在不同服务器上==
    
- 可以分别设置证书、权限和访问规则
    
- 结构比较清晰
    

缺点：

- 需要配置 DNS
    
- 通常需要额外配置 HTTPS 证书
    
- Cookie、跨域访问等问题需要单独处理
    

---

### 2. 目录站

目录站是在同一个域名下面，通过不同目录访问不同功能。

```text
example.com/
example.com/blog/
example.com/admin/
example.com/forum/
```

```text
https://example.com/shop/
https://example.com/blog/
https://example.com/admin/
```

它们可能分别对应服务器上的：

```text
/var/www/html/shop/
/var/www/html/blog/
/var/www/html/admin/
```

#### 特点

优点：

- 配置简单
    
- 不需要创建很多子域名
    
- 可以共享同一个 HTTPS 证书
    
- 用户看到的域名保持一致
    

缺点：

- 不同系统可能共用同一个 Web 服务器
    
- 隔离程度通常不如子域站
    
- 路由和权限配置不当时容易相互影响
    

例如，后台放在：

```text
example.com/admin/
```

不代表它天然安全，仍然必须配置登录验证和权限控制。

---

### 3. 端口站

端口站是通过不同端口区分不同网站或服务。

```text
example.com:80       HTTP网站
example.com:443      HTTPS网站
example.com:8080     测试网站
example.com:3000     Node.js应用
example.com:8443     管理后台
```

#### 实际例子

一台服务器上运行三个程序：

```text
Nginx：80
Spring Boot：8080
React开发服务器：3000
```

访问方式可能是：

```text
http://example.com
http://example.com:8080
http://example.com:3000
```

#### 为什么正式网站很少显示端口号

用户通常希望访问：

```text
https://example.com
```

而不是：

```text
https://example.com:8080
```

所以正式环境通常使用 Nginx 反向代理：

```text
用户访问 443
      ↓
Nginx
      ↓
转发到内部的 8080
```

例如：

```text
https://api.example.com
```

实际上可能被 Nginx 转发到：

```text
127.0.0.1:8080
```

---

## 三、中间件

这里的中间件，可以理解为位于==浏览器与后端程序之间，负责接收和处理请求的软件==。

常见的 Web 中间件或 Web 服务器包括：

```text
Nginx
Apache HTTP Server
Microsoft IIS
Tomcat
WebLogic
WebSphere
```

某些框架里的请求处理组件也叫中间件，例如：

```text
Express Middleware
Django Middleware
ASP.NET Middleware
Spring Interceptor
```

它们可能负责：

- 接收 HTTP 请求
    
- HTTPS 加密
    
- 身份验证
    
- 转发请求
    
- 静态文件处理
    
- 日志记录
    
- 限制访问
    
- 负载均衡
    
- URL 重写
    

---

### 中间件配置

三类配置：

1. 身份验证
    
2. 目录权限
    
3. 解析规则
    

---

### 1. 身份验证

身份验证就是判断：

> 你是谁，你是否有权访问这个页面。

例如访问：

```text
https://example.com/admin
```

服务器可能要求用户：

- 输入用户名和密码
    
- 提供 Session Cookie
    
- 提供 JWT Token
    
- 使用 OAuth 登录
    
- 通过企业单点登录
    
- 使用客户端证书
    

#### 例子：后台登录

用户登录后，服务器生成一个 Session：

```text
session_id=abc123
```

以后用户访问：

```text
/admin/users
```

中间件会先检查：

```text
这个 Session 是否有效？
这个用户是否具有管理员身份？
```

验证成功后，才把请求交给后台程序。

#### 身份验证与授权的区别

身份验证：

```text
Authentication：确认你是谁
```

授权：

```text
Authorization：确认你能做什么
```

例如：

```text
用户已经成功登录        身份验证成功
但不能删除其他用户      没有对应授权
```

---

### 2. 目录权限

目录权限指服务器上的程序，对文件和文件夹拥有什么操作权限。

通常包括：

```text
读权限：读取文件
写权限：修改或创建文件
执行权限：运行程序
```

Linux 中经常看到：

```bash
chmod
chown
```

例如：

```bash
chmod 755 /var/www/html
chown nginx:nginx /var/www/uploads
```

#### 为什么要设置目录权限

假设用户上传头像，程序需要向下面的目录写文件：

```text
/var/www/app/uploads/
```

因此 Web 程序需要对这个目录有写权限。

但是程序通常不应该随意修改：

```text
/var/www/app/config/
/etc/
/usr/bin/
```

否则一旦 Web 应用被攻击，攻击者可能利用程序权限修改系统文件。

#### 常见安全原则

```text
程序目录：尽量只读
上传目录：允许写入，但禁止执行程序
配置文件：只允许特定系统用户读取
日志目录：允许程序写入，但不能通过网页直接访问
```

---

### 3. 解析规则

解析规则决定：

> 某种文件或者某个 URL 应该交给什么程序处理。

例如：

```text
.html  → 直接作为静态网页返回
.jpg   → 直接返回图片
.php   → 交给 PHP 解释器
.jsp   → 交给 Java Servlet 容器
.py    → 通常由 Python Web 框架处理
```

#### 例子

用户访问：
```text
https://example.com/index.php
```
Nginx 可能将它交给：
```text
PHP-FPM
```

然后 PHP 解释器执行代码，将执行结果返回给浏览器。

#### 解析规则配置错误的==风险==

假设上传目录是/uploads/
正常情况下，这里面只应该出现：
```text
photo.jpg
document.pdf
avatar.png
```

如果服务器错误地==允许这个目录解析 PHP==，那么攻击者可能上传shell.php
随后访问 https://example.com/uploads/shell.php
服务器就可能执行这个文件。

因此安全配置通常要求上传目录可以存文件 但不能执行 PHP、JSP、ASP 等代码

---

## 四、数据库

数据库负责保存需要长期存在的数据，例如：

- 用户账户
    
- 密码哈希
    
- 商品信息
    
- 订单记录
    
- 评论
    
- 库存
    
- 权限信息
    
- 操作日志
    

常见数据库：

```text
MySQL
PostgreSQL
Microsoft SQL Server
Oracle Database
MongoDB
Redis
```

图中分成两种部署模式：

- ==本地一致==，也就是网站和数据库位于同一台服务器
    
- ==站库分离==，也就是网站和数据库分别运行
    

---

### 1. 网站和数据库在同一台服务器

结构如下：

```text
一台服务器
├── Nginx
├── Web应用
└── MySQL
```

Web 应用连接数据库时使用 localhost或者127.0.0.1:3306

#### 例子

```text
EC2服务器
├── Apache
├── WordPress
└── MySQL
```

这是小型网站和学习环境中常见的模式。

#### 优点

- 搭建简单
    
- 成本较低
    
- 数据库连接速度快
    
- 不需要额外的网络配置
    

#### 缺点

- 网站和数据库互相争抢 CPU、内存和磁盘
    
- 服务器发生故障时，网站和数据库同时停止
    
- 不容易独立扩容
    
- 隔离性较差
    

---

### 2. 站库分离

站库分离指：

```text
Web服务器和数据库服务器分开
```

例如：

```text
Web服务器：10.0.1.10
数据库服务器：10.0.2.10
```

结构：

```text
用户
 ↓
Web服务器
 ↓ 私有网络
数据库服务器
```

#### 使用另一台服务器的数据库

例如：

```text
EC2 A：Nginx + Java应用
EC2 B：MySQL
```

Java 应用通过数据库服务器的私有 IP 连接：

```text
10.0.2.10:3306
```

一般不应该让数据库直接暴露给互联网。

AWS Security Group 可以设置：

```text
MySQL端口3306
只允许来自Web服务器安全组的流量
```

而不是允许0.0.0.0/0

---

### 3. 使用云数据库

云数据库应用指使用云厂商管理的数据库服务。

例如 AWS 中的：

```text
Amazon RDS
Amazon Aurora
Amazon DynamoDB
Amazon ElastiCache
```

结构可能是：

```text
EC2上的Web应用
        ↓
Amazon RDS中的MySQL
```

云数据库通常会帮助处理：

- 自动备份
    
- 数据库补丁
    
- 故障恢复
    
- 监控
    
- 多可用区部署
    
- 存储扩容
    

但是应用程序仍然需要正确配置：

- 数据库地址
    
- 用户名和密码
    
- 网络访问规则
    
- 安全组
    
- 加密
    
- 连接池
    

---

## 五、程序源码

程序源码就是实现网站功能的代码。

例如一个购物网站的源码负责：

- 用户注册
    
- 用户登录
    
- 商品展示
    
- 添加购物车
    
- 创建订单
    
- 支付
    
- 后台管理
    

图中从三个方面分析程序源码：

1. 类型
    
2. 结构组成
    
3. 路由访问
    

---

## 六、源码类型

源码可以分成：

- 开源
    
- 商业
    
- 自用或自行开发
    

---

### 1. 开源程序

开源程序的源代码通常可以被查看和修改。

例如：

```text
WordPress
Drupal
Joomla
Django
Laravel
Spring Framework
```

注意，框架和完整网站程序不是完全相同的概念，但它们都可能以开源方式发布。

#### 例子：WordPress

WordPress 是一个开源内容管理系统。

你可以看到它的 PHP 源码，例如：

```text
wp-admin/
wp-content/
wp-includes/
```

优点：

- 可以研究和修改源码
    
- 社区资源丰富
    
- 出现问题容易找到资料
    
- 开发成本相对较低
    

缺点：

- 已知漏洞也容易被攻击者研究
    
- 插件质量参差不齐
    
- 必须及时更新
    

开源不等于不安全，闭源也不等于安全。关键在于：

```text
代码质量、配置、维护和更新
```

---

### 2. 商业程序

商业程序是由公司开发并出售或授权使用的软件。

例如：

```text
商业电商系统
企业内容管理系统
银行业务系统
企业ERP系统
```

这类程序可能以以下形式交付：

- 完整源码
    
- 部分源码
    
- 编译后的程序
    
- 加密或混淆后的代码
    
- 只能通过许可证运行的软件
    

图中的“闭源、加密、语言特性”可以这样理解：

#### 闭源

用户不能直接查看完整源代码。

例如只获得：

```text
app.jar
app.exe
app.dll
```

#### 加密或混淆

开发者为了避免源码被直接阅读，可能对代码进行：

- 混淆
    
- 加密
    
- 编译
    
- 打包
    

例如 Java 项目可能只发布：

```text
application.jar
```

虽然仍可进行一定程度的反编译，但比直接提供源码更难阅读。

#### 语言特性

不同编程语言的交付方式不同：

```text
PHP、JavaScript：通常能直接看到源码
Java、C#：通常先编译为字节码
C、C++：通常编译为机器代码
Python：可能提供源码，也可能打包
```

---

### 3. 自用或自行开发

这是公司或个人根据自己的业务需求开发的系统。

例如：

```text
学校选课系统
医院预约系统
公司内部报销系统
实验室数据管理系统
```

优点：

- 能够针对业务定制
    
- 功能和流程更灵活
    
- 不必包含无关功能
    

缺点：

- 开发和维护成本高
    
- 依赖开发团队
    
- 可能缺少公开文档
    
- 安全性取决于开发能力
    

---

## ==七、源码结构组成==

图中列出了：

- 数据库目录
    
- 后台目录
    
- 文件目录
    

不同框架的名称可能不同，但基本思想类似。

假设一个 Web 项目结构如下：

```text
web-app/
├── config/
├── database/
├── backend/
├── public/
├── uploads/
├── static/
├── templates/
├── logs/
└── app.py
```

---

### 1. 数据库目录

数据库相关目录可能包含：

- 建表 SQL
    
- 数据库迁移文件
    
- 初始数据
    
- 数据库模型
    
- 数据库连接配置
    

例如：

```text
database/
├── schema.sql
├── migrations/
└── seed.sql
```

#### schema.sql

定义数据库表：

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(100),
    password_hash VARCHAR(255)
);
```

#### migrations

记录数据库结构的变化，例如：

```text
001_create_users_table.sql
002_add_email_column.sql
003_create_orders_table.sql
```

需要注意：

> 源码中的数据库目录，一般不应该包含可以通过浏览器直接下载的数据库备份、密码或真实数据文件。

危险示例：

```text
https://example.com/database/backup.sql
```

如果这个地址能够下载数据库备份，就可能泄露用户信息和密码哈希。

---

### 2. 后台目录

后台目录通常存放管理系统或者服务器端业务逻辑。

例如：

```text
/admin/
/backend/
/manage/
/administrator/
```

里面可能包含：

- 用户管理
    
- 商品管理
    
- 订单管理
    
- 权限配置
    
- 日志查看
    
- 系统设置
    

例如：

```text
/admin/users
/admin/products
/admin/orders
```

#### 重要误区

把后台地址改成一个不容易猜到的名字：

```text
/admin_8f93x/
```

只能降低被随意发现的概率，不能代替真正的安全措施。

后台仍然需要：

- 强密码
    
- 多因素认证
    
- 权限控制
    
- 登录失败限制
    
- 日，不能代替真正的安全措施。
    

后台仍志记录

- HTTPS
    
- 必要时限制可访问 IP
    

---

### 3. 文件目录

文件目录可能包含：

```text
静态资源
用户上传文件
网页模板
配置文件
日志
缓存
```

例如：

```text
/static/       CSS、JavaScript、图片
/uploads/      用户上传的文件
/templates/    HTML模板
/logs/         程序日志
/cache/        缓存文件
```

#### 公开目录和非公开目录

公开目录可以让浏览器直接访问：

```text
/public/
/static/
/images/
```

非公开目录通常不能直接通过 URL 访问：

```text
/config/
/logs/
/database/
/src/
```

==比较好的结构是：==

```text
/var/www/app/
├── config/
├── src/
├── logs/
└── public/
```

Web 服务器只把：

```text
/var/www/app/public/
```

作为网站根目录。

这样浏览器就不能直接访问：

```text
config/database.yml
logs/error.log
src/app.py
```

---

## 八、路由访问

路由决定：

> 用户输入一个 URL 后，应该执行哪一段程序代码。

图中包括：

- 绝对路径
    
- 相对路径
    
- 常规访问
    
- 路由配置
    

---

### 1. 绝对路径

绝对路径是从根位置开始写出的完整路径。

#### Linux 文件路径

```text
/var/www/app/public/index.html
```

#### Windows 文件路径

```text
C:\inetpub\wwwroot\index.html
```

#### URL 绝对地址

```text
https://example.com/images/logo.png
```

绝对路径的特点是：

```text
不依赖当前所在位置
```

---

### 2. 相对路径

相对路径是相对于当前位置计算的路径。

例如当前文件在：

```text
/var/www/app/templates/
```

使用：

```text
../static/logo.png
```

表示：

```text
先返回上一级目录，再进入static目录
```

常见符号：

```text
./     当前目录
../    上一级目录
../../ 上两级目录
```

HTML 中也常见：

```html
<img src="./images/logo.png">
```

或者：

```html
<img src="../images/logo.png">
```

#### 常见问题

如果页面位置变化，相对路径可能失效。

例如：

```text
/products/index.html
```

里面写：

```html
<img src="images/a.jpg">
```

浏览器可能会请求：

```text
/products/images/a.jpg
```

而实际图片可能位于：

```text
/images/a.jpg
```

这时就会出现 404。

---

### 3. 常规访问

常规访问通常是 URL 与文件或程序结构比较直接地对应。

例如：

```text
https://example.com/about.html
```

对应：

```text
/var/www/html/about.html
```

或者：

```text
https://example.com/user.php?id=123
```

对应执行：

```text
user.php
```

并将：

```text
id=123
```

作为参数传给程序。

这种形式也叫查询字符串：

```text
?参数名=参数值
```

例如：

```text
/search.php?q=aws
/product.php?id=100
/login.php?redirect=/admin
```

---

### 4. 路由配置

现代 Web 框架通常不会让 URL 直接对应某一个真实文件，而是通过路由规则匹配程序。

例如用户访问：

```text
/products/123
```

服务器上不一定存在：

```text
products/123
```

这个文件。

路由配置可能是：

```python
@app.route("/products/<int:product_id>")
def show_product(product_id):
    return get_product(product_id)
```

于是：

```text
/products/123
```

会执行：

```text
show_product(123)
```

#### 常见路由例子

```text
GET  /users          获取用户列表
GET  /users/123      获取编号123的用户
POST /users          创建用户
PUT  /users/123      修改用户
DELETE /users/123    删除用户
```

虽然 URL 类似，但 HTTP 方法不同，对应的操作也不同。

---

## 九、完整实例

假设我们搭建一个购物网站：

```text
https://shop.example.com/products/123
```

整体结构如下。

### 1. 系统

```text
Amazon Linux 2023
```

运行在一台 AWS EC2 上。

### 2. 搭建方式

使用子域站：

```text
shop.example.com     商城
admin.example.com    后台
api.example.com      API
```

### 3. 中间件

使用 Nginx：

```text
Nginx监听443端口
处理HTTPS
将请求转发给127.0.0.1:8080
```

### 4. 后端程序

8080 端口运行 Spring Boot：

```text
GET /products/123
```

被路由到：

```java
getProductById(123)
```

### 5. 身份验证

如果用户访问：

```text
/admin/products
```

身份验证中间件会检查用户是否登录，以及是否拥有管理员权限。

### 6. 数据库

Spring Boot 连接 Amazon RDS MySQL：

```text
products表
users表
orders表
```

查询：

```sql
SELECT * FROM products WHERE id = 123;
```

### 7. 返回结果

数据库把商品信息交给后端：

```json
{
  "id": 123,
  "name": "Keyboard",
  "price": 99
}
```

后端生成网页或 JSON，再通过 Nginx 返回给用户。

完整流程：

```text
用户访问URL
    ↓
DNS找到服务器
    ↓
Nginx接收HTTPS请求
    ↓
根据域名和路由转发
    ↓
身份验证和权限检查
    ↓
Spring Boot执行程序
    ↓
查询RDS数据库
    ↓
返回商品信息
    ↓
浏览器显示页面
```

---

## 十、容易混淆的几个概念

### 域名、目录和端口

它们都是区分网站入口的方法：

```text
子域站：admin.example.com
目录站：example.com/admin
端口站：example.com:8080
```

---

### 中间件和后端程序

中间件主要负责：

```text
接收、检查、转发和处理请求
```

后端程序主要负责：

```text
实现具体业务逻辑
```

例如：

```text
Nginx：接收请求、HTTPS、转发
Spring Boot：创建订单、查询商品
```

---

### 路由和真实文件路径

访问：

```text
/users/123
```

不代表服务器上一定存在：

```text
/users/123
```

这个文件。

现代 Web 应用通常是路由规则将 URL 映射到函数或控制器。

---

### 数据库和源码

源码保存：

```text
程序逻辑
```

数据库保存：

```text
实际业务数据
```

例如：

```text
源码定义“如何创建用户”
数据库保存“已经创建了哪些用户”
```

---

## 总结

可以把整张思维导图记成六层：

```text
系统
  提供运行环境

搭建
  决定网站通过什么域名、目录或端口访问

中间件
  接收请求，并进行验证、转发和解析

数据库
  保存用户、商品、订单等持久数据

程序源码
  实现网站的具体业务功能

路由
  把用户访问的URL映射到具体代码
```

最核心的一条请求链是：

```text
URL
→ Web中间件
→ 路由
→ 身份验证
→ 业务代码
→ 数据库
→ 返回结果
```
