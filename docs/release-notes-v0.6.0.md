# PostForge v0.6.0 Release Notes

> 写一份 Markdown，排版到 15 个平台直接发；现在还能边写边预览、从模板一键起稿。
> https://github.com/la2278647-arch/postforge

## ✨ 本次亮点

### 🖥️ `postforge serve` — 本地实时预览

```bash
postforge serve post.md            # http://127.0.0.1:4173/（自动打开浏览器）
postforge serve post.md --toc      # 带目录；--no-open 不自动开浏览器
```

- 改文件即自动刷新（轮询 mtime+size 指纹），无需手动刷新浏览器
- 渲染出错时展示错误页并保留自动刷新，改好文件自动恢复
- 支持 `--theme` / `--theme-file` / `--toc` / `--numbered-headings` / `--inline-images`

### 📋 `postforge new` — 模板库一键起稿

```bash
postforge new list                 # 查看 10 种模板
postforge new tech-tutorial        # 生成 ./tech-tutorial.md 草稿
```

- 模板：技术教程 / 公众号文章 / 小红书种草 / 周报 / 产品发布 / 会议纪要 / FAQ / 读书笔记 / OKR / 旅行计划
- 不覆盖已有文件；`-o` 指定输出路径

### 🔍 `postforge check` 增强

- **重复标题警告**：同文本标题多次出现（影响目录锚点唯一性），自动跳过代码块内的 `#` 行
- **本地链接检查**：`[text](path)` 指向不存在的本地文件给警告（远程 / 图片 / 锚点忽略）

### 🤖 MCP 新增模板工具

- `template_list`：枚举模板库（名称 + 标题）
- `template_get`：按名称获取模板全文，AI 直接按模板创作

## 📦 版本背景

- 平台 **15 个**（含 Medium / DEV.to / Typecho / WordPress 国际与自建博客）
- 主题 **10 套**（clean / paper / nord / coffee / solarized / github-light / dark / midnight / one-dark / solarized-dark）
- 命令 10 个：build（--watch / --theme-file / --numbered-headings / --inline-images）/ batch / check / info / serve / demo / new / mcp / list / doctor
- 模板库 10 篇；`--json` 结构化输出五件套；MCP 7 工具
- **74 个测试全绿**（node:test，含 CLI 集成与 serve 端到端）
- 性能：5K 字 2.7ms / 50K 19.6ms / 200K 68.1ms（Node 24）

## 快速体验

```bash
npx github:la2278647-arch/postforge serve examples/demo.md
```

或在线体验：https://la2278647-arch.github.io/postforge/demo/

## 致谢

MIT 协议，欢迎 Star、Issue 与 PR。下一站：公众号图片一键上传（素材库 API 自动化）。