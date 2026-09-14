import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDocument } from '../src/check.js';

const cli = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'cli.js');

function run(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', cwd });
}

function tmpDir(prefix) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  return {
    dir,
    cleanup() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

test('build 缺少输入文件时报错', () => {
  const r = run(['build', '-p', 'wechat'], process.cwd());
  assert.equal(r.status, 1);
  assert.match(r.stderr, /缺少输入文件/);
});

test('build stdin 管道输出 HTML', () => {
  const r = spawnSync(process.execPath, [cli, 'build', '-', '-p', 'zhihu'], {
    encoding: 'utf8',
    input: '# 标题\n\n正文内容\n',
  });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /<h1/);
  assert.match(r.stdout, /正文内容/);
});

test('check 通过：无错误无警告', () => {
  const t = tmpDir('pf-check-ok-');
  try {
    const md = join(t.dir, 'ok.md');
    writeFileSync(md, '# 标题\n\n:::tip 提示\n内容\n:::\n');
    const r = run(['check', md], t.dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /检查通过/);
  } finally {
    t.cleanup();
  }
});

test('check 报错：卡片未闭合', () => {
  const t = tmpDir('pf-check-open-');
  try {
    const md = join(t.dir, 'open.md');
    writeFileSync(md, ':::tip 危险\n忘了结束\n');
    const r = run(['check', md], t.dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /未闭合/);
    assert.match(r.stdout, /第 1 行/);
  } finally {
    t.cleanup();
  }
});

test('check 报错：未知卡片类型', () => {
  const t = tmpDir('pf-check-kind-');
  try {
    const md = join(t.dir, 'kind.md');
    writeFileSync(md, ':::hack\nx\n:::\n');
    const r = run(['check', md], t.dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /未知卡片类型 :::hack/);
  } finally {
    t.cleanup();
  }
});

test('check 报错：多余结束符', () => {
  const t = tmpDir('pf-check-close-');
  try {
    const md = join(t.dir, 'close.md');
    writeFileSync(md, '正文\n:::\n');
    const r = run(['check', md], t.dir);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /多余的卡片结束符/);
  } finally {
    t.cleanup();
  }
});

test('check 警告：本地图片不存在（不阻塞）', () => {
  const t = tmpDir('pf-check-img-');
  try {
    const md = join(t.dir, 'img.md');
    writeFileSync(md, '![图](missing.png)\n');
    const r = run(['check', md], t.dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /图片不存在/);
    assert.match(r.stdout, /1 个警告/);
  } finally {
    t.cleanup();
  }
});

test('check 忽略远程与 data URI', () => {
  const md = '![a](https://a.com/1.png)\n![b](data:image/png;base64,AAA)\n![c](#anchor)\n';
  const { errors, warnings } = checkDocument(md);
  assert.deepEqual(errors, []);
  assert.deepEqual(warnings, []);
});

test('check 识别 5 种合法卡片类型', () => {
  const md = ['tip', 'warning', 'note', 'danger', 'quote']
    .map((k) => `:::${k} ${k}标题\n内容\n:::`)
    .join('\n\n');
  assert.deepEqual(checkDocument(md).errors, []);
});

test('build --inline-images 内联本地图片为 base64', () => {
  const t = tmpDir('pf-inline-');
  try {
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    writeFileSync(join(t.dir, 'pixel.png'), png);
    writeFileSync(join(t.dir, 'post.md'), '![p](pixel.png)\n');
    const r = run(['build', 'post.md', '-p', 'wechat', '--inline-images'], t.dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /data:image\/png;base64,/);
    assert.ok(!r.stdout.includes('src="pixel.png"'));
  } finally {
    t.cleanup();
  }
});

test('build --inline-images 保持外链图片不动', () => {
  const r = spawnSync(process.execPath, [cli, 'build', '-', '-p', 'wechat', '--inline-images'], {
    encoding: 'utf8',
    input: '![x](https://a.com/1.png)\n![y](data:image/png;base64,AAA)\n',
  });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /src="https:\/\/a\.com\/1\.png"/);
  assert.match(r.stdout, /src="data:image\/png;base64,AAA"/);
  assert.doesNotMatch(r.stdout, /data:image\/png;base64,(?!AAA)/);
});

test('build --inline-images 本地文件缺失时保持原样', () => {
  const t = tmpDir('pf-inline-miss-');
  try {
    writeFileSync(join(t.dir, 'post.md'), '![m](nope.png)\n');
    const r = run(['build', 'post.md', '-p', 'wechat', '--inline-images'], t.dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /src="nope\.png"/);
  } finally {
    t.cleanup();
  }
});

test('list 命令列出平台与主题', () => {
  const r = run(['list'], process.cwd());
  assert.equal(r.status, 0);
  assert.match(r.stdout, /支持的平台/);
  assert.match(r.stdout, /微信公众号/);
  assert.match(r.stdout, /主题/);
});

test('build --theme 指定主题生效（回归：v0.4.3 曾失效）', () => {
  const t = tmpDir('pf-theme-cli-');
  try {
    writeFileSync(join(t.dir, 'post.md'), '## 标题\n\n正文\n');
    const r = run(['build', 'post.md', '-p', 'generic', '--theme', 'one-dark', '-o', 'out.html'], t.dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /one-dark 主题/, '输出消息应显示所选主题');
    const html = readFileSync(join(t.dir, 'out.html'), 'utf8');
    assert.match(html, /#e06c75/, 'one-dark 标题色应生效');
  } finally {
    t.cleanup();
  }
});

test('version 输出 semver', () => {
  const r = run(['--version'], process.cwd());
  assert.equal(r.status, 0);
  assert.match(r.stdout.trim(), /^0\.\d+\.\d+$/);
});

test('doctor 环境诊断通过', () => {
  const r = run(['doctor'], process.cwd());
  assert.equal(r.status, 0);
  assert.match(r.stdout, /全部检查通过/);
  assert.match(r.stdout, /平台注册表：13 个/);
  assert.match(r.stdout, /渲染自检通过/);
});

test('batch 批量排版目录，跳过下划线草稿', () => {
  const t = tmpDir('pf-batch-');
  try {
    writeFileSync(join(t.dir, 'a.md'), '# A\n\n:::tip t\nx\n:::\n');
    writeFileSync(join(t.dir, 'b.md'), '# B\n\n正文\n');
    writeFileSync(join(t.dir, '_draft.md'), '# 草稿\n');
    const out = join(t.dir, 'out');
    const r = run(['batch', t.dir, '-p', 'wechat', '-o', out], t.dir);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /2\/2/);
    assert.match(r.stdout, /out/);
    // 输出文件存在，草稿未处理
    const files = readdirSync(out);
    assert.deepEqual(files.sort(), ['a.html', 'b.html']);
  } finally {
    t.cleanup();
  }
});

test('batch 目录不存在时报错', () => {
  const r = run(['batch', 'no-such-dir-xyz'], process.cwd());
  assert.equal(r.status, 1);
  assert.match(r.stderr, /无法读取目录/);
});

// ---------- v0.6.0：postforge new / serve ----------

test('new list 列出模板库', () => {
  const r = run(['new', 'list'], process.cwd());
  assert.equal(r.status, 0);
  assert.match(r.stdout, /可用模板/);
  assert.match(r.stdout, /tech-tutorial/);
  assert.match(r.stdout, /xiaohongshu-draft/);
});

test('new 生成草稿且不覆盖已存在文件', () => {
  const t = tmpDir('pf-new-');
  try {
    const r1 = run(['new', 'tech-tutorial'], t.dir);
    assert.equal(r1.status, 0);
    assert.match(r1.stdout, /已生成草稿/);
    assert.ok(existsSync(join(t.dir, 'tech-tutorial.md')));
    const r2 = run(['new', 'tech-tutorial'], t.dir);
    assert.equal(r2.status, 1);
    assert.match(r2.stderr, /已存在/);
  } finally {
    t.cleanup();
  }
});

test('new 支持 -o 指定输出文件', () => {
  const t = tmpDir('pf-new-o-');
  try {
    const out = join(t.dir, 'draft', 'custom.md');
    const r = run(['new', 'faq', '-o', out], t.dir);
    assert.equal(r.status, 0);
    assert.ok(existsSync(out));
  } finally {
    t.cleanup();
  }
});

test('new 未知模板报错', () => {
  const t = tmpDir('pf-new-bad-');
  try {
    const r = run(['new', 'not-exist'], t.dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /不存在/);
  } finally {
    t.cleanup();
  }
});

test('serve 渲染页面且 mtime 指纹随文件变化（自动刷新信号）', async () => {
  const t = tmpDir('pf-serve-');
  const md = join(t.dir, 'post.md');
  writeFileSync(md, '# 版本一\n\n正文 A\n');
  const child = spawn(process.execPath, [cli, 'serve', md, '--port', '0', '--no-open'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let url = null;
  const onData = (buf) => {
    const m = buf.toString('utf8').match(/http:\/\/127\.0\.0\.1:(\d+)\//);
    if (m) url = `http://127.0.0.1:${m[1]}/`;
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  try {
    const deadline = Date.now() + 8000;
    while (!url && Date.now() < deadline) await new Promise((r) => setTimeout(r, 100));
    assert.ok(url, 'serve 应输出预览 URL');

    const get = async (path) => {
      const res = await fetch(url + path);
      return { status: res.status, text: await res.text() };
    };

    const p1 = await get('');
    assert.equal(p1.status, 200);
    assert.match(p1.text, /版本一/);
    assert.match(p1.text, /__pf\/mtime/);

    const fp1 = JSON.parse((await get('__pf/mtime')).text).mtime;
    await new Promise((r) => setTimeout(r, 60));
    writeFileSync(md, '# 版本二\n\n正文 B\n');

    let fp2 = fp1;
    for (let i = 0; i < 30 && fp2 === fp1; i++) {
      await new Promise((r) => setTimeout(r, 100));
      fp2 = JSON.parse((await get('__pf/mtime')).text).mtime;
    }
    assert.notEqual(fp2, fp1, '文件修改后 mtime 指纹应变化（触发浏览器刷新）');

    const p2 = await get('');
    assert.match(p2.text, /版本二/);
    assert.ok(!p2.text.includes('正文 A'), '页面应渲染最新内容');
  } finally {
    child.kill();
    t.cleanup();
  }
});

test('serve 非法端口报错', () => {
  const t = tmpDir('pf-serve-port-');
  try {
    writeFileSync(join(t.dir, 'post.md'), '# t\n');
    const r = run(['serve', join(t.dir, 'post.md'), '--port', 'abc'], t.dir);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /非法端口/);
  } finally {
    t.cleanup();
  }
});