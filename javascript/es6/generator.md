# Generator

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同

## Generator 异步

所谓”异步”，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先
执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。 ES6 诞生以
前，异步编程的方法，大概有下面四种。

- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

其中回调函数有回调地狱的缺点，Promise 的写法只是回调函数的改进，Promise 的最大问
题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆
then，原来的语义变得很不清楚。

### co 模块

下面是一个 Generator 函数，用于依次读取两个文件。

```js
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

co 模块可以让你不用编写 Generator 函数的执行器。

```js
var co = require('co');
co(gen);
```

### co 模块原理

为什么 co 可以自动执行 Generator 函数？ Generator 就是一个异步操作的容器。它的自
动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

两种方法可以做到这一点。

- （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
- （2）Promise 对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权。

co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使
用 co 的前提条件是，Generator 函数的 yield 命令后面，只能是 Thunk 函数或 Promise
对象。如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co，详见 后文的例
子。

```js
const readFile = (filename) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// 手动执行

var g = gen();
g.next().value.then(function (data) {
  g.next(data).value.then(function (data) {
    g.next(data);
  });
});

// 自动执行

function run(gen) {
  var g = gen();
  function next(data) {
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function (data) {
      next(data);
    });
  }
  next();
}

// co source code

function co(gen) {
  const ctx = this;
  return new Promise(function (resolve, reject) {
    if (typeof gen === 'function') {
      gen = gen.call(ctx);
    }
    if (!gen || typeof gen.next !== 'function') {
      return res(gen);
    }
    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
      return null;
    }
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(
        new TypeError(
          'You may only yield a function, promise, generator, array, or object, ' +
            'but the following object was passed: "' +
            String(ret.value) +
            '"',
        ),
      );
    }
  });
}
```
