# 微任务与宏任务

## 事件队列与回调

在使用 JavaScript 编程时，需要用到大量的回调编程，由于 JavaScript 单线程特性，想要在完成复杂的逻辑执行情况下而不阻塞后续执行，也就是保证效率，回调时必不可少的。

浏览器设计时，一般都让页面内相关内容，比如渲染、事件监听、网络请求、文件处理等，都运行于一个单独的线程。此时要引入 JavaScript 控制文件，那 JavaScript 也会运行在于页面相同的线程上。当触发某个事件时，有单线程线性执行，这时不仅仅可能是线程中正在执行其他任务，使得当前事件不能立即执行，更可能是考虑到直接执行当前事件导致的线程阻塞影响执行效率的原因。这时事件触发的执行流程，比如函数等，将会进入回调的处理过程，而为了实现不同回调的实现，浏览器提供了一个消息队列。

当主线上下文内容都程执行完成后，会将消息队列中的回调逻辑一一取出，将其执行。这就是一个最简单的事件机制模型。

## (宏)任务和微任务

(宏)任务的定义：A task is any JavaScript code which is scheduled to be run by the standard mechanisms such as initially starting to run a program, an event callback being run, or an interval or timeout being fired. These all get scheduled on the task queue.(任何按标准机制调度进行执行的 JavaScript 代码，都是任务，比如执行一段程序、执行一个事件回调或 interval/timeout 触发，这些都在任务队列上被调度。)

微任务存定义：First, each time a task exits, the event loop checks to see if the task is returning control to other JavaScript code. If not, it runs all of the microtasks in the microtask queue. The microtask queue is, then, processed multiple times per iteration of the event loop, including after handling events and other callbacks.
Second, if a microtask adds more microtasks to the queue by calling queueMicrotask(), those newly-added microtasks execute before the next task is run.(当一个任务存在，事件循环都会检查该任务是否正把控制权交给其他 JavaScript 代码。如果不交予执行，事件循环就会运行微任务队列中的所有微任务。接下来微任务循环会在事件循环的每次迭代中被处理多次，包括处理完事件和其他回调之后。其次，如果一个微任务通过调用 queueMicrotask(), 向队列中加入了更多的微任务，则那些新加入的微任务会早于下一个任务运行 。)

(宏)任务，其实就是标准 JavaScript 机制下的常规任务，就是指消息队列中的等待被主线程执行的事件。在宏任务执行过程中，v8 引擎都会建立新栈存储任务，宏任务中执行不同的函数调用，栈随执行变化，当该宏任务执行结束时，会清空当前的栈，接着主线程继续执行下一个宏任务。

微任务，看定义中与(宏)任务的区别其实比较复杂，其中很重要的一点是，微任务必须是一个异步的执行的任务，这个执行的时间需要在主函数执行之后，也就是微任务建立的函数执行后，而又需要在当前宏任务结束之前。微任务的出现其实就是语言设计中的一种实时性和效率的权衡体现。当宏任务执行时间太久，就会影响到后续任务的执行，而此时因为某些需求，编程人员需要让某些任务在宿主环境(比如浏览器)提供的事件循环下一轮执行前执行完毕，提高实时性，这就是微任务存在的意义。

常见宏任务有 setTimeout 定时器、I/O 操作等由宿主环境提供，而常见的属于微任务有 Promise、Generator、async/await 等由语言提供。宏任务和微任务存在于不同的任务队列，而微任务的任务队列应该在宏任务执行栈完成前清空。

## Example

```js
function taskOne() {
  console.log('task one ...');
  setTimeout(() => {
    Promise.resolve().then(() => {
      console.log('task one micro in macro ...');
    });
    setTimeout(() => {
      console.log('task one macro ...');
    }, 0);
  }, 0);
  taskTwo();
}

function taskTwo() {
  console.log('task two ...');
  Promise.resolve().then(() => {
    setTimeout(() => {
      console.log('task two macro in micro...');
    }, 0);
  });

  setTimeout(() => {
    console.log('task two macro ...');
  }, 0);
}

setTimeout(() => {
  console.log('running macro ...');
}, 0); //进入消息队列

taskOne(); // 进入调入栈

Promise.resolve().then(() => {
  console.log('running micro ...');
}); // 进入微队列
```

首先，在执行的第一步，全局上下文进入调用栈，也属于常规任务，可以简单认为此执行也是执行中的一个宏任务。

在全局上下文中，setTimeout 触发设置宏任务，直接进入消息队列，而 Promise.resolve().then()中的内容进入当前宏任务执行状态下的微任务队列。taskOne 被压入调用栈。当然，因为微任务队列的存放位置，也是申请于环境对象中，可以认为微任务拥有一个单独的队列。此时当前宏任务并没有结束，taskOne 函数上下文需要被执行。函数内部的 console.log()立即执行，其中的 setTimeout 触发宏任务，进入消息队列，taskTwo 被压入调用栈。调用栈中 taskTwo 需要被执行。函数内部的 console.log()立即执行，其中的 promise 进入微任务的队列，setTimeout 进入消息队列。taskTwo 出栈执行完毕。此时当前已没有主逻辑执行的代码，而当前宏任务将执行结束，微任务会在当前宏任务完成前执行，所以微任务队列会依次执行，直到微任务队列清空。首先执行 running micro，输出打印，然后执行 taskTwo 中的 promise，setTimeout 触发宏任务进入消息队列。此时已经清空微任务队列，当前宏任务结束，主线程会到消息队列进行消费。先执行 running macro 宏任务，直接进行打印，没有对应微任务，当前结束，继续执行 taskOne setTimeout 宏任务，内部执行同理。

```js

// 完整输出

1. task one ...
2. task two ...
3. running micro ...
4. running macro ...
5. task one micro in macro ...
6. task two macro ...
7. task two macro in micro...
8. task one macro ...
```

## Node 环境区别

在 Nodejs 环境中，在 11 版本之前，同源的任务放在一起进行执行，也就是宏任务队列和微任务队列只有清空一个后才会执行另一个。后续与浏览器一致。
