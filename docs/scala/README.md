# SCALA 语法备忘

本文档为助记 SCALA 语法诞生。请自行百度解惑，此处不提供任何教程。

## 函数

### 函数的定义

```scala
def 函数名(参数1: 类型, 参数1: 类型, ...): 函数返回值 = {
  // 一些代码
}
```

### 无参函数

```scala
object 无参函数 {
  private def noParams(): Unit = {
    println("hello")
  }

  def main(args: Array[String]): Unit = {
    noParams()
  }
}
```

### 有参函数

```scala
object 有参函数 {
  private def useParams(msg: String): Unit = {
    println(msg)
  }

  def main(args: Array[String]): Unit = {
    val text: String = "hello"
    useParams(text)
  }
}
```

### 代码块形参（控制抽象）

```scala
object 代码块参数 {
  private def codeSegmentParam(code: => Unit): Unit = {
    println("准备执行代码块")
    code
    println("执行代码块完毕")
  }

  def main(args: Array[String]): Unit = {
    // 将代码块作为实参传递
    codeSegmentParam({
      println("此信息来自代码块")
    })

    // 省略小括号
    codeSegmentParam {
      println("此信息来自代码块")
    }
  }
}
```

### 具有返回值的函数

```scala
object 返回值 {
  private def useReturn(condition: Boolean): String = {
    if (condition) "You introduced 'true'"
    else "You introduced 'false'"
  }

  def main(args: Array[String]): Unit = {
    val param: Boolean = true
    println(useReturn(param)) // You introduced 'true'
  }
}
```

### 嵌套函数

```scala
object 嵌套函数 {
  def main(args: Array[String]): Unit = {
    def test(): Unit = {
      println("我是嵌套在 main 函数内的函数。")
    }

    test()
  }
}
```

### 形参默认值

```scala
object 形参默认值 {
  private def useDefaultParam(x: Int = 1, y: Int = 2): Int = {
    x * y
  }

  def main(args: Array[String]): Unit = {
    println(useDefaultParam(5))
  }
}
```

### 可变长参数

```scala
object 可变长参数 {
  private def variableLengthParams(args: Int*): Unit = {
    args.foreach(item => {
      print(item + " ")
    })
    println()
  }

  def main(args: Array[String]): Unit = {
    variableLengthParams(1, 2, 3, 4, 5)
  }
}
```

### 函数返回值

```scala
object 函数返回值 {
  private def useReturn(condition: Boolean): String = {
    if (condition) "You introduced 'true'"
    else "You introduced 'false'"
  }

  def main(args: Array[String]): Unit = {
    val param: Boolean = true
    println(useReturn(param))
  }
}
```

### 函数重载

```scala
object 重载 {
  private def test(): Unit = {
    println("1")
  }

  private def test(arg: Int): Unit = {
    println(arg)
  }

  def main(args: Array[String]): Unit = {
    val x: Int = 123;
    test(x) // 123

    test()  // 1
  }
}
```

### 匿名函数（lambda表达式）

```scala
package Function

object 匿名函数 {
  private def add: (Int, Int) => Int = (x: Int, y: Int) => {
    x * y
  }

  private def myForEach(arr: Array[Int], cb: Int => Unit): Unit = {
    arr.foreach(cb)
  }

  def main(args: Array[String]): Unit = {
    println(add(5, 8))

    myForEach(Array(1, 2, 3, 4, 5), arrayElement => {
      println(arrayElement)
    })
  }
}
```

### 偏应用函数

```scala
package Function

import java.util.Date

object 偏应用函数 {
  private def myLogger(from: String, date: Date, msg: String): Unit = {
    println(s"[$date] $from: $msg")
  }

  def main(args: Array[String]): Unit = {
    val from: String = "Main"
    val date: Date = new Date()

    // 每次都要传入前两个参数，很麻烦
    myLogger(from, date, "Test1")
    myLogger(from, date, "Test2")
    myLogger(from, date, "Test3")

    println("================")

    // 使用偏应用函数，让生命更加丰富多彩
    def easy: String => Unit = myLogger(from, date, _: String)
    easy("Test1")
    easy("Test2")
    easy("Test3")
  }
}

```

### 函数柯里化

```scala
package Function

object 柯里化 {
  private def distanceBetweenTwoPoints(x1: Int, y1: Int)
                                      (x2: Int, y2: Int): Double = {
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  private def test1(): Double = {
    val middleFunc: (Int, Int) => Double = distanceBetweenTwoPoints(0, 0)

    middleFunc(4, 6)
  }

  private def test2(): Double = {
    distanceBetweenTwoPoints(0, 0)(4, 6)
  }

  def main(args: Array[String]): Unit = {
    val ans1: Double = test1()
    val ans2: Double = test2()

    println(ans1 == ans2) // true
  }
}

```

### 高阶函数

```scala
object 高阶函数 {
  private def surprised(prefix: String, callback: (String, String) => Unit): String => Unit = {
    val rtn: (String) => Unit = callback(prefix, _: String)
    rtn
  }

  def main(args: Array[String]): Unit = {
    val prefix: String = "Main"
    val process: (String, String) => Unit = (prefix: String, msg: String) => {
      println(s"[$prefix]: $msg")
    }

    val returnedLambda: String => Unit = surprised(prefix, process)
    returnedLambda("hello world")
  }
}
```

## 循环

### while

```scala
object while循环 {
  def main(args: Array[String]): Unit = {
    var i: Int = 3
    while (i > 0) {
      println(i)
      i -= 1
    }
  }
}
```

### for

```scala
object for循环范围 {
  private def loop1(): Unit = {
    // i ∈ [0, 3)
    for (i <- Range(0, 3)) {
      println(i)
    }
    println("=======================================")
  }

  private def loop2(): Unit = {
    // i ∈ [0, 3)
    for (i <- 0 until 3) {
      println(i)
    }
    println("=======================================")
  }

  private def loop3(): Unit = {
    // i ∈ [0, 3]
    for (i <- 0 to 3) {
      println(i)
    }
  }
}
```

### 扁平化的 for 循环

```scala
object 扁平化for {
  /**
   * 九九乘法表
   */
  private def before(): Unit = {
    for (i <- 1 to 9) {
      for (j <- 1 to i) {
        val sum: Int = i * j
        print(s"$j x $i = $sum \t")
      }
      println()
    }
  }

  /**
   * 九九乘法表
   */
  private def after(): Unit = {
    for (i <- 1 to 9; j <- 1 to i) {
      val sum: Int = i * j
      print(s"$j x $i = $sum \t")
      if (j == i) println()
    }
  }

  def main(args: Array[String]): Unit = {
    before()
    after()
  }
}
```

### foreach

```scala
object foreach {
  private def forEachA(): Unit = {
    // i ∈ [0, 3]
    val arr: Array[Int] = Array(0, 1, 2, 3)
    for (i <- arr) {
      println(i)
    }
  }

  private def forEachB(): Unit = {
    // i ∈ [0, 3]
    for (i <- Array(0, 1, 2, 3)) {
      println(i)
    }
  }

  private def forEachC(): Unit = {
    // i ∈ [0, 3]
    val arr: Array[Int] = Array(0, 1, 2, 3)
    arr.foreach(i => {
      println(i)
    })
  }

  def main(args: Array[String]): Unit = {
    forEachA()

    println("==========================")

    forEachB()

    println("==========================")

    forEachC()
  }
}

```

### 循环守卫

```scala
object for循环守卫 {
  private def conditionLoop(): Unit = {
    // i ∈ {2x | 0 <= x<= 10}
    for (i <- 1 to 10 if i % 2 == 0) {
      println(i)
    }
  }

  def main(args: Array[String]): Unit = {
    conditionLoop()
  }
}
```

### yield

```scala
object for_yield {
  type AI = Array[Int]

  def main(args: Array[String]): Unit = {
    val arr: AI = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    val filtered: AI = for { x <- arr if x % 2 == 0; if x != 10 } yield x

    filtered.foreach(println) // 2, 4, 6, 8
  }
}
```

### 手搓一个 while 循环

借助于闭包、递归、控制抽象、柯里化等实现 while 循环的功能，以加深对于高阶函数的理解。

```scala
package Loop

import scala.annotation.tailrec

object 手搓while循环 {
  /**
   * 柯里化
   * @param condition 条件代码块
   * @return 代码执行器
   */
  @tailrec
  private def while1(condition: => Boolean) (code: => Unit): Unit = {
    if (condition) {
      code
      while1(condition)(code)
    }
  }

  /**
   * 闭包、递归、控制抽象
   * @param condition 条件代码块
   * @return 代码执行器
   */
  private def while2(condition: => Boolean): (=> Unit) => Unit = {
    def loop(code: => Unit): Unit = {
      if (condition) {
        code
        while2(condition)(code)
      }
    }
    loop _
  }

  /**
   * 闭包、递归、控制抽象、匿名函数
   * @param condition 条件代码块
   * @return 代码执行器
   */
  private def while3(condition: => Boolean): (=> Unit) => Unit = {
    code => {
      if (condition) {
        code
        while3(condition)(code)
      }
    }
  }

  def main(args: Array[String]): Unit = {
    var num1: Int = 3
    while1(num1 > 0) {
      println(num1)
      num1 -= 1
    }

    var num2: Int = 3
    while2(num2 > 0) {
      println(num2)
      num2 -= 1
    }

    var num3: Int = 3
    while2(num3 > 0) {
      println(num3)
      num3 -= 1
    }
  }
}
```

## 类与对象

### 类的定义

```scala
class 类名(构造参数1: 类型, 构造参数2: 类型, ...) {
  val 属性名: 类型 = 默认值
  private[对谁可见] val 属性名: 类型 = 默认值

  def 函数名(参数1: 类型, 参数1: 类型, ...): 函数返回值 = {
    // 一些代码
  }

  // 私有方法
  private[对谁可见] def 函数名(参数1: 类型, 参数1: 类型, ...): 函数返回值 = {
    // 一些代码
  }
}
```

### 测试

与 Java 相同，类也是可以嵌套的：

```scala
class Outter {
  private[Outter] class Inner(_name: String, _age: Int) {
    val name: String = _name
    // Outter 可以访问这个私有属性
    private[Outter] val age: Int = _age

    def hello(msg: String): Unit = {
      println(msg)
    }

    // Outter 可以调用这个私有方法
    private[Outter] def callMe(): String = {
      this.name + this.age
    }
  }

  def test(): Unit = {
    val t = new Inner("lkh", 20)

    // 访问公有属性
    println(t.name)

    // 访问私有属性
    println(t.age)

    // 调用公有方法
    t.hello("test")

    // 调用私有方法
    println(t.callMe())
  }
}

object cs {
  def main(args: Array[String]): Unit = {
    val t = new Outter()
    t.test()
  }
}
```

### 单例默认行为

```scala
object Test {
  def apply(msg: String): Unit = {
    println(msg)
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    Test("hello world")
  }
}
```

### 伴生对象

```scala
class 伴生对象(_name: String, _age: Int) {
  private val name: String = _name
  private val age: Int = _age
}

object 伴生对象 {
  def main(args: Array[String]): Unit = {
    val p = new 伴生对象("lkh", 20)

    // 可以访问其私有属性
    println(p.name)
    println(p.age)
  }
}
```

### 运算符重载

```scala
class SymbolReload(_num: Int) {
  private var num: Int = _num

  def <<(x: Int): Unit = {
    println(s"尝试左移 $x 位")
  }

  def *(x: Int): Unit = {
    println(s"尝试 x $x")
  }

  def -=(x: Int): Unit = {
    println(s"尝试 -= $x")
  }
}

object 运算符重载 {
  def main(args: Array[String]): Unit = {
    val t: SymbolReload = new SymbolReload(3)
    t << 3  // 尝试左移 3 位
    t * 123 // 尝试 x 123
    t -= 123123 // 尝试 -= 123123
  }
}
```

### 重载构造器

```scala
package Class

class Person(_name: String, _age: Int) {
  private val name: String = _name
  private val age: Int = _age
  private var gender: Boolean = false

  def this(_name: String, _age: Int, _gender: Boolean) = {
    this(_name, _age)
    this.gender = _gender
  }
}

object 重载构造器 {
  def main(args: Array[String]): Unit = {
    val p1 = new Person("lkh", 20)
    val p2 = new Person("lkh", 20, true)
  }
}
```

## 集合

### 不可变数组（Array）

```scala
object 不可变数组Array {
  private type AI = Array[Int]

  private def printArray(title: String, arr: AI): Unit = {
    println(s"============== $title ===============")
    arr.foreach(i => {
      print(i + " ")
    })
    println()
  }

  def main(args: Array[String]): Unit = {
    val arr1: AI = Array(1, 2, 3, 4)
    printArray("arr1", arr1)

    val arr2: AI = new Array[Int](3)
    printArray("arr2", arr2)

    val arr3: AI = Array.fill[Int](5)(9)
    printArray("arr3", arr3)
  }
}
```

### 可变数组（ArrayBuffer）

```sql
object 可变数组ArrayBuffer {
  type AI = ArrayBuffer[Int]

  private def printArray(title: String, arr: AI): Unit = {
    println(s"============== $title ===============")
    arr.foreach(i => {
      print(i + " ")
    })
    println()
  }

  def main(args: Array[String]): Unit = {
    val arr: AI = ArrayBuffer[Int](1, 2, 3)
    printArray("修改前", arr)
    arr.+=(4, 5, 6)
    arr.+=:(0)
    printArray("修改后", arr)
  }
}
```

### 构造数组（ArrayBuilder）

```scala
object 构造数组ArrayBuilder {
  def main(args: Array[String]): Unit = {
    val b = mutable.ArrayBuilder.make[Int]
    b ++= Array(1, 2, 3)
    b ++= Array(4, 5, 6)

    b.result().foreach(println)
  }
}
```

### 数组拼接

```scala
object 数组拼接 {
  def main(args: Array[String]): Unit = {
    type AI = Array[Int]
    val arr1: AI = Array(1, 2, 3)
    val arr2: AI = Array(4, 5, 6)
    val arr3: AI = arr1.concat(arr2)

    arr3.foreach(println)
  }
}
```

### 数组筛选与过滤

```scala
object 数组筛选与过滤 {
  private type AI = Array[Int]
  private type AS = Array[String]

  /**
   * Array.map(lambda)
   * map 会把每次返回的结果合并到最终的返回值里
   * 功能：奇数个元素 + 1，偶数个元素不变
   */
  private def arrayMap(): Unit = {
    var arr: AI = Array(1, 2, 3, 4, 5, 6)
    arr = arr.map(i => if (i % 2 == 0) i else i + 1)

    arr.foreach(println)
  }

  /**
   * Array.flatMap(lambda)
   * flatMap 与 map 功能大体相同区别在于如果返回了一个数组，
   * 那么 flatMap 会把数组内的元素逐个合并到最终的返回值里（数组降维/扁平化处理）
   * 功能：提取所有短语中的单词
   */
  private def arrayFlatMap(): Unit = {
    var arr: AS = Array("hello world", "good morning")
    arr = arr.flatMap(i => i.split(" "))

    arr.foreach(println)
  }

  /**
   * Array.filter(lambda)
   * 数组条件过滤
   * 功能：过滤奇数
   */
  private def arrayFilter(): Unit = {
    var arr: AI = Array(5, 6, 7, 2, 9, 3)
    arr = arr.filter(i => i % 2 == 0)

    arr.foreach(println)
  }

  def main(args: Array[String]): Unit = {
    arrayMap()
    arrayFlatMap()
    arrayFilter()
  }
}
```

### 数组统计

```scala
object 数组统计 {
  def main(args: Array[String]): Unit = {
    val arr: Array[Int] = Array(7, 1, 3, 8, 2)
    // 统计 arr 数组中，大于 3 的元素个数
    val result: Int = arr.count(i => i > 3)
    println(result)
  }
}
```

### 集合速览

```scala
package Collection

object 集合 {
  private type SI = Set[Int]

  private def printSets(sets: SI): Unit = {
    println(sets.mkString("[", ", ", "]"))
  }

  /**
   * 计算 sets1 和 sets2 的交集
   * @param sets1 集合1
   * @param sets2 集合2
   */
  private def setsIntersect(sets1: SI, sets2: SI): Unit = {
    println("sets1 和 sets2 的交集：")
    // 语法1: Set.intersect(Set) 或 Set intersect Set
    printSets(sets1.intersect(sets2))
    printSets(sets1 intersect sets2)

    // 语法2: Set & Set 或 Set.&(Set)
    printSets(sets1 & sets2)
    printSets(sets1.&(sets2))
  }

  /**
   * 计算 sets1 和 sets2 的差集（sets1 有但 set2 没有的元素组成的集合）
   * @param sets1 集合1
   * @param sets2 集合2
   */
  private def setsDiff(sets1: SI, sets2: SI): Unit = {
    println("sets1 有但 set2 没有的元素：")
    // 语法1: Set.diff(Set) 或 Set diff Set
    printSets(sets1.diff(sets2))
    printSets(sets1 diff sets2)

    // 语法2: Set &~ Set 或 Set.&~(Set)
    printSets(sets1 &~ sets2)
    printSets(sets1.&~(sets2))
  }

  /**
   * 计算 set1 和 set2 的并集
   * @param sets1 集合1
   * @param sets2 集合2
   */
  private def setsUnion(sets1: SI, sets2: SI): Unit = {
    println("sets1 于 sets2 的并集：")

    // 语法1: Set.union(Set) 或 Set union Set
    printSets(sets1.union(sets2))
    printSets(sets1 union sets2)

    // 语法2: Set.concat(Set) 或 Set concat Set
    printSets(sets1.concat(sets2))
    printSets(sets1 concat sets2)

    // 语法3: Set | Set 或 Set.|(Set)
    printSets(sets1 | sets2)
    printSets(sets1.|(sets2))
  }

  def main(args: Array[String]): Unit = {
    // 声明两个集合
    val sets1: SI = Set(1, 2, 3, 4)
    val sets2: SI = Set(3, 4, 5, 6)

    println("sets1:")
    printSets(sets1)
    println("sets2:")
    printSets(sets2)

    // 交集计算
    setsIntersect(sets1, sets2)

    // 差集计算
    setsDiff(sets1, sets2)

    // 并集计算
    setsUnion(sets1, sets2)
  }
}
```

## 杂项

### 字符串模板

```scala
object 字符串模板 {
  def main(args: Array[String]): Unit = {
    // 九九乘法表
    for (i <- 1 to 9) {
      for (j <- 1 to i) {
        val sum: Int = i * j
        print(s"$j x $i = $sum \t")
      }
      println()
    }
  }
}
```

### 类型别名

```scala
object type_alias {
  type A = Array[Int]

  def main(args: Array[String]): Unit = {
    type T = Int

    val a: Int = 1
    val b: T = 1
    println(a == b) // true

    val arr1: Array[Int] = Array(1, 2, 3)
    val arr2: A = Array(1, 2, 3)
    arr1.foreach(print) // 123
    arr2.foreach(print) // 123
  }
}
```

### 字面量亦是对象

```scala
object 字面量亦是对象 {
  def main(args: Array[String]): Unit = {
    println( 0.to(3) )
    println( 0.until(3) )
  }
}
```

## 快速跳转

[回到顶部](#SCALA-语法备忘)
