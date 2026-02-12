/**
 * 第一部分：作用域和闭包
 */

// 第1章:类型
// JavaScript 有七种内置类型：【除对象之外，其他统称为“基本类型”】
// • 空值（null）
// • 未定义（undefined）
// • 布尔值（ boolean）
// • 数字（number）
// • 字符串（string）
// • 对象（object）
// • 符号（symbol，ES6 中新增）

typeof undefined === "undefined"; // true
typeof true === "boolean"; // true
typeof 42 === "number"; // true
typeof "42" === "string"; // true
typeof { life: 42 } === "object"; // true
typeof [1, 2, 3] === "object"; // true
typeof Symbol() === "symbol"; // true

// 比较特殊的null类型
typeof null === "object"; // true
// 我们需要使用复合条件来检测null 值的类型：
var a = null;
(!a && typeof a === "object"); // true

typeof function a() { /* .. */ } === "function"; // true
// function（函数）也是JavaScript 的一个内置类型。然而查阅规范就会知道，它实际上是object 的一个“子类型”。
// 具体来说，函数是“可调用对象”，它有一个内部属性[[Call]]，该属性使其可以被调用。

// 函数不仅是对象，还可以拥有属性。例如：
function a(b, c) {
    /* .. */
}
// 函数对象的length 属性是其声明的参数的个数：
a.length; // 2
// 因为该函数声明了两个命名参数，b 和c，所以其length 值为2。

// JavaScript 中的变量是没有类型的，只有值才有。变量可以随时持有任何类型的值。
var a;
typeof a; // "undefined"，变量在未持有值的时候为undefined
a = 42;
typeof a; // "number"
a = true;
typeof a; // "boolean"
// typeof 运算符总是会返回一个字符串：
typeof typeof 42; // "string"

// undefined 和undeclared
var a;
a; // undefined
b; // ReferenceError: b is not defined，但它的 typeof也是"undefined"
typeof a; // "undefined"
typeof b; // "undefined"【但typeof b 并没有报错，这是因为typeof 有一个特殊的安全防范机制】

// typeof Undeclared 安全防范机制的用途，例子：顶层的全局变量声明var DEBUG =true 只在debug.js 文件中才有，
// 而该文件只在开发和测试时才被加载到浏览器，在生产环境中不予加载。
if (DEBUG) { // 这样会抛出错误
    console.log("Debugging is starting");
}
// 这样是安全的
if (typeof DEBUG !== "undefined") {
    console.log("Debugging is starting");
}
// typeof不仅对用户定义的变量（比如DEBUG）有用，对内建的API 也有帮助。
if (typeof atob === "undefined") {
    atob = function () { /*..*/ }; // 去掉var 则可以防止声明被提升。
}
// 还有一种不用通过typeof 的安全防范机制的方法，就是检查所有全局变量是否是全局对象的属性，
// 浏览器中的全局对象是window。所以前面的例子也可以这样来实现：
if (window.DEBUG) {
    console.log("Debugging is starting");
}
if (!window.atob) {
    // ..
}

// 第2章:值
// 数组
// 数组可以容纳任何类型的值，可以是字符串、数字、对象（object），甚至是其他数组（多维数组就是通过这种方式来实现的）：
var a = [1, "2", [3]];
a.length; // 3
a[0] === 1; // true
a[2][0] === 3; // true
// 使用delete 运算符可以将单元从数组中删除，但是请注意，单元删除后，数组的length 属性并不会发生变化。
// 空缺单元的数组
var a = [];
a[0] = 1;
// 此处没有设置a[1]单元，a[1]是空白单元
a[2] = [3];
a[1]; // undefined，与a[1] = undefined是有区别的
a.length; // 3

// 数组通过数字进行索引，但数组也是对象，所以也可以包含字符串键值和属性【但这些并不计算在数组长度内】
var a = [];
a[0] = 1;
a["foobar"] = 2; // 等价于 a.foobar = 2;
a.length; // 1
a["foobar"]; // 2
a.foobar; // 2 两种访问形式
// 这里有个问题需要特别注意，如果字符串键值能够被强制类型转换为十进制数字的话，它就会被当作数字索引来处理。
var a = [];
a["13"] = 42;
a.length; // 14

// 复制数组 slice(..) 或 Array.from 效果一样
var arr = Array.prototype.slice.call(arguments)
var arr = Array.from(arguments);

// 字符串
// 和数组都有：length、indexOf(..)、concat(..) 方法

var a = "foo";
var b = ["f", "o", "o"];
var c = a.concat("bar"); // "foobar"
var d = b.concat(["b", "a", "r"]); // ["f","o","o","b","a","r"]
a === c; // false
b === d; // false
a; // "foo"
b; // ["f","o","o"]

// JavaScript 中字符串是不可变的，而数组是可变的。
a[1] = "x";
b[1] = "x";
a; // "foo"
b; // ["f","x","o"]

// 字符串”借用“数组的方法
var c = Array.prototype.join.call(a, "-");
var d = Array.prototype.map.call(a, function (v) {
    return v.toUpperCase() + ".";
}).join("");
c; // "f-o-o"
d; // "F.O.O."

// 将字符串转换为数组，待处理完后再将结果转换回字符串
var c = a
    .split("") // 将a的值转换为字符数组
    .reverse() // 将数组中的字符进行倒转
    .join(""); // 将数组中的字符拼接回字符串
c; // "oof"

// 数字的语法
// 数字前面的0 可以省略：
var a = 0.42;
var b = .42;
// 小数点后小数部分最后面的0 也可以省略：
var a = 42.0;
var b = 42.;

// tofixed(..) 方法可指定小数部分的显示位数
var a = 42.59;
a.toFixed(0); // "43"
a.toFixed(1); // "42.6"
a.toFixed(2); // "42.59"
a.toFixed(4); // "42.5900"

// 无效语法：
// 42.toFixed( 3 ); // SyntaxError .运算符优先识别为数字常量的一部分，然后才是对象属性访问运算符。
// . 被视为常量42. 的一部分
// 下面的语法都有效：
(42).toFixed(3); // "42.000"
0.42.toFixed(3); // "0.420"
42..toFixed(3); // "42.000"
42 .toFixed(3); // "42.000" 【不推荐】

// 二进制、八进制、十六进制
0xf3; // 243的十六进制【推荐】
0Xf3; // 同上
0o363; // 243的八进制【推荐】
0O363; // 同上
0b11110011; // 243的二进制【推荐】
0B11110011; // 同上

// 浮点类型等于比较
0.1 + 0.2 === 0.3; // false
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON

// 整数检测
Number.isInteger(42); // true
Number.isInteger(42.000); // true 【*】
Number.isInteger(42.3); // false
// 本质
if (!Number.isInteger) {
    Number.isInteger = function (num) {
        return typeof num == "number" && num % 1 == 0;
    };
}

// void 运算符
// void 并不改变表达式的结果，只是让表达式不返回值：
var a = 42;
console.log(void a, a); // undefined 42
function doSomething() {
    // 注： APP.ready 由程序自己定义
    if (!APP.ready) {
        // 稍后再试
        return void setTimeout(doSomething, 100);
    }
    // 上面的void 等价于下面的逻辑
    if (!APP.ready) {
        // 稍后再试
        setTimeout(doSomething, 100);
        return;
    }
    var result;
    // 其他
    return result;
}
// 总之，如果要将代码中的值（如表达式的返回值）设为undefined，就可以使用void。

// NaN（not a number）不是数字的数字，NaN是JavaScript 中唯一一个不等于自身的值
// 如果数学运算的操作数不是数字类型（或者无法解析为常规的十进制或十六进制数字），
// 就无法返回一个有效的数字，这种情况下返回值为NaN。
var a = 2 / "foo"; // NaN。即“执行数学运算没有成功，这是失败后返回的结果”
typeof a === "number"; // true。“不是数字的数字”仍然是数字类型
a == NaN; // false
a === NaN; // false
// NaN 是一个特殊值，它和自身不相等，是唯一一个非自反的值。而NaN != NaN 为true。
// 那如何对NaN进行判断呢？
// 方法一【不好，有问题】
var a = 2 / "foo";
var b = "foo";
a; // NaN
b; // "foo"
window.isNaN(a); // true
window.isNaN(b); // true——晕！【不符合预期】
// 方法二
if (!Number.isNaN) {
    Number.isNaN = function (n) {
        return (
            typeof n === "number" &&
            window.isNaN(n)
        );
    };
}
var a = 2 / "foo";
var b = "foo";
Number.isNaN(a); // true
Number.isNaN(b); // false——好！【符合预期】
// 方法三，利用NaN 不等于自身这个特点。NaN 是JavaScript 中唯一一个不等于自身的值。
if (!Number.isNaN) {
    Number.isNaN = function (n) {
        return n !== n;
    };
}

// Infinity 无穷数
var a = 1 / 0; // Infinity
var b = -1 / 0; // -Infinity
0 / 0 // NaN
Infinity / Infinity //NaN
// -0【符合位，可以代表方向信息】
var a = 0 / -3; // -0
var b = 0 * -3; // -0
JSON.stringify(-0) // 返回"0"
JSON.parse("-0") // 返回-0
var c = 0
a == c; // true
-0 == 0; // true
function isNegZero(n) {
    n = Number(n);
    return (n === 0) && (1 / n === -Infinity);
}
isNegZero(-0); // true
isNegZero(0 / -3); // true
isNegZero(0); // false

// 特殊等式 Object.is(..)
var a = 2 / "foo";
var b = -3 * 0;
Object.is(a, NaN); // true
Object.is(b, -0); // true
Object.is(b, 0); // false
// 本质
if (!Object.is) {
    Object.is = function (v1, v2) {
        // 判断是否是-0
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2;
        }
        // 判断是否是NaN
        if (v1 !== v1) {
            return v2 !== v2;
        }
        // 其他情况
        return v1 === v2;
    };
}
// 注意：能使用== 和=== 时就尽量不要使用Object.is(..)，因为前者效率更高、更为通用。
// Object.is(..) 主要用来处理那些特殊的相等比较。

// 值和引用
function foo(x) {
    x = x + 1;
    x; // 3
}
var a = 2;
var b = new Number(a); // Object(a)也一样
foo(b);
console.log(b); // 是2，不是3
// 原因是标量基本类型值是【不可更改的】（字符串和布尔也是如此）。如果一个数字对象的标
// 量基本类型值是2，那么该值就不能更改，除非创建一个包含新值的数字对象。
// 封装对象的办法可以修改基本类型的值
function foo(wrapper) {
    wrapper.a = 42;
}
var obj = {
    a: 2
};
foo(obj);
obj.a; // 42

// 原生函数
var a = new String("abc"); // 再次强调，new String("abc") 创建的是字符串"abc" 的封装对象，而非基本类型值"abc"。
typeof a; // 是"object"，不是"String"
a instanceof String; // true
Object.prototype.toString.call(a); // "[object String]"
b = "aaa";
typeof b; // string
Object.prototype.toString.call(b); // "[object String]"
console.log(a) // String {0: "a", 1:"b", 2: "c", length: 3, Prototype: String, [[PrimitiveValue]]: "abc"}
console.log(b) // aaa

// 内部属性[[Class]]
// 所有typeof 返回值为"object" 的对象（如数组）都包含一个内部属性[[Class]]。这个属性无法直接访问，
// 一般通过Object.prototype.toString(..) 来查看
Object.prototype.toString.call([1, 2, 3]); // "[object Array]"
Object.prototype.toString.call(/regex-literal/i); // "[object RegExp]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call("abc"); // "[object String]"
Object.prototype.toString.call(42); // "[object Number]"
Object.prototype.toString.call(true); // "[object Boolean]"
// 基本类型值会被各自的封装对象自动包装

// 封装对象包装
// 一般情况下，我们不需要直接使用封装对象。最好的办法是让JavaScript 引擎自己决定什么时候应该使用封装对象。
// 换句话说，就是应该优先考虑使用"abc" 和42 这样的基本类型值，而非new String("abc") 和new Number(42)。
// 封装对象注意：
var a = new Boolean(false);
if (!a) { // 应修改为 if(!a.valueOf())
    console.log("Oops"); // 执行不到这里
}
if (a == false) {
    console.log("Oops"); // 可以执行
}
// 如果想要自行封装基本类型值，可以使用Object(..) 函数（不带new 关键字）：
var a = "abc";
var b = new String(a);
var c = Object(a);

typeof a; // "string"
typeof b; // "object"
typeof c; // "object"

b instanceof String; // true
c instanceof String; // true

Object.prototype.toString.call(b); // "[object String]"
Object.prototype.toString.call(c); // "[object String]"
// 再次强调，一般不推荐直接使用封装对象（如上例中的b 和c），但它们偶尔也会派上用场。

// 拆封 valueOf()
var a = new String("abc");
var b = a + ""; // b的值为"abc"，a 会自动拆封
typeof a; // "object"
typeof b; // "string"

// Array(..)
var a = new Array(1, 2, 3); // 可以省略new 关键字，var a = Array(1, 2, 3) 效果一样
a; // [1, 2, 3]
var b = [1, 2, 3]; // 推荐
b; // [1, 2, 3]
// 注意：Array 构造函数只带一个数字参数的时候，该参数会被作为数组的预设长度（length），而非只充当数组中的一个元素。
var a = new Array(3) // 不推荐：如若一个数组没有任何单元，但它的length 属性中却显示有单元数量，这样奇特的数据结构会导致一些怪异的行为。
a; // 长度length=3的空数组

// 我们将包含至少一个“空单元”的数组称为“稀疏数组”。
var c = [];
c.length = 3; // 稀疏数组

// 强制类型转换【即，隐式强制类型转换】
// JavaScript 中的强制类型转换总是返回标量基本类型值，如字符串、数字和布尔值，不会返回对象和函数。
// 类型转换发生在静态类型语言的编译阶段，而强制类型转换则发生在动态类型语言的运行时（runtime）。

// toString
// 1.07 连续乘以七个 1000
var a = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;
// 七个1000一共21位数字
a.toString(); // "1.07e21"

var a = [1, 2, 3];
a.toString(); // "1,2,3"

// JSON 字符串化和toString() 的效果基本相同，只不过序列化的结果总是字符串：
JSON.stringify(42); // "42"
JSON.stringify("42"); // ""42"" （含有双引号的字符串）
JSON.stringify(null); // "null"
JSON.stringify(true); // "true"

// 所有安全的JSON 值（JSON-safe）都可以使用JSON.stringify(..) 字符串化。安全的JSON 值是指能够呈现为有效JSON 格式的值。
// 不安全的JSON 值：undefined、function、symbol（ES6+）和包含循环引用（对象之间相互引用，形成一个无限循环）的对象都不符合JSON结构标准。
// JSON.stringify(..) 在对象中遇到undefined、function 和symbol 时会自动将其忽略，在数组中则会返回null（以保证单元位置不变）。例如：
JSON.stringify(undefined); // undefined
JSON.stringify(function () { }); // undefined
JSON.stringify(
    [1, undefined, function () { }, 4]
); // "[1,null,null,4]"
JSON.stringify(
    { a: 2, b: function () { } }
); // "{"a":2}"

// 自定义：如果对象中定义了toJSON() 方法，JSON 字符串化时会首先调用该方法，然后用它的返回值来进行序列化。
var o = {};
var a = {
    b: 42,
    c: o,
    d: function () { }
};
// 在a中创建一个循环引用
o.e = a;
// 循环引用在这里会产生错误
// JSON.stringify( a );
// 自定义的JSON序列化
a.toJSON = function () {
    // 序列化仅包含b
    return { b: this.b };
    // 很多人误以为toJSON() 返回的是JSON 字符串化后的值，其实不然，除非我们确实想要对
    // 字符串进行字符串化（通常不会！）。toJSON() 返回的应该是一个适当的值，可以是任何类型，然后再由JSON.stringify(..) 对其进行字符串化。
    // 也就是说，toJSON() 应该“返回一个能够被字符串化的安全的JSON 值”，而不是“返回一个JSON 字符串”。
};
JSON.stringify(a); // "{"b":42}"

// JSON.stringify(..) 传递一个可选参数replacer，它可以是数组或者函数。
// 用来指定对象序列化过程中哪些属性应该被处理，哪些应该被排除，和toJSON() 很像。
// 如果replacer 是一个数组，那么它必须是一个字符串数组，其中包含序列化要处理的对象的属性名称，除此之外其他的属性则被忽略。
var a = {
    b: 42,
    c: "42",
    d: [1, 2, 3]
};
JSON.stringify(a, ["b", "c"]); // "{"b":42,"c":"42"}"
// 如果replacer 是一个函数，它会对对象本身调用一次，然后对对象中的每个属性各调用一次，每次传递两个参数，键和值。
// 如果要忽略某个键就返回undefined，否则返回指定的值。
JSON.stringify(a, function (k, v) {
    console.log("k=" + k + ", v=" + v)
    if (k !== "c") return v;
}); // "{"b":42,"d":[1,2,3]}"
// 上面replacer 是函数时，输出的中间日志：
// k=, v=[object Object]
// k=b, v=42
// k=c, v=42
// k=d, v=1,2,3
// k=0, v=1
// k=1, v=2
// k=2, v=3
//【它的参数k 在第一次调用时为undefined（就是对对象本身调用的那次）】
//【由于字符串化是递归的，因此数组[1,2,3] 中的每个元素都会通过参数v 传递给replacer，即1、2 和3，参数k 是它们的索引值，即0、1 和2。】

// JSON.string 还有一个可选参数space，用来指定输出的缩进格式。可以是数字，也可以是字符串
JSON.stringify(a, null, 3);
JSON.stringify(a, null, "-----");

// ToNumber
// 其中true 转换为1，false 转换为0。undefined 转换为NaN，null 转换为0。
// 首先检查该值是否有valueOf() 方法，如果有并且返回基本类型值，就使用该值进行强制类型转换。
// 如果没有就使用toString()的返回值（如果存在）来进行强制类型转换。
// 如果valueOf() 和toString() 均不返回基本类型值，会产生TypeError 错误。
var a = {
    valueOf: function () {
        return "42";
    }
};
var b = {
    toString: function () {
        return "42";
    }
};
var c = [4, 2];
c.toString = function () {
    return this.join(""); // "42"
};
Number(a); // 42
Number(b); // 42
Number(c); // 42
Number(""); // 0
Number([]); // 0
Number(["abc"]); // NaN

// ToBoolean
// 假值列表如下：
// undefined
// null
// false
// 0、+0、-0、NaN
// ""
// 假值列表以外的值都是真值

// 所有的对象都是真值，假值对象也是真值
var a = new Boolean(false); // true
var b = new Number(0); // true
var c = new String(""); // true
var d = Boolean(a && b && c);
d; // true

// 迷惑的真值【记住：所有字符串都是真值。不过""除外】
var a = "false"; // true
var b = "0"; // true
var c = "''"; // true
var d = Boolean(a && b && c);
d; // true
var a = []; // true
var b = {}; // true
var c = function () { }; // true
var d = Boolean(a && b && c);
d; // true

// 显式强制类型转换【注意没有new】
var a = 42;
var b = String(a); // 请注意它们前面没有new 关键字，并不创建封装对象。
var c = "3.14";
var d = Number(c); // 请注意它们前面没有new 关键字，并不创建封装对象。
b; // "42"
d; // 3.14
// 使用new的情况
var b = new String(a);
var d = new Number(c);
b; // String {'42'}
d; // Number {3.14}
b.toString(); // "42"
d.valueOf; // 3.14

// 其他方法
var a = 42;
var b = a.toString(); // 会先自动为42 创建一个封装对象，然后对该对象调用toString()。这里显式转换中含有隐式转换。
var c = "3.14";
var d = +c; // 一元运算符 + 显式地将c 转换为数字，而非数字进行加法运算，也不是字符串拼接。
b; // "42"
d; // 3.14

var c = "3.14";
var d = 5 + +c; //【不推荐】
d; // 8.14
- -"3.14" // 3.14【不推荐，中间加一个空】

// 一元运算符+ 的另一个常见用途是将日期（Date）对象强制类型转换为数字，返回结果为Unix 时间戳，以微秒为单位。
var d = new Date("Mon, 18 Aug 2014 08:53:06 CDT");
+d; // 1408369986000

// 获得当前的时间
var timestamp = +new Date();
// JavaScript 有一处奇特的语法，即构造函数没有参数时可以不用带()，仅能用于new的情况，对一般的函数调用fn() 并不适用。
var timestamp = +new Date;

// 其它获取时间戳的方法
var timestamp = new Date().getTime(); // 获得指定时间的时间戳
var timestamp = Date.now(); //获得当前的时间戳【推荐】
// 为老版本浏览器提供 Date.now() 的polyfill 也很简单：
if (!Date.now) {
    Date.now = function () {
        return +new Date();
    };
}

// 奇特的~ 运算符【它首先将值强制类型转换为32 位数字，然后执行字位操作“非”，对每一个字位进行反转】
// 字位运算符只适用于32 位整数，运算符会强制操作数使用32 位格式。
// ~x 大致等同于-(x+1)
~42; // -(42+1) ==> -43
// 因为 -(x+1) 只有在 x=-1 时值为 0，所以对于返回值为 -1时，可以使用 ~ 进行真假判断，因为0 是假，其它都是真。
// 例子：indexOf(..) 如果找到就返回子字符串所在的位置（从0 开始），否则返回-1。
var a = "Hello World";
if (a.indexOf("lo") >= 0) { // true
    // 找到匹配！
}
if (a.indexOf("lo") != -1) { // true
    // 找到匹配！
}
// >= 0 和== -1 这样的写法不是很好，称为“抽象渗漏”，意思是在代码中暴露了底层的实现细节，这里是指用-1 作为失败时的返回值，这些细节应该被屏蔽掉。
// ~ 就有了作用
var a = "Hello World";
if (~a.indexOf("lo")) { // true
    // 找到匹配！
}
if (!~a.indexOf("ol")) { // true
    // 没有找到匹配！
}
// indexOf(..) 返回-1，~ 将其转换为假值0，其他情况一律转换为真值。

// 显式解析数字字符串
var a = "42";
var b = "42px";
Number(a); // 42
parseInt(a); // 42
Number(b); // NaN【转换：换不允许出现非数字字符，否则会失败并返回NaN】
parseInt(b); // 42【解析：允许字符串中含有非数字字符，解析按从左到右的顺序，如果遇到非数字字符就停止】【注意：参数是字符串】
// parseFloat(..)
// parseInt 第二个参数是定义是多少进制，默认是十进制
// parseInt 第一个参数如果不是字符串，会产生许多问题
parseInt(1 / 0, 19); // 18
// 等价于 parseInt("Infinity", 19) => parseInt("I", 19) => 18
// 此外还有一些看起来奇怪但实际上解释得通的例子：
parseInt(0.000008); // 0 ("0" 来自于 "0.000008")
parseInt(0.0000008); // 8 ("8" 来自于 "8e-7")
parseInt(false, 16); // 250 ("fa" 来自于 "false")
parseInt(parseInt, 16); // 15 ("f" 来自于 "function..")
parseInt("0x10"); // 16
parseInt("103", 2); // 2
// 其实parseInt(..) 函数是十分靠谱的，只要使用得当就不会有问题。因为使用不当而导致一些莫名其妙的结果，并不能归咎于JavaScript 本身。

// 显式转换为布尔值
var a = "0";
var b = [];
var c = {};

var d = "";
var e = 0;
var f = null;
var g;

Boolean(a); // true
Boolean(b); // true
Boolean(c); // true

Boolean(d); // false
Boolean(e); // false
Boolean(f); // false
Boolean(g); // false
// 虽然Boolean(..) 是显式的，但并不常用。显式强制类型转换为布尔值最常用的方法是!!
!!a; // true
!!b; // true
!!c; // true

!!d; // false
!!e; // false
!!f; // false
!!g; // false

// 在if(..)这样的布尔值上下文中，如果没有使用Boolean(..) 和!!，就会自动隐式地进行ToBoolean 转换。
// 显式ToBoolean 的另外一个用处，是在JSON 序列化过程中将值强制类型转换为true 或false：
var a = [
    1,
    function () { /*..*/ },
    2,
    function () { /*..*/ }
];
JSON.stringify(a); // "[1,null,2,null]"
JSON.stringify(a, function (key, val) {
    if (typeof val == "function") {
        // 函数的ToBoolean强制类型转换
        return !!val;
    }
    else {
        return val;
    }
});
// "[1,true,2,true]"

// 隐式强制类型转换
// + ，如果+ 的其中一个操作数是字符串（或者通过以上步骤可以得到字符串），则执行字符串拼接；否则执行数字加法。
// ES5规范：如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+ 将进行拼接操作。
// 如果其中一个操作数是对象（包括数组），则首先对其调用ToPrimitive 抽象操作，该抽象操作再调用[[DefaultValue]]。
var a = [1, 2];
var b = [3, 4];
a + b; // "1,23,4"
// 因为数组的valueOf() 操作无法得到简单基本类型值，于是它转而调用toString()。
// 因此上例中的两个数组变成了"1,2" 和"3,4"。+ 将它们拼接后返回"1,23,4"。

// a + ""（隐式）和前面的String(a)（显式）之间有一个细微的差别需要注意。根据ToPrimitive 抽象操作规则，
// a + "" 会对a 调用valueOf() 方法，然后通过ToString 抽象操作将返回值转换为字符串。而String(a) 则是直接调用ToString()。
var a = {
    valueOf: function () { return 42; },
    toString: function () { return 4; }
};
a + ""; // "42"
String(a); // "4"

// 字符串强制类型转换为数字
var a = "3.14";
var b = a - 0;
b; // 3.14
// - 是数字减法运算符，因此a - 0 会将a 强制类型转换为数字。也可以使用a * 1 和a /1，因为这两个运算符也只适用于数字，只不过这样的用法不太常见。
var a = [3];
var b = [1];
a - b; // 2
// 为了执行减法运算，a 和b 都需要被转换为数字，它们首先被转换为字符串（通过toString()），然后再转换为数字。


// && 和|| 运算符的返回值并不一定是布尔类型，而是两个操作数其中一个的值。例如：
var a = 42;
var b = "abc";
var c = null;
a || b; // 42
a && b; // "abc"
c || b; // "abc"
c && b; // null
// 在C 和PHP 中，上例的结果是true 或false，在JavaScript（以及Python 和Ruby）中却是某个操作数的值。
// ||
function foo(a, b) {
    a = a || "hello"; // 理解：检查变量a，如果还未赋值（或者为假值），就赋予它一个默认值（"hello"）。通过这种方式来设置默认值很方便
    b = b || "world";
    console.log(a + " " + b);
}
foo(); // "hello world"
foo("yeah", "yeah!"); // "yeah yeah!"
// &&
function foo() {
    console.log(a);
}
var a = 42;
a && foo(); // 42
// foo() 只有在条件判断a 通过时才会被调用。如果条件判断未通过，a && foo() 就会悄然终止（也叫作“短路”，short circuiting），foo() 不会被调用。
// 这样的用法对开发人员不太常见，开发人员通常使用if (a) { foo(); }。但JavaScript代码压缩工具用的是a && foo()，因为更简洁。

// 宽松相等（loose equals）== 和严格相等（strict equals）===。宽松不相等（loose not-equality）!= 就是== 的相反值，!== 同理。
// 偏见的理解：== 检查值是否相等，=== 检查值和类型是否相等。
// == 允许在相等比较中进行强制类型转换，而=== 不允许
// NaN 不等于NaN，+0 等于-0
var a = 42;
var b = "42";
a === b; // false
a == b; // true
// 规范1：
// (1) 如果Type(x) 是数字，Type(y) 是字符串，则返回x == ToNumber(y) 的结果。
// (2) 如果Type(x) 是字符串，Type(y) 是数字，则返回ToNumber(x) == y 的结果。

var x1 = true;
var x2 = false;
var y = "42";
var z = "1"
x1 == y // false
x2 == y // false，== 两边的布尔值会被强制类型转换为数字。
x1 == z // true
// 规范2：
// (1) 如果Type(x) 是布尔类型，则返回ToNumber(x) == y 的结果；
// (2) 如果Type(y) 是布尔类型，则返回x == ToNumber(y) 的结果。

// 使用建议：应避免使用== true、=== true这种
var a = "42";
if (a == true) { // 不要这样用，条件判断不成立
    // ..
}
if (a === true) { // 也不要这样用，条件判断不成立
    // ..
}
if (a) { // 这样的显式用法没问题
    // ..
}
if (!!a) { // 这样的显式用法更好
    // ..
}
if (Boolean(a)) { // 这样的显式用法也很好
    // ..
}

// 在== 中null 和undefined 相等（它们也与其自身相等）
var a = null;
var b;
a == b; // true
a == null; // true
b == null; // true
a == false; // false
b == false; // false
a == ""; // false
b == ""; // false
a == 0; // false
b == 0; // false

// 对象和非对象之间的相等比较
// 规定：
// (1) 如果Type(x) 是字符串或数字，Type(y) 是对象，则返回x == ToPrimitive(y) 的结果
// (2) 如果Type(x) 是对象，Type(y) 是字符串或数字，则返回ToPromitive(x) == y 的结果
var a = 42;
var b = [42];
a == b; // true
// 首先调用toString()，返回"42"，变成"42" == 42，然后
// 又变成42 == 42，最后二者相等。

// 拆封
var a = "abc";
var b = Object(a); // 和new String( a )一样
a === b; // false
a == b; // true
// a == b 结果为true，因为b 通过ToPromitive 进行强制类型转换（也称为“拆封”，英文为unboxed 或者unwrapped），并返回标量基本类型值"abc"，与a 相等。
// 但有一些值不这样，原因是== 算法中其他优先级更高的规则。例如：
var a = null;
var b = Object(a); // 和Object()一样
a == b; // false
var c = undefined;
var d = Object(c); // 和Object()一样
c == d; // false
// 因为没有对应的封装对象，所以null 和undefined 不能够被封装（boxed），Object(null)和Object() 均返回一个常规对象。
var e = NaN;
var f = Object(e); // 和new Number( e )一样
e == f; // false
// NaN 能够被封装为数字封装对象，但拆封之后NaN == NaN 返回false，因为NaN 不等于NaN

// 比较少见的情况
Number.prototype.valueOf = function () {
    return 3;
};
new Number(2) == 3; // true

if (a == 2 && a == 3) { // 如果让a.valueOf() 每次调用都产生副作用，比如第一次返回2，第二次返回3，就会出现这样的情况。
    // ..
}
// 下面的例子，不需要细究，开发时只要遵守下面的准则就能避免：
// 1. 如果两边的值中有true 或者false，千万不要使用==，也不要使用===。应该使用：if(a)、if(!!a)、if(Boolean(a))
// 2. 如果两边的值中有[]、"" 或者0，尽量不要使用==。最好用=== 来避免不经意的强制类型转换，导致意想不到的结果。
"0" == null; // false
"0" == undefined; // false
"0" == false; // true -- 晕！
"0" == NaN; // false
"0" == 0; // true
"0" == ""; // false
false == null; // false
false == undefined; // false
false == NaN; // false
false == 0; // true -- 晕！
false == ""; // true -- 晕！
false == []; // true -- 晕！
false == {}; // false
"" == null; // false
"" == undefined; // false
"" == NaN; // false
"" == 0; // true -- 晕！
"" == []; // true -- 晕！
"" == {}; // false
0 == null; // false
0 == undefined; // false
0 == NaN; // false
0 == []; // true -- 晕！
0 == {}; // false

// 极端情况
[] == ![] // true；=> [] == false，因为 ![]为false
2 == [2]; // true
"" == [null]; // true
0 == "\n"; // true

// 有一种情况下强制类型转换是绝对安全的，那就是typeof 操作。typeof 总是返回七个字符串之一，其中没有空字符串。
// 所以在类型检查过程中不会发生隐式强制类型转换。typeof x == "function" 是100% 安全的，和typeof x === "function" 一样。

// 第5 章: 语法
var obj = {
    a: 42
};
obj.a; // 42
delete obj.a; // true
delete obj.bbb; // true【*】
obj.a; // undefined
// delete 操作成功是指对于那些不存在或者存在且可配置的属性，delete 返回true，否则返回false 或者报错。

var a, b, c;
a = b = c = 42;
a = b += 2 //首先执行b +=2（即b = b + 2），然后结果再被赋值给a。

// 标签: continue、break
// continue: 标签为foo的循环
foo: for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
        // 如果j和i相等，继续外层循环
        if (j == i) {
            // 跳转到foo的下一个循环
            continue foo;
        }
        // 跳过奇数结果
        if ((j * i) % 2 == 1) {
            // 继续内层循环（没有标签的）
            continue;
        }
        console.log(i, j);
    }
}
// 1 0
// 2 0
// 2 1
// 3 0
// 3 2

// break: 标签为foo的循环
foo: for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
        if ((i * j) >= 3) {
            console.log("stopping!", i, j);
            break foo;
        }
        console.log(i, j);
    }
}
// 0 0
// 0 1
// 0 2
// 0 3
// 1 0
// 1 1
// 1 2
// 停止！ 1 3

// 上例中如果使用不带标签的break，就可能需要用到一两个函数调用和共享作用域的变量等，
// 这样代码会更难懂，使用带标签的break 可能更好一些。

// contine foo 是执行foo 循环的下一轮循环
// break foo 是跳出标签foo 所在的循环/代码块，继续执行后面的代码

// {}
// 对象解构 => 解构赋值
function getData() {
    // ..
    return {
        a: 42,
        b: "foo"
    };
}
var { a, b } = getData();
console.log(a, b); // 42 "foo"
// 对象解构 => 函数命名参数
function foo({ a, b, c }) {
    // 不再需要这样:
    // var a = obj.a, b = obj.b, c = obj.c
    console.log(a, b, c);
}
foo({
    c: [1, 2, 3],
    a: 42,
    b: "foo"
}); // 42 "foo" [1, 2, 3]

// 事实上JavaScript 没有else if，但if 和else 只包含单条语句的时候可以省略代码块的{ }。下面的代码你一定不会陌生：
if (a) doSomething(a);
// else 后面的if (b) { .. } else { .. } 是一个单独的语句，所以带不带{ } 都可以。
if (a) {
    // ..
}
else {
    if (b) {
        // ..
    }
    else {
        // ..
    }
}
// 等价于
if (a) {
    // ..
}
else if (b) {
    // ..
}
else {
    // ..
}

// 运算符优先级
// JavaScript 中的&& 和|| 运算符返回它们其中一个操作数的值，而非true 或false。
var a = 42;
var b = "foo";
a && b; // "foo"
a || b; // 42

a && b || c ? c || b ? a : c && b : a;
// 等价于
(a && b || c) ? (c || b) ? a : (c && b) : a;
// && 运算符的优先级高于||，而|| 的优先级又高于? :

// ? : 是【右关联】，a ? b : c ? d : e 它的组合顺序是以下哪一种呢？
a ? b : (c ? d : e);
(a ? b : c) ? d : e;
// 答案是 a ? b : (c ? d : e)

// 有时JavaScript 会自动为代码行补上缺失的分号，即自动分号插入（Automatic SemicolonInsertion，ASI）
// 建议在所有需要的地方加上分号，将对ASI 的依赖降到最低。毕竟ASI 是一个语法纠错机制。

// 函数参数默认值
// 如果参数被省略或者值为undefined，则取该参数的默认值
function foo(a = 42, b = a + 1) {
    console.log(a, b, arguments.length);
}
foo(); // 42 43 0
foo(undefined); // 42 43 1
foo(5); // 5 6 1
foo(void 0, 7); // 42 7 2
foo(null); // null 1 1，原因：表达式a + 1 中null 被强制类型转换为0
// 提示：虽然参数a 和b 都有默认值，但是函数不带参数时，arguments 数组为空。如果向函数传递undefined 值，
// 则arguments 数组中会出现一个值为undefined 的单元，而不是默认值。

// ES6 参数默认值会导致arguments 数组和相对应的命名参数之间出现偏差，ES5 也会出现这种情况：
function foo(a) {
    a = 42;
    console.log(arguments[0]);
}
foo(2); // 42 (linked)；如果是"use strict"严格模式，则不会建立关联，返回值为2
foo(); // undefined (not linked)，原因：没有传递参数，arguments 数组为空

// try..finally
function foo() {
    try {
        return 42;
    }
    finally {
        console.log("Hello");
    }
    console.log("never runs");
}
console.log(foo());
// Hello
// 42
// 解释：这里return 42 先执行，并将foo() 函数的返回值设置为42。然后try 执行完毕，接着执
// 行finally。最后foo() 函数执行完毕，console.log(..) 显示返回值。

// try 中的throw 也是如此：
function foo() {
    try {
        throw 42;
    }
    finally {
        console.log("Hello");
    }
    console.log("never runs");
}
console.log(foo());
// Hello
// Uncaught Exception: 42

// 如果finally 中抛出异常，函数就会在此处终止。如果此前try 中已经有return 设置了返回值，则该值会被丢弃：
function foo() {
    try {
        return 42;
    }
    finally {
        throw "Oops!";
    }
    console.log("never runs");
}
console.log(foo());
// Uncaught Exception: Oops!

// finally 中的return 会覆盖try 和catch 中return 的返回值：
function foo() {
    try {
        return 42;
    }
    finally {
        // 没有返回语句，所以没有覆盖
    }
}
function bar() {
    try {
        return 42;
    }
    finally {
        // 覆盖前面的 return 42
        return;
    }
}
function baz() {
    try {
        return 42;
    }
    finally {
        // 覆盖前面的 return 42
        return "Hello";
    }
}
foo(); // 42
bar(); // undefined
baz(); // Hello

// 声明一个全局变量（使用var 或者不使用）的结果并不仅仅是创建一个
// 全局变量，而且还会在global 对象（在浏览器中为window）中创建一个同名属性。
// 此外，在创建带有id 属性的DOM 元素时也会创建同名的全局变量。例如：
<div id="foo"></div>
if (typeof foo == "undefined") {
    foo = 42; // 永远也不会运行
}
console.log(foo); // HTML元素

// 不要扩展原生方法，除非你确信代码在运行环境中不会有冲突。如果对此你并非
// 100% 确定，那么进行扩展是非常危险的。这需要你自己仔细权衡利弊。
// 其次，在扩展原生方法时需要加入判断条件（因为你可能无意中覆盖了原来的方法）。对
// 于前面的例子，下面的处理方式要更好一些：
if (!Array.prototype.push) { // 避免后面浏览器规范中加入push方法而产生问题
    // Netscape 4没有Array.push
    Array.prototype.push = function (item) {
        this[this.length - 1] = item;
    };
}




// 第二部分:异步和性能
// 异步：现在与将来
// Ajax即Asynchronous Javascript And XML（异步JavaScript和XML）
// 如果这时候事件循环中已经有20 个项目了会怎样呢？你的回调就会等待。它得排在其他项目后面——通常没有抢占式的方式支持直接将其排到队首。
// 这也解释了为什么setTimeout(..) 定时器的精度可能不高。
var a = 1;
var b = 2;
function foo() {
    a++;
    b = b * a;
    a = b + 3;
}
function bar() {
    b--;
    a = 8 + b;
    b = a * 2;
}
// ajax(..)是某个库中提供的某个Ajax函数
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
// 完整运行:
// 于JavaScript 的单线程特性。foo()（以及bar()）中的代码具有原子性。也就是说，一
// 旦foo() 开始运行，它的所有代码都会在bar() 中的任意代码运行之前完成，或者相反。
// 这称为完整运行（run-to-completion）特性。

// 在JavaScript 的特性中， 这种函数顺序的不确定性就是通常所说的竞态条件（racecondition），foo() 和bar() 相互竞争，看谁先运行。
// 具体来说，因为无法可靠预测a 和b的最终结果，所以才是竞态条件。
// 并发
// setTimeout(0,..) 进行异步调度，基本上它的意思就是“把这个函数插入到当前事件循环队列的结尾处”。
// 注意: 两个连续的setTimeout(..0) 调用不能保证会严格按照调用顺序处理，所以各种情况都有可能出现，
// 比如定时器漂移，在这种情况下，这些事件的顺序就不可预测。

// Promise
// 从外部看，由于Promise 封装了依赖于时间的状态——等待底层值的完成或拒绝，所以Promise 本身是与时间无关的。
// 因此，Promise 可以按照可预测的方式组成（组合），而不用关心时序或底层的结果。另外，一旦Promise 决议，
// 它就永远保持在这个状态。此时它就成为了不变值（immutablevalue），可以根据需求多次查看。
// 从另外一个角度看待Promise 的决议：一种在异步任务中作为两个或更多步骤的流程控制机制，时序上的thisthen-that。

// 通过 p instanceof Promise 来检查。但遗憾的是，这并不足以作为检查方法，原因有许多：
// 其中最主要的是，Promise 值可能是从其他浏览器窗口（iframe 等）接收到的。这个浏览
// 器窗口自己的Promise 可能和当前窗口/frame 的不同，因此这样的检查无法识别Promise
// 还有，库或框架可能会选择实现自己的Promise，而不是使用原生ES6 Promise 实现。实际
// 上，很有可能你是在早期根本没有Promise 实现的浏览器中使用由库提供的Promise。

// 对thenable值的鸭子类型检测就大致类似？于：
if (
    p !== null &&
    (
        typeof p === "object" ||
        typeof p === "function"
    ) &&
    typeof p.then === "function"
) {
    // 假定这是一个thenable!
}
else {
    // 不是thenable
}

// 一个Promise 决议后，这个Promise 上所有的通过then(..) 注册的回调都会在下一个异步时机点上依次被立即调用。
// 这些回调中的任意一个都无法影响或延误对其他回调的调用。
// 由于Promise 只能被决议一次，所以任何通过then(..) 注册的（每个）回调就只会被调用一次。

// 如果向Promise.resolve(..) 传递一个真正的Promise，就只会返回同一个promise：
var p1 = Promise.resolve(42);
var p2 = Promise.resolve(p1);
p1 === p2; // true

// 错误处理
// try..catch 它只能是同步的，无法用于异步代码模式：
function foo() {
    setTimeout(function () {
        baz.bar();
    }, 100);
}
try {
    foo();
    // 后面从 `baz.bar()` 抛出全局错误
} catch (err) {
    // 永远不会到达这里
}

// Promise 链的一个最佳实践就是最后总以一个catch(..) 结束。

// 并行执行
// Promise.all([ .. ]) 参数数组中的值可以是Promise、thenable，甚至是立即值。就本质而言，
// 列表中的每个值都会通过Promise.resolve(..) 过滤，以确保要等待的是一个真正的Promise，
// 所以立即值会被规范化为为这个值构建的Promise。如果数组是空的，主Promise 就会立即完成。

// 对Promise.all([ .. ]) 来说，只有传入的所有promise 都完成，返回promise 才能完成。
// 如果有任何promise 被拒绝，返回的主promise 就立即会被拒绝（抛弃任何其他promise 的
// 结果）。如果完成的话，你会得到一个数组，其中包含传入的所有promise 的完成值。对于
// 拒绝的情况，你只会得到第一个拒绝promise 的拒绝理由值。

// 从Promise.all([ .. ]) 返回的主promise 在且仅在所有的成员promise 都完成后才会完成。
// 如果这些promise 中有任何一个被拒绝的话，主Promise.all([ .. ])promise 就会立即被拒绝，
// 并丢弃来自其他所有promise 的全部结果。永远要记住为每个promise 关联一个拒绝/ 错误处理函数，
// 特别是从Promise.all([ .. ])返回的那一个。

// 竞赛：只响应“第一个跨过终点线的Promise”，而抛弃其他Promise
// Promise.race([ .. ]) 如果你传入了一个空数组，主race([..]) Promise 永远不会决议，而不是立即决议。

// 超时竞赛
// timeoutPromise(..)返回一个promise，这个promise会在指定延时之后拒绝。
// 为foo()设定超时
Promise.race([
    foo(), // 启动foo()
    timeoutPromise(3000) // 给它3秒钟
]).then(
    function () {
        // foo(..)按时完成！
    },
    function (err) {
        // 要么foo()被拒绝，要么只是没能够按时完成，
        // 因此要查看err了解具体原因
    }
);

// Promise 需要一个finally(..) 回调注册，这个回调在Promise 决议后总是会被调用，并且允许你执行任何必要的清理工作。
// 目前，规范还没有支持这一点。我们可以构建一个静态辅助工具来支持查看（而不影响）Promise 的决议：
// polyfill安全的guard检查
if (!Promise.observe) {
    Promise.observe = function (pr, cb) {
        // 观察pr的决议
        pr.then(
            function fulfilled(msg) {
                // 安排异步回调（作为Job）
                Promise.resolve(msg).then(cb);
            },
            function rejected(err) {
                // 安排异步回调（作为Job）
                Promise.resolve(err).then(cb);
            }
        );
        // 返回最初的promise
        return pr;
    };
}
// 下面是如何在前面的超时例子中使用这个工具：
Promise.race([
    Promise.observe(
        foo(), // 试着运行foo()
        function cleanup(msg) {
            // 在foo()之后清理，即使它没有在超时之前完成
        }
    ),
    timeoutPromise(3000) // 给它3秒钟
])

// Promise 的变体：
// •none([ .. ])这个模式类似于all([ .. ])，不过完成和拒绝的情况互换了。所有的Promise 都要被拒绝，即拒绝转化为完成值，反之亦然。
// •any([ .. ])这个模式与all([ .. ]) 类似，但是会忽略拒绝，所以只需要完成一个而不是全部。
// •first([ .. ])这个模式类似于与any([ .. ]) 的竞争，即只要第一个Promise 完成，它就会忽略后续的任何拒绝和完成。
// •last([ .. ])这个模式类似于first([ .. ])，但却是只有最后一个完成胜出。

// 并发迭代
// 异步的map(..) 工具
if (!Promise.map) {
    Promise.map = function (vals, cb) {
        // 一个等待所有map的promise的新promise
        return Promise.all(
            // 注：一般数组map(..)把值数组转换为 promise数组
            vals.map(function (val) {
                // 用val异步map之后决议的新promise替换val
                return new Promise(function (resolve) {
                    cb(val, resolve);
                });
            })
        );
    };
}
// 下面展示如何在一组Promise（而非简单的值）上使用map(..)：
var p1 = Promise.resolve(21);
var p2 = Promise.resolve(42);
var p3 = Promise.reject("Oops");
// 把列表中的值加倍，即使是在Promise中
Promise.map([p1, p2, p3], function (pr, done) {
    // 保证这一条本身是一个Promise
    Promise.resolve(pr)
        .then(
            // 提取值作为v
            function (v) {
                // map完成的v到新值
                done(v * 2);
            },
            // 或者map到promise拒绝消息
            done
        );
}).then(function (vals) {
    console.log(vals); // [42,84,"Oops"]
});

// Promise API 概述
// Promise(..) 必须和new 一起使用，并且必须提供一个函数回调。
var p = new Promise(function (resolve, reject) {
    // resolve(..)用于决议/完成这个promise
    // reject(..)用于拒绝这个promise
});

// 创建一个已被拒绝的Promise 的快捷方式是使用Promise.reject(..)，所以以下两个promise 是等价的：
var p1 = new Promise(function (resolve, reject) {
    reject("Oops");
});
var p2 = Promise.reject("Oops");

// Promise.resolve(..) 常用于创建一个已完成的Promise，使用方式与Promise.reject(..)
// 类似。但是，Promise.resolve(..) 也会展开thenable 值（前面已多次介绍）。在这种情况
// 下，返回的Promise 采用传入的这个thenable 的最终决议值，可能是完成，也可能是拒绝：
var fulfilledTh = {
    then: function (cb) { cb(42); }
};
var rejectedTh = {
    then: function (cb, errCb) {
        errCb("Oops");
    }
};
var p1 = Promise.resolve(fulfilledTh);
var p2 = Promise.resolve(rejectedTh);
// p1是完成的promise
// p2是拒绝的promise
// 还要记住，如果传入的是真正的Promise，Promise.resolve(..) 什么都不会做，只会直接把这个值返回。
// 所以，对你不了解属性的值调用Promise.resolve(..)，如果它恰好是一个真正的Promise，是不会有额外的开销的。

// then(..) 和catch(..) 也会创建并返回一个新的promise，这个promise 可以用于实现Promise 链式流程控制。
// 如果完成或拒绝回调中抛出异常，返回的promise 是被拒绝的。如果任意一个回调返回非Promise、非thenable 的立即值，
// 这个值会被用作返回promise 的完成值。如果完成处理函数返回一个promise 或thenable，那么这个值会被展开，并作为返回promise 的决议值。

// 当心！若向Promise.all([ .. ]) 传入空数组，它会立即完成，但Promise.race([ .. ]) 会挂住，且永远不会决议。

// Promise 局限性
// 单独的Promise 不应该可取消，但是取消一个可序列是合理的，因为你不会像对待Promise那样把序列作为一个单独的不变值来传送。

// 生成器 暂停点的语法 yield
var x = 1;
function* foo() {
    x++;
    yield; // 暂停！
    console.log("x:", x);
}
function bar() {
    x++;
}
// 构造一个迭代器it来控制这个生成器
var it = foo(); // 构造了一个迭代器
// 这里启动foo()！
it.next();
x; // 2
bar();
x; // 3
it.next(); // x: 3

// 迭代消息传递
function* foo(x) {
    var y = x * (yield);
    return y;
}
var it = foo(6);
// 启动foo(..)
it.next();
var res = it.next(7);
res.value; // 42

// 消息是双向传递的
function* foo(x) {
    var y = x * (yield "Hello"); // <-- yield一个值！
    return y;
}
var it = foo(6);
var res = it.next(); // 第一个next()，并不传入任何东西
res.value; // "Hello"
res = it.next(7); // 向等待的yield传入7
res.value; // 42
// yield .. 和next(..) 这一对组合起来，在生成器的执行过程中构成了一个双向消息传递系统。

// 迭代器接口
var something = (function () {
    var nextVal;
    return {
        // for..of循环需要
        [Symbol.iterator]: function () { return this; },
        // 标准迭代器接口方法, next() 调用返回一个对象。
        // 这个对象有两个属性：done 是一个boolean 值，标识迭代器的完成状态；value 中放置迭代值。
        next: function () {
            if (nextVal === undefined) {
                nextVal = 1;
            }
            else {
                nextVal = (3 * nextVal) + 6;
            }
            return { done: false, value: nextVal };
        }
    };
})();

// ES6 还新增了一个for..of 循环，这意味着可以通过原生循环语法自动迭代标准迭代器：
for (var v of something) {
    console.log(v);
    // 不要死循环！
    if (v > 500) {
        break;
    }
}

// 获取迭代器，手动调用
var a = [1, 3, 5, 7, 9];
var it = a[Symbol.iterator]();
it.next().value; // 1
it.next().value; // 3
it.next().value; // 5

// 当你执行一个生成器，就得到了一个迭代器。使用生成器实现前面的这个something 无限数字序列生产者，类似这样：
function* something() {
    try {
        var nextVal;
        while (true) {
            if (nextVal === undefined) {
                nextVal = 1;
            }
            else {
                nextVal = (3 * nextVal) + 6;
            }
            yield nextVal;
        }
    } finally {
        // 清理子句, 如数据库连接等
    }
}
// 方式1:
for (var v of something()) { // 注: 这里调用了*something() 生成器以得到它的迭代器供for..of 循环使用。
    console.log(v);
    // 不要死循环！
    if (v > 500) {
        break; // 会触发finally 语句
    }
}
// 方式2:
var it = something();
for (var v of it) {
    console.log(v);
    // 不要死循环！
    if (v > 500) {
        console.log(
            // 完成生成器的迭代器
            it.return("Hello World").value // 会触发finally 语句

        );
        // 这里不需要break
    }
}

// 异步迭代生成器
// 生成器yield 暂停的特性意味着我们不仅能够从异步函数调用得到看似同步的返回值，还可以同步捕获来自这些异步函数调用的错误！

// 生成器+Promise
// 获得Promise 和生成器最大效用的最自然的方法就是yield 出来一个Promise，然后通过这个Promise 来控制生成器的迭代器。

// 实现重复（即循环）迭代控制，每次会生成一个Promise，等其决议后再继续【下面的逻辑会通过 async await 代替】
function run(gen) {
    var args = [].slice.call(arguments, 1), it;
    // 在当前上下文中初始化生成器
    it = gen.apply(this, args);
    // 返回一个promise用于生成器完成
    return Promise.resolve()
        .then(function handleNext(value) {
            // 对下一个yield出的值运行
            var next = it.next(value);
            return (function handleResult(next) {
                // 生成器运行完毕了吗？
                if (next.done) {
                    return next.value;
                } else {  // 否则继续运行
                    return Promise.resolve(next.value)
                        .then(
                            // 成功就恢复异步循环，把决议的值发回生成器
                            handleNext,
                            // 如果value是被拒绝的 promise，
                            // 就把错误传回生成器进行出错处理
                            function handleErr(err) {
                                return Promise.resolve(
                                    it.throw(err)
                                ).then(handleResult);
                            }
                        );
                }
            })(next);
        });
}
// 使用
function* main() {
    // ..
}
run(main);

// 如果想要实现一系列高级流程控制的话，那么非常有用的做法是：把你的Promise 逻辑隐藏在一个只从生成器代码中调用的函数内部。比如：
function bar() {
    Promise.all([
        baz(/*..*/)
            .then(/*..*/),
        Promise.race([/*..*/])
    ])
        .then(/*..*/)
}

