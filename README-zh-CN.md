![ijk](./public/ijk.svg)

<p align="center">一个简单、快速且轻量的 Node.js 和浏览器模板引擎。</p>

<p align="center">
<a href="https://github.com/vvenv/ijk/actions/workflows/test.yml"><img src="https://github.com/vvenv/ijk/actions/workflows/test.yml/badge.svg" alt="test"></a>
<a href="https://github.com/vvenv/ijk/actions/workflows/test.yml"><img src="https://vvenv.github.io/ijk/badges/coverage.svg" alt="coverage"></a>
</p>

<p align="center">
  <a href="./README.md">English Documentation</a>
</p>

## 主要特点

- 📝 **直观的模板语法**：易于理解的模板语法，用于定义变量、条件和循环。
- 🔗 **自定义全局变量**：支持定义全局变量。
- 🛠️ **内置标签和过滤器**：一组内置函数和过滤器。
- 🎨 **自定义标签和过滤器**：能够定义自定义函数和过滤器。
- 🏗️ **模板继承和重用**：支持模板继承，以创建可重用的组件和布局。
- 🚀 **缓存与预编译**：通过缓存与预编译模板来增强渲染性能。
- 🐛 **错误处理和调试**：提供详细的错误报告和调试支持。
- 🛡️ **安全性**：沙盒模式，自动转义以防止 XSS 和其他安全漏洞。
- 🛫 **异步数据加载**：支持异步获取和显示远程数据。

## 快速开始

要开始使用 `ijk`，只需将其包含在你的项目中：

```html
<script src="https://cdn.jsdelivr.net/npm/@ijkjs/ijk/dist/ijk.umd.cjs"></script>
```

或者通过 npm/yarn 安装：

```bash
yarn add @ijkjs/ijk --save
```

然后，你可以在项目中开始使用 `ijk`：

```javascript
const template = new ijk.Template();
const { render } = template.compile('你好，{{name}}！');
const html = render({ name: '世界' });
document.body.innerHTML = html;
```

或，更简单的方式：

```javascript
document.body.innerHTML = ijk.template('你好，{{name}}！', { name: '世界' });
```

## 文档

有关全面的指南、API 参考和示例，请访问我们的[官方文档](https://vvenv.github.io/ijk/docs)。

## 贡献

我们欢迎对 ijk 的贡献！有关详细信息，请参阅我们的[贡献指南](https://vvenv.github.io/ijk/contributing)。

## 许可证

`ijk` 在 [MIT 许可证](https://opensource.org/licenses/MIT) 下发布。你可以自由使用、修改和分发它，只要你遵守许可证条款。

## 社区

加入我们的[GitHub Discussions](https://github.com/vvenv/ijk/discussions)社区，提问、分享想法，并随时了解最新动态。

## 支持

如果你发现任何问题或需要进一步的帮助，请在 GitHub 上[提交问题](https://github.com/vvenv/ijk/issues)。

---

感谢你选择 `ijk`！我们期待看到你用它构建的作品。
