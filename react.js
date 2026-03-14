/**
 *  描述UI
 */
// JSX：javascript xml。
// JSX and React 是相互独立的 东西。但它们经常一起使用，但你 可以 单独使用它们中的任意一个，JSX 是一种语法扩展，而 React 则是一个 JavaScript 的库。
// React 组件是常规的 JavaScript 函数，但【组件的名称必须以大写字母开头】，否则它们将无法运行！【 小写的是 HTML 标签；大写的是自定义的组件】
// 没有括号包裹的话，任何在 return 下一行的代码都 将被忽略！
// 永远不要在组件中定义组件。
// React 是常规的 JavaScript 函数，除了：1）它们的名字总是以大写字母开头。2）它们返回 JSX 标签。

// import Button from './Button.js'; // 导入默认
// import { Button } from './Button.js'; // 导入具名

// 在 React 中，大部分 HTML 和 SVG 属性都用驼峰式命名法表示。例如，需要用 strokeWidth 代替 stroke-width。
// 由于 class 是一个保留字，所以在 React 中需要用 className 来代替。
// 由于历史原因，aria-* 和 data-* 属性是以带 - 符号的 HTML 格式书写的。

// 双大括{{ ... }}：传递对象
// <ul style={{
//      backgroundColor: 'black',
//      color: 'pink'
//    }}>
// </ul>

// src={baseUrl + person.imageId + person.imageSize + '.jpg'}

// React props 的本质：function Avatar({ person, size }) 等价于【解构】
// function Avatar(props) {
//     let person = props.person;
//     let size = props.size;
// }

// 透传props的简洁方法：将 Profile 的所有 props 转发到 Avatar，而不列出每个名字。
// function Profile(props) {
//     return (
//         <div className="card">
//             <Avatar {...props} />
//         </div>
//     );
// }

// 像 <Card><Avatar /></Card> 这样的嵌套 JSX，将被视为 Card 组件的 children prop。
// 你会经常使用 children prop 来进行视觉包装：面板、网格等等。
// function Card({ children }) {
//   return (
//     <div className="card">
//       {children}
//     </div>
//   );
// }

// Props 是只读的时间快照：每次渲染都会收到新版本的 props。你不能改变 props。当你需要交互性时，你可以设置 state。

// 条件判断的简洁方式
// <li className="item">
//    {name} {isPacked && '✅'} // 再如：{showMore && <p>{sculpture.description}</p>}，在JSX中很适合使用 && 运算符
// </li>
// 当 JavaScript && 表达式 的左侧（我们的条件）为 true 时，它则返回其右侧的值（在我们的例子里是勾选符号）。但条件的结果是 false，
// 则整个表达式会变成 false。在 JSX 里，React 会将 false 视为一个“空值”，就像 null 或者 undefined，这样 React 就不会在这里进行任何渲染。

// map & filter
// const listItems = people.map(person => <li>{person}</li>);
// const chemists = people.filter(person =>
//   person.profession === '化学家'
// );
// 直接放在 map() 方法里的 JSX 元素一般都需要指定 key 值！
// key 需要满足的条件：
// 1）key 值在兄弟节点之间必须是唯一的。 不过不要求全局唯一，在不同的数组中可以使用相同的 key。
// 2）key 值不能改变，否则就失去了使用 key 的意义！所以千万不要在渲染时动态地生成 key。

// 有一点需要注意，组件不会把 key 当作 props 的一部分。Key 的存在只对 React 本身起到提示作用。
// 如果你的组件需要一个 ID，那么请把它作为一个单独的 prop 传给组件： <Profile key={id} userId={id} />。

// 保证组件纯粹
// 严格模式在生产环境下不生效，因此它不会降低应用程序的速度。如需引入严格模式，你可以用 <React.StrictMode> 包裹根组件。一些框架会默认这样做。
// React 提供了 “严格模式”，在严格模式下开发时，它将会调用每个组件函数两次（丢弃第二个结果）。通过重复调用组件函数，严格模式有助于找到违反这些规则的组件。

// 纯函数的优势：
// 1）你的组件可以在不同的环境下运行 — 例如，在服务器上！由于它们针对相同的输入，总是返回相同的结果，因此一个组件可以满足多个用户请求。
// 2）你可以为那些输入未更改的组件来 跳过渲染，以提高性能。这是安全的做法，因为纯函数总是返回相同的结果，所以可以安全地缓存它们。
// 3）如果在渲染深层组件树的过程中，某些数据发生了变化，React 可以重新开始渲染，而不会浪费时间完成过时的渲染。纯粹性使得它随时可以安全地停止计算。

// 一个组件必须是纯粹的，就意味着：
// 1）只负责自己的任务。 它不会更改在该函数调用前就已存在的对象或变量。
// 2）输入相同，则输出相同。 给定相同的输入，组件应该总是返回相同的 JSX。
// 3）渲染随时可能发生，因此组件不应依赖于彼此的渲染顺序。
// 4）你不应该改变任何用于组件渲染的输入。这包括 props、state 和 context。通过 “设置” state 来更新界面，而不要改变预先存在的对象。

// 通常在使用 props 的属性要先拷贝。
// function StoryTray({ stories }) {
//     // 复制数组！
//     const storiesToDisplay = stories.slice();
//    // ...
// }

// 记住数组上的哪些操作会修改原始数组、哪些不会，这非常有帮助。例如，push、pop、reverse 和 sort 会改变原始数组，但 slice、filter 和 map 则会创建一个新数组。





/**
 *  添加交换
 */
// 事件处理函数，通常将事件处理程序命名为 handle，后接事件名。你会经常看到 onClick={handleClick}，onMouseEnter={handleMouseEnter} 等。
// 注意不是函数调用：<button onClick={handleClick()}>【错误】
// 或者简洁方式：
// <button onClick={() => {
//  alert('你点击了我！');
// }}></button>

// 事件传播
// 事件会沿着树向上“冒泡”或“传播”：它从事件发生的地方开始，然后沿着树向上传播。
// 如果你点击任一按钮，它自身的 onClick 将首先执行，然后父级 <div> 的 onClick 会接着执行。
// 在 React 中所有事件都会传播，除了 onScroll，它仅适用于你附加到的 JSX 标签。

// 你可以在父组件中定义一个事件处理函数，并将其作为 prop 传递给子组件。

// 阻止传播 e.stopPropagation()
// 事件处理函数接收一个 事件对象 作为唯一的参数。按照惯例，它通常被称为 e ，代表 “event”（事件）。你可以使用此对象来读取有关事件的信息。
// <button onClick={e => {
//      e.stopPropagation(); // 阻止点击事件到达父组件，即阻止事件进一步冒泡
//      onClick();
//    }}></button>

// onClickCapture属性：先调用父类中的onClickCapture方法，然后再调用父类或子类中onClick方法。不受e.stopPropagation()影响。可捕获所有点击事件。

// e.preventDefault() 阻止少数事件的默认浏览器行为：如某些浏览器事件具有与事件相关联的默认行为。
// 例如，点击 <form> 表单内部的按钮会触发表单提交事件，默认情况下将重新加载整个页面。

// state【当你调用 useState 时，你是在告诉 React 你想让这个组件记住一些东西】
// 局部变量无法在多次渲染中持久保存。 当 React 再次渲染这个组件时，它会从头开始渲染，不会考虑之前对局部变量的任何更改。
// 在 React 中，useState 以及任何其他以“use”开头的函数都被称为 Hook。Hook 是特殊的函数，只在 React 渲染时有效。
// Hooks 以 use 开头的函数——只能在组件或自定义 Hook 的最顶层调用。
// const [index, setIndex] = useState(0); 每次渲染调用时，index会保存上次渲染的值。

// useState 在调用时没有任何关于它引用的是哪个 state 变量的信息。没有传递给 useState 的“标识符”，它是如何知道要返回哪个 state 变量呢？
// 答：在同一组件的每次渲染中，Hooks 都依托于一个稳定的调用顺序。这在实践中很有效，因为如果你遵循上面的规则（“只在顶层调用 Hooks”），Hooks 将始终以相同的顺序被调用。
// 在 React 内部，为每个组件保存了一个数组，其中每一项都是一个 state 对。它维护当前 state 对的索引值，在渲染之前将其设置为 “0”。
// 每次调用 useState 时，React 都会为你提供一个 state 对并增加索引值。

// useState 在 React 中是如何工作的（简化版）
// let componentHooks = [];
// let currentHookIndex = 0;

// function useState(initialState) {
//   let pair = componentHooks[currentHookIndex];
//   if (pair) {
//     // 这不是第一次渲染
//     // 所以 state pair 已经存在
//     // 将其返回并为下一次 hook 的调用做准备
//     currentHookIndex++;
//     return pair;
//   }

//   // 这是我们第一次进行渲染
//   // 所以新建一个 state pair 然后存储它
//   pair = [initialState, setState];

//   function setState(nextState) {
//     // 当用户发起 state 的变更，
//     // 把新的值放入 pair 中
//     pair[0] = nextState;
//     updateDOM();
//   }

//   // 存储这个 pair 用于将来的渲染
//   // 并且为下一次 hook 的调用做准备
//   componentHooks[currentHookIndex] = pair;
//   currentHookIndex++;
//   return pair;
// }

// function updateDOM() {
//   // 在渲染组件之前
//   // 重置当前 Hook 的下标【*******】
//   currentHookIndex = 0;
//   ...
// }

// state 完全私有于声明它的组件。
// Hook 可能会让你想起 import：它们需要在非条件语句中调用。调用 Hook 时，包括 useState，仅在组件或另一个 Hook 的顶层被调用才有效。

// state 快照
// 【***】一个 state 变量的值永远不会在一次渲染的内部发生变化， 即使其事件处理函数的代码是异步的。因为它的值在React 过调用你的组件“获取 UI 的【快照】”时就被“固定”了。
// React 会使 state 的值始终“固定”在一次渲染的各个事件处理函数内部。你无需担心代码运行时 state 是否发生了变化。
// 调用setState 只会为下次渲染对它进行变更，而不会影响来自上次渲染的事件处理函数。

// React的批处理：React 会在事件处理函数执行完成之后处理 state 更新，这被称为批处理。
// 这让你可以更新多个 state 变量——甚至来自多个组件的 state 变量——而不会触发太多的 重新渲染。但这也意味着只有在你的事件处理函数及其中任何代码执行完成 之后，UI 才会更新。
// 这种特性也就是 批处理，它会使你的 React 应用运行得更快。

// 在下次渲染前多次更新同一个 state：可以像 setNumber(n => n + 1); 这样传入一个根据队列中的前一个 state 计算下一个 state 的 函数，
// 而不是像 setNumber(number + 1) 这样传入 下一个 state 值。在这里，n => n + 1 被称为【更新函数】。当你将它传递给一个 state 设置函数时：
// 1.React 会将此函数【加入队列】，以便在事件处理函数中的所有其他代码运行后进行处理。
// 2.在下一次渲染期间，React 会遍历队列并给你更新之后的【最终】 state。

// setState(42) 等价于 setState(n => 42)

// 更新函数必须是 纯函数 并且只返回结果。通常可以通过相应 state 变量的第一个字母来命名更新函数的参数，如：
// setEnabled(e => !e);
// setLastName(ln => ln.reverse());
// setFriendCount(fc => fc * 2);

// 你应该把在渲染过程中可以访问到的 state 视为只读的。

// 更新state中的对象
// 使用 ... 对象展开 语法，这样你就不需要单独复制每个属性。
// 【普通方式】setPerson({
//   firstName: e.target.value, // 从 input 中获取新的 first name
//   lastName: person.lastName,
//   email: person.email
// });
// 使用 ... 进行优化 =>
// 【优化1】setPerson({
//   ...person, // 复制上一个 person 中的所有字段
//   firstName: e.target.value // 但是覆盖 firstName 字段
// });
// 使用[ ]属性动态命名进一步优化
// 【优化2】function handleChange(e) {
//     setPerson({
//       ...person,
//       [e.target.name]: e.target.value
//     });
//   }
// 在这里，e.target.name 引用了 <input> 这个 DOM 元素的 name 属性。
// <input name="firstName" value={person.firstName} onChange={handleChange} />

// 请注意 ... 展开语法本质是“浅拷贝”——它只会复制一层。这使得它的执行速度很快，但是也意味着当你想要更新一个嵌套属性时，你必须得多次使用展开语法。

// 更新一个嵌套对象：
// setPerson({
//   ...person, // 复制其它字段的数据
//   artwork: { // 替换 artwork 字段
//     ...person.artwork, // 复制之前 person.artwork 中的数据
//     city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
//   }
// });

// 【优化3】使用Immer库优化，当state有多层的嵌套时。
// 用 import { useImmer } from 'use-immer' 替换掉 import { useState } from 'react'
// function handleNameChange(e) {
//     updatePerson(draft => {
//       draft.artwork.city = e.target.value; // 可进一步优化为：draft.name = e.target.value;
//     });
//   }

// 由 Immer 提供的 draft 是一种特殊类型的对象，被称为 Proxy，它会记录你用它所进行的操作。这就是你能够随心所欲地直接修改对象的原因所在！从原理上说，
// Immer 会弄清楚 draft 对象的哪些部分被改变了，并会依照你的修改创建出一个全新的对象。

// 你可以随意在一个组件中同时使用 useState 和 useImmer

// 将 React 中所有的 state 都视为不可直接修改的。不要直接修改一个对象，而要为它创建一个新版本，并通过把 state 设置成这个新版本来触发重新渲染。

// 更新 state 中的数组
//        避免使用 (会改变原始数组)        推荐使用 (会返回一个新数组）
// 添加元素 push，unshift                concat，[...arr] 展开语法
// 删除元素 pop，shift，splice           filter，slice
// 替换元素 splice，arr[i] = ...         map
// 排序    reverse，sort                先将数组复制一份，再执行方法

// 增加
// setArtists([
//           ...artists,
//           { id: nextId++, name: name }
//         ]);
// 删除
// setArtists(
//   artists.filter(a => a.id !== artist.id)
// );
// 转换/替换 map
// const nextShapes = shapes.map(shape => {
//     if (shape.type === 'square') {
//     // 不作改变
//     return shape;
//     } else {
//     // 返回一个新的圆形，位置在下方 50px 处
//     return {
//         ...shape,
//         y: shape.y + 50,
//     };
//     }
// });
// // 使用新的数组进行重渲染
// setShapes(nextShapes);
// 中间插入 slice 和 ... 配合使用
// const nextArtists = [
//       // 插入点之前的元素：
//       ...artists.slice(0, insertAt),
//       // 新的元素：
//       { id: nextId++, name: name },
//       // 插入点之后的元素：
//       ...artists.slice(insertAt)
//     ];
// 翻转或排序：先拷贝一份再执行
// const nextList = [...list];
// nextList.reverse();
// setList(nextList);

// 更新数组内部的对象
// ***注意***：即使你拷贝了数组，你还是不能直接修改其内部的元素。这是因为数组的拷贝是浅拷贝，新的数组中依然保留了与原始数组相同的元素。
// 因此，如果你修改了拷贝数组内部的某个对象，其实你正在直接修改当前的 state。

// 当然也可以使用 Immer 进行编写简洁优化。





/**
 *  状态管理
 */
// 声明式 UI 与命令式 UI 的比较
// 声明式UI，在 React 中你需要去描述什么是你想要看到的而非操作 UI 元素。

// React 不会修改对应 state 没改变的 DOM。

// 注意：如果两个不同的 JSX 代码块描述着相同的树结构，它们的嵌套（第一个 <div> → 第一个 <img>）必须对齐。否则切换 isActive 会再次在后面创建整个树结构
// 并且重置 state。这也就是为什么当一个相似的 JSX 树结构在两个情况下都返回的时候，最好将它们写成一个单独的 JSX。

// 当有多个相关的 bool 类型的状态时，考虑用 string 类型的状态机去维护。

// 构建 state 的原则：合并关联的 state、避免互相矛盾的 state、避免冗余的 state、避免重复的 state、避免深度嵌套的 state。

// ***对于选择类型的 UI 模式（从选项框中选择一条），请在 state 中保存 ID 或索引而不是对象本身。好多场景都适用，尽量不要保存 item。

// 扁平化数据结构，将层级嵌套的树结构用【数据库表】结构进行优化。类似于下面：
// export const initialTravelPlan = {
//   0: {
//     id: 0,
//     title: '(Root)',
//     childIds: [1, 42, 46],
//   },
//   1: {
//     id: 1,
//     title: 'Earth',
//     childIds: [2, 10, 19, 26, 34]
//   },
//   2: {
//     id: 2,
//     title: 'Africa',
//     childIds: [3, 4, 5, 6 , 7, 8, 9]
//   },
// }

// 受控组件和非受控组件【受控制（通过 props控制，父组件完全指定其行为），不受控制（通过 state自己控制）】
// 受控组件具有最大的灵活性，但它们需要父组件使用 props 对其进行配置。
// 使用的思路：
// 1.当你想要整合两个组件时，将它们的 state 移动到共同的父组件中。
// 2.然后在父组件中通过 props 把信息传递下去。
// 3.最后，向下传递事件处理程序，以便子组件可以改变父组件的 state。
// 考虑该将组件视为“受控”（由 prop 驱动）或是“不受控”（由 state 驱动）是十分有益的。

// 对state进行保留和重置
// React 在移除一个组件时，也会销毁它的 state。即DOM中的组件移除后再添加，其state会重新初始化。
// ***只要一个组件还被渲染在 UI 【树的相同位置】，React 就会保留它的 state。 如果它被移除，或者一个不同的组件被渲染在相同的位置，那么 React 就会丢掉它的 state。
// 相同位置的相同组件会使得 state 被保留下来，如：【React 不知道你的函数里是如何进行条件判断的，它只会“看到”你返回的树】
// {isFancy ? ( <Counter isFancy={true} />)
//          : ( <Counter isFancy={false} />) }
// 因为： 对 React 来说重要的是组件在 UI 树中的位置，而不是在 JSX 中的位置！上面的逻辑在JSX中根据if返回了两个Counter组件，但在DOM树中对应的位置相同，
// React会认为它们是同一个Counter组件，故state会保存不变。

// 如果在相同位置对不同的组件类型进行切换，React 会将 Counter 从 UI 树中移除了并销毁了它的状态。并且，当你在相同位置渲染不同的组件时，组件的整个子树都会被重置。

// ***注意不要把组件函数的定义嵌套起来，因为每次渲染时，【都会重新创建一个嵌套函数】，即该嵌套函数的地址会发生变化。
// 这样在JSX看来树是一致的，但在DOM树上是不一样的，因为组件名称虽然一样，但地址不一样，会导致重新渲染。所以永远要将组件定义在最上层并且不要把它们的定义嵌套起来。

// 重置组件 state 的方法一：将组件渲染在不同位置【下面的方式二】
// 注意下面两种方式在DOM树上是不一样的，方式一：DOM树认为是同一个 Counter，会保留其state；方式二：DOM树认为是渲染在不同的位置的两个Counter，各自独立。
// 方式一
// <div>
//    {isPlayerA ? (
//    <Counter person="Taylor" />
//    ) : (
//    <Counter person="Sarah" />
//    )}
// </div>

// 方式二
// <div>
//    {isPlayerA &&
//    <Counter person="Taylor" />
//    }
//    {!isPlayerA &&
//    <Counter person="Sarah" />
//    }
// </div>

// 所以DOM认为相同的组件是：组件名相同 + 组件位置相同 + 组件地址相同

// 重置组件 state 的方法二：使用 key 来重置 state【更加通用】
// 默认情况下，React 使用父组件内部的顺序来区分组件。指定一个 key 能够让 React 将 key 本身而非它们在父组件中的顺序作为位置的一部分。


