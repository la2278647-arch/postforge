# PostForge 宣传文案 · 掘金（技术文章）

> 发布时标题可加 emoji。正文为 Markdown，掘金客户端支持贴代码块。本版对齐 v0.6.1。

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

- **15 个平台**：公众号 / 知乎 / 掘金 / CSDN / 语雀 / 简书 / 博客园 / 思否 / InfoQ / 小红书 / Medium / DEV.to / Typecho / WordPress / 通用网页
- **10 套主题**：clean / paper / dark / nord / coffee / midnight / one-dark / solarized / github-light / solarized-dark，可自定义
- GFM 任务清单（☑ ☐）、表格斑马纹、引用块、图片自适应
- `--toc` 目录生成（带锚点，h1-h3）、`--numbered-headings` 标题自动编号
- 排版模板：`:::tip / :::warning / :::note / :::danger / :::quote` 彩色提示卡片（quote 带装饰引号）
- 链接卡片 `:::link` 与分隔条 `:::divider`（单行语法，无需闭合）
- 发布前检查：`postforge check` 校验卡片配对、本地图片引用、重复标题、本地链接目标（带行号，支持 `--json`）
- 图片内联：`--inline-images` 本地图片转 base64，公众号粘贴自动转存素材；支持 `=WxH` 尺寸语法
- 实时预览：`postforge serve` 本地 HTTP 预览（改文件浏览器自动刷新）
- 模板库：`postforge new` 从 11 种模板一键生成草稿（FAQ/周报/OKR/产品发布/小红书种草等）
- 结构化输出：`build / batch / info / list / check --json` 五件套，脚本与 CI 友好
- MCP Server：Claude / Cursor 可直接调用 `build_post` / `check_post` / `template_list` / `template_get`
- 可作库使用：`build(markdown, { platform: 'wechat' })`
- 在线 Demo（GitHub Pages）：浏览器直接体验，无需安装

### 技术栈

- Node.js >= 18，ESM
- 仅 3 个运行时依赖：`marked`（解析）+ `highlight.js`（高亮）+ `@modelcontextprotocol/sdk`（仅 MCP 模式）
- 单元测试：`node:test`，78 个用例全绿（渲染 + CLI 集成 + MCP + 检查器）
- CI：GitHub Actions 矩阵（Node 18 / 20 / 22 / 24）

### 项目结构

```text
src/
  cli.js        命令行入口（build / batch / check / serve / new / demo / info / list / mcp）
  renderer.js   核心渲染引擎（marked 自定义 Renderer）
  themes.js     10 套排版主题
  platforms.js  15 个平台适配配置
  cards.js      排版模板扩展（提示卡片 / 链接卡片 / 分隔条）
  check.js      静态检查（卡片配对 / 图片引用 / 重复标题 / 链接目标）
  highlight.js  代码高亮 → 内联样式映射
  mcp/server.js MCP Server（4 个工具）
  index.js      公开 API
examples/       示例文章与生成结果
test/           单元测试（renderer + cli + mcp）
docs/           架构图、多平台案例、宣传文案、市场调研
```

### 下一步

- [x] 排版模板（提示卡片 / 链接卡片 / 分隔条）
- [x] MCP Server 集成（build_post / check_post / template_list / template_get）
- [x] 静态检查 postforge check（卡片 / 图片 / 标题 / 链接）
- [x] 实时预览 serve + 模板库 new
- [x] 在线 Demo + GitHub Pages
- [ ] 公众号图片一键上传（素材库 API 自动化）
- [ ] 更多主题与平台

### 地址

仓库：https://github.com/la2278647-arch/postforge
在线演示：https://la2278647-arch.github.io/postforge/demo/

MIT 协议，欢迎 Star、提 Issue、提 PR。

写一次 Markdown，随处发布 🚀
