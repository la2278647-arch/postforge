/**
 * 构建浏览器版 PostForge（供 docs/demo/ 交互演示使用）
 * 运行：node scripts/build-demo.mjs
 * 输出：docs/demo/postforge.browser.js（IIFE，全局 window.PostForge）
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

await build({
  entryPoints: [join(root, 'src', 'index.js')],
  outfile: join(root, 'docs', 'demo', 'postforge.browser.js'),
  bundle: true,
  platform: 'browser',
  format: 'iife',
  globalName: 'PostForge',
  target: ['es2020'],
  legalComments: 'none',
  logLevel: 'info',
  // 浏览器无 node 内置模块：alias 到空 shim（inlineImages 在浏览器不可用）
  alias: {
    'node:fs': join(root, 'scripts', 'shims', 'fs.js'),
    'node:path': join(root, 'scripts', 'shims', 'path.js'),
  },
});

console.log('✓ 已生成 docs/demo/postforge.browser.js');
