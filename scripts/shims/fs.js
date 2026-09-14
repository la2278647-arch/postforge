/**
 * 浏览器环境 node:fs shim（demo 构建用）
 * 文件系统在浏览器中不可用：readFileSync 抛错（--inline-images 在浏览器不可用）。
 */
export const readFileSync = () => {
  throw new Error('文件系统在浏览器中不可用（--inline-images 仅支持 Node 环境）');
};
