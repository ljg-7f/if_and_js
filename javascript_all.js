/**
 ****************************** 上卷 ******************************
 **/
//【1】作用域
// 词法作用域
// 函数是JavaScript中最常见的作用域单元。var作用域是以函数 function 为基础单位，不是 { .. }，let是块。
// javaScript是动态&解释执行，不是提前编译，编译结果不能在分布式系统中移植。
// AST：Abstract Syntax Tree，抽象语法树。
// 任何JavaScript代码片段在执行前都要进行编译（通常就在执行前）。

// LHS、RHS: 如果查找的目的是对变量进行赋值，那么就会使用LHS查询；如果目的是获取变量的值，就会使用RHS查询。

// 全局作用域
// 作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见第一个匹配的标识符为止。
// 在多层的嵌套作用域中可以定义同名的标识符，这叫作“遮蔽效应”（内部的标识符“遮蔽”了外部的标识符）
// 全局变量会自动成为全局对象（比如浏览器中的window对象）的属性。通过window.a这种技术可以访问那些被同名变量所遮蔽的【全局变量】。
// 但非全局的变量如果被遮蔽了，无论如何都无法被访问到。
// "严格模式"禁止自动或隐式地创建全局变量。

// eval欺骗作用域【严格模式下不能，eval有自己的作用域，无法修改所在的作用域】:通常被用来执行动态创建的代码。如：eval("var b = 3;")，欺骗词法作用域会导致性能下降。
// with欺骗作用域: 根据你传递给它的对象凭空创建了一个全新的全局作用域。【with已被完全禁止】

// (function foo(){ .. }) 作为函数表达式意味着foo只能在.. 所代表的位置中被访问，如：递归。外部作用域则不行。foo变量名被隐藏在自身中意味着不会污染作用域。
// (function(){ .. })() 等价 (function(){ .. }())

// var【函数\全局，不推荐使用】 let【块】 const【块】
// var 是函数作用域，在该函数内有效。如果在函数外使用var，则相当于全局作用域了。
// let 有隐式的块【如：在if块内】，和显示的块【自己添加{}】。let声明附属于一个新的作用域而不是当前的函数作用域（也不属于全局作用域）。
// try/catch 结构在catch分句中具有块作用域。
{
    console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
    let bar = 2; //使用let进行的声明不会在块作用域中进行提升。
}
{
    console.log(bar); // 正常输出：undefined
    var bar = 2; //使用var会将声明提升，提升是指声明会被视为存在于其所出现的作用域的整个范围内。
}

//【1.1】提升：先有声明，后有赋值
// 所有的声明（变量和函数）都会被“移动”到各自作用域的最顶端，这个过程被称为提升。每个作用域都会进行提升操作，提升到自己作用域的前面，并不是提升到整个程序的最上方。
// let 不会被提升。
// 函数优先：函数声明和变量声明相同时，函数提升优先，忽略其它。后面的函数声明可以覆盖前面的【函数声明相同时】
aaa = 2;
var aaa;
console.log(aaa); // 2
console.log(bbb); // undefined
var bbb = 2;

//【1.2】闭包【内部函数持有外部函数的引用，类似于内部类持有外部类的引用】
function foo() {
    var a = 2;
    function bar() { // bar()依然持有对foo作用域的引用，而这个引用就叫作闭包。
        console.log(a);
    }
    return bar; // 将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用域的引用，无论在何处执行这个函数都会使用闭包。
}
var baz = foo();
baz();

for (var i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i * 1000);
}
// 结果：输出五次6
// 修改1：使用let
for (var i = 1; i <= 5; i++) {
    let j = i; // 不是使用var，否则会输出五次5
    setTimeout(function timer() {
        console.log(j);
    }, j * 1000);
}
// 修改1优化：
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i * 1000);
}
// 修改2：使用var
for (var i = 1; i <= 5; i++) {
    (function () {
        var j = i;
        setTimeout(function timer() {
            console.log(j);
        }, j * 1000);
    })();
}
// 修改2优化：
for (var i = 1; i <= 5; i++) {
    (function (j) {
        setTimeout(function timer() {
            console.log(j);
        }, j * 1000);
    })(i);
}

//【1.3】模块【相当于Java中的类】
// 模块模式需要具备两个必要条件: 1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。
// 2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。
function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join(" ! "));
    }
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}
var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
// 上面的例子就是模块，就是Java中的类。

// 单例模式【就是IIFE，立即调用这个函数并将返回值直接赋值给单例的模块实例标识符foo】
var foo = (function CoolModule() {
    // ...
})();

// ES6会将文件当作独立的模块来处理。一个文件就代表一个类。

// 作用域链是基于调用栈的，而不是代码中的作用域嵌套。

//【2】this
// this 既不指向函数自身也不指向函数的词法作用域。每个函数的this 是在调用时被绑定的，完全取决于函数的调用位置。
// this 在任何情况下都不指向函数的词法作用域。即你不能使用this 来引用一个词法作用域内部的东西。
// this绑定优先级：
// 1）new绑定：var bar = new foo(2); foo中的this与bar绑定。
//    var bar = new obj1.foo( 4 );【与obj1无关，因为new绑定比隐式绑定优先级高】
//    var bar = foo.bind(obj1); var baz = new bar(3); 【与obj1无关，因为new绑定比显示绑定优先级高】
//    obj1.foo.call( obj2 );【与obj1无关，因为显示绑定比隐式绑定优先级高】
// 2）显式绑定：call()、apply()、bind() 都是用来重定义 this 这个对象的【这三个函数的第一个参数都是 this 的指向对象】。bind 返回的是一个新的函数，必须调用它才会被执行。
//    如果第一个参数传入null 或者undefined，则会变为默认绑定。忽略this 绑定时，为避免污染全局对象，一般不传null，而是传递Object.create(null)或{}。
//    可以避免隐式绑定在对象内部包含函数引用，即可以避免 { foo:foo}
// 3）隐式绑定：obj.foo()。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this 绑定到这个上下文对象。因为调用foo() 时this 被绑定到obj，因此this.a 和obj.a 是一样的。
//   隐式绑定丢失：回退到默认绑定。场景1：var bar = obj1.foo; bar();【丢失绑定对象obj1】。场景2：传参 doFoo(obj2.foo);【丢失绑定对象obj2】
//   隐式绑定丢失本质：obj.foo() 与 var bar = obj.foo; bar(); 是不一样的。
// 4）默认绑定：独立函数调用foo()，该方法里有this，在严格模式中该this绑定undefined；非严格模式中，默认绑定才能绑定到全局对象。【这里的严格模式是指foo函数体否处于严格模式，而不是调用的位置】

// 硬绑定：call()、apply()、bind()
// 软绑定：softBind思路如下：【细细品】
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function (obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = [].slice.call(arguments, 1);
        var bound = function () {
            return fn.apply(
                (!this || this === (window || global)) ?
                    obj : this,
                curried.concat.apply(curried, arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    };
}

// 柯里化（部分应用）：预先设置函数的一些参数
var bar = foo.bind(null, "aaa"); // 函数foo有多个入参，这里预先将第一个参数设置为 aaa

//【2.1】箭头函数
// 用更常见的词法作用域取代了传统的this 机制。
// 箭头函数不使用this 的四种标准规则，而是根据外层（函数或者全局）作用域来决定this【即箭头函数会继承外层函数调用的this 绑定】。箭头函数的绑定无法被修改。（new 也不行！）
function foo() {
    return () => {
        console.log(this.a); // 这里的this是调用时foo() 的this
    };
}
// 箭头函数优化了 self = this 的使用。

//【3】对象
// 基本类型：string、boolean、number、undefined
// string 和 String 的instanceof结果是不一样的。
// 属性访问：myObject.a; 键访问：myObject["a"]，它们是等价的。myObject[ttt+"a"]这种形式功能比较强大可以动态设置属性名称。
// 在对象中，属性名永远都是字符串。如果你使用string（字面量）以外的其他值作为属性名，那它首先会被转换为一个字符串。
var myObject = {};
myObject[true] = "foo"; // 属性名先自动转换为"true"
myObject[3] = "bar"; // 属性名先自动转换为"3"
myObject[myObject] = "baz"; // 属性名先自动转换为"[object Object]"
myObject["true"]; // "foo"
myObject["3"]; // "bar"
myObject["[object Object]"]; // "baz"
// 数组的特别之处：属性名"看起来"像一个数字，那它会变成一个数值下标
var myArray = ["foo", 42, "bar"];
myArray["7"] = "baz";
console.log(myArray.length); // 8
console.log(myArray[5]); // undefined
console.log(myArray[7]); // "baz"

// 浅复制
var newObj = Object.assign({}, myObject); // 第一个参数是目标对象，最后返回的也是目标对象
// 深度复制
var newObj = JSON.parse(JSON.stringify(myObject)); // 需要保证对象是JSON安全的

//【3.1】属性描述符：writable（可写）、enumerable（可枚举）和configurable（可配置）。【默认都是true】
// writable:false 即属性值不可改变，相当于const；enumerable:false 该属性不会出现在for..in 循环中；
// configurable:false 不能再修改属性描述符的值，单向操作，无法撤销！【特殊：可以把writable 的状态由true 改为false，但是无法由false 改为true】，也禁止 delete myObject.a 删除这个属性。
var myObject = {};
Object.defineProperty(myObject, "a", {
    value: 2,
    writable: true,
    configurable: true,
    enumerable: true
});

//【3.2】不可变性
// 1)对象常量
// 结合writable:false和configurable:false就可以创建一个真正的常量属性（不可修改、重定义、删除）
// 2)禁止扩展属性
Object.preventExtensions(myObject); // 不能添加属性，但可以删除属性
// 3)密封
Object.seal(myObject); // preventExtensions + configurable:false，不能添加也不能删除，但可以修改属性的值
// 4)冻结
Object.freeze(myObject); // preventExtensions + configurable:false + writable:false，什么也不能修改

//【3.3】访问描述符 set/get
// 给一个属性定义getter、setter后会，JavaScript 会忽略它们的value 和writable 特性。
// 两种形式
// 方式1：
var myObject = {
    get a() { // 属性名 a
        return 2;
    },
    set a(val) {
        this.a = val * 2;
    }
};
myObject.a // 2
// 方式2：
Object.defineProperty(
    myObject,
    "b", // 属性名
    {
        get: function () { return this.a * 2 }, // 描述符
        enumerable: true
    }
);
myObject.b // 4

//【3.4】存在性
// in 和 hasOwnProperty(..) 的区别：
"a" in myObject; // 会查找[[Prototype]] 原型链。【跟是否"可枚举"没有关系，是否"可枚举"只影响 for..in 循环】
myObject.hasOwnProperty("a"); // 只会检查属性是否在myObject 对象中，不检查原型链

// in 注意: 不是检查容器内是否有某个值，而是检查某个属性名是否存在。
4 in [2, 4, 6] // false，这个数组中包含的属性名是0、1、2，没有4。

// 可枚举
// 数组使用for..in不仅会包含所有数值索引，还会包含所有可枚举属性【包括[[Prototype]] 链】。对象使用for..in 循环，数组不适用。
Object.keys(myObject); // 只包含可枚举的属性【不查找原型链】
Object.getOwnPropertyNames(myObject); // 所有属性【不查找原型链】

//【3.5】自定义迭代器
// 给对象定义Symbol.iterator后就可以使用for..of来遍历对象属性值。
// Symbol.iterator是一个函数，该函数返回一个对象，该对象有next属性，next也是一个函数，该函数返回对象有value和done属性。
Object.defineProperty(myObject, Symbol.iterator, {
    enumerable: false,
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
// for..in是遍历属性名
// for..of是遍历属性值
for (var v of myObjectC) {
    console.log('myObjectC:' + v);
}
// 或者：var myObject = {a:2, b:3, [Symbol.iterator]: function() { .. } } 这种形式定义。

//【4】类
// javascript中没有类，只有对象，而类也只不过是一种设计模式而已。
// 其他语言中类的继承表现出来的都是【复制】行为，但javascript使用混入，需要手动复制。javascript中一个对象并不会被复制到其他对象，它们会被关联起来。在其他语言中类表现出来的都是复制行为。
// 混入：这个名字来源于这个过程的另一种解释：Car 中混合了Vehicle 的内容。
//【在javascript中对象就是key-value，把父类(对象)中【独有】的key-value复制到子类(对象)中即可，因为只复制父类【独有】属性，所以间接实现实现了"子类"对"父类"属性的重写】
function mixin(sourceObj, targetObj) { // 不是类的概念了，纯对象处理
    for (var key in sourceObj) {
        if (!(key in targetObj)) { // 只会在不存在的情况下复制，间接实现实现了"子类"对"父类"属性的重写
            targetObj[key] = sourceObj[key];
        }
    }
    return targetObj;
}
// 混入和真正类的差异：由于父子两个对象引用的是同一个函数，因此这种复制（或者说混入）实际上并不能完全模拟面向类的语言中的复制。只是复制引用，如果修改了共享的函数对象，父子两个对象都受影响。

//【5】原型链[[Prototype]] -> Bar.prototype = Object.create(Foo.prototype)【"原型"面向对象风格】。Bar = Object.create( Foo )【"委托"对象关联风格】
// 所有普通对象都有内置的Object.prototype，指向原型链的顶端（比如说全局作用域）。toString()、valueOf() 和其他一些通用的功能都存在于Object.prototype 对象上，因此语言中所有的对象都可以使用它们。

myObject.foo = "bar";
// 上面语句的整个赋值过程:
// 1. myObject 中有 foo，则直接修改。
// 2. myObject 中没有 foo，并且[[Prototype]]原型链上也找不到foo，foo 就会被直接添加到myObject 上。
// 3. foo 既出现在myObject 中也出现在myObject 的[[Prototype]] 链上层， 那么就会发生屏蔽。
//    myObject 中包含的foo 属性会屏蔽原型链上层的所有foo 属性，因为myObject.foo 总是会选择原型链中最底层的foo 属性。
//*4. foo 不直接存在于myObject 中而是存在于原型链上层时:
//  *4.1. 如果在[[Prototype]] 链上层存在foo，并且writable:true， 那就会直接在myObject 中添加一个名为foo 的新属性，它是屏蔽属性。
//   4.2. 如果在[[Prototype]] 链上层存在foo，并且writable:false，那么无法修改已有属性，也不能在myObject 上创建屏蔽属性。
//        如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
//  *4.3. 如果在[[Prototype]] 链上层存在foo 并且它是一个setter，那就一定会调用这个setter。
//        foo 不会被添加到（或者说屏蔽于）myObject，也不会重新定义foo 这个setter。

// 如果你希望在4.2和4.3情况下也屏蔽foo，那就不能使用 = 操作符来赋值，而是使用Object.defineProperty(..)来向 myObject 添加foo。
// 一定要特别注意 = 隐式创建屏蔽属性4.1

// JavaScript 这种奇怪的"类似类"的行为都是利用了函数的这一特殊特性：所有的函数默认都会拥有一个名为prototype 的公有并且不可枚举的属性，它会指向另一个对象。【类似Java中的Object类】

// JavaScript 中的机制有一个核心区别，那就是不会进行复制【而是委托】，对象之间是通过内部的[[Prototype]] 链关联的。
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
Bar.prototype = Object.create(Foo.prototype); // 创建一个新对象并把新对象内部的[[Prototype]]关联到Foo.prototype【缺陷：性能损失，抛弃的对象(Bar创建时会有Bar.prototype默认值)需要进行垃圾回收】
// 等价于：Object.setPrototypeOf( Bar.prototype, Foo.prototype );【直接修改，性能最优】
// 不等价于：Bar.prototype = Foo.prototype;【错误：没有任何意义，直接使用Foo就可以了】
// 不等价于：Bar.prototype = new Foo();【有副作用：会执行Foo()方法】
Bar.prototype.myLabel = function () {
    return this.label;
};
var a = new Bar("a", "obj a");
a.myName(); // "a"
a.myLabel(); // "obj a"

// instanceof isPrototypeOf getPrototypeOf
a instanceof Foo; // 在a 的整条[[Prototype]] 链中是否有指向Foo.prototype 的对象
Foo.prototype.isPrototypeOf(a);
Object.getPrototypeOf(a) === Foo.prototype;
a.__proto__ === Foo.prototype;
b.isPrototypeOf(c); // b 是否出现在c 的[[Prototype]] 链中

// prototype 是函数的属性（用于构造），对象实例没有 prototype 属性，箭头函数也没有 prototype 属性。函数的 prototype 属性是用于构造函数模式。
// __proto__ 是所有对象的属性（用于继承）。【Object.create(null)没有 __proto__ 属性】
// 对于函数（除了箭头函数和某些内置函数）来说，它们有prototype属性，并且这个属性是一个对象（默认情况下有一个constructor属性指向函数本身）。
// 箭头函数不能作为构造函数，所以没有prototype属性。
function Person() { }
var p = new Person();
var q = { age: 18 };
console.log(Person.prototype); // {}
console.log(Person.prototype.constructor); // [Function: Person]
console.log(p.prototype); // undefined
console.log(q.prototype);
console.log(Person.__proto__); // {}
console.log(p.__proto__); // {}
console.log(Person.__proto__.constructor); // [Function: Function]
console.log(p.__proto__.constructor); // [Function: Person]
console.log(p.__proto__ === Person.prototype) // true【*】

// __proto__ 等价于 Object.getPrototypeOf(..)

// Object.create(..) 的本质，ES5 之前的环境中的兼容代码
if (!Object.create) {
    Object.create = function (o) {
        function F() { }
        F.prototype = o;
        return new F();
    };
}

// a1.constructor 是一个非常不可靠并且不安全的引用，它们不一定会指向默认的函数引用，通常来说要尽量避免使用这些引用。
function Foo() { /* .. */ }
Foo.prototype = { /* .. */ }; // 创建一个新原型对象
var a1 = new Foo();
a1.constructor === Foo; // false
a1.constructor === Object; // true，最终会委托给委托链顶端的Object.prototype。这个对象有.constructor 属性，指向内置的Object(..) 函数。


//【6】委托【用对象关联 代替 面向类】【this的使用场景】
// JavaScript 中[[Prototype]]原型链机制的本质就是对象之间的关联关系。
// id 和label 数据成员都是直接存储在XYZ("子类") 上（而不是Task"父类"）。通常来说，在[[Prototype]] 委托中最好把状态保存在委托者（XYZ、ABC）而不是委托目标（Task）上。
//【不推荐使用】【"原型"面向对象风格】Bar.prototype = Object.create(Foo.prototype)
// 1.方法父类只定义属性；
// 2.通过Foo.prototype.identify定义父类方法；
// 3.方法子类通过Foo.call(this，..)调用方法父类
// 4.通过Bar.prototype = Object.create(Foo.prototype)建立父子关系；
// 5.通过Bar.prototype.speak定义子类属性和方法；
// 6.通过new创建子类对象实例。
function Foo(who) {
    this.me = who;
}
Foo.prototype.identify = function () {
    return "I am " + this.me;
};
function Bar(who) {
    Foo.call(this, who); // 关键点
}
Bar.prototype = Object.create(Foo.prototype); //【"原型"面向对象风格】：this + 函数 + prototype + Object.create + call() + new
Bar.prototype.speak = function () {
    console.log("Hello, " + this.identify() + ".");
};
var b1 = new Bar("b1");
var b2 = new Bar("b2");
b1.speak();
b2.speak();
//【推荐】【"委托"对象关联风格】Bar = Object.create( Foo )
// 1.创建父对象，属性和方法都封装在对象里
// 2.通过Bar = Object.create(Foo)创建子对象
// 3.通过Bar.speak定义子类属性和方法
// 4.通过b1 = Object.create(Bar)创建子对象实例
Foo = {
    init: function (who) {
        this.me = who;
    },
    identify: function () {
        return "I am " + this.me;
    }
};
Bar = Object.create(Foo); //【"委托"对象关联风格】：this + 只关注对象之间的关联，没有new而是Object.create
Bar.speak = function () {
    console.log("Hello, " + this.identify() + ".");
};
var b1 = Object.create(Bar);
b1.init("b1");
var b2 = Object.create(Bar);
b2.init("b2");
b1.speak();
b2.speak();

// class
// class 基本上只是现有[[Prototype]]（委托！）机制的一种语法糖。
// class 语法无法定义类成员属性，只能声明方法。
// javascript class 的缺陷：并不会像传统面向类的语言一样在声明时静态复制所有行为。如果你（有意或无意）修改或者替换了父“类”中的一个方法，
// 那子“类”和所有实例都会受到影响，因为它们在定义时并没有进行复制，只是使用基于[[Prototype]] 的实时委托。

// super 并不是动态绑定的，它会在声明时“静态”绑定。





/**
 ****************************** 中卷 ******************************
 **/
//【1】类型
// typeof 运算符总是会返回一个字符串
typeof undefined === "undefined"; // true
typeof true === "boolean"; // true
typeof 42 === "number"; // true
typeof "42" === "string"; // true
typeof { life: 42 } === "object"; // true
typeof Symbol() === "symbol"; // true，ES6中新加入的类型
typeof function a() { /* .. */ } === "function"; // true

// 特殊的 null
typeof null === "object"; // true
var a = null;
(!a && typeof a === "object"); // true，必须使用复合条件才能准确检测 null 值的类型

functionName.length; // 声明的参数个数

// JavaScript 中的变量是没有类型的，只有值才有。变量可以随时持有任何类型的值。
if (typeof FeatureXYZ !== "undefined") {
    // typeof 的安全防范机制检查，判断变量是否声明
}

// javascript中数组可以容纳任何类型的值，可以是字符串、数字、对象（object），甚至是其他数组。
// delete arr[0]; 删除数组的值后，arr[0]变为 undefined，数组的length不变。

// 将类数组转换为真正的数据，即将[Arguments] { '0': 'bar', '1': 'baz' } 转换为 [ 'bar', 'baz' ]
// Array.prototype.slice.call( arguments ) 等价于 Array.from( arguments )


// 无效语法：
// 42.toFixed( 3 ); // SyntaxError：42. 会被优先识别为数字常量的一部分，然后才是对象属性访问运算符。
// 下面的语法都有效：
(42).toFixed(3); // "42.000"
0.42.toFixed(3); // "0.420"
42..toFixed(3); // "42.000" //

// 特殊值：NaN、+Infinity、-Infinity、-0

0.1 + 0.2 === 0.3 // false
Number.isInteger(42.000); // true
console.log(2 / "foo") // NaN
console.log(NaN == NaN) // false，NaN 是一个特殊值，它和自身不相等，是唯一一个非自反
console.log(NaN != NaN) // true

// Object.is(..) 来判断两个值是否绝对相等
Object.is(a, NaN);
Object.is(b, -0);
// Object.is(..)的本质：
if (!Object.is) {
    Object.is = function (v1, v2) {
        // 判断是否是-0
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2; // 原理：1 / 0 = Infinity；1 / -0 = -Infinity
        }
        // 判断是否是NaN
        if (v1 !== v1) {
            return v2 !== v2; // 原理：NaN是唯一一个和自身不想等的值
        }
        // 其他情况
        return v1 === v2;
    };
}

var e = new Function("a", "return a * 2;"); // 可动态创建函数

//【2】强制类型转换
// 假值：undefined、null、false、+0、-0、NaN、""

// 一元运算符+ 的另一个常见用途是将日期（Date）对象强制类型转换为数字，返回结果为Unix 时间戳，以微秒为单位。
var timestamp = +new Date(); // 推荐使用：Date.now();

// ~：如果indexOf(..) 返回-1，~ 将其转换为假值0。原理：~x 大致等同于 -(x+1)
if (~a.indexOf("lo")) { // true
    // 找到匹配！
}

parseInt('42px'); // 42，解析按从左到右的顺序，如果遇到非数字字符就停止。

// 使用 !! 来进行显式强制类型转
var a = 0;
var b = "0";
var c = "";
!!a; // false
!!b; // true
!!c; // false

var a = {
    valueOf: function () { return 42; },
    toString: function () { return 4; }
};
a + ""; // "42"，会对a 调用valueOf() 方法
String(a); // "4"

// && 和|| 运算符的返回值并不一定是布尔类型，而是两个操作数其中一个的值。
var a = 42;
var b = "abc";
var c = null;
a || b; // 42
a && b; // "abc"
c || b; // "abc"
c && b; // null

a && foo(); // a为true时才会执行foo()【这里 && 称为：守护运算符】

// == 允许在相等比较中进行强制类型转换，而=== 不允许
// == 隐式转换规则：1）string会转换为number；2）boolean会转换为number；3）对象会调用ToPrimitive
// 1)
var a = 42;
var b = "42";
a == b; // true
// 2)
var a = "42";
var b = true;
var c = false;
a == b; // false；最后变成42 == 1
a == c; // false；最后变成42 == 0
// 3）
var a = 42;
var b = [42];
a == b; // true；[ 42 ] 首先调用ToPromitive 抽象操作返回"42"，变成"42" == 42，然后又变成42 == 42，最后二者相等。

// if (a == null) 等价于 if (a === undefined || a === null)

// 难以理解的：
"0" == false; // true -- 晕！
false == 0; // true -- 晕！
false == ""; // true -- 晕！
false == []; // true -- 晕！
"" == 0; // true -- 晕！
"" == []; // true -- 晕！
0 == []; // true -- 晕！
[] == ![]; // true -- 晕！
2 == [2]; // true
"" == [null]; // true
0 == "\n"; // true
// 经验：
// 1）如果两边的值中有true 或者false，千万不要使用==；
// 2）如果两边的值中有[]、"" 或者0，尽量不要使用==。
// 这时最好用=== 来避免不经意的强制类型转换。

var { a, b } = getData(); // 解构赋值

// HTML 页面中的内容也会产生全局变量

//【3】异步【异步是关于现在和将来的时间间隙，而并行是关于能够同时发生的事情】
// 同步等待会锁定浏览器UI（按钮、菜单、滚动条等），并阻塞所有的用户交互。
// 两个连续的setTimeout(..0) 调用不能保证会严格按照调用顺序处理，所以各种情况都有可能出现，比如定时器漂移，在这种情况下，这些事件的顺序就不可预测。
// setTimeout(..) 并没有把你的回调函数挂在事件循环队列中。它所做的是设定一个定时器。当定时器到时后，环境会把你的回调函数放在事件循环中，
// 这样，在未来某个时刻的tick 会摘下并执行这个回调。setTimeout(..) 定时器的精度可能不高。大体说来，只能确保你的回调函数不会在指定的时间间隔之前运行，
// 但可能会在那个时刻运行，也可能在那之后运行，要根据事件队列的状态而定。

// 并发是指两个或多个事件链随时间发展交替执行，以至于从更高的层次来看，就像是同时在运行（尽管在任意时刻只处理一个事件）。

//【3.1】回调存在的问题【缺乏顺序性和可信任性】
// 嵌套回调 -> 链式回调。【大脑对于事情的计划方式是线性的、阻塞的、单线程的语义，但是回调表达异步流程的方式是非线性的、非顺序的，这使得正确推导这样的代码难度很大】
// 信任问题：回调最大的问题是控制反转，它会导致信任链的完全断裂。【控制反转：把自己程序一部分的执行控制交给某个第三方】【promise将许多安全校验进行封装】
// 调用过早：统一都异步处理
// 调用过晚：Promise 创建对象调用resolve(..) 或reject(..) 时，这个Promise 的then(..) 注册的回调在下一个异步事件点上一定会被触发。
// 回调未调用：
// 调用次数过少或过多：只会接受第一次决议，有标记位控制。
// 吞掉错误或异常：1）如果在Promise 的创建回调过程中出现异常，这个异常就会被捕捉并出发reject(..)；2）then(..) 注册的回调中出现异常，也会被捕捉并出发reject(..)

// 【*】promise中出现异常后，会一直向后寻找reject(..)处理，如果没有reject(..)处理，则抛出全局异常；如果有reject(..)处理了，那之后then就会回到完成状态，执行resolve(..)
// 因为：如果没有定义reject(..)，会有默认实现 (err: any) => { throw err; }; 重新抛出异常。
// 即：调用then(..) 时的完成处理函数或拒绝处理函数如果抛出异常，都会导致（链中的）下一个promise 因这个异常而立即被拒绝。
// 错误可以沿着Promise 链传播下去，直到遇到显式定义的拒绝处理函数。

// 永远异步调用回调，即使就在事件循环的下一轮，这样，所有回调就都是可预测的异步调用了。
// 永远异步执行
function asyncify(fn) {
    var orig_fn = fn,
        intv = setTimeout(function () {
            intv = null;
            if (fn) fn();
        }, 0);
    fn = null;
    return function () {
        // 触发太快，在定时器intv触发指示异步转换发生之前？
        if (intv) {
            fn = orig_fn.bind.apply(
                orig_fn,
                // 把封装器的this添加到bind(..)调用的参数中，
                // 以及克里化（currying）所有传入参数
                [this].concat([].slice.call(arguments))
            );
        }
        // 已经是异步
        else {
            // 调用原来的函数
            orig_fn.apply(this, arguments);
        }
    };
}

asyncify(result)();

//【3.2】Promise【一种异步模式，就是一个异步工具类，是一种封装和组合异步值的易于复用的机制】【只是一个语法糖，解决回调问题，以顺序的方式表达异步流】【作任务队列的应用】
// Promise构造函数中的回调是同步的或立刻调用的。
// （一旦决议）一直保持其决议结果（完成或拒绝）不变，可以按照需要多次查看。一旦p 决议，不论是现在还是将来，下一个步骤总是相同的。

// 如果使用多个参数调用resovle(..) 或者reject(..)，第一个参数之后的所有参数都会被默默忽略。

// then(..)的两个主要作用：1）回调then里面定义的onfulfilled()或onrejected()方法；2）出发下一个promise的resolve()或reject()方法。
// 使用 queueMicrotask(..) 来实现得异步操作。

//如何判断是Promise类型
// 鸭子类型：根据一个值的形态（具有哪些属性）对这个值的类型做出一些假定。识别Promise（或者行为类似于Promise 的东西）就是定义某种称为thenable 的东西，
// 将其定义为任何具有then(..) 方法的对象和函数。我们认为，任何这样的值就是Promise 一致的thenable。
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

// Object.prototype.then = function(){};
// Array.prototype.then = function(){};
var v1 = { hello: "world" };
var v2 = ["Hello", "World"];
// v1 和v2 都会被认作thenable。

// 为什么不能用 p instanceof Promise 来检查：
// 1）Promise 值可能是从其他浏览器窗口（iframe 等）接收到的。这个浏览器窗口自己的Promise 可能和当前窗口/frame 的不同，因此这样的检查无法识别Promise实例。
const mainWindowPromise = new Promise(() => { });
// iframe窗口
const iframeWindow = document.querySelector('iframe').contentWindow;
const iframePromise = new iframeWindow.Promise(() => { });
// 使用instanceof检查
console.log(mainWindowPromise instanceof Promise); // true
console.log(iframePromise instanceof Promise); // false
console.log(iframePromise instanceof iframeWindow.Promise); // true
// 2）库或框架可能会选择实现自己的Promise，而不是使用原生ES6 Promise 实现。

// 你永远都不应该依赖于不同Promise 间回调的顺序和调度。
// Promise 创建代码试图调用resolve(..) 或reject(..) 多次，或者试图两者都调用，那么这个Promise 将只会接受第一次决议，并默默地忽略任何后续调用。
// 由于Promise 只能被决议一次，所以任何通过then(..) 注册的（每个）回调就只会被调用一次。

// Promise.resolve(..)【最好都用它封装一层】
// 如果向Promise.resolve(..) 传递一个真正的Promise，就只会返回同一个promise：
var p1 = Promise.resolve(42);
var p2 = Promise.resolve(p1);
p1 === p2; // true
// 如果向Promise.resolve(..) 传递了一个非Promise 的thenable 值，前者就会试图展开这个值，而且展开过程会持续到提取出一个具体的非类Promise 的最终值。
// Promise.resolve(..) 可以接受任何thenable，将其解封为它的非thenable 值。从Promise.resolve(..) 得到的是一个真正的Promise，是一个可以信任的值。
// 所以通过Promise.resolve(..) 过滤来获得可信任性完全没有坏处。

var rejectedTh = {
    then: function (resolved, rejected) {
        rejected("Oops");
    }
};
var rejectedPr = Promise.resolve(rejectedTh);
// 或
var rejectedPr2 = new Promise(function (resolve, reject) {
    // 用一个被拒绝的promise完成这个promise
    resolve(Promise.reject("Oops")); // Promise(..) 构造器的第一个参数回调会展开thenable（和Promise.resolve(..) 一样）或真正的Promise；第二个参数reject(..) 不会像进行展开
});
// Promise.resolve(..) 会将传入的真正Promise 直接返回，对传入的thenable 则会展开。如果这个thenable 展开得到一个拒绝状态，那么从Promise.resolve(..) 
// 返回的Promise 实际上就是这同一个拒绝状态。【Promise.resolve(..)返回的可能是完成或决绝】
// reject(..) 不会像resolve(..) 一样进行展开。如果向reject(..) 传入一个Promise/thenable 值，它会把这个值原封不动地设置为拒绝理由。【reject()返回的一定是决绝】

// 默认拒绝处理函数只是把错误重新抛出，这使得错误可以继续沿着Promise 链传播下去，直到遇到显式定义的拒绝处理函数。
// 默认完成处理函数只是把接收到的任何传入值传递给下一个步骤（Promise）而已。

// try..catch 只能是同步的，无法用于异步代码模式：
try {
    setTimeout(() => {
        aaa.ttterror();
    }, 1000);
} catch (e) { // 无效
    console.log("err = " + e)
}

// p.catch( rejected ) 等价于 p.then( null, rejected )

// Promise api 使用
Promise.all([]); // 如果这些promise 中有任何一个被拒绝的话，主Promise.all([ .. ])promise 就会立即被拒绝，并丢弃来自其他所有promise 的全部结果。
Promise.race([]); // 一旦有任何一个Promise 决议为完成，Promise.race([ .. ])就会完成；一旦有任何一个Promise 决议为拒绝，它就会拒绝。
// all(..)异常时和race(..)，它们里面各自的promise的resolve(..)或reject(..)回调是不影响调用的，影响的只是向下传递的 then(..) 的调用。【每个promise都是各自独立的】

// 超时竞赛
Promise.race([
    foo(),
    timeoutPromise(3000) // 给它3秒钟
])
Promise.any([]); // 会忽略拒绝，只需要完成一个而不是全部。
Promise.first([]); // 类似于与any([ .. ]) 的竞争，只要第一个Promise 完成，它就会忽略后续的任何拒绝和完成。
Promise.last([]); // 于first([ .. ])，但却是只有最后一个完成胜出。

// 异步的map(..) 工具的demo：它接收一个数组的值（可以是Promise 或其他任何值），外加要在每个值上运行一个函数（任务）作为参数。
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

//【3.3】Promise的局限性
// 1.如果promise链中间进行了自身的错误处理（可能以隐藏或抽象的不可见的方式），那放在最后的p.catch( handleErrors )就不会得到通知。
// 2.单一值。体会一下下面 展开/ 传递参数 的技巧：
var fn = Function.apply.bind(
    function (x, y) {
        console.log(x, y);
    }, null
);
fn([12, 45])
// 3.惯性。把需要回调的函数封装为支持Promise 的函数
if (!Promise.wrap) {
    Promise.wrap = function (fn) {
        return function () {
            var args = [].slice.call(arguments); // arguments = [object Arguments]; args = 11,31
            return new Promise(function (resolve, reject) {
                fn.apply(
                    null,
                    args.concat(function (err, v) { // 在数组中增加一个元素：函数
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(v);
                        }
                    })
                );
            });
        };
    };
}
// 4.无法取消的Promise。单独的一个Promise 并不是一个真正的流程控制机制，取消机制意义不大。
// 但集合在一起的Promise 构成的链，就是一个流程控制的表达，因此将取消定义在这个抽象层次上是合适的。
// 5.性能。Promise 使所有一切都成为异步的了，即有一些立即（同步）完成的步骤仍然会延迟到任务的下一步。
// 这意味着一个Promise 任务序列可能比完全通过回调连接的同样的任务序列运行得稍慢一点。


//【4】生成器 yield【function *foo(x) { .. }】 迭代器[Symbol.iterator]
// yield .. 和next(..) 这一对组合起来，在生成器的执行过程中构成了一个双向消息传递系统。
// [ .. ] 语法被称为计算属性名：指定一个表达式并用这个表达式的结果作为属性的名称。
function* foo(x) {
    var y = x * (yield "Hello"); // <-- yield一个值！
    return y;
}
var it = foo(6);
var res = it.next(); // 第一个next()启动，并不传入任何东西。但它会有 yield 的返回值
console.log(res.value); // "Hello"
res = it.next(7); // 向等待的yield传入7
console.log(res.value); // 42

// 生成器本身并不是iterable，但生成器的迭代器也有一个Symbol.iterator 函数，基本上这个函数做的就是return this，
// 即生成器的迭代器也是一个iterable ！

// 生成器yield 暂停的特性意味着我们不仅能够从异步函数调用得到看似同步的返回值，还可以同步捕获来自这些异步函数调用的异常！【it.throw( err ) 或 yield err】

// ES6 中最完美的世界就是生成器（看似同步的异步代码）和Promise（可信任可组合）的结合。

// async 与await的本质：对Promise + yield + next() 的封装，不用再手动调用it.next()来执行迭代器了。

//【4.1】消息委托
function* foo() {
    console.log("inside *foo()1:", yield "B");
    console.log("inside *foo()2:", yield "C");
    return "D";
}
function* bar() {
    console.log("inside *bar()1:", yield "A");
    // yield委托！
    console.log("inside *bar()2:", yield* foo());
    console.log("inside *bar()3:", yield "E");
    return "F";
}
// yield 委托甚至并不要求必须转到另一个生成器，它可以转到一个非生成器的一般iterable。
console.log("inside *bar():", yield * ["B", "C", "D"]);


//【5】程序性能
//【5.1】Web Worker
// 是浏览器的功能，JavaScript 当前并没有任何支持多线程执行的功能。【即使用打开多个页面的方式来实现并发】
// Worker 之间以及它们和主程序之间，不会共享任何作用域或资源，而是通过一个基本的事件消息机制相互联系。
// 专用Worker【此外还有在线Worker】
var w1 = new Worker("http://some.url.1/mycoolworker.js"); // ！），这个js文件将被加载到一个Worker 中，然后浏览器启动一个独立的线程程序运行。
w1.addEventListener("message", function (evt) {
    // evt.data 侦听事件
});
w1.postMessage("something cool to say"); // 发送事件给Worker
// 在这个Worker 内部，收发消息是完全对称的，也是使用addEventListener和postMessage。专用Worker 和创建它的程序之间是一对一的关系。
w1.terminate() // 终止Worker。突然终止Worker 线程不会给它任何机会完成它的工作或者清理任何资源。这就类似于通过关闭浏览器标签页来关闭页面。
// Web Worker 通常应用于：1）处理密集型数学计算；2）大数据集排序；3）数据处理（压缩、音频分析、图像处理等）；4）高流量网络通信

// 在Worker内部加载额外的JavaScript 脚本，加载是同步的。
importScripts("foo.js", "bar.js");

// Transferable 对象，适用于大数据集。【Uint8Array这样的带类型的数组就是Transferable类型的】
// Transferable 传递的是对象所有权的转移，数据本身并没有移动。一旦你把对象传递到一个Worker 中，在原来的位置上，它就变为空的或者是不可访问的，
// 这样就消除了多线程编程作用域共享带来的混乱。当然，所有权传递是可以双向进行的。

// 共享Workerr【适用于：同一个页面的多个tab】
// port：因为共享Worker 可以与站点的多个程序实例或多个页面连接，所以这个Worker 需要通过某种方式来得知消息来自于哪个程序。这个唯一标识符称为端口（port）。
var w2 = new SharedWorker("http://some.url.1/mycoolworker.js");
w2.port.addEventListener("message", handleMessages);
w2.port.postMessage("something cool");
w2.port.start(); // 端口连接必须要初始化
// 在共享Worker内部，"connect"这个事件为这个特定的连接提供了端口对象
addEventListener("connect", function (evt) {
    // 这个连接分配的端口
    var port = evt.ports[0];
    port.addEventListener("message", function (evt) {
        // ..
        port.postMessage();
        // ..
    });
    // 初始化端口连接
    port.start();
});

//【5.2】SIMD 单指令多数据，是一种数据并行。Web Worker 是任务并行【适用于：数据密集型的应用（信号分析、关于图形的矩阵运算）的并行数学处理】
// 通过SIMD，线程不再提供并行。取而代之的是，现代CPU 通过数字“向量”（特定类型的数组），以及可以在所有这些数字上并行操作的指令，来提供SIMD 功能。
// 这是利用低级指令级并行的底层运算。
var v1 = SIMD.float32x4(3.14159, 21.0, 32.3, 55.55);
var v2 = SIMD.float32x4(2.1, 3.2, 4.3, 5.4);
SIMD.float32x4.mul(v1, v2);

//【5.3】asm.js【Assembly汇编语言】设计目的：让 C/C++ 等语言能通过编译器（如 Emscripten）高效地编译成 JavaScript，在 Web 浏览器中接近原生速度运行。
// asm.js 是向后兼容的，可以在旧引擎上运行，只是没有优化而已。
// 1.静态类型化 
// 通过一套类型标注规则，强制代码使用静态类型，这种明确的标注让 JavaScript 引擎在代码首次加载时就能确定所有变量的类型，从而可以进行激进的提前编译AOT
//（Ahead-Of-Time Compilation），生成高效的机器码，而无需在运行时反复进行类型检查和优化。
var a = 42;
var b = a | 0; // b 应该总是被当作32 位整型来处理，这样就可以省略强制类型转换追踪。
// 2.内存模型
// asm.js 代码在一个单独的“堆”上操作。这个“堆”通常是一个巨大的 ArrayBuffer，称为 asm.js 模块的堆。

// ams.js是WebAssembly（WASM） 设计的前身。WASM 是一种真正的二进制格式，文件更小，加载和编译更快。WASM 提供了更接近原生的性能。