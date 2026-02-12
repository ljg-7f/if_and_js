// ECMA：欧洲计算机制造商联合会（European Computer Manufacturers Association）
// 2015年6月正式发布ES6

//【1】let&const 变量不提升，且在块内暂时性死区
// 暂时性死区：如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
// 即只要let或const声明的变量，则在该块内变量就会被锁死，在声明之前不能使用，使用就报错。
// var 变量提升，输出undefined；let不会提升，报异常：Cannot access 'bar' before initialization
var tmp = 123;
if (true) {
    tmp = 'abc'; // ReferenceError【原因：暂时性死区】
    typeof tmp; // ReferenceError【原因：暂时性死区】
    typeof ttt; // undefined 正常
    let tmp;
}
// 内层变量覆盖外层变量
var tmpTime = new Date();
(function f() {
    console.log(tmpTime); // undefined，因为变量提升覆盖外层变量【在方法内提升】
    if (false) {
        var tmpTime = 'hello world';
    }
})()

// 块作用域中可以声明函数，ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。
// 但浏览器不兼容，因此我们要写成函数表达式 let f = function () { .. }，而不是函数声明语句。
function f() { console.log('I am outside!'); }
(function () {
    // var f = undefined; // 在浏览器中函数声明会被提升到所在的块级作用域的头部
    if (false) {
        // 重复声明一次函数f
        function f() { console.log('I am inside!'); }
    }
    f();
}());
// 上面的例子在node.js环境中输出：'I am outside!'。
// 但在浏览器中则错误：Uncaught TypeError: f is not a function【因为函数声明类似于var，即会提升到全局作用域或函数作用域的头部】

// 顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。但从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。
var a = 1; // 全局变量，也是顶层对象的属性
console.log(window.a) // 1; 全局对象 = 顶层对象window
let b = 1; // 全局变量，但不是顶层对象的属性
console.log(window.b) // undefined

// 可以通过globalThis获取顶层对象



//【2】解构："模式匹配"，只要等号两边的模式相同，左边的变量就会被赋予对应的值。
let [a, bb, c] = [1, 2, 3];
let [foo, [[bar], baz]] = [1, [[2], 3]];
let [, , third] = ["foo", "bar", "baz"];
let [head, ...tail] = [1, 2, 3, 4]; // tail [2, 3, 4]
// 只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
let [x, y, z] = new Set(['a', 'b', 'c']);
// 解构默认值
let [x1, yy = 'b'] = ['a']; // 解构赋值允许指定默认值。当一个数组成员严格等于 === undefined时，默认值才会生效。
let [x2 = f()] = [1]; // 默认值可以是表达式，惰性执行
let [x3 = 1, y3 = x3] = [2]; // x3=2; y3=2，默认值可以是其他变量，但必须已经声明。
// 解构对象
let { foo1, bar1 } = { foo1: 'aaa', bar1: 'bbb' };
let { log, sin, cos } = Math // 赋值对象的方法
// 变量名与属性名不一致【重命名】
let { foot: bazt } = { foot: 'aaa', bar: 'bbb' }; // 重命名为 bazt; 【如果使用foot，则error: foot is not defined】
// 对象嵌套
let obj = {
    p: [
        'Hello',
        { y4: 'World' }
    ]
};
// let { p: [x4, { y4 }] } = obj; // 这里p不是变量
let { p, p: [x4, { y4 }] } = obj; // 这样p才有值
// 对象解构的本质：let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' }; 冒号前的是匹配属性名称，冒号后的才是所赋值的变量
const node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
};
let { loc, loc: { start }, loc: { start: { line } } } = node; // 所赋值的变量为：loc、start、line

// 对象的解构赋值可以取到继承的属性。

// 将一个已经声明的变量用于解构赋值，必须加（）
let xt;
({ xt } = { xt: 1 });
// 字符串解构赋值
const [a1, b1, c1, d1] = 'hello'; // a1='h'; b1='e'; c1='l'; d1='l'
let { length: len } = 'hello'; // len = 5
// 参数解构
[[1, 2], [3, 4]].map(([a, b]) => a + b); // [ 3, 7 ]
[1, undefined, 3].map((x = 'yes') => x); // [ 1, 'yes', 3 ]
[1, , 3].map((x = 'yes') => x); // [ 1, 3 ]
// 遍历map
for (let [key, value] of map) { console }
// 交换变量的值，不需要中间变量 t
[x, y] = [y, x];



//【3】字符串
// for...of 能够识别大于0xFFFF的码点，传统的for循环不可以。
let text = String.fromCodePoint(0x20BB7);
console.log(text.length); // 2
for (let i = 0; i < text.length; i++) { // 循环2次
    console.log(text[i]); // 输出：� �
}
for (let i of text) { // 循环1次
    console.log(i); // 输出：𠮷。循环次数与其length不等
}
// 反引号：模板字符串，可以定义多行&可嵌入变量【所有的空格和缩进都会被保留在输出之中】
`Hello ${nameT}, 
how are you ${time}?` // 反引号操作符本质输出的是字符串
// 模板字符串变量的嵌入等价于kotlin中双引号变量的引用
// 模板字符嵌套
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
// 标签模板：函数调用的一种特殊形式【``作为函数参数】
alert`hello`
// 等同于
alert(['hello'])
// 模板字符里面有变量时，第一个参数：数组，且是没有变量替换的部分，第二三...后面的参数：变量是依次替换的值
tag`Hello ${a + b} world ${a * b}`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
// “标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。如：
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
// 嵌入其他语言，如：
jsx`
  <div>
  ...
  </div>
`

String.raw()
String.fromCodePoint()
String.codePointAt()
String.charCodeAt()
String.charAt()
String.at(-1) // 倒数
String.padStart() // 补全长度 padEnd()


Number.isInteger(25.0) // true
Number.isInteger(3.0000000000000002) // true，数值精度最多可以达到 53 个二进制位，多余的会被丢弃

const a = 2172141653n; // 大整数，没有位数的限制
42n === 42 // false，BigInt 与普通整数是两种值，它们之间并不相等。
typeof 123n // 'bigint'
1n + 1.3 // 报错：BigInt 不能与普通数值进行混合运算，可以比较大小

//【4】函数
// 参数默认值与解构赋值默认值的混合使用注意：
function fetch(url, { body = '', method = 'GET', headers = {} }) {
    console.log(method);
}
fetch('http://example.com', {}) // "GET"。【参数有对象时才会进行解构赋值】
fetch('http://example.com') // 报错。函数声明可以修改为：function fetch(url, { body = '', method = 'GET', headers = {} } = {}) { }
// 先是函数参数的默认值生效，然后才是解构赋值的默认值生效。
// 默认值：传入undefined，将触发该参数等于默认值，null则没有这个效果。

// 指定默认值后，函数length属性将失真。如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。
// (function (a = 5) {}).length // 0
// (function (a, b, c = 5) {}).length // 2
// (function(...args) {}).length // 0
// (function (a = 0, b, c) {}).length // 0
// (function (a, b = 1, c) {}).length // 1

// 利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。如果不设置默认值，也不传入时，值为undefined
function foo(mustBeProvided = throwIfMissing()) { } // 表明参数的默认值不是在定义时执行，而是在运行时执行。

// 函数名称name
var f = function () { };
f.name // ""；ES5
f.name // "f"；ES6
const barT = function baz() { };
barT.name // "baz" , ES5 和 ES6 一样
// bind返回的函数，name属性值会加上bound前缀。
foo.bind({}).name // "bound foo"
// (function(){}).bind({}).name // "bound "
// Function构造函数返回的函数实例，name属性的值为anonymous。
// (new Function).name // "anonymous"

// 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
// let getTempItem1 = id => { id: id, nameT: "Temp" }; // 报错
let getTempItem2 = id => ({ id: id, nameT: "Temp" }); // 不报错

// => 注意事项：
// 1.箭头函数没有自己的this对象【内部的this就是定义时上层作用域中的this，注意函数才有作用域，对象{ .. }是没有作用域的】；
// 2.不可以使用arguments对象，该对象在函数体内不存在；
// 3.不可以使用yield命令，因此箭头函数不能用作 Generator 函数。
// 箭头函数的本质：
// ES6
function foo() {
    setTimeout(() => {
        console.log('id:', this.id);
    }, 100);
}
// ES5 代码转换
function foo() {
    var _this = this;
    setTimeout(function () {
        console.log('id:', _this.id); // 箭头函数里面根本没有自己的this，而是引用外层的this。
    }, 100);
}
// 除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。

//【对象{ .. }不构成单独的作用域】，导致jumps箭头函数定义时的作用域就是全局作用域。【因此：对象的属性建议使用传统的写法定义，不要用箭头函数定义】
const cat = {
    lives: 9,
    jumps: () => {
        this.lives--; // 这里的this是全局作用域
    }
}
// 等价于
globalThis.j = () => this.lives--; // JavaScript 引擎的处理方法是，先在全局空间生成这个箭头函数，然后赋值给cat2.jumps
const cat2 = {
    lives: 9,
    jumps: globalThis.j
}

// 函数参数的尾逗号，函数参数与数组和对象的尾逗号规则，保持一致了。



//【5】数组
// ... 扩展运算符
console.log(...[1, 2, 3]) // 输出： 1 2 3
const aaa = [...'hello'] // [ "h", "e", "l", "l", "o" ]
// console.log((...[1, 2])) // 扩展运算符不能放到（）中
// 扩展运算符可以替代函数的 apply() 方法

const a2 = [...a1]; // 复制数组
[...arr1, ...arr2, ...arr3] // 合并数组
const [a, ...rest] = list // 解构赋值。 a 会为undefined；rest 不会，会默认为 []

// 任何定义了遍历器（Iterator）接口的对象(如：nodeList)，都可以用扩展运算符转为真正的数组。
let array = [...nodeList];

// Array
// 将类似数组对象转换为数组【函数中的arguments参数就是类似数组】
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
// ES5 的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']。length=6时结果：[ 'a', 'b', 'c', <3 empty items> ]
// ES6 的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']。length=6时结果：[ 'a', 'b', 'c', undefined, undefined, undefined ]

// 所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，都可以通过Array.from()方法转为数组。
Array.from({ length: 3 }); // [ undefined, undefined, undefined ]
Array.from({ length: 2 }, () => 'jack'); // ['jack', 'jack']
Array.from([1, , 2, , 3], (n) => n || 0); // [1, 0, 2, 0, 3]

let arr1 = new Array(3).fill(1) // [ 1, 1, 1 ]
let arr = new Array(3).fill([]); // 如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。let arr = new Array(3).fill(new Array()); 结果是一样的。
arr[0].push(5);
arr // [[5], [5], [5]]。一个赋值后所有的都发生变化，因为它们指向的是同一地址。

arr.at(-1) === arr[arr.length - 1];



//【6】对象
// 简洁表示法，属性值和其对应的变量名相同时可以省略
let birth = '2000/01/01';
const Person = {
    name: '张三',
    birth, // 等同于birth: birth
    hello() { console.log('我的名字是', this.name); } // 等同于hello: function ()...
};
// 上面的形式常用于函数的返回值，方便简洁
function getPoint() {
    const x = 1;
    const y = 10;
    return { x, y }; // {x:1, y:10}
}
module.exports = { getItem, setItem, clear }; // 也可以是函数名

console.log({ user, foo }) // {user: {name: "test"}, foo: {bar: "baz"}} 也可以是对象名

// 属性的赋值器（setter）和取值器（getter）
const cart = {
    _wheels: 4,

    get wheels() {
        return this._wheels;
    },

    set wheels(value) {
        if (value < this._wheels) {
            throw new Error('数值太小了！');
        }
        this._wheels = value;
    }
}
// 属性名表达式：把表达式放在方括号内。
obj['a' + 'bc'] = 123;
let propKey = 'foo';
let funcTest = 'test'
let obj2 = {
    'first word': 'hello',
    ['a' + 'bc']: 123,
    [propKey]: true,
    [funcTest]() { // 表达式还可以用于定义方法名。如：[Symbol.iterator] : function () { ... }，Symbol.iterator它是一个表达式，返回Symbol对象的iterator属性。
        return 'hi';
    },
};
console.log(obj2['first word']); // "hello"
console.log(obj2['abc']); // 123
console.log(obj2['foo']); // true
console.log(obj.test()) // hi

// 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串[object Object]
const keyA = { a: 1 };
const keyB = { b: 2 };
const myObject = {
    [keyA]: 'valueA',
    [keyB]: 'valueB'
};
console.log(myObject); // { '[object Object]': 'valueB' }。[keyB]会把[keyA]覆盖掉

// 可枚举性 enumerable
Object.getOwnPropertyDescriptor(obj, 'foo') // 对象的每个属性都有一个描述对象，用来控制该属性的行为。
// 目前，有四个操作会忽略enumerable为false的属性。
// 1. for...in循环：只遍历对象自身的和继承的可枚举的属性。【有继承的属性】
// 2. Object.keys()：返回对象自身的所有可枚举的属性的键名。【忽略继承的属性】
// 3. JSON.stringify()：只串行化对象自身的可枚举的属性。【忽略继承的属性】
// 4. Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。【忽略继承的属性】

// enumerable 引入的目的：让for...in操作规避某些属性，如：对象原型的toString方法、数组的length属性，是希望规避的。
// 建议：尽量不要用for...in循环，而用Object.keys()代替。

// ES6 规定，所有 Class 的原型的方法都是不可枚举的。
class A {
    foo() { }
}
Object.getOwnPropertyDescriptor(A.prototype, 'foo').enumerable; // false

// 对象的扩展运算符。注意：1）解构赋值的拷贝是浅拷贝；2）扩展运算符的解构赋值，不能复制继承自原型对象的属性。
let { xq, yq, ...zq } = { xq: 1, yq: 2, a: 3, b: 4 }; // xq 1; yq 2; zq { a: 3, b: 4 }
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
o3 // { b: 2 }
o3.a // undefined，不能复制继承自原型对象的属性

// 对象的扩展运算符（...）用于取出参数对象的所有【可遍历】属性，拷贝到当前对象之中。
let zz = { a: 3, b: 4 };
let n = { ...zz }; // { a: 3, b: 4 } 相当于复制
let foo = { ...['a', 'b', 'c'] }; // {0: "a", 1: "b", 2: "c"} 类数组对象
let foo = { ...'hello' } // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"} 类数组对象

class C {
    p = 12;
    m() { } // 不可枚举的
}
let cc = new C();
let clone = { ...cc }; // 对象的扩展运算符等同于使用Object.assign()方法：let clone = Object.assign({}, cc);
clone.m(); // 报错


// 对象的新增方法
// 1
Object.is() // 严格的值相等。解决：== 会自动转换数据类型 和 === 对NaN不等于自身，以及+0等于-0问题。Object.is(+0, -0) // false；Object.is(NaN, NaN) // true
// 2
Object.assign() // 用于对象的合并，将源对象（source）的所有可枚举属性，复制【只拷贝源对象的自身属性（不拷贝继承属性）】到目标对象（target）。
// Object.assign(target, source1, source2); // 同名属性会被后面的覆盖
// 如果要复制的值是一个取值函数，那么不会复制这个取值函数，只会拿到值以后，将这个值复制过去。
const source = {
    get foo() { return 1 }
};
Object.assign(target, source) // { foo: 1 } 取值后再复制过去

// Object.assign的用途：为对象添加属性或方法、克隆对象、合并多个对象、为属性指定默认值【利用同名属性会被后面的覆盖原理】

// 3
Object.getOwnPropertyDescriptors() // 获取对象的所有属性描述符
// 该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); // 将source的所以属性描述符全部defineProperties定义到target上
// 另一个用处，是配合Object.create()方法，将【对象属性】克隆到一个新对象。这属于浅拷贝。
const clone2 = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));

// 4
Object.setPrototypeOf()
Object.getPrototypeOf()


// 5
Object.keys() // ES5 引入的，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。
Object.values()
Object.entries()

// 6
Object.fromEntries() // 是Object.entries()的逆操作，用于将一个键值对数组转为对象。
Object.fromEntries([['foo', 'bar'], ['baz', 42]]) // {foo: "bar", baz: 42}
// 特别适合将 Map 结构转为对象：
const entries = new Map([
    ['foo', 'bar'],
    ['baz', 42]
]);
Object.fromEntries(entries) // { foo: "bar", baz: 42 }

// 7
Object.hasOwn() // 一个好处是，对于不继承Object.prototype的对象不会报错返回false，而hasOwnProperty()是会报错的。



//【7】运算符
// 指数运算符 **
2 ** 3 // 8
2 ** 3 ** 2 // 相当于 2 ** (3 ** 2) 从最右边开始计算
b **= 3 // 相当于 b = b * b * b

// 链判断运算符 ?. 的三种使用场景：
const firstName = message?.body?.user?.firstName || 'default'; // 对象属性是否存在
a?.[++x] // 对象属性是否存在，有短路机制
iterator.return?.() // 函数或对象方法是否存在

// Null 判断运算符 || && 
const ttt1 = response?.settings?.ttt || 'Hello, world!'; // 属性的值为：空字符串、false、0、null、undefined，默认值会生效。
const ttt2 = response?.settings?.ttt ?? 'Hello, world!'; // 属性的值只有为：null、undefined，默认值才会生效。

// 逻辑赋值运算符
x ||= y
// 等同于
x || (x = y)

x &&= y
// 等同于
x && (x = y)

x ??= y
// 等同于
x ?? (x = y)

// 使用场景：为变量或属性设置默认值
user.id ||= 1;
opts.foo ??= 'bar';

// #!/usr/bin/env node 写在脚本/模块文件第一行，node hello.js 执行的方式就可以替换为 ./hello.js


//【8】Symbol【有点类似于 Java 中的枚举】
// 防止属性名冲突，Symbol表示独一无二的值，可以保证不会与其他属性名产生冲突，它属于 JavaScript 语言的原生数据类型，不是【对象】。
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();
s1 === s2 // false

const sym = Symbol('foo');
sym.description // "foo"

// 作为属性名的 Symbol
let mySymbol = Symbol();

// 第一种写法
a[mySymbol] = 'Hello!'; // 基础的应用
// 第二种写法
let a = {
    [mySymbol]: 'Hello!' // 必须要有 []，否则就是普通字符串了
};
// 第三种写法
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 注意不能用 a.mySymbol = 'Helle' 进行赋值，这种场景中mySymbol就是普通的字符串。

// 只有通过 Object.getOwnPropertySymbols() 和 Reflect.ownKeys() 可以获取Symbol 属性名，
// 其它：for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。
// 我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法的属性。

// Symbol.for('foo')如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。
let s11 = Symbol.for('foo'); // 会被登记在全局环境中
let s22 = Symbol.for('foo');
let s33 = Symbol('foo'); // 每次都是新的值
let s44 = Symbol('foo'); // 每次都是新的值
s11 === s22 // true
s22 === s33 // false
s33 === s44 // false
// Symbol.for()的这个全局登记特性，可以用在不同的 iframe 或 service worker 中取到同一个值。
Symbol.keyFor(s11) // "foo"。返回一个已登记的 Symbol 类型值的key，没有则返回 undefined。

// 模块的 Singleton 模式
const FOO_KEY = Symbol.for('foo');
if (!global[FOO_KEY]) {
    global[FOO_KEY] = new A();
}
module.exports = global[FOO_KEY];




//【9】集合
// Set 内部判断两个值是否不同使用的类似 ===，区分在NaN的判断，=== 不等，而Set认为是相等的。
// Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
// Set的遍历顺序就是插入顺序。
Set.prototype[Symbol.iterator] === Set.prototype.values // true
let set = new Set(['red', 'green', 'blue']);
for (let x of set.keys()) {
    console.log(x);
}
for (let x of set.values()) {
    console.log(x);
}
for (let x of set) {
    console.log(x);
}
// 上面的三种Set遍历是完全等价的。

let uniqueArr = [...new Set(arr)]; //数组去重

// WeakSet 的成员只能是对象和 Symbol 值，而不能是其他类型的值。
// WeakSet 不可遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。
// WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

// javascript中对象{}的key必须是字符串，有很多限制，Map打破了这种限制。
// Object “字符串—值”的对应；Map 结构提供了“值—值”的对应。Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。
const map = new Map();
map.set(['a'], 555);
map.get(['a']) // undefined，['a']是两个对象，地址不一样。
// Map 的遍历顺序就是插入顺序。
// for (let [key, value] of map.entries()) 等价于 for (let [key, value] of map)，map 本身就是可遍历的。map[Symbol.iterator] === map.entries

// WeakMap只接受对象和 Symbol 值作为键名，不接受其他类型的值作为键名。键值依然是正常引用。

// WeakRef 创建对象的弱引用
let target = {};
let wr = new WeakRef(target);
let obj = wr.deref();
if (obj) { // target 未被垃圾回收机制清除
    // ...
}

// FinalizationRegistry 目标对象被垃圾回收机制清除以后，所要执行的回调函数。

// Iterator
// JavaScript中的"集合"数据结构：Array、Map、Set、String、TypedArray、arguments、类似数组的对象
// Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即【for...of循环】。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。
// 属性名表达式：把表达式放在方括号内。
let obj3 = {
    ['a' + 'bc']: 123,
    [propKey]: true,
    [funcTest]() { // 表达式还可以用于定义方法名
        return 'hi';
    },
    [Symbol.iterator]: function () { // Symbol.iterator它是一个表达式，返回Symbol对象的iterator属性。
        return { // 返回一个遍历器对象
            next: function () { // next是必须的方法
                return {
                    value: 1,
                    done: true
                };
            },
            return() { // 可选的方法，见下面的说明
                file.close();
                return { done: true }; // 注意：return()方法必须返回一个对象，这是 Generator 语法决定的。
            }
        };
    }
};

// Iterator被应用的场景：解构赋值、扩展运算符、yield*、类似数组的对象

// 遍历器对象除了具有next()必须的方法，还可以具有return()方法和throw()的可选方法。
// return()方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return()方法。
// 如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return()方法。

const arr3 = ['red', 'green', 'blue'];
for (let v of arr3) {
    console.log(v); // red green blue
}
const obj = {};
// obj[Symbol.iterator] = arr3[Symbol.iterator];
// 上面不可以，因为这样的话迭代器函数内部的 this 会在调用时动态绑定到 obj上，而obj对象没有 this[0], this[1] 和 length 属性，迭代器无法正常工作。
obj[Symbol.iterator] = arr3[Symbol.iterator].bind(arr3); // this 永远指向 arr3，迭代器可以访问 arr3[0], arr3[1], arr3.length，遍历正常工作
// 给对象obj部署了数组arr的Symbol.iterator属性，结果obj的for...of循环，产生了与arr完全一样的结果。
for (let v of obj) {
    console.log(v); // red green blue
}


var arrT = ['a', 'b', 'c', 'd'];
arrT.foo = 'hello';
for (let a in arrT) {
    console.log(a); // "0" "1" "2" "3" "foo"，for...in循环，获得键名，还会返回非数字索引的属性名
}
for (let a of arrT) {
    console.log(a); // a b c d，for...of循环，获得键值
}
// for..in 适用于对象，for..of 适用于数组

// 注意：数组中的forEach循环，break命令或return命令都不能奏效，for..of 可以。





//【10】Proxy & Reflect & Promise & Generator & async
// Proxy
// 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
var proxy = new Proxy(target, handler, receiver); // target参数表示所要拦截的目标对象; handler参数也是一个对象，用来定制拦截行为; receiver 原始赋值行为所在的对象

// 可取消的Proxy
let { proxy, revoke } = Proxy.revocable(target, handler); // 返回一个可取消的 Proxy 实例
// revocable使用场景：目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

// Proxy中的this问题
// 注意1：目标对象内部的this关键字会指向 Proxy 代理。
const target2 = {
    m: function () {
        console.log(this === proxy); // 如果对象被代理，则this始终绑定proxy
    }
};
const handler = {};
const proxy = new Proxy(target2, handler);
target2.m() // false
proxy.m()  // true。target2.m()内部的this指向proxy
// 对象的方法中有this使用时，代理时一定要注意。

// 注意2：Proxy 拦截函数内部的this，指向的是handler对象。
const handler2 = {
    get: function (target, key, receiver) {
        console.log(this === handler2); // 这里的this绑定handler2
        return 'Hello, ' + key;
    },
    set: function (target, key, value) {
        console.log(this === handler2);
        target[key] = value;
        return true;
    }
};
const proxy = new Proxy({}, handler2);
proxy.foo // true // Hello, foo
proxy.foo = 1 // true

// Proxy 支持的拦截操作一共 13 种：
// get(target, propKey, receiver)：拦截对象属性的读取
// set(target, propKey, value, receiver))：拦截对象属性的设置
// has(arget, propKey)：拦截 property in proxy的操作，以及proxy.hasOwnProperty()的操作
// deleteProperty(arget, propKey)：拦截delete操作
// ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环
// getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)
// defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc)、Object.defineProperties(proxy, propDescs)
// preventExtensions(target)：拦截Object.preventExtensions(proxy)
// getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)
// isExtensible(target)：拦截Object.isExtensible(proxy)
// setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)
// apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
// construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)


// Reflect
// Reflect对象一共有 13 个静态方法，与上面的 Proxy 支持的拦截操作一共 13 种一一对应。

// Reflect对象的设计目：
// 1）将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
// 2）修改某些Object方法的返回结果，让其变得更合理。如：Reflect.defineProperty(obj, name, desc)则会返回false，不像Object那样抛异常。
// 3）Object某些操作是命令式，比如name in obj和delete obj[name]，修改为函数行为，如：Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)。

// 如果name属性部署了读取/赋值函数（getter/setter），则读取函数的this绑定receiver。
var myObjectT = {
    foo: 1,
    bar: 2,
    get baz() {
        return this.foo + this.bar;
    },
};

var myReceiverObject = {
    foo: 4,
    bar: 4,
};
console.log(Reflect.get(myObjectT, 'baz')) // 3
console.log(Reflect.get(myObjectT, 'baz', myReceiverObject)) // 8

// Reflect.set(...) 如果传入了receiver，会触发Proxy.defineProperty拦截；不传则不会触发拦截。

// Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。


// Promise
// Promise 简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
// 如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。

// .catch() 的本质是 .then(null, rejection)
// 建议总是使用catch()方法，而不使用then()方法的第二个参数reject。跟传统的try/catch代码块不同的是，如果没有使用catch()方法指定错误处理的回调函数，
// Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。通俗的说法就是“Promise 会吃掉错误”。
// 不过，Node.js 有一个unhandledRejection事件，专门监听未捕获的reject错误。

// .finally() 的本质：在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。
// finally 不会获取前一个promise的状态或值，而是将promise传给下个then，finally方法总是会返回原来的值。
then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
)

// Promise.all()所有请求都成功了，但是只要有一个请求失败，它就会报错，而不管另外的请求是否结束。
// Promise.allSettled()方法，用来确定一组异步操作是否都结束了（不管成功或失败）。返回结果如下：【固定格式】
[
    { status: 'fulfilled', value: 42 },
    { status: 'rejected', reason: -1 }
]

// Promise.race()只要有一个返回，不管成功或失败就结束。
// Promise.any()有一个成功，或者所有参数 Promise 变成rejected状态才会结束。

// 执行顺序：同步任务 > 微任务（Promise、Async、Await） > 宏任务（setTimeout）。每个宏任务执行后，会清空所有微任务。

// Promise.try() 统一同步和异步的异常都用promise.catch()捕获。
Promise.try(() => database.users.get({ id: userId }))
    .then()
    .catch()



// Generator：function* + yield【1. function* 里可以没有 yield； 2. yield 必须在 function* 里面】
// Generator的根本特性：可以暂停执行和恢复执行，此外还有函数体内外的数据交换和错误处理机制（出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的）。
// Generator 可以暂停函数执行，返回任意表达式的值。
// 执行 Generator 函数会返回一个【遍历器对象】，代表 Generator 函数的内部指针。也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。
// 返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

// yield表达式如果用在另一个表达式之中，必须放在圆括号里面。
function* demo() {
    //   console.log('Hello' + yield); // SyntaxError
    //   console.log('Hello' + yield 123); // SyntaxError
    console.log('Hello' + (yield)); // OK
    console.log('Hello' + (yield 123)); // OK
}

// 与 Iterator 接口的关系【这种方式实现对象的可遍历性非常方便】
var myIterable = {};
myIterable[Symbol.iterator] = function* () { // 最简单的实现可遍历的方式
    yield 1;
    yield 2;
    yield 3;
    return 4; // 注意是无效的，因为一旦next方法的返回对象的done属性为true，for...of循环就会中止，【且不包含该返回对象】
};
[...myIterable] // [1, 2, 3]


// 
function* gen() { }
var g = gen();
g[Symbol.iterator]() === g // true

function* f() {
    var tv = yield 33; // 注意如果next中不传值，yield默认值为 undefined，即 tv = undefined
}
// 注意，由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。
// next 可以获取 yield 和 return 的值
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWorldGenerator();
console.log(hw.next()); // { value: 'hello', done: false }
console.log(hw.next()); // { value: 'world', done: false }
console.log(hw.next()); // { value: 'ending', done: true }

// 一旦next方法的返回对象的done属性为true，for...of循环就会中止，【且不包含该返回对象】
for (let t of helloWorldGenerator()) {
    console.log(t) // hello world，注意：这里不会输出 ending
}

// Generator.prototype.throw()
hw.throw(new Error('出错了')); // 在函数体外抛出错误，然后在 Generator 函数体内捕获。
// 注意：Generator 函数体内一旦出现了错误，且没有被内部捕获处理，就不会再执行下去了，即 JavaScript 引擎认为这个 Generator 已经运行结束了。
// 如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获。
// throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。
// throw 与 next 一样也会获取 yield产生的值。

// Generator.prototype.return() 返回给定的值，并且终结遍历 Generator 函数。
hw.return('foo') // 输出结果为：{value: "foo", done: true}
// retrun 特殊场景：Generator里有finally{ .. }块，需要执行完finally块才会结束。
function* numbers() {
    yield 1;
    try {
        yield 2;
        yield 3;
    } finally {
        yield 4;
        yield 5;
    }
    yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false } 【注意此时，return 相当于 next，直接执行finally块，不执行yield 3】
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true } 【注意此时的值是 return 设置的 7】


// next()、throw()、return()这三个方法本质上是同一件事，它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。
// next(23)是将yield表达式替换成一个值。
// throw()是将yield表达式替换成一个throw语句。
// return()是将yield表达式替换成一个return语句。

// yield* 【用来在一个 Generator 函数里面执行另一个 Generator 函数】
// 任何数据结构只要有 Iterator 接口，就可以被yield*遍历。比如：yield* 'hello';
function* gen() {
    yield* ["a", "b", "c"];
}
console.log(gen().next()) // { value: 'a', done: false }

function* gen2() {
    yield ["a", "b", "c"];
}
console.log(gen2().next()) // { value: [ 'a', 'b', 'c' ], done: false }

// 实战：铺平嵌套数组
function* iterTree(tree) {
    if (Array.isArray(tree)) {
        for (let i = 0; i < tree.length; i++) {
            yield* iterTree(tree[i]);
        }
    } else {
        yield tree;
    }
}
const tree = ['a', ['b', 'c'], ['d', 'e']];
for (let x of iterTree(tree)) { // 等价于 [...iterTree(tree)]
    console.log(x);
}

// 中序遍历二叉树
function* inorder(t) {
    if (t) {
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}

// 对象属性
let obj = {
    * myGeneratorMethod() { }
};
// 等价于
let obj = {
    myGeneratorMethod: function* () { }
};


// Generator 函数的this
// 注意：g返回的总是遍历器对象，而不是this对象。
function* g() {
    this.a = 11; //这里的this默认指向遍历器对象，不会隐形再绑定
}

let obj = g();
obj.next();
obj.a // undefined，因为 obj是遍历器对象
// 需要修改如下
let obj = g.call(g.prototype);

// Generator 是实现状态机的最佳结构
var clock = function* () {
    while (true) {
        console.log('state1');
        yield;
        console.log('state2');
        yield;
        console.log('state3');
        yield;
    }
};


// Thunk 函数的含义：编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。如：f(x+5)
// 在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
// ES5版本
var Thunk = function (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function (callback) {
            args.push(callback);
            return fn.apply(this, args);
        }
    };
};
// ES6版本
const Thunk = function (fn) {
    return function (...args) {
        return function (callback) {
            return fn.call(this, ...args, callback);
        }
    };
};

// Thunk 函数真正的威力，在于可以自动执行 Generator 函数。前提是yield命令后面的必须是 Thunk 函数。demo如下：
function run(fn) { // 一个 Generator 函数的自动执行器
    var gen = fn();

    function next(err, data) { //  Thunk 的回调函数
        var result = gen.next(data);
        if (result.done) return;
        result.value(next);
    }

    next(); // 调用上面的next方法
}

function* g() {
    // ...
}

run(g);



// async【它是 Generator 函数的语法糖】
// async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里
// async函数的返回值是【Promise 对象】，这比 Generator 函数的返回值是 Iterator 对象方便多了。
// await命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

// async箭头函数
const foo = async () => { };

// 注意 await 联用时考虑是否可以同时触发。
// 同时触发写法一
let [foo, bar2] = await Promise.all([getFoo(), getBar()]);

// 同时触发写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar3 = await barPromise;


docs.forEach(async function (doc) { // 并发执行
    await db.post(doc);
});

for (let doc of docs) { // 继发执行，注意：await返回的是其所在的async方法
    await db.post(doc);
}

// async 函数可以保留运行堆栈
const a = () => { // 等到b()运行结束，可能a()早就运行结束了，b()所在的上下文环境已经消失了。如果b()或c()报错，错误堆栈将不包括a()。
    b().then(() => c());
};
const a = async () => { // a()的上下文环境会保存
    await b();
    c();
};


// async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
// 它将 Generator 写法中的自动执行器，改在语言层面提供，不暴露给用户
async function fn(args) {
    // ...
}
// 等同于
function fn(args) {
    return spawn(function* () { // spawn函数就是自动执行器
        // ...
    });
}
// 细细品很有意思
function spawn(genF) {
    return new Promise(function (resolve, reject) {
        const gen = genF();
        function step(nextF) {
            let next;
            try {
                next = nextF();
            } catch (e) {
                return reject(e);
            }
            if (next.done) {
                return resolve(next.value);
            }
            Promise.resolve(next.value).then(function (v) {
                step(function () { return gen.next(v); });
            }, function (e) {
                step(function () { return gen.throw(e); });
            });
        }
        step(function () { return gen.next(undefined); });
    });
}

// 顶层 await
// 从 ES2022 开始，允许在模块的顶层独立使用await命令，它的主要目的是使用await解决模块异步加载的问题。
// 顶层的await命令，它保证只有异步操作完成，模块才会输出值。
// 如果加载多个包含顶层await命令的模块，加载命令是并行执行的。
import "./x.js";
import "./y.js"; // 并行加载。【顶层的await命令有点像，交出代码的执行权给其他的模块加载，等异步操作完成后，再拿回执行权，继续向下执行】





//【10】类 class 是语法糖
// ES5
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function () { //【是可枚举】
    return '(' + this.x + ', ' + this.y + ')';
};
// ES6
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() { // 注意这里没有 function 关键字。【不可枚举】
        return '(' + this.x + ', ' + this.y + ')';
    }
}
// 类的数据类型是函数，类本身就指向构造函数。
typeof Point // "function"
Point === Point.prototype.constructor // true
// 类中的所有方法都定义在类的prototype属性上面。在类的实例上面调用方法，其实就是调用prototype原型上的方法。【类方法定义在原型上，静态方法定义在类本身上。】
// 类的内部所有定义的方法，都是不可枚举的。这一点与 ES5 的行为不一致。
// 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
// 一个类的所有实例共享一个原型对象，即：
var point1 = new Point(1, 2)
var point2 = new Point(11, 22)
console.log(point1.__proto__ === point2.__proto__) // true，都等于 Point.prototype
// __proto__ 推荐使用 Reflect.getPrototypeOf(point1) 代替，避免对环境产生依赖。

// 即：__proto__、prototype 有点类似Java类中的静态变量。


// ES2022 为类的实例属性，又规定了一种新写法。实例属性现在除了可以定义在constructor()方法里面的this上面，也可以定义在类内部的最顶层。
let methodName = 'getArea';
class Foo {
    bar = 'hello'; // 对象自身的属性，不是定义在实例对象的原型prototype上
    baz = 'world';

    [methodName]() { // 属性名表达式
        // ...
    }
}

// 存值函数和取值函数是设置在属性的 Descriptor 对象上的。
var descriptor = Reflect.getOwnPropertyDescriptor(Foo.prototype, "bar");
// {
//   get: [Function: get bar],
//   set: [Function: set bar],
//   enumerable: false,
//   configurable: true
// }

// Class 表达式
const MyClass = class Me { }; // 这个类的名字是Me，但是Me只在 Class 的内部可用，外部不可用。
const MyClass1 = class { };
let person = new class { }('张三') // 立即执行类的构造

// static 静态方法
// 不能被实例调用（会报错），而是直接通过类来调用。
// 如果静态方法包含this关键字，这个this指的是类，而不是实例。
class Foo {
    static prop = 1; // 静态属性

    static bar() {
        this.baz(); // 等价于 Foo.baz()
    }
    static baz() {
        console.log('hello');
    }
    baz() { // 静态方法可以与非静态方法重名。
        console.log('world');
    }
}
Foo.bar() // hello

// 父类的静态方法，可以被子类继承调用。子类静态方法中可以通过super调用父类的静态方法。

// 私有性 #
class IncreasingCounter {
    #count = 0; // 私有属性，只能在类的内部使用 this.#count
    #a;
    #b;

    static #totallyRandomNumber = 4; // 静态的私有属性
    static #computeRandomNumber() { } // 静态的私有方法

    get #x() { return this.#count; } // 私有属性也可以设置 getter 和 setter 方法。

    #sum() {
        return this.#a + this.#b;
    }
    printSum() {
        console.log(this.#sum());
    }
}
// 直接访问某个类不存在的私有属性会报错，但是访问不存在的公开属性不会报错，返回undefined
IncreasingCounter.#ttt // 报错
IncreasingCounter.ttt // undefined

// 静态块。static { .. } 在类生成时运行且只运行一次，主要作用是对静态属性进行初始化。以后，新建类的实例时，这个块就不运行了。
// 每个类允许有多个静态块，每个静态块中只能访问之前声明的静态属性。另外，静态块的内部不能有return语句。
// 静态块内部可以使用类名或this，指代当前类。
class C {
    static x;
    static y;
    static z;

    static { // 只会运行一次
        const obj = doSomethingWith(this.x);
        this.y = obj.y;
        this.z = obj.z;
        this.x; // 等价于 C.x
    }
}

// 严格模式
// 类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。
// 考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式。

// 类不存在变量提升，使用之前必须先有定义。

// this 的指向问题
// 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

class Logger {
    // constructor() { // 可以修复下面 printName() 中的this问题。
    //     this.printName = this.printName.bind(this);
    // }

    printName(name = 'there') {
        this.print(`Hello ${name}`);
        // 如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是undefined），
        // 从而导致找不到print方法而报错。
    }

    print(text) {
        console.log(text);
    }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
// 在构造方法中绑定this能解决上面问题的根本原因：
// 1）new Logger()只是调用了一下构造函数而已，对下面的方法没有任何绑定处理。
// 2）而在构造函数中进行了this.printName.bind(this)，那printName方法中的this就进行了绑定。


// new.target【该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。在类外部不能使用】
// 如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined。
// Class 内部调用new.target，返回当前 Class。子类继承父类时，new.target会返回子类，而不是当前代码所在的类。
class Shape {
    constructor() {
        if (new.target === Shape) { // 【抽象类】利用new.target特点，可以写出不能独立使用、必须继承后才能使用的类。
            throw new Error('本类不能实例化');
        }
    }
}


// 继承
// 为什么子类的构造函数，一定要调用super()？原因就在于 ES6 的继承机制，与 ES5 完全不同。ES5 的继承机制，是先创造一个独立的子类的实例对象，
// 然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”。ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”。

// ES5继承本质，静态方法继承需手动实现，不支持内置对象如Array的继承，原型方法可枚举，函数声明会提升。
function Dog(name, age) {
    // 构造函数继承，第二次调用父类构造函数
    Animal.call(this, name);  // 继承实例属性【调用父类构造函数】
    this.age = age;
}
// 原型链继承（继承原型方法）
Dog.prototype = Object.create(Animal.prototype); // 第一次调用父类构造函数（通过Object.create）
Dog.prototype.constructor = Dog; // 修正构造函数指向

Dog.__proto__ = Animal; // 手动继承静态方法

// ES6继承本质，静态方法自动继承，支持内置对象继承，原型方法不可枚举，class不会提升。
function _inherits(subClass, superClass) {
    // 继承静态方法
    Object.setPrototypeOf(subClass, superClass);
    // 继承原型方法
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true }
    });
    // 设置__proto__（为了super关键字）
    Object.setPrototypeOf(subClass.prototype, superClass.prototype);
}

function Dog(name, age) {
    var _this = Animal.call(this, name) || this; // super() 的等价操作
    _this.age = age;
    return _this;
}

// 注意：在子类的构造函数中，只有调用super()之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，必须先完成父类的继承，只有super()方法才能让子类实例继承父类。
// 调用super()的作用是形成子类的this对象，把父类的实例属性和方法放到这个this对象上面。子类在调用super()之前，是没有this对象的，任何对this的操作都要放在super()的后面。
// 所以【super内部的this代表子类的实例，而不是父类的实例】，这里的super()相当于A.prototype.constructor.call(this)（在子类的this上运行父类的构造函数）。

//【注意：一般父类的构造函数中，[this.属性]使用的是父类中的，而[this.方法]使用的是子类的。因为：属性属于实例，而方法属于类的prototype。在父类的构造函数中子类的实例还没有创建，但它们的类的prototype已经存在】

// instanceof 子类或父类都 === true
cp instanceof ColorPoint // true
cp instanceof Point // true

// 父类所有的属性和方法，都会被子类继承，除了私有的#属性和#方法。
// 父类的静态属性和静态方法，也会被子类继承。【注意：静态属性是通过浅拷贝实现继承的。】
class A {
    static foo = 100;
    name = 'A';
    constructor() {
        console.log(new.target.name); // new B() 时输出 B
        console.log('My name is ' + this.name); // new B() 时输出 My name is A。因为：super()在子类构造方法中执行时，子类的属性和方法还没有绑定到this，所以如果存在同名属性，此时拿到的是父类的属性。
        this.say(); // BBB。
    }
    say() {
        console.log('AAA');
    }
    static print() {
        console.log(this.x); // 子类调用时，指向的是 B.x，不是 bbb.x。即在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。
    }
}
class B extends A {
    name = 'B';
    constructor() {
        super(); // 等价于 A.prototype.constructor.call(this)
        B.foo--; // B 类继承静态属性时，会采用浅拷贝，拷贝父类静态属性的值，因此A.foo和B.foo是两个彼此独立的属性。
        console.log(super.valueOf() instanceof B); // true
    }
    say() {
        console.log('BBB');
        console.log(super.name); // undefined。因为super指向的是父类的prototype原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
        // 如果属性定义在父类的原型对象上 A.prototype.name = 'TTT'，super.name 是会输出值 TTT 的。
    }
    static m() {
        super.print(); // 等价于 A.prototype.print.call(this);
    }
}
let bbb = new B();
B.foo // 99
A.foo // 100

// 如果父类的静态属性的值是一个对象，static foo = { n: 100 }; 
let bbbb = new B();
B.foo.n // 99
A.foo.n // 99

// Object.getPrototypeOf()方法可以用来从子类上获取父类。
Object.getPrototypeOf(B) === A // true。可以使用这个方法判断，一个类是否继承了另一个类。

//【super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类】
// 在普通方法中super指向【父类的原型对象】时，定义在【父类实例】上的方法或属性，是无法通过super调用的。如果属性定义在父类的原型对象上，super就可以取到。

class C extends A {
    constructor() {
        super();
        this.x = 2;
        super.x = 3; // 等价于 this.x = 3
        console.log(super.x); // undefined。等价于 A.prototype.x
        console.log(this.x); // 3
    }
}


B.__proto__ === A // true。子类的__proto__属性指向父类的构造函数，A就是个构造函数。
B.prototype.__proto__ === A.prototype // true。子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。

// 类的继承是按照下面的模式实现的：
// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

// setPrototypeOf方法的本质：
Object.setPrototypeOf = function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}




//【10】Module 模块
// ES6 的模块自动采用严格模式。ES6 模块是编译时加载，使得静态分析成为可能，可以做代码【静态优化】。
// export命令可以出现在模块的任何位置，只要处于模块顶层就可以。
// export 的形式：【目前支持对外输出的就三种接口：函数， 类，var、let、const 声明的变量】
export var firstNameT = 'Michael';
export { firstName, lastName, year };
export { // 使用 as 重命名
    v1 as streamV1,
    v2 as streamV2,
    v2 as streamLatestVersion // 重命名后，v2可以用不同的名字输出多次。
};
export function f() { };
export { f };

// export出去的值是实时变化的值。下面例子中：首先输出变量foo，值为bar，500 毫秒之后变成baz。
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);

import { firstName, lastName, year } from './profile.js';
import { lastName as surname } from './profile.js'; // 也可以用 as 重命名
import { a } from './xxx.js'
import 'lodash'; // 仅仅执行lodash模块，但是不输入任何值。
a = {}; // 报错，因为：import命令输入的变量都是只读的，不可修改。
a.foo = 'hello'; // 合法操作。【如果a是一个对象，改写a的属性是允许的。并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性】
// 注意，import命令具有提升效果，会提升到整个模块的头部，首先执行。本质：import命令是编译阶段执行的，在代码运行之前。

// 同一个my_module模块加载只会执行一次，也就是说，import语句是 Singleton 模式。
import { foo } from 'my_module';
import { bar } from 'my_module';

// 整体加载：所有输出值都加载在这个对象上面。
import * as circle from './circle';

// export default 为模块指定默认输出，一个模块只能有一个默认输出，因此export default命令只能使用一次。
export default function foo() {
    console.log('foo');
}
import customName from './export-default'; // customName 是取的任意名称，不需要知道原模块输出的函数名。
// 这里的import命令，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时import命令后面，不使用大括号。
// 使用export default时，对应的import语句不需要使用大括号；不使用export default时，对应的import语句需要使用大括号。

// export default本质：就是输出一个叫做default的变量或方法。
// export default a; // 含义是将变量a的值赋给变量default。
// export var a = 1; // 正确
// export default var a = 1; // 错误
// export default 42; // 正确
// export 42; // 错误

// 如果模块只有一个输出值，就使用export default，如果模块有多个输出值，除非其中某个输出值特别重要，否则建议不要使用export default。
// 模块输出建议：函数名首字母小写，对象名首字母大写。

// 如果想在一条import语句中，同时输入默认方法和其他接口，可以写成下面这样。
import _, { each, forEach } from 'lodash';

// export 与 import 的复合写法【用途：可以定义一个index.js模块，将需要对外导出的统一在这个模块中，导入再导出】
export { foo, bar2 } from 'my_module'; // foo和bar2实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar2。
// 约等价于
import { foo, bar2 } from 'my_module';
export { foo, bar2 };

export * from 'circle'; // 先导入所有再输出circle模块的所有属性和方法。注意，export *命令会忽略circle模块的default方法。


// ES2025 引入了“import 属性”（import attributes），允许为 import 命令设置属性，主要用于导入非模块的代码，
// 比如 JSON 数据、WebAssembly 代码、CSS 代码。目前，只支持导入 JSON 数据。
// 静态导入
import configData from './config-data.json' with { type: 'json' };
// 动态导入
const configData = await import(
    './config-data.json', { with: { type: 'json' } }
);

// ES2020提案 引入import()函数，支持动态加载模块，import()返回一个 Promise 对象，可见import()是异步加载。
let obj = await import('./aaa.js')
console.log(obj.foo)

// import()可以做的按需加载、条件加载、动态的模块路径加载

import.meta // 返回当前模块的元信息。比如模块的路径
import.meta.url // 返回当前模块的 URL 路径
import.meta.scriptElement // 浏览器特有的元属性，返回加载模块的那个<script>元素，相当于document.currentScript属性。


// <script type="application/javascript" src="path/to/myModule.js"> 同步加载JavaScript 脚本

// <script src="path/to/myModule.js" defer></script> 异步加载。defer是“渲染完再执行”。多个defer脚本会按顺序加载。
// defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行。
// <script src="path/to/myModule.js" async></script> 异步加载。async是“下载完就执行”，渲染先中断。多个async脚本是不能保证加载顺序的。
// async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。

// <script type="module" src="./foo.js"></script> 异步加载ES6模块 type="module"，等价于上面的defer。
// <script type="module" src="./foo.js" async></script> async类型

// 模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的。
// 利用顶层的this等于undefined这个语法点，可以侦测当前代码是否在 ES6 模块之中。
const isNotModuleScript = this !== undefined;

export let ccc = new C(); // 不同的脚本加载这个模块，得到的都是同一个实例。

// CommonJS 模块是 Node.js 专用的，与 ES6 模块不兼容。
// .mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置['module'/'commonjs']。默认是commonjs
// CommonJS 模块使用require()和module.exports，ES6 模块使用import和export。【推荐用ES6 取代 Node.js 的 CommonJS 语法】
// ES6 模块【简称ESM】与 CommonJS 模块【简称CJS】的重大差异：
// 1）CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
// 2）CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
// 3）CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。
// 4）ES6 模块之中，顶层的this指向undefined；CommonJS 模块的顶层this指向当前模块

// package.json#main 字段
// {
//   "type": "module",
//   "main": "./src/index.js" // 指定模块加载的入口文件
// }
import { something } from 'es-module-package'; // 运行该脚本以后，Node.js 就会到./node_modules目录下面，寻找es-module-package模块，然后根据该模块package.json的main字段去执行入口文件。
// 实际加载的是 ./node_modules/es-module-package/src/index.js

// package.json#exports 字段
// exports字段的优先级高于main字段。
// {
//   "exports": {
//     "./submodule": "./src/submodule.js" // 子目录重命名
//   }
// }
import submodule from 'es-module-package/submodule'; // 等价于加载 ./node_modules/es-module-package/src/submodule.js

// exports字段的别名如果是.，就代表模块的主入口，优先级高于main字段。并且可以直接简写成exports字段的值。
// {
//   "exports": {
//     ".": "./main.js"
//   }
// }
// 等同于
// {
//   "exports": "./main.js"
// }

// 利用.这个别名，为 ES6 模块和 CommonJS 指定不同的入口。
// {
//   "exports": {
//     ".": {
//       "require": "./main.cjs", // CommonJS 的入口
//       "default": "./main.js"   // ES6 的入口
//     }
//   }
// }
// 等价于
// {
//   "exports": {
//     "require": "./main.cjs", 
//     "default": "./main.js"
//   }
// }

// 兼容旧版本的 Node.js。exports字段只有支持 ES6 的 Node.js 才认识，且比main优先级高。
// {
//   "main": "./main-legacy.cjs", // 老版本
//   "exports": { // 新版本
//     ".": "./main-modern.cjs"
//   }
// }

// 同时支持两种格式的模块
// ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。
// 这是因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是module.exports，是一个对象，无法被静态分析，所以只能整体加载。
import packageMain from 'commonjs-package';
// 可用中间转换一层，先加载整个CommonJS模块，再根据需要输出具名接口。后面使用时直接import这个转换模块就ok了。
export const foo = packageMain.foo;
// 另一种做法是在package.json文件的exports字段，指明两种格式模块各自的加载入口。
// "exports"：{
//   "require": "./index.js"，
//   "import": "./esm/wrapper.js"
// }


import './foo.mjs?query=1'; // 加载 ./foo 传入参数 ?query=1。同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。

// 循环加载 
// CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
// {
//   id: '...', // 模块名
//   exports: { ... }, // 模块输出的各个接口。遇到循环加载时，该值存在不完整的情况，导致执行异常。
//   loaded: true, // 表示该模块的脚本是否执行完毕
//   ...
// }
// CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值。
// ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用import从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用。

// 函数具有提升作用，在执行import {bar} from './b'时，函数foo就已经有定义了。





// 【11】others
// ECMAScript 规格
// obj.[[Prototype]] 表明是对象的内部属性

//异步遍历器 [Symbol.asyncIterator] 返回一个 Promise 对象。
asyncIterator
    .next()
    .then(
        ({ value, done }) => { }
    );
// for await...of循环
async function f() {
    try {
        for await (const data of req) body += data;
        const parsed = JSON.parse(body);
        console.log('got', parsed);
    } catch (e) {
        console.error(e); // 如果next方法返回的 Promise 对象被reject，for await...of就会报错
    }
}

// 异步 Generator
// 异步 Generator 函数内部，能够同时使用await和yield命令。可以这样理解，await命令用于将外部操作产生的值输入函数内部，yield命令用于将函数内部的值输出。
async function* readLines(path) {
    let file = await fileOpen(path);
    try {
        while (!file.EOF) {
            yield await file.readLine();
        }
    } finally {
        await file.close();
    }
}

// async 函数和异步 Generator 函数，是封装异步操作的两种方法，都用来达到同一种目的。区别在于，前者自带执行器，后者通过for await...of执行，或者自己编写执行器。
// JavaScript 就有了四种函数形式：普通函数、async 函数、Generator 函数和异步 Generator 函数。请注意区分每种函数的不同之处。基本上，
// 如果是一系列按照顺序执行的异步操作（比如读取文件，然后写入新内容，再存入硬盘），可以使用 async 函数；
// 如果是一系列产生相同数据结构的异步操作（比如一行一行读取文件），可以使用异步 Generator 函数。


// 装饰器【本质是方法调用】提供了一种强大而优雅的方式来扩展和修改JavaScript类的行为，特别适用于框架开发、AOP（面向切面编程）等场景。
// 装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。
// 装饰器可以叠加使用，执行顺序是从上到下（定义时），从外到内（执行时）：
function singleton(cls) {
    let instance;
    return function () {
        if (!instance) {
            instance = new cls(...arguments);
        }
        return instance;
    };
}
@singleton
class MyClassT {
    constructor(val) {
        this.val = val;
    }
}

