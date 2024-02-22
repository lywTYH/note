/**
 * 自定义 bind
 */

const isCallable = function isCallable(value) {
  if (typeof value !== 'function') {
    return false;
  }
  return true;
};
const Empty = function Empty() {};
Function.prototype.bindFn = function bindFn(fn) {
  const self = this;
  if (!isCallable(self)) {
    throw new TypeError('Function.prototype.bind called on incompatible ' + self);
  }
  const args = Array.prototype.slice.call(arguments, 1);
  function bound() {
    // bind返回的函数 的参数转成数组
    const boundArgs = [].slice.call(arguments);
    const finalArgs = args.concat(boundArgs);
    if (this instanceof bound) {
      if (self.prototype) {
        Empty.prototype = self.prototype;
        bound.prototype = new Empty();
      }
      var result = self.apply(this, finalArgs);
      var isObject = typeof result === 'object' && result !== null;
      var isFunction = typeof result === 'function';
      if (isObject || isFunction) {
        return result;
      }
      return this;
    } else {
      return self.apply(fn, finalArgs);
    }
  }
  return bound;
};

const obj = {
  name: '若川',
};
function original(a, b) {
  console.log('--------');
  console.log('this', this); // original {}
  console.log('typeof this', typeof this); // object
  this.name = b;
  console.log('name', this.name); // 2
  console.log('this', this); // original {name: 2}
  console.log([a, b]); // 1,2
}
var bound = original.bindFn(obj, 1);

var newBoundResult = new bound(2);
console.log('newBoundResult', newBoundResult);

var bb = original.bind(obj, 1);
var bbBoundResult = new bb(2);
console.log('bbBoundResult', bbBoundResult);
