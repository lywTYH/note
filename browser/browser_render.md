# 浏览器渲染机制

1. DOM：Document Object Model 浏览器将 HTML 解析成树形的数据结构，简称 DOM
2. CSSOM：CSS Object Model，浏览器将 CSS 代码解析成树形的数据结构
3. Render Tree：DOM 和 CSSOM 合并后生成 Render Tree (display:none 的节点不会被加入 Render Tree，而 visibility: hidden 则会)

## 关于文件的加载构建

1. Create/Update DOM And request css/image/js：浏览器请求到 HTML 代码后，在生成 DOM 的最开始阶段（应该是 Bytes → characters 后），并行发起 css、图片、js 的请求，无论他们是否在 HEAD 里
2. Create/Update Render CSSOM：CSS 文件下载完成，开始构建 CSSOM
3. Create/Update Render Tree：所有 CSS 文件下载完成，CSSOM 构建结束后，和 DOM 一起生成 Render Tree
4. Layout：有了 Render Tree，浏览器已经能知道网页中有哪些节点、各个节点的 CSS 定义以及他们的从属关系。下一步操作称之为 Layout，顾名思义就是计算出每个节点在屏幕中的位置
5. Painting：Layout 后，浏览器已经知道了哪些节点要显示（which nodes are visible）、每个节点的 CSS 属性是什么（their computed styles）、每个节点在屏幕中的位置是哪里（geometry）。就进入了最后一步：Painting，按照算出来的规则，通过显卡，把内容画到屏幕上。

* 可得顺序　加载文件＝＝》构建 cssdom ＝＝》与 DOM 一起生成 render tree ＝＝》　根据 render tree 计算对应位置＝＝》根据规则渲染到屏幕上

## 结论

1. 浏览器请求到 html 结构后，并发请求 js,css,图片等资源，并不是解析到相应节点才去发送网络请求
2. HTML 解析为 dom 树，不是简单的自上而下，而是需要不断地反复，比如解析到脚本标签，脚本修改之前已经解析的 dom，这就要往回重新解析一遍
3. HTML 解析一部分就显示一部分（不管样式表是否已经下载完成）
4. <script> 标记会阻塞文档的解析(DOM树的构建)直到脚本执行完，如果脚本是外部的，需等到脚本下载并执行完成才继续往下解析。
5. 外部资源是解析过程中预解析加载的(脚本阻塞了解析，其他线程会解析文档的其余部分，找出并加载)，而不是一开始就一起请求的(实际上看起来也是并发请求的，因为请求不相互依赖)
   * 5.1 测试根据 google time-line 可以发现第一次解析 html 的时候，外部资源好像是一起请求的，最后一次 Finish Loading 是 a.js 的，因为服务端延迟的 10 秒钟.
   - 5.2 资源是预解析加载的，就是说 style.css 和 b.js 是 a.js 造成阻塞的时候才发起的请求，图中也是可以解释得通，因为第一次 Parse HTML 的时候就遇到阻塞，然后预解析就去发起请求，所以看起来是一起请求的
