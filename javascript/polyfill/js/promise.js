const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
  const self = this; // Promise的实例对象
  self.state = PENDING; // 状态属性, 初始值为pending, 代表初始未确定的状态
  self.value = undefined; // 用来存储结果数据的属性, 初始值为undefined
  self.reason = undefined;
  // 存放成功的回调
  self.onFulfilledCallbacks = [];
  // 存放失败的回调
  self.onRejectedCallbacks = [];
  const resolve = (data) => {
    if (self.state !== PENDING) return;
    self.state = FULFILLED;
    self.value = data;
    self.onFulfilledCallbacks.forEach((fn) => fn(self.value));
  };

  const reject = (reason) => {
    if (self.state !== PENDING) return;
    self.state = REJECTED;
    self.reason = reason;
    self.onRejectedCallbacks.forEach((fn) => fn(self.reason));
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError('Chaining cycle'));
  }
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    //函数或对象
    try {
      let then = x.then;
      if (typeof then === 'function') {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              resolvePromise(promise, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } catch (error) {
          if (called) return;
          reject(error);
        }
      } else {
        resolve(x);
      }
    } catch (e) {
      reject(e);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const self = this;
  const promise2 = new MyPromise((resolve, reject) => {
    const onFulfilledCallback = () => {
      setTimeout(() => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(self.value);
          } else {
            resolvePromise(promise2, onFulfilled(self.value), resolve, reject);
          }
        } catch (err) {
          reject(err);
        }
      });
    };
    const onRejectedCallback = () => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(self.reason);
          } else {
            resolvePromise(promise2, onRejected(self.reason), resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      });
    };
    if (self.state === FULFILLED) {
      onFulfilledCallback();
    }
    if (self.state === REJECTED) {
      onRejectedCallback();
    }
    if (self.state === PENDING) {
      self.onFulfilledCallbacks.push(onFulfilledCallback);
      self.onRejectedCallbacks.push(onRejectedCallback);
    }
  });
  return promise2;
};

MyPromise.deferred = function () {
  const dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

MyPromise.resolve = function (parameter) {
  if (parameter instanceof MyPromise) {
    return parameter;
  }
  return new MyPromise(function (resolve) {
    resolve(parameter);
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise(function (resolve, reject) {
    reject(reason);
  });
};

MyPromise.all = function( promiseList){
  return new MyPromise((resolve,reject)=>{
    let count = 0;
    const result = [];
    const length = promiseList.length;
    if (length === 0) {
      return resolve(result);
    }
    promiseList.forEach((promise,index)=>{
      MyPromise.resolve(promise).then((value)=>{
        count++;
        result[index++]=value;
        if(count===length){
          resolve(result);
        }
      },(reason)=>{
        reject(reason)
      })
    })
  })
}

MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};
MyPromise.prototype.finally = function (fn) {
  return this.then(
    (value) => {
      return MyPromise.resolve(fn()).then(() => value);
    },
    (err) => {
      return MyPromise.resolve(fn()).then(() => {
        throw err;
      });
    }
  );
};
new MyPromise((resolve, reject) => {
  reject('dummy');
}).then(() => {
  console.log('success');
}, null);

module.exports = MyPromise;
