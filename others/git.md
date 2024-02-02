# Git

## commit 规范

### commit message 格式

`<type>(<scope>): <subject>`

### type(必须)

- feat：新功能（feature）
- fix：修复 bug
- docs：文档（documentation）
- style：格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- perf：优化相关，比如提升性能、体验。
- test：增加测试。
- chore：构建过程或辅助工具的变动。
- revert：回滚到上一个版本。
- merge：代码合并。
- sync：同步主线或分支的 Bug。

### scope(可选)

scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同

### subject(必须)

subject 是 commit 目的的简短描述，不超过 50 个字符

## vscode 插件

git-commit-plugin
