import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, formatAnalysis } from '../src/info.js';

test('analyze 统计中文/英文/标题/图片', () => {
  const md = '# 标题\n\n中文段落一二三\n\nEnglish words here\n\n![图](https://a.com/1.png)';
  const s = analyze(md);
  assert.equal(s.cn, 9, '中文字数（含标题"标题"2 字）');
  assert.equal(s.enWords, 3, '英文词数');
  assert.equal(s.headings, 1);
  assert.equal(s.images, 1);
  assert.ok(s.minutes >= 1);
});

test('analyze 统计代码块与模板卡片', () => {
  const md = ':::tip 提示\n内容\n:::\n\n```js\nconst a = 1;\n```';
  const s = analyze(md);
  assert.equal(s.codeBlocks, 1);
  assert.deepEqual(s.cards, { tip: 1 });
});

test('analyze 统计 divider 与嵌套卡片', () => {
  const md = ':::divider 第二章\n\n正文\n\n:::warning 警告\n内容\n:::';
  const s = analyze(md);
  assert.deepEqual(s.cards, { divider: 1, warning: 1 });
});

test('formatAnalysis 输出包含关键指标', () => {
  const lines = formatAnalysis(analyze('# 标题\n\n正文内容\n\n:::note n\nx\n:::'));
  const text = lines.join('\n');
  assert.match(text, /字数/);
  assert.match(text, /预计阅读/);
  assert.match(text, /note×1/);
});

test('analyze 空文档不报错且时长为 1 分钟', () => {
  const s = analyze('');
  assert.equal(s.cn, 0);
  assert.equal(s.minutes, 1);
});