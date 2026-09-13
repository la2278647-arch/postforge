# PostForge English promo copy · Twitter/X

> Ready to post. Keep hashtags light.

---

## Tweet（推荐发布）

Tired of reformatting the same article for every Chinese content platform (WeChat, Zhihu, Juejin, CSDN, Xiaohongshu)?

I open-sourced **PostForge** — a zero-config Markdown typesetting engine:

▸ One command: `postforge build post.md -p wechat`
▸ Fully inlined styles (WeChat requires inline CSS — no <style> allowed)
▸ Code highlighting, tables, task lists, auto TOC
▸ Pure-text mode with hashtag suggestions for Xiaohongshu
▸ Runs 100% locally, 3 deps, ships an MCP server for Claude/Cursor

https://github.com/la2278647-arch/postforge

MIT. Stars & PRs welcome ❤️

#OpenSource #Markdown #ContentCreation #DeveloperTools #IndieHacker

---

## Alt（thread style, first tweet）

I kept rewriting the same Markdown article for WeChat, Zhihu, Juejin, CSDN and Xiaohongshu. Every platform has different formatting rules. So I built PostForge to do it in one command.

https://github.com/la2278647-arch/postforge

1/ The problem: WeChat only accepts inline styles, Zhihu strips most custom CSS, Xiaohongshu only takes plain text. Existing tools mostly cover WeChat only — and many are abandoned.

2/ The fix: a single CLI that renders your Markdown to each platform's rich text. Fully inlined styles, GitHub-style code highlighting, TOC, task lists. Xiaohongshu gets plain text + image list + hashtag suggestions.

3/ Zero SaaS, zero lock-in: runs locally, only `marked` + `highlight.js` as deps. Also usable as a library: `build(md, { platform: 'wechat' })`.

4/ MIT licensed. If you publish on Chinese platforms, give it a star — or better, send a PR for a new theme/platform.

https://github.com/la2278647-arch/postforge