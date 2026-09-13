# PostForge 宣传文案 · 知乎（回答 / 想法）

> 「想法」适合短内容；「回答」适合挂到排版工具相关问题下。

---

## 想法（短）

中文创作者终于有开源的多平台排版工具了：PostForge 可以把同一篇 Markdown 一键排版成公众号/知乎/掘金/CSDN/小红书的富文本，全内联样式粘贴即用，还带代码高亮和目录。本地运行、零配置、不传数据。

GitHub：https://github.com/la2278647-arch/postforge

开源不易，求 Star 🙏

#开源 #效率工具 #Markdown #公众号排版

---

## 回答（长）

**问题方向：微信公众号排版有什么好用的开源工具？/ 如何高效多平台发文？**

回答正文：

先说结论：我用过的方案里，公众号排版工具大多只做公众号，且很多年久失修；多平台发文基本靠手动搬。最近我开源了一个工具把这件事统一了——**PostForge（帖工坊）**：https://github.com/la2278647-arch/postforge

它的核心思路：

1. **全内联样式**。公众号不支持 `<style>` 和外部 CSS，所以渲染器（基于 marked 的自定义 Renderer）把每个元素都带上内联 `style`，粘贴进公众号编辑器即可，兼容性最好。
2. **代码高亮内联化**。highlight.js 生成的 token class（`hljs-keyword` 等）会被映射成内联颜色，公众号里也能看到 GitHub 风格高亮。
3. **按平台出活**。同一篇 Markdown：
   - 公众号/知乎/掘金/CSDN → 富文本 HTML，粘贴即用；
   - 小红书 → 纯文本 + 图片清单 + 自动生成话题标签（小红书不支持富文本）；
   - 通用网页 → 完整 HTML 文档，适合预览/打印/自建博客。
4. **主题化**。内置 clean/paper/dark 三套主题，改 `src/themes.js` 就能自己定制。

用法：

```bash
npm install
node src/cli.js build post.md -p wechat -o wechat.html
```

也可以 npm 全局安装后直接用 `postforge` 命令。

谁适合用：公众号/知乎/掘金/CSDN/小红书任一平台的内容创作者，尤其是用 Markdown 写作的技术作者。MIT 协议，欢迎贡献新平台和新主题。