Function.prototype.applyFn = function apply(thisArg, args) {
  if (typeof this !== 'function') {
    throw new TypeError(this + ' is not a function');
  }
  if (typeof args === 'undefined' || args === null) {
    args = [];
  }
  if (args !== new Object(args)) {
    throw new TypeError('CreateListFromArrayLike called on non-object');
  }
  if (typeof thisArg === 'undefined' || thisArg === null) {
    thisArg = getGlobalObject();
  }
  thisArg = new Object(thisArg);
  var __fn = '__fn';
  thisArg[__fn] = this;
  var result = thisArg[__fn](...argsArray);
  
  return result;
};
