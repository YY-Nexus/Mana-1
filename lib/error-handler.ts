// 错误处理工具

/**
 * API错误响应接口
 */
export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
  statusCode: number
}

/**
 * 应用错误类
 * 用于创建应用特定的错误
 */
export class AppError extends Error {
  statusCode: number
  code: string

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
  }
}

/**
 * 处理API错误
 * @param error 错误对象
 * @param defaultMessage 默认错误消息
 * @returns 格式化的错误响应
 */
export function handleApiError(error: unknown, defaultMessage = "服务器内部错误"): ApiErrorResponse {
  console.error("API错误:", error)

  // 默认错误响应
  const errorResponse: ApiErrorResponse = {
    success: false,
    message: defaultMessage,
    statusCode: 500,
  }

  // 如果是AppError对象，使用其状态码和消息
  if (error instanceof AppError) {
    errorResponse.statusCode = error.statusCode
    errorResponse.message = error.message
    errorResponse.error = error.code
  }
  // 如果是Error对象，添加错误信息
  else if (error instanceof Error) {
    errorResponse.error = error.message
  }

  return errorResponse
}

/**
 * 创建自定义API错误
 * @param message 错误消息
 * @param statusCode HTTP状态码
 */
export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
  }
}

/**
 * 安全地解析JSON
 * @param text 要解析的文本
 * @param fallback 解析失败时的默认值
 * @returns 解析结果
 */
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T
  } catch (error) {
    console.error("JSON解析错误:", error)
    return fallback
  }
}
