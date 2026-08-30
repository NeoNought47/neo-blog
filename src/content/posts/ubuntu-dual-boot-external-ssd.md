---
title: "Ubuntu 26.04 装到外接 SanDisk SSD —— 双系统安装教程"
date: 2026-07-07T10:00:00
tags: ["Linux"]
---

**目标盘布局（SanDisk 约 931 GiB）**

| 分区 | 大小 | 格式 | 挂载点 |
|---|---|---|---|
| EFI 系统分区 | 1 GiB | FAT32 | `/boot/efi`（勾 esp/boot 标志） |
| Ubuntu 根分区 | 100000 MB（约 100 GB） | ext4 | `/` |
| 数据分区 | 剩余约 830 GiB | exFAT | 装完系统后再建 |

**核心原则：全程只碰 SanDisk，内置盘（nvme 开头）一个字节都不动。**

---

## 第 0 步：分清两个 USB 设备

- **普通 U 盘**（8 GB 以上）：只做安装盘，装完就拔。
- **SanDisk 移动固态**（约 931 GiB）：系统和数据最终落脚的盘。

别搞反。

---

## 一、准备阶段

1. **备份 SanDisk 里的所有数据**（照片、视频、项目文件）到内置盘、另一块移动硬盘或云盘。装机会重排整块盘的分区，原有数据全部消失。**这是唯一没有后悔药的一步，没备份齐千万别往下走。**
2. 从 `ubuntu.com/download` 下载 Ubuntu 26.04 LTS 桌面版 ISO（约 6.5 GB，注意架构选 amd64）。

---

## 二、Windows 侧准备（在外星人上做，不是 Mac）

3. **关掉快速启动**：控制面板 → 电源选项 → 选择电源按钮的功能 → 点"更改当前不可用的设置" → 取消勾选"启用快速启动" → 保存。
4. **备份 BitLocker 恢复密钥**：Win11 外星人一般默认开了设备加密。到 `microsoft.com/link` 登录微软账号，把那串 24 位恢复密钥导出存好，防止进 BIOS 时弹恢复提示。

---

## 三、制作安装 U 盘

写盘这一步在 Windows 或 Mac 上做都行，U 盘做好后拿到外星人上启动即可。

### 方式 A：Windows + Rufus

5. 用 Rufus 把 Ubuntu ISO 写进**普通 U 盘**（不是 SanDisk）。
   - 分区类型：**GPT**
   - 目标系统：**UEFI**
   - 其余默认；问 ISO 还是 DD 模式，选推荐的那个。

### 方式 B：Mac + balenaEtcher

5. 到 `etcher.balena.io` 下载 macOS 版 balenaEtcher，三步：
   1. 点 **Flash from file**，选下载好的 `ubuntu-26.04-desktop-amd64.iso`。
   2. 点 **Select target**，选**普通 U 盘**。
      > ⚠️ 全程唯一要瞪大眼睛的地方：**千万别选到 SanDisk**。靠容量认——U 盘通常几十 GB，SanDisk 是 931 GB 左右。列表里冒出 900 多 GB 的选项就是 SanDisk，别碰。
   3. 点 **Flash!**，输 Mac 密码授权，等它自动写入 + 校验（几分钟），出现 "Flash Completed!" 即完成。

6. **拔 U 盘时**，macOS 会弹"此电脑不能读取您插入的磁盘 / 要初始化吗"——点**忽略**，绝对不要点"初始化"或"格式化"。这是正常的，U 盘现在是 Linux 格式 Mac 认不出，但盘是好的。

> 不建议用 `dd` 命令：写错目标盘会瞬间抹掉整个硬盘且无任何提示。

---

## 四、BIOS 设置（有个大坑）

7. 重启，见外星人 logo 狂按 **F2** 进 BIOS，确认两条后直接退出：
   - **铁律：千万不要把存储模式从 "RAID On" 改成 "AHCI"。** Windows 是在 RAID/VMD 模式下装的，一改就蓝屏起不来。保持 RAID On 不变。（RAID On 状态下 Ubuntu 安装器往往看不到内置盘，反而成了防误操作的保险。）
   - **Secure Boot 保持开启**，Ubuntu 26.04 原生支持，别关。
   - 确认 USB 启动允许（一般默认开）。

---

## 五、从 U 盘启动进安装器

8. 安装 U 盘和 SanDisk **两个都插上**。SanDisk 直插机身 USB-C 口、用原装短线、插紧。
9. 重启，狂按 **F12** 进一次性启动菜单，选那个 U 盘的 **UEFI** 条目。
10. 进 Ubuntu 界面选 **"Try or Install Ubuntu"**，走完语言、键盘、联网。

---

## 六、分区（核心，只动 SanDisk）

11. "安装类型"这步：**不要**选 "Install alongside Windows"（会压缩内置盘），也**不要**选 "Erase disk"。选 **"Manual installation / Something else"**。
12. **认准 SanDisk**：约 931 GiB（≈1 TB）、显示为 `/dev/sda` 或 `/dev/sdb` 这类 USB 设备；**不是 nvme 开头的**（那是内置盘，别碰）。
13. 在 SanDisk 上**新建 GPT 分区表**（再确认一次选的是 SanDisk），然后建两个分区：
    - **EFI 系统分区**：1 GiB，FAT32，挂载点 `/boot/efi`，勾 esp/boot 标志。
    - **Ubuntu 根分区**：大小填 **100000 MB**（安装器按 MB 算，约 100 GB），格式 **ext4**，挂载点 `/`。
14. 剩余约 830 GiB **留成 "free space / 未分配"**，先别管它——exFAT 稍后再做。
15. **swap 不用单独建**，26.04 自动用 swapfile。
16. 界面下方若有 **"Device for boot loader installation / 引导器安装位置"** 下拉框，选**整块 SanDisk**（如 `/dev/sda`，不是某个分区）。这一步 + EFI 分区一起，保证引导只写进外接盘。

---

## 七、安装收尾与首次启动

17. 确认无误，开始安装。
18. 装完提示重启时，**务必拔掉安装 U 盘**，SanDisk 留着。
19. 重启按 **F12** 进启动菜单，会看到 **"ubuntu"**（SanDisk）和 **"Windows Boot Manager"** 两个条目，选哪个进哪个。
    - 平时不插 SanDisk 就直接进 Windows；两套引导独立，哪天把 SanDisk 格了 Windows 也毫发无伤。
    - GRUB 菜单里不会列出 Windows，这是正常的，靠 F12 切换。
20. 若出现蓝色的 **MOK 管理界面**（安装时设过 MOK 密码时会出现）：选 **Enroll MOK → Continue → Yes → 输密码**。没出现就跳过。

---

## 八、建立 exFAT 数据分区

系统能正常进入后，把预留的约 830 GiB 做成 exFAT。

21. **方式 A（在 Windows 上做，最省事）**：把 SanDisk 插到 Windows → 右键"此电脑" → 管理 → 磁盘管理 → 找到 SanDisk 上那块"未分配"空间 → 右键 → 新建简单卷 → 文件系统选 **exFAT** → 一路下一步。
22. **方式 B（在 Ubuntu 里做）**：
    ```bash
    sudo apt install gparted exfatprogs
    ```
    用 GParted 把那块空闲空间格成 exFAT，效果一样。
23. 把之前备份的照片视频**拷回这块 exFAT 分区**。之后往里加删文件跟普通移动硬盘一样自由，完全不影响 Ubuntu 那 100 GB。

> 选 exFAT 是因为它在 Windows、macOS、Linux、相机上都能原生读写，放照片视频最通用。

> ⚠️ 以后把 SanDisk 插到 Windows，可能会弹"需要格式化此驱动器"——那是 Windows 不认识 ext4 的 Ubuntu 分区。**点取消，千万别格式化。**

---

## 九、装完之后建议做的两件事

24. **装 NVIDIA 驱动**：打开"附加驱动 / Additional Drivers"选专有 NVIDIA 驱动，或终端执行：
    ```bash
    sudo ubuntu-drivers install
    ```
    然后重启。
25. **查 TRIM 是否透传**：
    ```bash
    lsblk -D
    ```
    看 SanDisk 那行 `DISC-MAX` 列，为 0 说明 USB 桥接没透传 TRIM。

---

## 附录：常见故障排查

### 重启后报 `SQUASHFS error ... -5`

原因：安装 U 盘没拔干净，系统重启时又去读 U 盘上的镜像，读取失败。SquashFS 是 U 盘里 Ubuntu 镜像的压缩文件系统，`-5` 是 I/O 读取错误——说明它还在试图从安装 U 盘启动，而不是从 SanDisk。**系统本身没坏，只是启动选错了介质。**

处理步骤：

1. **强制关机**：长按电源键几秒直到彻底断电。
2. **拔掉安装 U 盘**。SanDisk 留着别动、插紧。
3. **开机狂按 F12** 进启动菜单，不要让它自动启动。
4. **选 SanDisk 的启动项**：菜单里应该有一个 "ubuntu" 条目（带 UEFI 字样）。看到多个时，认准写着 `ubuntu` 或 `SanDisk / Extreme` 的那个，别选到 U 盘或 Windows Boot Manager。
5. 若出现蓝色 MOK 界面：Enroll MOK → Continue → Yes → 输密码。没出现就跳过。

### F12 里看不到 U 盘 / ubuntu 条目

- 确认 BIOS 里 USB 启动是开启的。
- 确认选的是带 **UEFI** 字样的条目。
- SanDisk 换回原装短线、直插机身 USB-C 口、插紧，避免转接头或延长线导致识别失败。

---

# 附录二：在 Ubuntu 里把剩余空间做成普通数据盘（详细版）

目标：把第 14 步预留的约 830 GiB 未分配空间，做成一个像普通移动硬盘一样随便存取的 exFAT 分区，并让它每次开机自动挂载到一个固定位置。

全程在已经装好的 Ubuntu 系统里操作。

---

## A. 安装工具

```bash
sudo apt update
sudo apt install gparted exfatprogs
```

- `gparted`：图形化分区工具
- `exfatprogs`：exFAT 的格式化与检查工具（没有它 GParted 里的 exFAT 选项会是灰的）

---

## B. 先确认盘符，别认错盘

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT,MODEL
```

输出里找 **SanDisk / Extreme**、总容量约 931G 的那块，通常是 `/dev/sda` 或 `/dev/sdb`。它下面应该已经有两个子分区：

```
sda           931.5G disk           SanDisk_Extreme
├─sda1            1G part vfat      /boot/efi
└─sda2         93.1G part ext4      /
```

`sda1` 和 `sda2` 之后剩下的就是未分配空间。

> ⚠️ 千万别选到 `nvme0n1` 之类——那是内置盘，上面是 Windows。

---

## C. 方式一：用 GParted 图形化操作（推荐）

1. 启动 GParted：

   ```bash
   sudo gparted
   ```

2. **右上角的下拉框，切换到 SanDisk**（如 `/dev/sda`）。默认打开的可能是内置盘，务必先切换，并核对总容量是 931 GiB 左右。

3. 找到那条标着 **unallocated（未分配）** 的灰色区块，右键 → **New**。

4. 弹窗里这样填：
   - **New size**：默认就是全部剩余空间，直接用，不用改。
   - **Create as**：`Primary Partition`
   - **File system**：**exfat**
   - **Label**：随便起个名，比如 `DATA`（这个名字之后会显示在文件管理器和 Windows 里）
   - 点 **Add**。

5. 点工具栏的 **✓（Apply All Operations）** → Apply，等它跑完。830 GiB 的 exFAT 格式化很快，通常几秒到几十秒。

6. 关掉 GParted，重新插拔一下或直接在文件管理器左侧点那个新分区，就能挂载使用了。

---

## D. 方式二：用命令行操作

如果不想开图形界面：

```bash
# 1. 再确认一次盘符（把下面的 sda 换成你实际的）
lsblk

# 2. 在剩余空间上新建一个分区（分区号会自动接在 sda2 之后，即 sda3）
sudo parted /dev/sda --script mkpart data 100GB 100%

# 3. 让内核重新读取分区表
sudo partprobe /dev/sda

# 4. 确认新分区已出现
lsblk /dev/sda

# 5. 格式化为 exFAT，卷标设为 DATA
sudo mkfs.exfat -n DATA /dev/sda3
```

> `mkpart` 的起点 `100GB` 是接在根分区之后的位置。如果 `parted` 提示对齐警告（"not properly aligned for best performance"），选 `Ignore` 影响不大；想彻底避免，可以改用上面的 GParted 方式，它会自动对齐。
