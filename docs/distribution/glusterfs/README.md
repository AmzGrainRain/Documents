# GlusterFS 安装

## 先决条件

- [Debian GNU/Linux 12 (bookworm) x86_64](https://mirrors.tuna.tsinghua.edu.cn/debian-cd/)
- [openjdk-8u43-linux-x64.tar.gz](https://jdk.java.net/java-se-ri/8-MR5)（位于 `~/Downloads`）
- [hadoop-3.3.6.tar.gz](https://hadoop.apache.org/releases.html)
- 三台互通的虚拟机
- 分布式搭建

**我的用户名是 khlee，所以下面出现的所有 khlee 字眼请全部根据自己的实际用户名填写。**

## 假设

| 虚拟机序号 |    虚拟机 IP    |
| :--------: | :-------------: |
|     1      | 192.168.100.100 |
|     2      | 192.168.100.101 |
|     3      | 192.168.100.102 |
