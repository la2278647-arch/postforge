/**
 * PostForge 排版模板扩展：提示卡片（:::tip / :::warning / :::note / :::danger / :::quote）
 *
 * 语法：
 *   :::tip 标题（可选）
 *   卡片内容，支持任意 Markdown（段落、列表、代码等）
 *   :::
 *
 * 渲染为带主题配色的卡片 div（左边框 + 浅色背景 + 强调标题）。
 * quote 卡片（语录/引用）在无标题时自动附加一个装饰性左引号。
 */

import { THEMES } from './themes.js';

export const KINDS = ['tip', 'warning', 'note', 'danger', 'quote'];

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

/**
 * 创建绑定指定主题的卡片扩展。
 *
 * 每次 build 调用创建一次扩展实例，主题通过闭包传入，避免模块级可变状态
 * 在「同一进程内多主题并发渲染」时串色（旧实现用 setCardTheme 模块变量）。
 *
 * @param {object} theme THEMES 中的主题对象（需含 card 配置）
 * @returns {object} marked 块级扩展对象
 */
export function createCardExtension(theme) {
  const card = theme.card || THEMES.clean.card;
  return {
    name: 'postforgeCard',
    level: 'block',
    start(src) {
      return src.indexOf(':::');
    },
    tokenizer(src) {
      const rule = /^:::(tip|warning|note|danger|quote)(?:\s+(.*?))?\n([\s\S]*?)\n:::(?:\n|$)/;
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
      const kind = card.kinds[token.kind] || card.kinds.note;
      const titleHtml = token.title
        ? `<strong style="${toCss({ ...card.title, color: kind.accent })}">${esc(token.title)}</strong>`
        : '';
      // quote 卡片无标题时渲染一个装饰性左引号，强化「语录」语义
      const quoteMark =
        token.kind === 'quote' && !token.title
          ? `<span style="${toCss({ ...card.quote, color: kind.accent })}">“</span>`
          : '';
      return `<div style="${toCss({
        ...card.box,
        'border-left-color': kind.accent,
        'background-color': kind.bg,
      })}">${titleHtml}${quoteMark}${this.parser.parse(token.tokens)}</div>`;
    },
  };
}

/** 向后兼容：未绑定主题的默认卡片扩展（clean 主题） */
export const postforgeCardExtension = createCardExtension(THEMES.clean);

/** 供文本提取使用：把卡片 token 转成纯文本（标题 + 内容） */
export function cardToText(token, blockToText) {
  const title = token.title ? `【${token.title}】` : '';
  return `${title}${blockToText(token.tokens)}`;
}