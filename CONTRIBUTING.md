# 贡献指南 Contributing

感谢你愿意为 PostForge 贡献力量！无论是新平台、新主题、渲染细节，还是文档，都非常欢迎。

## 开发环境

- Node.js >= 18（推荐 20+）
- 无构建步骤：纯 ESM JavaScript，`npm install` 后即可运行

## 常用命令

```bash
npm install     # 安装依赖
npm test        # 运行单元测试（node:test）
npm run demo    # 重新生成 examples/ 下的示例输出
node src/cli.js build post.md -p wechat -o wechat.html  # 手动验证
```

## 如何新增一个平台

1. 在 `src/platforms.js` 的 `PLATFORMS` 中追加条目（`id`、`name`、`desc`、`mode: 'html' | 'text'`、`defaultTheme`）。
2. 若涉及全新渲染行为，在 `src/renderer.js` 中调整。
3. 在 `test/renderer.test.js` 加覆盖该平台的用例。
4. 运行 `npm test`，更新 README 的平台表格与 `docs/promotion/` 相关文案。

## 如何新增一个主题

1. 在 `src/themes.js` 的 `THEMES` 中追加一个主题对象，字段与 `clean` 完全一致（含 `container`、`heading`、`paragraph`、`strong`、`em`、`del`、`link`、`inline-code`、`codeblock`、`blockquote`、`table`、`th`、`td`、`tr-alt`、`hr`、`ul`、`ol`、`li`、`img`、`task`、`toc`）。
2. 用 `--theme <id>` 实测，确保各元素排版正常。
3. README 主题表格补充说明。

## 代码规范

- 纯 ESM JavaScript，无 TypeScript、无构建链
- 新增依赖前先问自己：标准库能否实现？
- 提交前 `npm test` 必须全绿
- 提交信息遵循 Conventional Commits（`feat:` / `fix:` / `docs:` / `chore:`）

## 提交 PR

1. Fork 仓库并新建分支。
2. 完成改动并补充/更新测试。
3. 提交并推送，创建 Pull Request，描述改动与验证结果。

有任何疑问直接开 Issue 讨论，别忘了点个 Star ⭐ 支持一下～