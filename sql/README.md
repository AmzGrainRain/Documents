# SQL

## 数据定义语言（Data Definition Language，DDL）
用于描述数据库中要存储的现实世界实体的编程语句。
### 数据库操作

#### 切换数据库
``` sql
USE 数据库名;
```

#### 显示数据库
``` sql
SHOW DATABASES;
```

#### 创建数据库
``` sql
CREATE DATABASE 数据库名;
```

#### 显示当前数据库
``` sql
SELECT DATABASE();
```

#### 删除数据库
``` sql
DROP DATABASE 数据库名;
```

### 数据表操作

#### 显示数据表
``` sql
SHOW TABLES;
```

#### 创建数据表
``` sql
CREATE TABLE 表名(
  字段 字段类型 默认值,
  字段 字段类型 默认值
)
```

#### 显示数据表结构
``` sql
SHOW CREATE TABLE 表名;
```

#### 显示数据表字段
``` sql
DESC 表名;
```

#### 修改数据表

##### 新增字段
``` sql
ALTER TABLE 表名 ADD 字段 字段类型 默认值;
```

##### 删除字段
``` sql
ALTER TABLE 表名 DROP 字段;
```

<!-- ##### 设置字段默认值
``` sql
ALTER TABLE 表名 ALTER COLUMN 字段 SET DEFAULT 默认值;
```

##### 删除字段默认值
``` sql
ALTER TABLE 表名 ALTER COLUMN 字段 DROP DEFAULT;
``` -->

##### 修改字段名
修改字段名须重新指定字段的类型和默认值。
``` sql
ALTER TABLE 表名 CHANGE 原字段名 新字段名 新字段类型 新字段默认值;
```

##### 修改字段类型
``` sql
ALTER TABLE 表名 MODIFY 字段 字段类型 默认值;
```

##### 重命名数据表
###### 方法一
``` sql
ALTER TABLE 表名 RENAME TO 新表名;
ALTER TABLE 表名 RENAME 新表名;
```

###### 方法二
``` sql
RENAME TABLE 表名 TO 新表名;
RENAME TABLE 表名 新表名;
```

#### 删除表

##### 删除（目标不存在会引发错误）
``` sql
DROP TABLE 表名;
```

##### 存在则删除
``` sql
DROP TABLE IF EXISTS 表名;
```

#### 清空表
底层原理：先删除表，再创建表。
``` sql
TRUNCATE 表名;
```

## 数据操纵语言（Data Manipulation Language，DML）
用于数据库操作、对数据库其中的对象和数据运行访问工作的编程语句。
### 添加数据

#### 单条数据
``` sql
INSERT INTO 表名 (字段1, 字段2, ...) VALUES (字段1, 字段2, ...);
```

#### 多条数据
``` sql
INSERT INTO 表名 (
  字段1,
  字段2,
  ...
) VALUES (字段1, 字段2, ...), (字段1, 字段2, ...), (字段1, 字段2, ...);
```

### 更新数据

#### 更新所有行

##### 更新一个字段
``` sql
UPDATE 表名 SET 字段 = '新的内容';
```

##### 更新多个字段
``` sql
UPDATE 表名 SET 字段1 = '新的内容', 字段2 = '新的内容';
```

#### 更新指定行

##### 更新一个字段
``` sql
UPDATE 表名 SET 字段 = '新的内容' WHERE 条件;
```

##### 更新多个字段
``` sql
UPDATE 表名 SET 字段1 = '新的内容', 字段2 = '新的内容' WHERE 条件;
```

### 删除数据
``` sql
DELETE FROM 表 WHERE 条件;
```

## 数据查询语言（Data Query Language，DQL）
用于查询数据库数据的编程语句。
``` sql
SELECT 字段1 AS 别名1, 字段2, ...
FROM 表名
WHERE 条件1, 条件2, ...
GROUP BY 字段1 AS 别名1, 字段2, ...
HAVING 条件1, 条件2, ...
ORDER BY 字段1, 字段2 DESC, ...
LIMIT 从, 到
```

## 数据控制语言（Data Control Language，DCL）
用于查询数据库数据的编程语句。
### 用户管理

#### 创建用户
``` sql
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
```

#### 修改用户密码
``` sql
ALTER USER '用户名'@'主机名' IDENTIFIED BY '新密码';
```

#### 删除用户
``` sql
DROP USER '用户名'@'主机名';
```

### 权限控制
关键字|含义
-|-
ALL, ALL PRIVILEGES|所有权限
INSERT|新增数据
DROP|删除数据库/表/视图
UPDATE|更新数据
SELECT|查询数据
ALTER|修改表
DELETE|删除数据
CREATE|创建库/表

#### 新增权限
``` sql
GRANT 权限列表 ON 数据库名.数据表名 TO '用户名'@'主机名';
```

#### 删除权限
``` sql
REVOKE 权限列表 ON 数据库名.数据表名 FROM '用户名'@'主机名';
```

## 函数
一些魔法
### 字符串

#### 字符串拼接（CONCAT）
拼接多个字符串，可以是字段，可以是常量字符串。
``` sql
SELECT CONCAT(字段1, 字段2, '123', ...)
```

#### 字母小写（LOWER）
字母全部转换为小写。
``` sql
SELECT LOWER('Hello')
# 输出 "hello"
```

#### 字母大写（UPPER）
字母全部转换为大写。
``` sql
SELECT UPPER('Hello')
# 输出 "HELLO"
```

#### 左填充（LPAD）
给定一个长度，从左侧填充，直到长度等于或大于给定长度。
``` sql
SELECT LPAD('hello', 7, '_')
# 输出 "__hello"
```

#### 右填充（RPAD）
给定一个长度，从右侧填充，直到长度等于或大于给定长度。
``` sql
SELECT RPAD('hello', 7, '_')
# 输出 "hello__"
```

#### 消除字符串首尾空格（TRIM）
``` sql
SELECT TRIM('        hello mysql   ')
# 输出 "hello mysql"
```

#### 字符串截取（SUBSTRING）
``` sql
SELECT SUBSTRING('hello mysql', 7, 5);
# 输出 "mysql"
```

### 数值

#### 向上取整
``` sql
SELECT CEIL(1.1);
# 输出 "2"
```

#### 向下取整
``` sql
SELECT FLOOR(1.9);
# 输出 "1"
```

#### 四舍五入
``` sql
SELECT ROUND(1.5);
# 输出 "2"
```

#### 求余
``` sql
SELECT MOD(4, 3);
# 输出 "1"
```

#### 0-1 之间的随机数
``` sql
SELECT RAND();
```

#### 0-10 之间的随机数（四舍五入保留两位小数）
``` sql
SELECT ROUND((RAND() * 100) / 10, 2);
```

#### 6 位数字验证码
``` sql
SELECT RAND() * 1000000;
# 或
SELECT SUBSTRING(RAND(), 3, 6);
```

#### 进制转换

##### 十进制 -> 十六进制
``` sql
SELECT HEX(10);
# 输出 "A"
```

##### 十进制 -> 八进制
``` sql
SELECT OCT(10);
# 输出 "12"
```

##### 十进制 -> 二进制
``` sql
SELECT BIN(4);
# 输出 "100"
```

### 日期

#### 当前日期
``` sql
SELECT CURDATE();
```

#### 当前时间
``` sql
SELECT CURTIME();
```

#### 当前日期和时间
``` sql
SELECT NOW();
```

#### 今夕是何年
``` sql
SELECT YEAR(NOW());
```

#### 给定一个日期，取月
``` sql
SELECT MONTH('2022-10-11');
# 输出 "10"
```

#### 给定一个日期，取日
``` sql
SELECT DAY('2022-10-11');
# 输出 "11"
```

#### 日期加减

##### 2022-10-11 23:59:59 + 1 秒
``` sql
SELECT DATE_ADD('2022-10-11 23:59:59', INTERVAL 1 SECOND);
```

##### 2022-10-11 23:59:59 + 1 分 1 秒
``` sql
SELECT DATE_ADD('2022-10-11 23:59:59', INTERVAL '1:1' MINUTE_SECOND);
```

#### 两日期之间间隔时间
大在前，小在后。
``` sql
# '2022-01-05' 与 '2022-12-24' 间隔天数
SELECT DATEDIFF('2022-12-24', '2022-01-05');

# '2022-01-05' 与现在间隔天数
SELECT DATEDIFF(NOW(), '2022-01-05');
```

### 流程控制

#### IF
`SELECT IF(x, y, z)` 等价 `x ? y : z`
``` sql
SELECT IF(TRUE, '真', '假');
# 输出 "真"

SELECT IF(FALSE, '真', '假');
# 输出 "假"
```

#### IFNULL
`SELECT IFNULL(x, y)` 等价 `x == null ? y : x;`
``` sql
SELECT IFNULL(NULL, '空!');
# 输出 "空!"

SELECT IFNULL('非空!', '空!');
# 输出 "非空!"
```

#### CASE WHEN THEN ELSE END
`SELECT CASE x WHEN m THEN i WHEN n THEN i ELSE j END` 等价 `x == m || x == n ? i : j`  
假设我们有下列数据表 scores ：

name|score
-|-
小明|49
小兰|53
小李|67
小王|81
小赵|98
小红|93

大于等于 60 分的标记为**及格**，大于等于 80 分的标记为**优秀**，其余的标记为**不及格**。  

使用 CASE WHEN THEN ELSE END 实现：
``` sql
SELECT
  name AS '姓名',
  score AS '分数',
  CASE
    WHEN score >= 80 THEN '优秀',
    WHEN score >= 60 THEN '及格',
    ELSE '不及格'
  END AS '评价'
FROM scores;
```

最终输出：
姓名|分数|评价
-|-|-
小明|49|不及格
小兰|53|不及格
小李|67|及格
小王|81|优秀
小赵|98|优秀
小红|93|优秀


## 约束

