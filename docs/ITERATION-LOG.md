# PostForge 迭代日志（ITERATION LOG）

> 本文件记录每一轮迭代的变更内容与优化目标，是全程迭代（目标 1000 轮）的决策留痕。
> 格式：`## 第 N 轮（YYYY-MM-DD）` → 优化目标 / 变更内容 / 验证结果。

---

## 第 1 轮（2026-09-15）—— 基线同步与推广素材升级

**优化目标**：把项目基线（v0.6.1）与全部推广素材对齐，补齐阶段一调研成果存档，建立迭代日志体系。

**变更内容**：

1. **调研存档**：新增 `docs/research/market-research.md`（阶段一成果）——完成市场方向调研（MCP 生态/排版工具刚需），记录候选方向对比、选择理由、目标用户画像、数据来源。
2. **推广文案全面升级至 v0.6.1**（此前停留在 v0.2.0，功能数据严重过时）：
   - 掘金 `docs/promotion/juejin.md`：测试 36 → 78、功能列表补齐（15 平台/10 主题/11 模板、serve/new/demo/batch --json 等）
   - V2EX `docs/promotion/v2ex.md`：平台 11 → 15、测试 36 → 78、主题 6 → 10
   - 知乎 `docs/promotion/zhihu.md`：主题 3 → 10、补 serve/check 增强
   - Twitter `docs/promotion/twitter.md`：补 15 平台/10 主题/在线 Demo
   - Hacker News `docs/promotion/hackernews.md`：主题 6 → 10、测试 36 → 78
   - Reddit / 微博 `docs/promotion/reddit.md`、`weibo.md`：同步最新数据
3. **发布指引更新**：`docs/promotion/README.md` 版本标注 v0.2.0 → v0.6.1，补充发布待办。
4. **模板库补全**：`examples/templates/moving-checklist.md`（搬家清单模板）纳入版本库（此前未跟踪）。
5. **CHANGELOG**：补记本轮文档/模板迭代。

**验证结果**：`npm test` 78 用例全绿；`postforge list` / `new list` 输出 15 平台、10 主题、11 模板；已推送 GitHub `main`。

---

<!-- 后续轮次在此追加 -->
