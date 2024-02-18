const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, 'string', {name: '弹铁蛋同学'}];
// concat + 递归
function flat(arr) {
  let arrResult = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      arrResult = arrResult.concat(flat(item)); // 递归
    } else {
      arrResult.push(item);
    }
  });
  return arrResult;
}

function reduceFlat(arr) {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? reduceFlat(next) : next);
  }, []);
}

function stackFlat(arr) {
  const result = [];
  const stack = [...arr];
  while (stack.length > 0) {
    let item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...stack);
    } else {
      result.unshift(item);
    }
  }
  return result;
}
console.log(flat(arr));
console.log(stackFlat(arr));
