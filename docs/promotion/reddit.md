# PostForge promo copy · Reddit

> Post to r/opensource, r/programming (check self-promo rules), r/selfhosted, or r/Chinese. Rules vary — read the sidebar first. Aligned with v0.6.1.

---

## r/opensource

**Title:** Open-source Markdown typesetting engine for 15 platforms (WeChat/Zhihu/Juejin/CSDN/Xiaohongshu/Medium/DEV.to…) — inline styles, code highlighting, TOC

**Body:**

I built **PostForge**, a zero-config CLI that converts Markdown into publisher-ready rich text for the major Chinese content platforms — and it now covers 15 platforms total, including Medium, DEV.to, Typecho and WordPress.

The pain: WeChat Official Account only accepts inline styles (no `<style>` tags, no external CSS). Zhihu strips most custom CSS. Xiaohongshu doesn't support rich text at all. Writers reformat the same article 4–5 times manually, and existing open tools mostly cover only WeChat and are often abandoned.

The fix: `postforge build post.md -p wechat` outputs fully inline-styled HTML you paste straight into the editor. `-p xiaohongshu` gives plain text + image list + hashtag suggestions. `-p generic --toc` gives a standalone HTML document. `postforge serve` gives a live local preview that auto-refreshes on save; `postforge new` scaffolds drafts from 11 templates.

Tech: Node >= 18 ESM, custom marked Renderer, highlight.js tokens mapped to inline colors, **10 themes**, themed callout cards (`:::tip`/`:::warning`/`:::note`/`:::danger`/`:::quote` + `:::link` + `:::divider`), a pre-publish lint command (`postforge check` — cards, images, duplicate headings, local links, with line numbers), local images can be inlined as base64 (`--inline-images`, `=WxH` size syntax), 3 runtime deps, runs 100% locally. Also usable as a library (`build(md, { platform })`) and ships an MCP server so Claude/Cursor can call `build_post` / `check_post` / `template_list` / `template_get` directly. **78 unit tests green** (incl. CLI integration + MCP), CI matrix on Node 18–24, live browser demo at https://la2278647-arch.github.io/postforge/demo/.

Repo: https://github.com/la2278647-arch/postforge (MIT)

Happy to take suggestions for more platforms/themes. Thanks for reading!

---

## r/selfhosted

**Title:** PostForge – self-hosted Markdown → rich text for 15 platforms (WeChat/Zhihu/Juejin/CSDN/Xiaohongshu/Medium…) — no SaaS, runs locally

**Body:**

Since the selfhosted crowd cares about not shipping documents to third-party SaaS: PostForge renders Markdown to platform-ready rich text entirely on your machine. No account, no API key, no telemetry — just `node` + `marked` + `highlight.js`.

One command per platform (15 platforms: WeChat, Zhihu, Juejin, CSDN, Yuque, Jianshu, CNBlogs, SF, InfoQ, Xiaohongshu, Medium, DEV.to, Typecho, WordPress, generic HTML), inline styles so it survives WeChat's paste constraints, plus a plain-text mode with hashtag suggestions for Xiaohongshu. There's also a local lint command (`postforge check`) to validate card syntax, image references, duplicate headings and link targets before publishing, and a live local preview (`postforge serve`). 10 themes, 11 starter templates, MCP server included. Can be wired into any Node pipeline.

https://github.com/la2278647-arch/postforge
