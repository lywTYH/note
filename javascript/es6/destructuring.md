# 变量的解构赋值

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构
（Destructuring），解构本质上是一种模式匹配。如果解构不成功，变量的值就等于
undefined。解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。
由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错。

## 数组的解构赋值

只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

```javascript
let [a, b, c] = [1, 2, 3];

// success
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo; // 1
bar; // 2
baz; // 3
let [, , third] = ['foo', 'bar', 'baz'];
third; // "baz"
let [x, , y] = [1, 2, 3];
x; // 1
y; // 3
let [head, ...tail] = [1, 2, 3, 4];
head; // 1
tail; // [2, 3, 4]
let [x, y, ...z] = ['a'];
x; // "a"
y; // undefined
z; // []

// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

// set
let [x, y, z] = new Set(['a', 'b', 'c']);
x; // "a"

// 默认值
let [x = 1, y = x] = []; // x=1; y=1
let [x = 1, y = x] = [2]; // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = []; // ReferenceError: y is not defined
```

## 对象的解构赋值

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置
决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```js
let {bar, foo} = {foo: 'aaa', bar: 'bbb'};
foo; // "aaa"
bar; // "bbb"
let {baz} = {foo: 'aaa', bar: 'bbb'};
baz; // undefined

let obj = {
  p: ['Hello', {y: 'World'}],
};
let {
  p: [x, {y}],
} = obj;
x; // "Hello"
y; // "World"

// 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构

let arr = [1, 2, 3];
let {0: first, [arr.length - 1]: last} = arr;
first; // 1
last; // 3
```

## 字符串的解构赋值

字符串也可以解构赋值。字符串被转换成了一个类似数组的对象。类似数组的对象都有一个
length 属性，因此还可以对这个属性解构赋值。

## 数值和布尔值的解构赋值

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

```js
let {toString: s} = 123;
s === Number.prototype.toString; // true
let {toString: s} = true;
s === Boolean.prototype.toString; // true
```
