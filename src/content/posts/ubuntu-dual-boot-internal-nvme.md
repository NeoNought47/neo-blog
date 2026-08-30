---
title: "Ubuntu 26.04 装到笔记本内置硬盘 —— 双系统安装教程"
date: 2026-07-07T11:00:00
tags: ["Linux"]
---

> 适用前提与《外接 SSD 版》相同：外星人 x15 R2、Win11、Secure Boot 开启、BitLocker 设备加密、NVIDIA 独显、Ubuntu 26.04 LTS。

---

## ⚠️ 先读这一段：这份教程和外接盘版的根本区别

外接盘版的铁律是"**RAID On 千万不要改**"，因为那时不需要 Ubuntu 看见内置盘，RAID On 反而是防误操作的保险。

**这次正好相反。** 装到内置盘，就必须让 Ubuntu 安装器看见那块 NVMe，而在 **RAID On / Intel VMD** 模式下它是看不见的（安装器会显示"未检测到任何磁盘"）。所以：

> **必须把存储模式从 RAID On 改成 AHCI。**
> 但直接在 BIOS 里改，Windows 会立刻蓝屏（INACCESSIBLE_BOOT_DEVICE）起不来。
> 正确做法是先让 Windows 进"安全模式"重新加载 AHCI 驱动，再改 BIOS。详见第三章。

另外两个区别：

| | 外接 SSD 版 | 内置硬盘版（本篇） |
|---|---|---|
| 风险 | 只碰 SanDisk，Windows 毫发无伤 | **真的在动 Windows 所在的盘**，操作失误可能丢数据 |
| EFI 分区 | 在 SanDisk 上新建一个 1 GiB | **复用 Windows 已有的 EFI 分区，绝对不要格式化** |
| 切换系统 | F12 选盘 | 开机 GRUB 菜单里选 Ubuntu 或 Windows |

**动手前请完整备份内置盘上的重要资料。** 这不是客套话，这次和外接盘版不同，出错是会丢 Windows 里的东西的。

---

## 一、准备阶段

1. **备份内置盘上的重要资料**到移动硬盘或云盘。
2. **备份 BitLocker 恢复密钥**：到 `microsoft.com/link` 登录微软账号，把外星人对应的那串 24 位恢复密钥导出、打印或存到手机里。**改 BIOS 一定会触发恢复提示，没这串密钥进不去 Windows。**
3. 从 `ubuntu.com/download` 下载 Ubuntu 26.04 LTS 桌面版 ISO（约 6.5 GB，amd64）。
4. 准备一个 8 GB 以上的普通 U 盘，按下一章做成安装盘。

---

## 二、制作安装 U 盘

（与外接盘版完全一致，已经做好的可以直接跳过。）

**Windows + Rufus**：写入普通 U 盘，分区类型选 **GPT**，目标系统选 **UEFI**，其余默认。

**Mac + balenaEtcher**：`etcher.balena.io` 下载 → Flash from file 选 ISO → Select target 选 U 盘 → Flash。写完 macOS 弹"不能读取此磁盘"点**忽略**，别点初始化。

---

## 三、关键前置：安全地把 RAID On 切成 AHCI

这一章是整个内置盘方案里唯一有技术难度的地方，请严格按顺序做，**不要跳步直接进 BIOS 改**。

### 3.1 暂停 BitLocker

以**管理员身份**打开 PowerShell 或命令提示符（开始菜单搜 "cmd" → 右键 → 以管理员身份运行），执行：

```
manage-bde -protectors -disable C: -rebootcount 3
```

这会让 BitLocker 在接下来 3 次重启内不弹恢复界面，足够走完切换流程。

> 如果想更彻底，也可以在"设置 → 隐私和安全性 → 设备加密"里直接关闭加密（解密全盘要等一段时间，但之后分区最省心）。

### 3.2 让 Windows 下次以安全模式启动

同一个管理员命令行里执行：

```
bcdedit /set {current} safeboot minimal
```

### 3.3 重启进 BIOS，改存储模式

1. 重启，见外星人 logo **狂按 F2** 进 BIOS。
2. 找到 **Storage → SATA/NVMe Operation**（有的固件叫 **SATA Mode** 或 **Intel VMD Technology**）。
3. 把 **RAID On** 改成 **AHCI**；如果看到的是 **Intel VMD Controller**，把它 **Disabled**。
4. **Secure Boot 保持 Enabled**，别关。Ubuntu 26.04 原生支持。
5. Save & Exit（F10）。

### 3.4 进安全模式，让 Windows 装上 AHCI 驱动

重启后 Windows 会自动进入安全模式（画面四角有"安全模式"字样）。它会在这次启动里自动加载并注册标准 NVMe/AHCI 驱动。**进到桌面就算成功。**

### 3.5 关掉安全模式，恢复正常启动

在安全模式里再开一次**管理员命令行**：

```
bcdedit /deletevalue {current} safeboot
```

然后重启。

**这次应该正常进入 Windows 桌面 —— 到这里最危险的一步就过去了。**

### 3.6 如果不幸蓝屏了

说明安全模式那步没生效。别慌，Windows 没坏，只是驱动不匹配：

1. 关机，**F2 进 BIOS 把 AHCI 改回 RAID On**，Windows 立刻就能正常启动。
2. 回到 3.2 重新走一遍流程。

---

## 四、Windows 侧的收尾准备

回到正常的 Windows 桌面后，做完这三件再动分区。

### 4.1 关掉快速启动

控制面板 → 电源选项 → 选择电源按钮的功能 → 点"更改当前不可用的设置" → 取消勾选"启用快速启动" → 保存。

**必须做。** 否则 Windows 关机时会锁住 NTFS 分区，Ubuntu 那边读写会出问题。

### 4.2 关掉休眠

管理员命令行执行：

```
powercfg /h off
```

顺带释放掉和内存等大的 `hiberfil.sys` 文件，也避免 NTFS 被锁。

### 4.3 压缩 C 盘，腾出空白空间

1. 右键"此电脑" → **管理** → **磁盘管理**。
2. 右键 C 盘 → **压缩卷**。
3. "输入压缩空间量"填你想给 Ubuntu 的大小，单位是 **MB**：
   - 100 GB → 填 `102400`
   - 150 GB → 填 `153600`
   - 200 GB → 填 `204800`

   建议至少 100 GB。日常写代码、跑虚拟机的话给 150–200 GB 更舒服。
4. 压缩完，C 盘右边会出现一块黑色标注的 **"未分配"** 空间。**就到这里为止，不要右键新建卷**，留着给 Ubuntu 安装器用。

> **压不出那么多空间？** 那是 C 盘尾部有不可移动的系统文件挡住了。依次试：关掉系统还原（系统属性 → 系统保护 → 配置 → 禁用）→ 关掉页面文件（系统属性 → 高级 → 性能设置 → 高级 → 虚拟内存 → 无分页文件）→ 重启 → 再压缩。压完记得把这两项开回来。

---

## 五、从 U 盘启动进安装器

5. 插上安装 U 盘，重启，**狂按 F12** 进一次性启动菜单。
6. 选那个 U 盘的 **UEFI** 条目（带 UEFI 字样的才对，Legacy 的别选）。
7. 进 Ubuntu 界面选 **"Try or Install Ubuntu"**，走语言、键盘、**联网**（联网能让安装器顺手拉驱动和更新，建议连上）。

---

## 六、分区（核心）

8. "安装类型"这步的选择：
   - 如果出现 **"Install Ubuntu alongside Windows Boot Manager"**，这个选项在内置盘方案里**是可以用的**，它会自动占用你刚压出来的未分配空间。想省事可以选它，然后跳到第 14 步。
   - 想精确控制，选 **"Manual installation / Something else"**，继续往下。

9. 认盘：内置盘显示为 **`/dev/nvme0n1`**。你会看到它下面已有几个 Windows 的分区，典型如下：

   | 分区 | 大小 | 类型 | 说明 |
   |---|---|---|---|
   | `nvme0n1p1` | 100–300 MB | fat32 | **EFI 系统分区（Windows 的）** |
   | `nvme0n1p2` | 16 MB | — | MSR 微软保留分区 |
   | `nvme0n1p3` | 几百 GB | ntfs | **C 盘（Windows 本体）** |
   | `nvme0n1p4` | 500 MB–1 GB | ntfs | Windows 恢复分区 |
   | *free space* | 你压出来的 | — | **只动这一块** |

   > 🚫 **上面那四个 Windows 分区，一个都不要格式化、不要删除、不要改大小。**

10. **设置 EFI 分区（这步最容易做错）**：
    - 选中 `nvme0n1p1`（那个 100–300 MB 的 fat32），点 **Change / 编辑**。
    - **Use as** 选 `EFI System Partition`，或挂载点填 `/boot/efi`。
    - **绝对不要勾 Format（格式化）。** 格了它，Windows 的引导就没了。
    - 不新建 EFI 分区，**复用 Windows 这个就行**。

11. **建 Ubuntu 根分区**：
    - 选中那块 **free space / 空闲空间**，点 **+**。
    - 大小：全部用掉
    - 类型：**Primary**，位置：**Beginning of this space**
    - 文件系统：**ext4**
    - 挂载点：**`/`**

12. **swap 不用单独建**，26.04 自动用 swapfile。

13. **引导器安装位置（Device for boot loader installation）**：下拉框选**整块内置盘 `/dev/nvme0n1`**，不是某个分区，也不要选到 U 盘。

14. 核对一遍：只有那块空闲空间变成了 ext4 `/`，EFI 那行没打勾 Format，其余 Windows 分区状态都是"保留 / 不改"。确认无误再点 **Install Now / 现在安装**。

---

## 七、安装器里的交互步骤

15. **时区**：地图上点台北，或搜 `Taipei`。
16. **安装类型**：选 **Normal installation**（带浏览器、办公套件、播放器）。
17. **第三方驱动**：勾上"Install third-party software for graphics and Wi-Fi hardware..."。
    - 因为 Secure Boot 开着，勾了之后安装器会**要求设一个 MOK 密码**。**这个密码务必记住**，第一次重启的蓝色界面要用。
18. **创建用户**：填姓名、计算机名、用户名、密码。不建议勾自动登录。
19. 等待安装完成，提示重启时**拔掉安装 U 盘**再回车。

---

## 八、首次启动

20. **蓝色 MOK 管理界面**（设过 MOK 密码时会出现）：
    - 选 **Enroll MOK → Continue → Yes → 输入第 17 步设的密码 → Reboot**。
    - 这个界面**有 10 秒倒计时，超时会跳过**。跳过了第三方驱动在 Secure Boot 下会加载不了，看到就赶紧按方向键。

21. **GRUB 菜单**：正常情况下会列出：
    ```
    Ubuntu
    Advanced options for Ubuntu
    Windows Boot Manager (on /dev/nvme0n1p1)
    ```
    方向键选，回车进。默认 10 秒后自动进 Ubuntu。

22. **GRUB 里没有 Windows 条目？** 进 Ubuntu 后终端执行：
    ```bash
    sudo os-prober
    sudo update-grub
    ```
    正常会输出 "Found Windows Boot Manager on /dev/nvme0n1p1"。若 `os-prober` 没反应，先启用它：
    ```bash
    echo 'GRUB_DISABLE_OS_PROBER=false' | sudo tee -a /etc/default/grub
    sudo update-grub
    ```

23. **开机直接进 Windows、根本没看到 GRUB？** 说明 BIOS 启动顺序把 Windows Boot Manager 排在前面了。F2 进 BIOS → Boot Sequence → 把 **ubuntu** 拖到第一位 → 保存。

---

## 九、双系统日常使用的两个必调项

24. **让 Ubuntu 读写 Windows 的 C 盘**：文件管理器左侧点那块 NTFS 分区即可挂载读写。
    - 前提是第 4.1、4.2 两步（关快速启动、关休眠）确实做了，否则会因为分区被锁而只读或挂载失败。

25. **修正两系统时间差 8 小时**（双系统经典坑）：Windows 认为硬件时钟是本地时间，Linux 认为是 UTC。在 Ubuntu 里执行一次即可统一：
    ```bash
    timedatectl set-local-rtc 1 --adjust-system-clock
    ```

---

## 十、卸载 Ubuntu、还原成纯 Windows

万一想撤销：

1. **先在 Windows 里恢复引导**（顺序很重要，反了会开不了机）。管理员命令行：
   ```
   bcdedit /set {bootmgr} path \EFI\Microsoft\Boot\bootmgfw.efi
   ```
   或直接在 BIOS 的 Boot Sequence 里把 Windows Boot Manager 调到第一位并删掉 ubuntu 条目。
2. 重启确认能直接进 Windows。
3. 磁盘管理 → 右键那个 ext4 分区（显示为"主分区"、无盘符）→ **删除卷**。
4. 右键 C 盘 → **扩展卷**，把空间收回。
5. EFI 分区里 Ubuntu 残留的 `\EFI\ubuntu` 文件夹不影响使用，介意可用 `diskpart` 挂载 ESP 后手动删除。
