/**
 * PostForge 排版模板扩展：提示卡片与分隔条
 *
 * 卡片语法：
 *   :::tip 标题（可选）
 *   卡片内容，支持任意 Markdown（段落、列表、代码等）
 *   :::
 *
 * 渲染为带主题配色的卡片 div（左边框 + 浅色背景 + 强调标题）。
 * quote 卡片（语录/引用）在无标题时自动附加一个装饰性左引号。
 *
 * 分隔条语法（单行，无需闭合）：
 *   :::divider 文字（可选，无文字时渲染为纯分隔线）
 * 渲染为上下边框夹文字的居中分隔条（公众号兼容）。
 */

import { THEMES } from './themes.js';

export const KINDS = ['tip', 'warning', 'note', 'danger', 'quote', 'divider', 'link', 'code'];

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
      // link：单行语法（:::link 标题 URL 或 :::link URL），渲染为链接卡片
      const linkRule = /^:::link(?:\s+(.*?))?\s+(https?:\/\/[^\s]+)(?=\n|$)/;
      const lm = linkRule.exec(src);
      if (lm) {
        const url = lm[2];
        const title = (lm[1] || url.replace(/^https?:\/\//, '')).trim();
        return {
          type: 'postforgeCard',
          raw: lm[0],
          kind: 'link',
          title,
          url,
          body: '',
          tokens: [],
        };
      }
      // divider：单行语法（:::divider 可选文字），无需闭合符；仅空格分隔标题，换行不进入标题
      const dividerRule = /^:::divider(?: +(.*?))?(?:\n(?=\n|$)|$)/;
      const dm = dividerRule.exec(src);
      if (dm) {
        return {
          type: 'postforgeCard',
          raw: dm[0],
          kind: 'divider',
          title: (dm[1] || '').trim(),
          body: '',
          tokens: [],
        };
      }
      // code 卡片：:::code 标题 + 代码块（``` 包裹）+ :::（需闭合）
      const codeRule = /^:::code(?:\s+(.*?))?\n([\s\S]*?)\n:::(?:\n|$)/;
      const cm = codeRule.exec(src);
      if (cm) {
        return {
          type: 'postforgeCard',
          raw: cm[0],
          kind: 'code',
          title: (cm[1] || '').trim(),
          body: cm[2],
          tokens: this.lexer.blockTokens(cm[2]),
        };
      }
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
      // 链接卡片：🔗 图标 + 标题 + 域名，中性配色兼容深浅主题
      if (token.kind === 'link') {
        let domain = token.url;
        try {
          domain = new URL(token.url).hostname.replace(/^www\./, '');
        } catch {
          /* 保持原 URL */
        }
        return `<div style="border:1px solid #e5e5e5;border-radius:8px;padding:12px 14px;margin-top:0;margin-bottom:16px;background-color:rgba(127,127,127,0.04)"><a href="${esc(token.url)}" style="display:flex;align-items:center;text-decoration:none;color:inherit"><span style="font-size:22px;margin-right:12px">🔗</span><span style="flex:1;min-width:0"><strong style="display:block;font-size:14px;color:#576b95;word-break:break-all">${esc(token.title)}</strong><small style="display:block;color:#a8a8a8;font-size:12px;margin-top:2px">${esc(domain)}</small></span></a></div>`;
      }
      // 代码卡片：边框圆角容器 + 标题栏 + 代码块
      if (token.kind === 'code') {
        const titleBar = token.title
          ? `<div style="padding:8px 14px;font-size:13px;color:#6b7280;background-color:rgba(127,127,127,0.08);border-bottom:1px solid #e5e5e5;font-family:&quot;SFMono-Regular&quot;,Consolas,monospace">${esc(token.title)}</div>`
          : '';
        return `<div style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin-top:0;margin-bottom:16px">${titleBar}${this.parser.parse(token.tokens)}</div>`;
      }
      // 分隔条：上下边框夹文字（无文字时渲染纯分隔线），中性配色兼容深浅主题
      if (token.kind === 'divider') {
        const label = token.title
          ? `<span style="letter-spacing:3px">❖ ${esc(token.title)} ❖</span>`
          : '';
        return `<div style="text-align:center;padding:10px 0;color:#a8a8a8;font-size:13px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;margin-top:18px;margin-bottom:18px">${label}</div>`;
      }
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
  if (token.kind === 'code') {
    return token.title ? `【代码：${token.title}】\n${blockToText(token.tokens)}` : blockToText(token.tokens);
  }
  if (token.kind === 'link') {
    return `【${token.title}】 ${token.url}`;
  }
  if (token.kind === 'divider') {
    return token.title ? `── ${token.title} ──` : '──';
  }
  const title = token.title ? `【${token.title}】` : '';
  return `${title}${blockToText(token.tokens)}`;
}