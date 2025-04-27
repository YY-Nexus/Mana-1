"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, Clock, CheckCircle2, CircleXIcon as XCircle2 } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { getEmailLogs } from "@/lib/db/email-logs"
import { useToast } from "@/components/ui/use-toast"

export function TaskHistory() {
  const { toast } = useToast()
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      const logsData = await getEmailLogs(100, 0)
      setLogs(logsData)
    } catch (error) {
      console.error("加载任务历史失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载任务历史记录，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
    // 每60秒刷新一次数据
    const interval = setInterval(loadLogs, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter(
    (log) =>
      log.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.recipients && log.recipients.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>任务执行历史</CardTitle>
          <CardDescription>查看任务的执行记录和状态</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={loadLogs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索任务名称或接收人..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">暂无执行记录</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm ? "没有找到匹配的执行记录" : "还没有任务执行记录"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务名称</TableHead>
                  <TableHead>执行时间</TableHead>
                  <TableHead>接收人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>错误信息</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.taskName}</TableCell>
                    <TableCell>
                      {formatDate(log.sentAt)} {formatTime(log.sentAt)}
                    </TableCell>
                    <TableCell>{Array.isArray(log.recipients) ? log.recipients.join(", ") : log.recipients}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          log.status === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {log.status === "success" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {log.status === "success" ? "成功" : "失败"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.errorMessage || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
