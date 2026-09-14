/**
 * PostForge MCP Server
 *
 * 让 Claude / Cursor / 任何支持 MCP 的 AI 直接调用 PostForge，
 * 一条提示词即可得到目标平台的富文本 / 纯文本。
 *
 * 启动：postforge mcp （stdio 传输）
 *
 * 暴露工具：
 *  - list_platforms  列出支持平台
 *  - list_themes     列出排版主题
 *  - build_post      把 Markdown 排版为目标平台富文本
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { build } from '../index.js';
import { analyze } from '../info.js';
import { checkDocument } from '../check.js';
import { PLATFORMS } from '../platforms.js';
import { THEMES } from '../themes.js';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
const TEMPLATE_DIR = join(__dirname, '..', '..', 'examples', 'templates');

const platformIds = Object.keys(PLATFORMS);
const themeIds = Object.keys(THEMES);

function textResult(text) {
  return { content: [{ type: 'text', text }] };
}

const server = new McpServer({
  name: 'postforge',
  version: pkg.version,
});

server.registerTool(
  'list_platforms',
  {
    title: '列出支持的平台',
    description: '返回 PostForge 支持的所有目标平台（微信公众号/知乎/掘金/CSDN/小红书等）及其说明',
    inputSchema: z.object({}),
  },
  async () =>
    textResult(
      platformIds
        .map((id) => {
          const p = PLATFORMS[id];
          return `- ${id}：${p.name} — ${p.desc}`;
        })
        .join('\n'),
    ),
);

server.registerTool(
  'list_themes',
  {
    title: '列出排版主题',
    description: '返回 PostForge 支持的排版主题（clean/paper/dark）',
    inputSchema: z.object({}),
  },
  async () =>
    textResult(
      themeIds
        .map((id) => {
          const t = THEMES[id];
          return `- ${id}：${t.name}`;
        })
        .join('\n'),
    ),
);

server.registerTool(
  'build_post',
  {
    title: 'Markdown 多平台排版',
    description:
      '把 Markdown 排版为目标平台的富文本。platform 可选 wechat/zhihu/juejin/csdn/xiaohongshu/generic（默认 wechat）。xiaohongshu 返回纯文本+图片清单+话题标签；generic 返回完整 HTML 文档；其余返回全内联样式 HTML 片段，可直接粘贴。',
    inputSchema: z.object({
      markdown: z.string().describe('要排版的 Markdown 原文'),
      platform: z
        .enum(platformIds)
        .optional()
        .describe(`目标平台，可选：${platformIds.join(' / ')}`),
      theme: z.enum(themeIds).optional().describe(`排版主题，可选：${themeIds.join(' / ')}`),
      toc: z.boolean().optional().describe('是否在文章开头生成目录（默认 false）'),
      numberedHeadings: z.boolean().optional().describe('是否给 h1/h2/h3 自动加编号（默认 false）'),
      maxWidth: z.number().optional().describe('内容最大宽度 px（默认不限制）'),
      inlineImages: z
        .boolean()
        .optional()
        .describe('本地图片内联为 base64（默认 false；粘贴公众号可自动转存素材）'),
    }),
  },
  async (args) => {
    try {
      const result = build(args.markdown, {
        platform: args.platform || 'wechat',
        theme: args.theme,
        toc: args.toc,
        numberedHeadings: args.numberedHeadings,
        maxWidth: args.maxWidth,
        inlineImages: args.inlineImages,
      });
      if (result.platform.mode === 'text') {
        const parts = [result.text];
        if (result.images.length > 0) {
          parts.push('', '—— 图片清单（按顺序插入正文）——', ...result.images);
        }
        if (result.hashtags.length > 0) {
          parts.push('', '—— 建议话题标签 ——', result.hashtags.join(' '));
        }
        return textResult(parts.join('\n'));
      }
      return textResult(result.html);
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `排版失败: ${err.message}` }],
      };
    }
  },
);

server.registerTool(
  'check_post',
  {
    title: 'Markdown 发布前静态检查',
    description:
      '检查 Markdown 的排版模板卡片（:::tip 等）是否配对、类型是否合法，以及本地图片引用是否存在。返回错误列表（阻塞）与警告列表（不阻塞）。',
    inputSchema: z.object({
      markdown: z.string().describe('要检查的 Markdown 原文'),
    }),
  },
  async (args) => {
    try {
      const { errors, warnings } = checkDocument(args.markdown, process.cwd());
      const lines = [];
      for (const e of errors) lines.push(`[错误] ${e}`);
      for (const w of warnings) lines.push(`[警告] ${w}`);
      if (errors.length === 0) {
        lines.push(
          `✓ 检查通过：${args.markdown.split('\n').length} 行，0 错误${
            warnings.length ? `，${warnings.length} 个警告` : ''
          }`,
        );
      }
      return textResult(lines.join('\n'));
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `检查失败: ${err.message}` }],
      };
    }
  },
);

server.registerTool(
  'get_post_stats',
  {
    title: '文章统计',
    description:
      '统计 Markdown 的字数（中文/英文）、图片数、代码块数、标题数、模板卡片数与预计阅读时长。适合排版前评估文章体量。',
    inputSchema: z.object({
      markdown: z.string().describe('要统计的 Markdown 原文'),
    }),
  },
  async (args) => {
    try {
      const s = analyze(args.markdown);
      const cardLine = Object.entries(s.cards).length
        ? Object.entries(s.cards).map(([k, n]) => `${k}×${n}`).join(' ')
        : '无';
      return textResult(
        [
          `字数：${s.cn + s.enWords}（中文 ${s.cn} · 英文 ${s.enWords} 词）`,
          `图片：${s.images} 张`,
          `代码块：${s.codeBlocks} 个`,
          `标题：${s.headings} 个`,
          `模板卡片：${cardLine}`,
          `预计阅读：约 ${s.minutes} 分钟`,
        ].join('\n'),
      );
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `统计失败: ${err.message}` }],
      };
    }
  },
);

server.registerTool(
  'template_list',
  {
    title: '列出排版模板',
    description: '返回 PostForge 模板库中的可用文章模板（名称 + 标题），适合创作前选择起点',
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const rows = readdirSync(TEMPLATE_DIR)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((f) => {
          const title = readFileSync(join(TEMPLATE_DIR, f), 'utf8').split('\n')[0].replace(/^#\s*/, '');
          return `${f.replace(/\.md$/, '').padEnd(20)} ${title}`;
        });
      return textResult(rows.join('\n'));
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `模板库读取失败: ${err.message}` }],
      };
    }
  },
);

server.registerTool(
  'template_get',
  {
    title: '获取排版模板全文',
    description:
      '按名称返回模板库中某个模板的完整 Markdown 内容（如 tech-tutorial / wechat-article / xiaohongshu-draft），可直接作为创作起点或改造',
    inputSchema: z.object({
      name: z.string().describe('模板名称（template_list 返回的第一列）'),
    }),
  },
  async (args) => {
    try {
      const file = join(TEMPLATE_DIR, `${args.name}.md`);
      if (!existsSync(file)) {
        return {
          isError: true,
          content: [{ type: 'text', text: `模板 "${args.name}" 不存在（template_list 查看可用模板）` }],
        };
      }
      return textResult(readFileSync(file, 'utf8'));
    } catch (err) {
      return {
        isError: true,
        content: [{ type: 'text', text: `模板读取失败: ${err.message}` }],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);