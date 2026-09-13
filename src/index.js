/**
 * PostForge 帖工坊 — 开源的 Markdown 多平台排版引擎
 * 公开 API：build(markdown, options)
 */

export { build, PostRenderer, deepMerge } from './renderer.js';
export { PLATFORMS, getPlatform } from './platforms.js';
export { THEMES, getTheme, makeTheme } from './themes.js';
