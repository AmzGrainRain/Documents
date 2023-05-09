# C++ 11 特性与规范

## auto

让编译器在编译器就推导出**变量类型**，可以通过等号右边的类型推导出变量的类型：

```cpp
auto x = 1;
auto y = 'c';
```

## decltype

decltype 用于推导**表达式类型**，这里只用于编译器分析表达式的类型，表达式实际不会进行运算：

```cpp
auto x = 1;
auto y = 2;

int& m = x;
decltype(m) n = y; // n 与 m 的类型相同
```

## 左值引用

```cpp
// 以前
const int& a = 1;

// 现在
int&& b = 1;
```
