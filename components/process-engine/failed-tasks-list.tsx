"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, RefreshCw, RotateCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// 模拟失败任务数据
const MOCK_FAILED_TASKS = [
  {
    id: "task_1650123456_abc123",
    type: "数据同步",
    error: "数据库连接超时",
    timestamp: "2023-04-15T10:30:45Z",
    retries: 2,
    priority: 1,
  },
  {
    id: "task_1650123789_def456",
    type: "报表生成",
    error: "内存不足",
    timestamp: "2023-04-15T11:45:22Z",
    retries: 1,
    priority: 3,
  },
  {
    id: "task_1650124567_ghi789",
    type: "邮件发送",
    error: "SMTP服务器拒绝连接",
    timestamp: "2023-04-15T14:12:33Z",
    retries: 3,
    priority: 2,
  },
  {
    id: "task_1650125678_jkl012",
    type: "数据备份",
    error: "存储空间不足",
    timestamp: "2023-04-15T16:05:11Z",
    retries: 0,
    priority: 1,
  },
]

export function FailedTasksList() {
  const [failedTasks, setFailedTasks] = useState<typeof MOCK_FAILED_TASKS>([])
  const [isLoading, setIsLoading] = useState(true)
  const [retryingTaskId, setRetryingTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  // 模拟加载失败任务
  useEffect(() => {
    const timer = setTimeout(() => {
      setFailedTasks(MOCK_FAILED_TASKS)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 模拟重试任务
  const handleRetry = async (taskId: string) => {
    setRetryingTaskId(taskId)

    // 模拟API调用
    setTimeout(() => {
      // 从列表中移除任务
      setFailedTasks(failedTasks.filter((task) => task.id !== taskId))
      setRetryingTaskId(null)

      // 显示成功提示
      toast({
        title: "任务已重新加入队列",
        description: `任务 ${taskId.substring(0, 10)}... 已成功重新加入处理队列`,
        variant: "default",
      })
    }, 1500)
  }

  // 模拟刷新列表
  const handleRefresh = () => {
    setIsLoading(true)

    setTimeout(() => {
      // 随机修改一些数据以模拟刷新效果
      const updatedTasks = [...MOCK_FAILED_TASKS]
      updatedTasks.sort(() => Math.random() - 0.5)

      setFailedTasks(updatedTasks)
      setIsLoading(false)
    }, 1000)
  }

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("zh-CN")
  }

  // 获取优先级标签
  const getPriorityBadge = (priority: number) => {
    if (priority === 1) return <Badge className="bg-red-500">高</Badge>
    if (priority === 2) return <Badge className="bg-yellow-500">中</Badge>
    return <Badge className="bg-blue-500">低</Badge>
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>失败任务列表</CardTitle>
            <CardDescription>需要手动干预的失败任务</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {failedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-50 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">没有失败任务</h3>
            <p className="mt-1 text-sm text-gray-500">所有任务都已成功处理，无需手动干预</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务类型</TableHead>
                <TableHead>错误信息</TableHead>
                <TableHead>失败时间</TableHead>
                <TableHead>重试次数</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.type}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <div className="flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
                      {task.error}
                    </div>
                  </TableCell>
                  <TableCell>{formatTime(task.timestamp)}</TableCell>
                  <TableCell>{task.retries}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetry(task.id)}
                      disabled={retryingTaskId === task.id}
                    >
                      {retryingTaskId === task.id ? (
                        <>
                          <RotateCw className="mr-1 h-3 w-3 animate-spin" />
                          重试中
                        </>
                      ) : (
                        <>
                          <RotateCw className="mr-1 h-3 w-3" />
                          重试
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
