/**
 * PostForge 排版模板扩展：提示卡片（:::tip / :::warning / :::note / :::danger）
 *
 * 语法：
 *   :::tip 标题（可选）
 *   卡片内容，支持任意 Markdown（段落、列表、代码等）
 *   :::
 *
 * 渲染为带主题配色的卡片 div（左边框 + 浅色背景 + 强调标题）。
 */

import { THEMES } from './themes.js';

let currentTheme = null;

export function setCardTheme(theme) {
  currentTheme = theme;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toCss(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${String(v).replace(/"/g, '&quot;')}`)
    .join(';');
}

const KINDS = ['tip', 'warning', 'note', 'danger'];

export const postforgeCardExtension = {
  name: 'postforgeCard',
  level: 'block',
  start(src) {
    return src.indexOf(':::');
  },
  tokenizer(src) {
    const rule = /^:::(tip|warning|note|danger)(?:\s+(.*?))?\n([\s\S]*?)\n:::(?:\n|$)/;
    const match = rule.exec(src);
    if (!match) return undefined;
    return {
      type: 'postforgeCard',
      raw: match[0],
      kind: match[1],
      title: (match[2] || '').trim(),
      body: match[3],
      tokens: this.lexer.blockTokens(match[3]),
    };
  },
  renderer(token) {
    const theme = currentTheme || THEMES.clean;
    const card = theme.card || THEMES.clean.card;
    const kind = card.kinds[token.kind] || card.kinds.note;
    const titleHtml = token.title
      ? `<strong style="${toCss({ ...card.title, color: kind.accent })}">${esc(token.title)}</strong>`
      : '';
    return `<div style="${toCss({ ...card.box, 'border-left-color': kind.accent, 'background-color': kind.bg })}">${titleHtml}${this.parser.parse(token.tokens)}</div>`;
  },
};

export { KINDS };

/** 供文本提取使用：把卡片 token 转成纯文本（标题 + 内容） */
export function cardToText(token, blockToText) {
  const title = token.title ? `【${token.title}】` : '';
  return `${title}${blockToText(token.tokens)}`;
}