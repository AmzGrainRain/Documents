# 现代 C++ 规范与特性

## auto

这并不是动态类型，最终的类型取决于编译期间右值的类型。换句话说就是让编译器在编译期根据右值推导出这个变量的类型：

```cpp
auto x = 1;     // int
auto y = 'c';   // char
```

当你觉得一个类型没必要明确写出来或者无论是写还是看都显得太长时，可以试试 auto 关键字。

## decltype

decltype 用于推导**表达式类型**，这里只用于编译器分析表达式的类型，表达式实际不会进行运算：

```cpp
auto x = 1;
auto y = 2;

int& m = x;
decltype(m) n = y; // n 与 m 的类型相同
```

## 右值引用 (万能引用)

```cpp
// 以前（没啥用）
const int& a = 1;

// 现在
int&& b = 1;
int&& c = b;
```

## std::bind

类似 scala 的高阶函数：

```cpp
#include <iostream>
#include <functional>

// 计算两点距离
double distance_between_two_points(int x1, int y1, int x2, int y2) {
    return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
}

int main() {
    // 已知第一个点
    int x1 = 3, y1 = 5;

    // 固定前两个参数
    auto fun1 = std::bind(distance_between_two_points, x1, y1, std::placeholders::_1, std::placeholders::_2);

    // (x1, y1) 到 (6, 8) 的距离
    double res1 = fun1(6, 8);

    // (x1, y1) 到 (2, 1) 的距离
    double res2 = fun1(2, 1);

    // (x1, y1) 到 (13, 20) 的距离
    double res3 = fun1(13, 20);

    system("pause");
}
```

## lambda

与对 std:bind 的调用相比，lambdas 更可读、更清晰、更容易处理重载问题：

```cpp
#include <iostream>
#include <functional>

// 计算两点距离
double distance_between_two_points(int x1, int y1, int x2, int y2) {
    return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
}

int main() {
    // 已知第一个点
    auto fun1 = [](int x2, int y2) { return distance_between_two_points(3, 5, x2, y2); };

    // (x1, y1) 到 (6, 8) 的距离
    double res1 = fun1(6, 8);

    // (x1, y1) 到 (2, 1) 的距离
    double res2 = fun1(2, 1);

    // (x1, y1) 到 (13, 20) 的距离
    double res3 = fun1(13, 20);

    system("pause");
}
```

## 默认参数

### part 1

在默认实参之后的所有参数必须也是默认实参，**在先前的声明中所提供的默认实参也算**。  
下面的代码在 Visual Studio 中会提示语法错误，但它是可以正常编译并且运行的：

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

### part 2

对于非模板类的成员函数，类外部的定义允许出现默认实参，并与类内的成员函数参数合并，如果类外的默认实参使类内部的成员函数变成默认构造函数或复制/移动构造函数（C++11的std::move）/赋值运算符，那么程序非良构：

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

### part 3

先看下代码：

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

### part 4

```cpp
#include <iostream>

struct D {
    int n = 123;
    static const int a = 345;
    void t1(int x = n) { std::cout << x << std::endl; }
    void t2(int x = sizeof + n) { std::cout << x << std::endl; }
};
```

直接说明，成员函数 t2 是错误的。默认参数不能使用非静态的类成员（即使没有发生运算），除非用于构成成员指针或是在成员访问表达式中使用。

## 成员指针

### 成员函数

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

### 数据成员

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

msvc 对这些转换很敏感，所以这些代码在 gcc 测试是没有问题的​：

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

## 运算符重载

据我所知目前只有 `.`、`->` 不可重载。

## 用户定义字面量

### part 1

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

### part 2

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

### part 3

```cpp
#include <iostream>
#include <format>

struct A {
    constexpr A(const char* s) noexcept :str(s) {}
    const char* str;
};

template <A a>
constexpr auto operator""_f() {
    return[=]<typename... T>(T... Args) {
        return std::format(a.str, Args...);
    };
}

int main() {
    // a:1, b:2, c:3
    std::cout << "a:{}, b:{}, c:{}"_f(1, 2, 3) << std::endl;

    return 0;
}
```

### part 4
