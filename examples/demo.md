# PostForge 使用指南

PostForge（帖工坊）是一个**开源的 Markdown 多平台排版引擎**，一条命令把 Markdown 转成微信公众号、知乎、掘金、CSDN、小红书等平台的富文本。

> 本文是一篇演示文章，覆盖了标题、段落、加粗、引用、列表、表格、代码块、任务清单等常见排版元素。

## 快速开始

安装依赖并运行：

```bash
npm install
node src/cli.js build post.md -p wechat -o wechat.html
```

也可以作为库使用：

```js
import { build } from 'postforge';

const { html } = build('# 你好', { platform: 'wechat' });
console.log(html);
```

## 支持的元素

### 文字样式

支持 **加粗**、*斜体*、~~删除线~~、`行内代码`、[超链接](https://github.com/la2278647-arch/postforge)。

### 列表

无序列表：

- 公众号：内联样式，粘贴即用
- 知乎：自动清洗为平台风格
- 小红书：纯文本 + 话题标签

有序列表：

1. 编写 Markdown
2. 运行 PostForge
3. 粘贴发布

任务清单：

- [x] 完成核心渲染引擎
- [x] 支持 11 个平台
- [ ] 支持更多平台（待社区贡献）

### 表格

| 平台 | 模式 | 是否需要登录 |
| ---- | ---- | ------------ |
| 微信公众号 | 富文本 | 需要（粘贴） |
| 知乎 | 富文本 | 需要（粘贴） |
| 小红书 | 纯文本 | 需要（粘贴） |
| 通用网页 | 完整 HTML | 不需要 |

### 代码高亮

```python
def greet(name: str) -> str:
    """示例：Python 代码高亮"""
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("PostForge"))
```

```javascript
// 示例：JavaScript 代码高亮
const platforms = ['wechat', 'zhihu', 'juejin', 'csdn', 'xiaohongshu'];
platforms.forEach((p) => console.log(`支持平台: ${p}`));
```

### 提示卡片

:::tip 小贴士
PostForge 的排版模板：用 `:::tip` / `:::warning` / `:::note` / `:::danger` / `:::quote` 插入彩色提示卡片，内容支持任意 Markdown。
:::

:::warning 注意
公众号粘贴前请先保存草稿——图片需上传至公众号素材库后替换地址。
:::

:::danger 高风险
忘记闭合卡片会导致整段内容被当成普通段落，发布前记得跑 `postforge check`。
:::

:::quote
纸上得来终觉浅，绝知此事要躬行。
:::

### 发布前检查

```bash
postforge check post.md
```

`postforge check` 会校验卡片语法配对与本地图片引用（带行号定位）。配合 `--inline-images` 还可以把本地图片转成 base64 内联，粘贴公众号时微信自动转存素材。

### 图片

![PostForge Logo](https://avatars.githubusercontent.com/u/190791720?v=4)

本地图片（配 `--inline-images` 自动内联为 base64，粘贴公众号可自动转存）：

![本地图片示例](images/pixel.png)

指定尺寸（`=WxH` / `=W`，公众号控图）：

![宽度 120 的图](images/pixel.png =120)

## 常见问题

**公众号图片怎么处理？** 公众号不允许外链图片。两种解法：`--inline-images` 把本地图片转 base64 内联，粘贴时微信自动转存素材；或按 [`docs/wechat-images.md`](../docs/wechat-images.md) 用素材库手动替换。

**写完怎么自检？** 发布前跑 `postforge check post.md`，卡片配对与本地图片引用问题会带行号列出来。

**为什么选择 PostForge？** 现有工具大多只支持公众号且年久失修，PostForge 统一了多个平台的排版逻辑，支持主题定制，欢迎社区贡献。

---

*项目地址：https://github.com/la2278647-arch/postforge · MIT 协议 · 欢迎 Star 和 PR*
