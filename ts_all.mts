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
let strLength: number = (<string>someValue).length;
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

// 接口
// TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。
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
