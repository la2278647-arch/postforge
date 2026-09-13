<p align="center">
  <img src="docs/logo.svg" width="120" alt="PostForge" />
</p>

<h1 align="center">PostForge · 帖工坊</h1>

<p align="center">
  <b>开源的 Markdown 多平台排版引擎</b> — 一条命令把 Markdown 变成可直接粘贴发布的富文本。
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/la2278647-arch/postforge" />
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" />
  <img alt="Version" src="https://img.shields.io/github/package-json/v/la2278647-arch/postforge" />
  <img alt="Platforms" src="https://img.shields.io/badge/platforms-6-blue" />
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#支持的平台">支持的平台</a> ·
  <a href="#clI-参考">CLI 参考</a> ·
  <a href="#作为库使用">作为库使用</a> ·
  <a href="#路线图">路线图</a>
</p>

---

**English**: PostForge is an open-source, zero-config Markdown typesetting engine for Chinese content platforms (WeChat Official Account, Zhihu, Juejin, CSDN, Xiaohongshu). Write once in Markdown, publish everywhere with beautifully inlined styles — no login, no SaaS, no lock-in.

**PostForge（帖工坊）** 面向中文内容创作者：同一篇 Markdown，一键排版成 **微信公众号 / 知乎 / 掘金 / CSDN / 小红书** 的富文本。它把平台互不兼容的排版差异收敛成一个命令行工具，开箱即用、零配置、无需登录任何平台、不依赖任何在线服务。

> 为什么需要它？公众号要求全内联样式、知乎会自动清洗样式、小红书只支持纯文本——现有工具大多只覆盖公众号且年久失修。PostForge 统一了多平台排版逻辑，并支持主题定制、目录生成、代码高亮。

## ✨ 特性

- 🖥️ **6 个平台**：微信公众号、知乎、掘金、CSDN、小红书、通用网页
- 🎨 **3 套主题**：Clean 简洁 / Paper 纸感 / Dark 深色，可自定义
- 🧩 **全内联样式**：粘贴即用，不依赖 `<style>` 与外部 CSS
- 🔆 **代码高亮**：内置 GitHub 风格高亮，全部转为内联样式
- 📋 **目录生成**：`--toc` 一键生成文章目录（带锚点）
- ☑️ **任务清单**：GFM 任务列表渲染为 ☑ / ☐
- 📄 **表格 / 引用 / 图片 / 列表**：完整支持，响应式适配
- 📦 **可用作库**：`build(markdown, options)` 直接集成到你的工作流
- 🚫 **零在线依赖**：本地渲染，不传数据到任何服务器

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/la2278647-arch/postforge.git
cd postforge

# 2. 安装依赖（仅 marked + highlight.js 两个运行时依赖）
npm install

# 3. 排版你的文章
node src/cli.js build post.md -p wechat -o wechat.html
```

全局安装（可选）：

```bash
npm install -g .
postforge build post.md -p zhihu -o zhihu.html
# 或 mdx build post.md -p csdn
```

## 📱 支持的平台

| 平台 | 命令 | 输出 | 说明 |
| ---- | ---- | ---- | ---- |
| 微信公众号 | `-p wechat` | HTML 片段 | 全内联样式，粘贴进编辑器即可 |
| 知乎专栏 | `-p zhihu` | HTML 片段 | 知乎自动清洗为平台风格 |
| 掘金 | `-p juejin` | HTML 片段 | 粘贴进掘金富文本编辑器 |
| CSDN 博客 | `-p csdn` | HTML 片段 | 粘贴进 CSDN 富文本编辑器 |
| 小红书 | `-p xiaohongshu` | 纯文本 .txt | 正文 + 图片清单 + 建议话题标签 |
| 通用网页 | `-p generic` | 完整 HTML | 本地预览 / 自建博客 / 打印 |

## 🛠 CLI 参考

```text
postforge build <input.md> [选项]
postforge list
postforge -v | --version
postforge -h | --help

选项:
  -p, --platform <id>    目标平台（默认 wechat）
  -o, --output <file>    输出到文件（默认输出到 stdout）
  -t, --theme <id>       排版主题（clean / paper / dark）
      --toc              在文章开头生成目录
      --max-width <px>   内容最大宽度
      --title <t>        文档标题（generic 平台使用）
```

示例：

```bash
# 公众号 → HTML 文件
postforge build post.md -p wechat -o wechat.html

# 小红书 → 纯文本（含图片清单与话题标签）
postforge build post.md -p xiaohongshu -o xiaohongshu.txt

# 通用网页 + 目录 + 深色主题
postforge build post.md -p generic --toc --theme dark -o preview.html

# 从 stdin 读取，输出到 stdout
cat post.md | postforge build - -p zhihu
```

## 📦 作为库使用

```js
import { build, PLATFORMS, THEMES } from 'postforge';

// 渲染为微信公众号富文本
const { html } = build(markdown, { platform: 'wechat' });

// 渲染为小红书纯文本
const { text, images, hashtags } = build(markdown, { platform: 'xiaohongshu' });

// 自定义主题：在 THEMES 基础上覆盖部分样式
const { html } = build(markdown, {
  platform: 'juejin',
  theme: 'paper',
  toc: true,
});
```

## 🎨 主题

| 主题 | 风格 | 适用 |
| ---- | ---- | ---- |
| `clean` | 白底黑字、中性分段 | 绝大多数场景（默认） |
| `paper` | 米色纸感、衬线字体 | 文艺类公众号 / 随笔 |
| `dark` | 深色底、高对比 | 技术博客 / 掘金 / CSDN 深色阅读 |

自定义主题：在 `src/themes.js` 中追加一个主题对象即可，字段与现成主题完全一致。

## 🗺 路线图

- [x] 核心渲染引擎（marked + 内联样式 + 代码高亮）
- [x] 6 平台适配（微信公众号 / 知乎 / 掘金 / CSDN / 小红书 / 通用网页）
- [x] 3 套主题与目录生成
- [ ] 微信公众号图片自动上传配置说明页
- [ ] 常用排版模板（代码卡片 / 分割线卡片 / 提示框）
- [ ] MCP Server 集成（让 AI 直接输出平台文稿）
- [ ] 更多主题与平台（欢迎社区贡献）

## 🧪 开发与测试

```bash
npm test                 # 运行单元测试（node:test）
npm run demo             # 生成示例输出到 examples/
```

项目结构：

```text
src/
  cli.js        命令行入口
  renderer.js   核心渲染引擎（marked 自定义 Renderer）
  themes.js     排版主题
  platforms.js  平台适配配置
  highlight.js  代码高亮 → 内联样式映射
  index.js      公开 API
examples/       示例文章与生成结果
test/           单元测试
```

## 🤝 贡献

欢迎 Issue 与 PR！无论是新平台、新主题、还是渲染细节优化，都很有价值。请先跑通 `npm test`。

## 📄 License

[MIT](./LICENSE) © la2278647-arch

---

<p align="center"><b>PostForge · 写一次 Markdown，随处发布。</b></p>