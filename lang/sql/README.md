# SQL 基础

本文档为助记 SQL 语法诞生。请自行百度解惑，此处不提供任何教程。

## 数据定义语言（Data Definition Language，DDL）

用于描述数据库中要存储的现实世界实体的编程语句。

### 数据库操作

#### 切换数据库

```sql
USE 数据库名;
```

#### 显示数据库

```sql
SHOW DATABASES;
```

#### 创建数据库

```sql
CREATE DATABASE 数据库名;
```

#### 显示当前数据库

```sql
SELECT DATABASE();
```

#### 删除数据库

```sql
DROP DATABASE 数据库名;
```

### 数据表操作

#### 显示数据表

```sql
SHOW TABLES;
```

#### 创建数据表

```sql
CREATE TABLE 表名 (
  字段 字段类型 [约束条件],
  字段 字段类型 [约束条件]
)
```

#### 复制数据表结构

```sql
CREATE TABLE 表名 LIKE 被复制的表名;
```

#### 显示数据表结构

```sql
SHOW CREATE TABLE 表名;
```

#### 显示数据表字段

```sql
DESC 表名;
```

#### 修改数据表

##### 新增字段

```sql
ALTER TABLE 表名 ADD 字段 字段类型 [约束条件];
```

##### 删除字段

```sql
ALTER TABLE 表名 DROP 字段;
```

##### 修改字段名

修改字段名须重新指定字段的类型和默认值。

```sql
ALTER TABLE 表名 CHANGE 原字段名 新字段名 新字段类型 [新字段约束条件];
```

##### 修改字段类型

```sql
ALTER TABLE 表名 MODIFY 字段 字段类型 [约束条件];
```

##### 重命名数据表

###### 方法一

```sql
ALTER TABLE 表名 RENAME TO 新表名;

-- 或

ALTER TABLE 表名 RENAME 新表名;
```

###### 方法二

```sql
RENAME TABLE 表名 TO 新表名;
RENAME TABLE 表名 新表名;
```

#### 删除表

##### 删除

目标不存在会引发错误。

```sql
DROP TABLE 表名;
```

##### 存在则删除

```sql
DROP TABLE IF EXISTS 表名;
```

#### 清空表

先删除表，再创建表。

```sql
TRUNCATE 表名;
```

## 数据操纵语言（Data Manipulation Language，DML）

用于数据库操作、对数据库其中的对象和数据运行访问工作的编程语句。

### 添加数据

#### 单条数据

```sql
INSERT INTO 表名 (字段1, 字段2, ...) VALUES (字段1, 字段2, ...);
```

#### 多条数据

```sql
INSERT INTO 表名 (
  字段1,
  字段2,
  ...
) VALUES (字段1, 字段2, ...), (字段1, 字段2, ...), (字段1, 字段2, ...);
```

### 更新数据

#### 更新所有行

##### 更新一个字段

```sql
UPDATE 表名 SET 字段 = '新的内容';
```

##### 更新多个字段

```sql
UPDATE 表名 SET 字段1 = '新的内容', 字段2 = '新的内容';
```

#### 更新指定行

##### 更新一个字段

```sql
UPDATE 表名 SET 字段 = '新的内容' WHERE 条件;
```

##### 更新多个字段

```sql
UPDATE 表名 SET 字段1 = '新的内容', 字段2 = '新的内容' WHERE 条件;
```

### 删除数据

```sql
DELETE FROM 表 WHERE 条件;
```

## 数据查询语言（Data Query Language，DQL）

用于查询数据库数据的编程语句。

### 基本语法

```sql
SELECT 字段1 AS 别名1, 字段2, ...
FROM 表名
WHERE 条件1, 条件2, ...
GROUP BY 字段1 AS 别名1, 字段2, ...
HAVING 条件1, 条件2, ...
ORDER BY 字段1 [ASC], 字段2 DESC, ...
LIMIT 从, 到
```

### 执行顺序

```sql
FROM 表名
WHERE 条件1, 条件2, ...
GROUP BY 字段1 AS 别名1, 字段2, ...
HAVING 条件1, 条件2, ...
SELECT 字段1 AS 别名1, 字段2, ...
ORDER BY 字段1, 字段2 DESC, ...
LIMIT 从, 到
```

### 关键字

#### BETWEEN

查询年龄在 20-30 之间的员工：

```sql
SELECT * FROM employee WHERE employee.age BETWEEN 20 AND 30;
```

#### DISTINCT

去重查询的结果：

```sql
SELECT DISTINCT * FROM 员工表;
```

#### LIKE

通配符列表：

通配符|描述
-|-
%|代表零个或多个字符
_|仅替代一个字符
\[charlist\]|字符列中的任何单一字符
\[^charlist\] 或者 \[!charlist\]|不在字符列中的任何单一字符

查询姓李的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.name LIKE '李%';
```

查询姓名包含 "莹" 的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.name LIKE '%莹%';
```

查询姓李且姓名是两个字的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.name LIKE '李__';
```

查询姓李、王、赵的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.name LIKE '[李王赵]%';
```

查询姓李、王、赵以外的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.name LIKE '[^李王赵]%';

-- 或

SELECT * FROM 员工表 WHERE 员工表.name LIKE '[!李王赵]%';
```

#### NOT LIKE

反转 LIKE 的结果，不再过多赘述。

#### OR

查询年龄在 30 岁以下或 40 岁以上的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.age < 30 OR 员工表.age > 40;
```

#### IN

> IN 在查询的时候，首先查询子查询的表，然后将内表和外表做一个笛卡尔积，然后按照条件进行筛选。所以相对内表比较小的时候，IN 的速度较快。

查询年龄为 31, 33, 36 的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.age IN (31, 33, 36);
```

#### NOT IN

反转 IN 的结果，不再过多赘述。

#### ALL

一个人的年龄同时大于 28, 19, 31 的员工：

```sql
SELECT * FROM 员工表 WHERE 员工表.age > ALL (28, 19, 31);
```

#### ANY & SOME

一个人的年龄大于 28, 19, 31 其中一个的员工：

```sql
SELECT *
FROM 员工表
WHERE 员工表.age > ANY (28, 19, 31);

SELECT *
FROM 员工表
WHERE 员工表.age > SOME (28, 19, 31);
```

## 数据控制语言（Data Control Language，DCL）

用于查询数据库数据的编程语句。

### 用户管理

#### 创建用户

```sql
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
```

#### 修改用户密码

```sql
ALTER USER '用户名'@'主机名' IDENTIFIED BY '新密码';
```

#### 删除用户

```sql
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

```sql
GRANT 权限列表 ON 数据库名.数据表名 TO '用户名'@'主机名';
```

#### 删除权限

```sql
REVOKE 权限列表 ON 数据库名.数据表名 FROM '用户名'@'主机名';
```

## 函数

一些魔法

### 统计（COUNT）

此函数只会记录非空值（NOT NULL）。

```sql
SELECT COUNT()
```

### 字符串

#### 字符串拼接（CONCAT）

```sql
SELECT CONCAT(字段1, 字段2, '123', ...);
```

#### 字母小写（LOWER）

```sql
SELECT LOWER('Hello');
-- 输出 "hello"
```

#### 字母大写（UPPER）

```sql
SELECT UPPER('Hello');
-- 输出 "HELLO"
```

#### 左填充（LPAD）

给定一个长度，从左侧填充，直到长度等于或大于给定长度。

```sql
SELECT LPAD('hello', 7, '_');
-- 输出 "__hello"
```

#### 右填充（RPAD）

给定一个长度，从右侧填充，直到长度等于或大于给定长度。

```sql
SELECT RPAD('hello', 7, '_');
-- 输出 "hello__"
```

#### 消除字符串首尾空格（TRIM）

```sql
SELECT TRIM('        hello mysql   ');
-- 输出 "hello mysql"
```

#### 字符串截取（SUBSTRING）

```sql
SELECT SUBSTRING('hello mysql', 7, 5);
-- 输出 "mysql"
```

### 数值

#### 向上取整

```sql
SELECT CEIL(1.1);
-- 输出 "2"
```

#### 向下取整

```sql
SELECT FLOOR(1.9);
-- 输出 "1"
```

#### 四舍五入

```sql
SELECT ROUND(1.5);
-- 输出 "2"
```

#### 求余

```sql
SELECT MOD(4, 3);
-- 输出 "1"
```

#### 0-1 之间的随机数

```sql
SELECT RAND();
```

#### 0-10 之间的随机数（四舍五入保留两位小数）

```sql
SELECT ROUND((RAND() * 100) / 10, 2);
```

#### 6 位数字验证码

```sql
SELECT LPAD(CEIL(RAND() * 1000000), 6, 0);
-- 或
SELECT SUBSTRING(RAND(), 3, 6);
```

#### 进制转换

##### 十进制 转 十六进制

```sql
SELECT HEX(10);
-- 输出 "A"
```

##### 十进制 转 八进制

```sql
SELECT OCT(10);
-- 输出 "12"
```

##### 十进制 转 二进制

```sql
SELECT BIN(4);
-- 输出 "100"
```

### 日期

#### 当前日期

```sql
SELECT CURDATE();
```

#### 当前时间

```sql
SELECT CURTIME();
```

#### 当前日期和时间

```sql
SELECT NOW();
```

#### 今夕是何年

```sql
SELECT YEAR(NOW());
```

#### 给定一个日期，取月

```sql
SELECT MONTH('2022-10-11');
-- 输出 "10"
```

#### 给定一个日期，取日

```sql
SELECT DAY('2022-10-11');
-- 输出 "11"
```

#### 日期加减

##### 2022-10-11 23:59:59 + 1 秒

```sql
SELECT DATE_ADD('2022-10-11 23:59:59', INTERVAL 1 SECOND);
```

##### 2022-10-11 23:59:59 + 1 分 1 秒

```sql
SELECT DATE_ADD('2022-10-11 23:59:59', INTERVAL '1:1' MINUTE_SECOND);
```

#### 两日期之间间隔时间

大在前，小在后。

```sql
-- '2022-01-05' 与 '2022-12-24' 间隔天数
SELECT DATEDIFF('2022-12-24', '2022-01-05');

-- '2022-01-05' 与现在间隔天数
SELECT DATEDIFF(NOW(), '2022-01-05');
```

### 流程控制

#### IF

`SELECT IF(x, y, z)` 等价 `x ? y : z`

```sql
SELECT IF(TRUE, '真', '假');
-- 输出 "真"

SELECT IF(FALSE, '真', '假');
-- 输出 "假"
```

#### IFNULL

`SELECT IFNULL(x, y)` 等价 `x == null ? y : x;`

```sql
SELECT IFNULL(NULL, '空!');
-- 输出 "空!"

SELECT IFNULL('非空!', '空!');
-- 输出 "非空!"
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

```sql
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

设置约束时强烈建议为约束命名。在后期需要删除约束时，可以通过约束名直接删除。如果没有设置约束名，那么在删除约束前要先通过 `SHOW CREATE TABLE 表名` 来查看系统给约束的默认命名，才能根据默认命名来删除约束。

### 约束关键字

关键字|含义
-|-
NOT NULL|非空
UNIQUE|唯一
PRIMARY KEY|主键
DEFAULT|默认值
CHECK|满足条件（8.0.16版本以后）
AUTO_INCREMENT|自增
FOREIGN KEY|外键

### 普通约束

#### 关于 ALTER TABLE xxx MODIFY

修改字段数据类型、添加或删除非空和自增约束。
如果不指定**自增约束**则代表**不设置**或**删除**已经存在的自增约束。

```sql
ALTER TABLE xxx MODIFY xxx 默认值|自增;
```

#### 关于 ALTER TABLE xxx ADD

为字段添加唯一、主键、条件、外键约束。

#### 关于 ALTER TABLE xxx DROP CONSTRAINT xxx

根据约束名删除指定约束。

#### 非空

```sql
-- 添加
ALTER TABLE 表名 MODIFY 字段名 数据类型 NOT NULL;

-- 删除
ALTER TABLE 表名 MODIFY 字段名 数据类型 NULL;
```

#### 唯一

```sql
-- 添加
ALTER TABLE 表名 ADD CONSTRAINT 约束名 UNIQUE KEY (字段1, 字段2, ...);

-- 删除
ALTER TABLE 表名 DROP CONSTRAINT 约束名;
```

#### 主键

```sql
-- 添加
ALTER TABLE 表名 ADD PRIMARY KEY (字段名);

-- 删除
ALTER TABLE 表名 DROP PRIMARY KEY;
```

#### 默认值

```sql
-- 添加
ALTER TABLE 表名 ALTER 字段名 SET DEFAULT 默认值;

-- 删除
ALTER TABLE 表名 ALTER 字段名 DROP DEFAULT;
```

#### 条件

```sql
-- 添加
ALTER TABLE 表名 ADD 约束名 CHECK (条件);

-- 删除
ALTER TABLE 表名 DROP 约束名;
```

#### 自增

```sql
-- 添加
ALTER TABLE 表名 MODIFY 字段名 INT AUTO_INCREMENT;

-- 删除
ALTER TABLE 表名 DROP 约束名;
```

#### 示例

创建一个员工表 employee：

字段名|含义|字段类型|约束条件
-|-|-|-
id|编号|INT|自增、主键
name|姓名|VARCHAR(10)|非空、唯一
age|年龄|TINYINT UNSIGNED|在 \(0, 80\] 之间
status|状态|TINYINT UNSIGNED|默认为 1
gender|性别|CHAR(1)|值为 “男” 或 “女”

创建员工表 employee 时约束字段：

```sql
CREATE TABLE employee (
  id INT AUTO_INCREMENT COMMENT '编号',
  name VARCHAR(10) NOT NULL COMMENT '姓名',
  age TINYINT COMMENT '年龄',
  status TINYINT UNSIGNED DEFAULT 1 COMMENT '状态',
  gender CHAR(1) COMMENT '性别',
  PRIMARY KEY (id),
  CONSTRAINT `nameUnique` UNIQUE KEY (name),
  CONSTRAINT `checkAge` CHECK(age > 0 && age <= 80),
  CONSTRAINT `checkGender` CHECK(gender = '男' || gender = '女')
) COMMENT '员工表';
```

创建员工表 employee 之后约束字段：

```sql
CREATE TABLE employee (
  id INT COMMENT '编号',
  name VARCHAR(10) COMMENT '姓名',
  age TINYINT COMMENT '年龄',
  status TINYINT UNSIGNED COMMENT '状态',
  gender CHAR(1) COMMENT '性别'
) COMMENT '员工表';

ALTER TABLE employee ADD PRIMARY KEY (id);
ALTER TABLE employee MODIFY id INT AUTO_INCREMENT;
ALTER TABLE employee MODIFY name VARCHAR(10) NOT NULL;
ALTER TABLE employee ADD CONSTRAINT `nameUnique` UNIQUE KEY (name);
ALTER TABLE employee ADD CONSTRAINT `checkAge` CHECK (age > 0 && age <= 80);
ALTER TABLE employee MODIFY status TINYINT UNSIGNED DEFAULT 1;
ALTER TABLE employee ADD CONSTRAINT `checkGender` CHECK (gender = '男' || gender = '女');
```

### 外键约束

#### 外键约束的添加与删除

```sql
-- 添加
ALTER TABLE 表名 ADD CONSTRAINT 约束名 FOREIGN KEY (外键字段) REFERENCES 主键表 (主键字段);

-- 删除
ALTER TABLE 表名 DROP FOREIGN KEY 约束名; -- 删除外键
ALTER TABLE 表名 DROP INDEX 约束名;       -- 删除索引
```

### 外键约束行为

#### 外键约束行为关键字列表

关键字|含义
-|-
NO ACTION|当在父表中删除/更新对应记录时，如果存在对应外键则不允许删除/更新。（与 RESTRICT 一致）
RESTRICT|当在父表中删除/更新对应记录时，如果存在对应外键则不允许删除/更新。（与 NO ACTION 一致）
CASCADE|当在父表中删除/更新对应记录时，如果存在对应外键则也删除/更新外键在子表中的记录。
SET NULL|当在父表中删除对应记录时，如果存在对应外键则设置子表中该外键值为 NULL 。(该外键不能 NOT NULL）
SET DEFAULT|父表有变更时，子表将外键列设置为默认值。（InnoDB 不支持）

#### 外键约束行为的添加与删除

```sql
-- 添加
ALTER TABLE 表名 ADD CONSTRAINT 约束名 FOREIGN KEY (外键字段) REFERENCES 主键表 (主键字段) ON UPDATE 更新时的行为 ON DELETE 删除时的行为;

-- 删除
ALTER TABLE 表名 DROP FOREIGN KEY 约束名;
```

## 多表关系

多表关系依靠外键约束建立。

### 一对一关系模型

当 A 表的一个行只能与 B 表中的一个行相关，B 表中的一个行同样只能与 A 表中的一个行相关时，一对一关系成立。
每个人的教育信息只能有一个，教育信息也只能属于一个人。

个人信息表 A ：

字段|描述|外键约束情况
-|-|-
id|主键|无
name|姓名|无
age|年龄|无
gender|性别|无
work_no|工号|唯一
edu_id|教育信息 ID|唯一且关联 B 表的主键

教育信息表 B：

字段|描述|外键约束情况
-|-|-
id|主键|无
address|地址|无
edu|教育背景|无

### 一对多关系模型

当 A 表的一行只能关联 B 表中的一行，B 表中的一行可以关联 A 表中的多行时，一对多关系成立。
一个员工只能属于一个部门，一个部门可以有多个员工：

员工表 A ：

字段|描述|外键约束情况
-|-|-
id|主键|无
name|姓名|无
age|年龄|无
gender|性别|无
dep_id|部门ID|关联 B 表的主键

部门表 B ：

字段|描述|外键约束情况
-|-|-
id|主键|无
department|部门名称|无

### 多对多关系模型

当 A 表的一个行可以关联 B 表的多个行，B 表的一个行也可以关联 A 表的多个行时，多对多关系成立。
一个学生可以学习多门课程，一门课程可以被多名学生学习：

学生表 A ：

字段|描述|外键约束情况
-|-|-
id|主键|无
name|姓名|无
age|年龄|无
gender|性别|无
course|课程|无

多对多关系表 C ：

字段|描述|外键约束情况
-|-|-
student_id|学生 ID|关联 A 表的主键
course_id|课程 ID|关联 B 表的主键

课程表 B ：

字段|描述|外键约束情况
-|-|-
id|主键|无
name|课程名称|无

## 多表查询

详情参阅[菜鸟教程图解](https://www.runoob.com/w3cnote/sql-join-image-explain.html)

### 隐式/显式连接

选择多个表，通过 WHERE 条件过滤的语法，就是**隐式连接**。  
使用 XXX JOIN 选择多个表，并通过 ON 条件过滤的语法，就是**显式连接**。  
**推荐使用显式连接，后面的 SQL 语句除示例外，优先使用显式连接。**

### 内连接

#### 特点

根据年代区分，SQL92 标准仅支持内连接，SQL99 标准支持内连接、左外连接、右外连接和全外连接。
基本语法：

```sql
SELECT
  字段1, 字段2, ...
FROM
  表1 AS 别名,
INNER JOIN
  表2 AS 别名
ON 连接条件
```

内连接分为三个，分别是：等值连接、非等值连接、自连接。

#### 等值连接

常用于排序、分组和筛选数据。

##### 双表查询

查询员工表的**姓名字段**、部门表的**名称字段**：

```sql
-- 显式写法
SELECT
  员工表.姓名,
  部门表.名称
FROM
  员工表
  INNER JOIN 部门表 ON 员工表.部门id = 部门表.id;

-- 隐式写法
SELECT
  员工表.姓名,
  部门表.名称
FROM
  员工表,
  部门表
WHERE 员工表.部门id = 部门表.id;
```

##### 多表查询

查询员工表的**姓名字段**、部门表的**名称字段**、工资表的**总工资字段**，并**按照工资表的总工资字段降序排列**：

```sql
-- 显式写法
SELECT
  部门表.名称,
  员工表.姓名,
  工资表.总工资 AS 总工资
FROM
  员工表
  INNER JOIN 部门表 ON 员工表.部门id = 部门表.id
  INNER JOIN 工资表 ON 员工表.工号 = 工资表.id
ORDER BY 总工资 DESC;

-- 隐式写法：有兴趣的话可以自己试试
```

#### 非等值连接

查询级别大于 3 的员工，并按照年龄降序排列：

```sql
-- 显式写法
SELECT
  员工表.姓名,
  员工表.年龄 AS 员工年龄
FROM
  员工表
  INNER JOIN 员工等级表 ON 员工等级表.等级 > 3
ORDER BY 员工年龄 DESC;

-- 隐式写法
SELECT
  员工表.姓名,
  员工表.年龄 AS 员工年龄
FROM
  员工表,
  员工等级表
WHERE 员工等级表.等级 > 3
ORDER BY 员工年龄 DESC;
```

#### 自连接

使用自连接可以将自身表的一个镜像当作另一个表来对待，从而能够得到一些特殊的数据。使用自连接的目的并不是自己和自己关联，更多的时候是和表里的其他进行组合。

##### 过滤笛卡尔积重复数据

为员工两两分组，排列组合（排除自己和自己的组合）：

```sql
-- 显式写法
SELECT
  员工表A.姓名,
  员工表B.姓名
FROM
  员工表 AS 员工表A
  INNER JOIN 员工表 AS 员工表B ON 员工表A.姓名 <> 员工表B.姓名;

-- 隐式写法
SELECT
  员工表A.姓名,
  员工表B.姓名
FROM
  员工表 AS 员工表A,
  员工表 AS 员工表B
WHERE 员工表A.姓名 <> 员工表B.姓名;
```

##### 查询每一个员工姓名和他的领导姓名

有这么一个表：

字段|描述|外键约束情况
-|-|-
id|主键|无
name|姓名|无
age|年龄|无
gender|性别|无
work_no|工号|唯一
leader_id|领导的 ID|无
edu_id|教育信息 ID|唯一且关联 B 表的主键

当我们要时查询每一个员工和他的领导姓名，就需要自查寻了：

```sql
-- 显式写法
SELECT
  员工表A.姓名 AS 员工姓名,
  员工表B.姓名 AS 领导姓名
FROM
  员工表 AS 员工表A
  INNER JOIN 员工表 AS 员工表B ON 员工表A.领导id = 员工表B.id;

-- 隐式写法
SELECT
  员工表A.姓名 AS 员工姓名,
  员工表B.姓名 AS 领导姓名
FROM
  员工表 AS 员工表A,
  员工表 AS 员工表B
WHERE 员工表A.领导id = 员工表B.id;
```

### 外连接

外连接没有隐式写法。

#### 特点

- 外连接的查询结果是主表中的所有记录
  - 如果从表中有和它匹配的，则显示匹配的值。
  - 如果没有与之匹配的，则显示 NULL 。
  - 外连接查询结果 = 内连接结果 + 主表中有而从表中没有的记录。
- 左外连接（LEFT \[OUTER\] JOIN）左边的是主表。
- 右外连接（RIGHT \[OUTER\] JOIN）右边的是主表。

```sql
-- A << B
SELECT * FROM A LEFT OUTER JOIN B ON A.b_id = B.id;

-- B << A
SELECT * FROM B LEFT OUTER JOIN A ON A.b_id = B.id;

-- A >> B
SELECT * FROM A RIGHT OUTER JOIN B ON A.b_id = B.id;

-- B >> A
SELECT * FROM B RIGHT OUTER JOIN A ON A.b_id = B.id;
```

#### 示例

员工表：

字段|描述|外键约束情况
-|-|-
id|主键|无
name|姓名|无
age|年龄|无
gender|性别|无
dep_id|部门ID|关联 B 表的主键

部门表：

字段|描述|外键约束情况
-|-|-
id|主键|无
department|部门名称|无

查询没有加入任何部门的员工：

```sql
SELECT *
FROM
  员工表
  LEFT OUTER JOIN 部门表 ON 员工表.部门id = 部门表.id
WHERE 员工表.部门id IS NULL;

-- 或

SELECT *
FROM
  部门表
  RIGHT OUTER JOIN 员工表 ON 员工表.部门id = 部门表.id
WHERE 员工表.部门id IS NULL;
```

查询部门员工数量并升序排列：

```sql
SELECT
  部门表.名称 AS 部门名称,
  COUNT(*) AS 员工数量
FROM
  部门表
  LEFT OUTER JOIN 员工表 ON 部门表.id = 员工表.部门id
GROUP BY 部门名称
ORDER BY 员工数量 ASC;

-- 或

SELECT
  部门表.名称 AS 部门名称,
  COUNT(*) AS 员工数量
FROM
  员工表
  RIGHT OUTER JOIN 部门表 ON 部门表.id = 员工表.部门id
GROUP BY 部门名称
ORDER BY 员工数量 ASC;
```

### 交叉连接

交叉连接的结果是笛卡尔积：

```sql
-- 交叉连接——显式自连接，排列组合姓名
SELECT
  a.姓名
  b.姓名
FROM 员工表 AS a CROSS JOIN 员工表 AS b;

-- 内连接-隐式自连接，排列组合姓名
SELECT
  a.姓名
  b.姓名
FROM 员工表 AS a, 员工表 AS b;
```

## 联合查询

把多条 SQL 查询的结果合并起来形成一个新的查询结果集。

A：查询年龄大于 50 的员工。
B：查询男性员工。
合并 A 和 B 的查询结果：

```sql
SELECT * FROM 员工表 WHERE 年龄 > 50
UNION ALL
SELECT * FROM 员工表 WHERE 性别 = '男';
```

合并 A 和 B 的查询结果（去重）：

```sql
SELECT * FROM 员工表 WHERE 年龄 > 50
UNION
SELECT * FROM 员工表 WHERE 性别 = '男';
```

## 子查询

SQL 嵌套 SQL 就是子查寻。

### 标量子查询

查询所有与张三同一天入职的员工：

```sql
SELECT * FROM 员工表
WHERE 入职时间 = (
  SELECT 入职时间
  FROM 员工表
  WHERE name = '张三'
);
```

### 列子查询

查询与张三、李四同一天入职的员工：

```sql
SELECT * FROM 员工表
WHERE 入职时间 IN (
  SELECT 入职时间
  FROM 员工表
  WHERE name IN ('张三', '李四')
);
```

### 行子查寻

查询与张三同一天入职且都是男性的员工：

```sql
SELECT * FROM 员工表
WHERE (入职时间, 性别) = (
  SELECT
    入职时间,
    性别
  FROM 员工表
  WHERE name = '张三'
);
```

### 表子查询

查询与张三、李四年龄、性别相同的员工（结果不包含张三、李四）：

```sql
SELECT * FROM 员工表
WHERE (年龄, 性别) IN (
  SELECT
    年龄,
    性别
  FROM 员工表
  WHERE name IN ('张三', '李四')
) AND name NOT IN ('张三', '李四');
```

### EXISTS 子查询

EXISTS 用于指定一个子查询检查子查询是否至少返回一行数据，指定的子查询实际上并不返回任何数据，而是返回值 True 或 False。而且 EXISTS 的子查询是一个受限的 SELECT 语句，不允许有 COMPUTE 子句和 INTO 关键字。在执行 EXISTS 时先执行外层语句，再根据外层语句的查询结果循环子句。

查询所有部门的员工（不包含没有部门的员工）：

```sql
SELECT * FROM 员工表
WHERE EXISTS (
  SELECT * FROM 部门表
  WHERE 员工表.部门id = id
);
```

## 事务

事务是一组操作的集合，它是一个不可分割的工作单位，事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求。这些操作要么同时成功，要么同时失败。这样即使正在操作数据时因为不可抗拒原因导致操作中断，也能保证您的数据的完整性。

事务有以下分类：

- 扁平事务
- 带保存点的扁平事务
- 链事务
- 嵌套事务
- 分布式事务

### 事务四大特性（ACID）

- 原子性（**A**tomicity）：事务是不可分割的最小操作单元，要么全部成功，要么全部失败。
- 一致性（**C**onsistency）：事务完成时，必须使所有的数据都保持一致状态。
- 隔离性（**I**solation）：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行。
- 持久性（**D**urability）：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。

### 事务的基本使用

#### 开启事务

使用此命令开启事务：

```sql
START TRANSACTION;

-- 或

BEGIN;
```

#### 提交事务

```sql
COMMIT;

-- 或

COMMIT WORK;
```

**注意：此时 COMMIT 与 COMMIT WORK 的作用是一样的。但是它们的效果受变量 COMPLETION_TYPE 的影响。**

#### 回滚事务

```sql
ROLLBACK;

-- 或

ROLLBACK WORK;
```

**注意：此时 ROLLBACK 与 ROLLBACK WORK 的作用是一样的。但是它们的效果受变量 COMPLETION_TYPE 的影响。**

#### 示例

打开事务 -> 执行一些 SQL -> 回滚事务（作废前面已执行 SQL）

```sql
-- 张三给李四转账 1000

-- 开启事务
START TRANSACTION;

-- 执行一些SQL
UPDATE 员工表 SET money = (money - 1000) WHERE 姓名 = '张三';
UPDATE 员工表 SET money = (money + 1000) WHERE 姓名 = '李四';

-- 回滚事务
ROLLBACK;
```

打开事务 -> 执行一些 SQL -> 提交事务（生效前面已执行 SQL）

```sql
-- 张三给李四转账 1000

-- 开启事务
BEGIN;

-- 执行一些SQL
UPDATE 员工表 SET money = (money - 1000) WHERE 姓名 = '张三';
UPDATE 员工表 SET money = (money + 1000) WHERE 姓名 = '李四';

-- 提交事务
COMMIT;
```

如果上面的两条 UPDATE 有一条执行失败，则这个事务就不会提交。

#### COMPLETION_TYPE 的值

前面我们说过，COMMIT 与 COMMIT WORK 以及 ROLLBACK 与 ROLLBACK WORK 作用是一样的。但是 COMMIT WORK 与 ROLLBACK WORK 的作用受变量 COMPLETION_TYPE 的影响，在这里我们就来研究下究竟会产生什么样的影响。

COMPLETION_TYPE 的值默认为`NO_CHAIN`，除此之外还有 `CHAIN`与`RELEASE`。

##### NO_CHAIN

提交事务或回滚事务时一同结束该事务：

```sql
-- 设置 COMPLETION_TYPE 为 NO_CHAIN
SET COMPLETION_TYPE = 0;

-- 开启事务
BEGIN;

-- 更新数据
UPDATE employee SET balance = 5000 WHERE name = '张三';

-- 提交事务
COMMIT WORK;

-- 更新数据
UPDATE employee SET balance = 2000 WHERE name = '张三';

-- 回滚事务
ROLLBACK;
```

受 COMPLETION_TYPE = 'NO_CHAIN' 的影响，事务在 COMMIT WORK 之后就结束了。所以最后一行的 ROLLBACK 不会生效，张三的零钱是 2000。

##### CHAIN

提交事务或回滚事务时自动创建一个新的事务：

```sql
-- 设置 COMPLETION_TYPE 为 CHAIN
SET COMPLETION_TYPE = 1;

-- 开启事务
BEGIN;

-- 更新数据
UPDATE employee SET balance = 5000 WHERE name = '张三';

-- 提交事务
COMMIT WORK;

-- 更新数据
UPDATE employee SET balance = 2000 WHERE name = '张三';

-- 回滚事务
ROLLBACK;
```

受 COMPLETION_TYPE = 'CHAIN' 的影响，COMMIT WORK 提交之后，又开启了一个新的事务。使得最后一行的 ROLLBACK　生效，回滚了`UPDATE employee SET balance = 2000 WHERE name = '张三';`此时张三的零钱是 5000。

##### RELEASE

提交事务或回滚事务时释放与 SQL 建立的连接：

```sql
-- 设置 COMPLETION_TYPE 为 RELEASE
SET COMPLETION_TYPE = 2;

-- 开启事务
BEGIN;

-- 更新数据
UPDATE employee SET balance = 5000 WHERE name = '张三';

-- 提交事务
COMMIT WORK;

-- 更新数据
UPDATE employee SET balance = 2000 WHERE name = '张三';

-- 回滚事务
ROLLBACK;
```

受 COMPLETION_TYPE = 'RELEASE' 的影响，COMMIT WORK 提交之后，就释放了与 SQL 建立的连接。所以后面的 SQL 不会执行，此时张三的零钱是 5000。

### 事务提交默认行为

AUTOCOMMIT 默认为 1，即所做出的操作立即生效。
可以通过下列语句来查询事务状态：

```sql
SELECT @@AUTOCOMMIT;

-- 或

SHOW VARIABLES LIKE 'AUTOCOMMIT';
```

通过此方法修改 AUTOCOMMIT 为 0 时，当前会话所作出的修改均不会立即生效，而是等待 COMMIT 命令或 ROLLBACK 命令执行：

```sql
SET @@AUTOCOMMIT = 0;

-- 或

SET AUTOCOMMIT = 0;
```

### 并发事务问题

名称|描述
-|-
脏读|一个事务读到另外一个事务还没有提交的数据。
不可重复读|一个事务先后读取同一条记录，但两次读取的数据不同，称之为不可重复读。
幻读|一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存在。

要解决并发事务所产生的上述问题，需要使用事务隔离。

### 事务隔离

事务特性（ACID）中的隔离性（Isolation）就是隔离级别，它通过锁来实现。也就是说，设置不同的隔离级别，其本质只是控制不同的锁行为。例如操作是否申请锁，什么时候申请锁，申请的锁是立刻释放还是持久持有直到事务结束才释放等。

#### 隔离级别

级别|脏读|不可重复读|幻读
-|-|-|-
READ UNCOMMITTED|√|√|√
READ COMMITTED|×|√|√
REPEATABLE READ|×|×|√
SERIALIZABLE|×|×|×

#### 查看隔离级别

通过此命令来查看：

```sql
SELECT @@TRANSATION_ISOLATION;
```

或者查找变量值：

```sql
-- 查看当前会话隔离级别
SELECT @@TX_ISOLATION;

-- 查看全局会话隔离级别
SELECT @@GLOBAL.TX_ISOLATION;
```

#### 设置隔离级别

SESSION：当前会话
GLOBAL：全局

```sql
SET [ SESSION | GLOBAL ]
TRANSACTION ISOLATION LEVEL 隔离级别;

-- 或者修改变量值

SET @@GLOBAL.TX_ISOLATION = 隔离级别;
set @@SESSION.TX_ISOLATION = 隔离级别;
```

### 扁平事务

扁平事务是最常见的事务。由 BEGIN 或 START TRANSACTION 开始，COMMIT 或 ROLLBACK 结束，中间的所有操作要么都回滚要么都提交。扁平事务在生产环境中占绝大多数使用情况。因此每一种数据库产品都支持扁平事务。

### 带有保存点的扁平事务

扁平事务的缺点在于无法回滚或提交一部分，只能全部回滚或全部提交，所以就有了 ”带有保存点“ 的扁平事务。通过在事务内部的某个位置使用 SAVEPOINT，将来可以在事务中回滚到此位置。

#### 设置保存点

```sql
SAVE POINT 保存点名称;
```

#### 回滚到指定保存点

```sql
ROLLBACK TO 保存点名称;
```

#### 删除指定保存点

```sql
RELEASE SAVEPOINT 保存点名称;
```

实际上，扁平事务也是有保存点的，只不过它只有一个隐式的保存点，且自动建立在事务开始的位置，因此扁平事务只能回滚到事务开始处。

### 链式事务

链式事务是保存点扁平事务的变种。它在一个事务提交的时候自动隐式的将上下文传给下一个事务，也就是说一个事务的提交和下一个事务的开始是原子性的，下一个事务可以看到上一个事务的处理结果。通俗地说，就是一个事务的提交和另一个事务的开始是链接在一起的。

这样的事务类型，在提交事务的时候，会释放要提交事务内所有的锁和要提交事务内所有的保存点。因此链式事务只能回滚到当前所在事务的保存点，而不能回滚到已提交的事务中的保存点。

### 嵌套事务

嵌套事务由一个顶层事务控制所有的子事务。子事务的提交完成后不会真的提交，而是等到顶层事务提交才真正的提交。

关于嵌套事务的机制，主要有以下结论：

- 回滚内部事务的同时会回滚到外部事务的起始点。
- 事务提交时从内向外依次提交。
- 回滚外部事务的同时会回滚所有事务，包括已提交的内部事务。因为只提交内部事务时没有真的提交。

不管怎么样，最好少用嵌套事务。且 MySQL 原生不支持嵌套事务（SQL Server支持）。

### 分布式事务

将多个服务器上的事务（节点）组合形成一个遵循事务特性（ACID）的分布式事务。

例如在工行 ATM 机转账到建行用户。工行 ATM 机所在数据库是一个事务节点 A，建行数据库是一个事务节点 B，仅靠工行 ATM 机是无法完成转账工作的，因为它控制不了建行的事务。所以它们组成一个分布式事务：

1. ATM 机发出转账口令。
2. ATM 机从工行用户减少 N 元。
3. 在建行用户增加 N 元。
4. 在 ATM 机上返回转账结果。

上面涉及了两个事务节点，这些事务节点之间的事务必须同时具有 ACID 属性，要么所有的事务都成功，要么所有的事务都失败。不能只是其中一个银行的 ATM 机的事务成功，而另一个银行的事务失败。

MySQL 的分布式事务使用两段式提交协议（2-phase commit, 2PC）。最重要的是，MySQL 5.7.7 之前，MySQL 对分布式事务的支持一直都不完善（第一阶段提交事务后不会写 binlog，导致宕机丢失日志），这个问题持续时间长达数十年，直到 MySQL 5.7.7，才完美支持分布式事务。相关内容可参考我在网上找到的这篇文章：[MySQL 5.7 完美的分布式事务支持](https://www.linuxidc.com/Linux/2016-02/128053.htm)。

## 快速跳转

[回到顶部](#SQL-基础)
