"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

// 模拟API调用
const fetchQueueLength = async () => {
  // 在实际应用中，这里会调用真正的API
  return Math.floor(Math.random() * 20)
}

export function ProcessQueueMonitor() {
  const [queueLength, setQueueLength] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { isConnected, subscribe, sendEvent } = useWebSocket()

  // 获取队列长度
  const getQueueLength = async () => {
    setIsLoading(true)
    try {
      const length = await fetchQueueLength()
      setQueueLength(length)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("获取队列长度失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载和WebSocket订阅
  useEffect(() => {
    getQueueLength()

    // 订阅队列更新事件
    const unsubscribe = subscribe("queue-update", (data) => {
      setQueueLength(data.queueLength)
      setLastUpdated(new Date())
    })

    // 模拟定期更新（仅在预览环境中）
    const interval = setInterval(() => {
      sendEvent("queue-update", { queueLength: Math.floor(Math.random() * 20) })
    }, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [subscribe, sendEvent])

  // 计算队列状态
  const getQueueStatus = () => {
    if (queueLength === null) return { label: "未知", color: "bg-gray-500" }
    if (queueLength === 0) return { label: "空闲", color: "bg-green-500" }
    if (queueLength < 5) return { label: "正常", color: "bg-blue-500" }
    if (queueLength < 10) return { label: "繁忙", color: "bg-yellow-500" }
    return { label: "拥堵", color: "bg-red-500" }
  }

  const status = getQueueStatus()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">任务队列监控</CardTitle>
          <Button variant="ghost" size="icon" onClick={getQueueLength} disabled={isLoading} className="h-8 w-8">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">刷新</span>
          </Button>
        </div>
        <CardDescription>
          当前队列状态和任务数量
          {isConnected && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              实时更新
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${status.color}`}></div>
              <span className="text-sm font-medium">{status.label}</span>
            </div>
            <div className="text-2xl font-bold">{queueLength !== null ? queueLength : "-"}</div>
          </div>

          <Progress value={queueLength !== null ? Math.min(queueLength * 5, 100) : 0} className="h-2" />

          <div className="text-xs text-muted-foreground">
            {lastUpdated ? `上次更新: ${lastUpdated.toLocaleTimeString()}` : "加载中..."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
