# PostForge 宣传文案 · 掘金（技术文章）

> 发布时标题可加 emoji。正文为 Markdown，掘金客户端支持贴代码块。

---

## 标题

开源｜PostForge：Markdown 多平台排版引擎，公众号/知乎/掘金/CSDN/小红书一条命令全部搞定

## 正文

### 为什么做这个东西

内容创作者（尤其是技术作者）都有过这种经历：文章在 Markdown 里写好之后，要分别登录公众号、知乎、掘金、CSDN……每个平台的排版规则都不一样：

- 微信公众号：只认内联样式，`<style>` 和外部 CSS 一律不生效
- 知乎：粘贴后大部分自定义样式会被清洗成平台风格
- 小红书：干脆不支持富文本，只接受纯文本 + 图片

于是每发一个平台，就要手动调整一遍格式，非常痛苦。市面上的在线工具大多年久失修，而且只支持公众号。

所以我写了 **PostForge（帖工坊）**：一个开源的 Markdown 多平台排版引擎。

### 它做了什么

```bash
# 公众号
postforge build post.md -p wechat -o wechat.html

# 知乎 / 掘金 / CSDN
postforge build post.md -p zhihu -o zhihu.html
postforge build post.md -p juejin -o juejin.html

# 小红书（纯文本 + 图片清单 + 话题标签）
postforge build post.md -p xiaohongshu -o xiaohongshu.txt

# 通用网页（带目录、可打印）
postforge build post.md -p generic --toc -o preview.html
```

核心思路：基于 marked 的自定义 Renderer，把每个元素渲染成带内联样式的 HTML。代码高亮用 highlight.js，再把 token class（`hljs-keyword` 等）映射成内联颜色，这样公众号也能显示高亮。

支持的特性：

- 6 个平台：公众号 / 知乎 / 掘金 / CSDN / 小红书 / 通用网页
- 3 套主题：clean / paper / dark，可自定义
- GFM 任务清单（☑ ☐）、表格斑马纹、引用块、图片自适应
- `--toc` 目录生成（带锚点，h1-h3）
- 可作库使用：`build(markdown, { platform: 'wechat' })`

### 技术栈

- Node.js >= 18，ESM
- 仅两个运行时依赖：`marked`（解析）+ `highlight.js`（高亮）
- 单元测试：`node:test`，13 个用例全绿

### 项目结构

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

### 下一步

- [ ] 排版模板（代码卡片 / 提示框 / 分割线）
- [ ] MCP Server 集成，让 AI 直接产出平台文稿
- [ ] 更多主题与平台

### 地址

仓库：https://github.com/la2278647-arch/postforge

MIT 协议，欢迎 Star、提 Issue、提 PR。

写一次 Markdown，随处发布 🚀