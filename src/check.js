/**
 * PostForge 静态检查（postforge check）
 *
 * 在发布前检查 Markdown 的低级错误：
 *  - 排版模板卡片（:::tip 等）是否配对、类型是否合法
 *  - 本地图片引用对应的文件是否存在
 *
 * 纯函数，无 IO 副作用（文件存在性检查除外），便于单元测试。
 */

import { existsSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { KINDS } from './cards.js';

/** 排版模板类型（与 cards.js 同步） */
export const CARD_KINDS = KINDS;

const REMOTE_OR_SPECIAL = /^(https?:|data:|#|\/\/)/i;
/** 行首卡片标记：:::tip 标题 / :::warning / ::: 收尾 */
const CARD_LINE = /^:::(\S*)\s*(.*)$/;
/** 图片语法：![alt](url 或 local path)，支持可选 title */
const IMAGE_RE = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;

/**
 * @param {string} markdown
 * @param {string} [baseDir] 本地图片路径解析基准目录（默认 process.cwd()）
 * @returns {{errors: string[], warnings: string[]}}
 */
export function checkDocument(markdown, baseDir = process.cwd()) {
  const errors = [];
  const warnings = [];
  // CRLF 兼容：行尾 \r 会导致逐行正则（ECMAScript `.` 不匹配 \r）误判，先剥离
  const lines = markdown.split('\n').map((l) => l.replace(/\r$/, ''));
  const kindSet = new Set(CARD_KINDS);
  const stack = [];

  lines.forEach((line, i) => {
    const m = CARD_LINE.exec(line);
    if (!m) return;
    const token = m[1];
    if (token === '') {
      // 闭合符 :::（允许后面带注释文字）
      if (stack.length) stack.pop();
      else errors.push(`第 ${i + 1} 行：多余的卡片结束符 :::`);
    } else if (kindSet.has(token)) {
      // divider 为单行语法（:::divider 文字），无需闭合
      if (token !== 'divider') stack.push({ kind: token, line: i + 1 });
    } else {
      errors.push(`第 ${i + 1} 行：未知卡片类型 :::${token}（可用：${CARD_KINDS.join(' / ')}）`);
    }
  });

  stack.forEach((s) => errors.push(`第 ${s.line} 行：:::${s.kind} 卡片未闭合`));

  for (const match of markdown.matchAll(IMAGE_RE)) {
    const href = match[1];
    if (REMOTE_OR_SPECIAL.test(href)) continue;
    const abs = isAbsolute(href) ? href : resolve(baseDir, href);
    if (!existsSync(abs)) {
      warnings.push(`本地图片不存在：${href}（解析为 ${abs}）`);
    }
  }

  // 重复标题检查（warning）：同文本标题出现多次，影响目录锚点唯一性
  // 跳过围栏代码块（``` 或 ~~~）内的行，避免误报
  const HEADING_RE = /^(#{1,6})\s+(.+)$/;
  const seenHeadings = new Map();
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    const hm = HEADING_RE.exec(line);
    if (!hm) return;
    const text = hm[2].trim();
    if (seenHeadings.has(text)) {
      warnings.push(`第 ${i + 1} 行：标题「${text}」与第 ${seenHeadings.get(text)} 行重复`);
    } else {
      seenHeadings.set(text, i + 1);
    }
  });

  // 本地链接引用检查（warning）：普通链接 [text](path) 指向不存在的本地文件
  // lookbehind 排除图片 ![alt](path)
  const LINK_RE = /(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of markdown.matchAll(LINK_RE)) {
    const href = match[1];
    if (REMOTE_OR_SPECIAL.test(href)) continue;
    const abs = isAbsolute(href) ? href : resolve(baseDir, href);
    if (!existsSync(abs)) {
      warnings.push(`本地链接目标不存在：${href}（解析为 ${abs}）`);
    }
  }

  return { errors, warnings };
}