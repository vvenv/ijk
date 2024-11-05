![ijk](./public/ijk.svg)

<p align="center">A simple, fast, and lightweight template engine for Node.js and browsers.</p>

<p align="center">
<a href="https://github.com/vvenv/ijk/actions/workflows/test.yml"><img src="https://github.com/vvenv/ijk/actions/workflows/test.yml/badge.svg" alt="test"></a>
<a href="https://github.com/vvenv/ijk/actions/workflows/test.yml"><img src="https://vvenv.github.io/ijk/badges/coverage.svg" alt="coverage"></a>
</p>

<p align="center">
  <a href="./README-zh-CN.md">中文文档</a>
</p>

## Key Features

- 📝 **Intuitive Template Syntax**: Simple syntax for variables, conditionals, and loops.
- 🔗 **Custom global variables**: Supports definition of global variables.
- 🛠️ **Built-in Tags and Filters**: A collection of built-in tags and filters.
- 🎨 **Custom Tags and Filters**: Ability to define custom tags and filters.
- 🏗️ **Template Inheritance and Reusability**: Supports template inheritance.
- 🚀 **Cache and Pre-compilation**: Enhance rendering performance by caching and precompiling.
- 🐛 **Error Handling and Debugging**: Provides detailed error reporting and debugging support.
- 🛡️ **Security**: Sandbox mode, and automatic escaping.
- 🛫 **Asynchronous Data Loading**: Supports fetching and displaying remote data asynchronously.

## Getting Started

To get started with `ijk`, simply include it in your project:

```html
<script src="https://cdn.jsdelivr.net/npm/@ijkjs/ijk/dist/ijk.umd.cjs"></script>
```

Or install it via npm/yarn:

```bash
yarn add @ijkjs/ijk --save
```

Then, you can start using `ijk` in your project:

```javascript
const template = new ijk.Template();
const { render } = template.compile('Hello, {{name}}！');
const html = render({ name: 'World' });
document.body.innerHTML = html;
```

Or, in a simpler way:

```javascript
document.body.innerHTML = ijk.template('Hello, {{name}}!', { name: 'World' });
```

## Documentation

For a comprehensive guide, API reference, and examples, please visit our [official documentation](https://vvenv.github.io/ijk/docs).

## Contributing

We welcome contributions to ijk! Please see our [contribution guide](https://vvenv.github.io/ijk/contributing) for more details.

## License

`ijk` is released under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute it as long as you comply with the license terms.

## Community

Join our community on [GitHub Discussions](https://github.com/vvenv/ijk/discussions) to ask questions, share ideas, and stay updated with the latest developments.

## Support

If you find any issues or need further assistance, please [open an issue](https://github.com/vvenv/ijk/issues) on GitHub.

---

Thank you for choosing `ijk`! We look forward to seeing what you build with it.
