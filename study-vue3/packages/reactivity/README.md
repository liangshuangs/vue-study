## 依赖
typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-json execa

```
 "name": "@vue/reactivity",
  "version": "1.0.0",
  "main": "index.js", // common.js入口
  "module":"dist/reactivity.esm-bundler.js", // es6入口
  "license": "MIT",
  "buildOptions": {
    "name": "VueReactivity",
    "formats": [
      "cjs",
      "esm-bundler",
      "global"
    ]
  }
}
```
