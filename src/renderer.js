/**
 * PostForge 核心渲染引擎
 * 基于 marked 18 的自定义 Renderer，为每个元素注入内联样式，
 * 输出可直接粘贴进微信公众号 / 知乎等富文本编辑器的 HTML。
 */

import { marked, Renderer, Parser } from 'marked';
import hljs from 'highlight.js';
import { readFileSync } from 'node:fs';
import { resolve, extname, isAbsolute } from 'node:path';
import { applyTokenStyles } from './highlight.js';
import { getTheme } from './themes.js';
import { getPlatform } from './platforms.js';
import { createCardExtension, cardToText } from './cards.js';

/**
 * 图片尺寸语法 inline 扩展：![alt](url =WxH 或 =W)
 * 优先于 marked 默认 image tokenizer；不匹配（如带 title）时返回 undefined 回退默认。
 */
const imageSizeExtension = {
  name: 'postforgeImage',
  level: 'inline',
  start(src) {
    return src.indexOf('![');
  },
  tokenizer(src) {
    const rule = /^!\[([^\]]*)\]\(([^)\s]*)(?:\s+=\s*(\d+)(?:x(\d+))?)?\)/;
    const m = rule.exec(src);
    if (!m) return undefined;
    return {
      type: 'postforgeImage',
      raw: m[0],
      text: m[1],
      href: m[2],
      width: m[3] ? Number(m[3]) : null,
      height: m[4] ? Number(m[4]) : null,
    };
  },
  renderer(token) {
    // 复用 PostRenderer.image（解析 src、注入尺寸样式）
    return this.parser.renderer.image(token);
  },
};

/**
 * 把卡片扩展转成 marked v18 内部结构（extensions.block / startBlock / renderers），
 * 直接传给本次 build 的 Lexer 与 Parser。
 *
 * marked v18 的 options.extensions 只认转换后的结构，且 lexer 忽略旧式对象数组；
 * 这里不经过全局 marked.use() 注册，避免模块级状态在多主题渲染时串色。
 */
/** 导出供 info 等模块复用（统计也需要识别卡片 token） */
export function toMarkedExtensions(theme) {
  const ext = createCardExtension(theme);
  return {
    block: [ext.tokenizer],
    startBlock: [ext.start],
    inline: [imageSizeExtension.tokenizer],
    startInline: [imageSizeExtension.start],
    renderers: { [ext.name]: ext.renderer, postforgeImage: imageSizeExtension.renderer },
  };
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

/** 常见图片 MIME 映射（inlineImages 用） */
const IMAGE_MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
};

/** 不需要（也无法）内联的 src：远程、协议相对、锚点、data URI */
function isRemoteOrSpecial(href) {
  return /^(https?:|data:|#|\/\/)/i.test(href);
}

/** 生成稳定的中文/英文锚点 id */
function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

class PostRenderer extends Renderer {
  constructor(theme, platform, options) {
    super();
    this.theme = theme;
    this.platform = platform;
    // marked 的 Parser 构造时会用 parser options 覆盖 renderer.options，
    // 因此把用户 options 存到独立字段，避免丢失（如 inlineImages / baseDir）
    this.userOptions = options || {};
    this.options = options || {};
    this.headings = [];
    this.idCounters = new Map();
    this._row = 0;
  }

  heading(token) {
    const inline = this.parser.parseInline(token.tokens);
    const plain = inline.replace(/<[^>]*>/g, '');
    const base = slugify(plain) || 'heading';
    const count = this.idCounters.get(base) || 0;
    this.idCounters.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    this.headings.push({ depth: token.depth, id, text: plain });
    const h = this.theme.heading;
    const size = this.theme[`h${token.depth}`] || {};
    return `<h${token.depth} id="${esc(id)}" style="${toCss({ ...h, ...size })}">${inline}</h${token.depth}>`;
  }

  paragraph(token) {
    return `<p style="${toCss(this.theme.paragraph)}">${this.parser.parseInline(token.tokens)}</p>`;
  }

  code(token) {
    const lang = (token.lang || '').split(/\s+/)[0];
    const source = token.text.replace(/\n$/, '');
    let body;
    if (lang && hljs.getLanguage(lang)) {
      body = applyTokenStyles(
        hljs.highlight(source, { language: lang, ignoreIllegals: true }).value,
      );
    } else {
      body = esc(source);
    }
    return `<pre style="${toCss(this.theme.codeblock)}"><code>${body}</code></pre>`;
  }

  codespan(token) {
    return `<code style="${toCss(this.theme['inline-code'])}">${esc(token.text)}</code>`;
  }

  blockquote(token) {
    // blockquote 内容为块级 tokens，需递归块级解析
    return `<blockquote style="${toCss(this.theme.blockquote)}">${this.parser.parse(token.tokens)}</blockquote>`;
  }

  list(token) {
    const style = token.ordered ? this.theme.ol : this.theme.ul;
    const tag = token.ordered ? 'ol' : 'ul';
    const items = token.items.map((it) => this.listitem(it)).join('');
    return `<${tag} style="${toCss(style)}">${items}</${tag}>`;
  }

  listitem(token) {
    // listitem 内容为块级 tokens（paragraph 等），需递归块级解析
    let body = this.parser.parse(token.tokens);
    if (token.task) {
      const mark = token.checked ? '☑' : '☐';
      body = `<span style="${toCss(this.theme.task)}">${mark}</span>${body}`;
    }
    return `<li style="${toCss(this.theme.li)}">${body}</li>`;
  }

  checkbox() {
    return '';
  }

  table(token) {
    const headerCells = token.header.map((c) => this.tablecell(c, true)).join('');
    this._row = 0;
    const rows = token.rows
      .map((r) => {
        this._row++;
        return `<tr>${r.map((c) => this.tablecell(c, false)).join('')}</tr>`;
      })
      .join('');
    return `<table style="${toCss(this.theme.table)}"><thead><tr>${headerCells}</tr></thead><tbody>${rows}</tbody></table>`;
  }

  tablecell(token, header) {
    let style = header ? { ...this.theme.th } : { ...this.theme.td };
    if (!header && this._row % 2 === 1 && this.theme['tr-alt']) {
      style = { ...style, ...this.theme['tr-alt'] };
    }
    const tag = header ? 'th' : 'td';
    return `<${tag} style="${toCss(style)}">${this.parser.parseInline(token.tokens)}</${tag}>`;
  }

  strong(token) {
    return `<strong style="${toCss(this.theme.strong)}">${this.parser.parseInline(token.tokens)}</strong>`;
  }

  em(token) {
    return `<em style="${toCss(this.theme.em)}">${this.parser.parseInline(token.tokens)}</em>`;
  }

  del(token) {
    return `<del style="${toCss(this.theme.del)}">${this.parser.parseInline(token.tokens)}</del>`;
  }

  link(token) {
    const title = token.title ? ` title="${esc(token.title)}"` : '';
    return `<a href="${esc(token.href)}"${title} style="${toCss(this.theme.link)}">${this.parser.parseInline(token.tokens)}</a>`;
  }

  image(token) {
    const alt = token.text ? ` alt="${esc(token.text)}"` : '';
    const title = token.title ? ` title="${esc(token.title)}"` : '';
    // 尺寸来自 postforgeImage 扩展 tokenizer（=WxH 语法）；默认 image token 无尺寸
    const width = token.width ?? null;
    const height = token.height ?? null;
    const src = this.resolveImageSrc(token.href);
    const style = { ...this.theme.img };
    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;
    if (width || height) delete style['max-width']; // 显式尺寸时不再限制最大宽度
    return `<img src="${esc(src)}"${alt}${title} style="${toCss(style)}" loading="lazy" referrerpolicy="no-referrer">`;
  }

  /**
   * 解析 <img> 的 src。
   * 开启 options.inlineImages 时，把本地图片读取为 base64 data URI 内联，
   * 粘贴进公众号编辑器可被微信自动转存为素材 CDN 地址。
   */
  resolveImageSrc(href) {
    const opts = this.userOptions || {};
    if (!opts.inlineImages || isRemoteOrSpecial(href)) return href;
    const base = opts.baseDir || process.cwd();
    const abs = isAbsolute(href) ? href : resolve(base, href);
    try {
      const data = readFileSync(abs);
      const mime = IMAGE_MIME[extname(href).toLowerCase()] || 'application/octet-stream';
      return `data:${mime};base64,${data.toString('base64')}`;
    } catch {
      return href; // 本地文件不存在/不可读时保持原样
    }
  }

  hr() {
    return `<hr style="${toCss(this.theme.hr)}">`;
  }

  html(token) {
    // 原始 HTML 块：按用户书写原样输出，不做样式注入
    return token.text;
  }
}

function renderToc(headings, theme) {
  const items = headings
    .filter((h) => h.depth <= 3)
    .map((h) => {
      const pad = (h.depth - 1) * 1.4;
      return `<div style="padding-left:${pad.toFixed(1)}em;line-height:1.9"><a href="#${esc(h.id)}" style="${toCss(theme.link)}">${esc(h.text)}</a></div>`;
    })
    .join('');
  return `<div style="${toCss(theme.toc)}"><strong style="color:${theme.heading.color};font-size:14px">目录</strong>${items}</div>`;
}

function wrapDocument(section, theme) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(section.title || 'PostForge 排版输出')}</title>
<style>
  body { margin: 0; padding: 40px 16px; background: #f7f7f7; }
  .pf-doc { max-width: 720px; margin: 0 auto; background: #fff; padding: 40px 36px; border-radius: 10px; box-shadow: 0 1px 8px rgba(0,0,0,.06); }
  @media (max-width: 640px) { body { padding: 16px 8px; } .pf-doc { padding: 24px 18px; } }
</style>
</head>
<body>
<div class="pf-doc">${section.body}</div>
</body>
</html>`;
}

/** 从 tokens 提取纯文本（小红书模式） */
function extractText(tokens) {
  const lines = [];
  const images = [];
  const headings = [];

  const inlineText = (toks) =>
    (toks || [])
      .map((t) => {
        if (t.type === 'text') return t.text;
        if (t.type === 'codespan') return t.text;
        if (t.type === 'link' || t.type === 'strong' || t.type === 'em' || t.type === 'del') {
          return inlineText(t.tokens);
        }
        if (t.type === 'image' || t.type === 'postforgeImage') return '[图片]';
        return '';
      })
      .join('');

  const collectImages = (toks) => {
    for (const it of toks || []) {
      if (it.type === 'image' || it.type === 'postforgeImage') images.push(it.href);
      else if (it.tokens) collectImages(it.tokens);
    }
  };

  function renderItems(items, ordered, start, out) {
    items.forEach((it, i) => {
      const mark = ordered ? `${start + i}.` : '•';
      const body = blockToText(it.tokens).trim() || inlineText(it.tokens);
      out.push(`${mark} ${body}`);
    });
  }

  function blockToText(blockTokens) {
    const out = [];
    for (const t of blockTokens || []) {
      switch (t.type) {
        case 'paragraph':
          out.push(inlineText(t.tokens));
          break;
        case 'heading':
          headings.push(inlineText(t.tokens));
          out.push(`【${inlineText(t.tokens)}】`);
          break;
        case 'blockquote':
          out.push(`> ${blockToText(t.tokens)}`);
          break;
        case 'postforgeCard':
          out.push(cardToText(t, blockToText));
          break;
        case 'list':
          renderItems(t.items, t.ordered, t.start || 1, out);
          break;
        case 'code':
          out.push('```' + (t.lang || '') + '\n' + t.text.replace(/\n$/, '') + '\n```');
          break;
        case 'table': {
          const hd = t.header.map((c) => inlineText(c.tokens)).join(' | ');
          const rows = t.rows.map((r) => r.map((c) => inlineText(c.tokens)).join(' | ')).join('\n');
          out.push(hd, rows);
          break;
        }
        case 'hr':
          out.push('---');
          break;
        case 'html':
          out.push(t.text);
          break;
        case 'text':
          out.push(t.text);
          break;
        default:
          break;
      }
      collectImages(t.tokens);
    }
    return out.filter((x) => x !== '' && x !== undefined).join('\n');
  }

  const text = blockToText(tokens).replace(/\n{3,}/g, '\n\n').trim();
  const hashtags = headings.map((h) => `#${h.replace(/[#\s]+/g, '')}#`).filter((h) => h.length > 2);
  return { text, images, hashtags };
}

/**
 * 将 Markdown 转换为目标平台格式。
 * @param {string} markdown
 * @param {object} [options]
 * @param {string} [options.platform='wechat'] 平台 id，见 PLATFORMS
 * @param {string} [options.theme] 主题 id，见 THEMES
 * @param {boolean} [options.toc] 是否生成目录
 * @param {number} [options.maxWidth] 内容最大宽度（px），默认不限制
 * @param {string} [options.title] 文档标题（generic 平台使用）
 * @returns {{platform:object, theme:string, html?:string, text?:string, images?:string[], hashtags?:string[], toc?:Array}}
 */
export function build(markdown, options = {}) {
  const platform = getPlatform(options.platform || 'wechat');
  const theme = getTheme(options.theme || platform.defaultTheme);
  // 每个 build 调用构造绑定当前主题的扩展结构，无全局注册、多主题安全
  const lexerOptions = { gfm: true, breaks: false, extensions: toMarkedExtensions(theme) };
  const tokens = marked.lexer(markdown, lexerOptions);

  if (platform.mode === 'text') {
    const { text, images, hashtags } = extractText(tokens);
    return { platform, theme: theme.id, text, images, hashtags, toc: [] };
  }

  const renderer = new PostRenderer(theme, platform, options);
  const parser = new Parser({ renderer, ...lexerOptions });
  const body = parser.parse(tokens);

  let content = body;
  if (options.toc && renderer.headings.length > 0) {
    content = renderToc(renderer.headings, theme) + content;
  }

  const containerStyle = { ...theme.container };
  if (options.maxWidth) containerStyle['max-width'] = `${options.maxWidth}px`;
  const section = `<section style="${toCss(containerStyle)}">${content}</section>`;

  if (platform.fullDocument) {
    const html = wrapDocument(
      { body: section, title: options.title || '' },
      theme,
    );
    return { platform, theme: theme.id, html, toc: renderer.headings };
  }

  return { platform, theme: theme.id, html: section, toc: renderer.headings };
}

export { PostRenderer };
