<p align="center">
  <img src="docs/logo.svg" width="120" alt="PostForge" />
</p>

<h1 align="center">PostForge</h1>

<p align="center">
  <b>An open-source Markdown typesetting engine for Chinese content platforms.</b><br/>
  Write once in Markdown, publish everywhere with beautifully inlined styles.
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/la2278647-arch/postforge" />
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" />
  <img alt="Version" src="https://img.shields.io/github/package-json/v/la2278647-arch/postforge" />
  <img alt="Platforms" src="https://img.shields.io/badge/platforms-15-blue" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Server-7c3aed" />
</p>

**PostForge** turns one Markdown file into publisher-ready rich text for WeChat Official Account, Zhihu, Juejin, CSDN, Yuque, Jianshu, CNBlogs, Xiaohongshu — and a standalone HTML document. Every style is inlined onto the element, so pasting into any platform "just works".

> **Why it exists:** WeChat only accepts inline styles (no `<style>`, no external CSS). Zhihu strips most custom CSS on paste. Xiaohongshu doesn't support rich text at all. Writers were reformatting the same article once per platform, by hand. PostForge removes that.

## Features

- 🖥️ **15 platforms**: WeChat, Zhihu, Juejin, CSDN, Yuque, Jianshu, CNBlogs, SegmentFault, InfoQ CN, Xiaohongshu (plain-text mode), Medium, DEV.to, Typecho, WordPress, generic web page
- 🎨 **10 themes**: clean / paper / nord / coffee / solarized / github-light / dark / midnight / one-dark / solarized-dark — extendable via `makeTheme` or `--theme-file`
- 🧩 **Fully inline styles**: paste-and-go, no `<style>` or external CSS required
- 🔆 **Code highlighting**: GitHub-palette highlight.js tokens mapped to inline colors
- 🧱 **Templates**: `:::tip` / `:::warning` / `:::note` / `:::danger` / `:::quote` callout cards + `:::divider` section separators
- 📋 **TOC generation**: `--toc` inserts an anchored table of contents
- 🔍 **Pre-publish lint**: `postforge check` validates card syntax pairing and local image references (with line numbers)
- 📊 **Article stats**: `postforge info` — word counts (CJK + English), images, code blocks, reading time
- 📷 **Image inlining**: `--inline-images` turns local images into base64; WeChat auto-saves them to its CDN on paste
- 🤖 **MCP Server**: Claude / Cursor can call `build_post` / `check_post` directly
- 🚫 **Zero SaaS**: runs 100% locally, 3 runtime deps (`marked`, `highlight.js`, MCP SDK)

## Quick Start

```bash
git clone https://github.com/la2278647-arch/postforge.git
cd postforge
npm install

# WeChat rich text → paste into the editor
node src/cli.js build post.md -p wechat -o wechat.html

# Xiaohongshu plain text + image list + hashtag suggestions
node src/cli.js build post.md -p xiaohongshu -o xiaohongshu.txt

# Standalone HTML document with TOC
node src/cli.js build post.md -p generic --toc -o preview.html
```

Global install:

```bash
npm install -g .
postforge build post.md -p zhihu -o zhihu.html
```

## Platforms

| Platform | Command | Output |
| -------- | ------- | ------ |
| WeChat Official Account | `-p wechat` | inline-styled HTML fragment |
| Zhihu | `-p zhihu` | HTML fragment |
| Juejin | `-p juejin` | HTML fragment |
| CSDN | `-p csdn` | HTML fragment |
| Yuque | `-p yuque` | HTML fragment |
| Jianshu | `-p jianshu` | HTML fragment |
| CNBlogs | `-p cnblogs` | HTML fragment |
| SegmentFault | `-p sf` | HTML fragment |
| InfoQ CN | `-p infoq` | HTML fragment |
| Medium | `-p medium` | HTML fragment |
| DEV.to | `-p devto` | HTML fragment |
| Typecho | `-p typecho` | HTML fragment |
| WordPress | `-p wordpress` | HTML fragment |
| Xiaohongshu | `-p xiaohongshu` | plain text + images + hashtags |
| Generic | `-p generic` | full HTML document |

## CLI

```text
postforge build <input.md> [options]
postforge batch <directory> [options]
postforge check <input.md>
postforge info <input.md>
postforge serve <input.md> [--port N]   live preview with auto-reload
postforge new <template> [-o file]       scaffold a draft from the template library
postforge mcp
postforge list
postforge -v | --version
postforge -h | --help
```

Options: `-p/--platform`, `-o/--output`, `-t/--theme`, `--toc`, `--max-width`, `--title`, `--inline-images`, `--numbered-headings`, `--watch`.

## Templates

Write:

````markdown
:::tip 小贴士
Callout cards support arbitrary Markdown.
:::

:::divider 第二章
````

Callout cards follow the theme's colors; `:::divider` renders a section separator (no closing tag needed).

## MCP Server

```bash
npm run mcp    # or: postforge mcp
```

Exposes `list_platforms`, `list_themes`, `build_post`, `check_post`, `get_post_stats`. Example (Claude Code):

```bash
claude mcp add --scope project postforge -- node C:/path/to/postforge/src/mcp/server.js
```

Then ask your AI: "Format this article for WeChat" — it calls `build_post` and returns paste-ready rich text.

## Templates Library

`examples/templates/` ships with ready-to-fill templates (shipped in the npm package too):

- `tech-tutorial.md` — technical tutorials
- `wechat-article.md` — WeChat articles
- `xiaohongshu-draft.md` — Xiaohongshu notes
- `weekly-report.md` — weekly reports
- `product-launch.md` — product announcements
- `meeting-notes.md` — meeting minutes
- `faq.md` — FAQ documents
- `reading-notes.md` — book notes
- `okr.md` — OKR planning
- `travel-plan.md` — travel plans
- `okr.md` — OKR planning

## Performance

Rendering benchmark (Node 24, best of 5):

| Input | Best time |
| ----- | --------- |
| 5K chars | 2.7 ms |
| 50K chars | 19.6 ms |
| 200K chars | 68.1 ms |

Run it yourself: `node scripts/benchmark.mjs`

## Contributing

PRs and Issues welcome — new platforms, themes, and templates especially. Run `npm test` before submitting. See [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md).

## License

[MIT](./LICENSE) © la2278647-arch

---

<p align="center"><b>PostForge · Write once, publish everywhere.</b></p>