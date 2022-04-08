---
layout: post
title:  "舒适远程科研指南"
date:   2021-2-27 15:00:00
categories: Tools
---

## Introduction 

最近经常需要远程链接各种服务器和超算集群，在这里总结一下远程科研调参的经验。 本文主要侧重如何使用远程使用linux的server。在server没有公网ip，没有sudo权限，需要多次jump等各种复杂情况下，本文给出了舒适的解决方案。

## 各种使用的软件和方法综述

1. 小白如何远程桌面控制：
	- Teamviewer：老牌远程桌面软件。安装方便，使用便捷。缺点是用多了会要求你买licence（500刀每年），否则一分钟自动断联。
	- AnyDesk：新进竞争对手，和teamviewer几乎完全对标。免费版够用
	- 花生壳远程桌面：没用过，听说国内比较好用。
2. 聪明的小白如何远程桌面：RDP，VNC
	- 上述软件为纯视频流传输，对带宽要求较高
	- RDP：适用于windows，默认3389端口，需要有外网端口（见util1：端口穿透）
	- VNC：适用于linux，同样需要外网端口。
3. 码农如何远程连接server：ssh
	- 直接使用自带ssh即可，windows 10在19年后就自带ssh了，不需要用putty这种丑丑的软件了
	- 让windows terminal更美观：微软官方的Windows terminal在应用商店可以下载，很好看很不错
	- 需要多次跳跃的ssh：在config中设置ProxyJump实现多次跳跃
	- screen：保证你退出后，程序可以接着跑的terminal神器
4. 远程科研数据传输：
	- scp：传统命令行传输。`scp -r original target`
	- fiilezilla：加了GUI的ftp，sftp软件
	- winSCP：另外一个windows的GUI界面软件
5. 远程科研改代码和调参
	- Visual Studio Code：注意是code不是visual studio，这两者差别很大。
		- 安装remote development插件，建立ssh的config文件，使用ssh key登陆（而不是密码），实现远程查看code
		- 安装python插件后可调试python，安装pylance后智能补全，查找代码
	- code-server：可以让你在任何web浏览器中使用vscode
	- jupyter notebook：远程使用notebook，优点是所见即所得，缺点是无法调试无法维护大型项目
	- tensorboard：在程序运行时查看各种输出情况和对比。
	- 微信推送程序运行情况：通过企业公众号api，实现在程序出错，运行到关键点或程序完成时推送信息。
	- 以上各应用均需公网端口
6. 端口穿透：
	- 如果你有任何一个公网地址：使用frp
		- 需要手动设置路由器进行端口forward
	- 如果你完全没有：使用ngrok

## 远程ssh连接server

### ssh设置

### 基本使用

#### ssh命令使用

远程至ip地址为`$IP`，用户名为`$USER`，输入如下指令后按回车输入密码后再回车：

```bash
ssh $USER@$IP
```

若端口不为默认端口(22端口)，为`$PORT`则改为，

```bash
ssh -p $PORT $USER@$IP 
```

若需要多次跳跃，则重复如上指令。

第一次使用会问你是否认识这个地址，如果没问题的话键入yes。如果不是第一次使用，但却问你这个问题，或者不问你问题直接告诉你出错了，你要小心服务器被替换了，可能有人劫持了服务器。ssh是明文传输密码的劫持了服务器后他可以拒绝你然后得到你的密码。

如果确实是你本人更改了服务器的配置导致的验证出错，打开`~/.ssh/know_hosts`删除对应ip地址的整行即可。

#### Windows端ssh

Windows 10 2019版本之后自带ssh client，可以通过命令行直接使用。Windows打开命令行的方式有如下几种：

- （推荐）下载安装[Windows Terminal](https://www.microsoft.com/store/productId/9N0DX20HK701)；
- 打开开始菜单，输入`cmd`打开命令行，或者输入`powershell`打开高级版命令行；
- 在左下角开始菜单键处右键，选择`cmd`或者`powershell`。

若提示`ssh`找不到，下载安装openssh client，详见：[Here](https://winscp.net/eng/docs/guide_windows_openssh_server)

#### Linux端ssh

Linux自带ssh，如果真的没有，下载安装openssh，详见：[Here](https://www.openssh.com)

### 舒适使用

#### 使用config

记入config后可以自定义名称无需输入端口地址和用户名：`ssh server` 直接登录。

- config文件的位置：
	- Windows：`C:\Users\$USER\.ssh\config`
	- Linux: `/home/$USER/.ssh/config` 

- config文件示例：
	- 前两行用于防止某些服务器会有60不活动自动退出的设置，这两行声明后会每60秒发送一个包，保证ssh不会自动退出。
	- 后面可以有任意多个客户端，如下所示，设置后可以直接用`ssh example` `ssh example2` 登陆

```
Host *
    ServerAliveInterval 60
Host example
    HostName $IP
    port $PORT
    User $USER
Host example2
    HostName $IP
    port $PORT
    User $USER
```

适用于需要两部跳跃的ssh服务端：

如果ssh需要跳板机（ip，用户名为\$IP1, \$USER1)登陆，即需要先ssh到一个位置，再次ssh到第二服务器（ip，用户名为\$IP2, \$USER2)，可以这样设置config一步到位，直接`ssh example`即可：

```
Host Jumper
	HostName $IP1
	User $USER1
Host example 
	HostName $IP2
	User $USER2
	ProxyJump Jumper
```

在windows中，需要将`ProxyJump`行替换为：`ProxyCommand C:\Windows\System32\OpenSSH\ssh.exe Jumper netcat -w 120 %h %p`

如果设置了SSL key，需要在跳板机和服务器同时放置相同的公钥。如果未设置，需要两次输入密码。

#### 使用SSL key登陆

SSL key由私钥和公钥组成。生成秘钥对后，将私钥放在本地，公钥放在服务器端，就可以跳过输入密码的过程。这对频繁使用着极其重要。

##### 生成秘钥对

 openssh自带生成软件，如果能用ssh肯定能用ssh-keygen。步骤如下：

1. 在terminal / cmd / powershell 中输入：`ssh-keygen`；

2. 询问保存位置，保存位置缺省值为config所在文件夹，如果不想指定位置，直接回车；
3. 询问是否给key设置passphrase，无需设置，直接回车；
4. 在config所在文件夹（`~/.ssh`)会出现两个文件，一个公钥`id_rsa.pub`， 一个私钥`id_rsa`

##### 将秘钥放入特定位置

- 将私钥留在config所在文件夹
- 将公钥放置在服务器端的`/home/$USER/.ssh/authorized_keys`，一个服务器可以有多个公钥，所以若不存在这个文件，创建文件；若已存在，则另起一行黏贴公钥中所有内容。
- 秘钥是可以直接复制黏贴的，但需要注意的是公钥一般只有一行，但私钥是多行。私钥需要完整的复制黏贴包括每一行和最后的换行。

##### SSL key还有什么用

- 它还可以用于舒适使用git的任何操作。
- 特别另起一段是因为2020年有个[公司ICO](https://zhuanlan.zhihu.com/p/108444058)给每个在github上留过公钥的人发了约等价于0.06比特币的xx币，凭私钥领取。笔者20年3月领了以后手上握了10个月白嫖了一万八;)

## 通过ssh进行数据传输

### 命令行数据传输基础

openssh自带sftp，也就是比较安全的ftp，能用ssh就能用sftp，命令是scp，拷贝文件或文件夹的指令如下：

```bash
scp -r $ORIGINAL_PATH $TARGET_PATH
```

- `-r`是拷贝文件夹，如果只是文件无需这个。
- 如果是从服务器下载，则前者是服务器地址后者是本机地址；上传则反之。
	- 本机地址可以使绝对路径也可以是相对路径
	- 服务器路径必须为绝对路径。假设要拷贝的服务器路径在服务器为：`/home/user/$PATH`，那么这里键入`$NAME://home/user/$PATH`
		- 如果你设定了config，`$NAME`就是你设置的名字，否则是`$USER@$IP`。
	- Path中可以使用正则通配符。

### 进阶

使用rsync，支持断点续传。详见：[Here](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories)

## 远程科研软件介绍

### Visual studio Code

本文极力推荐VS code，它可以实现远程码字调参调试程序全流程和本机保持一致。

#### VS Code的配置与使用

- 下载地址：[Here](https://code.visualstudio.com/download) 约100MB；
- 傻瓜式安装即可，各客户端通用；
- 注意事项Visual Studio Code，不是Visual Studio。后者是一个超过10G的产品。

##### 安装插件

插件是VS Code的灵魂，这里介绍几个好用的。

- Remote Development ：远程调参必备。
- Chinese (Simplified) Language Pack for Visual Studio Code ：中文本地化包
- Material Icon Theme ：一个主题
- Increment Selection ：自动键入多行
- Python ：python调试，高亮必备
- Pylance ：python智能高亮高级版
- Visual Studio IntelliCode ：代码自动补全高级版（AI）

安装方法：

1. 左边状态栏第五个Extensions
2. 直接在搜索框搜索。

注意远程后需重新安装，不能直接用本地的。

##### 高阶功能

- 多客户端同步设置：左下角登陆microsoft/github账号。
- Cheat sheet：[Here](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)

#### 远程使用ssh客户端

- 使用远程功能需要配置好ssh的config，安装Remote Development的插件，并且可以实现免密码直接登录（用SSL KEY）。
- 安装完插件后，左边状态栏会出现远程小图标，点选后，会出现所以ssh config中设定过的服务器。选择文字边上的加号即可打开新窗口使用。
- 进入新窗口后，第一次使用中间上边会提示是否信任，选择yes。然后后台会开始配置，会在服务器中下载一些文件。之后就很快了。
- 进入新窗口后，左下角会和之前的窗口不一样，会显示：`SSH:xxx`，这就进入了远程服务器了，打开文件，文件夹打开的均为服务器的路径。
- 像往常一样使用吧;)



## 远程桌面

待完善

### Windows Remote Desktop
#### Change port [1](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/change-listening-port) 

- Change listening port
	- `Win` + `registry editor` + `enter`
	- Navigate to the following registry subkey: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp\PortNumber` and change it to new port number `%d` (1000~65535)
- Add new firewall rule
	- In administrator terminal, type `New-NetFirewallRule -DisplayName "New RDP Port 1350" -Direction Inbound -LocalPort 1350 -Protocol TCP -Action allow` and `New-NetFirewallRule -DisplayName "New RDP Port 1350" -Direction Inbound -LocalPort 1350 -Protocol UDP -Action allow`, change 1350 to port you set.
- Restart the sevice
	- In the same terminal, type `net stop termservice & net start termservice`



## 附录1：端口映射

待完善

### Ngrok

适用于没有其他任何拥有公网IP服务器控制权的人，如果你不知道这是啥，那就是没有。

- 下载安装：[https://ngrok.com/](https://ngrok.com/)
	- [Download for Raspbarry](https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip)

			unzip /path/to/ngrok.zip
			cd ngrok
			(edit ngrok.yml)
			ngrok start -config ngrok.yml


### frp 

- [Download for 32-bit Raspbarry](https://github.com/fatedier/frp/releases/download/v0.29.0/frp_0.29.0_linux_arm.tar.gz)

