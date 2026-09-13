import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build, PLATFORMS, THEMES } from '../src/index.js';

test('wechat 输出为内联样式 section 且平台正确', () => {
  const { html, platform } = build('# 标题\n\n正文内容', { platform: 'wechat' });
  assert.equal(platform.id, 'wechat');
  assert.match(html, /^<section style=/);
  assert.match(html, /<h1 id="/);
  assert.match(html, /text-align:justify/);
});

test('引用块递归渲染（块级 token）', () => {
  const { html } = build('> 引用内容\n>\n> 第二行');
  assert.match(html, /<blockquote style=/);
  assert.match(html, /<blockquote[^>]*><p/);
});

test('任务列表渲染 ☑/☐', () => {
  const { html } = build('- [x] 完成\n- [ ] 未完成');
  assert.match(html, /☑/);
  assert.match(html, /☐/);
});

test('代码高亮输出内联样式且无残留 hljs class', () => {
  const { html } = build('```js\nconst a = 123;\n```');
  assert.doesNotMatch(html, /hljs-/);
  assert.match(html, /<span style="color:#d73a49/); // keyword 色
  assert.match(html, /<span style="color:#005cc5/); // number 色
});

test('多 class token（title function_）完整映射', () => {
  const { html } = build('```js\nbuild({\n  a: 1\n});\n```');
  assert.doesNotMatch(html, /hljs-/);
  assert.doesNotMatch(html, /<span class=/);
});

test('style 属性值内无裸双引号', () => {
  const { html } = build('**加粗** 与 *斜体* 与 `行内`');
  const styles = [...html.matchAll(/style="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(styles.length > 0, '应存在 style 属性');
  for (const s of styles) {
    assert.ok(!s.includes('"'), `style 值含裸引号: ${s}`);
  }
  // font-family 中的引号应被转义
  assert.ok(html.includes('Segoe UI'), '包含字体栈');
});

test('小红书纯文本模式：标题/图片清单/话题标签', () => {
  const r = build('# 我的标题\n\n正文内容\n\n![图](https://a.com/1.png)', {
    platform: 'xiaohongshu',
  });
  assert.equal(r.platform.id, 'xiaohongshu');
  assert.match(r.text, /【我的标题】/);
  assert.match(r.text, /正文内容/);
  assert.deepEqual(r.images, ['https://a.com/1.png']);
  assert.ok(r.hashtags.includes('#我的标题#'));
});

test('小红书有序列表序号正确', () => {
  const r = build('1. 第一步\n2. 第二步', { platform: 'xiaohongshu' });
  assert.match(r.text, /1\. 第一步/);
  assert.match(r.text, /2\. 第二步/);
});

test('小红书引用内容不丢失', () => {
  const r = build('> 这是引用', { platform: 'xiaohongshu' });
  assert.match(r.text, /> 这是引用/);
});

test('generic 输出完整 HTML 文档', () => {
  const { html } = build('# t', { platform: 'generic' });
  assert.match(html, /<!DOCTYPE html>/);
  assert.match(html, /<html lang="zh-CN">/);
});

test('toc 生成目录并带锚点', () => {
  const { html, toc } = build('# 第一章\n\n## 第二节', { platform: 'generic', toc: true });
  assert.ok(toc.length === 2);
  assert.match(html, />目录</);
  assert.match(html, /href="#第一章"/);
  assert.match(html, /href="#第二节"/);
});

test('HTML 转义安全', () => {
  const { html } = build('a < b & c > d');
  assert.match(html, /a &lt; b &amp; c &gt; d/);
});

test('提示卡片渲染（:::tip 带标题）', () => {
  const { html } = build(':::tip 小贴士\n这是**重点**内容\n:::');
  assert.match(html, /<div style="[^"]*border-left:4px solid/);
  assert.match(html, /border-left-color:#16a34a/);
  assert.match(html, /<strong style="[^"]*#16a34a[^"]*">小贴士<\/strong>/);
  assert.match(html, /<strong style="color:#1a1a1a;font-weight:700">重点<\/strong>/);
});

test('提示卡片无标题时不输出空标题', () => {
  const { html } = build(':::warning\n没有标题\n:::');
  assert.doesNotMatch(html, /<strong style="[^"]*"><\/strong>/);
  assert.match(html, /没有标题/);
});

test('四种卡片 kind 均有独立配色', () => {
  const md = ':::tip t\n1\n:::\n\n:::warning w\n2\n:::\n\n:::note n\n3\n:::\n\n:::danger d\n4\n:::';
  const { html } = build(md);
  assert.match(html, /#16a34a/); // tip 绿
  assert.match(html, /#d97706/); // warning 橙
  assert.match(html, /#2563eb/); // note 蓝
  assert.match(html, /#dc2626/); // danger 红
});

test('卡片内支持列表与代码', () => {
  const { html } = build(':::note 要点\n- a\n- b\n\n```js\nconst x = 1;\n```\n:::');
  assert.match(html, /<ul/);
  assert.match(html, /<pre/);
});

test('小红书模式提取卡片内容', () => {
  const r = build(':::tip 省钱技巧\n货比三家\n:::', { platform: 'xiaohongshu' });
  assert.match(r.text, /省钱技巧/);
  assert.match(r.text, /货比三家/);
});

test('dark 主题卡片配色不同于 clean', () => {
  const clean = build(':::note n\nx\n:::');
  const dark = build(':::note n\nx\n:::', { theme: 'dark' });
  assert.notEqual(clean.html, dark.html);
  assert.match(dark.html, /#60a5fa/);
});

test('v0.3.0 新主题注册完整且字段齐全', () => {
  const REQUIRED = [
    'container', 'heading', 'paragraph', 'strong', 'em', 'del', 'link', 'inline-code',
    'codeblock', 'blockquote', 'table', 'th', 'td', 'tr-alt', 'hr', 'ul', 'ol', 'li',
    'img', 'task', 'toc', 'card',
  ];
  for (const id of ['nord', 'coffee', 'midnight', 'one-dark', 'solarized']) {
    const t = THEMES[id];
    assert.ok(t, `主题 ${id} 存在`);
    for (const field of REQUIRED) {
      assert.ok(t[field], `主题 ${id} 缺少字段 ${field}`);
    }
    assert.ok(t.card.kinds.tip && t.card.kinds.danger, `${id} 卡片配色齐全`);
  }
});

test('build 支持自定义主题对象（themeObj），未覆盖字段继承基础', () => {
  const custom = { id: 'brand', container: { color: '#123456' }, link: { color: '#abcdef' } };
  const { html, theme } = build('## 标题\n\n[链接](https://a.com) 与 `代码`', { themeObj: custom });
  assert.equal(theme, 'brand');
  assert.match(html, /#123456/);
  assert.match(html, /#abcdef/);
  // 未覆盖字段（行内代码圆角 3px）继承 clean
  assert.match(html, /border-radius:3px/);
});

test('themeObj 可覆盖卡片配色（深合并语义）', () => {
  const custom = {
    id: 'x',
    card: { kinds: { tip: { accent: '#ff0000', bg: 'rgba(255,0,0,0.1)' } } },
  };
  const { html } = build(':::tip t\nx\n:::', { themeObj: custom });
  assert.match(html, /#ff0000/);
  // 未覆盖的 kinds（warning 等）不应丢失
  const customWarn = build(':::warning w\nx\n:::', { themeObj: custom });
  assert.match(customWarn.html, /border-left-color:/, 'warning 卡片仍应正常渲染');
});

test('六个主题均可渲染且配色互不相同', () => {
  const md = ':::tip t\nx\n:::\n\n| A |\n|---|\n| 1 |\n\n```js\nconst a = 1;\n```';
  const outputs = ['clean', 'paper', 'dark', 'nord', 'coffee', 'midnight', 'one-dark', 'solarized'].map((id) => ({
    id,
    html: build(md, { theme: id }).html,
  }));
  for (const o of outputs) {
    assert.match(o.html, /<section style=/);
    assert.match(o.html, /<table/);
    assert.match(o.html, /<pre/);
    assert.match(o.html, /border-left-color/);
  }
  const signatures = new Set(outputs.map((o) => o.html.slice(0, 200)));
  assert.ok(signatures.size >= 4, '至少 4 个主题有独立配色前缀');
});

test('quote 卡片无标题时渲染装饰性左引号', () => {
  const { html } = build(':::quote\n纸上得来终觉浅，绝知此事要躬行。\n:::');
  assert.match(html, /border-left-color:#6f42c1/);
  assert.match(html, /<span style="[^"]*">“<\/span>/);
});

test('quote 卡片带标题时不渲染装饰引号', () => {
  const { html } = build(':::quote 金句\n生活不止眼前的苟且。\n:::');
  assert.match(html, />金句</);
  assert.doesNotMatch(html, /<span style="[^"]*">“<\/span>/);
});

test('quote 卡片三主题配色独立', () => {
  const clean = build(':::quote q\nx\n:::');
  const paper = build(':::quote q\nx\n:::', { theme: 'paper' });
  const dark = build(':::quote q\nx\n:::', { theme: 'dark' });
  assert.match(clean.html, /#6f42c1/);
  assert.match(paper.html, /#7c6a4f/);
  assert.match(dark.html, /#c084fc/);
});

test('checkDocument 兼容 CRLF 换行（Windows 文件）', async () => {
  const { checkDocument } = await import('../src/check.js');
  const crlf = ':::tip 标题\r\n内容\r\n:::\r\n\r\n正文\r\n:::divider 分隔\r\n';
  const r = checkDocument(crlf, process.cwd());
  assert.deepEqual(r.errors, [], 'CRLF 文件卡片配对不应误报');
});

test('checkDocument 兼容 CRLF 且含未闭合卡片仍报错', async () => {
  const { checkDocument } = await import('../src/check.js');
  const r = checkDocument(':::warning 未闭合\r\n内容\r\n', process.cwd());
  assert.ok(r.errors.some((e) => e.includes('未闭合')), '未闭合卡片仍应报错');
});

test('图片尺寸语法：=WxH 输出 width 与 height', () => {
  const { html } = build('![图](https://a.com/x.png =300x200)');
  assert.match(html, /src="https:\/\/a.com\/x.png"/);
  assert.match(html, /width:300px/);
  assert.match(html, /height:200px/);
  assert.doesNotMatch(html, /=300x200/, '尺寸后缀不进入 src');
});

test('图片尺寸语法：=W 仅宽度，移除 max-width 限制', () => {
  const { html } = build('![图](https://a.com/y.png =400)');
  assert.match(html, /<img[^>]*width:400px/);
  assert.doesNotMatch(html, /<img[^>]*height:/, 'img 不应含 height');
  assert.doesNotMatch(html, /<img[^>]*max-width/, '显式尺寸时不再限制 max-width');
});

test('图片尺寸语法：无尺寸时保持原样', () => {
  const { html } = build('![图](https://a.com/z.png)');
  assert.doesNotMatch(html, /<img[^>]*\bwidth:\d+px/, '无尺寸时 img 无固定宽度');
  assert.match(html, /<img[^>]*max-width:100%/);
});

test('图片尺寸语法：本地图片 + --inline-images 时尺寸仍然生效', () => {
  const { html } = build('![图](images/pixel.png =120)', {
    inlineImages: true,
    baseDir: 'examples',
  });
  assert.match(html, /data:image\/png;base64/);
  assert.match(html, /<img[^>]*width:120px/);
});

test('divider 分隔条：带文字渲染上下边框夹文字', () => {
  const { html } = build('正文一\n\n:::divider 第三章\n\n正文二');
  assert.match(html, /border-top:1px solid #e5e5e5/);
  assert.match(html, /❖ 第三章 ❖/);
  assert.match(html, /text-align:center/);
});

test('divider 分隔条：无文字渲染纯分隔线', () => {
  const { html } = build(':::divider\n\n正文');
  assert.match(html, /border-top:1px solid #e5e5e5/);
  assert.doesNotMatch(html, /❖/);
});

test('divider 在 dark 主题同样可用（中性配色）', () => {
  const { html } = build(':::divider 分隔', { theme: 'dark' });
  assert.match(html, /❖ 分隔 ❖/);
});

test('divider 不要求闭合（build 不抛错）', () => {
  assert.doesNotThrow(() => build(':::divider 合法\n正文\n:::tip t\nx\n:::'));
});

test('checkDocument 识别 divider 为合法单行语法', async () => {
  const { checkDocument } = await import('../src/check.js');
  const r = checkDocument(':::tip 标题\n内容\n:::\n\n:::divider 分隔\n\n正文', 'D:\\AI回收站\\mdx-postforge');
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.every((w) => !w.includes('divider')), 'divider 不产生警告');
});

test('小红书模式：divider 渲染为分隔线文本', () => {
  const r = build(':::divider 第二章\n\n内容', { platform: 'xiaohongshu' });
  assert.match(r.text, /── 第二章 ──/);
});

test('--numbered-headings 给 h1/h2/h3 自动编号', () => {
  const md = '# 第一章\n\n## 第一节\n\n### 细节点\n\n## 第二节';
  const { html, toc } = build(md, { numberedHeadings: true });
  assert.match(html, /<h1[^>]*>1 第一章<\/h1>/);
  assert.match(html, /<h2[^>]*>1\.1 第一节<\/h2>/);
  assert.match(html, /<h3[^>]*>1\.1\.1 细节点<\/h3>/);
  assert.match(html, /<h2[^>]*>1\.2 第二节<\/h2>/);
  // 目录文本也带编号
  assert.match(JSON.stringify(toc), /1\.1 第一节/);
});

test('默认不编号（numberedHeadings=false）', () => {
  const { html } = build('# 标题\n\n## 小节');
  assert.doesNotMatch(html, /<h1[^>]*>1 标题/);
  assert.match(html, /<h1[^>]*>标题<\/h1>/);
});

test('平台与主题注册表完整', () => {
  assert.ok(Object.keys(PLATFORMS).length >= 6);
  assert.ok(Object.keys(THEMES).length >= 3);
  for (const p of Object.values(PLATFORMS)) {
    assert.ok(['html', 'text'].includes(p.mode), `${p.id} 模式非法`);
  }
  for (const id of Object.keys(PLATFORMS)) {
    const r = build('# h', { platform: id });
    assert.ok(r.platform.id === id);
  }
});