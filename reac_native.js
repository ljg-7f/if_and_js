// ScrollView适合用来显示数量不多的滚动元素。放置在ScrollView中的所有组件都会被渲染，哪怕有些组件因为内容太长被挤出了屏幕外。
// 如果你需要显示较长的滚动列表，那么应该使用功能差不多但性能更好的FlatList组件。FlatList并不立即渲染所有元素，而是优先渲染屏幕上可见的元素。
// 如果要渲染的是一组需要分组的数据，也许还带有分组标签的，那么SectionList将是个不错的选择。

// 特定平台代码：
// 1.
// const styles = StyleSheet.create({
//   height: Platform.OS === 'ios' ? 200 : 100,
// });
// 2.
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     ...Platform.select({
//       ios: {
//         backgroundColor: 'red',
//       },
//       android: {
//         backgroundColor: 'green',
//       },
//       default: {
//         // other platforms, web for example
//         backgroundColor: 'blue',
//       },
//     }),
//   },
// });
//
// 3.特定平台后缀
// BigButton.ios.js
// BigButton.android.js
// 或
// Container.js # 由 Webpack, Rollup 或者其他打包工具打包的文件
// Container.native.js # 由 React Native 自带打包工具(Metro) 为ios和android 打包的文件

// 检查Android版本：if (Platform.Version === 25)
// 检查IOS版本：const majorVersionIOS = parseInt(Platform.Version, 10); if (majorVersionIOS <= 9) 
