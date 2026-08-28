---
title: "小迪安全 006：抓包技术"
date: 2026-08-13T10:00:00
tags: ["Cybersecurity", "Learning Notes"]
---

## I. 课程定位与目标
##### 1.1 本章核心定位
	针对HTTP/HTTPS协议（其他协议如TCP/UDP/游戏协议等，需要wireshark）
	针对对象：Web网站，手机APP应用，微信小程序，PC应用（比如腾讯文档）
	使用工具：1. Fiddler
			2. Charles
			3. Burp Suite
			4. Proxifier (转发联动工具)
##### 1.2 课程边界（重要）
> **明确告知**：本节课只解决<mark>**无防护场景**</mark>的抓包。
> 后续课程将讲解：
> 	其他协议抓包（Wireshark、科莱）
> 	反代理检测绕过（APP/小程序专项章节）
> 	证书校验绕过    
> 	数据加密解密分析

## II. 环境准备：证书安装（前置条件）
##### 2.1 为什么必须安装证书
- **HTTPS抓包前提**：不安装证书无法抓取HTTPS加密流量
- **原理**：证书用于解密HTTPS流量，实现中间人代理（MITM）
##### 2.2 证书安装步骤
A. Charles（茶杯）证书安装
本地电脑安装：
    打开Charles → Help → SSL Proxying → Save Charles Root Certificate...
    保存证书到桌面（命名为"Charles"）
    双击安装或导入系统证书存储
安卓模拟器安装：
    将证书文件拖入模拟器共享目录（或通过文件传输）
    模拟器设置 → 安全 → 从SD卡安装证书
    选择证书文件 → 输入锁屏密码 → 命名安装
    
B. Fiddler证书安装
导出证书：
    打开Fiddler → Tools → Options → HTTPS
    勾选Decrypt HTTPS traffic
    Actions → Export Root Certificate to Desktop
	 安装方式和上面的一样
	 
C. Burp Suite证书安装
本地安装：
    打开Burp Suite → Proxy → Options → Import/export CA certificate
    选择Export → Certificate in DER format
    保存为.der文件
    浏览器设置 → 安全 → 管理设备证书 → 中间证书颁发机构 → 导入
模拟器安装（特殊处理）：
    ⚠️ 注意：Burp证书为.der格式，安卓模拟器不直接识别，需转换：
    在模拟器浏览器中访问Burp代理地址（如http://192.168.1.6:8080）
    点击页面上的CA Certificate下载
    下载后位于Download目录，将后缀改为.cer
    设置 → 安全 → 从SD卡安装 → 选择.cer文件安装
## III. 四大对象抓包实战
##### 3.1 Web网站抓包（浏览器）
<mark>Charles</mark>
特点：无需设置代理 启动之后可以直接抓取本机浏览器流量（但是Ubuntu还是需要在firefox里面设置系统代理127.0.0.1:8888, 正常是use system proxy settings, 改为manual proxy config）
配置：`Proxy` → `Proxy Settings` → 勾选`Enable transparent HTTP proxying`
远程抓取：若抓模拟器流量，需勾选`Support HTTP/2`和`Enable SOCKS proxy`

<mark>Fiddler</mark>
特点：无需设置代理，自动抓取系统HTTP/HTTPS流量
配置：Tools → Options → HTTPS → 勾选Capture HTTPS CONNECTs和Decrypt HTTPS traffic
筛选功能：可针对特定域名筛选（Filter功能）

<mark>Burp Suite抓包（重点）</mark>
特点：必须设置代理，偏向安全测试，支持数据包<mark>拦截修改</mark>
配置步骤：
1. 设置代理监听，`Proxy` → `Options` → `Add` → 绑定地址（127.0.0.1或本机IP）→ 端口（默认8080）
2. 开启浏览器代理，设置 代理 手动代理 127.0.0.1:8080
3. 开启拦截，proxy intercept intercept is on

**⚠️ 关键注意事项**：
- **代理开关必须对应**：设置代理后Burp必须开启，否则网站无法访问（流量走到代理端口但无工具监听，导致断网）
- **排除本地地址**：浏览器代理设置的"请勿对以下地址使用代理服务器"中，**删除所有本地地址**，否则本地靶场抓不到包


##### <mark>BP在Ubuntu上的实践记录：</mark>
**`Proxy → Intercept`**
- `Intercept is on` 时，会把经过 Burp 的 **Request 暂时拦住**
- 你可以<mark>查看、修改</mark>这个 Request
- 点 **Forward** = 把它继续发送给服务器
- 也可以配置成连 **Response** 都拦住

**`Proxy → HTTP history`**
- 是查看已经经过 Burp 的历史 HTTP 流量
- **Request 和 Response 都可以看**
- 不只是 Response

intercept is off 的时候，不会拦住数据包，可以在HTTP history里看

> **Intercept：实时拦截 Request/Response，可以查看、修改；Forward 表示放行当前被拦住的数据。**  
> **HTTP history：查看已经经过 Burp 的历史请求和响应内容。**

##### 3.2 安卓APP应用抓包（安卓模拟器）
###### **核心原理**
模拟器相当于**独立设备**，有独立IP地址。抓包工具在本机运行，需让模拟器流量**主动走向**本机工具。

###### **配置步骤（以Burp为例）**

**步骤1：确认本机IP地址**
`ifconfig`
<mark>这里假设本机IP为：192.168.1.6</mark>

步骤2：模拟器设置代理
    模拟器设置 → WLAN → 长按当前网络 → 修改网络
    高级选项 → 代理 → 手动
    代理服务器主机名：本机IP（如192.168.1.6）
    代理服务器端口：Burp监听端口（如8080）

步骤3：Burp添加监听地址
    Proxy → Options → Add → 选择本机IP，这里假设是<mark>192.168.1.6</mark>（非127.0.0.1）→ 端口8080

步骤4：验证抓包

    模拟器浏览器访问HTTP/HTTPS网站，确认Burp能抓到包
    再打开目标APP测试

    ⚠️ 关键检查点：
        先确保浏览器能抓HTTP/HTTPS，再测试APP
        若抓不到，检查：证书是否安装、代理IP是否正确、Burp监听地址是否添加本机IP

Charles/Fiddler抓APP
    同样需设置"从远程客户端抓取"（Charles：Proxy Settings → 勾选相关选项）
    模拟器代理设置同上

##### 3.3 微信小程序抓包
###### **核心难点**
- <mark>微信**有代理设置**，但直接设置系统代理会导致微信功能异常（消息发不出等）</mark>
- 微信内置浏览器/小程序**无法直接配置独立代理**

##### 解决方案：转发联动（两种方法）

*方法一：**Charles + Burp Suite联动**（推荐）*

1.	Charles正常抓取小程序流量（无需代理设置，自动抓）
2.	Charles设置转发：Proxy → Proxy Settings → macOS/Windows → External Proxy Settings
3.	勾选Use external proxy servers → HTTP/HTTPS都设置为127.0.0.1:8080（Burp地址）
4.	Burp监听127.0.0.1:8080
5.	打开微信小程序，Charles抓到后自动转发到Burp

解释代理路径：
1. 小程序->Charles：所以Charles能收到小程序的HTTP/HTTPS请求。例如小程序想访问www.example.com/login，实际上会先经过Charles. 小程序->Charles->api.example.com
2. Charles->Burp: Charles里面有设置HTTP → 127.0.0.1:8080, HTTPS → 127.0.0.1:8080。**Charles 自己访问互联网时，不直接访问目标服务器，而是再把请求交给 Burp。**所以最后就是Charles -> 127.0.0.1 -> Burp
小程序
 │
 │ 第一层代理
 ↓
Charles
 │
 │ External / Upstream Proxy
 ↓
Burp :8080
 │
 ↓
Internet
 │
 ↓
目标 API

**1. 为什么 Charles 能抓、Burp 好像不能?**  
不是能力差别,是默认行为差别。<mark>Charles 安装后自动帮你改系统代理</mark>,而且默认只解密白名单里的域名,名单外的原样透传;Burp 不动系统设置,且默认见到 CONNECT 就想 MITM,碰到微信的 mmtls 私有协议解析不了就断连,于是消息发不出。Burp 手动配好代理 + 装系统证书 + TLS Pass Through 排除微信自己的域名,一样能抓。
**2. Charles 是不是主动设置了系统代理?**  
是。它启动时写系统配置,退出时改回来,所以感觉像"自动抓"。
**3. 系统代理是不是流量先经过系统?**  
不是。127.0.0.1 只是"本机"这个地址,端口号才决定交给哪个进程(8888→Charles,8080→Burp)。系统代理本身只是个配置项,内核不参与转发,全靠应用主动去读、主动遵守 —— 应用层自愿,不是网络层强制。这和 Clash 的 TUN 模式正好相反,后者改路由表,应用绕不开。
**4. 小程序有独立代理的话能直接用 Burp 吗?**  
能,而且更干净。微信开发者工具有独立代理设置;PC 端小程序跑在独立进程 `WeChatAppEx.exe`,用 Proxifier 只转发这个进程就行。别用微信客户端自带的网络代理,那是全局的,会把长连接一起塞进去。
**5. 系统代理是"流量要经过我这个软件"吗?**  
三个词要改:是**被建议**不是"要"(应用可以不理),只管**出站**不管入站(响应是沿原连接返回的),而且经过的是 **Charles 这个进程**,不是"系统"。
**6. 系统代理是个记事本、记录 HTTP 包吗?**  
它记的是**地址**,不是流量。就一句"要出网请发到 127.0.0.1:8888",静态躺着,看不到任何 URL 和包内容。记录和拆包是 Charles 干的。

一句话串起来:Charles 改了配置项 → 微信 WebView 自愿把请求发到本机 8888 → Charles 按白名单决定解密还是透传 → 微信长连接因为在名单外被透传,所以没坏。

顺便说一下：
**"系统"指的是配置的作用范围,不是流量的经过路径。** 这才是歧义所在。它想说的是"这个代理设置存在**系统级别**,对全机器所有应用生效",区别于:
- **应用级代理** —— 只在某个程序里配,比如 Firefox 自己的代理设置、微信开发者工具的代理设置,别的程序不受影响
- **环境变量代理** —— `HTTP_PROXY=...`,只对从这个 shell 启动的进程生效


<mark>例子</mark>
假设微信小程序请求：https://api.xiaodi8.com/user?id=123
根据上面的配置，微信小程序->Charles (Charles也说我不直接访问那个网站，把请求给external proxy) -> 127.0.0.1 -> BP -> api.xiaodi8.com
服务器返回 api.xiaodi8.com - Burp - Charles - 微信小程序


方法二：Proxifier + Burp Suite（进程级转发）
    Proxifier作用：强制指定进程走指定代理，无需应用程序本身支持代理设置

表格
步骤	操作
1.	打开Proxifier → 配置文件 → 代理服务器 → 添加
2.	地址：127.0.0.1，端口：8080，协议：HTTPS → 确定
3.	配置文件 → 代理规则 → 添加
4.	名称：Wechat（任意）
应用程序：wechat*.exe（通配符匹配微信所有进程）
目标主机：任意
目标端口：任意
动作：选择刚才创建的代理服务器
5.	Burp监听127.0.0.1:8080
6.	打开微信小程序，流量自动转发到Burp
    Proxifier优势：
        可基于进程、目标主机、目标端口精细筛选
        针对无代理设置选项的PC应用/小程序尤其有效

#### 3.4 PC应用抓包（C/S客户端）
###### **以腾讯文档PC版为例**

**方法一：系统代理（简单但不推荐）**

- 直接设置系统代理指向Burp（`127.0.0.1:8080`）

- <mark>**缺点**：所有流量都走代理，干扰信息多，且部分应用检测代理后拒绝运行</mark>

<mark>方法二：Proxifier*进程级*抓包（推荐）</mark>

1	找到目标进程名（任务管理器 → 腾讯文档 → 进程名如TencentDocs.exe）
2	Proxifier添加代理服务器：127.0.0.1:8080（HTTPS）
3	代理规则 → 添加 → 应用程序填TencentDocs.exe（可用通配符*）
4	动作选择代理服务器
5	Burp监听127.0.0.1:8080
6	操作腾讯文档（登录、打开文件等），Burp抓包分析

Proxifier 注入 `TencentDocs.exe`,劫持它的 Winsock 调用,把原本要连目标服务器的那次 `connect()` 改成连 `127.0.0.1:8080`,再发 `CONNECT docs.qq.com:443`。腾讯文档全程以为自己直连了。

    ⚠️ 权限问题：部分大型应用（如360、腾讯系）有高权限保护，进程级抓包工具无法获取其数据，需更高权限或后续逆向课程解决。

## 五、核心操作流程图（可复现）

### 5.1 标准抓包流程（Web / APP）

```text
环境准备
    ↓
安装证书（本地浏览器 + 模拟器 / 目标设备）
    ↓
选择工具
    ├── Charles / Fiddler
    │     ↓
    │   启动即用
    │     ↓
    │   筛选目标域名
    │     ↓
    │   分析数据包
    │
    └── Burp Suite
          ↓
        配置代理监听
          ↓
        目标设备设置代理
          ↓
        开启拦截
          ↓
        抓包 / 修改 / 重放
```

---

### 5.2 无代理场景抓包流程（小程序 / PC 应用）

#### 方法一：Charles + Burp Suite

```text
环境准备（证书安装）
    ↓
Charles 抓取
（自动抓无代理限制流量）
    ↓
Charles 设置转发到 Burp
External Proxy Settings
→ 127.0.0.1:8080
    ↓
Burp 监听 127.0.0.1:8080
    ↓
获得可测试的数据包
```

#### 方法二：Proxifier + Burp Suite

```text
Proxifier 配置
    ├── 添加代理服务器
    │     └── 127.0.0.1:8080
    │
    ├── 添加代理规则
    │     └── 指定目标进程
    │         （wechat.exe / TencentDocs.exe）
    │
    └── 动作：走代理服务器
          ↓
Burp 监听 127.0.0.1:8080
          ↓
抓包分析
```

---

## 六、常见故障排查

|现象|原因|解决方法|
|---|---|---|
|设置代理后网站 / APP 无法访问|Burp 未开启或监听地址错误|检查 Burp 是否开启，监听地址是否与代理设置匹配|
|抓不到 HTTPS 包|证书未安装或安装位置错误|重新安装证书到“受信任的根证书颁发机构”|
|模拟器抓不到包|代理 IP 错误（选成了 VMware 虚拟网卡）|使用 `ipconfig` 确认实际出网 IP，非 VMnet8 / VMnet1|
|Burp 监听不到模拟器流量|只监听了 `127.0.0.1`，未添加本机 IP|`Proxy → Options → Add` → 添加本机 IP（如 `192.168.1.6`）|
|微信小程序直接设置代理后异常|微信检测代理并限制功能|改用 Charles 转发或 Proxifier，不直接设置系统代理|
|腾讯文档等 PC 应用抓不到|高权限保护 / 无代理设置选项|使用 Proxifier 进程级转发，或后续逆向课程解决|

---

## 七、本章核心考点总结（SRC / CTF / 面试）

### 7.1 必知概念

- **抓包本质：** 中间人代理（MITM），解密 HTTPS 需安装 CA 证书。
    
- **协议边界：** Fiddler / Charles / Burp 只能抓 HTTP / HTTPS，其他协议使用 Wireshark。
    
- **代理原理：** Burp 通过本地监听端口截断流量，需要浏览器 / 设备主动指向该端口。
    
- **转发联动：** Charles（抓）→ Burp（测），解决无代理设置场景。
    

---

### 7.2 实操要点（面试常问）

- **证书安装：** 本地 + 模拟器双环境，Burp 证书需转 `.cer` 格式。
    
- **模拟器代理：** 不是 `127.0.0.1`，而是本机实际 IP（使用 `ipconfig` 查看）。
    
- **Burp 监听：** 需添加本机 IP 地址（不能只监听 `127.0.0.1`）才能抓模拟器流量。
    
- **小程序抓包：** 微信直接设置代理可能异常，需要使用 Charles 转发或 Proxifier。
    
- **Proxifier 规则：** 基于进程名（如 `wechat*.exe`）强制转发到 Burp。
    

---

### 7.3 工具选择（场景题）

|场景|推荐工具|
|---|---|
|快速查看流量|Charles / Fiddler|
|渗透测试 / 改包 / 重放|Burp Suite（需配合代理）|
|无代理设置的小程序 / PC 应用|Charles + Burp 或 Proxifier + Burp|

---

### 7.4 故障诊断（排错题）

- **网站打不开**
    
    - 检查 Burp 是否开启。
        
    - 设置代理后，对应代理工具必须处于运行状态。
        
- **本地靶场抓不到**
    
    - 删除代理排除列表中的本地地址。
        
- **HTTPS 显示乱码 / 无法访问**
    
    - 检查 CA 证书是否正确安装。
        
- **模拟器无流量**
    
    - 检查代理 IP 是否选择正确。
        
    - 不要使用 VMware 虚拟 IP。
        
    - 检查 Burp 是否监听对应本机 IP。
        

---

### 7.5 延伸考点（后续课程预告）

- **反代理检测绕过**
    
    - APP 检测到代理环境后直接断网，如何绕过？
        
- **证书固定（SSL Pinning）**
    
    - APP 内置证书，如何突破？
        
- **非 HTTP 协议**
    
    - 游戏封包、TCP 自定义协议等使用 Wireshark 分析。
        

---

## 八、抓包技术的应用价值（为什么要学）

| 应用场景          | 具体说明                                   |
| ------------- | -------------------------------------- |
| **目标发现**      | 获取 APP / 小程序的后端 API 接口、域名、IP 地址，明确测试目标 |
| **漏洞测试**      | 分析数据包参数，测试 SQL 注入、越权、未授权访问、信息泄露等       |
| **逆向分析**      | 抓取加密数据，分析算法逻辑，构造请求实现越权或自动化             |
| **SRC / CTF** | 小程序、APP 类题目 / 漏洞挖掘的必备前置技能              |
