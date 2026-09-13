# PostForge 宣传发布指引

本目录为各平台就绪的宣传文案，复制即发。发布后请把对应链接回填到
`docs/promotion/links.md`（已建好归档表，直接补链接即可），方便归档与互相引流。

当前版本：**v0.2.0**（提示卡片 / postforge check / --inline-images / MCP check_post），
发布前用 `postforge check` 校验文案 Markdown。

## 覆盖的平台

| 平台 | 文件 | 说明 |
| ---- | ---- | ---- |
| 微博 / 即刻 | `weibo.md` | 3 条短文案（推荐 A） |
| V2EX | `v2ex.md` | 「分享创造」标题 + 正文 |
| 掘金 | `juejin.md` | 技术长文（Markdown，可直接贴） |
| 知乎 | `zhihu.md` | 想法（短）+ 回答（长） |
| Twitter / X | `twitter.md` | 英文帖子 + Thread 版 |
| Hacker News | `hackernews.md` | Show HN 格式 |
| Reddit | `reddit.md` | r/opensource 与 r/selfhosted 两版 |

## 发布注意事项

1. 发布前确认仓库已公开且可在浏览器打开：https://github.com/la2278647-arch/postforge
2. 各平台自检索规则不同，先阅读对应节点的版规：
   - V2EX「分享创造」节点允许展示作品
   - Reddit 各 sub 对 self-promo 有比例限制
   - 掘金热门推荐要求文章原创且内容完整（`juejin.md` 已是完整文章）
3. 发布后把链接追加到 `links.md`，并在下一轮迭代时把社区反馈（Issue / Star / 评论）带回来。

## 素材

- Logo：`docs/logo.svg`
- 交互式架构图：`docs/diagram/dataflow-postforge.html`（README 展示用截图：`docs/diagram/*.png`）
- 发布文案例（自举）：`docs/case/announce.md` → wechat/xiaohongshu/generic 三输出
- 技术深挖文（自举）：`docs/case/tech-deep.md`（中文）→ wechat/juejin/generic 三输出（适合掘金/知乎技术板块）
- 技术深挖文 English：`docs/case/tech-deep.en.md` → generic/wechat 两输出（适合 Hacker News / Reddit 引流深链）
- 示例输出：`examples/demo-wechat.html`、`examples/demo-generic.html`、`examples/demo-xiaohongshu.txt`
- 演示命令：`npm run demo` 可重新生成全部示例