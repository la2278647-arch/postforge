# PostForge promo copy · Reddit

> Post to r/opensource, r/programming (check self-promo rules), r/selfhosted, or r/Chinese. Rules vary — read the sidebar first.

---

## r/opensource

**Title:** Open-source Markdown typesetting engine for WeChat/Zhihu/Juejin/CSDN/Xiaohongshu (inline styles, code highlighting, TOC)

**Body:**

I built **PostForge**, a zero-config CLI that converts Markdown into publisher-ready rich text for the major Chinese content platforms.

The pain: WeChat Official Account only accepts inline styles (no `<style>` tags, no external CSS). Zhihu strips most custom CSS. Xiaohongshu doesn't support rich text at all. Writers reformat the same article 4–5 times manually, and existing open tools mostly cover only WeChat and are often abandoned.

The fix: `postforge build post.md -p wechat` outputs fully inline-styled HTML you paste straight into the editor. `-p xiaohongshu` gives plain text + image list + hashtag suggestions. `-p generic --toc` gives a standalone HTML document.

Tech: Node >= 18 ESM, custom marked Renderer, highlight.js tokens mapped to inline colors, 3 themes, themed callout cards (`:::tip`/`:::warning`/`:::note`/`:::danger`/`:::quote`), a pre-publish lint command (`postforge check`), local images can be inlined as base64 (`--inline-images`) so WeChat saves them to its CDN on paste, 3 runtime deps, runs 100% locally. Also usable as a library (`build(md, { platform })`) and ships an MCP server so Claude/Cursor can call `build_post` / `check_post` directly. 36 unit tests green (incl. CLI integration).

Repo: https://github.com/la2278647-arch/postforge (MIT)

Happy to take suggestions for more platforms/themes. Thanks for reading!

---

## r/selfhosted

**Title:** PostForge – self-hosted Markdown → rich text for WeChat/Zhihu/Juejin/CSDN/Xiaohongshu (no SaaS, runs locally)

**Body:**

Since the selfhosted crowd cares about not shipping documents to third-party SaaS: PostForge renders Markdown to platform-ready rich text entirely on your machine. No account, no API key, no telemetry — just `node` + `marked` + `highlight.js`.

One command per platform, inline styles so it survives WeChat's paste constraints, plus a plain-text mode with hashtag suggestions for Xiaohongshu. There's also a local lint command (`postforge check`) to validate card syntax and image references before publishing. Can be wired into any Node pipeline.

https://github.com/la2278647-arch/postforge