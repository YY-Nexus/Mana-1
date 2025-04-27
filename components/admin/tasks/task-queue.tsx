"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Play } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function TaskQueue({ queueLength, isLoading, onRefresh }) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const handleProcessQueue = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/tasks/process-queue", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setProcessedCount(data.processedCount)
        toast({
          title: "处理成功",
          description: `成功处理了 ${data.processedCount} 个任务`,
        })

        // 刷新数据
        if (onRefresh) onRefresh()
      } else {
        toast({
          title: "处理失败",
          description: data.message || "处理任务队列时发生错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("处理任务队列失败:", error)
      toast({
        title: "处理失败",
        description: "处理任务队列时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>任务队列</CardTitle>
          <CardDescription>查看和处理待执行的任务队列</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">{queueLength}</div>
            <div className="text-sm text-muted-foreground">待处理任务</div>
          </div>
          <Badge
            variant="outline"
            className={
              queueLength > 0
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-green-50 text-green-700 border-green-200"
            }
          >
            {queueLength > 0 ? "有待处理任务" : "队列为空"}
          </Badge>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">处理进度</span>
              <span className="text-sm">处理中...</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )}

        {processedCount > 0 && !isProcessing && (
          <div className="p-4 bg-green-50 rounded-md text-green-700 text-sm">
            上次处理成功完成了 {processedCount} 个任务
          </div>
        )}

        {queueLength === 0 && !isProcessing && (
          <div className="p-4 bg-gray-50 rounded-md text-gray-700 text-sm">当前没有待处理的任务</div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleProcessQueue} disabled={isProcessing || queueLength === 0} className="gap-2">
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              处理队列
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
