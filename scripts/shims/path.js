/**
 * 浏览器环境 node:path shim（demo 构建用）
 * 浏览器无文件系统路径：resolve 直接返回参数，isAbsolute 恒 false。
 */
export const resolve = (_base, p) => p;
export const extname = (p) => {
  const i = String(p).lastIndexOf('.');
  return i > -1 ? p.slice(i) : '';
};
export const isAbsolute = () => false;
