## 区别介绍
1. 源码采用monorepo方式进行管理，将模块拆分到package目录中
2. vue3采用ts开发，增强类型检测，vue2则采用flow
3. vue3性能优化，支持tree-shaking,不适用则不打包
4. vue2后期引入RFC，是每个版本改动可控rfcs

## 内部代码优化
1. vue3劫持数据采用proxy,vue2劫持数据采用defineProperty(每个属性都需要拦截，递归拦截),defineProperty有性能问题和缺陷
2. vue3中对模板编译进行优化，编译时生成了block tree，可以对子节点的动态节点进行收集，可以减少比较，并且采用pathFlag标记动态节点
3. vue3采用compositionApi 进行组织功能，解决反复横跳，优化复用逻辑（mixin带来的数据来源不清晰，命名冲突等）相比optionsApi类型推断更加方便
4. 增加了fragment teleport suspense组件

## vue3架构分析
### Monorepo介绍
mnonrepo是管理项目的一个方式，指在一个项目库中（repo）管理多个模块/包(package)
1. 一个仓库可维护多个模块，不用到处找仓库
2. 方便版本管理和依赖管理

### vue3项目结构
1. reactivity:响应式系统
2. runtime-core:与平台无关的运行时核心
3. runtime-dom:针对浏览器的运行时，包括DOM API，属性 事件处理等
3. runtime-test:用于测试
4. server-renderer:服务端渲染
5. compiler-core:与平台无关的编译器核心
6. compiler-dom:针对浏览器的编译模块
7. compiler-ssr:针对服务端渲染的编译模块
8. compiler-sfc:针对单文件解析
9. size-check: 用来测试代码同体积
10. template-explorer:用于调试编译器输出的开发工具
11. shared:多个包之间共享的内容
12. vue:完整版本，包括运行时和编译器