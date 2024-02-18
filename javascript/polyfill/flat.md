# flat array

## 递归

```js
const arr = [
  1,
  2,
  3,
  4,
  [1, 2, 3, [1, 2, 3, [1, 2, 3]]],
  5,
  'string',
  {name: '弹铁蛋同学'},
];

function flat(arr) {
  let result = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(flat(item));
    } else {
      result.push(item);
    }
  });
  return result;
}
```

## reduce

```js
function flat(arr){
  return arr.reduce((prev,next)=>{
    return prev.concat(Array.isArray(next)? flat(next),next)
  },[])
}
```

## stack

```js
function flat(arr) {
  const result = [];
  const stack = [...arr];
  while (stack.length > 0) {
    let item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }
}
```
