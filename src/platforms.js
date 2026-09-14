/**
 * PostForge 平台适配配置
 *
 * mode 说明：
 *  - html : 内联样式富文本，可直接粘贴进编辑器（微信公众号 / 知乎 / 掘金 / CSDN 均适用）
 *  - text : 纯文本输出（小红书等不支持富文本的平台），附带图片清单与话题标签
 *
 * fullDocument : 是否输出完整 HTML 文档（含 <head>/<style>），用于本地预览 / 自建博客 / 打印
 */

export const PLATFORMS = {
  wechat: {
    id: 'wechat',
    name: '微信公众号',
    desc: '内联样式富文本，粘贴进公众号编辑器即可，兼容性最好',
    mode: 'html',
    defaultTheme: 'clean',
  },
  zhihu: {
    id: 'zhihu',
    name: '知乎专栏',
    desc: '内联样式富文本，粘贴进知乎编辑器，知乎会自动清洗为平台风格',
    mode: 'html',
    defaultTheme: 'clean',
  },
  juejin: {
    id: 'juejin',
    name: '掘金',
    desc: '内联样式富文本，粘贴进掘金编辑器',
    mode: 'html',
    defaultTheme: 'clean',
  },
  csdn: {
    id: 'csdn',
    name: 'CSDN 博客',
    desc: '内联样式富文本，粘贴进 CSDN 富文本编辑器',
    mode: 'html',
    defaultTheme: 'clean',
  },
  yuque: {
    id: 'yuque',
    name: '语雀',
    desc: '内联样式富文本，粘贴进语雀编辑器（知识库 / 文档）',
    mode: 'html',
    defaultTheme: 'clean',
  },
  jianshu: {
    id: 'jianshu',
    name: '简书',
    desc: '内联样式富文本，粘贴进简书编辑器',
    mode: 'html',
    defaultTheme: 'clean',
  },
  cnblogs: {
    id: 'cnblogs',
    name: '博客园',
    desc: '内联样式富文本，粘贴进博客园编辑器',
    mode: 'html',
    defaultTheme: 'clean',
  },
  sf: {
    id: 'sf',
    name: '思否 SegmentFault',
    desc: '内联样式富文本，粘贴进思否（SegmentFault）编辑器',
    mode: 'html',
    defaultTheme: 'clean',
  },
  infoq: {
    id: 'infoq',
    name: 'InfoQ 中文',
    desc: '内联样式富文本，粘贴进 InfoQ 中文编辑器',
    mode: 'html',
    defaultTheme: 'clean',
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    desc: '内联样式富文本，粘贴进 Medium 编辑器（国际技术写作）',
    mode: 'html',
    defaultTheme: 'clean',
  },
  devto: {
    id: 'devto',
    name: 'DEV.to',
    desc: '内联样式富文本，粘贴进 DEV.to 编辑器（国际开发者社区）',
    mode: 'html',
    defaultTheme: 'clean',
  },
  xiaohongshu: {
    id: 'xiaohongshu',
    name: '小红书',
    desc: '纯文本 + 图片清单 + 自动话题标签（小红书不支持富文本）',
    mode: 'text',
    defaultTheme: 'clean',
  },
  generic: {
    id: 'generic',
    name: '通用网页',
    desc: '完整 HTML 文档（含 <head>/<style>），适合本地预览 / 自建博客 / 打印',
    mode: 'html',
    fullDocument: true,
    defaultTheme: 'clean',
  },
};

export function getPlatform(id) {
  return PLATFORMS[id] || PLATFORMS.wechat;
}
