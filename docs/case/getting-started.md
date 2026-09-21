# PostForge 快速上手：从 Markdown 到发布，5 分钟搞定

> 本文由 PostForge 自己排版，适合新用户通读。仓库：https://github.com/la2278647-arch/postforge

## 它是谁

PostForge（帖工坊）是一个开源的 Markdown 多平台排版引擎：同一篇文章，一条命令排版成 **16 个平台**的富文本——公众号 / 知乎 / 掘金 / CSDN / 语雀 / 简书 / 博客园 / 思否 / InfoQ / 小红书 / Medium / DEV.to / Typecho / Hashnode / WordPress / 通用网页。

:::tip 核心理念
全内联样式：公众号不认 `<style>` 和外部 CSS，PostForge 把每个元素的样式都内联进去，粘贴即所得。
:::

## 第 1 步：获取 PostForge

```bash
git clone https://github.com/la2278647-arch/postforge.git
cd postforge
npm install
```

也可以用浏览器直接体验（无需安装）：https://la2278647-arch.github.io/postforge/demo/

## 第 2 步：写文章

用任意 Markdown 编辑器写文章，可用 PostForge 的排版模板增强：

```markdown
# 标题

:::tip 小贴士
提示卡片，支持任意 Markdown。
:::

:::divider 第二章

## 小节标题

```js
const hello = 'world';
```

| 平台 | 命令 |
| ---- | ---- |
| 公众号 | -p wechat |
```

## 第 3 步：排版与质检

```bash
# 静态检查：卡片配对、图片引用（发布前必跑）
postforge check post.md

# 文章统计：字数、图片、阅读时长
postforge info post.md

# 排版：公众号（默认）
postforge build post.md -p wechat -o wechat.html
```

环境诊断（遇到问题先跑它）：

```bash
postforge doctor
```

## 第 4 步：发布

- **公众号**：打开 `wechat.html`，全选复制，粘贴进公众号编辑器
- **小红书**：`postforge build post.md -p xiaohongshu`（纯文本 + 图片清单 + 话题标签）
- **其他平台**：`-p zhihu` / `-p juejin` / `-p medium` … 一样粘贴
- **自建博客**：`-p typecho` / `-p wordpress`

:::warning 公众号图片
公众号不允许外链图片：本地图片用 `--inline-images` 自动转 base64（粘贴时微信自动转存素材），或按 `docs/wechat-images.md` 上传素材库替换。
:::

## 进阶工作流

```bash
# 边写边预览（浏览器自动刷新）
postforge serve post.md --toc

# 文件变化自动重建
postforge build post.md -p generic --watch -o preview.html

# 批量排版整个目录
postforge batch posts/ -p wechat -o dist/

# 从模板库起稿
postforge new tech-tutorial
```

:::divider 小结

**5 分钟从零到发布**：安装 → 写作 → `check`+`info` 质检 → `build` 排版 → 粘贴发布。

更多：在线 Demo · 模板库（10 篇）· 技术深挖（中英）· 宣传素材 `docs/promotion/quick-share.md`
