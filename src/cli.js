#!/usr/bin/env node
/**
 * PostForge 命令行入口
 *
 * 用法：
 *   postforge build <input.md> [-p|--platform <id>] [-o|--output <file>] [--toc] [--theme <id>] [--max-width <px>] [--title <t>]
 *   postforge list
 *   postforge --version | -v
 *   postforge --help | -h
 *
 * 输入文件为 "-" 时从 stdin 读取。
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { build } from './index.js';
import { checkDocument } from './check.js';
import { analyze, formatAnalysis } from './info.js';
import { PLATFORMS } from './platforms.js';
import { THEMES } from './themes.js';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, basename, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const HELP = `PostForge ${pkg.version} — 开源的 Markdown 多平台排版引擎

用法:
  postforge build <input.md> [选项]    把 Markdown 排版为平台富文本
  postforge batch <目录> [选项]        批量排版目录下所有 .md（输出到 -o 目录）
  postforge check <input.md>           静态检查：卡片语法配对 / 本地图片引用
  postforge info <input.md>            文章统计：字数 / 图片 / 阅读时长
  postforge mcp                        启动 MCP stdio server（供 AI 调用）
  postforge list                       列出支持的平台与主题
  postforge doctor                     环境诊断（版本 / 依赖 / 注册表 / 渲染自检）
  postforge -v | --version            显示版本
  postforge -h | --help               显示帮助

选项:
  -p, --platform <id>    目标平台 (默认 wechat)。可用: ${Object.keys(PLATFORMS).join(', ')}
  -o, --output <file>    输出到文件 (默认输出到 stdout)
  -t, --theme <id>       排版主题 (默认跟随平台)。可用: ${Object.keys(THEMES).join(', ')}
      --toc              在文章开头生成目录
      --max-width <px>   内容最大宽度 (仅 generic 平台有意义)
      --title <t>        文档标题 (generic 平台使用)
      --inline-images    把本地图片内联为 base64 data URI（粘贴公众号可自动转存）
      --theme-file <json> 加载自定义主题 JSON（深合并到 -t 指定的基础主题）
      --numbered-headings  给 h1/h2/h3 自动加编号（如 1. / 1.1）

示例:
  postforge build post.md -p wechat -o wechat.html
  postforge build post.md -p xiaohongshu -o xiaohongshu.txt
  postforge build post.md -p generic --toc -o preview.html
  postforge build post.md -p wechat --inline-images -o wechat.html
  postforge check post.md
  cat post.md | postforge build - -p zhihu
`;

function parseArgs(argv) {
  const opts = { _: [] };
  const flagMap = {
    '-p': 'platform', '--platform': 'platform',
    '-o': 'output', '--output': 'output',
    '-t': 'theme', '--theme': 'theme',
    '--theme-file': 'themeFile',
    '--numbered-headings': 'numberedHeadings',
    '--toc': 'toc',
    '--max-width': 'maxWidth',
    '--title': 'title',
    '--inline-images': 'inlineImages',
    '-v': 'version', '--version': 'version',
    '-h': 'help', '--help': 'help',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (flagMap[a]) {
      const key = flagMap[a];
      if (key === 'toc') opts.toc = true;
      else if (key === 'inlineImages') opts.inlineImages = true;
      else if (key === 'numberedHeadings') opts.numberedHeadings = true;
      else if (key === 'version') opts.version = true;
      else if (key === 'help') opts.help = true;
      else {
        const v = argv[++i];
        if (v === undefined) throw new Error(`缺少参数值: ${a}`);
        opts[key] = v;
      }
    } else {
      opts._.push(a);
    }
  }
  return opts;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`错误: ${err.message}\n`);
    console.log(HELP);
    process.exit(1);
  }

  if (opts.help) {
    console.log(HELP);
    return;
  }
  if (opts.version) {
    console.log(pkg.version);
    return;
  }

  const [command, ...rest] = opts._;

  if (command === 'doctor') {
    // 环境诊断：Node 版本 / 依赖完整性 / 注册表 / 渲染自检
    const checks = [];
    const nodeMajor = Number(process.versions.node.split('.')[0]);
    checks.push(
      nodeMajor >= 18
        ? `✓ Node.js ${process.versions.node}（要求 >=18）`
        : `✗ Node.js ${process.versions.node} 过旧，要求 >=18`,
    );
    const deps = ['marked', 'highlight.js', '@modelcontextprotocol/sdk'];
    for (const d of deps) {
      // 覆盖三种安装布局：包内子目录 / 上层 node_modules（开发）/ 全局扁平（npm i -g）
      const candidates = [
        join(__dirname, '..', 'node_modules', d),
        join(__dirname, '..', '..', 'node_modules', d),
        join(__dirname, '..', '..', d),
      ];
      checks.push(
        candidates.some(existsSync)
          ? `✓ 依赖 ${d} 已安装`
          : `✗ 依赖 ${d} 未安装（请运行 npm install）`,
      );
    }
    checks.push(`✓ 平台注册表：${Object.keys(PLATFORMS).length} 个`);
    checks.push(`✓ 主题注册表：${Object.keys(THEMES).length} 套`);
    try {
      build('# 自检\n\n:::tip t\nx\n:::', { platform: 'wechat' });
      checks.push('✓ 渲染自检通过（含模板卡片）');
    } catch (err) {
      checks.push(`✗ 渲染自检失败: ${err.message}`);
    }
    const failed = checks.filter((c) => c.startsWith('✗')).length;
    console.log(`PostForge ${pkg.version} 环境诊断：`);
    for (const c of checks) console.log(`  ${c}`);
    console.log(failed === 0 ? '✓ 全部检查通过' : `✗ ${failed} 项异常`);
    if (failed > 0) process.exit(1);
    return;
  }

  if (command === 'list') {
    console.log('支持的平台:');
    for (const p of Object.values(PLATFORMS)) {
      console.log(`  ${p.id.padEnd(12)} ${p.name} — ${p.desc}`);
    }
    console.log('\n支持的排版主题:');
    for (const t of Object.values(THEMES)) {
      console.log(`  ${t.id.padEnd(12)} ${t.name}`);
    }
    return;
  }

  if (command === 'check') {
    const input = rest[0];
    if (!input) {
      console.error('错误: 缺少输入文件，用法: postforge check <input.md>');
      process.exit(1);
    }
    const markdown = input === '-' ? readFileSync(0, 'utf8') : readFileSync(input, 'utf8');
    const baseDir = input === '-' ? process.cwd() : dirname(resolve(input));
    const { errors, warnings } = checkDocument(markdown, baseDir);
    for (const w of warnings) console.log(`  [警告] ${w}`);
    for (const e of errors) console.log(`  [错误] ${e}`);
    if (errors.length === 0) {
      const total = markdown.split('\n').length;
      console.log(
        `✓ 检查通过：${total} 行，0 错误${warnings.length ? `，${warnings.length} 个警告` : ''}`,
      );
    } else {
      console.log(`✗ 检查未通过：${errors.length} 个错误`);
      process.exit(1);
    }
    return;
  }

  if (command === 'batch') {
    // 批量排版：postforge batch <目录> [-p 平台] [-o 输出目录] [--toc] [--theme]
    const dir = rest[0];
    if (!dir) {
      console.error('错误: 缺少目录，用法: postforge batch <目录> [-p wechat] [-o dist/]');
      process.exit(1);
    }
    const platformId = opts.platform || 'wechat';
    if (!PLATFORMS[platformId]) {
      console.error(`错误: 未知平台 "${platformId}"，可用: ${Object.keys(PLATFORMS).join(', ')}`);
      process.exit(1);
    }
    const outDir = opts.output || join(dir, 'pf-out');
    let files;
    try {
      files = readdirSync(dir)
        .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
        .sort();
    } catch (err) {
      console.error(`错误: 无法读取目录 "${dir}": ${err.message}`);
      process.exit(1);
    }
    if (files.length === 0) {
      console.log(`✓ 目录 "${dir}" 中没有 .md 文件`);
      return;
    }
    mkdirSync(outDir, { recursive: true });
    let ok = 0;
    const failures = [];
    for (const f of files) {
      const markdown = readFileSync(join(dir, f), 'utf8');
      const { errors } = checkDocument(markdown, dir);
      if (errors.length > 0) {
        failures.push(`${f}（${errors.length} 个错误，跳过）`);
        continue;
      }
      const result = build(markdown, {
        platform: platformId,
        theme: opts.theme,
        toc: opts.toc,
        inlineImages: opts.inlineImages,
        baseDir: dir,
      });
      const ext = result.platform.mode === 'text' ? '.txt' : '.html';
      const outFile = join(outDir, basename(f, extname(f)) + ext);
      writeFileSync(outFile, result.html ?? result.text, 'utf8');
      ok++;
    }
    console.log(`✓ 批量完成：${ok}/${files.length} 个文件 → ${outDir}${failures.length ? `\n  跳过：${failures.join(', ')}` : ''}`);
    return;
  }

  if (command === 'info') {
    const input = rest[0];
    if (!input) {
      console.error('错误: 缺少输入文件，用法: postforge info <input.md>');
      process.exit(1);
    }
    const markdown = input === '-' ? readFileSync(0, 'utf8') : readFileSync(input, 'utf8');
    const stats = analyze(markdown, { theme: opts.theme });
    console.log('📊 文章统计：');
    for (const line of formatAnalysis(stats)) console.log(`  ${line}`);
    return;
  }

  if (command === 'mcp') {
    // 启动 MCP stdio server（供 Claude/Cursor 等 AI 调用）
    import('./mcp/server.js').catch((err) => {
      console.error(`错误: MCP server 启动失败: ${err.message}`);
      process.exit(1);
    });
    return;
  }

  if (command !== 'build') {
    console.log(HELP);
    return;
  }

  const input = rest[0];
  if (!input) {
    console.error('错误: 缺少输入文件，用法: postforge build <input.md>');
    console.log(HELP);
    process.exit(1);
  }

  let markdown;
  if (input === '-') {
    markdown = readFileSync(0, 'utf8');
  } else {
    markdown = readFileSync(input, 'utf8');
  }

  const platformId = opts.platform || 'wechat';
  if (!PLATFORMS[platformId]) {
    console.error(`错误: 未知平台 "${platformId}"，可用: ${Object.keys(PLATFORMS).join(', ')}`);
    process.exit(1);
  }
  const baseTheme = opts.theme || 'clean';
  if (!THEMES[baseTheme]) {
    console.error(`错误: 未知主题 "${baseTheme}"，可用: ${Object.keys(THEMES).join(', ')}`);
    process.exit(1);
  }

  // 自定义主题文件：--theme-file <json>，build 内部深合并到 -t 指定的基础主题
  let themeObj;
  if (opts.themeFile) {
    try {
      themeObj = JSON.parse(readFileSync(opts.themeFile, 'utf8'));
      if (typeof themeObj !== 'object' || Array.isArray(themeObj)) {
        throw new Error('主题 JSON 必须是对象');
      }
    } catch (err) {
      console.error(`错误: 主题文件加载失败: ${err.message}`);
      process.exit(1);
    }
  }

  const result = build(markdown, {
    platform: platformId,
    theme: baseTheme,
    themeObj,
    toc: opts.toc,
    numberedHeadings: opts.numberedHeadings,
    maxWidth: opts.maxWidth ? Number(opts.maxWidth) : undefined,
    title: opts.title,
    inlineImages: opts.inlineImages,
    baseDir: input === '-' ? undefined : dirname(resolve(input)),
  });

  if (result.platform.mode === 'text') {
    const parts = [result.text];
    if (result.images.length > 0) {
      parts.push('', '—— 图片清单（按顺序插入正文）——', ...result.images);
    }
    if (result.hashtags.length > 0) {
      parts.push('', '—— 建议话题标签 ——', result.hashtags.join(' '));
    }
    const out = parts.join('\n');
    if (opts.output) {
      writeFileSync(opts.output, out, 'utf8');
      console.log(`✓ 已生成: ${opts.output} (${result.platform.name}, 纯文本模式, ${out.length} 字符)`);
    } else {
      process.stdout.write(out + '\n');
    }
    return;
  }

  if (opts.output) {
    writeFileSync(opts.output, result.html, 'utf8');
    const kb = (Buffer.byteLength(result.html, 'utf8') / 1024).toFixed(1);
    console.log(
      `✓ 已生成: ${opts.output} (${result.platform.name} · ${result.theme} 主题 · ${kb} KB${result.toc.length ? ` · ${result.toc.length} 个标题` : ''})`,
    );
  } else {
    process.stdout.write(result.html + '\n');
  }
}

main();
