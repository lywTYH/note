# react 方向

## 快速响应

我们日常使用 App，浏览网页时，有两类场景会制约快速响应：

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。（CPU 的瓶颈）
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。（IO)

### CPU 的瓶颈

当项目变得庞大、组件数量繁多时，就容易遇到 CPU 的瓶颈。JS 可以操作 DOM，GUI 渲染
线程与 JS 线程是互斥的。所以 JS 脚本执行和浏览器布局、绘制不能同时执行。而再每一
帧中我们都需要完成 `JS脚本执行 ----- 样式布局 ----- 样式绘制`。当 JS 执行时间过
长，超出了 16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

如何解决这个问题呢？

答案是：在浏览器每一帧的时间中，预留一些时间给 JS 线程，React 利用这部分时间更新
组件（可以看到，在源码中，预留的初始时间是 5ms）。当预留的时间不够用时，React 将
线程控制权交还给浏览器使其有时间渲染 UI，React 则等待下一帧时间到来继续被中断的
工作。所以解决 CPU 瓶颈的关键是实现时间切片，而时间切片的关键是：将同步的更新变
为可中断的异步更新。

### IO 瓶颈

网络延迟是前端开发者无法解决的。如何在网络延迟客观存在的情况下，减少用户对网络延
迟的感知？React 给出的答案是将人机交互研究的结果整合到真实的 UI 中。为此，React
实现了 Suspense 功能及配套的 hook——useDeferredValue。而在源码内部，为了支持这些
特性，同样需要将同步的更新变为可中断的异步更新。

## React 架构

### React15 架构

1. Reconciler（协调器）—— 负责找出变化的组件，每当有更新发生时，Reconciler 会做
   如下工作：
   1. 调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
   2. 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
   3. 通过对比找出本次更新中变化的虚拟 DOM
   4. 通知 Renderer 将变化的虚拟 DOM 渲染到页面上
2. Renderer（渲染器）—— 负责将变化的组件渲染到页面上，在每次更新发生时，Renderer
   接到 Reconciler 通知，将变化的组件渲染在当前宿主环境

在 Reconciler 中，mount 的组件会调用 mountComponent，update 的组件会调用
updateComponent。这两个方法都会递归更新子组件。由于递归执行，所以更新一旦开始，
中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。

### React16+ 架构

1. Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler
2. Reconciler（协调器）—— 负责找出变化的组件
3. Renderer（渲染器）—— 负责将变化的组件渲染到页面上

Scheduler（调度器）判断是否有剩余时间，有剩余时间则通知 React 进行更新
，Reconciler 变为可中端更新。其中 Reconciler 收集更新内容并打上标记。当所有组件
都完成 Reconciler 后才会统一交给 Render 进行更新。

## Fiber

React 核心团队成员 Sebastian Markbåge（React Hooks 的发明者）曾说：我们在 React
中做的就是践行代数效应（Algebraic Effects）。代数效应是函数式编程中的一个概念，
用于将副作用从函数调用中分离。

代数效应与 React 有什么关系呢？最明显的例子就是 Hooks。

对于类似 useState、useReducer、useRef 这样的 Hook，我们不需要关注
FunctionComponent 的 state 在 Hook 中是如何保存的，React 会为我们处理。

我们只需要假设 useState 返回的是我们想要的 state，并编写业务逻辑就行。

React Fiber 可以理解为：

React 内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可
以复用之前的中间状态。

其中每个任务更新单元为 React Element 对应的 Fiber 节点。

### Fiber 工作原理

Fiber 节点可以保存对应的 DOM 节点。相应的，Fiber 节点构成的 Fiber 树就对应 DOM
树。

在 React 中最多会同时存在两棵 Fiber 树。当前屏幕上显示内容对应的 Fiber 树称为
current Fiber 树，正在内存中构建的 Fiber 树称为 workInProgress Fiber 树。 React
应用的根节点通过使 current 指针在不同 Fiber 树的 rootFiber 间切换来完成 current
Fiber 树指向的切换。

即当 workInProgress Fiber 树构建完成交给 Renderer 渲染在页面上后，应用根节点的
current 指针指向 workInProgress Fiber 树，此时 workInProgress Fiber 树就变为
current Fiber 树。

每次状态更新都会产生新的 workInProgress Fiber 树，通过 current 与 workInProgress
的替换，完成 DOM 更新。
