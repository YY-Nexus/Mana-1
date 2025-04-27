type ErrorContext = {
  source?: "client" | "server"
  componentStack?: string
  location?: string
  [key: string]: any
}

/**
 * 报告错误到监控服务
 * 在实际应用中，这里可以集成Sentry、LogRocket等服务
 */
export function reportError(error: Error, context: ErrorContext = {}): void {
  // 检查是否为重定向错误，如果是则不进行报告
  if (error.message === "NEXT_REDIRECT" || error.message.includes("Redirect")) {
    // 重定向是预期行为，不需要报告
    if (process.env.NODE_ENV !== "production") {
      console.log("检测到重定向，这是预期行为，不记录为错误")
    }
    return
  }

  // 检查是否为模块解析错误
  if (error.message.includes("Unable to resolve specifier") || error.message.includes("Cannot find module")) {
    // 记录模块解析错误，但不中断用户体验
    if (process.env.NODE_ENV !== "production") {
      console.warn("模块解析错误:", error.message)
      console.warn("这可能是由于缺少依赖或路径错误导致的")
    }
    // 在生产环境中，我们仍然想知道这些错误
    // 但不希望它们影响用户体验
    return
  }

  // 在开发环境中打印错误
  if (process.env.NODE_ENV !== "production") {
    console.group("错误报告")
    console.error("错误:", error)
    console.error("上下文:", context)
    console.groupEnd()
  }

  // 在生产环境中，这里可以将错误发送到监控服务
  // 例如: Sentry.captureException(error, { extra: context })
}
