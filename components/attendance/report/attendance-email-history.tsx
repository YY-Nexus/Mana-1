"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Inbox, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getEmailLogs } from "@/lib/email-service"
import { formatDate, formatTime } from "@/lib/utils"

export function AttendanceEmailHistory() {
  const [isLoading, setIsLoading] = useState(true)
  const [emailLogs, setEmailLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const loadEmailLogs = async () => {
    setIsLoading(true)
    try {
      // 在实际应用中，这里应该调用API获取邮件日志
      // 这里使用模拟数据
      const logs = getEmailLogs(20)
      setEmailLogs(logs)
    } catch (error) {
      console.error("获取邮件日志失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmailLogs()
  }, [])

  const filteredLogs = emailLogs.filter(
    (log) =>
      log.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipients.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>邮件发送历史</CardTitle>
            <CardDescription>查看考勤报表邮件发送记录</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadEmailLogs} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="sr-only">刷新</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索任务名称、收件人或主题..."
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
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">暂无邮件记录</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? "没有找到匹配的邮件记录" : "还没有发送过考勤报表邮件"}
              </p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务名称</TableHead>
                    <TableHead>收件人</TableHead>
                    <TableHead>发送时间</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.taskName}</TableCell>
                      <TableCell>
                        {Array.isArray(log.recipients) ? log.recipients.join(", ") : log.recipients}
                      </TableCell>
                      <TableCell>
                        {formatDate(log.sentAt)} {formatTime(log.sentAt)}
                      </TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            成功
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            失败
                          </Badge>
                        )}
                      </TableCell>
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
