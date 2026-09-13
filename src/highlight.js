/**
 * highlight.js token class → 内联样式 映射（GitHub 浅色主题配色）
 * 用于把 hljs 生成的 <span class="hljs-xxx"> 转为 <span style="...">，
 * 因为微信公众号等平台不支持 <style> 与外部 CSS。
 */

const HLJS_TOKEN_STYLES = {
  comment: { color: '#6a737d', 'font-style': 'italic' },
  quote: { color: '#6a737d', 'font-style': 'italic' },
  keyword: { color: '#d73a49', 'font-weight': '600' },
  'selector-tag': { color: '#d73a49' },
  subst: { color: '#24292e' },
  string: { color: '#032f62' },
  doctag: { color: '#032f62' },
  regexp: { color: '#032f62' },
  addition: { color: '#22863a' },
  number: { color: '#005cc5' },
  literal: { color: '#005cc5' },
  title: { color: '#6f42c1', 'font-weight': '600' },
  section: { color: '#6f42c1', 'font-weight': '600' },
  'selector-id': { color: '#6f42c1' },
  attr: { color: '#005cc5' },
  attribute: { color: '#005cc5' },
  variable: { color: '#e36209' },
  'template-variable': { color: '#e36209' },
  type: { color: '#005cc5' },
  'selector-class': { color: '#005cc5' },
  'built_in': { color: '#e36209' },
  'builtin-name': { color: '#e36209' },
  symbol: { color: '#e36209' },
  bullet: { color: '#e36209' },
  link: { color: '#e36209', 'text-decoration': 'underline' },
  meta: { color: '#e36209' },
  name: { color: '#22863a' },
  tag: { color: '#22863a' },
  deletion: { color: '#b31d28' },
  emphasis: { 'font-style': 'italic' },
  strong: { 'font-weight': '600' },
  function: { color: '#6f42c1' },
  params: { color: '#24292e' },
  operator: { color: '#d73a49' },
  punctuation: { color: '#24292e' },
};

/**
 * 将 highlight.js 输出 HTML 中的 token class 替换为内联样式。
 * hljs 可能输出多个 class（如 `hljs-title function_`），此处全部解析并按序合并，
 * 后出现的 token 覆盖先前的同名属性。
 * @param {string} highlightedHtml hljs.highlight(...).value
 * @returns {string}
 */
export function applyTokenStyles(highlightedHtml) {
  return highlightedHtml.replace(/<span class="([^"]*)">/g, (match, classes) => {
    const merged = {};
    for (const raw of classes.split(/\s+/)) {
      if (!raw) continue;
      const cls = raw.startsWith('hljs-') ? raw.slice(5) : raw;
      const style = HLJS_TOKEN_STYLES[cls];
      if (style) {
        for (const [k, v] of Object.entries(style)) merged[k] = v;
      }
    }
    const entries = Object.entries(merged);
    if (entries.length === 0) return '<span>';
    const inline = entries.map(([k, v]) => `${k}:${v}`).join(';');
    return `<span style="${inline}">`;
  });
}
