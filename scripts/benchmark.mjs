/**
 * PostForge 性能基准（本地验证用，非测试套件）
 *
 * 生成不同规模的文档并测量 build 耗时，输出性能数据。
 * 运行：node scripts/benchmark.mjs
 */

import { build } from '../src/index.js';

function genDoc(paragraphs) {
  const parts = [];
  for (let i = 0; i < paragraphs; i++) {
    parts.push(`## 第 ${i} 节`);
    parts.push(`这是一段用于性能基准测试的正文内容。PostForge 将 Markdown 渲染为全内联样式的富文本，包含 **加粗**、*斜体*、\`行内代码\` 与[链接](https://github.com/la2278647-arch/postforge)。`);
    parts.push('```js\nconst hello = "world";\nconst list = [1, 2, 3].map(n => n * 2);\n```');
    parts.push(':::tip 提示\n基准测试卡片内容。\n:::');
    parts.push('| A | B |\n|---|---|\n| 1 | 2 |');
  }
  return parts.join('\n\n');
}

const cases = [
  { name: '5K 字', paragraphs: 20 },
  { name: '50K 字', paragraphs: 200 },
  { name: '200K 字', paragraphs: 800 },
];

console.log('PostForge 渲染性能基准（Node ' + process.version + '）\n');
for (const c of cases) {
  const md = genDoc(c.paragraphs);
  const sizeKB = (Buffer.byteLength(md, 'utf8') / 1024).toFixed(1);
  // 预热
  build(md, { platform: 'wechat' });
  const runs = 5;
  let best = Infinity;
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    const { html } = build(md, { platform: 'wechat' });
    const dt = performance.now() - t0;
    if (dt < best) best = dt;
  }
  console.log(
    `  ${c.name.padEnd(10)} 输入 ${sizeKB.padStart(6)}KB → 最快 ${best.toFixed(1)}ms（5 次采样）`,
  );
}