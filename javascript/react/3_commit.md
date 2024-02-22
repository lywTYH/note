# commit 阶段

## 流程

在 rootFiber.firstEffect 上保存了一条需要执行副作用的 Fiber 节点的单向链表
effectList，这些 Fiber 节点的 updateQueue 中保存了变化的 props。

这些副作用对应的 DOM 操作在 commit 阶段执行。除此之外，一些生命周期钩子（比如
componentDidXXX）、hook（比如 useEffect）需要在 commit 阶段执行。

commit 阶段的主要工作（即 Renderer 的工作流程）分为三部分：

1. before mutation 阶段（执行 DOM 操作前, 主要做一些变量赋值，状态重置的工作）
2. mutation 阶段（执行 DOM 操作）
3. layout 阶段（执行 DOM 操作后）

### before mutation

before mutation 整个过程就是遍历 effectList 并调用 commitBeforeMutationEffects
函数处理。

commitBeforeMutationEffects 整体分为 3 部分

1. 处理 DOM 节点渲染/删除后的 autoFocus、blur 逻辑。
2. 调用 getSnapshotBeforeUpdate 生命周期钩子。
3. 调度 useEffect。

关于 getSnapshotBeforeUpdate： 从 Reactv16 开始，componentWillXXX 钩子前增加了
UNSAFE\_前缀。这是因为 Stack Reconciler 重构为 Fiber Reconciler 后，render 阶段
的任务可能中断/重新开始，对应的组件在 render 阶段的生命周期钩子（即
componentWillXXX）可能触发多次。这种行为和 Reactv15 不一致，所以标记为
UNSAFE\_。为此，React 提供了替代的生命周期钩子
getSnapshotBeforeUpdate。getSnapshotBeforeUpdate 是在 commit 阶段内的 before
mutation 阶段调用的，由于 commit 阶段是同步的，所以不会遇到多次调用的问题

### mutation

mutation 阶段也是遍历 effectList，执行函数。这里执行的是 commitMutationEffects。
这个阶段也分为 3 部分

1. 根据 ContentReset effectTag 重置文字节点
2. 更新 ref
3. 根据 effectTag 分别处理，其中 effectTag 包括(Placement | Update | Deletion |
   Hydrating)

### layout

该阶段的代码都是在 DOM 修改完成（mutation 阶段完成）后执行的。注意：由于 JS 的同
步执行阻塞了主线程，所以此时 JS 已经可以获取到新的 DOM，但是浏览器对新的 DOM 并
没有完成渲染。该阶段触发的生命周期钩子和 hook 可以直接访问到已经改变后的 DOM，即
该阶段是可以参与 DOM layout 的阶段。
