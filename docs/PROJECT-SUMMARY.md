# PostForge 项目全景总结

> 本文档为 PostForge 的权威项目介绍，供宣传、合作、社区沟通引用。

## 一句话

**PostForge（帖工坊）**：开源的 Markdown 多平台排版引擎——同一篇文章，一条命令排版成 **16 个平台**的富文本，全内联样式粘贴即用，零配置零 SaaS。

🔗 https://github.com/la2278647-arch/postforge · 🚀 在线 Demo：https://la2278647-arch.github.io/postforge/demo/

## 核心能力

| 维度 | 内容 |
| ---- | ---- |
| **平台** | 微信公众号 / 知乎 / 掘金 / CSDN / 语雀 / 简书 / 博客园 / 思否 / InfoQ / 小红书（纯文本）/ Medium / DEV.to / Typecho / Hashnode / WordPress / 通用网页 |
| **主题** | 11 套内置（clean / paper / nord / coffee / solarized / github-light / dark / midnight / one-dark / solarized-dark / mint）+ 自定义主题文件 |
| **模板库** | 12 篇开箱即用（技术教程 / 公众号文章 / 小红书种草 / 周报 / 产品发布 / 会议纪要 / FAQ / 读书笔记 / OKR / 旅行计划 / 搬家清单 / 学习计划） |
| **排版模板** | `:::tip` / `:::warning` / `:::note` / `:::danger` / `:::quote` 卡片 + `:::divider` 分隔条 |
| **工作流** | build / batch / serve（实时预览）/ watch / new / check / info / doctor / list / demo / mcp |
| **结构化输出** | build / batch / check / info / list 全支持 `--json` |
| **集成** | MCP Server（list_platforms / list_themes / build_post / check_post / get_post_stats）· 库 API（build()）· TypeScript 类型声明 |

## 关键特性

- **全内联样式**：公众号不认 `<style>`/外部 CSS，PostForge 把样式内联到每个元素，粘贴即所得
- **代码高亮内联化**：highlight.js GitHub 配色转内联（浏览器包仅 310KB）
- **图片处理**：`--inline-images` 本地图转 base64（粘贴公众号自动转存素材）+ `=WxH` 尺寸语法
- **发布前体检**：`check`（卡片配对/图片引用，行号定位）· `info`（字数/图片/阅读时长）· `doctor`（环境诊断）
- **性能**：200K 字文档渲染 <80ms

## 工程与社区

| 项 | 状态 |
| ---- | ---- |
| 测试 | 82/82 单元测试全绿（node:test） |
| 依赖 | 3 个运行时依赖（marked / highlight.js / MCP SDK），审计 0 漏洞 |
| 版本 | Release 覆盖 v0.1.0 → v0.6.5，CHANGELOG 全版本 |
| 文档 | 中英 README / 双语技术深挖 / 快速上手 / 架构图（交互式） |
| 社区 | Discussions / Wiki / SECURITY / CoC / CONTRIBUTING / FUNDING / Issue·PR 模板 / pre-commit 门禁 |
| 发布 | npm 包名 `postforge` 可用，发布预演与干净安装全绿（待授权上线） |
| 在线体验 | GitHub Pages 交互式 Demo（16 平台 × 11 主题实时排版） |

## 设计理念

1. **本地优先**：零在线依赖、不上传内容、不锁定用户
2. **平台无关**：全内联样式一套代码适配所有富文本平台
3. **开箱即用**：模板库 + new/serve/demo 让新手 5 分钟上手

## 路线图方向

- 更多平台 / 主题 / 模板（社区贡献）
- 公众号素材库 API 自动化上传
- MCP 生态进一步集成

## 联系与支持

- 仓库：https://github.com/la2278647-arch/postforge
- 讨论：仓库 Discussions
- 反馈：Issues / PR

*PostForge · 写一次 Markdown，随处发布。*
