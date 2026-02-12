// 第一部分 起步
age = prompt("Please tell me your age:"); // 获取用户键盘输入 

// JavaScript 是弱类型（也称为动态类型）允许一个变量在任意时刻存放任意类型的值。这种方式允许一个变量在程序的逻辑流中的任意时刻代表
// 任意类型的值，人们认为这样可以提高程序的灵活性。

// typeof null 是一个有趣的示例，你期望它返回的会是"null"，但它返回的却是"object"，这是JavaScript 中存在已久的一个bug，
// 也似乎是一个永远不会被修复的bug。Web 上的太多代码都依赖于这个bug，因此，修复它会导致大量的新bug ！

// 可以通过点号（如obj.a 所示）或者中括号（如obj["a"] 所示）来访问属性。
// obj[str] 键值可以是变量

// 不同情况下应该使用== 还是===。
// 如果要比较的两个值的任意一个（即一边）可能是true 或者false 值，那么要避免使用==，而使用===。
// 如果要比较的两个值中的任意一个可能是特定值（0、"" 或者[]——空数组），那么避免使用==，而使用===。
// 在所有其他情况下，使用== 都是安全的。不仅仅只是安全而已，这在很多情况下也会简化代码，提高代码的可读性。

var a = 42;
var b = "foo";
a < b; // false
a > b; // false
a == b; // false
// 为什么这三个比较结果都为假呢？这是因为< 和 > 比较中的值b 都被类型转换为了“无效数字值”NaN，规范设定NaN 既不大于也不小于任何其他值。
// == 比较的结果为假的原因则不同。不论解释为42 == NaN 还是"42" == "foo"，都会使得a == b 结果为假。

// 无论var 出现在一个作用域中的哪个位置，这个声明都属于整个作用域，在其中到处都是可以访问的。
// 这一行为被比喻地称为提升（hoisting），var 声明概念上“移动”到了其所在作用域的最前面。

function foo() {
    var a = 1;
    if (a >= 1) {
        var bb = 33; // bb会被提升，属于整个foo() 函数的作用域
        let b = 2; // b 只属于if 语句，不属于整个foo() 函数的作用域。
        while (b < 5) {
            var cc = 44; // cc会被提升，属于整个foo() 函数的作用域
            let c = b * 2; // c 只属于while 循环
            b++;
            console.log(a + c);
        }
    }
}

// 闭包
// 在JavaScript 中，闭包最常见的应用是模块模式。模块允许你定义外部不可见的私有实现细节（变量、函数），
// 同时也可以提供允许从外部访问的公开API。
function User() {
    var username, password;
    function doLogin(user, pw) {
        username = user;
        password = pw;
        // 执行剩下的登录工作
    }
    var publicAPI = {
        login: doLogin
    };
    return publicAPI;
}
// 创创建一个User模块实例
var fred = User();
fred.login("fred", "12Battery34!");
// 函数User() 用作外层作用域， 持有变量username 和password， 以及内层的函数
// doLogin()；这些都是这个User 模块私有的内部细节，无法从外部访问。

// 我们有意没有调用new User()，尽管这事实上可能对多数读者来说更为熟悉。User() 只是一个函数，
// 而不是需要实例化的类，所以只是正常调用就可以了。使用new 是不合适的，实际上也是浪费资源。

// this 并不指向这个函数本身，意识到这一点非常重要，因为这是最常见的误解。
function foo() {
    console.log(this.bar);
}
var bar = "global";
var obj1 = {
    bar: "obj1",
    foo: foo
};
var obj2 = {
    bar: "obj2"
};
foo(); // "global"
obj1.foo(); // "obj1"
foo.call(obj2); // "obj2"
new foo(); // undefined【将this 设置为一个全新的空对象】

// 关键词this 是根据相关函数的执行方式而动态绑定的
// 你需要接受我们永远无法完全了解JavaScript 这个事实，因为即使你掌握了所有内容，还是会出现你需要学习的新东西。

// 是工具化（提供工具）。具体来说是一种称为transpiling（transformation ＋ compiling，转换＋编译）的技术。
// 简单地说，其思路是利用专门的工具把你的ES6 代码转化为等价（或近似！）的可以在ES5 环境下工作的代码。

// 并非所有的ES6 新特性都需要使用transpiler，还有polyfill（也称为shim）这种模式。 在可能的情况下，
// polyfill 会为新环境中的行为定义在旧环境中的等价行为。语法不能polyfill，而API 通常可以。例子：
if (!Object.is) {
    Object.is = function (v1, v2) {
        // 检查-0
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2;
        }
        // 检查NaN
        if (v1 !== v1) {
            return v2 !== v2;
        }
        // 其余所有情况
        return v1 === v2;
    };
}

// 人们认为JavaScript 会持续不断地发展，浏览器会逐渐地而不是以大规模突变的形式支持
// 新特性。所以，保持JavaScript 发展更新的最好战略就是在你的代码中引入polyfill shim，
// 并且在构建过程中加入transpiler 步骤，现在就开始接受并习惯这个新现实吧。



