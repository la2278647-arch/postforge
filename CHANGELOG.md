# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，
版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.4.6] - 2026-09-14

### 新增

- 2 套新主题：`one-dark`（Atom 编辑器深色）/ `solarized`（经典护眼浅色），共 8 套

### 修复

- CLI `build --theme` 失效回归（v0.4.3 引入：themeObj 三元写反，未用 theme-file 时 theme 传 undefined → 默认 clean）

### 测试

- 59 → 60（--theme 生效回归用例）

## [0.4.5] - 2026-09-14

### 新增

- 模板库 5 → 7 篇：`meeting-notes.md`（会议纪要）/ `faq.md`（FAQ 文档）
- MCP Server 工具 `get_post_stats`（字数 / 图片 / 代码块 / 标题 / 阅读时长）

## [0.4.4] - 2026-09-14

### 新增

- `postforge batch <目录>`：批量排版目录下所有 .md（check 通过才生成、下划线草稿跳过、失败列出原因）

### 测试

- 57 → 59（batch 成功 / 目录不存在）

## [0.4.3] - 2026-09-14

### 新增

- `--theme-file <json>`：加载自定义主题（深合并到基础主题，无需改源码）
- `build()` 支持 `themeObj`；`deepMerge` / `makeTheme` 导出；`src/index.d.ts` TypeScript 类型声明
- 示例主题 `examples/themes/brand-blue.json`

### 测试

- 55 → 57（themeObj 继承 / 卡片深合并）

## [0.4.2] - 2026-09-14

### 新增

- 图片尺寸语法：`![alt](url =WxH)` / `=W`（inline 扩展 postforgeImage，公众号控图）

### 测试

- 51 → 55（尺寸语法 4 用例）

## [0.4.1] - 2026-09-14

### 修复

- `postforge check` 兼容 CRLF 换行（Windows）文件：ECMAScript 正则 `.` 不匹配 `\r`，CRLF 卡片开启行此前被误判

### 新增

- `scripts/benchmark.mjs` 性能基准（5K 字 2.7ms / 50K 19.6ms / 200K 68.1ms）

### 测试

- 49 → 51（CRLF 2 用例）

## [0.4.0] - 2026-09-14

### 新增

- **`postforge info <input.md>` 文章统计**：
  - 字数（中文 / 英文词分列）
  - 素材统计：图片、代码块、标题、模板卡片（分类型计数）
  - 预计阅读时长（中文 300 字/分 + 英文 200 词/分）
- **示例模板库 `examples/templates/`**：
  - `tech-tutorial.md`（技术教程：收获卡片 / 步骤 / 避坑卡 / 行动清单）
  - `wechat-article.md`（公众号文章：金句卡 / 对比表格 / 行动号召）
  - `xiaohongshu-draft.md`（小红书种草：卖点卡 / 步骤 / 效果对比 / 话题标签）

### 测试

- 44 → 49（info 统计 5 用例）

## [0.3.1] - 2026-09-14

### 新增

- **`:::divider` 章节分隔条**：单行语法（`:::divider 文字`）、无需闭合；
  上下边框夹文字（公众号兼容），无文字时渲染纯分隔线
- **`SECURITY.md`**：漏洞报告流程与维护承诺
- **`CODE_OF_CONDUCT.md`**：贡献者公约（中文）
- 仓库开启 GitHub Discussions

### 修复

- divider 正则支持文件结尾无换行
- divider 标题仅空格分隔，避免 `\s+` 吞掉下一行正文

### 测试

- 38 → 44（divider 渲染 / 无文字 / 深色主题 / check / 小红书文本）

## [0.3.0] - 2026-09-14

### 新增

- **3 套新主题**：`nord`（北欧冷灰蓝）/ `coffee`（咖啡暖棕）/ `midnight`（深夜蓝黑），共 6 套
- **`makeTheme()` 派生机制**：基于 `clean` 只覆盖差异配色即可自定义主题

### 测试

- 36 → 38（主题字段完整性 + 六主题渲染互异性）

## [0.2.0] - 2026-09-14

### 新增

- **排版模板提示卡片**：`:::tip` `:::warning` `:::note` `:::danger` `:::quote`
  - 六套主题独立配色（初始为 clean / paper / dark）
  - `:::quote`（语录）无标题时自动渲染装饰性左引号
  - 卡片内容支持任意 Markdown（段落 / 列表 / 代码 / 图片）
- **`postforge check <input.md>` 静态检查**：
  - 卡片语法配对校验（含行号定位）与类型合法性
  - 本地图片引用存在性检查（缺失给警告，不阻塞）
- **`build --inline-images` 本地图片内联**：
  - 把本地相对/绝对路径图片读取为 base64 data URI
  - 粘贴进公众号编辑器会被微信自动转存为 `mmbiz.qpic.cn` 素材地址
- **公众号图片处理专题文档** `docs/wechat-images.md`
- **MCP Server 工具 `check_post`**（发布前校验）
- **CLI 集成测试** `test/cli.test.js`（spawn 真实进程，14 个用例）
- **CI 工作流** `.github/workflows/ci.yml`（Node 18 / 20 / 22 / 24 矩阵）

### 改进

- 卡片扩展重构为**工厂函数 + marked v18 内部扩展结构注入**：
  - 不再使用全局 `marked.use()` 注册，无模块级可变状态
  - 每次 `build` 绑定当前主题，多主题并发渲染不会串色
- README / CLI 帮助信息同步更新

### 修复

- 修复 marked `Parser` 构造时用 parser options 覆盖 `renderer.options`，
  导致 `inlineImages` / `baseDir` 等用户选项丢失的问题（新增 `userOptions` 独立保存）

### 测试

- 19 → 36（含 CLI 集成用例）

## [0.1.0] - 2026-09-13

### 新增

- 核心渲染引擎：基于 marked 自定义 Renderer 的全内联样式输出
- 6 平台适配：微信公众号 / 知乎 / 掘金 / CSDN / 小红书 / 通用网页
- 3 套主题：clean / paper / dark
- 代码高亮内联化（highlight.js token → 内联颜色）
- `--toc` 目录生成、GFM 任务清单、表格斑马纹
- MCP Server（list_platforms / list_themes / build_post）
- CLI 与库双入口；中英 README；7 平台宣传文案

### 测试

- 13 个单元测试全绿

[0.4.6]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.6
[0.4.5]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.5
[0.4.4]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.4
[0.4.3]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.3
[0.4.2]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.2
[0.4.1]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.1
[0.4.0]: https://github.com/la2278647-arch/postforge/releases/tag/v0.4.0
[0.3.1]: https://github.com/la2278647-arch/postforge/releases/tag/v0.3.1
[0.3.0]: https://github.com/la2278647-arch/postforge/releases/tag/v0.3.0
[0.2.0]: https://github.com/la2278647-arch/postforge/releases/tag/v0.2.0
[0.1.0]: https://github.com/la2278647-arch/postforge/releases/tag/v0.1.0