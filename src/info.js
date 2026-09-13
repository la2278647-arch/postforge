/**
 * PostForge 文章统计（postforge info）
 *
 * 解析 Markdown（含排版模板扩展），统计发布者关心的指标：
 * 字数（中文/英文）、图片数、代码块数、标题数、模板卡片数、预计阅读时长。
 */

import { marked } from 'marked';
import { getTheme } from './themes.js';
import { toMarkedExtensions } from './renderer.js';

const CJK_RE = /[\u4e00-\u9fa5]/g;
/** 从文本中剔除中文、空白、数字与全角符号后，统计英文单词 */
function countEnWords(text) {
  const stripped = text.replace(/[\u4e00-\u9fa5\s\d\uFF00-\uFFEF]/g, ' ');
  return (stripped.match(/[A-Za-z]+/g) || []).length;
}

/**
 * @param {string} markdown
 * @param {object} [options]
 * @param {string} [options.theme] 主题 id（决定扩展解析，默认 clean）
 * @returns {{cn:number, enWords:number, images:number, codeBlocks:number,
 *   headings:number, cards:Record<string,number>, minutes:number}}
 */
export function analyze(markdown, options = {}) {
  const theme = getTheme(options.theme);
  const tokens = marked.lexer(markdown, {
    gfm: true,
    breaks: false,
    extensions: toMarkedExtensions(theme),
  });

  const stats = { cn: 0, enWords: 0, images: 0, codeBlocks: 0, headings: 0, cards: {} };

  const walk = (toks) => {
    for (const t of toks || []) {
      if (t.type === 'image' || t.type === 'postforgeImage') {
        stats.images++;
        continue;
      }
      if (t.type === 'code') {
        stats.codeBlocks++;
        continue;
      }
      if (t.type === 'heading') stats.headings++;
      if (t.type === 'postforgeCard') {
        stats.cards[t.kind] = (stats.cards[t.kind] || 0) + 1;
        if (t.title) {
          stats.cn += (t.title.match(CJK_RE) || []).length;
          stats.enWords += countEnWords(t.title);
        }
      }
      if (t.type === 'text') {
        stats.cn += (t.text.match(CJK_RE) || []).length;
        stats.enWords += countEnWords(t.text);
      }
      if (t.tokens) walk(t.tokens);
    }
  };
  walk(tokens);

  // 预计阅读：中文约 300 字/分钟，英文约 200 词/分钟
  const minutes = Math.max(1, Math.round(stats.cn / 300 + stats.enWords / 200));
  return { ...stats, minutes };
}

/** 统计结果的友好展示（CLI 输出用） */
export function formatAnalysis(stats) {
  const lines = [
    `字数：${stats.cn + stats.enWords}（中文 ${stats.cn} · 英文 ${stats.enWords} 词）`,
    `图片：${stats.images} 张`,
    `代码块：${stats.codeBlocks} 个`,
    `标题：${stats.headings} 个`,
  ];
  const cardEntries = Object.entries(stats.cards);
  if (cardEntries.length) {
    lines.push(`模板卡片：${cardEntries.map(([k, n]) => `${k}×${n}`).join(' ')}`);
  } else {
    lines.push('模板卡片：无');
  }
  lines.push(`预计阅读：约 ${stats.minutes} 分钟`);
  return lines;
}