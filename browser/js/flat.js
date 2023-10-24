Array.prototype.flatA = function flatA(dep = 1) {
  const self = this;
  function flat(arr, dep) {
    if (!Array.isArray(arr)) {
      throw new TypeError('flat must used array');
    }
    let result = [];
    return dep > 0
      ? arr.forEach((value) => {
          if (Array.isArray(value)) {
            result = result.concat(flat(value, dep - 1));
          } else {
            result.push(value);
          }
        })
      : arr.slice();
  }
  return flat(self, dep);
};
Array.prototype.flatB = function flatB() {
  const self = this;
  function flat(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('flat must used array');
    }
    return arr.reduce((pre, current) => {
      if (Array.isArray(current)) {
        pre = pre.concat(flat(current));
      } else {
        pre.push(current);
      }
      return pre;
    }, []);
  }
  return flat(self);
};

Array.prototype.flatC = function flatC() {
  const self = this;
  const result = [];
  const stack = [].concat(self);
  while (stack.length > 0) {
    const value = stack.pop();
    if (Array.isArray(value)) {
      stack.push(...value);
    } else {
      result.unshift(value);
    }
  }
  return result;
};

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, 'string', {name: '弹铁蛋同学'}];

console.log(arr.flatA());
console.log(arr.flatB());
console.log(arr.flatC());
