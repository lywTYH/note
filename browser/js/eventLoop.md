# event loop

Event loop 是一种程序结构，是实现异步的一种机制。Event loop 可以简单理解为：

1. 所有任务都在主线程上执行，形成一个执行栈（execution context stack）。
2. 主线程之外，还存在一个"任务队列"（task queue）。系统把异步任务放到"任务队列"之中，然后主线程继续执行后续的任务。
3. 一旦"执行栈"中的所有任务执行完毕，系统就会读取"任务队列"。如果这个时候，异步任务已经结束了等待状态，就会从"任务队列"进入执行栈，恢复执行。
4. 主线程不断重复上面的第三步。

对 JavaScript 而言，Javascript 引擎／虚拟机（如 V8）之外，JavaScript 的运行环境（runtime，如浏览器，node）维护了任务队列，每当 JS 执行异步操作时，运行环境把异步任务放入任务队列。当执行引擎的线程执行完毕（空闲）时，运行环境就会把任务队列里的（执行完的）任务（的数据和回调函数）交给引擎继续执行，这个过程是一个不断循环的过程，称为事件循环。

注意：JavaScript（引擎）是单线程的，Event loop 并不属于 JavaScript 本身，但 JavaScript 的运行环境是多线程／多进程的，运行环境实现了 Event loop。

## 浏览器的 event loop

## node js event loop

当 Node.js 启动时，它会初始化 event loop，处理提供的代码（代码里可能会有异步 API 调用，timer，以及 process.nextTick()），然后开始处理 event loop。

### Event Loop 的执行顺序

```
┌───────────────────────┐
┌─>│ timers │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
│ │ I/O callbacks │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
│ │ idle, prepare │
│ └──────────┬────────────┘ ┌───────────────┐
│ ┌──────────┴────────────┐ │ incoming: │
│ │ poll │<─────┤ connections, │
│ └──────────┬────────────┘ │ data, etc. │
│ ┌──────────┴────────────┐ └───────────────┘
│ │ check │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
└──┤ close callbacks │
└───────────────────────┘
（图来自 Node.js API）
```

图中每个“盒子”都是 event loop 执行的一个阶段（phase）。

每个阶段都有一个 FIFO 的回调队列（queue）要执行。而每个阶段有自己的特殊之处，简单说，就是当 event loop 进入某个阶段后，会执行该阶段特定的（任意）操作，然后才会执行这个阶段的队列里的回调。当队列被执行完，或者执行的回调数量达到上限后，event loop 会进入下个阶段。

### Phases Overview 阶段总览

1. timers: 这个阶段执行 setTimeout()和 setInterval()设定的回调。
2. I/O callbacks: 执行几乎所有的回调，除了 close 回调，timer 的回调，和 setImmediate()的回调。
3. idle, prepare: 仅内部使用。
4. poll: 获取新的 I/O 事件；node 会在适当条件下阻塞在这里。
5. check: 执行 setImmediate()设定的回调。
   close callbacks: 执行比如 socket.on('close', ...)的回调。

### 各阶段详情

1. timers

    一个 timer 指定一个下限时间而不是准确时间，在达到这个下限时间后执行回调。在指定时间过后，timers 会尽可能早地执行回调，但系统调度或者其它回调的执行可能会延迟它们。

    技术上来说，poll 阶段控制 timers 什么时候执行。

    这个下限时间有个范围：[1, 2147483647]，如果设定的时间不在这个范围，将被设置为 1。

2. I/O callbacks
    这个阶段执行一些系统操作的回调。比如 TCP 错误，如一个 TCP socket 在想要连接时收到 ECONNREFUSED,
    类 unix 系统会等待以报告错误，这就会放到 I/O callbacks 阶段的队列执行。

3. poll 阶段有两个主要功能：

    * 执行下限时间已经达到的 timers 的回调
    * 处理 poll 队列里的事件。

    当 event loop 进入 poll 阶段，并且 没有设定的 timers（there are no timers scheduled），会发生下面两件事之一：

    * 如果 poll 队列不空，event loop 会遍历队列并同步执行回调，直到队列清空或执行的回调数到达系统上限；

    * 如果 poll 队列为空，则发生以下两件事之一：
        
        - 如果代码已经被 setImmediate()设定了回调, event loop 将结束 poll 阶段进入 check 阶段来执行 check 队列（里的回调）。
        
        - 如果代码没有被 setImmediate()设定回调，event loop 将阻塞在该阶段等待回调被加入 poll 队列，并立即执行。

    当 event loop 进入 poll 阶段，并且 有设定的 timers，一旦 poll 队列为空（poll 阶段空闲状态）： event loop 将检查 timers,如果有 1 个或多个 timers 的下限时间已经到达，event loop 将绕回 **timers** 阶段，并执行 **timer** 队列。

4. check

    这个阶段允许在 poll 阶段结束后立即执行回调。如果 poll 阶段空闲，并且有被 setImmediate()设定的回调，event loop 会转到 check 阶段而不是继续等待。

    setImmediate()实际上是一个特殊的 timer，跑在 event loop 中一个独立的阶段。它使用 libuv 的 API 来设定在 poll 阶段结束后立即执行回调。

    随着代码执行，event loop 终将进入 poll 阶段，在这个阶段等待 incoming connection, request 等等。但是，只要有被 setImmediate()设定了回调，一旦 poll 阶段空闲，那么程序将结束 poll 阶段并进入 check 阶段，而不是继续等待 poll 事件们 （poll events）。

5. close callbacks

    如果一个 socket 或 handle 被突然关掉（比如 socket.destroy()），close 事件将在这个阶段被触发，否则将通过 process.nextTick()触发。

### event loop 的一个例子讲述

```js
var fs = require('fs')

function someAsyncOperation(callback) {
  // 假设这个任务要消耗 95ms
  fs.readFile('/path/to/file', callback)
}

var timeoutScheduled = Date.now()

setTimeout(function() {
  var delay = Date.now() - timeoutScheduled

  console.log(delay + 'ms have passed since I was scheduled')
}, 100)

// someAsyncOperation 要消耗 95 ms 才能完成
someAsyncOperation(function() {
  var startCallback = Date.now()
  // 消耗 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
})
```

当 event loop 进入 poll 阶段，它有个空队列（fs.readFile()尚未结束）。所以它会等待剩下的毫秒，直到最近的 timer 的下限时间到了。当它等了 95ms，fs.readFile()首先结束了，然后它的回调被加到 poll
的队列并执行——这个回调耗时 10ms。之后由于没有其它回调在队列里，所以 event loop 会查看最近达到的 timer 的下限时间，然后回到 timers 阶段，执行 timer 的回调。

所以在示例里，回调被设定 和 回调执行间的间隔是 105ms。

### setImmediate() 与 setTimeout()

setImmediate() 和 setTimeout()是相似的，区别在于什么时候执行回调：

1. setImmediate()被设计在 poll 阶段结束后立即执行回调；
2. setTimeout()被设计在指定下限时间到达后执行回调。

但是当两者都在主模块（main module）调用，那么执行先后取决于进程性能，即随机。如果两者都不在主模块调用（即在一个 IO circle 中调用），那么 setImmediate 的回调永远先执行。

### process.nextTick()

process.nextTick()。从技术上来说，它并不是 event loop 的一部分。相反的，process.nextTick()会把回调塞入 nextTickQueue，nextTickQueue 将在当前操作完成后处理，不管目前处于 event loop 的哪个阶段，都会添加该阶段的最后在 event loop 进入下个阶段前处理 nextTickQueue 里的回调。

process.nextTick() vs setImmediate()
两者看起来也类似，区别如下：

1.  process.nextTick()立即在本阶段执行回调；
2.  setImmediate()只能在 check 阶段执行回调。  