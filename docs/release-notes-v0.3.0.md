# PostForge v0.3.0 Release Notes

发布日期：2026-09-14

## 🎨 新增 3 套主题（共 6 套）

| 主题 | 风格 | 一句话 |
| ---- | ---- | ---- |
| `nord` | 北欧冷灰蓝 | 技术阅读首选，冷调不刺眼 |
| `coffee` | 咖啡暖棕纸感 | 生活随笔 / 读书笔记的暖调排版 |
| `midnight` | 深夜蓝黑底 | 夜间技术阅读，蓝紫高亮 |

使用：`postforge build post.md -p wechat --theme nord`

新增主题基于 `clean` 派生（`makeTheme`），自定义主题的门槛进一步降低——`src/themes.js` 中覆盖差异配色即可。

## 🧪 测试

- 用例数：36 → **38**
- 新增：新主题字段完整性校验、六主题渲染互异性校验
- Node 18/20/22/24 兼容

## 📦 其他

- npm 发布配置就绪（files 白名单 / prepublishOnly），待 npm token 后 `npm publish` 上线
- README 主题表格与自定义主题指引更新

---

安装 / 使用见 [README](../README.md)。反馈请开 [Issue](https://github.com/la2278647-arch/postforge/issues)。