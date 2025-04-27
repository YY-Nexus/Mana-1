"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCw, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ProcessControl() {
  const [processingStatus, setProcessingStatus] = useState<"running" | "paused">("running")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // 模拟暂停/恢复处理
  const toggleProcessing = () => {
    setIsProcessing(true)

    setTimeout(() => {
      const newStatus = processingStatus === "running" ? "paused" : "running"
      setProcessingStatus(newStatus)
      setIsProcessing(false)

      toast({
        title: newStatus === "running" ? "处理已恢复" : "处理已暂停",
        description:
          newStatus === "running"
            ? "任务处理引擎已恢复运行，将继续处理队列中的任务"
            : "任务处理引擎已暂停，队列中的任务将不会被处理",
        variant: "default",
      })
    }, 1500)
  }

  // 模拟清空队列
  const clearQueue = () => {
    if (confirm("确定要清空当前队列吗？此操作不可撤销。")) {
      setIsProcessing(true)

      setTimeout(() => {
        setIsProcessing(false)

        toast({
          title: "队列已清空",
          description: "所有待处理的任务已从队列中移除",
          variant: "default",
        })
      }, 1500)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">处理控制</CardTitle>
        <CardDescription>控制任务处理引擎的运行状态</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${processingStatus === "running" ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
              <span className="text-sm font-medium">状态: {processingStatus === "running" ? "运行中" : "已暂停"}</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              处理引擎 v1.0
            </Badge>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={processingStatus === "running" ? "outline" : "default"}
              onClick={toggleProcessing}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : processingStatus === "running" ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {processingStatus === "running" ? "暂停处理" : "恢复处理"}
            </Button>

            <Button variant="destructive" onClick={clearQueue} disabled={isProcessing}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              清空队列
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
