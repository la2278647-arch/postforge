# 公众号图片处理指南（PostForge 专题）

> 适用版本：PostForge ≥ 0.2.0（`--inline-images` 需要 v0.2.0+）

微信公众号是 PostForge 最主要的使用场景，**图片是公众号排版中最容易翻车的一环**。
本文说明公众号的图片机制、PostForge 提供的三种处理方式，以及批量操作的技巧。

## 为什么公众号的图片这么麻烦

1. **外链图片会被防盗链**：公众号编辑器粘贴含外链 `<img src="https://xxx">` 的 HTML 时，
   微信不会下载外链图片，只保留 URL。发布后读者在微信内打开，多数外链图直接裂图或被微信屏蔽。
2. **微信只信任自己的 CDN**：最终能稳定显示的图片地址形如
   `https://mmbiz.qpic.cn/sz_mmbiz_jpg/...`（微信素材库 CDN）。
3. **线上编辑器的静默清洗**：你手动粘贴一张图，微信立即转存并替换地址；但批量 HTML 粘贴时，
   只对 `<img>` 标签保留，仍不转存。

一句话总结：**公众号里能长久的图片，地址必须是 `mmbiz.qpic.cn`**。

## PostForge 的三种做法

### 方式一：`--inline-images` 自动内联（推荐，v0.2.0+）

PostForge 可以把**本地图片**直接以 base64 形式内联进 HTML：

```bash
postforge build post.md -p wechat --inline-images -o wechat.html
```

原理：`![图](images/1.png)` 中的本地相对路径会被读取并转成
`<img src="data:image/png;base64,....">`。你在公众号编辑器里**全选粘贴**这段 HTML 时，
微信会把 base64 图片自动上传并转成 `mmbiz.qpic.cn` 素材地址——**一次粘贴，图片全部安全落地**。

限制与注意：

- 只处理**本地文件**（相对路径或绝对路径）；`https://`、`data:` 与 `#anchor` 保持原样。
- CN 平台编辑器对超大 base64 有长度限制，单张图片建议 ≤ 1MB；大图先压缩再内联。
- 内联后的 HTML 体积变大（≈ 图片大小的 1.33 倍），只用于「粘贴给微信」这一步，别存成仓库文档。

### 方式二：素材库手动替换（零依赖，所有版本）

1. `postforge build post.md -p wechat -o wechat.html` 生成 HTML。
2. 打开 [公众号后台 → 素材库 → 图片](https://mp.weixin.qq.com)，新建图文或直接「图片」分类，
   把每张图上传进去，复制每张图的 `mmbiz.qpic.cn` 地址。
3. 用编辑器的「查找替换」（或 VS Code 等）把 HTML 里的旧 `src` 一一替换为新地址。
4. 全选复制 HTML，粘贴进公众号编辑器，保存草稿检查图片显示。

VS Code 批量替换示例：

1. 先在 Markdown 里把图片统一改成带含义的文件名，如 `![架构](images/arch.png)`。
2. 上传全部图片到素材库，得到 10 个新 URL，按名称排好。
3. 在生成的 HTML 里执行替换（Ctrl+H，勾选正则）：

   ```text
   查找: src="images/([^"]+)"
   替换: src="https://mmbiz.qpic.cn/sz_mmbiz_jpg/你上传后的真实地址"
   ```

4. 更省事的办法：把「文件名 → mmbiz 地址」的映射写成一个替换表脚本
   （参见下方 Python 示例）。

### 方式三：粘贴图片（极简场景）

正文图片很少时，直接在公众号编辑器里 `Ctrl+V` 粘贴本地截图，微信会自动转存为素材。
适合封面图、示意图不超过三五张的情况。

## 推荐工作流

```text
写 Markdown（本地图片放 images/ 目录）
        │
        ▼
postforge build post.md -p wechat --inline-images -o wechat.html
        │
        ▼
公众号编辑器：全选 → 粘贴（微信自动转存 base64 → mmbiz CDN）
        │
        ▼
另存草稿 → 逐图核对 → 发布
```

如果想保留编辑自由度（粘贴后还能微调每张图），用方式二的素材库 + 替换。

## FAQ

**Q：内联 base64 会被微信压缩吗？**
会。微信粘贴时会转存并通常压缩，显示尺寸不受影响，清晰度可能略降——介意就用素材库原图。

**Q：外链图片（GitHub 图床等）怎么办？**
微信内不可靠。要么先下载到本地再走方式一/二，要么手动上传到素材库替换成 mmbiz 地址。

**Q：`--inline-images` 会不会把站外图片也内联？**
不会。只读本地文件（存在且可读），外链与 `data:` 原样保留，避免网络请求与体积爆炸。

**Q：粘贴后图片顺序乱了？**
PostForge 的 HTML 保持 Markdown 中图片出现的顺序；小红书模式的图片清单按同样顺序给出，
两块输出顺序一致。

## 参考：文件名 → mmbiz 地址批量替换（Python）

```python
import re, pathlib

html = pathlib.Path("wechat.html").read_text(encoding="utf-8")
mapping = {
    "arch.png":   "https://mmbiz.qpic.cn/sz_mmbiz_jpg/AAA/arch",
    "screenshot.png": "https://mmbiz.qpic.cn/sz_mmbiz_jpg/AAA/screenshot",
}

def repl(m):
    return f'src="{mapping[m.group(1)]}"'

out = re.sub(r'src="images/([^"]+)"', repl, html)
pathlib.Path("wechat.html").write_text(out, encoding="utf-8")
```

---

相关阅读：`examples/demo.md`（内联图片语法示例）、`docs/case/announce.md`（用 PostForge
排版的发布文案，含 `:::warning` 图片提示）。