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