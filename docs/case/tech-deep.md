# PostForge 实现剖析：用几百行代码做一个多平台 Markdown 排版引擎

> 本文是 PostForge（帖工坊）的技术拆解，解释它背后的实现思路与踩过的坑。
> 项目地址：https://github.com/la2278647-arch/postforge

## 痛点：公众号的「内联样式」诅咒

如果你为公众号写过排版，一定知道这条铁律：**公众号编辑器不认 `<style>` 标签，也不认外部 CSS，只认每个元素上的 inline style**。粘贴带 class 的 HTML，样式直接全部丢失。

而知乎会清洗样式、掘金有自己的主题、CSDN 半保留 class、小红书干脆只支持纯文本。结果就是：同一篇文章，每个平台都要手工重排一遍。

PostForge 的思路很朴素：与其在各种编辑器之间做适配，不如**把所有平台都需要的样式，提前内联到每个元素上**，让任何平台"粘贴即所得"。

```text
Markdown ──► 解析 ──► 内联样式 HTML ──► 粘贴到任意平台
```

## 核心：自定义 marked Renderer

PostForge 的渲染引擎基于 `marked`（一个成熟的 Markdown 解析器）。它的工作流是两段式：

1. **Lexer**：把 Markdown 源文本解析成语义化 token 流（`heading`、`paragraph`、`code`、`list`……）
2. **Parser + Renderer**：把 token 流渲染成 HTML

默认 Renderer 输出的 HTML 是**无样式**的（`<h1>`、`<p>`、`<pre>`）。PostForge 做的事是继承 Renderer，给每个方法返回带 `style="..."` 的标签：

```js
import { marked, Renderer } from 'marked';

class PostRenderer extends Renderer {
  paragraph(token) {
    // 每个段落都带样式
    return `<p style="margin-top:0;margin-bottom:16px;text-align:justify">${...}</p>`;
  }

  heading(token) { /* 一级到六级标题，各有字号与间距 */ }
  code(token)    { /* 代码块：背景、圆角、等宽字体 */ }
  blockquote(token) { /* 引用：左边框 + 浅色底 */ }
  table(token)   { /* 表格：边框、表头底色、斑马纹 */ }
  // ...
}
```

主题系统（clean / paper / dark）就是一组这样的样式字典，渲染时把主题对象灌进 Renderer，一套代码换三套皮肤。

:::note Renderer 方法签名
marked 5+ 的 Renderer 方法接收的是 **token 对象**（不再是裸字符串），例如 `heading({ depth, tokens })`。内联内容的渲染用 `this.parser.parseInline(token.tokens)` 递归完成——因为 parser 会调用同一 Renderer 的 `strong` / `em` / `codespan` 等方法，所以内联样式也能全链路生效。
:::

### 踩坑 1：块级 token 和行内 token 要区分开

第一次实现时，`blockquote` 和 `listitem` 我直接用了 `parseInline`，结果运行时报错：

```text
Error: Token with "paragraph" type was not found.
```

原因：**blockquote 的 `tokens` 是块级 token（里面是 paragraph），而 `parseInline` 只认识行内 token**。块级内容必须递归走 `this.parser.parse()`：

```js
blockquote(token) {
  // 内容是块级 tokens（paragraph 等），必须用 parse() 而不是 parseInline()
  return `<blockquote style="...">${this.parser.parse(token.tokens)}</blockquote>`;
}
```

同理，`li` 里的多段内容（loose list）也是块级的。

## 代码高亮：把 token class 翻译成内联颜色

highlight.js 生成的代码高亮长这样：

```html
<span class="hljs-keyword">const</span> <span class="hljs-title function_">x</span>
```

公众号不认 `class`，所以 PostForge 内置一张 **hljs class → 内联样式** 的映射表（GitHub 浅色配色）：

```js
const HLJS_STYLES = {
  keyword: { color: '#d73a49', 'font-weight': '600' },
  string:  { color: '#032f62' },
  comment: { color: '#6a737d', 'font-style': 'italic' },
  // ...
};
```

再用一个正则把 `<span class="hljs-xxx ...">` 整体替换成 `<span style="...">`。注意 hljs 会输出**多个 class**（如 `hljs-title function_`），要全部解析、按序合并、后声明覆盖先前：

```js
return highlightedHtml.replace(/<span class="([^"]*)">/g, (match, classes) => {
  const merged = {};
  for (const cls of classes.split(/\s+/)) {
    Object.assign(merged, HLJS_STYLES[cls.replace(/^hljs-/, '')] ?? {});
  }
  return `<span style="${toCss(merged)}">`;
});
```

## 排版模板：用 marked extensions 做「提示卡片」

`:::tip` / `:::warning` / `:::note` / `:::danger` 提示卡片是 PostForge v0.2.0 的新特性，实现用的是 marked 的**扩展机制**。一个扩展 = `start`（触发点）+ `tokenizer`（识别语法产出 token）+ `renderer`（渲染）：

```js
const cardExtension = {
  name: 'postforgeCard',
  level: 'block',
  start(src) { return src.indexOf(':::'); },
  tokenizer(src) {
    const m = /^:::(tip|warning|note|danger)(?:\s+(.*?))?\n([\s\S]*?)\n:::(?:\n|$)/.exec(src);
    return m ? {
      type: 'postforgeCard', raw: m[0], kind: m[1], title: m[2] || '',
      tokens: this.lexer.blockTokens(m[3]),  // 内容继续用 markdown 解析
    } : undefined;
  },
  renderer(token) {
    // 读取当前主题的卡片配色，输出带内联样式的 div
  },
};
```

### 踩坑 2：extensions 必须显式传给 lexer 和 parser

注册扩展后我用 `marked.lexer(md, { gfm: true, breaks: false })` + `new Parser({ renderer })` 走"手动管线"，结果卡片语法全被当成普通段落。

原因：**显式传 options 时，lexer/parser 不会自动带上全局注册的 extensions**。修复是要么用 `marked.parse`（自动合并 defaults），要么手动把 extensions 传进去：

```js
const tokens = marked.lexer(markdown, {
  gfm: true, breaks: false,
  extensions: marked.defaults.extensions,
});
const parser = new Parser({ renderer, extensions: marked.defaults.extensions });
```

如果你用 marked 做扩展开发，这个坑值得记下。

## 图片内联：`--inline-images` 与公众号素材

公众号粘贴外链图片会裂图，PostForge 提供 `--inline-images`：把本地图片读成 base64 data URI 内联进 HTML。粘贴进公众号编辑器时，**微信会自动把 base64 图片转存为素材库 CDN 地址**——一次粘贴，图片全部安全落地：

```bash
postforge build post.md -p wechat --inline-images -o wechat.html
```

实现只在 image renderer 里加了 10 行：判断是本地路径 → 读取 → 按扩展名映射 MIME → 转 base64。外链与 `data:` 保持原样，避免误伤。

## 静态检查与 MCP

- **`postforge check`**：发布前的体检工具——校验 `:::` 卡片语法是否配对、本地图片引用是否存在，带行号定位。避免粘贴到编辑器里才发现错位。
- **MCP Server**：PostForge 暴露 `build_post` 等工具，Claude / Cursor 等 AI 可以"一句话"让模型直接产出目标平台的富文本，适合把排版能力接进 AI 写作流水线。

## 踩坑 3：style 属性里的引号

主题的 `font-family` 长这样：`-apple-system, "Segoe UI", "Microsoft YaHei"`。直接塞进 `style="..."` 会让**HTML 属性提前闭合**。所有写进 style 的值都要转义：

```js
function toCss(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${String(v).replace(/"/g, '&quot;')}`)
    .join(';');
}
```

## 小结

PostForge 的全部核心代码（渲染引擎 + 主题 + 平台适配 + 检查工具 + MCP）只有约 800 行，运行时依赖只有 `marked` + `highlight.js` + MCP SDK。它证明了：**一个"市面上急需"的小工具，不一定需要复杂的架构，想清楚平台的限制，用最朴素的方式满足它，就够了。**

如果你也在坐拥多平台排版的苦，欢迎来试试：https://github.com/la2278647-arch/postforge

:::warning 广告时间
点个 Star ⭐ 是对开源作者最大的鼓励；提 Issue、写 PR 也随时欢迎。下一版在做：更多排版模板（代码卡片、分割线卡片）与更多平台。
:::