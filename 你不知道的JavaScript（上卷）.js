/**
 * 第一部分：作用域和闭包
 */

// JavaScript 归类为“动态”或“解释执行”语言，但事实上它是一门编译语言。它不是提前编译的，编译结果也不能在分布式系统中进行移植。
// 大部分情况下编译发生在代码执行前的几微秒（甚至更短！）的时间内。

// “抽象语法树”（Abstract Syntax Tree，AST）; 将AST 转换为可执行代码的过程称被称为代码生成。这个过程与语言、目标平台等息息相关。引擎、编译器、作用域。
// LHS、RHS: 如果查找的目的是对变量进行赋值，那么就会使用LHS 查询；如果目的是获取变量的值，就会使用RHS 查询。
// ES5 中引入了“严格模式”。严格模式禁止自动或隐式地创建全局变量。因此，在严格模式中LHS 查询失败时，并不会创建并返回一个全局变量，
// 引擎会抛出同RHS 查询失败时类似的ReferenceError 异常。
// LHS 在“非严格模式下”会自动创建全局变量。

// b是最外层的全局作用域
function foo(a) {
    console.log(a + b);
}
var b = 2;
foo(2); // 4

// 作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见第一个匹配的标识符为止。
// 在多层的嵌套作用域中可以定义同名的标识符，这叫作“遮蔽效应”（内部的标识符“遮蔽”了外部的标识符）
// 全局变量会自动成为全局对象（比如浏览器中的window 对象）的属性。通过window.a这种技术可以访问那些被同名变量所遮蔽的【全局变量】。
// 但非全局的变量如果被遮蔽了，无论如何都无法被访问到。

// 词法作用域: 就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的，
// 因此当词法分析器处理代码时会保持作用域不变（大部分情况下是这样的）。
// 欺骗词法作用域会导致性能下降。
// eval欺骗作用域。eval:通常被用来执行动态创建的代码
function foo2(str, a) {
    eval(str); // 欺骗！
    console.log(a, b);
}
var b = 2;
foo2("var b = 3;", 1); // 1，3

// with欺骗作用域: 根据你传递给它的对象凭空创建了一个全新的全局作用域。【with已被完全禁止】
// function foo3(obj) {
//     with (obj) {
//         a = 2; //如果obj中没有属性a，非严格模式下则会创建全局变量a
//     }
// }
// var o1 = {
//     a: 3
// };
// var o2 = {
//     b: 3
// };
// foo3(o1);
// console.log(o1.a); // 2
// foo3(o2); // 创建全局作用域a
// console.log(o2.a); // undefined
// console.log(a); // 2——不好，a 被泄漏到全局作用域上了！

// IIFE，代表立即执行函数表达式（Immediately Invoked Function Expression）
// 函数表达式，foo4 变量名被隐藏在自身中意味着不会污染外部作用域。
// (function foo(){ .. })()。第一个( ) 将函数变成表达式，第二个( ) 执行了这个函数。
// 改进的形式：(function(){ .. }())
var a = 2;
(function foo4() { //foo4可以省略
    var a = 3;
    console.log(a); // 3
})();
console.log(a); // 2

// 匿名函数的缺陷: 1）栈追踪中不会显示出有意义的函数名，使得调试很困难。2）当函数需要引用自身时只能使用已经过期的arguments.callee 引用，
// 比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。3）匿名函数省略了对于代码可读性/可理解性很重要的函数名。

// IIFE 进阶用法是把它们当作函数调用并传递参数进去
// var a = 2; // 最外层会默认挂到window上，在函数里面的var不会
// (function IIFE(global) {
//     var a = 3;
//     console.log(a); // 3
//     console.log(global.a); // 2
// })(window);
// console.log(a); // 2

// 函数表达式可以是匿名的【不提倡使用】
setTimeout(function () {
    console.log("I waited 1 second!");
}, 1000);

// IIFE 还有一种变化的用途是倒置代码的运行顺序，将需要运行的函数放在第二位，在IIFE执行之后当作参数传递进去
// var a = 2;
// (function IIFE(def) {
//     def(window);
// })(function def(global) {
//     var a = 3;
//     console.log(a); // 3
//     console.log(global.a); // 2
// });

// 块作用域
// var【函数\全局】 let【块】 const【块】
// 非常重要var的作用域依附于function; let的作用域依附于{ .. }
// 当使用var声明变量时，它写在哪里都是一样的，因为它们最终都会属于外部作用域。【有点全局静态变量的意思】
// 声明中的任意位置都可以使用{ .. } 括号来为 let 创建一个用于绑定的块。
// const 同样可以用来创建【块作用域变量】，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。
function fun_aaa() {
    var var_fun_111 = 111; // 声明在一个函数内部的变量或函数会在所处的作用域中“隐藏”起来
    console.log(var_fun_111);
}
{
    var var_fun_222 = 222;
}
// console.log(var_fun_111) // ReferenceError: err not found
console.log(var_fun_222); // JS中的作用域是以函数 function 为基础单位，不是 { .. }
let let_pp;
if (true) {
    var var_p = 222;
    let let_p = 3;
    let_pp = 4;
}
console.log(var_p);
// console.log(let_p) // ReferenceError: err not found
console.log(let_pp);

// 块作用域另一个非常有用的原因和闭包及回收内存垃圾的回收机制相关
function process(data) {
    // 在这里做点有趣的事情
}
{
    let someReallyBigData = {}; // 为变量显式声明块作用域
    process(someReallyBigData);
}
// 上面这个块中定义的内容someReallyBigData可以销毁了！如果使用var则不能销毁。{ .. } 与 let 要搭配使用

// 包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。打个比方，这个过程就好像变量和函数声明从它们在代码中出现的位置被“移动”
// 到了最上面。这个过程就叫作【提升】。换句话说，先有蛋（声明）后有鸡（赋值）。
aq = 212;
var aq; // 在编译阶段就会执行，优先于上面的赋值操作
console.log(aq); // 212

var ax;
console.log(ax); // undefined

foo7();
function foo7() {
    console.log("foo7");
}

// 只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。
// foo8(); // 不是ReferenceError，而是TypeError! 。foo8 此时并没有赋值，foo8() 由于对undefined 值进行函数调用而导致非法操作，因此抛出TypeError 异常。
// bar8(); // ReferenceError
// var foo8 = function bar8() { // 具名的函数表达式，名称标识符bar8在赋值之前无法在所在作用域中使用
// };

// 函数声明和变量声明都会被提升。但是一个值得注意的细节（这个细节可以出现在有多个“重复”声明的代码中）是函数会首先被提升，然后才是变量。
// foo9(); // 1
// var foo9; // 尽管出现在function foo9()... 的声明之前，但它是重复的声明（因此被忽略了），因为【函数声明会被提升到普通变量之前】。
// function foo9() { // 会被下面的function foo9()覆盖
//     console.log(11);
// }
// foo9 = function () {
//     console.log(2);
// };
// function foo9() {
//     console.log(1);
// }
// 出现在后面的函数声明会覆盖前面的。

// 总结: 我们习惯将var a = 2; 看作一个声明，而实际上JavaScript 引擎并不这么认为。
// 它将var a 和 a = 2 当作两个单独的声明，第一个是编译阶段的任务，而第二个则是执行阶段的任务。
// foo()也是类似的。var foo 编译阶段的任务。
// 这意味着无论作用域中的声明出现在什么地方，都将在代码本身被执行前首先进行处理。
// 可以将这个过程形象地想象成所有的【声明】（变量和函数）都会被“移动”到各自作用域的最顶端，这个过程被称为提升。
// 声明本身会被提升，而包括函数表达式的赋值在内的赋值操作并不会提升。
// 要注意避免重复声明，特别是当普通的var 声明和函数声明混合在一起的时候，否则会引起很多危险的问题！

// 作用域闭包
// 下面的baza() 依然持有对fooa()的内部作用域的引用，而这个引用就叫作闭包。
// 无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。
function fooa() {
    var a = 2;
    function bar() {
        console.log(a);
    }
    return bar; // 它在自己定义的词法作用域以外的地方执行。
}
var baza = fooa();
baza(); // 2 —— 朋友，这就是闭包的效果。
// 闭包会阻止fooa()执行完毕后对fooa() 的整个内部作用域内存的垃圾回收，上面的 var a 会被保留。
// bara()它拥有涵盖fooa() 内部作用域的闭包，使得该作用域能够一直存活，以供bara() 在之后任何时间进行引用。

// 循环和闭包
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        // console.log('A:' + i); // 会以每秒一次的频率输出五次6，并不是分别输出数字1~5
    }, i * 1000);
}
// 改进1
for (var i = 1; i <= 5; i++) {
    (function () {
        var j = i; // 强调var的作用域是依附于function
        setTimeout(function timer() {
            // console.log('B:' + j);
        }, j * 1000);
    })();
}
// 改进2
for (var i = 1; i <= 5; i++) {
    (function (j) {
        setTimeout(function timer() {
            // console.log('C:' + j);
        }, j * 1000);
    })(i);
}
// 改进3
for (var i = 1; i <= 5; i++) {
    let j = i; // 是的，闭包的块作用域！
    setTimeout(function timer() {
        // console.log('D:' + j);
    }, j * 1000);
}
// 改进4，完美版
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        // console.log('E:' + i);
    }, i * 1000);
}
// for 循环头部的let 声明还会有一个特殊的行为。这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随
// 后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。

// 模块
// 模块模式需要具备两个必要条件:
// 1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。
// 2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。
// 下面这个模式在JavaScript 中被称为模块。
function CoolModule() {
    var something = "cool"; //函数属性，保持内部数据变量是隐藏且私有的状态
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join(" ! "));
    }
    return { // 这个返回的对象中含有对内部函数而不是内部数据变量的引用。
        doSomething: doSomething,
        doAnother: doAnother
    };
}
var foob = CoolModule();
foob.doSomething(); // cool
foob.doAnother(); // 1 ! 2 ! 3

// ES6 会将文件当作独立的模块来处理。一个文件一个模块
// bar.js
// function hello(who) {
//     return "Let me introduce: " + who;
// }
// export hello;
// foo.js
// import hello from "bar"; // 仅从"bar" 模块导入hello()
// module bar from "bar"; // 导入完整的"bar" 模块

// 箭头函数 => 被认为是 function 关键字的简写
var fooc = a => {
    console.log(a);
};
fooc(2); // 2

var obj = {
    id: "awesome",
    cool: function coolFn() {
        console.log('obj this:' + this);
        console.log('obj:' + this.id);
    }
};
var id = "not awesome";
obj.cool(); // 酷。cool方法中的this是Object
// setTimeout(obj.cool, 100); // 不酷。cool方法中的this是Window
// 改进1
var obj2 = {
    count: 0,
    cool: function coolFn() {
        var self = this;
        if (self.count < 1) {
            setTimeout(function timer() {
                self.count++;
                // console.log("awesome?");
            }, 100);
        }
    }
};
obj2.cool(); // 酷
// 改进2 
// ES6 中的箭头函数引入了一个叫作this 词法的行为。，箭头函数在涉及this 绑定时的行为和普通函数的行为完全不一致。它放弃了所
// 有普通this 绑定的规则，取而代之的是用当前的词法作用域覆盖了this 本来的值。
var obj3 = {
    count: 0,
    cool: function coolFn() {
        if (this.count < 1) { // 这里的this不会有问题
            setTimeout(() => {
                // console.log("awesome:" + this.count++); //awesome:0
            }, 100);
            // 这个代码片段中的箭头函数并非是以某种不可预测的方式同所属的this 进行了解绑定，
            // 而只是“继承”了cool() 函数的this 绑定（因此调用它并不会出错）。
            setTimeout(function aaa() {
                // console.log("awesome:" + this.count++); //awesome:NaN
            }, 100);
        }
    }
};
obj3.cool(); // 酷
// 改进3，
var obj4 = {
    count: 0,
    cool: function coolFn() {
        if (this.count < 1) {
            setTimeout(function timer() {
                this.count++; // this 是安全的，因为bind(..)
                // console.log("more awesome");
            }.bind(this), 100); // look, bind()!
        }
    }
};
obj4.cool(); // 更酷了。

/**
 * 第二部分：this和对象原型
 */

// this 被自动定义在所有函数的作用域中。 JavaScript 中的所有函数都是对象。
// this 在任何情况下都不指向函数的词法作用域。即，你不能使用this 来引用一个词法作用域内部的东西。
// this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。
// this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。
// this的作用: 可以在不同的上下文对象（me 和you）中重复使用函数identify()，不用针对每个对象编写不同版本的函数。
function identify() {
    return this.name.toUpperCase();
}
var me = {
    name: "Kyle"
};
var you = {
    name: "Reader"
};
console.log(identify.call(me)); // KYLE
console.log(identify.call(you)); // READER
// 如果不使用this，那就需要给identify()显式传入一个上下文对象，如下面的identify2()。
// 但，随着你的使用模式越来越复杂，显式传递上下文对象会让代码变得越来越混乱，使用this则不会这样。
function identify2(context) {
    return context.name.toUpperCase();
}
// this 并不像我们所想的那样指向函数本身。
function food(num) {
    // food 被调用的次数
    this.count++; //这里会创建一个全局变量count，它的值为NaN。这里this不指向food
}
food.count = 0; // 因为JavaScript中所有函数都是一个对象，向函数对象food 添加了一个属性count并赋值为0。
// 但是函数内部代码this.count 中的this 并不是指向那个函数对象food，所以虽然属性名相同，根对象却并不相同。
for (var i = 0; i < 10; i++) {
    if (i > 5) {
        food(i);
    }
}
console.log('food.count:' + food.count); // 0

// 用arguments.callee 来引用当前正在运行的函数对象。这是唯一一种可以从匿名函数对象内部引用自身的方法。
// 然而，更好的方式是避免使用匿名函数，至少在需要自引用时使用具名函数。arguments.callee 已经被弃用，不应该再使用它。
// 改进1: 这种方法回避了this 的问题，并且完全依赖于变量fooe 的词法作用域。
function fooe(num) {
    fooe.count++; // !!!
}
fooe.count = 0;
for (var i = 0; i < 10; i++) {
    if (i > 5) {
        fooe(i);
    }
}
console.log('fooe.count:' + fooe.count); // 4
// 改进2: 强制this 指向foo 函数对象
function foof(num) {
    this.count++; // 这里this指向foof
}
foof.count = 0;
for (var i = 0; i < 10; i++) {
    if (i > 5) {
        foof.call(foof, i);
    }
}
console.log('foof.count:' + foof.count); // 4

// this 在任何情况下都不指向函数的词法作用域。即，你不能使用this 来引用一个词法作用域内部的东西。
function barq() {
    var a = 2;
    console.log(this.a); // 改进: 将 var a = 2 改为 this.a = 2
}
barq.call(barq);

// this 的四条绑定规则：【优先级依照下面的顺序】
// 1. 由new 调用绑定到新创建的对象。
// 2. 显式绑定：由call 或者apply（或者bind）调用绑定到指定的对象。
// 3. 隐式绑定：由上下文对象调用，绑定到那个上下文对象。
// 4. 默认绑定：在严格模式下绑定到undefined，否则绑定到全局对象。

// 4.默认绑定
function foog() {
    console.log('foog:' + this);
    console.log(this.a);
}
var a = 22;
foog();
// 22 或者 TypeError: this is undefined【严格模式】 
// 在代码中，foog() 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。
// 函数调用时应用了this 的默认绑定，因此this 指向全局对象。
// 如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此this 会绑定到undefined。
(function () {
    "use strict";
    foog(); // 22
})();

// 3.隐式绑定
// 我们必须在一个对象objh内部包含一个指向函数的属性fooh，并通过这个属性fooh【间接】引用函数，从而把this 间接（隐式）绑定到这个对象上。
function fooh() {
    console.log(this.a);
}
var objh = {
    a: 2,
    fooh: fooh
};
objh.fooh(); // 2
// 你可以认为函数被调用时objh 对象“拥有”它。即，objh 对象“拥有fooh，这里的this即objh。
// 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this 绑定到这个上下文对象。
// 因为调用fooh() 时this 被绑定到objh，因此this.a 和objh.a 是一样的。
var objh2 = {
    a: 42,
    objh: objh
};
objh2.objh.fooh() //2 最后一层会影响调用位置
// 隐式丢失
function fooi() {
    console.log(this.a);
}
var obji = {
    ai: 2,
    fooi: fooi
};
var bari = obji.fooi; // 函数别名！
var ai = "oops, global"; // ai 是全局对象的属性
bari(); // "oops, global"
// 虽然bari 是obji.fooi 的一个引用，但是实际上，它引用的是fooi 函数本身，因此此时的
// bari() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

// 2.显式绑定
// 可以避免在对象内部包含函数引用，即，可以省略上面例子中objh对象的fooh: fooh
function fooj() {
    console.log(this.a);
}
var objj = {
    a: 27
};
fooj.call(objj); // 27

// call和apply的区别
function sum(a, b, c) {
    return a + b + c;
}
// 使用 call：参数列表
console.log(sum.call(null, 1, 2, 3)); // 输出: 6
// 使用 apply：数组或类数组对象
console.log(sum.apply(null, [1, 2, 3])); // 输出: 6
// 第一个参数如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作this 的绑定对
// 象，这个原始值会被转换成它的对象形式（也就是new String(..)、new Boolean(..) 或者
// new Number(..)）。这通常被称为“装箱”。

// 硬绑定【显式绑定的一个变种】
function fook() {
    console.log('fook:' + this.a);
}
var objk = {
    a: 2789
};
var bark = function () {
    fook.call(objk);
    // 强制把fook 的this 绑定到了objk。无论之后如何调用函数bark，
    // 它总会手动在objk 上调用fook。这种绑定是一种显式的强制绑定，因此我们称之为【硬绑定】。
};
bark(); // 2789
setTimeout(bark, 100); // 2
// 硬绑定的bark 不可能再修改它的this
// bark.call(window); // 2789

// 硬绑定的典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有值：
function fool(something) {
    console.log('fool:' + this.a, ":", something);
    return this.a + something;
}
var objl = {
    a: 2
};
var barl = function () {
    return fool.apply(objl, arguments); // 调用本质: fool(arguments[0], arguments[1], arguments[2], ...)
};
var bl = barl(3); // 2 3
console.log(bl); // 5

// bind
// 由于硬绑定是一种非常常用的模式，所以在ES5 中提供了内置的方法Function.prototype.bind，上面例子中的函数barl 可以用下面的bind 代替：
var bl = fool.bind(obj);

// 许多函数都提供了一个可选的参数，通常被称为“上下文”（context），其作用和bind(..) 一样，【确保你的回调函数使用指定的this】。
function foom(el) {
    console.log(el, this.id);
}
var objm = {
    id: "awesome"
};
// 调用foom(..) 时把this 绑定到objm
[1, 2, 3].forEach(foom, objm); // 1 awesome 2 awesome 3 awesome

// 1.new 绑定
// JavaScript 中的“构造函数”，它们只是被new 操作符调用的普通函数而已。
// 所有函数都可以用new 来调用，这种函数调用被称为构造函数调用。JavaScript 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。
// 使用new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作:
// 1. 创建（或者说构造）一个全新的对象。
// 2. 这个新对象会被执行[[ 原型]] 连接。
// 3. 这个新对象会绑定到函数调用的this。
// 4. 如果函数没有返回其他对象，那么new 表达式中的函数调用会自动返回这个新对象。
function foon(a) {
    this.a = a;
}
var barn = new foon(2);
console.log('barn:' + barn.a); // 2

// 柯里化（部分应用）：预先设置函数的一些参数
// 之所以要在new 中使用硬绑定函数，主要目的是【预先设置函数的一些参数】，这样在使用new 进行初始化时就可以只传入其余的参数。
// bind(..) 的功能之一就是可以把除了第一个参数（第一个参数用于绑定this）之外的其他参数都【传给下层的函数】（这种技术称为“部
// 分应用”，是“柯里化”的一种）。举例来说：
function foop(p1, p2) {
    this.val = p1 + ':' + p2;
}
// 之所以使用null 是因为在本例中我们并不关心硬绑定的this 是什么，反正使用new 时this 会被修改
var barp = foop.bind(null, "aaa"); // 给p1预先设置参数值 aaa
var bazp = new barp("bbb"); // 这里给p2赋值
console.log('bazp.val:' + bazp.val); // aaa:bbb

// 被忽略的this
// 如果你把null 或者undefined 作为this 的绑定对象传入call、apply 或者bind，
// 这些值在调用时会被忽略，实际应用的是默认绑定规则：
function fooo() {
    console.log(this.a);
}
var a = 29;
fooo.call(null); // 29


// 在ES6 中，可以用... 操作符代替apply(..) 来“展开”数组，foo(...[1,2]) 和foo(1,2) 是一样的。这样可以避免不必要的this 绑定。
function fooq(a, b, c) {
    console.log("a:" + a + ", b:" + b + ", c:" + c);
}
// 把数组“展开”成参数
fooq.apply(null, [2, 3, 4]); // a:2, b:3, c:4
fooq(...[2, 3, 4]);// a:2, b:3, c:4

// 总是使用null 来忽略this 绑定可能产生一些副作用。如果某个函数确实使用了
// this（比如第三方库中的一个函数），那默认绑定规则会把this 绑定到全局对象（在浏览
// 器中这个对象是window），这将导致不可预计的后果（比如修改全局对象）。
// 解决方案：将null 替换为空对象 Object.create(null)
// Object.create(null) 和{} 很像， 但是并不会创建Object.prototype 这个委托，所以它比{}“更空”

// 箭头函数 => : 箭头函数不使用this 的四种标准规则，而是根据外层（函数或者全局）作用域来决定this。
// 【箭头函数用更常见的词法作用域取代了传统的this 机制】
function foor() {
    // 返回一个箭头函数
    return (a) => {
        //this 继承自foor()
        console.log(this.a);
    };
}
var objr1 = {
    a: 2
};
var objr2 = {
    a: 3
};
var barr = foor.call(objr1);
barr.call(objr2); // 2, 不是3 ！
// foor() 内部创建的箭头函数会捕获调用时foor() 的this。由于foor() 的this 绑定到objr1，
// barr（引用箭头函数）的this 也会绑定到objr1，箭头函数的绑定无法被修改。（new 也不行！）

// 箭头函数最常用于回调函数中，例如事件处理器或者定时器：
function foos() {
    setTimeout(() => {
        // 这里的this 在此法上继承自foos()
        console.log(this.a);
    }, 100);
}
var objs = {
    a: 2
};
foos.call(objs); // 2

// 虽然self = this 和箭头函数看起来都可以取代bind(..)，但是从本质上来说，它们想替代的是this 机制。
// 如果你经常编写this 风格的代码，但是绝大部分时候都会使用self = this 或者箭头函数来否定this 机制，那你或许应当：
// 1. 只使用词法作用域并完全抛弃错误this 风格的代码；
// 2. 完全采用this 风格，在必要时使用bind(..)，尽量避免使用self = this 和箭头函数。

// 对象
// 定义对象的两种形式：
// 1. 文字形式（声明式）
var myObj = {
    key: 7
    // ...
};
// 2. 构造式，非常少见
var myObj2 = new Object();
myObj2.key = 7;

// JavaScript 的基本数据类型：string、boolean、number、null、undefined 这五个类型本身并不是对象，此外还有object 类型
// JavaScript 的内置对象：String、Boolean、Number、Object、Function、Array、Date、RegExp、Error

// null 有时会被当作一种对象类型，但是这其实只是语言本身的一个bug，即对null 执行typeof null 时会返回字符串"object"。
// 实际上，null 本身是基本类型。原理是这样的：不同的对象在底层都表示为二进制，在JavaScript 中二进制前三位都为0 的话会被判
// 断为object 类型，null 的二进制表示是全0，自然前三位也是0，所以执行typeof 时会返回“object”。
var strPrimitive = "I am a string";
typeof strPrimitive; // "string"
strPrimitive instanceof String; // false
var strObject = new String("I am a string");
typeof strObject; // "object"
strObject instanceof String; // true
// 检查sub-type 对象
Object.prototype.toString.call(strObject); // [object String]

var strPrimitive = "I am a string"; // 并不是一个对象，它只是一个字面量，并且是一个不可变的值。
console.log(strPrimitive.length); // 13，引擎自动把字符串字面量转换成一个String 对象
42.359.toFixed(2) //42，引擎自动转换为Number 对象

var myObject = {
    a: 26
};
myObject.a; // 26，【属性访问】与下面的方式等价
console.log(myObject["a"]); // 26，【键访问】
// 上面两种语法的主要区别在于：x.a操作符要求属性名满足标识符的命名规范，而[".."] 语法
// 可以接受任意UTF-8/Unicode 字符串作为属性名。举例来说，如果要引用名称为"Super-Fun!" 的属性，
// 那就必须使用["Super-Fun!"] 语法访问，因为Super-Fun! 并不是一个有效的标识符属性名。
// 由于[".."] 语法使用字符串来访问属性，因此可以动态构造

// 在对象中，属性名永远都是字符串。如果你使用string（字面量）以外的其他值作为属性名，那它首先会被转换为一个字符串。
// 即使是数字也不例外。
var myObject = {};
myObject[true] = "foo"; // 属性值先自动转换为"true"
myObject[3] = "bar"; // 属性值先自动转换为"3"
myObject[myObject] = "baz"; // 属性值先自动转换为"[object Object]"

console.log(myObject) // [object Object]

myObject["true"]; // "foo"
myObject["3"]; // "bar"
myObject["[object Object]"]; // "baz"

// 数组
// 数组也是对象，所以虽然每个下标都是整数，你仍然可以给数组添加属性：
var myArray = ["foo", 42, "bar"];
myArray.baz = "baz";
myArray.length; // 3
myArray.baz; // "baz"
// 如果属性名“看起来”像一个数字，那它会变成一个数值下标（因此会修改数组的内容而不是添加一个属性）：
var myArray = ["foo", 42, "bar"];
myArray["3"] = "baz";
myArray.length; // 4
myArray[3]; // "baz"

// 深度复制: 下面的JSON方法需要保证对象是JSON 安全的，所以只适用于部分情况。
var newObj = JSON.parse(JSON.stringify(myObject));
// 浅度复制: Object.assign(..) 方法的第一个参数是目标对象，之后还可以跟一个或多个源对象。
// 它会遍历一个或多个源对象的所有可枚举的自有键，并把它们复制（使用= 操作符赋值）到目标对象，最后返回目标对象。
// 注意: 由于Object.assign(..) 使用= 操作符来赋值，所以源对象属性的一些特性（比如writable）不会被复制到目标对象。
var anotherObject = {}
var anotherArray = []
var anotherFunction = () => { }
var myObject = {
    a: 2,
    b: anotherObject, // 引用，不是复本！
    c: anotherArray, // 另一个引用！
    d: anotherFunction
};
var myObject2 = {
    e: "eee"
}
var newObj = Object.assign({}, myObject, myObject2);
console.log(newObj.a); // 2
console.log(newObj.b === anotherObject); // true
console.log(newObj.c === anotherArray); // true
console.log(newObj.d === anotherFunction); // true
console.log(newObj.e); // eee

// 属性描述符
var myObject = {
    a: 2
};
Object.getOwnPropertyDescriptor(myObject, "a");
// {
// value: 2,
// writable: true, // 可写
// enumerable: true, // 可枚举，意味着“可以出现在对象属性的遍历中”。
// configurable: true // 可配置
// }

// defineProperty 修改和定义属性描述符
// writable 决定是否可以修改属性的值
var myObject = {};
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: false, // 不可写！
    configurable: true,
    enumerable: true
});
myObject.a = 3; // 无效；在严格模式下，这种方法会出错：TypeError
console.log('defineProperty :' + myObject.a); // 2

// configurable: 只要属性是可配置的，就可以使用defineProperty(..) 方法来修改属性描述
// 把configurable 修改成false 是单向操作，无法撤销！
// 即便属性是configurable:false， 我们还是可以把writable 的状态由true 改为false，但是无法由false 改为true。
// 除了无法修改，configurable:false 还会【禁止删除】这个属性：
var myObject = {
    a: 2
};
console.log(myObject.a); // 2
delete myObject.a; // 生效
// 在本例中，delete 只用来直接删除对象的（可删除）属性。如果对象的某个属性是某个对象/ 函数的最后一个引用者，对这个属性执行delete 操作之后，
// 这个未引用的对象/ 函数就可以被垃圾回收。但是，不要把delete 看作一个释放内存的工具（就像C/C++ 中那样），它就是一个删除对象属性的操作，仅此而已。
console.log(myObject.a); // undefined
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: true,
    configurable: false,
    enumerable: true
});
console.log(myObject.a); // 2
delete myObject.a; // 无效
console.log(myObject.a); // 2

// enumerable: 该属性是否会出现在对象的属性枚举中，比如说for..in 循环。如果把enumerable 设置成false，
// 这个属性就不会出现在枚举中，但仍然可以正常访问它。相对地，设置成true 就会让它出现在枚举中。
// 【用户自定义的属性默认是true】

// 不变性
// 1. 对象常量
// 结合writable:false 和configurable:false 就可以创建一个真正的常量属性（不可修改、重定义或者删除）

// 2. 禁止扩展
// 如果你想禁止一个对象添加新属性并且保留已有属性，可以使用Object.preventExtensions(myObject);

// 3. 密封
// Object.seal(..) 会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用Object.preventExtensions(..) 
// 并把所有现有属性标记为configurable:false。所以，密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性，但是可以修改属性的值。

// 4. 冻结【级别最高的不可变性，但这个对象引用的其他对象是不受影响的】
// Object.freeze(..) 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用Object.seal(..) 
// 并把所有“数据访问”属性标记为writable:false，这样就无法修改它们的值。
// 你可以“深度冻结”一个对象，具体方法为，首先在这个对象上调用Object.freeze(..)，然后遍历它引用的所有对象并在这些对象上调用Object.freeze(..)。
// 但是一定要小心，因为这样做有可能会在无意中冻结其他（共享）对象。

// 
var myObjectA = {
    a: 202,
    b: undefined
};
console.log(myObjectA.a); // 202
console.log(myObjectA.b); // undefined，注意: 仅根据返回值无法判断出到底变量的值为undefined 还是变量不存在。
console.log(myObjectA.c); // undefined，
// 注意：myObjectA.c 这种方法和访问变量时是不一样的。如果你引用了一个当前词法作用域中不存在的
// 变量，并不会像对象属性一样返回undefined，而是会抛出一个ReferenceError 异常

// Getter 和 Setter
// 给一个属性定义getter、setter后会，JavaScript 会忽略它们的value 和writable 特性，
// 取而代之的是关心set 和get（还有configurable 和enumerable）特性。
var myObject = {
    get a() { // 给a 定义一个getter
        return 2;
    },
    // 给 a 定义一个setter
    set a(val) {
        this._a_ = val * 2;
    }
};
Object.defineProperty(
    myObject, // 目标对象
    "b", // 属性名
    { // 描述符
        // 给b 设置一个getter
        get: function () { return this.a * 2 },
        // 确保b 会出现在对象的属性列表中
        enumerable: true
    }
);
myObject.a = 3; // 无效
myObject.a; // 2
myObject.b; // 4

// 属性的存在性: in、hasOwnProperty
// in 操作符会检查属性是否在对象及其[[Prototype]] 原型链中。
// hasOwnProperty(..) 只会检查属性是否在myObject 对象中，不会检查[[Prototype]] 链。
var myObject = {
    a: 2
};
("a" in myObject); // true
("b" in myObject); // false
myObject.hasOwnProperty("a"); // true
myObject.hasOwnProperty("b"); // false
// in 注意: 不是检查容器内是否有某个值，而是检查某个属性名是否存在。
// 4 in [2, 4, 6] 的结果并不是你期待的True，因为[2, 4, 6] 这个数组中包含的属性名是0、1、2，没有4。
console.log('in1:' + (4 in [2, 4, 6])) // false
console.log('in2:' + (0 in [2, 4, 6])) // true
console.log('in3:' + ('length' in [2, 4, 6])) // true

// 枚举
// Object.keys(..)和Object.getOwnPropertyNames(..) 都只会查找对象直接包含的属性，不会查找[[Prototype]] 链。
var arrA = [2, 4, 6]
console.log("arrA1:" + Object.keys(arrA)) // 0,1,2
console.log("arrA2:" + Object.getOwnPropertyNames(arrA)) // 0,1,2,length

var myObjectB = {};
Object.defineProperty(
    myObjectB,
    "a",
    // 让a 像普通属性一样可以枚举
    { enumerable: true, value: 2 }
);
Object.defineProperty(
    myObjectB,
    "b",
    // 让b 不可枚举
    { enumerable: false, value: 3 }
);
myObjectB.propertyIsEnumerable("a"); // true
myObjectB.propertyIsEnumerable("b"); // false
// Object.keys: 包含所有可枚举属性
console.log(Object.keys(myObjectB)); // ["a"]
// Object.getOwnPropertyNames: 包含所有属性，无论它们是否可枚举
console.log(Object.getOwnPropertyNames(myObjectB)); // ["a", "b"]

// 遍历
// for..in 循环可以用来遍历对象的可枚举属性列表（包括[[Prototype]] 链），但是如何遍历属性的值呢？
// 注意: 遍历对象属性时的顺序是不确定的，在不同的JavaScript 引擎中可能不一样。
// 标准的for 循环来遍历值:【这实际上并不是在遍历值，而是遍历下标来指向值】
var myArray = [1, 2, 3];
for (var i = 0; i < myArray.length; i++) {
    console.log(myArray[i]);
}
// forEach(..)、every(..)、some(..)
// forEach(..) 会遍历数组中的所有值并忽略回调函数的返回值。every(..) 会一直运行直到
// 回调函数返回false（或者“假”值），some(..) 会一直运行直到回调函数返回true（或者“真”值）。
// every(..) 和some(..) 中特殊的返回值和普通for 循环中的break 语句类似，它们会提前终止遍历。

// for..of 如果对象本身定义了迭代器的话也可以遍历对象
for (var v of myArray) {
    console.log(v);
}
// for..of 原理: 循环首先会向被访问对象请求一个【迭代器对象】，然后通过调用迭代器对象的next() 方法来遍历所有返回值。
// 数组有内置的@@iterator，因此for..of 可以直接应用在数组上。我们使用内置的@@iterator 来手动遍历数组，看看它是怎么工作的：
var myArray = [1, 2, 3];
var it = myArray[Symbol.iterator](); // 使用ES6 中的符号Symbol.iterator 来获取对象的@@iterator 【内部属性】
// @@iterator 本身并不是一个迭代器对象，而是一个返回迭代器对象的函数。
it.next(); // { value:1, done:false }
it.next(); // { value:2, done:false }
it.next(); // { value:3, done:false }
it.next(); // { done:true } // 注意是会多调用一次的

// 给对象自定义@@iterator功能
var myObjectC = {
    a: 72,
    b: 73
};
Object.defineProperty(myObjectC, Symbol.iterator, {
    enumerable: false, // 关键点
    writable: false,
    configurable: true,
    value: function () {
        var o = this;
        var idx = 0;
        var ks = Object.keys(o);
        return {
            next: function () {
                return {
                    value: o[ks[idx++]],
                    done: (idx > ks.length)
                };
            }
        };
    }
});
// 手动遍历myObjectC
var it = myObjectC[Symbol.iterator]();
it.next(); // { value:72, done:false }
it.next(); // { value:73, done:false }
it.next(); // { value:undefined, done:true }
// 用for..of 遍历myObjectC
for (var v of myObjectC) {
    console.log('myObjectC:' + v);
}
// 我们使用Object.defineProperty(..) 定义了我们自己的@@iterator（主要是
// 为了让它不可枚举），此外，也可以直接在定义对象时进行声明，比如:
// var myObject = {a:2, b:3, [Symbol.iterator]: function() { .. } }。

// demo: 生成“无限个”随机数
var randoms = {
    [Symbol.iterator]: function () {
        return {
            next: function () {
                return { value: Math.random() };
            }
        };
    }
};
var randoms_pool = [];
for (var n of randoms) {
    randoms_pool.push(n);
    // 防止无限运行！
    if (randoms_pool.length === 100) break;
}

// 混合对象“类”【类是类、对象是对象】
// 由于类是一种设计模式，所以你可以用一些方法近似实现类的功能。
// 为了满足对于类设计模式的最普遍需求，JavaScript 提供了一些近似类的语法。
// 但JavaScript 的机制似乎一直在阻止你使用类设计模式。

// 在传统的面向类的语言中super 还有一个功能，就是从子类的构造函数中通过
// super 可以直接调用父类的构造函数。通常来说这没什么问题，因为对于真正
// 的类来说，构造函数是属于类的。
// 然而，在JavaScript 中恰好相反——实际上“类”是属于构造函数的（类似Foo.prototype... 这样的类型引用）。
// 由于JavaScript 中父类和子类的关系只存在于两者构造函数对应的.prototype 对象中，
// 因此它们的构造函数之间并不存在直接联系，从而无法简单地实现两者的相对引用，在ES6 的类中可以通过super 来“解决”这个问题。

// JavaScript 本身并不提供“多重继承”功能。

// 混入
// 类意味着复制
// 在继承或者实例化时，JavaScript 的对象机制并不会自动执行复制行为。简单来说，JavaScript 中只有对象，并不存在可以被实例化的“类”。
// 一个对象并不会被复制到其他对象，它们会被关联起来。由于在其他语言中类表现出来的都是复制行为，
// 因此JavaScript 开发者也想出了一个方法来模拟类的复制行为，这个方法就是【混入】。

// 显式混入
// 由于显式伪多态可以模拟多重继承，所以它会进一步增加代码的复杂度和维护难度。
// 使用伪多态通常会导致代码变得更加复杂、难以阅读并且难以维护，因此应当尽量避免使用显式伪多态，因为这样做往往得不偿失。
function mixin(sourceObj, targetObj) {
    for (var key in sourceObj) {
        // 只会在不存在的情况下复制
        if (!(key in targetObj)) {
            targetObj[key] = sourceObj[key];
        }
    }
    return targetObj;
}
var Vehicle = {
    engines: 1,
    ignition: function () {
        console.log("Turning on my engine.");
    },
    drive: function () {
        this.ignition();
        console.log("Steering and moving forward!");
    }
};
var Car = mixin(Vehicle, {
    wheels: 4,
    drive: function () { // 在JavaScript 中不推荐命名相同的方法，尽量避免多态的情况。
        Vehicle.drive.call(this); // 要避免显式伪多态
        // 显式多态，由于Car 和Vehicle 中都有drive() 函数，为了指明调用对象，
        // 我们必须使用绝对（而不是相对）引用。我们通过名称显式指定Vehicle 对象并调用它的drive() 函数。
        // 但是如果直接执行Vehicle.drive()，函数调用中的this 会被绑定到Vehicle 对象而不是Car 对象，这并不是我们想要的。
        // 因此，我们会使用.call(this)来确保drive() 在Car 对象的上下文中执行。
        console.log(
            "Rolling on all " + this.wheels + " wheels!"
        );
    }
});
// 现在Car 中就有了一份Vehicle 属性和函数的副本了。函数实际上没有被复制，复制的是函数引用。
// 由于两个对象引用的是同一个函数，因此这种复制（或者说混入）实际上并不能完全模拟面向类的语言中的复制。
// JavaScript 中的函数无法（用标准、可靠的方法）真正地复制，所以你只能复制对共享函数对象的引用（函数就是对象）。
// 如果你修改了共享的函数对象（比如ignition()），比如添加了一个属性，那Vehicle 和Car 都会受到影响。

// 一定要注意：只在能够提高代码可读性的前提下使用显式混入，避免使用增加代码理解难度或者让对象关系更加复杂的模式。

// 寄生继承: 显式混入模式的一种变体被称为“寄生继承”
// “传统的JavaScript 类”Vehicle
function Vehicle() {
    this.engines = 1;
}
Vehicle.prototype.ignition = function () {
    console.log("Turning on my engine.");
};
Vehicle.prototype.drive = function () {
    this.ignition();
    console.log("Steering and moving forward!");
};
// “寄生类” Car
function Car() {
    // 首先，car 是一个Vehicle
    var car = new Vehicle();
    // 接着我们对car 进行定制
    car.wheels = 4;
    // 保存到Vehicle::drive() 的特殊引用【关键: 保留父类的特殊引用】
    var vehDrive = car.drive;
    // 重写Vehicle::drive()
    car.drive = function () {
        vehDrive.call(this); // 调用父类方法
        console.log(
            "Rolling on all " + this.wheels + " wheels!"
        );
    }
    return car;
}
var myCar = new Car();
myCar.drive();
// 调用new Car() 时会创建一个新对象并绑定到Car 的this 上。但是因为我们没有使用这个对象而是返回了我们自己的car 对象，
// 所以最初被创建的这个对象会被丢弃，因此可以不使用new 关键字调用Car()。这样做得到的结果是一样的，但是可以避免创建并丢弃多余的对象。

// 隐式混入
var Something = {
    cool: function () {
        this.greeting = "Hello World";
        this.count = this.count ? this.count + 1 : 1;
    }
};
Something.cool();
Something.greeting; // "Hello World"
Something.count; // 1
var Another = {
    cool: function () {
        // 隐式把Something 混入Another
        Something.cool.call(this);
        // 通过this 绑定，最终的结果是Something.cool() 中的赋值操作都会应用在Another 对象上而不是Something 对象上。
        // 因此，我们把Something 的行为“混入”到了Another 中。
    }
};
Another.cool(); // 隐式绑定
Another.greeting; // "Hello World"
Another.count; // 1 （count 不是共享状态）

// JavaScript 并不会（像类那样）自动创建对象的副本。
// 混入模式（无论显式还是隐式）可以用来模拟类的复制行为，但是通常会产生丑陋并且脆弱的语法，
// 比如显式伪多态（OtherObj.methodName.call(this, ...)），这会让代码更加难懂并且难以维护。

// 原型
// [[Prototype]]
// JavaScript 中的对象有一个特殊的[[Prototype]] 内置属性。
var anotherObject = {
    a: 2
};
// 创建一个关联到anotherObject 的对象
var myObject = Object.create(anotherObject); // 它会创建一个对象并把这个对象的[[Prototype]] 关联到指定的对象
myObject.a; // 2, 对于默认的[[Get]] 操作来说，如果无法在对象本身找到需要的属性，就会继续访问对象的[[Prototype]] 链。

// 所有普通的[[Prototype]] 链最终都会指向内置的Object.prototype，它包含JavaScript 中许多通用的功能: 
// .toString() .valueOf() .hasOwnProperty(..) .isPrototypeOf(..)

myObject.foo = "bar";
// 上面语句的整个赋值过程:
// 1. myObject 中有 foo，直接修改。
// 2. myObject 中没有 foo，并且[[Prototype]]原型链上也找不到foo，foo 就会被直接添加到myObject 上。
// 3. foo 既出现在myObject 中也出现在myObject 的[[Prototype]] 链上层， 那么就会发生屏蔽。
//    myObject 中包含的foo 属性会屏蔽原型链上层的所有foo 属性，因为myObject.foo 总是会选择原型链中最底层的foo 属性。
//*4. foo 不直接存在于myObject 中而是存在于原型链上层时:
//  *4.1. 如果在[[Prototype]] 链上层存在foo，并且writable:true， 【那就会直接在myObject 中添加一个名为foo 的新属性，它是屏蔽属性】。
//   4.2. 如果在[[Prototype]] 链上层存在foo，并且writable:false，那么无法修改已有属性或者在myObject 上创建屏蔽属性。
//        如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
//  *4.3. 如果在[[Prototype]] 链上层存在foo 并且它是一个setter，那就一定会调用这个setter。
//       【foo 不会被添加到（或者说屏蔽于）myObject，也不会重新定义foo 这个setter】

// 如果你希望在4.2和4.3情况下也屏蔽foo，那就不能使用= 操作符来赋值，而是使用Object.defineProperty(..)来向myObject 添加foo。

// 4.2情况只读属性会阻止[[Prototype]] 链，下层隐式创建（屏蔽）同名属性。这样做主要是为了模拟类属性的继承。
// 你可以把原型链上层的foo 看作是父类中的属性，它会被myObject 继承（复制），这样一来myObject 中的foo 属性也是只读，所以无法创建。
// 这看起来有点奇怪: myObject 对象竟然会因为其他对象中有一个只读foo 就不能包含foo 属性。
// 更奇怪的是: 这个限制只存在于= 赋值中，使用Object.defineProperty(..) 并不会受到影响。

// 会隐式产生屏蔽，一定要当心，如下:
var anotherObject = {
    a: 2
};
var myObject = Object.create(anotherObject);
anotherObject.a; // 2
myObject.a; // 2
anotherObject.hasOwnProperty("a"); // true
myObject.hasOwnProperty("a"); // false【对比点AAA】

myObject.a++; // 隐式屏蔽！
// myObject.a = myObject.a + 1。因此++ 操作首先会通过[[Prototype]]查找属性a 并从anotherObject.a 获取当前属性值2，
// 然后给这个值加1，接着用[[Put]]将值3 赋给myObject 中【新建的屏蔽属性a】。

anotherObject.a; // 2
myObject.a;// 3
myObject.hasOwnProperty("a"); // true【对比点AAA】，上面的隐式屏蔽会在myObject 中创建 a。

// JavaScript 这种奇怪的“类似类”的行为利用了函数的一种特殊特性：所有的函数默认都会拥有一个
// 名为prototype 的公有并且不可枚举的属性，它会指向另一个对象。
function Foo() {
    // ...
}
var a = new Foo();
Object.getPrototypeOf(a) === Foo.prototype; // true
// 调用new Foo() 时会创建a（具体的4 个步骤参见517 行左右），其中的一步就是给a 一个内部
// 的[[Prototype]] 链接，关联到Foo.prototype 指向的那个对象。

// 继承意味着复制操作，JavaScript（默认）并不会复制对象属性。相反，JavaScript 会在两
// 个对象之间创建一个关联，这样一个对象就可以通过【委托】访问另一个对象的属性和函数。

// “构造函数”
// 记住这一点“constructor 并不表示被构造”。
function Foo() {
    // ...
}
Foo.prototype.constructor === Foo; // true
var a = new Foo();
a.constructor === Foo; // true 本质是: 向上寻找 a.prototype.constructor

// 把.constructor 属性指向Foo 看作是a 对象由Foo“构造”非常容易理解，但这只不过
// 是一种虚假的安全感。a.constructor 只是通过默认的[[Prototype]] 委托指向Foo，这和
// “构造”毫无关系。相反，对于.constructor 的错误理解很容易对你自己产生误导。如下：
function Foo() { /* .. */ }
Foo.prototype = { /* .. */ }; // 创建一个新原型对象
var a1 = new Foo();
a1.constructor === Foo; // false
a1.constructor === Object; // true，最终会委托给委托链顶端的Object.prototype。这个对象有.constructor 属性，指向内置的Object(..) 函数。
// a1.constructor 是一个非常不可靠并且不安全的引用，它们不一定会指向默认的函数引用，通常来说要尽量避免使用这些引用。

// 模仿类的行为
function Foo(name) {
    this.name = name;
}
Foo.prototype.myName = function () {
    return this.name;
};
var a = new Foo("a");
var b = new Foo("b");
a.myName(); // "a"
b.myName(); // "b"

// （原型）继承 => Object.create(..)
// 下面这段代码使用的就是典型的“原型风格”：
function Foo(name) {
    this.name = name;
}
Foo.prototype.myName = function () {
    return this.name;
};
function Bar(name, label) {
    Foo.call(this, name);
    this.label = label;
}

// var childFoo = Object.create(Foo); // 创建子类
Bar.prototype = Object.create(Foo.prototype); // 关联子类。这条语句的意思是：“创建一个新的Bar.prototype 对象并把它关联到Foo.prototype”。
// 注意！现在没有Bar.prototype.constructor 了
// 如果你需要这个属性的话可能需要手动修复一下它

Bar.prototype.myLabel = function () {
    return this.label;
};
var a = new Bar("a", "obj a");
a.myName(); // "a"
a.myLabel(); // "obj a"

// 注意，下面这两种方式是常见的错误做法，实际上它们都存在一些问题：
Bar.prototype = Foo.prototype; // 只是让Bar.prototype 直接引用Foo.prototype 对象，直接使用Foo 就可以了。
Bar.prototype = new Foo(); // 它使用了Foo(..) 的“构造函数调用”，如果函数Foo 有一些副作用（比如写日志、修改状态、注册到其他对象、
// 给this 添加数据属性，等等）的话，就会影响到Bar() 的“后代”，后果不堪设想。

// ES6 之前需要抛弃默认的Bar.prototype的值
Bar.ptototype = Object.create(Foo.prototype);
// ES6 开始可以直接修改现有的Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype);
// 如果忽略掉Object.create(..) 方法带来的轻微性能损失（抛弃的对象需要进行垃圾回收），它实际上比ES6 及其之后的方法更短而且可读性更高。

// 检查“类”关系
// instanceof 方法只能处理对象和函数之间的关系
a instanceof Foo; // 在a 的整条[[Prototype]] 链中是否有指向Foo.prototype 的对象
Foo.prototype.isPrototypeOf(a); // 在a 的整条[[Prototype]] 链中是否出现过Foo.prototype
b.isPrototypeOf(c); // b 是否出现在c 的[[Prototype]] 链中

// 荒谬的代码试图站在“类”的角度使用instanceof 来判断两个对象的关系：用来判断o1 是否关联到（委托）o2 的辅助函数
function isRelatedTo(o1, o2) {
    function F() { }
    F.prototype = o2;
    return o1 instanceof F;
}
var a = {};
var b = Object.create(a);
isRelatedTo(b, a); // true

// Object.create(..) 的本质，ES5 之前的环境中的兼容代码
if (!Object.create) {
    Object.create = function (o) {
        function F() { }
        F.prototype = o;
        return new F();
    };
}

// JavaScript 中的机制有一个核心区别，那就是不会进行复制，对象之间是通过内部的[[Prototype]] 链关联的。

// 行为委托【委托行为意味着某些对象在找不到属性或者方法引用时会把这个请求委托给另一个对象】
// “原型链” JavaScript 中这个机制的本质就是对象之间的关联关系。
// 类设计模式鼓励你在继承时使用方法重写（多态）；在委托行为中则恰好相反：我们会尽量避免在[[Prototype]] 链的不同级别中使用相同的命名。
// 委托替代继承的典型实例：【体会this的作用】
Task = {
    setID: function (ID) { this.id = ID; },
    outputID: function () { console.log(this.id); }
};
// 让XYZ 委托Task
XYZ = Object.create(Task);
XYZ.prepareTask = function (ID, Label) {
    this.setID(ID);
    this.label = Label;
};
XYZ.outputTaskDetails = function () {
    this.outputID();
    console.log(this.label);
};
// ABC = Object.create( Task );
// ABC ... = ...

// 互相委托（禁止），之所以要禁止互相委托，是因为引擎的开发者们发现在设置时检查（并禁止！）一次无限
// 循环引用要更加高效，否则每次从对象中查找属性时都需要进行检查。

function Foo() { }
var a1 = new Foo();
a1; // 注意：Google浏览器输出 Foo {}，Firefox浏览器输出Object {}。之所以有这种细微的差别，是因为Chrome 会动态跟踪并把
// 实际执行构造过程的函数名当作一个内置属性，但是其他浏览器并不会跟踪这些额外的信息。
// 只有使用类风格来编写代码时（就是使用new 调用函数）Chrome 内部的“构造函数名称”跟踪才有意义，使用委托对象关联时这个功能不起任何作用。

// 比较思维模型
//【原型关联风格】
function Foo(who) {
    this.me = who;
}
Foo.prototype.identify = function () {
    return "I am " + this.me;
};
function Bar(who) {
    Foo.call(this, who); // 丑陋的显式伪多态，"子类"调用"父类"中的方法，应该避免这种写法
}
// 让Bar“继承”Foo
Bar.prototype = Object.create(Foo.prototype); //【注意这里不能为Foo，与下面的不同】
Bar.prototype.speak = function () {
    console.log("Hello, " + this.identify() + ".");
};
var b1 = new Bar("b1");
var b2 = new Bar("b2");
b1.speak(); // Hello, I am b1.
b2.speak(); // Hello, I am b2.

//【对象关联风格】
// 下面的代码简洁了许多，我们只是把对象关联起来，并不需要那些既复杂又令人困惑的模仿类的行为（构造函数、原型以及new）。
Foo = {
    init: function (who) {
        this.me = who;
    },
    identify: function () {
        return "I am " + this.me;
    }
};
Bar = Object.create(Foo); //【【注意这里为Foo，与上面的不同】】
Bar.speak = function () {
    console.log("Hello, " + this.identify() + ".");
};
var b1 = Object.create(Bar); // 这里不能使用 new Bar(), 报错:Bar is not a constructor
b1.init("b1");
var b2 = Object.create(Bar);
b2.init("b2");
b1.speak(); // Hello, I am b1. 
b2.speak(); // Hello, I am b2.

//【ES6的class语法糖】
// class 本质仍然是通过[[Prototype]]机制实现的
class Widget {
    constructor(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    }
    render($where) {
        if (this.$elem) {
            this.$elem.css({
                width: this.width + "px",
                height: this.height + "px"
            }).appendTo($where);
        }
    }
}
class Button extends Widget {
    constructor(width, height, label) {
        super(width, height); // super(..)函数棒极了
        this.label = label || "Default";
        this.$elem = $("<button>").text(this.label);
    }
    render($where) {
        super($where); // super(..)函数棒极了
        this.$elem.click(this.onClick.bind(this));
    }
    onClick(evt) {
        console.log("Button '" + this.label + "' clicked!");
    }
}

//【对象关联风格】【提倡】
var Widget = {
    init: function (width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    },
    insert: function ($where) {
        if (this.$elem) {
            this.$elem.css({
                width: this.width + "px",
                height: this.height + "px"
            }).appendTo($where);
        }
    }
};
var Button = Object.create(Widget);
Button.setup = function (width, height, label) {
    // 委托调用
    this.init(width, height);
    this.label = label || "Default";
    this.$elem = $("<button>").text(this.label);
};
Button.build = function ($where) {
    // 委托调用
    this.insert($where);
    this.$elem.click(this.onClick.bind(this));
};
Button.onClick = function (evt) {
    console.log("Button '" + this.label + "' clicked!");
};

// 省略function关键字, 在ES6 中我们可以在任意对象的字面形式中使用简洁方法声明
var LoginController = {
    errors: [],
    getUser() { // 省略function 了！
        // ...
    },
    server(url, data) {
        // ...
    }
};

// 简洁方法的缺陷: 匿名函数，自我引用（递归、事件（解除）绑定，等等）更难
var Foo = {
    bar() { /*..*/ },
    baz: function baz() { /*..*/ }
};
// 去掉语法糖之后的代码如下所示：
var Foo = {
    bar: function () { /*..*/ }, // 匿名函数
    baz: function baz() { /*..*/ }
};

var Foo = {
    bar: function (x) {
        if (x < 10) {
            return Foo.bar(x * 2);
            // 在本例中使用Foo.bar(x*2) 就足够了，但是在许多情况下无法使用这种方法，比如多个对
            // 象通过代理共享函数、使用this 绑定，等等。这种情况下最好的办法就是使用函数对象的
            // name 标识符来进行真正的自我引用，即使用具名函。
        }
        return x;
    },
    baz: function baz(x) {
        if (x < 10) {
            return baz(x * 2); //没有 Foo.
        }
        return x;
    }
};

// 内省 instanceof 
Foo.prototype.something = function () {
    // ...
}
var a1 = new Foo();
if (a1 instanceof Foo) { // 含义是a1 和Foo.prototype（引用的对象）是互相关联的。
    a1.something();
}
// 或“鸭子类型”
if (a1.something) { // 是假设如果a1 通过了测试a1.something 的话，那a1 就一定能调用.something()
    a1.something();
}

// 出于各种各样的原因，我们需要判断一个对象引用是否是Promise，但是判断的方法是检查对象是否有then() 方法。
// 换句话说，如果对象有then() 方法，ES6 的Promise 就会认为这个对象是“可持续”（thenable）的，
// 因此会期望它具有Promise 的所有标准行为。如果有一个不是Promise 但是具有then() 方法的对象，
// 那你千万不要把它用在ES6 的Promise 机制中，否则会出错。

// 推荐的对象关联风格代码，使用isPrototypeOf 或 getPrototypeOf 来内省
var Foo = { /* .. */ };
var Bar = Object.create(Foo);
var b1 = Object.create(Bar);
// 让Foo 和Bar 互相关联
Foo.isPrototypeOf(Bar); // true
Object.getPrototypeOf(Bar) === Foo; // true
// 让b1 关联到Foo 和Bar
Foo.isPrototypeOf(b1); // true
Bar.isPrototypeOf(b1); // true
Object.getPrototypeOf(b1) === Bar; // true

// 用一句话总结本书的第二部分（第4 章至第6 章）：类是一种可选（而不是必须）的设计模式，
// 而且在JavaScript 这样的[[Prototype]] 语言中实现类是很别扭的。

// class
// class 字面语法不能声明属性（只能声明方法）。看起来这是一种限制，但是它会排除
// 掉许多不好的情况，如果没有这种限制的话，原型链末端的“实例”可能会意外地获取
// 其他地方的属性（这些属性隐式被所有“实例”所“共享”）。所以，class 语法实际上可以帮助你避免犯错。

// class 并不会像传统面向类的语言一样在声明时静态复制所有行为。如果你
// （有意或无意）修改或者替换了父“类”中的一个方法，那子“类”和所有实例都会受到
// 影响，因为它们在定义时并没有进行复制，只是使用基于[[Prototype]] 的实时委托
class C {
    constructor() {
        this.num = Math.random();
    }
    rand() {
        console.log("Random: " + this.num);
    }
}
var c1 = new C();
c1.rand(); // "Random: 0.4324299..."
C.prototype.rand = function () {
    console.log("Random: " + Math.round(this.num * 1000));
};
var c2 = new C();
c2.rand(); // "Random: 867"
c1.rand(); // "Random: 432" ——噢！

// class 语法仍然面临意外屏蔽的问题：
class C {
    constructor(id) {
        // 噢，郁闷，我们的id 属性屏蔽了id() 方法
        this.id = id;
    }
    id() {
        console.log("Id: " + id);
    }
}
var c1 = new C("c1");
c1.id(); // TypeError -- c1.id 现在是字符串"c1"
