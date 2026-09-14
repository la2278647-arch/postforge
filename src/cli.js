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

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, watch, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
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
  postforge serve <input.md> [选项]    本地 HTTP 实时预览（改文件浏览器自动刷新）
  postforge demo                       一键体验：本地预览示例文章（自动打开浏览器）
  postforge new <模板> [-o 文件]       从模板库生成文章草稿（new list 查看模板）
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
      --watch              监听输入文件变化自动重建（边写边预览）
      --port <n>          serve 监听端口（默认 4173；0 表示自动分配）
      --no-open           serve 启动后不自动打开浏览器

示例:
  postforge build post.md -p wechat -o wechat.html
  postforge build post.md -p xiaohongshu -o xiaohongshu.txt
  postforge build post.md -p generic --toc -o preview.html
  postforge build post.md -p wechat --inline-images -o wechat.html
  postforge check post.md
  postforge serve post.md --toc
  postforge new tech-tutorial
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
    '--watch': 'watch',
    '--port': 'port',
    '--no-open': 'noOpen',
    '--json': 'json',
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
      else if (key === 'watch') opts.watch = true;
      else if (key === 'noOpen') opts.noOpen = true;
      else if (key === 'json') opts.json = true;
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

/** 跨平台打开默认浏览器（尽力而为，失败静默） */
function openBrowser(url) {
  try {
    if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true, windowsHide: true }).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { stdio: 'ignore', detached: true }).unref();
    } else {
      spawn('xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
    }
  } catch {
    /* 打开失败不影响预览服务 */
  }
}

/** 生成 serve 页面注入的自动刷新脚本（轮询 /__pf/mtime，变化即 reload） */
function refreshScript() {
  return `<script>
(function () {
  var first = true;
  function tick() {
    fetch('/__pf/mtime').then(function (r) { return r.json(); }).then(function (j) {
      if (first) { window.__pf = j.mtime; first = false; }
      else if (j.mtime !== window.__pf) { window.__pf = j.mtime; window.location.reload(); }
    }).catch(function () {});
    setTimeout(tick, 800);
  }
  tick();
})();
</script>`;
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

  let [command, ...rest] = opts._;

  // postforge demo：一键体验（等价于 serve examples/demo.md）
  if (command === 'demo') {
    rest.unshift(join(__dirname, '..', 'examples', 'demo.md'));
    command = 'serve';
  }

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
    if (opts.json) {
      process.stdout.write(
        JSON.stringify(
          {
            platforms: Object.values(PLATFORMS).map((p) => ({ id: p.id, name: p.name, mode: p.mode, desc: p.desc })),
            themes: Object.values(THEMES).map((t) => ({ id: t.id, name: t.name })),
          },
          null,
          2,
        ) + '\n',
      );
      return;
    }
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
    const jsonResults = [];
    for (const f of files) {
      const markdown = readFileSync(join(dir, f), 'utf8');
      const { errors } = checkDocument(markdown, dir);
      if (errors.length > 0) {
        failures.push(`${f}（${errors.length} 个错误，跳过）`);
        jsonResults.push({ file: f, status: 'skipped', error: errors.join('; ') });
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
      jsonResults.push({ file: f, out: outFile, status: 'ok', platform: result.platform.id });
      ok++;
    }
    if (opts.json) {
      process.stdout.write(
        JSON.stringify({ ok, total: files.length, outDir, results: jsonResults }, null, 2) + '\n',
      );
      return;
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
    if (opts.json) {
      process.stdout.write(JSON.stringify(stats, null, 2) + '\n');
      return;
    }
    console.log('📊 文章统计：');
    for (const line of formatAnalysis(stats)) console.log(`  ${line}`);
    return;
  }

  if (command === 'new') {
    // 模板库入口：postforge new list / postforge new <name> [-o 文件]
    const TEMPLATE_DIR = join(__dirname, '..', 'examples', 'templates');
    const tpl = rest[0];
    if (!tpl) {
      console.log('用法: postforge new <模板> [-o 输出文件]  （postforge new list 查看可用模板）');
      process.exit(1);
    }
    if (tpl === 'list' || tpl === 'ls') {
      let files;
      try {
        files = readdirSync(TEMPLATE_DIR).filter((f) => f.endsWith('.md')).sort();
      } catch (err) {
        console.error(`错误: 无法读取模板库: ${err.message}`);
        process.exit(1);
      }
      console.log('可用模板（postforge new <名字> 生成草稿）:');
      for (const f of files) {
        const title = readFileSync(join(TEMPLATE_DIR, f), 'utf8').split('\n')[0].replace(/^#\s*/, '');
        console.log(`  ${f.replace(/\.md$/, '').padEnd(20)} ${title}`);
      }
      return;
    }
    const src = join(TEMPLATE_DIR, `${tpl}.md`);
    if (!existsSync(src)) {
      console.error(`错误: 模板 "${tpl}" 不存在（postforge new list 查看可用模板）`);
      process.exit(1);
    }
    const outFile = opts.output ? resolve(opts.output) : join(process.cwd(), `${tpl}.md`);
    if (existsSync(outFile)) {
      console.error(`错误: ${outFile} 已存在，为不覆盖请用 -o 指定其它文件名`);
      process.exit(1);
    }
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, readFileSync(src, 'utf8'), 'utf8');
    console.log(`✓ 已生成草稿: ${outFile}`);
    console.log(`  下一步: postforge check ${basename(outFile)} && postforge build ${basename(outFile)} -p wechat -o out.html`);
    return;
  }

  if (command === 'serve') {
    // 本地 HTTP 实时预览：postforge serve <input.md> [--port N] [--no-open] [--toc] [--theme]
    const input = rest[0];
    if (!input) {
      console.error('错误: 缺少输入文件，用法: postforge serve <input.md> [--port 4173]');
      process.exit(1);
    }
    const port = opts.port === undefined ? 4173 : Number(opts.port);
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
      console.error(`错误: 非法端口 "${opts.port}"`);
      process.exit(1);
    }
    const baseTheme = opts.theme || 'clean';
    if (!THEMES[baseTheme]) {
      console.error(`错误: 未知主题 "${baseTheme}"，可用: ${Object.keys(THEMES).join(', ')}`);
      process.exit(1);
    }
    let themeObj;
    if (opts.themeFile) {
      try {
        themeObj = JSON.parse(readFileSync(opts.themeFile, 'utf8'));
        if (typeof themeObj !== 'object' || Array.isArray(themeObj)) throw new Error('主题 JSON 必须是对象');
      } catch (err) {
        console.error(`错误: 主题文件加载失败: ${err.message}`);
        process.exit(1);
      }
    }
    const baseDir = dirname(resolve(input));
    const title = basename(input, extname(input));
    // 文件实时指纹（mtime + size）：改文件后指纹立即变化，浏览器轮询即可感知
    const fileFingerprint = () => {
      try {
        const st = statSync(input);
        return `${st.mtimeMs}:${st.size}`;
      } catch {
        return '0:0';
      }
    };

    const renderPage = () => {
      try {
        const md = readFileSync(input, 'utf8');
        const { html } = build(md, {
          platform: 'generic',
          theme: baseTheme,
          themeObj,
          toc: opts.toc,
          numberedHeadings: opts.numberedHeadings,
          inlineImages: opts.inlineImages,
          baseDir,
          title,
        });
        return html.replace('</body>', `${refreshScript()}</body>`);
      } catch (err) {
        // 渲染失败时展示错误页（保留刷新脚本，改好文件自动恢复）
        const msg = String(err.message || err).replace(/</g, '&lt;');
        return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>PostForge 预览 · 渲染错误</title></head>
<body style="font-family:system-ui,sans-serif;padding:40px;background:#fef2f2;color:#7f1d1d">
<h2>⚠️ 渲染错误</h2><pre style="white-space:pre-wrap;font-size:14px">${msg}</pre>
${refreshScript()}</body></html>`;
      }
    };

    const server = createServer((req, res) => {
      if (req.url === '/__pf/mtime') {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ mtime: fileFingerprint() }));
        return;
      }
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end(renderPage());
    });

    server.listen(port, '127.0.0.1', () => {
      const realPort = server.address().port;
      const url = `http://127.0.0.1:${realPort}/`;
      console.log(`✓ 预览服务器: ${url}（Ctrl+C 退出）`);
      if (!opts.noOpen) openBrowser(url);
    });

    // 文件变化时打印提示（页面脚本会自动刷新）
    if (input !== '-') {
      try {
        watch(resolve(input), { persistent: true }, () => {
          const stamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
          console.log(`[${stamp}] 文件已更新，浏览器将自动刷新...`);
        });
      } catch (err) {
        console.error(`错误: 无法监听 ${input}: ${err.message}`);
      }
    }
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

  const doBuild = () => {
    let markdown;
    try {
      markdown = input === '-' ? readFileSync(0, 'utf8') : readFileSync(input, 'utf8');
    } catch (err) {
      console.error(`错误: 读取失败: ${err.message}`);
      if (!opts.watch) process.exit(1);
      return;
    }

    const platformId = opts.platform || 'wechat';
    if (!PLATFORMS[platformId]) {
      console.error(`错误: 未知平台 "${platformId}"，可用: ${Object.keys(PLATFORMS).join(', ')}`);
      if (!opts.watch) process.exit(1);
      return;
    }
    const baseTheme = opts.theme || 'clean';
    if (!THEMES[baseTheme]) {
      console.error(`错误: 未知主题 "${baseTheme}"，可用: ${Object.keys(THEMES).join(', ')}`);
      if (!opts.watch) process.exit(1);
      return;
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
        if (!opts.watch) process.exit(1);
        return;
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

    // --json：结构化输出（脚本/CI 集成，不打印消息）
    if (opts.json) {
      process.stdout.write(
        JSON.stringify(
          {
            platform: result.platform.id,
            theme: result.theme,
            mode: result.platform.mode,
            output: opts.output || null,
            html: result.html ?? null,
            text: result.text ?? null,
            images: result.images ?? [],
            hashtags: result.hashtags ?? [],
            toc: result.toc ?? [],
          },
          null,
          2,
        ) + '\n',
      );
      return;
    }

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
  };

  doBuild();

  // --watch：监听输入文件变化自动重建（边写边预览）
  if (opts.watch && input !== '-') {
    const watchPath = resolve(input);
    let timer = null;
    const debounced = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const stamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        console.log(`[${stamp}] 检测到变化，重新构建...`);
        doBuild();
      }, 250);
    };
    try {
      watch(watchPath, { persistent: true }, debounced);
      console.log(`👀 正在监听 ${watchPath} 的变化（Ctrl+C 退出）`);
    } catch (err) {
      console.error(`错误: 无法监听 ${watchPath}: ${err.message}`);
      process.exit(1);
    }
  }
}

main();
