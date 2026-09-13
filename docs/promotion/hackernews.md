# PostForge promo copy · Hacker News (Show HN)

> Post title conventions on HN: "Show HN: ..." — keep the title short and concrete.

---

## Title

Show HN: PostForge – Markdown typesetting engine for Chinese content platforms (WeChat/Zhihu/Juejin/CSDN/Xiaohongshu)

## Body

I built an open-source CLI that renders one Markdown file into publisher-ready rich text for the major Chinese content platforms.

**Why:** WeChat Official Account only accepts inline styles (no `<style>`, no external CSS). Zhihu strips most custom CSS on paste. Xiaohongshu doesn't support rich text at all — plain text only. Writers end up hand-reformatting the same article 4–5 times. Existing open tools mostly cover WeChat only and are often unmaintained.

**What it does:**

- `postforge build post.md -p wechat` → inline-styled HTML you paste straight into WeChat's editor
- Same command with `-p zhihu / -p juejin / -p csdn` → rich text for those platforms
- `-p xiaohongshu` → plain text + image list + auto-generated hashtag suggestions
- `-p generic --toc` → full standalone HTML document (preview / print / self-hosted blog)

**Details:**

- Custom marked Renderer — every element gets inline styles
- Code highlighting via highlight.js, with its token classes mapped to inline colors (GitHub palette) so WeChat shows highlighting too
- GFM task lists (☑ ☐), zebra-striped tables, blockquotes, responsive images
- 3 themes (clean / paper / dark), extendable in `src/themes.js`
- Node >= 18, ESM, zero SaaS — runs entirely locally. Only 2 runtime deps: `marked` and `highlight.js`
- Usable as a library: `build(md, { platform: 'wechat' })`
- 13 unit tests passing (node:test)

Repo with example outputs: https://github.com/la2278647-arch/postforge

MIT. Happy to chat about design choices or roadmap (MCP server integration is on the list).