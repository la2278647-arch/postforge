# PostForge 宣传文案 · V2EX

> V2EX 风格：标题 + 正文 + "回" 引导。发在 /t/ 技术节点。本版对齐 v0.6.1。

---

## 标题

[分享创造] PostForge：开源的 Markdown 多平台排版引擎（公众号/知乎/掘金/CSDN/小红书，15 平台）

## 正文

写公众号、知乎、掘金、CSDN、小红书的各位，肯定被多平台排版折磨过：

- 公众号要全内联样式，不支持 `<style>` 和外链 CSS
- 知乎粘贴会清洗大部分自定义样式
- 小红书干脆不支持富文本，只吃纯文本

现有工具（wechat-format 之流）大多只支持公众号，还年久失修。于是我做了 **PostForge**：

- 一条命令 `postforge build post.md -p wechat`，Markdown → **15 平台**富文本（公众号/知乎/掘金/CSDN/语雀/简书/博客园/思否/InfoQ/小红书/Medium/DEV.to/Typecho/WordPress/通用网页）
- 全内联样式，粘贴即用，代码高亮（GitHub 配色）也全部内联化
- 支持 **10 套主题**（clean/paper/dark/nord/coffee/midnight/one-dark/solarized/github-light/solarized-dark）、GFM 任务清单、表格斑马纹、目录生成（--toc）、标题自动编号
- **排版模板**：`:::tip/warning/note/danger/quote` 彩色提示卡片 + `:::link` 链接卡片 + `:::divider` 分隔条
- **发布前检查**：`postforge check` 校验卡片语法配对、本地图片引用、重复标题、本地链接目标（带行号定位）
- **图片内联**：`--inline-images` 把本地图片转 base64（支持 =WxH 尺寸语法），粘贴公众号时微信自动转存素材
- **实时预览**：`postforge serve post.md` 本地起 HTTP 服务，改文件浏览器自动刷新
- **模板库**：`postforge new` 从 11 种模板一键生成草稿（FAQ/周报/OKR/产品发布/小红书种草/搬家清单等）
- 小红书走纯文本模式：正文 + 图片清单 + 自动生成话题标签
- 仅 3 个运行时依赖（marked + highlight.js + MCP SDK），零在线服务，本地渲染不传数据
- 也可作为库用：`build(markdown, { platform: 'wechat' })`
- **MCP Server**：Claude / Cursor 可直接调用排版工具
- 在线 Demo（GitHub Pages）：https://la2278647-arch.github.io/postforge/demo/

仓库与示例输出：https://github.com/la2278647-arch/postforge

MIT 协议，欢迎 star、提需求、贡献新平台/新主题。

npm test 78 个用例全绿（含 CLI 集成与 MCP 测试），主流程已在全部 15 平台验证生成。

有什么想加的平台或排版模板，评论区聊聊？
