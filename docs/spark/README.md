# Spark 安装

## 先决条件

- [Debian GNU/Linux 12 (bookworm) x86_64](https://mirrors.tuna.tsinghua.edu.cn/debian-cd/12.4.0/amd64/iso-cd/)
- [spark-3.5.0-bin-hadoop3.tgz](https://www.apache.org/dyn/closer.lua/spark/spark-3.5.0/spark-3.5.0-bin-hadoop3.tgz)（位于 `~/Downloads`）
- 分布式搭建/单机搭建

**我的用户名是 khlee，所以下面出现的所有 khlee 字眼请全部根据自己的实际用户名填写。**

## 1.解压

```bash
cd ~/Downloads
tar -zxf ./spark-3.5.0-bin-hadoop3.tgz
mv spark-3.5.0-bin-hadoop3 ../spark
```

## 2.配置环境变量

编辑环境变量：

```bash
env-edit
```

在文件末尾添加：

```bash
# 此处不再将 spark/bin/* | spark/sbin/* 导出到环境变量，原因自行体会
export SPARK_HOME=/opt/apps/spark
```

生效环境变量：

```bash
env-update
```

## 3.配置 Spark

进入配置目录：

```bash
cd $SPARK_HOME/conf
```

### spark-env.sh

使用模板创建：

```bash
cp ./spark-env.sh.template ./spark-env.sh
```

编辑 `spark-env.sh`：

```bash
vim ./spark-env.sh
```

在末尾添加这些：

```bash
# 指定 Java 环境变量
export JAVA_HOME=~/jdk
```

单机模式请额外添加这些：

```bash
# 指定 Spark Master 的主机名
export SPARK_MASTER_HOST=master

# 指定 Spark master 的端口号，可以使用默认的 7077
export SPARK_MASTER_PORT=7077

# 指定每个 worker 使用的 CPU 核心数
export SPARK_WORKER_CORES=2

# 指定每个 worker 使用的内存大小
export SPARK_WORKER_MEMORY=1G
```

集群模式请额外添加这些：

```bash
# 指定 Hadoop 的配置文件目录，以便 Spark 可以访问 HDFS 和 YARN
export HADOOP_CONF_DIR=~/hadoop/etc/hadoop
export YARN_CONF_DIR=~/hadoop/etc/hadoop

# 指定 Spark 在 YARN 上运行时使用的 jar 包的位置，可以是本地或者 HDFS 上的目录
export SPARK_YARN_JARS=~/spark/jars/*
```

### workers

> 注意：仅集群模式需要配置此文件

创建并编辑 workers：

```bash
vim ./workers
```

在文件内写入 `node1`、`node2`：

```bash
node1
node2
```

### 可选步骤 1 - History Server

Spark 程序运行完毕后, 是无法查看运行记录的。而 HistoryServer 通过读取日志文件, 使得我们在 Spark 程序运行完毕后依然能够查看运行过程。

进入 Spark 配置目录：

```bash
cd ~/spark/conf
```

在 HDFS 创建 `spark_log` 目录：

```bash
hdfs dfs -mkdir /spark_log
```

从模板创建并编辑 `spark-defaults.conf`：

```bash
cp ./spark-defaults.conf.template ./spark-defaults.conf
vim ./spark-defaults.conf
```

取消注释并修改：

```bash
# 开启日志
spark.eventLog.enabled true
# 日志存储在 HDFS（确保此目录存在）
spark.eventLog.dir hdfs://master:9000/spark_log
```

编辑 `spark-env.sh`：

```bash
vim ./spark-env.sh
```

在末尾添加：

```bash
# 指定 Spark History 运行参数
# spark.history.ui.port: 指定 History Server WebUI 运行在哪个端口
# spark.history.retainedApplications: 指定保存的应用程序 UI 的个数。如果超过这个值，那么最旧的应用程序 UI 将被删除。
# spark.history.fs.logDirectory: 从哪里加载日志
export SPARK_HISTORY_OPTS="-Dspark.history.ui.port=4000 -Dspark.history.retainedApplications=3 -Dspark.history.fs.logDirectory=hdfs://master:9000/spark_log"
```

### 可选步骤 2 - Spark 集群高可用

进入 Spark 配置目录：

```bash
cd ~/spark/conf
```

编辑 `spark-env.sh`，如果是：

```bash
vim ./spark-env.sh
```

在末尾添加：

```bash
# 设置 Daemon 的运行参数
# spark.deploy.recoveryMode: 使用什么实现高可用
# spark.deploy.zookeeper.url: 使用哪些 Zookeeper 成员节点
# spark.deploy.zookeeper.dir：指定 Spark 在 Zookeeper 上的数据目录
export SPARK_DAEMON_JAVA_OPTS="-Dspark.deploy.recoveryMode=ZOOKEEPER -Dspark.deploy.zookeeper.url=master:2181,node1:2181,node2:2181 -Dspark.deploy.zookeeper.dir=/spark"
```

### 关于我的配置文件

这是我的 `spark-env.sh`：

```bash
# 指定 Java 环境变量
export JAVA_HOME=~/jdk

# 指定 Hadoop 的配置文件目录，以便 Spark 可以访问 HDFS 和 YARN
export HADOOP_CONF_DIR=~/hadoop/etc/hadoop
export YARN_CONF_DIR=~/hadoop/etc/hadoop

# 指定 Spark 在 YARN 上运行时使用的 jar 包的位置，可以是本地或者 HDFS 上的目录
export SPARK_YARN_JARS=~/spark/jars/*

# History Server
export SPARK_HISTORY_OPTS="-Dspark.history.ui.port=4000 -Dspark.history.retainedApplications=3 -Dspark.history.fs.logDirectory=hdfs://master:9000/spark_log"

# Spark 使用 Zookeeper 实现高可用
export SPARK_DAEMON_JAVA_OPTS="-Dspark.deploy.recoveryMode=ZOOKEEPER -Dspark.deploy.zookeeper.url=master:2181,node1:2181,node2:2181 -Dspark.deploy.zookeeper.dir=/spark"
```

这是我的 `spark-default.conf`：

```bash
# 开启日志
spark.eventLog.enabled true
# 日志存储在 HDFS（确保此目录存在）
spark.eventLog.dir hdfs://master:9000/spark_log
```

## 4.分发文件

> 注意：仅集群模式需要这一步

执行命令：

```bash
scp -r ~/spark node1:~/ &
scp -r ~/spark node2:~/
```

生效环境变量：（在所有节点执行一次）

```bash
env-update
```

## 5.启动测试

ssh node1 "~/zookeeper/bin/zkServer.sh start" &
ssh node2 "~/zookeeper/bin/zkServer.sh start" &
~/zookeeper/bin/zkServer.sh start start

## 引用内容

<https://blog.csdn.net/beishanyingluo/article/details/106533013>

## 快速跳转

[回到顶部](#scala-安装)

[Spark 安装](../flume/README.md)
