# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式，
版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.2.0] - 2026-09-14

### 新增

- **排版模板提示卡片**：`:::tip` `:::warning` `:::note` `:::danger` `:::quote`
  - 三套主题（clean / paper / dark）独立配色
  - `:::quote`（语录）无标题时自动渲染装饰性左引号
  - 卡片内容支持任意 Markdown（段落 / 列表 / 代码 / 图片）
- **`postforge check <input.md>` 静态检查**：
  - 卡片语法配对校验（含行号定位）与类型合法性
  - 本地图片引用存在性检查（缺失给警告，不阻塞）
- **`build --inline-images` 本地图片内联**：
  - 把本地相对/绝对路径图片读取为 base64 data URI
  - 粘贴进公众号编辑器会被微信自动转存为 `mmbiz.qpic.cn` 素材地址
- **公众号图片处理专题文档** `docs/wechat-images.md`：
  - 三种图片处理方式对比与推荐工作流、FAQ、批量替换脚本示例
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

- 单元测试 36 项全绿（`npm test`，node:test）