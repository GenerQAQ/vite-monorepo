<div align=center style="font-size: 100px">🗿</div>
<div align=center style="font-weight: bold">MONOREPO 模版</div>

## 配置
* 🚀 [Vue 3](https://cn.vuejs.org/)，[Vite 4](https://cn.vitejs.dev/)，[PNPM](https://pnpm.io/)
* 👍 [TypeScript](https://www.typescriptlang.org/)
* 📚 [VueUse](https://vueuse.org/)
* 🧩 [Element Plus](https://element-plus.org/zh-CN/)
* 🔁 [Axios](https://axios-http.com/zh/)
* 🍍 [Pinia](https://pinia.vuejs.org/)
* 🚦 [Vue Router](https://router.vuejs.org/)
* 🌡️ [NProgress](https://rstacruz.github.io/nprogress/)

## 插件
* [vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint) - Vite 的 ESLint 插件
* [vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression) - 使用 gzip 压缩资源
* [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock/tree/main#readme) - Mock 接口插件

* [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) - 按需自动导入
* [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) - Vue 的按需组件自动导入

* [husky](https://typicode.github.io/husky/) - git hook
    * [lint-staged](https://github.com/okonet/lint-staged) - 针对暂存的git文件运行linter
    * [stylelint](https://stylelint.io/) - 强大的 CSS linter 可以帮助您避免错误并强制执行约定

* [Visuallize](https://github.com/btd/rollup-plugin-visualizer) - 可视化您的bundle

## 编码风格
* [ESLint](https://eslint.org/)
  * @ecomfe/eslint-config
  * prettier
* [Stylelint](https://stylelint.io/)
  * @ecomfe/stylelint-config

## 单元测试
* [Vitest](https://cn.vitest.dev/) - 一个 Vite 原生的单元测试框架
  * [jsdom](https://github.com/jsdom/jsdom) - 模拟 DOM 和浏览器 API
  * [Vue Test Utils](https://test-utils.vuejs.org/) - Vue 3 的官方测试套件

## 使用

```bash
git clone https://github.com/GenerQAQ/vite-monorepo.git my-vite-app
cd my-vite-app
pnpm i
```

### 开发

只需要执行以下命令就可以在终端中看到Local地址

```bash
pnpm start
```

### 构建

构建该应用只需要执行以下命令

```bash
pnpm build:all
```

然后你会看到用于发布的 `dist` 文件夹被生成
`stats.html`是打包文件内容分析

### Todo List
- [ ] 思考要不要加Tailwind css
