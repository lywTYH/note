# reflow and repaint

由于浏览器的工作　是ＤＯＭ＋ＣＳＳ dom ==> render Tree ==> 绘制页面

1. reflow (回流、重排)　发生在 render tree（计算位置、属性、大小、颜色字体等）
2. repaint（重绘）发生在绘制页面这部分（绘制、外观、风格、展现形式等）

* 由于 reflow 的代价高于 repaint 且根据他们的定义知道那些行为引起回流　那些行为引起重绘

## 如何减少这些行为

1. 多次改变样式属性的操作合并成一次操作
2. 让要操作的元素进行”离线处理”，处理完后一起更新
   * 使用 DocumentFragment 进行缓存操作,引发一次回流和重绘；
   * 使用 display:none 技术，只引发两次回流和重绘;
   * 不要把 DOM 节点的属性值放在一个循环里当成循环里的变量。不然这会导致大量地读写这个结点的属性。
   * 尽可能的修改层级比较低的 DOM 节点
   * 将需要多次重排的元素，position 属性设为 absolute 或 fixed，这样此元素就脱离了文档流，它的变化不会影响到其他元素为动画的 HTML 元素，例如动画
   * 要用 tables 布局的一个原因就是 tables 中某个元素一旦触发 reflow 就会导致 table 里所有的其它元素 reflow。适合用 table 的场合，可以设置 table-layout 为 auto 或 fixed，这样可以让 table 一行一行的渲染，这种做法也是为了限制 reflow 的影响范围
   * 避免使用 CSS 的 JavaScript 表达式，如果 css 里有 expression，每次都会重新计算一遍
