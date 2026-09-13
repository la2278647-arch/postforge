# Inside PostForge: Building a Multi-Platform Markdown Typesetting Engine in a Few Hundred Lines

> This is the technical deep-dive behind [PostForge](https://github.com/la2278647-arch/postforge), an open-source Markdown typesetting engine for Chinese content platforms (WeChat, Zhihu, Juejin, CSDN, Xiaohongshu, and more).

## The problem: WeChat's "inline-style-only" wall

If you publish on WeChat Official Account, you know the rule: **the editor strips `<style>` tags and external CSS. It only respects inline styles on each element.** Paste HTML with classes and every style disappears.

Zhihu cleans most custom CSS on paste. Juejin has its own theme. Xiaohongshu doesn't support rich text at all — plain text only. So writers reformat the same article once per platform, by hand.

PostForge's approach is deliberately simple: **inline every style onto every element at render time**, so any platform renders "as pasted".

```text
Markdown ──► parse ──► inline-styled HTML ──► paste anywhere
```

## The core: a custom marked Renderer

PostForge is built on `marked` (a mature Markdown parser). Its pipeline is two-stage:

1. **Lexer** — turns source text into a token stream (`heading`, `paragraph`, `code`, `list`, …)
2. **Parser + Renderer** — turns tokens into HTML

The default Renderer emits *style-less* HTML (`<h1>`, `<p>`, `<pre>`). PostForge subclasses it and returns tags with inline `style="..."` from every method:

```js
import { marked, Renderer } from 'marked';

class PostRenderer extends Renderer {
  paragraph(token) {
    return `<p style="margin-top:0;margin-bottom:16px;text-align:justify">${...}</p>`;
  }
  heading(token) { /* per-level sizes and spacing */ }
  code(token)    { /* code block: background, radius, monospace */ }
  blockquote(token) { /* left border + tinted background */ }
  table(token)   { /* borders, header fill, zebra rows */ }
  // ...
}
```

A theme (clean / paper / nord / coffee / dark / midnight) is just a style dictionary injected into the Renderer — six skins from one code path.

:::note Renderer method signatures
Since marked v5, Renderer methods receive **token objects** (e.g. `heading({ depth, tokens })`), not raw strings. Inline content is rendered recursively via `this.parser.parseInline(token.tokens)` — the parser calls the same Renderer's `strong` / `em` / `codespan` / etc., so inline styles propagate end-to-end.
:::

### Pitfall 1: block-level vs inline tokens

My first implementation used `parseInline` in `blockquote` and `listitem`. It crashed immediately:

```text
Error: Token with "paragraph" type was not found.
```

Why: **a blockquote's `tokens` are block-level** (they contain a `paragraph`), while `parseInline` only knows inline tokens. Block content must recurse through `this.parser.parse()`:

```js
blockquote(token) {
  // tokens here are block-level (paragraph, list, ...) — use parse(), not parseInline()
  return `<blockquote style="...">${this.parser.parse(token.tokens)}</blockquote>`;
}
```

Same for `li` in loose lists.

## Code highlighting: translating token classes into inline colors

highlight.js emits classed spans:

```html
<span class="hljs-keyword">const</span> <span class="hljs-title function_">x</span>
```

WeChat ignores classes, so PostForge ships a **hljs-class → inline-style map** (GitHub light palette):

```js
const HLJS_STYLES = {
  keyword: { color: '#d73a49', 'font-weight': '600' },
  string:  { color: '#032f62' },
  comment: { color: '#6a737d', 'font-style': 'italic' },
  // ...
};
```

A regex rewrites every `<span class="hljs-...">` into `<span style="...">`. Note hljs emits **multiple classes** (`hljs-title function_`), so all of them are parsed, merged in order, with later tokens overriding earlier ones:

```js
return highlightedHtml.replace(/<span class="([^"]*)">/g, (match, classes) => {
  const merged = {};
  for (const cls of classes.split(/\s+/)) {
    Object.assign(merged, HLJS_STYLES[cls.replace(/^hljs-/, '')] ?? {});
  }
  return `<span style="${toCss(merged)}">`;
});
```

## Templates: callout cards via marked extensions

`:::tip` / `:::warning` / `:::note` / `:::danger` / `:::quote` cards use marked's **extension mechanism** — `start` (trigger), `tokenizer` (produce a token), `renderer` (render it):

```js
const cardExtension = {
  name: 'postforgeCard',
  level: 'block',
  start(src) { return src.indexOf(':::'); },
  tokenizer(src) {
    const m = /^:::(tip|warning|note|danger|quote)(?:\s+(.*?))?\n([\s\S]*?)\n:::(?:\n|$)/.exec(src);
    return m ? {
      type: 'postforgeCard', raw: m[0], kind: m[1], title: m[2] || '',
      tokens: this.lexer.blockTokens(m[3]),  // content is Markdown again
    } : undefined;
  },
  renderer(token) {
    // read the current theme's card colors, emit an inline-styled div
  },
};
```

### Pitfall 2: extensions must be passed explicitly to lexer and parser

Registering the extension and then using a "manual pipeline" (`marked.lexer(md, { gfm: true })` + `new Parser({ renderer })`) silently ignored it — cards rendered as plain paragraphs.

Why: **when you pass explicit options, the lexer/parser do not merge globally registered extensions.** Fix: pass them explicitly:

```js
const tokens = marked.lexer(markdown, {
  gfm: true, breaks: false,
  extensions: marked.defaults.extensions,
});
const parser = new Parser({ renderer, extensions: marked.defaults.extensions });
```

If you build marked extensions, remember this one.

## Image inlining: `--inline-images` and WeChat's CDN

Pasted external images break in WeChat. PostForge's `--inline-images` reads local images into base64 data URIs inside the HTML. When you paste into the WeChat editor, **WeChat automatically saves the base64 image to its own CDN** — one paste, images safely landed:

```bash
postforge build post.md -p wechat --inline-images -o wechat.html
```

The implementation is ~10 lines in the image renderer: local path → read → MIME from extension → base64. Remote URLs and `data:` stay untouched.

## Linting, stats, and MCP

- **`postforge check`** — pre-publish lint: card syntax pairing and local image references, with line numbers.
- **`postforge info`** — word counts (CJK + English), images, code blocks, headings, cards, and an estimated reading time.
- **MCP Server** — `build_post` / `check_post` tools so Claude / Cursor can produce platform-ready rich text directly. Hook typesetting into your AI writing pipeline.

## Pitfall 3: quotes inside style attributes

Theme font stacks look like `-apple-system, "Segoe UI", "Microsoft YaHei"`. Inserted raw into `style="..."`, the double quotes **terminate the attribute early**. Every value written into a style must be escaped:

```js
function toCss(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${String(v).replace(/"/g, '&quot;')}`)
    .join(';');
}
```

## Summary

The entire core — renderer, themes, platform adapters, lint, stats, and MCP server — is about 800 lines, with only `marked`, `highlight.js`, and the MCP SDK as runtime dependencies. The lesson: **a genuinely needed tool doesn't need complex architecture. Understand the platform's constraints, serve them in the simplest honest way, and ship.**

If you publish on Chinese platforms (or just like minimal CLI tools), try it: https://github.com/la2278647-arch/postforge

:::warning Shameless plug
Stars ⭐ and PRs are always welcome. Roadmap: more templates (code cards, divider cards are done; more on the way) and more platforms.
:::