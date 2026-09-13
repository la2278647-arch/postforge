# 安全策略 Security Policy

## 支持的版本

PostForge 采用「最新稳定版」维护策略：

| 版本 | 支持 |
| ---- | ---- |
| 最新 Release | ✅ 完全支持 |
| 上一个版本 | ✅ 安全修复 |
| 更早版本 | ❌ 不维护，请升级 |

## 报告漏洞

请**不要**在公开 Issue 中披露安全漏洞。优先使用 GitHub 的**私有漏洞报告**：

1. 打开仓库页 → `Security` → `Report a vulnerability`
2. 或直接访问：https://github.com/la2278647-arch/postforge/security/advisories/new

报告时请包含：

- 受影响的版本（`postforge --version`）
- 复现步骤与最小复现用例
- 影响面与危害评估（如可行）

## 处理承诺

- 72 小时内确认收到报告
- 确认有效后优先修复并发布安全版本
- 漏洞修复后会创建 GitHub Security Advisory 披露（延迟公开以保护未升级用户）

## 安全设计说明

PostForge 是纯本地工具：不收集遥测、不上传内容、无外部网络请求（除 `--inline-images` 读取本地文件外）。渲染的 HTML 来自你自己的 Markdown，粘贴进编辑器前请确保内容可信。