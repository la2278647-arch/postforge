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
  <img alt="Platforms" src="https://img.shields.io/badge/platforms-16-blue" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Server-7c3aed" />
</p>

<p align="center">
  <a href="https://la2278647-arch.github.io/postforge/demo/" target="_blank">🚀 在线演示（浏览器直接体验）</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#支持的平台">支持的平台</a> ·
  <a href="#clI-参考">CLI 参考</a> ·
  <a href="#作为库使用">作为库使用</a> ·
  <a href="#路线图">路线图</a>
</p>

---

**English**: Full English docs at [**README.en.md**](README.en.md). PostForge is an open-source, zero-config Markdown typesetting engine for Chinese content platforms (WeChat Official Account, Zhihu, Juejin, CSDN, Xiaohongshu). Write once in Markdown, publish everywhere with beautifully inlined styles — no login, no SaaS, no lock-in.

**PostForge（帖工坊）** 面向中文内容创作者：同一篇 Markdown，一键排版成 **微信公众号 / 知乎 / 掘金 / CSDN / 小红书** 的富文本。它把平台互不兼容的排版差异收敛成一个命令行工具，开箱即用、零配置、无需登录任何平台、不依赖任何在线服务。

> 为什么需要它？公众号要求全内联样式、知乎会自动清洗样式、小红书只支持纯文本——现有工具大多只覆盖公众号且年久失修。PostForge 统一了多平台排版逻辑，并支持主题定制、目录生成、代码高亮。

## ✨ 特性

- 🖥️ **16 个平台**：微信公众号、知乎、掘金、CSDN、语雀、简书、博客园、思否、InfoQ、小红书、Medium、DEV.to、Hashnode、Typecho、WordPress、通用网页
- 🎨 **11 套主题**：Clean 简洁 / Paper 纸感 / Nord 冷调 / Coffee 咖啡 / Dark 深色 / Midnight 深夜 / One Dark / Solarized / GitHub Light / Solarized Dark / Mint 薄荷，可自定义
- 🧩 **全内联样式**：粘贴即用，不依赖 `<style>` 与外部 CSS
- 🔆 **代码高亮**：内置 GitHub 风格高亮，全部转为内联样式
- 📋 **目录生成**：`--toc` 一键生成文章目录（带锚点）
- ☑️ **任务清单**：GFM 任务列表渲染为 ☑ / ☐
- 🧱 **排版模板**：`:::tip` `:::warning` `:::note` `:::danger` `:::quote` 彩色提示卡片，内容支持任意 Markdown
- ✅ **静态检查**：`postforge check` 发布前校验卡片语法配对 / 本地图片引用 / 重复标题 / 本地链接目标（带行号）
- 📋 **模板库入口**：`postforge new` 从内置模板一键生成草稿（new list 查看 12 种模板）
- 📷 **图片内联**：`--inline-images` 本地图片转 base64，粘贴公众号自动转存素材
- 📄 **表格 / 引用 / 图片 / 列表**：完整支持，响应式适配
- 📦 **可用作库**：`build(markdown, options)` 直接集成到你的工作流
- 🤖 **MCP Server**：Claude / Cursor 等 AI 可直接调用排版工具
- 🚫 **零在线依赖**：本地渲染，不传数据到任何服务器

## 📐 架构

[打开交互式架构图](docs/diagram/dataflow-postforge.html)（可缩放 · 深浅主题 · 聚焦视图 · 关系追踪）

<img src="docs/diagram/dataflow-postforge.visual-check.1440x900.light.png" alt="PostForge 排版流水线" width="720" />

> 流水线：Markdown 单源 → Lexer 解析（含 `:::` 卡片扩展）→ PostRenderer 全内联样式渲染 → 六平台输出 → 粘贴发布 / AI 消费。

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/la2278647-arch/postforge.git
cd postforge

# 2. 安装依赖（marked + highlight.js + MCP SDK）
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

## 🎬 效果演示

同一篇 Markdown，三种形态的输出：

**输入（Markdown）**：

````markdown
:::tip 小贴士
PostForge 支持排版模板与代码高亮。
:::

:::divider 第二章

| 平台 | 命令 |
| ---- | ---- |
| 公众号 | `-p wechat` |

![示意图](https://a.com/pic.png =300x200)

```js
const hello = 'world';
```
````

**公众号输出**（全内联样式，粘贴即用）：

```html
<div style="border-left:4px solid #16a34a;border-radius:8px;padding:14px 16px;...">
  <strong style="color:#16a34a">小贴士</strong>
  <p style="margin-bottom:16px">PostForge 支持排版模板与代码高亮。</p>
</div>
<table style="border-collapse:collapse;...">...</table>
<pre style="background-color:#f6f8fa;..."><code><span style="color:#d73a49">const</span> hello = <span style="color:#032f62">'world'</span>;</code></pre>
```

**小红书输出**（纯文本 + 图片清单 + 话题标签）：

```text
【小贴士】PostForge 支持排版模板与代码高亮。
```

更多完整案例见 [📁 模板库](#-模板库) 与 [✨ 自举案例](#-自举案例)。

## 📱 支持的平台

| 平台 | 命令 | 输出 | 说明 |
| ---- | ---- | ---- | ---- |
| 微信公众号 | `-p wechat` | HTML 片段 | 全内联样式，粘贴进编辑器即可 |
| 知乎专栏 | `-p zhihu` | HTML 片段 | 知乎自动清洗为平台风格 |
| 掘金 | `-p juejin` | HTML 片段 | 粘贴进掘金富文本编辑器 |
| CSDN 博客 | `-p csdn` | HTML 片段 | 粘贴进 CSDN 富文本编辑器 |
| 语雀 | `-p yuque` | HTML 片段 | 粘贴进语雀（知识库 / 文档） |
| 简书 | `-p jianshu` | HTML 片段 | 粘贴进简书编辑器 |
| 博客园 | `-p cnblogs` | HTML 片段 | 粘贴进博客园编辑器 |
| 思否 | `-p sf` | HTML 片段 | 粘贴进思否（SegmentFault）编辑器 |
| InfoQ 中文 | `-p infoq` | HTML 片段 | 粘贴进 InfoQ 中文编辑器 |
| Medium | `-p medium` | HTML 片段 | 国际技术写作平台 |
| DEV.to | `-p devto` | HTML 片段 | 国际开发者社区 |
| Typecho 博客 | `-p typecho` | HTML 片段 | 自建博客后台粘贴 |
| Hashnode | `-p hashnode` | HTML 片段 | 国际开发者博客 |
| WordPress | `-p wordpress` | HTML 片段 | 自建博客粘贴 |
| 小红书 | `-p xiaohongshu` | 纯文本 .txt | 正文 + 图片清单 + 建议话题标签 |
| 通用网页 | `-p generic` | 完整 HTML | 本地预览 / 自建博客 / 打印 |

## 🛠 CLI 参考

```text
postforge build <input.md> [选项]
postforge batch <目录> [选项]
postforge check <input.md>             静态检查：卡片配对 / 图片与链接引用 / 重复标题
postforge info <input.md>
postforge serve <input.md> [--port N]   本地 HTTP 实时预览（改文件浏览器自动刷新）
postforge demo                           一键体验：本地预览示例文章（自动打开浏览器）
postforge new <模板> [-o 文件]           从模板库生成文章草稿（new list 查看）
postforge mcp
postforge list
postforge doctor
postforge -v | --version
postforge -h | --help

选项:
  -p, --platform <id>    目标平台（默认 wechat）
  -o, --output <file>    输出到文件（默认输出到 stdout）
  -t, --theme <id>       排版主题（11 套：clean / paper / nord / coffee / solarized / github-light / dark / midnight / one-dark / solarized-dark / mint）
      --toc              在文章开头生成目录
      --numbered-headings  给 h1/h2/h3 自动加编号（如 1. / 1.1 / 1.1.1）
      --watch              监听输入文件变化自动重建（边写边预览）
      --max-width <px>   内容最大宽度
      --title <t>        文档标题（generic 平台使用）
      --inline-images    本地图片内联为 base64（粘贴公众号自动转存）
```

示例：

```bash
# 公众号 → HTML 文件
postforge build post.md -p wechat -o wechat.html

# 小红书 → 纯文本（含图片清单与话题标签）
postforge build post.md -p xiaohongshu -o xiaohongshu.txt

# 通用网页 + 目录 + 深色主题
postforge build post.md -p generic --toc --theme dark -o preview.html

# 本地图片内联：粘贴公众号一步到位，微信自动转存素材库 CDN
postforge build post.md -p wechat --inline-images -o wechat.html

# 发布前静态检查：卡片语法配对 / 本地图片引用
postforge check post.md

# 从 stdin 读取，输出到 stdout
cat post.md | postforge build - -p zhihu

# 批量排版：目录下所有 .md → 输出目录（下划线开头文件视为草稿跳过）
postforge batch posts/ -p wechat -o dist/
```

## 🤖 MCP Server（AI 直接排版）

PostForge 自带一个 [Model Context Protocol](https://modelcontextprotocol.io) 服务器，让 Claude、Cursor 等支持 MCP 的 AI 直接调用排版能力：你只需用自然语言描述，AI 就调用工具返回目标平台的富文本。

```bash
# 启动（stdio 传输）
npm run mcp          # 或 postforge mcp
```

暴露的工具：

| 工具 | 说明 |
| ---- | ---- |
| `list_platforms` | 列出支持的平台 |
| `list_themes` | 列出排版主题 |
| `build_post` | 把 Markdown 排版为目标平台富文本（`markdown` / `platform` / `theme` / `toc` / `maxWidth`） |
| `check_post` | 发布前静态检查（卡片配对 / 图片引用 / 重复标题 / 链接目标） |
| `get_post_stats` | 文章统计（字数 / 图片 / 代码块 / 标题 / 阅读时长） |
| `template_list` | 列出模板库可用文章模板（名称 + 标题） |
| `template_get` | 按名称获取模板完整 Markdown（如 `tech-tutorial` / `wechat-article`），直接作为创作起点 |

### 在 Claude Code 中配置

```bash
claude mcp add --scope project postforge -- node C:/path/to/postforge/src/mcp/server.js
```

### 在 Cursor 中配置

`.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "postforge": {
      "command": "node",
      "args": ["C:/path/to/postforge/src/mcp/server.js"]
    }
  }
}
```

之后直接对 AI 说：「把下面这篇文章排版成公众号格式」即可拿到可粘贴的富文本。

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
| `nord` | 北欧冷灰蓝 | 技术阅读、工具类文章 |
| `coffee` | 咖啡暖棕纸感 | 生活随笔 / 读书笔记 |
| `solarized` | 经典护眼浅色 | 长时间阅读 / 文档 |
| `mint` | 薄荷绿清新浅色 | 生活 / 健康 / 自然类内容 |
| `github-light` | GitHub 官方浅色 | 代码 / 技术文档 |
| `dark` | 深色底、高对比 | 深色阅读 / 夜间模式 |
| `midnight` | 深夜蓝黑底 | 技术博客夜间版 |
| `one-dark` | Atom 编辑器深色 | 程序员审美 / 代码文章 |
| `solarized-dark` | Solarized 护眼深色 | 夜间阅读的护眼之选 |

自定义主题：在 `src/themes.js` 中追加一个主题对象即可，字段与现成主题完全一致（可用 `makeTheme` 基于 `clean` 派生，只覆盖差异配色）。

**无需改代码的自定义主题**：用 `--theme-file` 加载 JSON（深合并到基础主题，未覆盖字段自动继承）：

```bash
postforge build post.md -p wechat --theme-file my-theme.json
```

```json
{ "id": "brand", "container": { "color": "#1f3a5f" }, "link": { "color": "#2f6fb0" } }
```

内置示例：`examples/themes/brand-blue.json`（品牌蓝主题）。库用法：`build(md, { themeObj: { ... } })`。

## 🧱 排版模板（提示卡片）

在 Markdown 中用 `:::` 语法插入彩色提示卡片，内容支持任意 Markdown（段落、列表、代码、链接等）：

````markdown
:::tip 小贴士
这是绿色提示卡片的内容。
:::

:::warning 注意
这是橙色警告卡片的内容。
:::

:::note 要点
这是蓝色说明卡片的内容。
:::

:::danger 高危
这是红色风险卡片的内容。
:::

:::quote
纸上得来终觉浅，绝知此事要躬行。
:::

:::divider 第二章
:::divider

:::link PostForge 仓库 https://github.com/la2278647-arch/postforge

:::code 安装示例
```bash
npm install postforge
```
:::
````

| 类型 | 颜色 | 用途 |
| ---- | ---- | ---- |
| `:::tip` | 绿 | 技巧 / 提示 |
| `:::warning` | 橙 | 警告 / 注意 |
| `:::note` | 蓝 | 说明 / 要点 |
| `:::danger` | 红 | 风险 / 必须注意 |
| `:::quote` | 紫 | 语录 / 引用（无标题时自动带装饰引号） |
| `:::divider` | 中性 | 章节分隔条（单行语法，无需闭合；无文字时渲染纯分隔线） |
| `:::link` | 中性 | 链接卡片（单行语法：`:::link 标题 URL`；🔗 图标 + 域名显示） |
| `:::code` | 中性 | 代码卡片（`:::code 标题` + \`\`\` 代码 \`\`\` + `:::`；标题栏 + 高亮代码） |

标题可省略：`:::note\n内容\n:::`。卡片配色跟随主题（11 套主题各自适配），实现见 `src/cards.js`。
忘记闭合或写错类型？发布前跑 `postforge check post.md` 会精确定位错误行。

## 📷 图片尺寸语法

在图片链接后追加 `=WxH`（宽×高）或 `=W`（仅宽）控制显示尺寸——公众号排版控制配图大小刚需：

```markdown
![架构图](images/arch.png =600x400)   <!-- 固定 600×400 -->
![封面](https://a.com/cover.png =500) <!-- 仅限宽 500 -->
```

显式尺寸会覆盖主题的 `max-width:100%` 限制；本地图片配 `--inline-images` 时尺寸语法同样生效。

## ✅ 发布前检查

```bash
postforge check post.md
# → ✓ 检查通过：123 行，0 错误
# → ✗ 检查未通过：1 个错误 / [错误] 第 8 行：:::tip 卡片未闭合
```

检查项：模板卡片语法配对与类型合法性（错误，阻塞）；本地图片引用存在性（警告，不阻塞）。

## 📷 公众号图片：一步到位

公众号不支持外链图片，`--inline-images` 把本地图片内联为 base64，粘贴时微信自动转存为
`mmbiz.qpic.cn` 素材地址：

```bash
postforge build post.md -p wechat --inline-images -o wechat.html
```

完整方案（素材库手动替换 / 批量替换脚本 / FAQ）见 [`docs/wechat-images.md`](docs/wechat-images.md)。

## 📁 模板库

`examples/templates/` 提供三篇开箱即用的排版模板，复制改改就能发：

| 模板 | 适用 | 特点 |
| ---- | ---- | ---- |
| [`tech-tutorial.md`](examples/templates/tech-tutorial.md) | 技术教程 | 收获卡片 / 步骤 / 避坑卡 / 原理说明 / 行动清单 |
| [`wechat-article.md`](examples/templates/wechat-article.md) | 公众号文章 | 金句卡 / 对比表格 / 划重点 / 行动号召 |
| [`xiaohongshu-draft.md`](examples/templates/xiaohongshu-draft.md) | 小红书笔记 | 卖点卡 / 步骤 / 效果对比 / 图片清单 / 话题标签 |
| [`weekly-report.md`](examples/templates/weekly-report.md) | 周报 | 概览卡 / 完成清单 / 数据表格 / 风险提示 / 下周计划 |
| [`product-launch.md`](examples/templates/product-launch.md) | 产品发布 | 亮点卡 / 升级指南 / 版本信息 / 路线图 |
| [`meeting-notes.md`](examples/templates/meeting-notes.md) | 会议纪要 | 议题结论 / 行动项表格 / 待确认事项 / 下次会议 |
| [`faq.md`](examples/templates/faq.md) | FAQ 文档 | 分主题问答 / 排查步骤 / 使用技巧 / 更新说明 |
| [`reading-notes.md`](examples/templates/reading-notes.md) | 读书笔记 | 核心观点卡 / 行动清单 / 摘抄 / 荐读人群 |
| [`okr.md`](examples/templates/okr.md) | OKR 规划 | 目标/关键结果卡 / 进度追踪表 / 风险依赖 / 季度复盘 |
| [`travel-plan.md`](examples/templates/travel-plan.md) | 旅行计划 | 行前清单 / 行程安排 / 美食清单 / 预算明细 / 避坑提醒 |
| [`moving-checklist.md`](examples/templates/moving-checklist.md) | 搬家清单 | 分房间打包清单 / 搬家日流程 / 入住 checklist / 预算 |
| [`study-plan.md`](examples/templates/study-plan.md) | 学习计划 | 目标拆解 / 阶段规划 / 资源清单 / 每周复盘 / 防放弃 |

发布前体检：`postforge check`（语法 + 图片）与 `postforge info`（字数 / 阅读时长 / 素材统计）。

## ✨ 自举案例

[`docs/case/announce.md`](docs/case/announce.md) 是一篇真实的 PostForge 发布文，下方文件就是**用 PostForge 自己排版**的成品，可直接打开 / 复制使用：

| 输出 | 说明 |
| ---- | ---- |
| [`announce-generic.html`](docs/case/announce-generic.html) | 完整网页（含目录），浏览器直接打开预览 |
| [`announce-wechat.html`](docs/case/announce-wechat.html) | 公众号富文本，粘贴进编辑器即可 |
| [`announce-xiaohongshu.txt`](docs/case/announce-xiaohongshu.txt) | 小红书纯文本 + 图片清单 + 话题标签 |

**技术深挖**：[`tech-deep.md`](docs/case/tech-deep.md)（中文）与 [`tech-deep.en.md`](docs/case/tech-deep.en.md)（English）是 PostForge 实现剖析（讲清楚内联样式渲染、marked 扩展、代码高亮内联化与踩过的坑），同样用项目自身排版：

| 输出 | 说明 |
| ---- | ---- |
| [`tech-deep-generic.html`](docs/case/tech-deep-generic.html) | 中文完整网页（含目录） |
| [`tech-deep-juejin.html`](docs/case/tech-deep-juejin.html) | 中文掘金富文本 |
| [`tech-deep-wechat.html`](docs/case/tech-deep-wechat.html) | 中文公众号富文本 |
| [`tech-deep-en-generic.html`](docs/case/tech-deep-en-generic.html) | **English** 完整网页（含目录） |
| [`tech-deep-en-wechat.html`](docs/case/tech-deep-en-wechat.html) | **English** 公众号富文本 |

**快速上手**：[`getting-started.md`](docs/case/getting-started.md) 是一篇从安装到发布的新手教程（5 分钟流程），同样自举排版：

| 输出 | 说明 |
| ---- | ---- |
| [`getting-started-generic.html`](docs/case/getting-started-generic.html) | 完整网页（含目录） |
| [`getting-started-wechat.html`](docs/case/getting-started-wechat.html) | 公众号富文本 |

## 🗺 路线图

- [x] 核心渲染引擎（marked + 内联样式 + 代码高亮）
- [x] 16 平台适配 + 11 套主题 + 目录生成
- [x] MCP Server 集成（AI 直接排版输出）
- [x] 排版模板（:::tip / :::warning / :::note / :::danger / :::quote）
- [x] 公众号图片处理（docs/wechat-images.md 专题 + --inline-images）
- [x] 静态检查（postforge check）
- [ ] 公众号图片一键上传（素材库 API 自动化）
- [ ] 更多主题与平台（欢迎社区贡献）

## 🧪 开发与测试

```bash
npm test                 # 运行单元测试（node:test）
npm run demo             # 生成示例输出到 examples/
node scripts/benchmark.mjs   # 渲染性能基准（5K/50K/200K 字文档最快耗时）
```

**本地质量门禁**（可选）：启用 pre-commit 钩子后，每次提交自动跑测试、失败即阻止：

```bash
git config core.hooksPath .githooks   # 启用 .githooks/pre-commit
```

项目结构：

```text
src/
  cli.js        命令行入口（build / check / mcp / list）
  renderer.js   核心渲染引擎（marked 自定义 Renderer）
  themes.js     排版主题（11 套：clean / paper / nord / coffee / solarized / github-light / dark / midnight / one-dark / solarized-dark / mint）
  platforms.js  平台适配配置
  cards.js      排版模板扩展（提示卡片，工厂函数绑定主题）
  check.js      静态检查（卡片配对 / 本地图片引用）
  highlight.js  代码高亮 → 内联样式映射
  mcp/server.js MCP Server（AI 调用入口）
  index.js      公开 API
examples/       示例文章与生成结果
test/           单元测试（renderer + cli 集成）
docs/           公众号图片专题、多平台发布案例与宣传文案
.github/        CI 与 Issue/PR 模板
```

技术栈：Node.js >= 18 ESM；运行时依赖 `marked` + `highlight.js` + `@modelcontextprotocol/sdk`；单元测试 `node:test`；CI 工作流见 [`_tools/ci.yml.bak`](_tools/ci.yml.bak)（Node 18/20/22/24 矩阵；推送至 `.github/workflows/` 需 workflow scope，获得后恢复启用）。

## 🤝 贡献

欢迎 Issue 与 PR！无论是新平台、新主题、还是渲染细节优化，都很有价值。请先跑通 `npm test`。

**更多文档**：[项目全景总结](docs/PROJECT-SUMMARY.md) · [宣传速递](docs/promotion/quick-share.md) · [CHANGELOG](CHANGELOG.md)

## 📄 License

[MIT](./LICENSE) © la2278647-arch

---

<p align="center"><b>PostForge · 写一次 Markdown，随处发布。</b></p>