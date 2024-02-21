# qiankun

qiankun 提供了一种新的微前端方案。在 `single-spa` 的基础上，qiankun 做了二次开发
，提供了通用的子应用加载、通信、预加载方案，并通过技术手段实现了应用之间的
js、css 隔离以及副作用清理工作、状态恢复，帮助开发人员更加简单快捷的实现一个微前
端应用。

## Why Not Iframe

大部分人再遇到需要微前端的时候第一时间想到的 Iframe, 乾坤的团队对此专门做了回答
。

> 如果不考虑体验问题，iframe 几乎是最完美的微前端解决方案了。 iframe 最大的特性
> 就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完
> 美解决。但他的最大问题也在于他的隔离性无法被突破，导致应用间上下文无法被共享，
> 随之带来的开发体验、产品体验的问题。
>
> 1. url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
> 2. UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩
>    层的弹框，同时> 我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动
>    居中..
> 3. 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，
>    主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
> 4. 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

## 快速开始

qiankun 是在 single-spa 的基础上做的二次开发，所以 qiankun 的用法和 single-spa
基本一样，也分为 application 模式和 parcel 模式。

application 模式是基于路由工作的，它将应用分为两类：基座应用和子应用。其中，基座
应用需要维护一个路由注册表，根据路由的变化来切换子应用；子应用是一个个独立的应用
，需要提供生命周期方法供基座应用使用。parcel 模式和 application 模式相反，它与路
由无关，子应用切换是手动控制的。

qiankun 基座应用的改造和 single-spa 基本相同，即构建一个路由注册表，然后根据路由
注册表使用 qiankun 提供的 registerMicroApps 方法注册子应用，最后执行 start 方法
来启动 qiankun。

qiankun 如何解决微前端问题的？

### 子应用加载

通常情况下，我们会将子应用的所有静态资源 - js、css、img 等打包成一个 js bundle，
然后在 loadAppFunc 中通过加载执行这个 js bundle 的方式，获取子应用提供的生命周期
方法，然后执行子应用的 mount 方法来加载子应用。这种方式称为 js Entry。

js entry 缺点：

1. bundle 名称多变
2. 静态资源都在一起，优化难以有效
3. 为了使得子应用的按需加载功能生效，需要在子应用打包过程中，修改相应的配置以补
   全子应用 js 资源的路径。

qiankun 使用 html entry 来解决 js entry 的缺点

用 qiankun 时，创建路由注册表依旧是最关键的步骤。不过不再需要给子应用定义加载方
法 - loadAppFunc，只需要确定子应用的入口 - entry 即可，子应用加载方法 -
loadAppFunc， qiankun 会实现。qiankun 是基于原生 fetch 来实现 loadAppFunc 的。简
单来说，就是加载子应用时，qiankun 会根据子应用 entry 配置项指定的 url，通过
fetch 方法来获取子应用对应的 html 内容字符串，然后解析 html 内容，收集子应用的样
式、js 脚本，安装样式并执行 js 脚本来获取子应用的生命周期方法，然后执行子应用的
mount 方法。

### js 隔离

qiankun 提供沙盒(sandbox) 实现 js 隔离。

qiankun 实现 sandbox 的原理其实很好理解，简单来说就是：

1. 为每一个子应用创建一个唯一的类 window 对象；

2. 手动执行子应用的 js 脚本，将类 window 对象作为全局变量，对全局变量的读写都作
   用在类 window 对象上；在这一步，html entry 阶段解析出来的所有 js 脚本字符串在
   执行时会先使用一个 IIFE - 立即执行函数包裹，然后通过 eval 方法手动触发，如下
   ：
   ```js
   var fakeWindowA = {name: 'appA'}; // 子应用 appA 对应的类 window 对象
   var fakeWindowB = {name: 'appB'}; // 子应用 appB 对应的类 window 对象
   var jsStr = 'console.log(name)'; // 子应用 appA、appB 的都有的脚本字符串
   var codeA = `(function(window){with(window){${jsStr}}})(fakeWindowA)`;
   var codeB = `(function(window){with(window){${jsStr}}})(fakeWindowB)`;
   eval(codeA); // appA
   eval(codeB); // appB
   ```

qiankun 在实现 sandbox 时，先构建一个空对象 - fakeWindow 作为一个假的 window 对
象，然后在 fakeWindow 的基础上通过原生的 Proxy 创建一个 proxy 对象，这个 proxy
最后会作为子应用 js 代码执行时的全局变量。有了这个 proxy，我们就可以很方便的劫持
js 代码中对全局变量的读写操作。当子应用中需要添加(修改)全局变量时，直接在
fakeWindow 中添加(修改)；当子应用需要从全局变量中读取某个属性(方法)时，先从
fakeWindow 中获取，如果 fakeWindow 中没有，再从原生 window 中获取。

```js
class ProxySandbox {
  name: string; // 沙盒的名称
  proxy: WindowProxy; // 沙盒对应的 proxy 对象
  sandboxRunning: boolean; // 判断沙盒是否激活
  // 沙盒的激活方法，当子应用挂载时，要先通过 active 方法将沙盒激活
  active() {
    // ...
    this.sandboxRunning = true;
  }
  // 沙盒的失活方法。当子应用卸载以后，要执行 inactive 方法将沙盒失活
  inactive() {
    // ...
    this.sandboxRunning = false;
  }
  constructor(name) {
    // 以子应用的名称作为沙盒的名称
    this.name = name;
    const self = this;
    // 获取原生的 window 对象
    const rawWindow = window;
    // 假的 window 对象
    const fakeWindow = {};
    // 在这里，qiankun 之所以要使用 proxy，主要是想拦截 fakeWindow 的读写等操作
    // 比如，子应用中要使用 setTimeout 方法，fakeWindow 中并没有，就需要从 rawWindow 获取
    this.proxy = new Proxy(fakeWindow, {
      set(target, key, value) {
        if (self.sandboxRunning) {
          // 沙盒已经激活
          // ...
          // 子应用新增/修改的全局变量都保存到对应的fakeWindow
          target[key] = value;
        }
      },
      get(target, key) {
        // ...
        // 读取属性时，先从 fakeWindow 中获取，如果没有，就从 rawWindow 中获取
        return key in target ? target[key] : rawWindow[key];
      },
      // ...
    });
  }
}
```

### css 隔离

1. 严格样式隔离，是基于 Web Component 的 shadow Dom 实现的。通过 shadow Dom, 我
   们可以将一个隐藏的、独立的 dom 附加到一个另一个 dom 元素上，保证元素的私有化
   ，不用担心与文档的其他部分发生冲突。 通过 shadow dom，可自动实现父子应用、多
   个子应用之间的样式隔离。
2. scoped 样式隔离。html entry 解析以后的 html 模板字符串，在添加到 container 指
   定的节点之前，会先包裹一层 div，并且为这个 div 节点添加 data-qian 属性，属性
   值为子应用的 name 属性；然后遍历 html 模板字符串中所有的 style 节点，依次为内
   部样式表中的样式添加 div["data-qiankun=xxx"] 前缀。qiankun 中子应用的 name 属
   性值是唯一的，这样通过属性选择器的限制，就可实现样式隔离。

### 子应用卸载副作用清理

每个子应用在工作过程中，或多或少都会产生一些副作用，如 setInterval 生成的定时器
、widnow.addEventListener 注册的事件、修改全局变量 window、动态添加 dom 节点等。
如果在子应用卸载的时候，不对这些副作用进行处理，那么将会造成内存泄漏，甚至会对下
一个子应用造成影响。

1. setInterval 引发的副作用，qiankun 是通过劫持原生的 setInterval 方法来解决的。
   通过劫持 setInterval，子应用生成的定时器都会被收集，当子应用卸载时，收集的定
   时器会自动被 qiankun 清除掉。
2. window.addEventListener 引发的副作用，qiankun 也是通过劫持原生的
   window.addEventListener、window.removeEventListener 来处理的

### 子应用重新挂载状态恢复

在实际的微前端项目中，我们除了要在子应用卸载时清除副作用，还需要在子应用重新挂载
时恢复子应用的状态。

子应用重新加载时，需要恢复的状态包括：

1. 子应用修改的全局变量；
2. 子应用动态添加的 style；

### 子应用通信

qiankun 提供的 通信机制 是基于发布订阅模式实现的。主应用通过 initGlobalState 方
法创建一个全局的 globalState，并维护一个 deps 列表来收集订阅。订阅方法
onGlobalStateChange 和修改 globalState 的 setGlobalState 方法，会在子应用的生命
周期方法执行时传递给子应用。子应用首先通过 onGlobalStateChange 方法绑定
callback，该 callback 会添加到 golbalState 的 deps 列表中。当我们通过
setGlobalState 方法修改 globalState 时，qiankun 会遍历 deps 列表，依次触发收集的
callback。子应用卸载时，绑定的 callback 会被卸载，从 deps 列表中移除。

## qiankun 工作流程

- `定义路由注册表` - > `注册子应用` ->
  `创建 globalState,执行 start`->`资源预加载` -> `找到对应子应用` ->
  `是否有子应用卸载`->`要激活的子应用是否加载`->
  `挂载 sandbox`->`触发 beforeMount`->`执行子应用 mount`->`触发 afterMount`

- `是否有子应用卸载` -> `触发 beforeUnmount` -> `执行子应用 unmount` ->
  `卸载 sandbox` -> `触发 afterUnMount` ->`清除子应用 html`->
  `注销订购的 global state`-> `要激活的子应用是否加载`

- `要激活的子应用是否加载` -> `通过 html entry 加载` ->`渲染 html`
  ->`创建 sandbox`->`触发 beforeLoad`->`执行 js`->`设置子应用和 globalState 关联`->`挂载 sandbox`

1. 定义路由注册表： 确定每个路由的 name entry controller activeRule 等
2. 注册子应用：遍历路由注册表，通过 registerMicroApps 注册子应用
3. 创建 globalState,执行 start: 遍历 apps 中收集的子应用逐个执行 activeFunc 方法
   找到匹配的子应用，匹配的子应用激活，卸载前子应用。
