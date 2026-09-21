# PostForge English promo copy · Twitter/X

> Ready to post. Keep hashtags light. Aligned with v0.6.5.

---

## Tweet（推荐发布）

Tired of reformatting the same article for every Chinese content platform (WeChat, Zhihu, Juejin, CSDN, Xiaohongshu)?

I open-sourced **PostForge** — a zero-config Markdown typesetting engine:

▸ One command: `postforge build post.md -p wechat`
▸ **16 platforms**: WeChat, Zhihu, Juejin, CSDN, Yuque, Jianshu, CNBlogs, SF, InfoQ, Medium, DEV.to, Typecho, Hashnode, WordPress, Xiaohongshu, generic HTML
▸ Fully inlined styles (WeChat requires inline CSS — no <style> allowed)
▸ Code highlighting, tables, task lists, auto TOC, numbered headings
▸ **11 themes** (clean/paper/dark/nord/coffee/midnight/one-dark/solarized/github-light/solarized-dark/mint)
▸ Themed callout cards (`:::tip`…`:::quote`, `:::link`, `:::divider`) + pre-publish lint (`postforge check`)
▸ Live preview (`postforge serve`), 12 templates (`postforge new`), pure-text mode for Xiaohongshu
▸ Runs 100% locally, 3 deps, ships an MCP server for Claude/Cursor
▸ Live browser demo: https://la2278647-arch.github.io/postforge/demo/

https://github.com/la2278647-arch/postforge

MIT. 82 tests green. Stars & PRs welcome ❤️

#OpenSource #Markdown #ContentCreation #DeveloperTools #IndieHacker

---

## Alt（thread style, first tweet）

I kept rewriting the same Markdown article for WeChat, Zhihu, Juejin, CSDN and Xiaohongshu. Every platform has different formatting rules. So I built PostForge to do it in one command.

https://github.com/la2278647-arch/postforge

1/ The problem: WeChat only accepts inline styles, Zhihu strips most custom CSS, Xiaohongshu only takes plain text. Existing tools mostly cover WeChat only — and many are abandoned.

2/ The fix: a single CLI that renders your Markdown to each platform's rich text — 16 platforms, fully inlined styles, GitHub-style code highlighting, TOC, task lists. Themed callout cards (`:::tip` / `:::warning` / `:::note` / `:::danger` / `:::quote`, plus `:::link` and `:::divider`) and a pre-publish lint command (`postforge check`) catch mistakes before you paste. Xiaohongshu gets plain text + image list + hashtag suggestions.

3/ Zero SaaS, zero lock-in: runs locally, only `marked` + `highlight.js` as deps. Live preview with `postforge serve`, 12 starter templates with `postforge new`. Also usable as a library: `build(md, { platform: 'wechat' })`, and it ships an MCP server so Claude/Cursor can call it directly.

4/ MIT licensed, 82 tests green, live demo at https://la2278647-arch.github.io/postforge/demo/. If you publish on Chinese platforms, give it a star — or better, send a PR for a new theme/platform.

https://github.com/la2278647-arch/postforge
