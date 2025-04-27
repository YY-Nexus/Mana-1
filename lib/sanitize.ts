/**
 * 净化HTML字符串，移除潜在的XSS攻击向量
 * @param html 需要净化的HTML字符串
 * @returns 净化后的安全HTML字符串
 */
export function sanitizeHtml(html: string): string {
  // 简单的HTML净化实现
  // 在生产环境中，建议使用成熟的库如DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\w+/gi, "")
    .replace(/javascript:/gi, "removed:")
}

/**
 * 净化用户输入的文本，防止XSS攻击
 * @param text 需要净化的文本
 * @returns 净化后的安全文本
 */
export function sanitizeText(text: string): string {
  if (!text) return ""
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * 净化URL，确保它是安全的
 * @param url 需要净化的URL
 * @returns 净化后的安全URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ""

  // 检查URL是否以http://或https://开头
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }

  return url
}

/**
 * 净化SQL查询，防止SQL注入
 * @param sql 需要净化的SQL查询
 * @returns 净化后的安全SQL查询
 */
export function sanitizeSql(sql: string): string {
  // 这只是一个简单的示例，实际应用中应使用参数化查询
  if (!sql) return ""
  return sql.replace(/'/g, "''").replace(/--/g, "").replace(/;/g, "")
}

/**
 * 净化文件名，移除不安全的字符
 * @param filename 需要净化的文件名
 * @returns 净化后的安全文件名
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return ""
  return filename.replace(/[/\\:*?"<>|]/g, "_").replace(/\.\./g, "_")
}

/**
 * 默认导出所有净化函数
 */
export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeSql,
  sanitizeFilename,
}
