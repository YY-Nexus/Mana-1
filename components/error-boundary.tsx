"use client"

import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  name?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 检查是否为重定向错误，如果是则不触发错误状态
    if (error.message === "NEXT_REDIRECT" || error.message.includes("Redirect")) {
      return { hasError: false, error: null }
    }

    // 检查是否为模块解析错误
    if (error.message.includes("Unable to resolve specifier") || error.message.includes("Cannot find module")) {
      // 对于模块解析错误，我们可以选择不触发错误状态
      // 这取决于错误的严重性和对用户体验的影响
      console.warn("模块解析错误:", error.message)
      // 如果错误不影响核心功能，可以返回 { hasError: false, error: null }
      // 否则，仍然触发错误状态
      return { hasError: true, error }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 检查是否为重定向错误，如果是则不调用错误处理函数
    if (error.message === "NEXT_REDIRECT" || error.message.includes("Redirect")) {
      console.log("检测到重定向，这是预期行为，不记录为错误")
      return
    }

    // 检查是否为模块解析错误
    if (error.message.includes("Unable to resolve specifier") || error.message.includes("Cannot find module")) {
      console.warn("模块解析错误:", error.message)
      // 我们仍然调用错误处理函数，但可以添加特殊标记
      if (this.props.onError) {
        this.props.onError(error, {
          ...errorInfo,
          isModuleError: true,
        } as React.ErrorInfo)
      }
      return
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    console.error(`[ErrorBoundary] ${this.props.name || "unnamed"} caught an error:`, error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 为模块解析错误提供特殊的错误消息
      const isModuleError =
        this.state.error &&
        (this.state.error.message.includes("Unable to resolve specifier") ||
          this.state.error.message.includes("Cannot find module"))

      return (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <h2 className="text-lg font-semibold text-red-800">出错了</h2>
          {isModuleError ? (
            <p className="text-red-600">
              加载模块时发生错误。这可能是由于缺少依赖或路径错误导致的。 请联系技术支持或刷新页面重试。
            </p>
          ) : (
            <p className="text-red-600">组件渲染时发生错误。</p>
          )}
          {this.state.error && (
            <pre className="mt-2 p-2 bg-red-100 rounded text-sm overflow-auto">{this.state.error.toString()}</pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
