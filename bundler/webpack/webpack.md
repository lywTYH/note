# webpack

## 基本结构

1. entry: 入口起点(entry point) 指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。
2. output: 可以通过配置 output 选项，告知 webpack 如何向硬盘写入编译文件。
3. loader: 用于对模块的源代码进行转换。 它们被编写成一类将源代码作为参数传入， 并将编译转换后的新版本代码传出的函数体。
4. plugin
5. mode
6. Modules
7. Module Resolution
8. dependency graph
9. target

## webpack5

### webpack5新特性

1. 增加持久化存储能力，提升构建性能（核心）
2. 提升算法能力来改进长期缓存（降低产物资源的缓存失效率）
3. 提升 Tree Shaking 能力降低产物大小和代码生成逻辑
4. 提升 web 平台的兼容性能力

### 优化

思路

1. 先确定哪些可以进行优化模块，webpack 主要配置（entry、output、resolve、module、performance、externals、module、plugins，其他）进行优化
2. 使用包体积检测工具 webpack-bundle-analyzer 分析包大小，着手优化
3. 使用打包速度及各个模块检测插件 speed-measure-webpack-plugin，分析着手优化

做法

1. 使用新增 cache 属性，缓存进行优化
2. resolve 部分优化 
   - externals 对第三方包进行公共包CDN引用，降低包大小
   - resolve.alias：使用别名缩短引用模块路径，降低文件解析成本
   - 合理配置 resolve.extensions 检索文件类型
3. module 部分优化
   - include和exclude：排除不需要处理loader文件（exclude优先include）
   - cache-loader（推荐）：对loader解析过的文件进行缓存
4. optimization
   - terser-webpack-plugin做代码压缩
   - optimize-css-assets-webpack-plugin（推荐）：对进行css压缩
   - splitChunks代码分割 （推荐）: 主要作用是提取公共代码，防止代码被重复打包，拆分过大的js文件，合并零散的js文件）
   - runtimeChunk：创建一个额外的文件或chunk，减少 entry chunk 体积，提高性能。
5. Plugin 部分
   - eslint-webpack-plugin：eslint-loader替代方案，可以配置自动fix，和多核编译
   - mini-css-extract-plugin (推荐) ：抽离css文件，可用于上传cdn
6. 多线程打包
   - 使用 Happypack: 打包构建时，Happypack会创建一个线程池，将构建任务模块进行拆分及分配线程，这些线程会各自去处理其中的模块以及它的依赖。处理完成之后会有一个通信的过程，会将处理好的资源传输给HappyPack的一个主进程，完成整个的一个构建过程。


### 其他

1. webpack 中 loader 和 plugin 的区别

loader，它是一个转换器，将A文件进行编译成B文件，比如：将A.less转换为A.css，单纯的文件转换过程。
plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务。比如打包优化、文件管理、环境注入等