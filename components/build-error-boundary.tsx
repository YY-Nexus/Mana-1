"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { reportError } from "@/lib/error-reporting"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * 构建错误边界组件
 * 用于捕获和处理构建过程中可能出现的错误
 */
export class BuildErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染时显示降级UI
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error("构建错误边界捕获到错误:", error, errorInfo)

    // 报告错误到监控服务
    reportError(error, {
      source: "client",
      componentStack: errorInfo.componentStack,
      location: "BuildErrorBoundary",
    })

    this.setState({ errorInfo })
  }

  private handleRetry = () => {
    // 重置错误状态
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  public render() {
    if (this.state.hasError) {
      // 如果提供了自定义的降级UI，则使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认的降级UI
      return (
        <Card className="w-full max-w-md mx-auto my-8 border-red-300">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle size={20} />
              <span>组件渲染错误</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <p>渲染此组件时发生错误。这可能是由于以下原因：</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>组件中存在语法错误</li>
                <li>组件依赖的数据不可用或格式不正确</li>
                <li>组件中的某些功能在当前环境中不受支持</li>
              </ul>
            </div>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                <p className="font-bold text-red-600 dark:text-red-400">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <Button onClick={this.handleRetry} className="mt-4 w-full" variant="outline">
              重试
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
