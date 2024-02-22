# diff 算法

react diffing 前提是一个 DOM 节点在某一时刻最多会有 4 个节点和他相关

1. current Fiber。如果该 DOM 节点已在页面中，current Fiber 代表该 DOM 节点对应的
   Fiber 节点。
2. workInProgress Fiber。如果该 DOM 节点将在本次更新中渲染到页面中
   ，workInProgress Fiber 代表该 DOM 节点对应的 Fiber 节点。
3. DOM 节点本身。
4. JSX 对象。即 ClassComponent 的 render 方法的返回结果，或 FunctionComponent 的
   调用结果。JSX 对象中包含描述 DOM 节点的信息。

Diff 算法的本质是对比 1 和 4，生成 2

## Diff 算法的时间复杂度

由于 Diff 操作本身也会带来性能损耗，即使在最前沿的算法中，将前后两棵树完全比对的
算法的复杂程度为 O(n 3 )，其中 n 是树中元素的数量。

为了降低算法复杂度，React 的 diff 会预设三个限制：

1. 只对同级元素进行 Diff。如果一个 DOM 节点在前后两次更新中跨越了层级，那么
   React 不会尝试复用他。
2. 两个不同类型的元素会产生出不同的树。如果元素由 div 变为 p，React 会销毁 div
   及其子孙节点，并新建 p 及其子孙节点。
3. 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定

### 单节点 diff

当 children 类型为 object、number、string，代表同级只有一个节点。此时使用但节点
diff。

diff 过程为： 是否存在对应 DOM 节点 -> dom 节点是否可以复用 -> 标记 dom 删除 ->
生成一个新的 fiber 节点

其中 React 通过先判断 key 是否相同，如果 key 相同则判断 type 是否相同，只有都相
同时一个 DOM 节点才能复用。

### 多节点 diff

当 children 类型为 Array，同级有多个节点. 此时使用多节点更新。
