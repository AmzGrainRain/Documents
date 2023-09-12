# 现代 C++

## [auto](https://zh.cppreference.com/w/cpp/language/auto)

这并不是动态类型，最终的类型取决于编译期间右值的类型。换句话说就是让编译器在编译期根据右值推导出这个变量的类型：

```cpp
auto x = 1;     // int
auto y = 'c';   // char
```

当你觉得一个类型没必要明确写出来或者无论是写还是看都显得太长时，可以试试 auto 关键字。

## [constexpr](https://zh.cppreference.com/w/cpp/language/constexpr)

constexpr 的语义是“常量表达式”，代表在编译期可求值的表达式，可用于修饰变量、函数、构造函数等。它可以用于声明变量、函数、构造函数等，使得它们可以在编译期计算出结果，提高程序的执行效率。constexpr 和 const 的主要区别是，const 变量的初始化可以推迟到运行时，而 constexpr 变量必须在编译时进行初始化。constexpr 函数或构造函数必须只接受并返回字面类型，并且函数体不能包含复杂的语句，如 goto、try 等。C++14 中放宽了一些限制，允许 constexpr 函数包含 if、switch、循环等语句，并且可以修改局部变量。

constexpr 包含了 const 的含义，也就是说 constexpr 变量或函数都是 const 的，但反过来不一定成立。

下面是 constexpr 的使用示例：

```cpp
#include <iostream>

constexpr int factorial(int n)
{
    return n <= 1 ? 1 : (n * factorial(n - 1));
}

int main()
{
    // 5的阶乘
    constexpr int num = factorial(5);

    std::cout << num << std::endl;
    system("pause");
}

```

## using 替代 typedef

在 C++11 中规定了一种新的方法，使用别名声明(alias declaration)来定义类型的别名，即使用 `using`。

`typedef` 作为声明语句中的基本数据类型的一部分出现。含有 `typedef` 的声明语句定义的不再是变量而是类型别名。和以前的声明语句一样，这里的声明符也可以包含类型修饰，从而也能由基本数据类型构造出复合类型来。

C++11 中用关键字 `using` 作为别名声明的开始，其后紧跟别名和等号，其作用是把等号左侧的名字规定成等号右侧类型的别名。如：

```cpp
using i = int;
```

类型别名和类型的名字等价，只要是类型的名字能出现的地方，就能使用类型别名。

使用 `typedef` 定义的别名和使用 `using` 定义的别名在语义上是等效的。唯一的区别是 `typedef` 在模板中有一定的局限性，而 `using` 没有。

尽管 `typedef` 具有更长的历史记录并且在现有代码中可能更常见，但 `using` 更通用。

无论是 `typedef` 还是 `using`，它们都不会创建新的数据类型，它们仅仅创建现有类型的同义词(synonyms)。不能用于更改现有类型名称的含义。

`typedef` 和 `using` 标识符可以声明数组和函数类型，指针和引用，类类型等等。但不能与任何其它标识符组合使用。仅在它们可见的范围内有效：不同的函数或类声明可以定义具有不同含义的相同名字的类型。

`typedef` 的用法包括：

- 定义一种类型的别名
- 用于 `struct` 声明
- 用来定义与平台无关的类型
- 用于回调函数
- 为复杂的声明定义一个新的简单的别名

**如果某个类型别名指代的是复合类型或常量，那么把它用到声明语句里就会产生意想不到的后果。**

`typedef` 是定义了一种类型的新别名，但它不同于宏，并不是简单的字符串替换。当 `const` 和 `typedef` 一起出现时，就会出现一些玄学问题。举个例子：

```cpp
// 为 int* 起一个别名 p_int
typedef int* p_int;

// 这种情况下 p 的类型是 int* const
// 而不是我们期望的 const int*
const p_int p;
```

在使用 `typedef` 时，不能在声明中有多个存储类关键字，就像 auto、extern、mutable、static、register 一样，是一个存储类关键字。即 `typedef` 中不能出现这些关键字。

## 大括号初始化

C++11 的对象初始化的语法选择是不堪和混乱的。总的来说，初始值可以借助 `{}`、`=`、`()`：

```cpp
int main()
{
    int a = 0;
    int b(0);
    int c{0};

    return 0;
}
```

使用等号初始化经常会让我错误的认为会进行一次赋值，但并非如此。对于内置类型，例如 int，初始化和赋值操作的差别是模糊的。但是对于用户定义的类或是 STL 编程，区分初始化和赋值操作是很重要的，因为这会导致不同的函数调用：

```cpp
#include <string>

int main() {
    std::string str1;   // 默认构造
    std::string str4 = str3; // 拷贝构造
    std::str1 = str2; // 运算符重载

    return 0;
}
```

因为初始化的语法很混乱，而且有些情况无法实现，所以 C++11 提出了统一初始化语法：一种至少在概念上可以用于表达任何值的语法。它的实现基于大括号，所以我称之为大括号初始化。

使用大括号可以更容易的初始化容器列表初始化：

```cpp
#include <vector>

int main()
{
    std::vector<int> vec {1, 3, 5};

    return 0;
}
```

大括号也可以**用于类内成员的默认初始值**，在 C++11 中 `=` 也可以实现，但是 `()` 则不可以：

```cpp
class Person {
private:
  int a {0};    // x的默认初始值为0
  int b = 0;    // 同上
  int c(0);     // 报错
}
```

另一方面，不可拷贝对象(如 `std::atomic`)可以用大括号和圆括号初始化，但不能用等号：

```cpp
std::atomic<int> ai1 {0};   // 可以
std::atomic<int> ai2 (0);   // 可以
std::atomic<int> ai3 = 0;   // 报错
```

当使用大括号初始化用于内置类型的变量时，可以帮我们避免窄化转换：

```cpp
int main()
{
    double d = 3.14;
    int a {d};  // 报错（窄化转换不被允许）
    int b (d);  // 编译器认为没毛病
}
```

大括号初始化的另一个非常值得注意的特性是它解决了 C++ 中最让人头痛的歧义。当开发者想要一个默认构造的对象时，会不经意地声明一个函数而不是构造对象。正常情况下我们去调用一个有参构造是这样写的：

```cpp
Person p1('student1');  // 调用 Person 的带参构造
```

但是，当你尝试用类似的语法调用无参构造时，你就会发现有那么一点不对劲：

```cpp
Person p2();    // tnnd，不小心声明了一个的函数
Person p3;      // 正确：p3 是个默认初始化的对象
```

而使用大括号就不会出现这个问题：

```cpp
Person p2{};    // 这就没有歧义了
```

我们说了很多大括号初始化的内容，这种语法可以用于多种场景，还可以避免隐式范围窄化转换，又免疫 C++ 的最让人头痛的歧义问题。一举多得，那么为什么不用大括号初始化语法替代其他的语法呢？

大括号初始化的缺点是它有时会显现令人惊讶的的行为。这些行为的出现是因为与 `std::initializer_list` 混淆了。在构造函数中，只要形参不带有 `std::initializer_list`，圆括号和大括号行为一致：

```cpp
class Test {
public:
  Test(int i, bool b);
  Test(int i, double d);
};

Test t1(10, true);  // 调用第一个构造函数
Test t2{10, true};  // 调用第一个构造函数
Test t3(10, 5.0);   // 调用第二个构造函数
Test t4{10, 5.0};   // 调用第二个构造函数
```

但是，如果构造函数的形参带有 `std::initializer_list`，调用构造函数时大括号初始化语法会强制使用带 `std::initializer_list` 参数的重载构造函数：

```cpp
class Test {
public:
  Test(int i, bool b);
  Test(int i, double d);
  Test(std::initializer_list<long double> il);
};

Test t1(10, true);  // 使用圆括号，调用第一个构造函数
Test t2{10, true};  // 使用大括号，强制调用第三个构造函数，10 和 true 被转换为 long double
Test t3(10, 5.0);   // 使用圆括号，调用第二个构造函数
Test t4{10, 5.0};   // 使用大括号，强制调用第三个构造函数，10 和 5.0 被转换为 long double
```

就算是正常的拷贝构造和赋值构造也可以被带有 `std::initializer_list` 的构造函数劫持：

```cpp
class Test {
public:
  Test(int i, bool b);
  Test(int i, double d);
  Test(std::initializer_list<long double> il);
  operator float() const;   // 支持隐式转换为 float 类型
};

Test t5(w4);    // 使用圆括号，调用拷贝构造函数
Test t6{w4};    // 使用大括号，调用第三个构造函数（先把w4转换为float，再把float转换为long dobule）
Test t7(std::move(m4)); // 使用圆括号，调用移动构造函数
Test t8{std::move(m4)}; // 使用大括号，调用第三个构造函数，理由同w6
```

编译器用带有 `std::initializer_list` 构造函数匹配大括号初始值的决心是如此的坚定，即使带有 `std::initializer_list` 的构造函数是无法调用的，编译器也会忽略另外两个构造函数（第二个还是参数精确匹配的）：

```cpp
class Test {
public:
  Test(int i, bool b);
  Test(int i, double d);
  Test(std::initializer_list<bool> il);  // long double 改为 bool
};

Test t{10, 5.0}; // 报错，因为发生范围窄化转换，编译器会忽略另外两个构造函数(第二个还是参数精确匹配的！)
```

只有当大括号内的值无法转换为 `std::initializer_list` 元素的类型时，编译器才会使用正常的重载选择方法:

```cpp
class Test {
public:
  Test(int i, bool b);
  Test(int i, double d);
  Test(std::initializer_list<std::string> il);  // bool 改为 std::string
};

Test t1(10, true);  // 使用圆括号，调用第一个构造函数
Test t2{10, true};  // 使用大括号，不过调用第一个构造函数，因为无法转换为 string
Test t3(10, 5.0);   // 使用圆括号，调用第二个构造函数
Test t4{10, 5.0};   // 使用大括号，不过调用第二个构造函数，因为无法转换为 string
```

不过这里有一个有趣的边缘情况。一个大括号内无参的构造函数，不仅可以表示默认构造，还可以表示带 `std::initializer_list` 的构造函数。你的空括号是表示哪一种情况呢？

正确答案是你将使用默认构造，一个空的大括号表示的是没有参数，而不是一个空的 `std::initializer_list`：

```cpp
class Test {
public:
  Test();
  Test(std::initializer_list<int> il);
};

Test t1;    // 调用默认构造函数
Test t2{};  // 调用默认构造函数
```

如果你想要用一个空的 `std::initializer_list` 参数来调用带 `std::initializer_list` 构造函数，那么你需要把大括号作为参数，即把空的大括号放在圆括号内或者大括号内：

```cpp
Widget w4({});  // 用了一个空的 list 来调用带 std::initializer_list 构造函数
```

此时此刻，`大括号初始化`，`std::initializer_list`，构造函数重载之间的复杂关系在你的大脑中冒泡，你可能想要知道这些信息会在多大程度上关系到你的日常编程。可能比你想象中要多，因为 `std::vector` 就是一个被它们直接影响的类。`std::vector` 中有一个可以指定容器的大小和容器内元素的初始值的不带 `std::initializer_list` 构造函数，但它也有一个可以指定容器中元素值的带 `std::initializer_list` 函数：

```cpp
// 使用不带 std::initializer_list 的构造函数
// 创建 10 个元素的 vector，每个元素的初始值为 20
std::vector<int> v1(10, 20);

// 使用带 std::initializer_list 的构造函数
// 创建 2 个元素的 vector，元素值为 10 和 20
std::vector<int> v2{10, 20};
```

## [noexcept](https://zh.cppreference.com/w/cpp/language/noexcept_spec)

noexcept 有两个作用：

- 用来声明一个函数是否会抛出异常。你可以在函数后面加上 noexcept、noexcept(true)、noexcept(false) 或 noexcept(expression) 来指定函数的异常规范。其中 noexcept 默认表示 noexcept(true)，表示函数不会抛出任何异常。如果函数声明了 noexcept(true)，但是在运行时抛出了异常，那么程序会直接终止，不会执行任何异常处理代码。如果函数声明了 noexcept(false) 或 throw()，表示函数可能会抛出任何类型的异常。throw() 是 C++20 废弃的写法，建议使用 noexcept(false) 代替。如果函数声明了 noexcept(expression)，表示函数的异常规范取决于表达式的值，如果表达式为 true，则相当于 noexcept(true)，否则相当于 noexcept(false)。
- 用来检查一个表达式是否会抛出异常。你可以在编译期使用 noexcept(表达式) 来判断表达式是否声明了 noexcept(true)。如果是，则返回 true，否则返回 false。这个功能可以用来在模板函数中根据参数类型的异常规范来确定自身的异常规范，或者在编译期做一些优化或分支选择。

noexcept 的主要目的是减少运行时开销。因为如果一个函数可能会抛出异常，编译器需要为它生成一些额外的代码来处理异常情况，比如保存栈信息、调用析构函数、跳转到 catch 块等。这些代码会增加程序的体积和运行时间。如果一个函数不会抛出异常，那么编译器就可以省略这些代码，从而提高程序的性能和效率。

下面是一些 noexcept 的例子：

```cpp
// 声明一个不会抛出异常的函数
void foo() noexcept {
  // 一些代码
}

// 声明一个可能会抛出异常的函数
void bar() noexcept(false) {
  // 一些代码
}

// 检查 foo 和 bar 是否会抛出异常
static_assert(noexcept(foo())); // true
static_assert(!noexcept(bar())); // false

// 根据参数类型的异常规范来确定自身的异常规范
template <typename T>
void baz(T t) noexcept(noexcept(t.do_something())) {
  // do something with t
}
```

## [decltype](https://zh.cppreference.com/w/cpp/language/decltype)

decltype 用于**推导表达式类型**，这里只用于编译器分析表达式的类型，表达式实际不会进行运算：

```cpp
auto x = 1;
auto y = 2;

int& m = x;
decltype(m) n = y; // n 与 m 的类型相同
```

通过 decltype 复用匿名结构体、匿名枚举类型：

```cpp
enum {
    OK,
    Error
} status;

decltype(status) decl_status; // 复用了 status 的类型

struct {
    std::string name;
    std::string gender;
    unsigned short age{};
} student;

decltype(student) teacher; // 复用了 student 的类型
```

decltype 只用于分析表达式类型，不会进行运算：

```cpp
#include <typeinfo>
#include <cassert>

int main() {
    double d = 3.14;
    int i = 2345;
    decltype(d + i) c = 2.7;

    assert(d == 3.14);
    assert(i == 2345);
    assert(c == 2.7);
    assert(typeid(c) == typeid(double));

    return 0;
}
```

## [nullptr](https://zh.cppreference.com/w/cpp/language/nullptr)

关键词 nullptr 代表指针字面量。它是 std::nullptr_t 类型的纯右值。存在从 nullptr 到任何指针类型及任何成员指针类型的隐式转换。同样的转换对于任何空指针常量也存在，空指针常量包括 std::nullptr_t 的值，以及宏 NULL：

```cpp
#include <cassert>

int main() {
    int num = 1;
    int *p = &num;

    // 从 nullptr 到任何指针类型及任何成员指针类型的隐式转换
    p = nullptr;

    assert(nullptr == NULL);

    return 0;
}
```

## [override](https://zh.cppreference.com/w/cpp/language/override)

指定一个虚函数覆盖另一个虚函数：

```cpp
struct A {
    virtual void foo() = 0;
    void bar() {};
};

struct B : A {
    // 错误：B::foo 不覆盖 A::foo（签名不匹配）
    void foo() const override;

    // OK：B::foo 覆盖 A::foo
    void foo() override {};

    // 错误：A::bar 非虚函数
    void bar() override;
};
```

## [final](https://zh.cppreference.com/w/cpp/language/final)

指定某个虚函数不能在派生类中被覆盖，或者某个类不能被派生。

```cpp
struct Base {
    virtual void foo() = 0;
};

struct A : Base {
    // 覆盖 Base::foo
    void foo() final {}

    // 错误：bar 非虚函数，因此它不能是 final 的
    void bar() final;
};

struct B final : A {
    // 错误：foo 不能被覆盖，因为它在 A 中是 final 的
    void foo() override;
};

// 错误：B 是 final 的不可被派生
struct C : B {};
```

## [尾随返回类型](https://zh.cppreference.com/w/cpp/language/function#.E5.87.BD.E6.95.B0.E5.A3.B0.E6.98.8E)

单行声明的一个语法糖：

```cpp
#include <cassert>

// 声明了一个变量、一个指针、一个函数、及一个函数指针
int a = 1, *p = nullptr, f(), (*pf)(double);

int f() {
    return 1;
}

int p_f(double d) {
    return 2 * d;
}

int main() {
    p = new int(3);
    pf = p_f;

    assert(a == 1);
    assert(*p == 3);
    assert(f() == 1);
    assert(p_f(1.1) == 2);
    assert(pf(1.1) == 2);

    return 0;
}
```

## [值类别](https://zh.cppreference.com/w/cpp/language/value_category)

每个 C++ 表达式（带有操作数的操作符、字面量、变量名等）可按照两种独立的特性加以辨别：类型和值类别。每个表达式都具有某种非引用类型，且每个表达式只属于三种基本值类别中的一种：纯右值、亡值、左值。

简而言之，能取地址的就是左值、没有名字的临时变量和字面量就是右值：

```cpp
int f() {
    return 1;
}

int main() {
    // num 可以取地址所以是是左值
    // 1 是字面量所以是右值
    int num = 1;

    // num_p 出现在等号左侧所以是左值
    // &num 返回了一个地址但它不具名所以只能出现在等号右侧（右值）
    int *num_p = &num;

    // rtn 出现在等号左侧所以是左值
    // f() 的返回值不具名所以是右值
    int rtn = f();



    return 0;
}
```

使用左值去初始化对象或为对象赋值时，会调用拷贝构造函数或赋值构造函数。而使用一个右值来初始化或赋值时，会调用移动构造函数或移动赋值运算符来移动资源，从而避免拷贝，提高效率。而将亡值可以理解为通过移动构造其他变量内存空间的方式获取到的值。在确保其他变量不再被使用、或即将被销毁时，来延长变量值的生命期。而实际上该右值会马上被销毁，所以称之为：将亡值。

```cpp
#include <memory>
#include <cassert>

int main() {
    auto p = std::make_unique<int>(1);
    auto q = std::move(p);

    assert(p == nullptr);
    assert(*q == 2);

    return 0;
}
```

[右值引用](https://zh.cppreference.com/w/cpp/language/reference)

## [lambda](https://zh.cppreference.com/w/cpp/language/lambda)

与对 std:bind 的调用相比，lambdas 更可读、更清晰、更容易处理重载问题：

### 基本使用

```cpp
#include <iostream>

int main() {
    auto func = []() {
        std::cout << "hello world" << std::endl;
    };
    func();

    return 0;
}
```

### 参数列表

```cpp
#include <iostream>

int main() {
    auto func = [](const std::string &str) {
        std::cout << str << std::endl;
    };
    func("hello world");

    return 0;
}
```

如果一个 lambda 表达式不接收任何参数，那么圆括号是可以省略的：

```cpp
#include <iostream>

int main() {
    auto func = [] {
        std::cout << "hello world" << std::endl;
    };
    func();

    return 0;
}
```

### 捕获列表

使用 lambda 表达式如果想要达到闭包的效果，需要使用捕获列表：

```cpp
#include <iostream>

int main() {
    int num = 0;
    auto func = [num]() {
        std::cout << num << std::endl;
    };
    func();

    return 0;
}
```

捕获列表也可用于定义默认变量：

```cpp
#include <iostream>

int main() {
    auto func = [num = 0]() {
        std::cout << num << std::endl;
    };
    func();

    return 0;
}
```

如果变量满足下列条件，那么 lambda 表达式在使用它前不需要先捕获：该变量非局部变量，或具有静态或线程局部存储期（此时无法捕获该变量），或者该变量是以常量表达式初始化的引用：

```cpp
#include <iostream>

int a = 1;
auto func1 = [] {
    std::cout << a << std::endl;
};

int main() {
    func1();

    static int b = 2;
    auto func2 = [] {
        std::cout << b << std::endl;
    };
    func2();

    return 0;
}
```

### 返回值声明

lambda 表达式的返回值通常由编译器自动推断，也可以手动指定：

```cpp
#include <iostream>

int main() {
    auto func = []() -> void {
        std::cout << "hello world" << std::endl;
    };
    func();

    return 0;
}
```

### 泛型 lambda

一个很好用的特性：

```cpp
#include <iostream>

int main() {
    auto func = [](auto p) {
        std::cout << p << std::endl;
    };
    func("hello world");
    func(3.1415926);
    func(123);

    return 0;
}
```

另一种形式：

```cpp
#include <iostream>

int main() {
    auto func = []<class T>(T p) {
        std::cout << p << std::endl;
    };
    func("hello world");
    func(3.1415926);
    func(123);

    return 0;
}
```

### mutable 关键字

默认情况下 lambda 表达式内部无法修改位于捕获列表中的变量。想要修改它，需要添加 mutable 关键字。我们顺便来证明一下 lambda 表达式闭包的特性：

```cpp
#include <cassert>

int main() {
    int num = 0;
    auto func = [num]() mutable -> int {
        return ++num;
    };

    assert(func() == 1);
    assert(func() == 2);
    assert(func() == 3);
    assert(num == 0);

    return 0;
}
```

### 它是什么

lambda 其实是一个类：

```cpp
#include <iostream>

auto lambda1 = []() {
    std::cout << "[lambda] hello world" << std::endl;
};

class Test : decltype(lambda1) {
public:
    Test() {
        std::cout << "[class] hello world" << std::endl;
    }
};

int main() {
    Test t{};
    return 0;
}
```

lambda 的捕获列表其实就是类数据成员的默认值：

```cpp
#include <iostream>

int main() {
    auto func = [num = 1]() mutable -> void {
        std::cout << num << std::endl;
        ++num;
    };
    typedef decltype(func) LambdaType;

    class Test : LambdaType {
    public:
        Test() {    // 这一行编译器会提示你必须调用父类的构造器传参

        }
    };

    return 0;
}
```

### 示例

```cpp
#include <iostream>
#include <cmath>

// 计算两点距离
double distance_between_two_points(int x1, int y1, int x2, int y2) {
    return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
}

int main() {
    // 已知第一个点
    int x1 = 3;
    int y1 = 5;
    auto x1_y1_to = [x1, y1](int x2, int y2) constexpr noexcept -> double {
        return distance_between_two_points(x1, y1, x2, y2);
    };

    // (x1, y1) 到 (6, 8) 的距离
    std::cout << x1_y1_to(6, 8) << std::endl;

    // (x1, y1) 到 (2, 1) 的距离
    std::cout << x1_y1_to(2, 1) << std::endl;

    // (x1, y1) 到 (13, 20) 的距离
    std::cout << x1_y1_to(13, 20) << std::endl;

    system("pause");
}
```

## [弃置函数](https://zh.cppreference.com/w/cpp/language/function#.E5.87.BD.E6.95.B0.E5.AE.9A.E4.B9.89)

如果使用特殊语法 `= delete;` 取代函数体，那么该函数被定义为弃置的（此函数即被标记为废弃）。任何弃置函数的使用都是非良构的。这包含调用、显式（以函数调用运算符）、隐式（对弃置的重载运算符、特殊成员函数、分配函数等的调用），构成指向弃置函数的指针或成员指针，甚至是在不潜在求值的表达式中使用弃置函数。但是可以隐式 ODR 使用刚好被弃置的非纯虚成员函数。

```cpp
struct Test {
    void d() = delete;
};

int main() {
    Test* p = new Test;
    p->d(); // 错误：尝试调用弃置的 Test::d

    return 0;
}
```

## [结构化绑定](https://zh.cppreference.com/w/cpp/language/structured_binding)

### 绑定数组

```cpp
int main() {
    int arr[2] = {1, 2};

    // 创建 e[2]，复制 arr 到 e，然后 x 指代 e[0]，y 指代 e[1]
    auto [x, y] = arr;

    // xr 指代 a[0]，yr 指代 a[1]
    auto &[xr, yr] = arr;

    return 0;
}
```

### 绑定元组

```cpp
#include <tuple>

int main() {
    float x{};
    char y{};
    int z{};

    std::tuple<float &, char &&, int> tpl(x, std::move(y), z);
    const auto &[a, b, c] = tpl;
    // a 指名指代 x 的结构化绑定；decltype(a) 是 float&
    // b 指名指代 y 的结构化绑定；decltype(b) 是 char&&
    // c 指名指代 tpl 的第 3 元素的结构化绑定；decltype(c) 是 const int

    return 0;
}
```

### 绑定数据成员

```cpp
#include <iostream>

struct S {
    mutable int x1 : 2;
    volatile double y1;
};
S f();

int main() {
    // x 是标识 2 位位域的 int 左值
    const auto [x, y] = f();
    // y 是 const volatile double 左值
    std::cout << x << ' ' << y << '\n';  // 1 2.3
    x = -2;   // OK
    //  y = -2.;  // 错误：y 具有 const 限定
    std::cout << x << ' ' << y << '\n';  // -2 2.3
}
```

### 兼容性

在 C++20 以前，lambda 表达式无法捕获结构化绑定：

```cpp
#include <cassert>

int main() {
    struct Point {
        int row{6};
        int col{7};
    };
    const auto &[x, y] = Point{};
    // 在 C++20 以前，lambda 表达式无法捕获结构化绑定的 x 和 y
    const auto func = [x, y]() noexcept -> int {
        return x * y;
    };
    assert(func() == 42);

    return 0;
}
```

## 转换函数

只有 lambda 表达式的捕获列表为空时才可以这么写：

```cpp
#include <iostream>

int main() {
    void (*func)() = []{
        std::cout << "hello world" << std::endl;
    };
    func(); // hello world

    return 0;
}
```

## 默认参数

在默认实参之后的所有参数必须也是默认实参，**在先前的声明中所提供的默认实参也算**。
下面的代码在 Visual Studio 中会提示语法错误，但它是可以正常编译并且运行的：

一个比较逆天的写法：

```cpp
#include <iostream>

void test(int, int, int = 3);
void test(int, int = 2, int);
void test(int = 1, int, int);
void test(int a, int b, int c) {
    std::cout << (a + b + c) << std::endl;  // 6
}

int main() {
    test();
    return 0;
}
```

对于非模板类的成员函数，类外部的定义允许出现默认实参，并与类内的成员函数参数合并，如果类外的默认实参使类内部的成员函数变成默认构造函数或复制/移动构造函数（C++11 的 std::move）/赋值运算符，那么程序非良构：

```cpp
class Test {
public:
    void f(int i = 3);
    void g(int i, int j = 90);
    Test(int params);
};

// 非良构，重定义了默认参数
void Test::f(int i = 5) {}
// 良构
void Test::g(int i = 5, int j) {};
// 非良构，该函数使得类内部的构造函数变成了默认构造函数
Test::Test(int params = 123) {};
```

再看下面这段代码：

```cpp
#include <iostream>

class Base {
public:
    virtual void test(int a = 8) {
        std::cout << "Base: " << a << std::endl;
    }
};

class Derived: public Base {
public:
    void test(int a) override {
        std::cout << "Derived: " << a << std::endl;
    }
};

int main() {
    std::unique_ptr<Base> t { new Derived };
    t->test();  // 8

    return 0;
}
```

虚函数的重写函数不会从基类获得默认参数，而是在调用时根据变量的静态类型来确定的。

静态类型：对程序进行编译时分析得到的表达式类型，程序执行时静态类型不会发生改变。

动态类型：如果某个泛左值表达式指代某个多态对象，那么它最终派生对象的类型被称为它的动态类型。（多态就是了）

我们来看看这个例子：

```cpp
#include <iostream>

struct D {
    int n = 123;
    static const int a = 345;

    void t1(int x = n) {
        std::cout << x << std::endl;
    }

    void t2(int x = sizeof + n) {
        std::cout << x << std::endl;
    }
};
```

直接说明，成员函数 t2 是错误的。默认参数不能使用非静态的类成员（即使没有发生运算），除非用于构成成员指针或是在成员访问表达式中使用。

## 成员指针

### 成员函数指针

```cpp
#include <iostream>

struct Test {
    void f(int x) {
        std::cout << x << std::endl;
    }
};

int main() {
    // 成员函数指针
    void(Test:: * f1)(int) = &Test::f;

    Test x;

    // 等价于 x.f(1)
    (x.*f1)(1);
}
```

成员函数指针的内部存储的并不是指针，而是一个对于成员函数所属的类而言的偏移地址，让我们来进一步证明它：

```cpp
#include <iostream>

class Test {
public:
    void f(int x) {
        std::cout << x << std::endl;
    }
};

int main() {
    // 成员函数指针
    void(Test:: * f1)(int) = &Test::f;

    Test *x = new Test();

    // x 配合偏移量 f1 就可以找到成员函数 f
    (x->*f1)(1);
}
```

成员函数指针通常以这种形式出现：

```cpp
#include <iostream>

class Test {
public:
    void f(int x) {
        std::cout << x << std::endl;
    }
};

void call(void(Test::* p)(int), int x, Test &test) {
    (test.*p)(x);
}

int main() {
    Test *test = new Test();
    call(&Test::f, 123, *test);
}
```

成员函数重载：

```cpp
#include <iostream>

class Test {
public:
    void f() {
        std::cout << "1234" << std::endl;
    }
    void f(int x) {
        std::cout << x << std::endl;
    }
};

int main() {
    void(Test:: * p1)() = &Test::f;
    void(Test:: * p2)(int) = &Test::f;

    Test* test = new Test();

    // 1234
    (test->*p1)();
    // 123
    (test->*p2)(123);

    system("pause");
}
```

消除 std::bind 歧义：

```cpp
#include <iostream>

class Test {
public:
    void f() {
        std::cout << "1234" << std::endl;
    }
    void f(int x) {
        std::cout << x << std::endl;
    }
};

int main() {
    Test* test = new Test();

    // 1234
    (test->*p1)();
    // 123
    (test->*p2)(123);

    system("pause");
}
```

用 std::invoke（C++17）也可以实现类似的效果：

```cpp
#include <iostream>

class Test {
public:
    void f() {
        std::cout << "hello" << std::endl;
    }
};

int main() {
    Test* test = new Test();

    // 无返回值，直接调用
    std::invoke(&Test::f, test);

    system("pause");

    return 0;
}
```

### 数据成员指针

数据成员指针就更简单了，没啥好说的，直接看代码：

```cpp
#include <iostream>

class Test {
public:
    int x = 2;
};

int main() {
    int Test::* p = &Test::x;

    Test* test = new Test();

    std::cout << test->*p << std::endl;

    return 0;
}
```

不过这些语法我们一般不会直接使用，大部分还是要用 std::invoke（C++17）：

```cpp
#include <iostream>

class Test {
public:
    int x = 2;
};

int main() {
    Test* test = new Test();

    int &p = std::invoke(&Test::x, test);

    std::cout << p << std::endl;

    return 0;
}
```

### 成员函数指针都存了什么

msvc 对这些转换很敏感，所以这些代码在 gcc 测试是没有问题的 ​：

```cpp
#include <iostream>

struct X {
    void f() { std::cout << "func\n"; }
};
int main() {
    using Func = void(*)(X* const);
    auto p = &X::f;

    auto func = (Func)(p);

    func(nullptr);  //打印func
}
```

所有的函数都有明确地址，那么函数成员指针也一样，不然在汇编层面是无法 jmp 过去执行的。

### 数据成员指针都存了什么

所有的数据成员指针存储的都只是一个偏移量：

```cpp
#include <iostream>

struct X {
    int a;
    double b;
};

int main() {
    auto p1 = &X::a;
    auto p2 = &X::b;

    std::cout << *reinterpret_cast<int*>(&p1) << '\n';  // 0
    std::cout << *reinterpret_cast<int*>(&p2) << '\n';  // 8

    return 0;
}
```

### 虚成员函数指针存了什么

```cpp
#include <iostream>

struct X {
    virtual void f() {
        std::cout << "X\n";
    }
};

int main() {
    auto p = &X::f;

    auto func = *(int*)(&p);

    std::cout << func << std::endl; // gcc: 1    msvc: 不固定值

    return 0;
}
```

和数据成员差不多，虚成员函数指针也是偏移量。由于 C++ 标准只规定了行为，所以最终会因为编译器而有所区别。

## [用户定义字面量](https://zh.cppreference.com/w/cpp/language/user_literal)

### 创建并使用用户定义字面量

```cpp
#include <iostream>

std::string operator""_h(const char* str, size_t size) {
    std::cout << "size: " << size << std::endl;
    return { "I'll always return the string." };
}

int main() {
    std::cout << "hello world"_h << std::endl;

    return 0;
}
```

### 时间与日期的字面量

```cpp
#include <iostream>
#include <chrono>

using namespace std::literals::chrono_literals;

int main() {
    auto str1 = 1ms;
    auto str2 = 1h;

    return 0;
}
```

### 字符串字面量运算符模板

```cpp
#include <iostream>
#include <format>

class Param {
public:
    const char* str;
    constexpr Param(const char* s) noexcept :str(s) {}
};

template <Param p>
constexpr auto operator""_f() {
    return[=]<typename... T>(T... Args) {
        return std::format(p.str, Args...);
    };
}

int main() {
    // a:1, b:2, c:3
    std::cout << "a:{}, b:{}, c:{}"_f(1, 2, 3) << std::endl;

    return 0;
}
```

## [用户定义转换函数](https://zh.cppreference.com/w/cpp/language/cast_operator)

此函数类似运算符重载，规定了当对象被转换为指定类型时的行为：

```cpp
#include <cassert>

class Test {
public:
    // 显式转换
    explicit operator int() {
        return 1;
    }

    // 隐式转换
    operator bool() {
        return false;
    }

    // 错误：转换类型标识中不能出现数组运算符（任何情况下都不能转换到数组）
    /*
    operator int(*)[3]() const {
        return nullptr;
    };
    */
};

int main() {
    Test t{};

    // 显式转换 Test 类型到 int
    int a = (int)t;
    assert(a == 1);

    // 隐式转换 Test 类型到 bool
    bool b = t;
    assert(b == false);

    // 显式转换 Test 类型到 bool
    bool c = (bool)t;
    assert(c == false);

    return 0;
}
```

隐式转换并不安全，请尽量使用 explicit 关键字来阻止隐式转换类型。

## [三路比较](https://zh.cppreference.com/w/cpp/language/operator_comparison#.E4.B8.89.E8.B7.AF.E6.AF.94.E8.BE.83)

```cpp
#include <compare>
#include <cassert>

int main() {
    auto a = 1 <=> 2;
    assert(a < 0);
    assert(a == std::strong_ordering::less);

    auto b = 2 <=> 2;
    assert(b == 0);
    assert(b == std::strong_ordering::equal);

    auto c = 3 <=> 2;
    assert(c > 0);
    assert(c == std::strong_ordering::greater);

    // unsigned int i = 1;
    // auto r = -1 <=> i; // 错误：要求窄化转换

    return 0;
}
```

## 模块

自此开始，彻底改变了先前的开发方式，目前由很多编译器不支持这个特性，这里就不再展开说，具体请参考 [cppreference - modules](https://zh.cppreference.com/w/cpp/language/modules)。

## [标准库参考](https://zh.cppreference.com/w/cpp/standard_library)

[标准库标头文件](https://zh.cppreference.com/w/cpp/header)

### 智能指针

[unique_ptr：拥有独有对象所有权语义的智能指针](https://zh.cppreference.com/w/cpp/memory/unique_ptr)

[shared_ptr：拥有共享对象所有权语义的智能指针](https://zh.cppreference.com/w/cpp/memory/shared_ptr)

[weak_ptr：到 std::shared_ptr 所管理对象的弱引用](https://zh.cppreference.com/w/cpp/memory/weak_ptr)

[auto_ptr：拥有严格对象所有权语义的智能指针](https://zh.cppreference.com/w/cpp/memory/auto_ptr)

### [utility - std::swap](https://zh.cppreference.com/w/cpp/algorithm/swap)

主要用于 STL 容器：

```cpp
#include <utility>
#include <vector>
#include <cassert>

int main() {
    std::vector<int> a{1, 2, 3};
    std::vector<int> b{4, 5, 6};
    // 交换两个 vector 的值
    std::swap(a, b);

    assert(a[0] == 4);
    assert(b[0] == 1);

    return 0;
}
```

### [utility - std::move](https://zh.cppreference.com/w/cpp/utility/move)

```cpp
#include <memory>
#include <cassert>

int main() {
    auto p = std::make_unique<int>(1);
    // 使用 std::move 将 p 变为将亡值（右值）
    auto q = std::move(p);

    // p 被重置
    assert(p == nullptr);

    // 可以为 p 指定新的内存
    p = std::make_unique<int>(int{2});
    assert(*p == 2);

    return 0;
}
```

### [utility - std::in_range](https://zh.cppreference.com/w/cpp/utility/move)

若 t 的值在能以 R 表示的值的范围内，即 t 能转换到 R 而无数据损失则为 true。

若 t 或 R 不是有符号或无符号整数类型（包括标准整数类型与扩展整数类型），则为编译时错误。

```cpp
#include <utility>
#include <cassert>

int main() {
    assert(std::in_range<size_t>(-1) == false);
    assert(std::in_range<size_t>(42) == true);

    return 0;
}
```

### std::string_view

string_view 是 C++17 引入的一个类模板，它可以表示一个不可变的连续的字符序列。它不拥有字符串的内存，只是保存了一个指向字符串的指针和一个字符串的长度。它提供了类似于 std::string 的接口，可以方便地操作字符串，比如访问元素、获取子串、比较、查找等。

它优点是它可以避免不必要的字符串拷贝和内存分配，从而提高程序的性能和效率。它可以用来替代一些接受 const char\* 或 const std::string& 作为参数的函数，使得函数可以接受任何类型的字符串，包括静态字符串、std::string、字符数组等。

它的缺点是不保证字符串的生命周期，所以使用时要注意确保被引用的字符串在 string_view 存在期间不被销毁或修改。另外，string_view 不以空字符结尾，所以不能直接传递给一些需要空终止符的函数，比如 printf 等。

下面是 string_view 的例子：

```cpp
#include <iostream>
#include <string>
#include <string_view>

// 一个接受 string_view 作为参数的函数
void print(std::string_view sv) {
  std::cout << sv << "\n";
}

int main() {
  // 静态字符串
  print("Hello, world!");

  // 字符数组
  char arr[] = {'H', 'e', 'l', 'l', 'o'};
  std::cout << std::string_view(arr, 5) << std::endl;

  // std::string
  std::string str = "Hello, C++17";
  std::cout << str << std::endl;

  // string_view 的子串
  std::string_view sv = str;
  std::cout << sv.substr(7) << std::endl;

  return 0;
}
```

std::string_view 与 std::string 的配合使用：

```cpp
#include <iostream>
#include <string>
#include <string_view>

int main() {
  // 从静态字符串构造 string_view
  std::string_view sv = "Hello, world!";

  // 从 string_view 构造 string
  std::string str1(sv);

  // 从 string_view 赋值给 string
  std::string str2;
  str2 = sv;

  // 从 string 构造 string_view
  std::string str3 = "Hello, C++17";
  std::string_view sv2 = str3;

  // 从 string_view 构造 string，优化为移动
  std::string str4(sv2);

  std::cout << "str1: " << str1 << std::endl;
  std::cout << "str2: " << str2 << std::endl;
  std::cout << "str3: " << str3 << std::endl;
  std::cout << "str4: " << str4 << std::endl;

  return 0;
}
```

## 拷贝构造函数

```cpp
#include <iostream>
#include <utility>

using string = std::string;
struct Test {
    string name_;

    explicit Test(string name) : name_(std::move(name)) {
        std::cout << "Default Constructor\n";
    }

    ~Test() {
        std::cout << "Destroy Constructor\n";
    }

    Test(const Test& t) {
        std::cout << "Copy Constructor\n";
        name_ = t.name_ + "_new";
    }
};

int main() {
    Test t1{"lee"};
    std::cout << t1.name_ << std::endl; // lee

    Test t2 = t1;
    std::cout << t2.name_ << std::endl; // lee_new
}
```

## 移动构造函数

```cpp
#include <iostream>
#include <utility>

using string = std::string;
struct Test {
    string name_;

    explicit Test(string name) : name_(std::move(name)) {
        std::cout << "Default Constructor\n";
    }

    ~Test() {
        std::cout << "Destroy Constructor\n";
    }

    Test(Test&& t)  noexcept {
        std::cout << "Move Constructor\n";
        name_ = std::move(t.name_) + "_new";
    }
};

int main() {
    Test t1{"lee"};
    std::cout << t1.name_ << std::endl; // lee

    Test t2 = std::move(t1);
    Test t3 = (Test&& t2);
    std::cout << t3.name_ << std::endl; // lee_new_new
}
```

## 复制消除

```cpp
#include <iostream>

struct Test {
    Test() {
        std::cout << "Default Constructor\n";
    }

    Test(Test&& t) noexcept {
        std::cout << "Move Constructor\n";
    }

    Test(Test& t) {
        std::cout << "Copy Constructor\n";
    }
};

Test f1() {
    Test t{};
    return t;
}

Test f2() {
    return f1();
}

Test f3() {
    return f2();
}

int main() {
    Test t = f3();  // Default Constructor
}
```

## 完美转发
