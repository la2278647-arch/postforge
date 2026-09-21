# PostForge — Project Overview

> Authoritative project introduction for promotion, collaboration, and community use.

## One-liner

**PostForge** is an open-source Markdown typesetting engine: one command turns a single Markdown file into publisher-ready rich text for **16 platforms**, with fully inline styles — paste-and-go, zero config, zero SaaS.

🔗 https://github.com/la2278647-arch/postforge · 🚀 Live Demo: https://la2278647-arch.github.io/postforge/demo/

## Core Capabilities

| Area | Details |
| ---- | ------- |
| **Platforms** | WeChat OA, Zhihu, Juejin, CSDN, Yuque, Jianshu, CNBlogs, SegmentFault, InfoQ CN, Xiaohongshu (plain-text), Medium, DEV.to, Typecho, Hashnode, WordPress, generic web page |
| **Themes** | 11 built-in (clean / paper / nord / coffee / solarized / github-light / dark / midnight / one-dark / solarized-dark / mint) + custom theme files |
| **Templates** | 12 ready-to-fill templates (tutorial, WeChat article, Xiaohongshu note, weekly report, product launch, meeting notes, FAQ, book notes, OKR, travel plan, moving checklist, study plan) |
| **Typesetting syntax** | `:::tip/warning/note/danger/quote` callout cards + `:::divider` separators |
| **Workflow** | build / batch / serve (live preview with auto-reload) / watch / new / check / info / doctor / list / demo / mcp |
| **Structured output** | `--json` on build / batch / check / info / list for scripting and CI |
| **Integration** | MCP server (list_platforms / list_themes / build_post / check_post / get_post_stats) · library API (`build()`) · TypeScript declarations |

## Key Features

- **Fully inline styles**: WeChat ignores `<style>` and external CSS; PostForge inlines every style so pasting "just works"
- **Code highlighting**: highlight.js GitHub palette mapped to inline colors (browser bundle only 310KB)
- **Image handling**: `--inline-images` (base64, WeChat auto-saves to its CDN on paste) + `=WxH` size syntax
- **Pre-publish checks**: `check` (card pairing / image refs with line numbers) · `info` (word counts / reading time) · `doctor` (environment diagnostics)
- **Performance**: 200K-char document renders in <80ms

## Engineering & Community

| Item | Status |
| ---- | ------ |
| Tests | 82/82 green (node:test) |
| Dependencies | 3 runtime deps (marked / highlight.js / MCP SDK), 0 vulnerabilities |
| Releases | v0.1.0 → v0.6.5, full CHANGELOG |
| Docs | Bilingual READMEs, tech deep-dives (CN/EN), getting-started, interactive architecture diagram |
| Community | Discussions / Wiki / SECURITY / CoC / CONTRIBUTING / FUNDING / Issue·PR templates / pre-commit gate |
| Publish | npm name `postforge` available; dry-run & clean-install verified (awaiting credentials) |
| Live demo | GitHub Pages interactive demo (16 platforms × 11 themes, real-time) |

## Design Principles

1. **Local-first**: zero online dependencies, no content upload, no lock-in
2. **Platform-agnostic**: one inline-styled output adapts to every rich-text platform
3. **Out-of-the-box**: templates + new/serve/demo get beginners started in 5 minutes

## Roadmap

- More platforms / themes / templates (community contributions welcome)
- WeChat asset-library API automation for image upload
- Deeper MCP ecosystem integration

## Contact

- Repo: https://github.com/la2278647-arch/postforge
- Discussions: repo Discussions
- Feedback: Issues / PRs

*PostForge · Write once, publish everywhere.*
