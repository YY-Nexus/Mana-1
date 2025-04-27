"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Search, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 模拟任务执行日志数据
const MOCK_LOGS = [
  {
    id: 1,
    taskId: "task_1650123456_abc123",
    taskType: "数据同步",
    status: "success",
    message: "成功同步1250条记录",
    executedAt: "2023-04-15T10:30:45Z",
    duration: 3500,
  },
  {
    id: 2,
    taskId: "task_1650123789_def456",
    taskType: "报表生成",
    status: "failed",
    message: "内存不足，无法生成报表",
    executedAt: "2023-04-15T11:45:22Z",
    duration: 12000,
  },
  {
    id: 3,
    taskId: "task_1650124567_ghi789",
    taskType: "邮件发送",
    status: "success",
    message: "成功发送15封邮件",
    executedAt: "2023-04-15T14:12:33Z",
    duration: 2100,
  },
  {
    id: 4,
    taskId: "task_1650125678_jkl012",
    taskType: "数据备份",
    status: "success",
    message: "成功备份数据库",
    executedAt: "2023-04-15T16:05:11Z",
    duration: 45000,
  },
  {
    id: 5,
    taskId: "task_1650126789_mno345",
    taskType: "系统清理",
    status: "success",
    message: "成功清理临时文件",
    executedAt: "2023-04-15T18:30:45Z",
    duration: 1800,
  },
]

export function TaskExecutionLogs() {
  const [logs, setLogs] = useState<typeof MOCK_LOGS>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isExporting, setIsExporting] = useState(false)

  // 模拟加载日志
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(MOCK_LOGS)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 处理搜索和过滤
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || log.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // 模拟刷新日志
  const handleRefresh = () => {
    setIsLoading(true)

    setTimeout(() => {
      // 随机修改一些数据以模拟刷新效果
      const updatedLogs = [...MOCK_LOGS]
      updatedLogs.sort(() => Math.random() - 0.5)

      setLogs(updatedLogs)
      setIsLoading(false)
    }, 1000)
  }

  // 模拟导出日志
  const handleExport = () => {
    setIsExporting(true)

    setTimeout(() => {
      setIsExporting(false)

      // 在实际应用中，这里会触发文件下载
      alert("日志已导出为CSV文件")
    }, 1500)
  }

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("zh-CN")
  }

  // 格式化持续时间
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}毫秒`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}秒`
    return `${(ms / 60000).toFixed(1)}分钟`
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    if (status === "success") return <Badge className="bg-green-500">成功</Badge>
    if (status === "failed") return <Badge className="bg-red-500">失败</Badge>
    if (status === "processing") return <Badge className="bg-blue-500">处理中</Badge>
    return <Badge className="bg-gray-500">未知</Badge>
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
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
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
            <CardTitle>任务执行日志</CardTitle>
            <CardDescription>详细记录任务执行过程和结果</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "导出中..." : "导出CSV"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索任务ID、类型或消息..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-gray-500">没有找到匹配的日志记录</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>消息</TableHead>
                    <TableHead>执行时间</TableHead>
                    <TableHead>耗时</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.taskType}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{log.message}</TableCell>
                      <TableCell>{formatTime(log.executedAt)}</TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
