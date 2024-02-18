# Math

S6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在
Math 对象上调用。

## Math.trunc()

Math.trunc 方法用于去除一个数的小数部分，返回整数部分

```js
Math.trunc(4.1); // 4
Math.trunc(4.9); // 4
Math.trunc(-4.1); // -4
Math.trunc(-4.9); // -4
Math.trunc(-0.1234); // -0

// 对于非数值，Math.trunc内部使用Number方法将其先转为数值。
Math.trunc('123.456'); // 123
Math.trunc(true); //1
Math.trunc(false); // 0
Math.trunc(null); // 0

// 对于空值和无法截取整数的值，返回NaN
Math.trunc(NaN); // NaN
Math.trunc('foo'); // NaN
Math.trunc(); // NaN
Math.trunc(undefined); // NaN

// pollyfill
Math.trunc = function (x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};
```

## Math.sign()

Math.sign 方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为
数值。

```js
Math.sign(-5); // -1
Math.sign(5); // +1
Math.sign(0); // +0
Math.sign(-0); // -0
Math.sign(NaN); // NaN

// pollyfill

Math.sign = function (x) {
  x = +x;
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? +1 : -1;
};
```

## Math.cbrt()

Math.cbrt()方法用于计算一个数的立方根

```js
Math.cbrt(-1); // -1
Math.cbrt(0); // 0
Math.cbrt(1); // 1
Math.cbrt(2); // 1.2599210498948732

// pollyfill
Math.cbrt = function (x) {
  var y = Math.pow(Math.abs(x), 1 / 3);
  return x > 0 ? y : -y;
};
```
