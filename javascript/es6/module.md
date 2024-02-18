# Module 的加载实现

## 浏览器加载

HTML 网页中，浏览器通过`<script>`标签加载 JavaScript 脚本。默认情况下，浏览器是
同步加载 JavaScript 脚本，即渲染引擎遇到`<script>`标签就会停下来，等到执行完脚本
，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。如果脚本体积很大，下
载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何
响应。所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。

```html
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

defer 与 async 的区别是：defer 要等到整个页面在内存中正常渲染结束（DOM 结构完全
生成，以及其他脚本执行完成），才会执行；async 一旦下载完，渲染引擎就会中断渲染，
执行这个脚本以后，再继续渲染。一句话，defer 是“渲染完再执行”，async 是“下载完就
执行”。另外，如果有多个 defer 脚本，会按照它们在页面出现的顺序加载，而多个 async
脚本是不能保证加载顺序的。

## ES6 模块与 CommonJS 模块的差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

```js
// commonjs
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter;
  },
  incCounter: incCounter,
};

// main.js
console.log(mod.counter); // 3
mod.incCounter();
console.log(mod.counter); // 3

//es6
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
// main.js
import {counter, incCounter} from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

## 循环加载

CommonJS 模块的加载原理.CommonJS 的一个模块，就是一个脚本文件。require 命令第一
次加载该脚本，就会执行整个脚本，然后在内存生成一个包含 id exports 对象。后需要用
到这个模块的时候，就会到 exports 属性上面取值。即使再次执行 require 命令，也不会
再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只
会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓
存。CommonJS 模块的重要特性是加载时执行，即脚本代码在 require 的时候，就会全部执
行。一旦出现某个模块被”循环加载”，就只输出已经执行的部分，还未执行的部分不会输出
。
