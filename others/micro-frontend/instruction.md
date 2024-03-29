# 微前端

## 什么是微前端

微服务，维基上对其定义为：一种软件开发技术- 面向服务的体系结构（SOA）架构样式的
一种变体，将应用程序构造为一组松散耦合的服务，并通过轻量级的通信协议组织起来。具
体来讲，就是将一个单体应用，按照一定的规则拆分为一组服务。这些服务，各自拥有自己
的仓库，可以独立开发、独立部署，有独立的边界，可以由不同的团队来管理，甚至可以使
用不同的编程语言来编写。但对前端来说，仍然是一个完整的服务。微服务，主要是用来解
决庞大的一整块后端服务带来的变更和扩展的限制。而微前端就是微服务思想的前端实现。

## 微前端能带给我们什么

1. 简单、分离、松耦合的代码仓库
2. 独立开发、独立部署
3. 技术栈无关
4. 遗留系统迁移

另外微前端也需要解决以下问题：

1. 子应用切换；
2. 应用相互隔离，互不干扰；
3. 子应用之间通信；
4. 多个子应用并存；
5. 用户状态的存储 - 免登；

## 其他

经过使用一段时间使用以及以前工作经历，发现很多项目并不一定需要微前端这个方案，大
部分项目并不算庞大。

当然如果用于 技术栈升级 遗留系统迁移 多技术栈项目 则是一个十分完美的解决方案，原
比以前使用 iframe 或者 路由分发要好很多。
