# PostForge promo copy · Hacker News (Show HN)

> Post title conventions on HN: "Show HN: ..." — keep the title short and concrete. Aligned with v0.6.5.

---

## Title

Show HN: PostForge – Markdown typesetting engine for 16 Chinese/international platforms (WeChat/Zhihu/Juejin/CSDN/Xiaohongshu…)

## Body

I built an open-source CLI that renders one Markdown file into publisher-ready rich text for the major Chinese content platforms — and now 16 platforms including Medium, DEV.to, Typecho and WordPress.

**Why:** WeChat Official Account only accepts inline styles (no `<style>`, no external CSS). Zhihu strips most custom CSS on paste. Xiaohongshu doesn't support rich text at all — plain text only. Writers end up hand-reformatting the same article 4–5 times. Existing open tools mostly cover WeChat only and are often unmaintained.

**What it does:**

- `postforge build post.md -p wechat` → inline-styled HTML you paste straight into WeChat's editor
- Same command with `-p zhihu / -p juejin / -p csdn / -p yuque / -p medium / -p devto …` → rich text for that platform (16 in total)
- `-p xiaohongshu` → plain text + image list + auto-generated hashtag suggestions
- `-p generic --toc` → full standalone HTML document (preview / print / self-hosted blog)
- `postforge serve post.md` → live HTTP preview, browser auto-refreshes on save
- `postforge new` → scaffold drafts from 12 built-in templates (FAQ, weekly report, OKR, product launch, Xiaohongshu draft…)

**Details:**

- Custom marked Renderer — every element gets inline styles
- Code highlighting via highlight.js, with its token classes mapped to inline colors (GitHub palette) so WeChat shows highlighting too
- GFM task lists (☑ ☐), zebra-striped tables, blockquotes, responsive images, `=WxH` image-size syntax
- **11 themes**: clean / paper / dark / nord / coffee / midnight / one-dark / solarized / github-light / solarized-dark / mint, extendable in `src/themes.js`
- **Themed callout cards**: `:::tip / :::warning / :::note / :::danger / :::quote` plus `:::link` link cards and `:::divider` separators — arbitrary Markdown inside, per-theme colors
- **Pre-publish lint**: `postforge check` validates card syntax pairing, local image references, duplicate headings and local link targets, with line numbers (JSON output supported)
- **`--inline-images`**: local images inlined as base64; WeChat auto-saves them to its CDN on paste (no more broken images)
- Node >= 18, ESM, zero SaaS — runs entirely locally. Only 3 runtime deps (`marked`, `highlight.js`, MCP SDK)
- **MCP server included** — Claude/Cursor can call `build_post`, `check_post`, `template_list`, `template_get` directly
- Usable as a library: `build(md, { platform: 'wechat' })`
- **82 unit tests passing** (node:test), incl. CLI integration + MCP tests; CI matrix on Node 18/20/22/24
- Live browser demo (GitHub Pages): https://la2278647-arch.github.io/postforge/demo/

Repo with example outputs: https://github.com/la2278647-arch/postforge

MIT. Roadmap: one-click WeChat image upload via the asset-library API, more platforms/themes. Happy to chat about design choices.
