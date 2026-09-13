# PostForge v0.2.0 Release Notes

> 写一份 Markdown，排版到 6 个平台直接发。https://github.com/la2278647-arch/postforge

## 新增

- **排版模板提示卡片** `:::tip / :::warning / :::note / :::danger / :::quote`
  - 内容支持任意 Markdown；配色自动跟随 clean / paper / dark 三套主题
  - `:::quote`（语录）无标题时自动渲染装饰性左引号
- **`postforge check <input.md>` 发布前静态检查**
  - 卡片语法配对与类型合法性（错误，带行号）
  - 本地图片引用存在性（警告，不阻塞）
- **`--inline-images` 本地图片一键内联**
  - 本地图片转 base64 data URI；粘贴公众号时微信自动转存为 `mmbiz.qpic.cn` 素材地址
  - 外链 / data URI / 锚点保持原样
- **公众号图片处理专题** `docs/wechat-images.md`
  - 三种处理方式对比、推荐工作流、FAQ、批量替换脚本
- **MCP `check_post` 工具**；`build_post` 支持 `inlineImages`
- **CI 工作流**（Node 18 / 20 / 22 / 24 矩阵）：`npm ci` + `npm test` + `npm run demo`

## 质量

- 36 个测试全绿（渲染 + CLI 集成，node:test）
- 卡片扩展重构为工厂函数 + marked v18 内部扩展结构注入：无全局注册、多主题并发安全
- 修复 marked Parser 覆盖 `renderer.options` 导致用户选项丢失的问题

## 用法

```bash
npx postforge build post.md -p wechat --inline-images -o wechat.html
npx postforge check post.md
```

## 致谢

MIT 协议，欢迎 Star、Issue 与 PR。下一站：公众号图片一键上传（素材库 API 自动化）。