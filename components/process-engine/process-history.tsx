"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { getProcessHistory } from "@/lib/process-history-client"

export function ProcessHistory() {
  const [history, setHistory] = useState<
    Array<{
      id: number
      taskType: string
      status: string
      timestamp: string
      message: string
    }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getProcessHistory(10)
        setHistory(data)
      } catch (err) {
        console.error("获取历史记录失败:", err)
        setError("获取历史记录失败")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
    // 设置定时刷新
    const interval = setInterval(fetchHistory, 60000) // 每60秒刷新一次
    return () => clearInterval(interval)
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            成功
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            失败
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            处理中
          </Badge>
        )
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>处理历史</CardTitle>
        <CardDescription>最近处理的任务历史记录</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {error && (
            <div className="p-4 bg-red-50 rounded-md text-red-700 text-sm flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 rounded-full mt-1" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-md text-gray-700 text-sm">暂无历史记录</div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="flex items-start gap-2 pb-4 border-b last:border-0">
                  {getStatusIcon(item.status)}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.message}</p>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>任务类型: {item.taskType}</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
