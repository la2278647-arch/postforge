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

- 9 个平台：公众号 / 知乎 / 掘金 / CSDN / 语雀 / 简书 / 博客园 / 小红书 / 通用网页
- 6 套主题：clean / paper / nord / coffee / dark / midnight，可自定义
- GFM 任务清单（☑ ☐）、表格斑马纹、引用块、图片自适应
- `--toc` 目录生成（带锚点，h1-h3）
- 排版模板：`:::tip / :::warning / :::note / :::danger / :::quote` 彩色提示卡片
- 发布前检查：`postforge check` 校验卡片配对与本地图片引用
- 图片内联：`--inline-images` 本地图片转 base64，公众号粘贴自动转存素材
- MCP Server：Claude / Cursor 可直接调用 `build_post` / `check_post` 工具
- 可作库使用：`build(markdown, { platform: 'wechat' })`

### 技术栈

- Node.js >= 18，ESM
- 仅 3 个运行时依赖：`marked`（解析）+ `highlight.js`（高亮）+ `@modelcontextprotocol/sdk`（仅 MCP 模式）
- 单元测试：`node:test`，36 个用例全绿（渲染 + CLI 集成）

### 项目结构

```text
src/
  cli.js        命令行入口（build / check / mcp / list）
  renderer.js   核心渲染引擎（marked 自定义 Renderer）
  themes.js     排版主题
  platforms.js  平台适配配置
  cards.js      排版模板扩展（提示卡片）
  check.js      静态检查（卡片配对 / 本地图片引用）
  highlight.js  代码高亮 → 内联样式映射
  mcp/server.js MCP Server
  index.js      公开 API
examples/       示例文章与生成结果
test/           单元测试（renderer + cli）
docs/           公众号图片专题、多平台案例与宣传文案
```

### 下一步

- [x] 排版模板（5 种提示卡片）
- [x] MCP Server 集成（build_post / check_post）
- [x] 静态检查 postforge check
- [ ] 公众号图片一键上传（素材库 API 自动化）
- [ ] 更多主题与平台

### 地址

仓库：https://github.com/la2278647-arch/postforge

MIT 协议，欢迎 Star、提 Issue、提 PR。

写一次 Markdown，随处发布 🚀