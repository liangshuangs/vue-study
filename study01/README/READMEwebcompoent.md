## webComponent
1. 优点：原生组件，不需要框架，性能好代码少。
2. 缺点：兼容性问题
## 核心三项技术
1. Custom elements：一组JavaScript API，允许您定义custom elements及其行为，然后可以在您的用户界面中按照需要使用它们
2. Shadow DOM：一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
3. HTML templates： <template> 和 <slot> 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。