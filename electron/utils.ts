/**
 * 工具函数
 */

/**
 * 判断是否为开发环境
 */
export const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
