// 数组
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// 元组：元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
let x: [string, number] = ["hello", 10];

// enum 枚举，默认情况下，从0开始为元素编号。也可以手动指定不从0开始。
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
let colorName: string = Color[2]; // Color[2] is Blue

// any 任意值
// any 类型的对象可以调用方法，但Object类型的不可以，会报错。
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
// prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.

// Never 类型表示的是那些永不存在的值的类型，是任何类型的子类型，也可以赋值给任何类型。然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使any也不可以赋值给never。
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 类型断言，类似于类型转换，它没有运行时的影响，只是在编译阶段起作用。
// 方式1：<string>
let someValue: any = "this is a string";
// let strLength: number = (<string>someValue).length;
// 方式2：as
let strLength2: number = (someValue as string).length;

let o = {
  a: "foo",
  b: 12,
  c: "bar",
};
let { a, b } = o;
// let { a, b }: { a: string; b: number } = o; // 指定类型解构
// let { a, ...passthrough } = o;

{
  // 出现在展开对象后面的属性会覆盖前面的属性。
  let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
  let search = { ...defaults, food: "rich" };
}
// 对象展开还有其它一些意想不到的限制。 首先，它仅包含对象自身的可枚举属性。大体上是说当你展开一个对象实例时，你会丢失其方法：
// 其次，TypeScript编译器不允许展开泛型函数上的类型参数。
class C {
  // 经测试：类会丢失方法，而纯对象不会丢失，{ a:12, m(){} } 不会丢失
  p = 12;
  m() {}
}
let cc = new C();
let clone = { ...cc };
clone.p; // ok
// clone.m(); // error!

//
//
//
// 接口
// TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。【结构类型是一种只使用其成员来描述类型的方式】
// 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
// 类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以，也可以包含其它属性。
interface LabelledValue {
  label: string;
  color?: string; // 可选属性
  readonly x: number; // 只读属性，只能在对象创建时赋值一次。readonly vs const：做为变量使用的话用const，若做为属性则使用readonly。
  funcI: (source: string, subString: string) => boolean; // 函数类型
  readonly [index: number]: string; // 索引签名
}

// 类是具有两个类型的：静态部分的类型和实例的类型。当一个类实现了一个接口时，只对其实例部分进行类型检查。constructor存在于类的静态部分，不在检查的范围内。
// 用构造器签名new去定义一个接口
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick(): any;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number,
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}
// 提示：传入的第一个参是DigitalClock类名，代表的是类的构造函数类型（静态端）。
// 当你传入 DigitalClock 时，你传递的是类本身（构造函数），而不是类的实例。这个构造函数完全符合 ClockConstructor 接口的定义。
// 这种设计模式称为工厂函数模式，用于分离构造函数类型和实例类型的检查。
let digital = createClock(DigitalClock, 12, 17); // 注意：createClock第一个参数的类型是ClockConstructor，即构造函数的类型，而不是实例的类型。

// 接口可以多继承
// 接口继承类，当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。
// 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

//
//
//
// 类
// 引用任何一个类成员的时候都要用this。
// 继承，在子类构造函数里访问this的属性之前，一定要先调用super()。
// 在TypeScript里，成员都默认为public。
class Animal {
  private name?: string; // javascript中使用 #count = 0; 表示私有
  protected age?: number;
  readonly numberOfLegs: number = 8; // 读属性必须在声明时或构造函数里被初始化
  // 参数属性：参数属性通过给构造函数参数添加一个访问限定符来声明，private、protected、public
  constructor(private nameT: string) {}
  // private 和 protected 可以修饰 constructor，这意味着这个类不能在包含它的类外被实例化，但是能被继承。
}
class Rhino extends Animal {}
let animal: Animal = new Animal("Goat");
let r = new Rhino("Rhino");
// r.name; // 错误：属性“name”为私有属性，只能在类“Animal”中访问。
// r.age; // 错误：属性“age”受保护，只能在类“Animal”及其子类中访问。
// protected 与Java中的区别，r.age 在TS中是不能访问，在Java中是可以访问的。

let ani: typeof Animal = Animal; // 注意这里的类型是 typeof Animal，意思是取Animal类的类型，而不是实例的类型。
// 或者更确切的说，”告诉我Animal标识符的类型”，也就是构造函数的类型。【这个类型包含了类的所有静态成员和构造函数】。
let animal2: Animal = new ani("Goat2");

// 函数类型
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number,
): number {
  return x + y;
};

// 可选参数 ? ，可选参数必须跟在必须参数后面。
function buildName(firstName: string, lastName?: string) {}
// 默认参数
function buildName2(firstName: string, lastName = "") {}

// 支持函数重载

//
//
//
// 泛型，无法创建泛型枚举和泛型命名空间。
function identity<T>(arg: T): T {
  return arg;
}
let output = identity<string>("myString");
let output2 = identity("myString"); // 类型推论 – 即编译器会根据传入的参数自动地帮助我们确定T的类型

function loggingIdentity<T>(arg: Array<T>): Array<T> {
  return arg;
}

// 泛型类型
let myIdentity: <U>(arg: U) => U = identity;
let myIdentity2: { <T>(arg: T): T } = identity;

// 泛型接口
interface GenericIdentityFn {
  <T>(arg: T): T; // 对象字面量
}
// 或
interface GenericIdentityFn2<T> {
  (arg: T): T;
}

// 类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

// 泛型约束【javascript接口是「鸭式辨型法」：只要相应的属性存在并且类型也是对的就可以，也可以包含其它属性】
interface Lengthwise {
  length: number;
}

function loggingIdentity2<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// 调用，不一定是继承 Lengthwise 接口，只要有相应的属性就ok啦
loggingIdentity2({ length: 10, value: 3 });

// 在泛型约束中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

// 在泛型里使用类类型
function create<T>(c: { new (): T }): T {
  return new c();
}

// 常数枚举，只能使用常数枚举表达式并且不同于常规的枚举的是它们在编译阶段会被删除。
const enum Ttt {
  A = 1,
  B = A * 2,
}
let aa = Ttt.A;
// let nameOfA = Ttt[aa]; // A const enum member can only be accessed using a string literal

// 联合数组类型
let arrTt: (string | number)[] = [23, 43, "555", "ddd"];

// 结构性子类型，结构类型是一种只使用其成员来描述类型的方式。
interface Named {
  name?: string;
}
class Person {
  name?: string;
}
let p: Named;
p = new Person(); // OK, because of structural typing
// 解释：在使用基于名义类型的语言，比如C#或Java中，这段代码会报错，因为Person类没有明确说明其实现了Named接口。
// 但，TypeScript的结构性子类型是根据JavaScript代码的典型写法来设计的。 因为JavaScript里广泛地使用匿名对象，
// 例如函数表达式和对象字面量，所以使用结构类型系统来描述这些类型比使用名义类型系统更好。

// 类型兼容性
// 1）上面的结构类型
// 2）枚举
enum Status {
  Ready,
  Waiting,
}
enum Color2 {
  Red,
  Blue,
  Green,
}

let status = Status.Ready;
// status = Color2.Green;  //error

//
//
//
// 高级类型
// 交叉类型：Person & Serializable & Loggable，这个类型的对象同时拥有了这三种类型的成员。
function extend<T, U>(first: T, second: U): T & U {
  let result = {} as T & U; // 或let result = <T & U>{};
  return result;
}
// 联合类型：number | string | boolean，表示一个值可以是number，string，或boolean。
function padLeft(value: string, padding: string | number) {
  // ...
}

// 用户自定义的类型保护，它的返回值是一个类型谓词，在这个例子里，pet is Fish就是类型谓词。
// function isFish(pet: Fish | Bird): pet is Fish {
//   return (<Fish>pet).swim !== undefined;
// }
function isNumber(x: any): x is number {
  return typeof x === "number"; // 可以直接使用 typeof
}

// 此外还有 instanceof

// 默认情况下，类型检查器认为null与undefined可以赋值给任何类型。 null与undefined是所有其它类型的一个有效值。
// --strictNullChecks标记可以解决此错误：当你声明一个变量时，它不会自动地包含null或undefined。
// 注意：TypeScript会把null和undefined区别对待。 string | null，string | undefined和string | undefined | null是不同的类型。
let s = "foo";
// s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以
// sn = undefined; // error, 'undefined'不能赋值给'string | null'

// 选参数或可选属性 y?: number，会被自动地加上| undefined，不能传入 null。
function f(x: number, y?: number) {
  return x + (y || 0);
}
f(1, undefined);
// f(1, null); // error, 'null' is not assignable to 'number | undefined'

// 类型别名
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
type Container<T> = { value: T };
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};
// 字符串字面量类型允许你指定字符串必须的固定值，可以模拟枚举
type Easing = "ease-in" | "ease-out" | "ease-in-out";

// 索引类型
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map((n) => o[n]); // 编译器会检查name是否真的是Person的一个属性
}
// 索引类型查询操作符：keyof T
let personProps: keyof Person; // 'name' | 'age'
// keyof Person是完全可以与'name' | 'age'互相替换的，替换成【字符串字面量类型】
// 索引访问操作符：T[K]
function getProperty2<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}
interface PersonT {
  name: string;
  age: number;
}
let person: PersonT = {
  name: "Jarid",
  age: 35,
};
let name: string = getProperty2(person, "name"); // 动态返回类型
let age: number = getProperty2(person, "age"); // 动态返回类型
// let unknown = getProperty2(person, "unknown"); // error, 'unknown' is not in 'name' | 'age'

interface Map<T> {
  [key: string]: T;
}
let keys: keyof Map<number>; // string
let value: Map<number>["foo"]; // number

// 映射类型
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Partial<T> = { [P in keyof T]?: T[P] };
type Readonly<T> = { readonly [P in keyof T]: T[P] };

//
//
//
// 模块
// TypeScript 1.5里术语名已经发生了变化。 “内部模块”现在称做“命名空间”。 “外部模块”现在则简称为“模块”，这是为了与ECMAScript 2015里的术语保持一致，
// (也就是说 module X { 相当于现在推荐的写法 namespace X {)。

// 要想描述非TypeScript编写的类库的类型，我们需要声明类库所暴露出的API。它们通常是在.d.ts文件里定义的。 如果你熟悉C/C++，你可以把它们当做.h文件。

// 模块里不要使用命名空间。

//【模块解析】
// .tsx：React / 包含 JSX 的项目，存在可执行代码；.d.ts：TypeScript 声明文件，为 JavaScript 库提供类型描述，不存在可执行代码
// 相对模块导入【不能解析外部模块声明】：import Entry from "./components/Entry"; 或 import "/mod";【以/，./或../开头】
// 非相对模块导入【可以解析外部模块声明】：import * as $ from "jQuery"; 或 import { Component } from "@angular/core";

// 模块解析策略：共有两种可用的模块解析策略：Node和Classic。 你可以使用--moduleResolution标记指定使用哪种模块解析策略。
// 若未指定，那么在使用了--module AMD | System | ES2015时的默认值为Classic，其它情况时则为Node。

//【1】Classic：这种策略以前是TypeScript默认的解析策略。 现在，它存在的理由主要是为了向后兼容。
// Classic的相对查找：
// 例子1【相对】：/root/src/folder/A.ts文件里的import { b } from "./moduleB"的查找流程：
// 1. /root/src/folder/moduleB.ts
// 2. /root/src/folder/moduleB.d.ts

// Classic的非相对查找：【对于非相对模块的导入，编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件】
// 例子2【非相对】：/root/src/folder/A.ts文件里的import { b } from "moduleB"的查找流程：
// 1. /root/src/folder/moduleB.ts
// 2. /root/src/folder/moduleB.d.ts
// 3. /root/src/moduleB.ts
// 4. /root/src/moduleB.d.ts
// 5. /root/moduleB.ts
// 6. /root/moduleB.d.ts
// 7. /moduleB.ts
// 8. /moduleB.d.ts

//【2】Node：这个解析策略试图在运行时模仿Node.js模块解析机制。
// Node的相对查找：
// 例子1【相对】：/root/src/moduleA.js文件里var x = require("./moduleB")的查找流程：
// 1. 将/root/src/moduleB.js视为文件，检查是否存在。
// 2. 将/root/src/moduleB视为目录，检查是否它包含package.json文件并且其指定了一个"main"模块。
//    在我们的例子里，如果Node.js发现文件/root/src/moduleB/package.json包含了{ "main": "lib/mainModule.js" }，
//    那么Node.js会引用/root/src/moduleB/lib/mainModule.js。
// 3. 将/root/src/moduleB视为目录，检查它是否包含index.js文件。 这个文件会被隐式地当作那个文件夹下的”main”模块。

// 即：/root/src/moduleB.js -> /root/src/moduleB/package.json#main -> /root/src/moduleB/index.js

// Node的非相对查找：【非相对模块名的解析是个完全不同的过程。 Node会在一个特殊的文件夹node_modules里查找你的模块。
//                 node_modules可能与当前文件在同一级目录下，或者在上层目录里。 Node会向上级目录遍历，查找每个node_modules直到它找到要加载的模块】
// 例子2【非相对】：/root/src/moduleA.js文件里var x = require("moduleB")的查找流程：
// 1. /root/src/node_modules/moduleB.js
// 2. /root/src/node_modules/moduleB/package.json#main (如果指定了"main"属性)
// 3. /root/src/node_modules/moduleB/index.js
// 4. /root/node_modules/moduleB.js
// 5. /root/node_modules/moduleB/package.json#main (如果指定了"main"属性)
// 6. /root/node_modules/moduleB/index.js
// 7. /node_modules/moduleB.js
// 8. /node_modules/moduleB/package.json#main (如果指定了"main"属性)
// 9. /node_modules/moduleB/index.js

//【3】TypeScript：TypeScript是模仿Node.js运行时的解析策略来在编译阶段定位模块定义文件。 因此，TypeScript在Node解析逻辑基础上增加了TypeScript源文件的扩展名
// （.ts，.tsx和.d.ts）。 同时，TypeScript在package.json里使用字段"types"来表示类似"main"的意义 - 编译器会使用它来找到要使用的”main”定义文件。
// TypeScript的相对查找：
// 例子1【相对】：/root/src/moduleA.ts文件里的import { b } from "./moduleB"的查找流程：
// 1. /root/src/moduleB.ts
// 2. /root/src/moduleB.tsx
// 3. /root/src/moduleB.d.ts
// 4. /root/src/moduleB/package.json#types (如果指定了"types"属性)
// 5. /root/src/moduleB/index.ts
// 6. /root/src/moduleB/index.tsx
// 7. /root/src/moduleB/index.d.ts

// TypeScript的非相对查找：
// 例子2【非相对】：/root/src/moduleA.ts文件里的import { b } from "moduleB"的查找流程：
// 1. /root/src/node_modules/moduleB.ts
// 2. /root/src/node_modules/moduleB.tsx
// 3. /root/src/node_modules/moduleB.d.ts
// 4. /root/src/node_modules/moduleB/package.json#types (如果指定了"types"属性)
// 5. /root/src/node_modules/moduleB/index.ts
// 6. /root/src/node_modules/moduleB/index.tsx
// 7. /root/src/node_modules/moduleB/index.d.ts
// ...向上层级查找
// 15. /node_modules/moduleB.ts
// 16. /node_modules/moduleB.tsx
// 17. /node_modules/moduleB.d.ts
// 18. /node_modules/moduleB/package.json#types (如果指定了"types"属性)
// 19. /node_modules/moduleB/index.ts
// 20. /node_modules/moduleB/index.tsx
// 21. /node_modules/moduleB/index.d.ts

//【baseUrl&paths】路径映射：TypeScript编译器通过使用tsconfig.json文件里的"paths"来支持这样的声明映射。
// {
//   "compilerOptions": {
//     "baseUrl": ".", // This must be specified if "paths" is.
//     "paths": {
//       "jquery": ["node_modules/jquery/dist/jquery"] // 此处映射是相对于"baseUrl"
//     }
//   }
// }

// "paths": {
//   "*": [
//     "*",
//     "generated/*"
//   ]
// 表示：1. "*"： 表示名字不发生改变，所以映射为<moduleName> => <baseUrl>/<moduleName>
//      2. "generated/*"表示模块名添加了“generated”前缀，所以映射为<moduleName> => <baseUrl>/generated/<moduleName>

//【rootDirs】利用rootDirs指定虚拟目录
// 可以使用"rootDirs"来告诉编译器。 "rootDirs"指定了一个roots列表，列表里的内容会在运行时被合并。因此可以使用相对导入"./template"。
// {
//   "compilerOptions": {
//     "rootDirs": [
//       "src/views",
//       "generated/templates/views"
//     ]
//   }
// }

// 跟踪模块解析：tsc --traceResolution

// exclude要从编译列表中排除一个文件，你需要在排除它的同时，还要排除所有对它进行import或使用了/// <reference path="..." />指令的文件。

// 声明合并：是指编译器将针对同一个名字的两个独立声明合并为单一声明。 合并后的声明同时拥有原先两个声明的特性。 任何数量的声明都可被合并；不局限于两个声明。
// 有：接口合并、命名空间合并、命名空间和类合并【可以表示内部类】、命名空间可以用来扩展枚举型、类和接口合并

//
//
//
// JSX【TypeScript支持内嵌，类型检查和将JSX直接编译为JavaScript】
// TypeScript具有三种JSX模式：preserve，react和react-native。这些模式只在代码生成阶段起作用 - 类型检查并不受影响。
// react模式会生成 React.createElement("div")

// var foo = <foo>bar; TypeScript如果使用尖括号来表示类型断言，JSX的语法带来了解析的困难。因此，TypeScript在.tsx文件里禁用了使用尖括号的类型断言。用 as 代替。
declare namespace JSX {
  // 固有元素
  interface IntrinsicElements {
    // 固有元素使用特殊的接口JSX.IntrinsicElements来查找
    foo: any; // <foo />;
    foo2: { bar?: boolean }; // <foo bar />;
    foo3: { requiredProp: string; optionalProp?: number }; // 支持可选属性和必须属性 <foo requiredProp="bar" optionalProp={10} />;
  }
  // 基于值的元素
  interface ElementAttributesProperty {
    props: any; // 指定用来使用的属性名
  }
  // 子孙类型检查
  interface ElementChildrenAttribute {
    children: {}; // specify children name to use
  }
}

class MyComponent {
  // 在元素实例类型上指定属性
  props?: {
    foo?: string;
  };
}
// <MyComponent foo="bar" />

//
//
//
// Decorators【在运行时被调用】
// 装饰器（Decorators）为我们在类的声明及成员上通过【元编程】语法添加标注提供了一种方式。
// Javascript里的装饰器目前处在建议征集的第二阶段，但在TypeScript里已做为一项实验性特性予以支持。

// 在TypeScript里，当多个装饰器应用在一个声明上时会进行如下步骤的操作：
// 1. 由上至下依次对装饰器表达式求值。
// 2. 求值的结果会被当作函数，由下至上依次调用。

//
//
//
// 三斜线指令
// 三斜线指令是包含单个XML标签的单行注释。 注释的内容会做为编译器指令使用。三斜线指令仅可放在包含它的文件的最顶端。
// 如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。
/// <reference path="..." /> 指令是三斜线指令中最常见的一种。它用于声明文件间的依赖。
// 三斜线引用告诉编译器在编译过程中要引入的额外的文件。
// 如果指定了--noResolve编译选项，三斜线引用会被忽略；它们不会增加新文件，也不会改变给定文件的顺序。

// 在声明文件里包含/// <reference types="node" />，表明这个文件使用了@types/node/index.d.ts里面声明的名字； 并且，这个包要在编译阶段与声明文件一起被包含进来。
// 解析@types包的名字的过程与解析import语句里模块名的过程类似。 所以可以简单的把三斜线类型引用指令想像成针对包的import声明。

//
//
//
// TypeScript 2.3以后的版本支持使用--checkJs对.js文件进行类型检查并提示错误的模式。
// // @ts-nocheck // @ts-check // @ts-ignore来忽略本行的错误。

//
//
//
// 书写声明文件
// 全局库：指能在全局命名空间下访问的，不需要使用任何形式的import。许多库都是简单的暴露出一个或多个全局变量。如：jQuery库
// 模块化库：一些库只能工作在模块加载器的环境下。 比如，像express只能在Node.js里工作所以必须使用CommonJS的require函数加载。
// UMD模块是指那些既可以作为模块使用（通过导入）又可以作为全局（在没有模块加载器的环境里）使用的模块。
// 许多流行的库，比如Moment.js，就是这样的形式。 比如，在Node.js或RequireJS里，你可以这样写：
// import moment = require("moment");
// console.log(moment.format());
// 然而在纯净的浏览器环境里你也可以这样写：
// console.log(moment.format());

// 如果你在库的源码里看到了typeof define，typeof window，或typeof module这样的测试，尤其是在文件的顶端，那么它几乎就是一个UMD库。
// UMD库的文档里经常会包含通过require“在Node.js里使用”例子， 和“在浏览器里使用”的例子，展示如何使用<script>标签去加载脚本。

// 三种可用的模块， module.d.ts、module-class.d.ts、module-function.d.ts

// 一个模块插件可以改变一个模块的结构（UMD或模块）。例如，在Moment.js里，moment-range添加了新的range方法到monent对象。
// 一个全局插件是全局代码，它们会改变全局对象的结构。对于全局修改的模块，在运行时存在冲突的可能。比如，一些库往Array.prototype或String.prototype里添加新的方法。
// module-plugin.d.ts模版、global-plugin.d.ts模版、global-modifying-module.d.ts模版

// 依赖全局库：使用/// <reference types="..." />指令
// 依赖模块库：使用import语句

// 防止命名冲突
declare namespace cats {
  interface KittySettings {} // 不要在顶层直接定义
}

// 函数重载顺序，应该排序重载令精确的排在一般的之前：
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: any): any;

// 注意：重载函数、可选参数、【联合类型】的选择，优先使用可选参数和【联合类型】。
// 使用联合类型替换参数类型不同的情况下定义重载
interface Moment {
  utcOffset(): number;
  utcOffset(b: number | string): Moment;
}

// 可以使用类型别名来定义类型的短名：
class MyGreeter {}
type GreetingLike = string | (() => string) | MyGreeter;
declare function greet(g: GreetingLike): void;

// 有一些声明能够通过多个声明组合。 比如，class C { }和interface C { }可以同时存在并且都可以做为C类型的属性。

// 包含声明文件到你的npm包
// 设置package.json#types属性指向捆绑在一起的声明文件，【指定主声明文件】
// {
//     "name": "awesome",
//     "author": "Vandelay Industries",
//     "version": "1.0.0",
//     "main": "./lib/main.js",
//     "types": "./lib/main.d.ts" // 注意"typings"与"types"具有相同的意义，也可以使用它。
// }
// 注意：如果主声明文件名是index.d.ts并且位置在包的根目录里（与index.js并列），你就不需要使用"types"属性指定了。

// TypeScript 官方文档明确建议：在声明文件中引用其他库的类型时，应使用 /// <reference types="..." />，而不是直接指向文件的 path 引用。

//
//
//
// 使用tsconfig.json
// 1. 不带任何输入文件的情况下调用tsc，编译器会从当前目录开始去查找tsconfig.json文件，逐级向上搜索父目录。
// 2. 不带任何输入文件的情况下调用tsc，且使用命令行参数--project（或-p）指定一个包含tsconfig.json文件的目录。
// 当命令行上指定了输入文件时，tsconfig.json文件会被忽略。

// "files"指定一个包含相对或绝对文件路径的列表。 "include"和"exclude"属性指定一个文件glob匹配模式列表。 支持的glob通配符有：
// * 匹配0或多个字符（不包括目录分隔符）
// ? 匹配一个任意字符（不包括目录分隔符）
// **/ 递归匹配任意子目录

// **/的使用例子：
// "include": [
//         "src/**/*"
//     ],
//     "exclude": [
//         "node_modules",
//         "**/*.spec.ts"
//     ]

// 如果"files"和"include"都没有被指定，编译器默认包含当前目录和子目录下所有的TypeScript文件（.ts, .d.ts 和 .tsx），排除在"exclude"里指定的文件。
// JS文件（.js和.jsx）也被包含进来如果allowJs被设置成true。
// 使用"include"引入的文件可以使用"exclude"属性过滤。 然而，通过"files"属性明确指定的文件却总是会被包含在内，不管"exclude"如何设置。
// 如果没有特殊指定，"exclude"默认情况下会排除node_modules，bower_components，jspm_packages和<outDir>目录。
// 任何被"files"或"include"指定的文件所引用的文件也会被包含进来。A.ts引用了B.ts，因此B.ts不能被排除。

// 编译器不会去引入那些可能做为输出的文件；比如，假设我们包含了index.ts，那么index.d.ts和index.js会被排除在外。

// 在命令行上指定的编译选项会覆盖在tsconfig.json文件里的相应选项。

// 默认所有可见的”@types“包会在编译过程中被包含进来。node_modules/@types文件夹下以及它们子文件夹下的所有包都是可见的；
// 也就是说，./node_modules/@types/，../node_modules/@types/和../../node_modules/@types/等等。

// 如果指定了typeRoots，只有typeRoots下面的包才会被包含进来。
// {
//    "compilerOptions": {
//        "typeRoots" : ["./typings"] // 这个配置文件会包含所有./typings下面的包，而不包含./node_modules/@types里面的包。
//    }
// }

// 如果指定了types，只有被列出来的包才会被包含进来。
// {
//    "compilerOptions": {
//         "types" : ["node", "lodash", "express"]
//          // 这个tsconfig.json文件将仅会包含 ./node_modules/@types/node，./node_modules/@types/lodash和./node_modules/@types/express。
//          // ./node_modules/@types/*里面的其它包不会被引入进来。
//    }
// }
// 通过指定 "types": [] 来禁用自动引入@types包。

// tsconfig.json文件可以利用extends属性从另一个配置文件里继承配置。extends的值是一个字符串，包含指向另一个要继承文件的路径。
