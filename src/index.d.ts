/**
 * PostForge 类型声明（TypeScript 用户）
 */

/** 平台配置 */
export interface PlatformInfo {
  id: string;
  name: string;
  desc: string;
  mode: 'html' | 'text';
  defaultTheme: string;
}

/** 主题样式字段（任意 CSS 属性映射） */
export type ThemeStyle = Record<string, string>;

export interface CardKind {
  accent: string;
  bg: string;
}

export interface Theme {
  id: string;
  name: string;
  container: ThemeStyle;
  heading: ThemeStyle;
  h1?: ThemeStyle;
  h2?: ThemeStyle;
  h3?: ThemeStyle;
  h4?: ThemeStyle;
  h5?: ThemeStyle;
  h6?: ThemeStyle;
  paragraph: ThemeStyle;
  strong: ThemeStyle;
  em: ThemeStyle;
  del: ThemeStyle;
  link: ThemeStyle;
  'inline-code': ThemeStyle;
  codeblock: ThemeStyle;
  blockquote: ThemeStyle;
  table: ThemeStyle;
  th: ThemeStyle;
  td: ThemeStyle;
  'tr-alt'?: ThemeStyle;
  hr: ThemeStyle;
  ul: ThemeStyle;
  ol: ThemeStyle;
  li: ThemeStyle;
  img: ThemeStyle;
  task: ThemeStyle;
  toc: ThemeStyle;
  card: {
    box: ThemeStyle;
    title: ThemeStyle;
    kinds: Record<string, CardKind>;
  };
}

/** build 选项 */
export interface BuildOptions {
  /** 目标平台 id（默认 wechat） */
  platform?: string;
  /** 内置主题 id（clean / paper / nord / coffee / dark / midnight） */
  theme?: string;
  /** 自定义主题字段（深合并到 theme 指定的基础主题） */
  themeObj?: Partial<Theme>;
  /** 是否在文章开头生成目录 */
  toc?: boolean;
  /** 内容最大宽度（px） */
  maxWidth?: number;
  /** 文档标题（generic 平台使用） */
  title?: string;
  /** 本地图片内联为 base64 data URI */
  inlineImages?: boolean;
  /** 本地图片相对路径解析基准目录 */
  baseDir?: string;
}

/** 目录项 */
export interface TocItem {
  depth: number;
  id: string;
  text: string;
}

/** build 结果 */
export interface BuildResult {
  platform: PlatformInfo;
  theme: string;
  html?: string;
  text?: string;
  images?: string[];
  hashtags?: string[];
  toc: TocItem[];
}

/** 平台注册表 */
export const PLATFORMS: Record<string, PlatformInfo>;
/** 主题注册表 */
export const THEMES: Record<string, Theme>;

export function getPlatform(id?: string): PlatformInfo;
export function getTheme(id?: string): Theme;
/** 基于 clean 派生新主题（只覆盖差异配色） */
export function makeTheme(overrides: Partial<Theme>): Theme;
/** 深合并两个主题对象 */
export function deepMerge(base: Theme, over: Partial<Theme>): Theme;

/** 将 Markdown 排版为目标平台格式 */
export function build(markdown: string, options?: BuildOptions): BuildResult;
