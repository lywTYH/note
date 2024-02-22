# render 阶段

render 阶段开始于 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot` 方法
的调用。这取决于本次更新是同步更新还是异步更新。

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

他们唯一的区别是是否调用 shouldYield。如果当前浏览器帧没有剩余时间，shouldYield
会中止循环，直到浏览器有空闲时间后再继续遍历。

workInProgress 代表当前已创建的 workInProgress fiber。

performUnitOfWork 方法会创建下一个 Fiber 节点并赋值给 workInProgress，并将
workInProgress 与已创建的 Fiber 节点连接起来构成 Fiber 树。

我们知道 Fiber Reconciler 是从 Stack Reconciler 重构而来，通过遍历的方式实现可中
断的递归，所以 performUnitOfWork 的工作可以分为两部分：“递”和“归”。

### “递”阶段

首先从 rootFiber 开始向下深度优先遍历。为遍历到的每个 Fiber 节点调用 beginWork
方法。

该方法会根据传入的 Fiber 节点创建子 Fiber 节点，并将这两个 Fiber 节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

### “归”阶段

在“归”阶段会调用 completeWork 处理 Fiber 节点当某个 Fiber 节点执行完
completeWork，如果其存在兄弟 Fiber 节点（即 fiber.sibling !== null），会进入其兄
弟 Fiber 的“递”阶段。如果不存在兄弟 Fiber，会进入父级 Fiber 的“归”阶段。递”和“归
”阶段会交错执行直到“归”到 rootFiber。至此，render 阶段的工作就结束了

### beginWork

render 阶段的工作可以分为“递”阶段和“归”阶段。其中“递”阶段会执行 beginWork，“归”
阶段会执行 completeWork。

```js
// current：当前组件对应的Fiber节点在上一次更新时的Fiber节点，即workInProgress.alternate
// workInProgress：当前组件对应的Fiber节点
// renderLanes：优先级相关
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
 if (current !== null) {
    // ...省略
    // 复用current
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  } else {
    didReceiveUpdate = false;
  }
    // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    // ...省略
    case LazyComponent:
    // ...省略
    case FunctionComponent:
    // ...省略
    case ClassComponent:
    // ...省略
    case HostRoot:
    // ...省略
    case HostComponent:
    // ...省略
    case HostText:
    // ...省略
    // ...省略其他类型
  }
```

react 双缓存机制，当组件第一次 mount 时，由于是首次渲染，是不存在当前组件对应的
Fiber 节点在上一次更新时的 Fiber 节点，即 mount 时 current === null。组件 update
时，由于之前已经 mount 过，所以 current !== null。所以我们可以通过 current ===
null ?来区分组件是处于 mount 还是 update。

基于此原因，beginWork 的工作可以分为两部分：

1. update 时：如果 current 存在，在满足一定条件时可以复用 current 节点，这样就能
   克隆 current.child 作为 workInProgress.child，而不需要新建
   workInProgress.child。

2. mount 时：除 fiberRootNode 以外，current === null。会根据 fiber.tag 不同，创
   建不同类型的子 Fiber 节点
