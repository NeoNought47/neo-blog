---
title: "Security+随手笔记"
titleEn: "Security+ Quick Notes"
date: 2026-07-18
posted: 2026-11-14
tags: ["Cybersecurity", "Learning Notes"]
---

刷 Security+（SY0-701）题时随手记下的术语，按字母排序。

## A

- **ABAC**：Attribute-Based Access Control，基于属性的访问控制，例如身份、地点、时间等
- **Accepted risk**：接受风险，认为剩余风险可接受，不再采取额外措施
- **AES**：Advanced Encryption Standard，对称加密
- **ALE**：Annualized Loss Expectancy，年化损失期望
- **APT**：Advanced Persistent Threat，高级持续性威胁
- **ARO**：Annualized Rate of Occurrence，年化发生率
- **ARP**：Address Resolution Protocol，把 IP 解析成 MAC；不带认证
- **ARP poisoning / spoofing**：伪造 ARP，让 LAN 里的设备把攻击者当成 gateway / 目标主机
- **Attestation**：管理层正式声明指定控制已存在并按描述运行
- **Authentication**：Identification，确认你是谁
- **Authorization**：What can be accessed，决定你能访问什么
- **AV**：Antivirus，杀毒软件

## B

- **BIA**：Business Impact Analysis，业务影响分析
- **BPA**：Business Partner Agreement，商业伙伴协议；合作、数据共享、保护数据等责任
- **BYOD**：Bring Your Own Device，员工自带设备

## C

- **CASB**：Cloud Access Security Broker，云访问安全代理；用户和云服务之间的控制点，保护云服务
- **Certificate pinning**：App / browser 只信任某个指定证书或 public key
- **Chain of custody**：证据保管链，完整记录证据由谁、何时、为何处理和转交
- **CHAP**：Challenge Handshake Authentication Protocol，质询握手认证协议，不直接发送 password
- **Cluster**：多台服务器一起处理 / 提供服务
- **COBO**：Corporate-Owned, Business-Only，公司拥有，仅限办公
- **Cold Site**：只有场地、电力等基础条件
- **Compliance**：合规
- **Containerization**：把应用和它需要的依赖打包到一个容器中运行
- **Containment**：遏制，限制事件扩散
- **COPE**：Corporate-Owned, Personally Enabled，公司拥有设备，允许个人使用
- **CPE**：Common Platform Enumeration，受影响平台 / 产品标准命名
- **CRL**：Certificate Revocation List，证书吊销列表
- **CSRF**：Cross-Site Request Forgery，攻击者诱导已登录用户的 browser 向网站发未同意的请求，利用 session / cookie
- **CVE**：Common Vulnerabilities and Exposures，漏洞唯一编号
- **CVSS**：Common Vulnerability Scoring System，漏洞 0 到 10 的严重性评分
- **CYOD**：Choose Your Own Device，员工从公司批准列表中选择设备

## D

- **DAC**：Discretionary Access Control，自主访问控制；资源拥有者决定访问权限
- **Data retention policy**：数据保留策略，规定不同类型数据保存多久、在哪里保存、何时删除
- **Decommissioning**：device 下线 / 退役流程
- **DHCP**：Dynamic Host Configuration Protocol，自动分配 IP、subnet mask、gateway、DNS 等网络配置
- **Diffie-Hellman**：Key exchange，密钥交换
- **DKIM**：DomainKeys Identified Mail，给 email 加数字签名，证明域名来源和内容未被篡改
- **DLP**：Data Loss Prevention，数据泄露 / 数据丢失防护
- **DMARC**：Domain-based Message Authentication, Reporting, and Conformance；防止伪造 email，结合 SPF / DKIM；如果 SPF / DKIM 失败，定义如何处理：none、quarantine、reject
- **DMZ**：Demilitarized Zone，网络隔离区域，通常放公开服务器
- **DOM-based XSS**：前端 JS 读取 URL 参数并写入页面，导致浏览器执行恶意脚本

## E

- **E-discovery**：电子发现，诉讼 / 调查中查找、收集、提交电子数据
- **EAP**：Extensible Authentication Protocol，802.1X / Wi-Fi / VPN 认证框架，支持密码、证书等
- **ECC**：Elliptic Curve Cryptography，椭圆曲线密码学，非对称
- **EDR**：Endpoint Detection and Response，端点检测与响应
- **EF**：Exposure Factor，暴露因子 / 损失百分比
- **EOL**：End of Life，生命周期结束 / 停止支持

## F

- **FaaS**：Function as a Service / Serverless，不管服务器，只按函数执行时间计费
- **Fat client**：用本机性能的 program，本地处理较多
- **FIM**：File Integrity Monitoring，文件完整性监控
- **Forensic**：取证；找出发生了什么、attack 干了什么
- **Forensic media**：取证介质
- **Fuzzing**：模糊测试，输入大量随机 / 异常数据来找崩溃或漏洞

## G

- **Geofencing**：根据地理位置来 approve / deny 操作
- **Guideline**：建议项 / 推荐做法

## H

- **Hot Site**：完整可用的备用站点，设备、网络、数据基本 ready，恢复最快
- **HSM**：Hardware Security Module，企业级加密 / 密钥保护硬件
- **HTTPS**：HTTP over TLS，使用 TLS 保护的 HTTP
- **HVAC**：Heating, Ventilation, and Air Conditioning，暖通空调

## I

- **IaaS**：Infrastructure as a Service，基础设施即服务
- **IAM**：Identity and Access Management，身份与访问管理
- **ICS**：Industrial Control System，工业控制系统
- **IDS**：Intrusion Detection System，入侵检测系统
- **Inherent risk**：固有风险，没有控制之前的原始风险

## J

- **Jump Server**：管理员先访问这台服务器，再跳转到内部系统

## K

- **Kerberos**：基于 ticket 的网络认证协议，常见关键词 KDC、TGT
- **Key escrow**：密钥托管 / 密钥备份；加密密钥的副本交给可信第三方 / 托管方保存
- **Key stretching**：对弱密码进行大量重复计算，增加破解成本
- **KPI**：Key Performance Indicator，关键绩效指标，衡量工作表现
- **KRI**：Key Risk Indicator，关键风险指标，风险是否升高的预警

## L

- **LDAP**：Lightweight Directory Access Protocol，轻量目录访问协议
- **LDAPS**：LDAP over SSL / TLS，安全 LDAP
- **Legal hold**：法律保全，诉讼 / 调查时暂停删除，保留 email、logs、backup 等
- **Live acquisition**：对运行中的系统进行取证采集
- **Load Balancer**：把用户请求分发到多台服务器

## M

- **MAC**：Mandatory Access Control，强制访问控制；OS / 安全策略决定访问，基于 labels / levels
- **MDM**：Mobile Device Management，移动设备管理系统
- **MIB**：Management Information Base，SNMP 维护的一组可被监控的指标数据库
- **MOU**：Memorandum of Understanding，谅解备忘录；双方合作意向，通常不强制
- **MSA**：Master Service Agreement，主服务协议
- **MSP**：Managed Service Provider，托管服务提供商
- **MTBF**：Mean Time Between Failures，平均故障间隔时间
- **MTTR**：Mean Time To Repair / Recover，平均修复 / 恢复时间

## N

- **NAC**：Network Access Control，网络访问控制；控制谁能进入网络，检查 posture
- **NDA**：Non-Disclosure Agreement，保密协议
- **NetFlow**：监控网络流量、流向和使用情况
- **Network Tap**：复制网络流量给监控 / 分析工具
- **NIST**：National Institute of Standards and Technology，美国国家标准与技术研究院
- **NIST Response**（事件响应流程）：
  1. Preparation
  2. Detection & Analysis
  3. Containment
  4. Eradication
  5. Recovery
  6. Lessons Learned

## O

- **OCSP**：Online Certificate Status Protocol，在线证书状态协议
- **On-premises virtualization**：本地虚拟化 / VM
- **OSINT**：Open Source Intelligence，开源情报

## P

- **PA**：Policy Administrator，策略管理员；把 PE 的决定下发 / 通知 PEP，位于 Control Plane
- **PAM**：Privileged Access Management，特权访问管理；管理高权限账号，防止滥用
- **Pass the Hash**：使用偷来的 hash 认证，不需要明文密码
- **PE**：Policy Engine，策略引擎；做允许 / 拒绝判断，位于 Control Plane
- **PEP**：Policy Enforcement Point，策略执行点；执行访问控制，位于 Data Plane，例如防火墙、网关
- **Perfect Forward Secrecy (ephemeral keys)**：使用临时会话密钥；长期私钥泄露后，过去的通信仍无法被解密
- **Pharming**：改 DNS / hosts，把用户重定向到假网站
- **Policy**：高层规则 / 方针
- **Procedure**：一步一步操作流程
- **Proxy**：
  - **Forward proxy**：正向代理；代表 client 访问外部 server，可隐藏 client / 控制访问
  - **Reverse proxy**：反向代理；代表 server 接收 client 请求，可隐藏 server / 控制访问 / 过滤 / WAF

## R

- **RADIUS**：Remote Authentication Dial-In User Service，集中式 AAA 认证 / 授权 / 计费服务，常用于 802.1X、Wi-Fi、VPN
- **RAID**：Redundant Array of Independent Disks，独立磁盘冗余阵列；多块磁盘组合，提高性能 / 容错 / 容量
  - **RAID 0**：条带化 / striping，无冗余
  - **RAID 1**：Mirroring，镜像，两块盘存相同数据
  - **RAID 5**：Striping + parity，至少 3 块盘，可容忍 1 块盘故障
  - **RAID 6**：Dual parity，至少 4 块盘，可容忍 2 块盘故障
  - **RAID 10**：Mirrored stripes，至少 4 块盘，兼顾速度和冗余
- **RBAC**：Role-Based Access Control，基于角色的访问控制，例如 HR、Finance、IT、regular user
- **Recovery Testing**：手动执行恢复流程测试
- **Reflected XSS**：通过 URL 请求 / 请求参数反射回页面，例如 malicious link / URL param
- **Residual risk**：剩余风险，控制之后仍然存在的风险
- **RPO**：Recovery Point Objective，最大可接受数据丢失量 / 时间窗
- **RSA**：非对称加密，使用 public key / private key
- **RTO**：Recovery Time Objective，最大可接受恢复时间
- **RTOS**：Real-Time Operating System，实时操作系统；汽车、工业、军事等需要固定时间内响应的系统

## S

- **SaaS**：Software as a Service，云端软件，例如 Outlook、Zoom、Google Docs
- **SAE**：Simultaneous Authentication of Equals，WPA3-Personal 使用的认证方式，防离线字典攻击
- **SAML**：Security Assertion Markup Language，用于 SSO 的身份断言标准
- **SASE**：Secure Access Service Edge，把网络和安全功能放入云端统一服务
- **SCADA**：Supervisory Control and Data Acquisition，监督控制与数据采集；工业 / 基础设施监控控制系统
- **SCAP**：Security Content Automation Protocol，安全内容自动化协议
- **SD-WAN**：Software-Defined Wide Area Network，通过软件管理跨地域网络流量
- **SDN**：Software-Defined Networking，软件定义网络
- **Secure Enclave**：CPU / 设备内部安全隔离区，保护敏感数据和密钥
- **Sideloading**：不通过应用商店下载 / 安装应用
- **SIEM**：Security Information and Event Management，集中收集和分析日志 / 安全事件
- **SLA**：Service Level Agreement，服务级别协议
- **SLE**：Single Loss Expectancy，单次损失期望
- **SNMP**：Simple Network Management Protocol，网络设备监控管理协议
  - **SNMP polling**：管理站定期主动查询设备指标
  - **SNMP trap**：设备主动发送告警 / warning
- **SOAR**：Security Orchestration, Automation and Response，安全编排、自动化与响应
- **SOC**：Security Operations Center，安全运营中心；monitor、detect、respond
- **SOW**：Statement of Work，工作说明书；工作范围、交付物、时间表等
- **SPAN**：Switched Port Analyzer，交换机端口镜像 / 流量复制
- **SPF**：Sender Policy Framework，用来检查发件服务器是否被授权代表该 domain 发信
- **SSID**：Service Set Identifier，Wi-Fi 名称
- **SSL**：Secure Sockets Layer，TLS 的旧版本
- **SSO**：Single Sign-On，单点登录
- **SSRF**：Server-Side Request Forgery，攻击者让 server 替自己去请求某个地址
- **Standard**：强制性具体标准 / 规格
- **STIX**：Structured Threat Information Expression，结构化威胁情报表达格式
- **Stored XSS**：存在 database 中，例如 comment

## T

- **Tabletop Exercise**：桌上演练 / 口头演练
- **TLS**：Transport Layer Security，保护网络通信，提供 encryption、authentication、integrity
- **TPM**：Trusted Platform Module，主板上的安全芯片，可保护 BitLocker 等密钥
- **Transferred risk**：转移风险，例如购买保险或外包

## U

- **UTM**：Unified Threat Management，统一威胁管理；多合一安全网关，可能包含 firewall、IDS/IPS、antivirus、web/email filtering

## V

- **Vishing**：语音 / 电话钓鱼

## W

- **WAF**：Web Application Firewall，Web 应用防火墙，防 SQL injection、XSS、恶意 HTTP 请求
- **Warm Site**：有基本系统 / 设备，数据或 OS 需要恢复
- **Whaling**：针对高层的钓鱼攻击
- **WPA2**：Wi-Fi Protected Access 2，比 WEP / WPA 更安全，使用 AES
- **WPA2-Enterprise**：802.1X、EAP、RADIUS

## X

- **XDR**：Extended Detection and Response，扩展检测与响应
- **XSS**：JavaScript 注入网页，用户浏览时执行；攻击用户浏览器

## 待补充

还没写解释的词：

Bluejacking、Bluesnarfing、Broadcast、CAT、Cloud、Cloud-based service、Deauthentication、Degausser、DoD、DSS、ESI、Geotagging、HDE、Incremental、IPsec、IPv4、IPv6、MFA、Monolithic、MTD、Packet sniffing、PCI、PKI、SAST、SMTP、TCP/22、UDP/53、WEP、WPS

## 答题记录

```text
6A 11A 17? 24AB 31D 35? 63C 78b 80a 82a 100ad
```
