"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, RefreshCw, Send } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportExportDialog({ open, onOpenChange }: ReportExportDialogProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("download")
  const [isLoading, setIsLoading] = useState(false)

  // 下载选项
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("excel")
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [includeCharts, setIncludeCharts] = useState(true)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [department, setDepartment] = useState("")

  // 邮件选项
  const [recipients, setRecipients] = useState("")
  const [subject, setSubject] = useState("考勤报表")
  const [emailFormat, setEmailFormat] = useState<"pdf" | "excel">("excel")

  // 定时选项
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly")
  const [weekDay, setWeekDay] = useState("monday")
  const [monthDay, setMonthDay] = useState("1")
  const [scheduleTime, setScheduleTime] = useState("08:00")

  // 处理下载报表
  const handleDownload = async () => {
    setIsLoading(true)

    try {
      // 构建请求参数
      const params = {
        format: exportFormat,
        dateRange:
          dateRange.from && dateRange.to
            ? {
                from: dateRange.from,
                to: dateRange.to,
              }
            : undefined,
        department: department || undefined,
        includeSummary,
        includeDetails,
        includeCharts,
      }

      // 发起请求
      const response = await fetch("/api/attendance/export-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "导出报表失败")
      }

      // 获取文件名
      const contentDisposition = response.headers.get("Content-Disposition")
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `考勤报表.${exportFormat === "pdf" ? "pdf" : "xlsx"}`

      // 下载文件
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "导出成功",
        description: `报表已成功导出为${exportFormat === "pdf" ? "PDF" : "Excel"}格式`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("导出报表失败:", error)
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "导出报表时发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 处理发送报表
  const handleSendNow = async () => {
    if (!recipients) {
      toast({
        title: "请输入收件人",
        description: "请输入至少一个收件人邮箱地址",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 构建请求参数
      const params = {
        recipients: recipients.split(",").map((email) => email.trim()),
        subject,
        reportType: "考勤报表",
        exportOptions: {
          format: emailFormat,
          dateRange:
            dateRange.from && dateRange.to
              ? {
                  from: dateRange.from,
                  to: dateRange.to,
                }
              : undefined,
          department: department || undefined,
          includeSummary,
          includeDetails,
          includeCharts,
        },
      }

      // 发起请求
      const response = await fetch("/api/attendance/send-report-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "发送报表失败")
      }

      toast({
        title: "发送成功",
        description: data.message || "报表已成功发送",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("发送报表失败:", error)
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "发送报表时发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 处理定时发送
  const handleSchedule = async () => {
    if (!recipients) {
      toast({
        title: "请输入收件人",
        description: "请输入至少一个收件人邮箱地址",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 构建请求参数
      const params = {
        recipients: recipients.split(",").map((email) => email.trim()),
        subject,
        reportType: "考勤报表",
        exportOptions: {
          format: emailFormat,
          includeSummary,
          includeDetails,
          includeCharts,
        },
        scheduleOptions: {
          frequency,
          day: frequency === "weekly" ? weekDay : frequency === "monthly" ? monthDay : undefined,
          time: scheduleTime,
        },
      }

      // 发起请求
      const response = await fetch("/api/attendance/schedule-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "创建定时任务失败")
      }

      toast({
        title: "创建成功",
        description: data.message || "定时发送任务已创建",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("创建定时任务失败:", error)
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "创建定时任务时发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>导出考勤报表</DialogTitle>
          <DialogDescription>导出、发送或定时发送考勤报表</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="download">下载报表</TabsTrigger>
            <TabsTrigger value="email">发送邮件</TabsTrigger>
            <TabsTrigger value="schedule">定时发送</TabsTrigger>
          </TabsList>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>报表范围</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && !dateRange.to && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "yyyy-MM-dd", { locale: zhCN })} -{" "}
                              {format(dateRange.to, "yyyy-MM-dd", { locale: zhCN })}
                            </>
                          ) : (
                            format(dateRange.from, "yyyy-MM-dd", { locale: zhCN })
                          )
                        ) : (
                          "选择日期范围"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={zhCN}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1">
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部部门</SelectItem>
                      <SelectItem value="tech">技术部</SelectItem>
                      <SelectItem value="hr">人力资源部</SelectItem>
                      <SelectItem value="finance">财务部</SelectItem>
                      <SelectItem value="marketing">市场部</SelectItem>
                      <SelectItem value="operations">运营部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>报表内容</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSummary"
                    checked={includeSummary}
                    onCheckedChange={(checked) => setIncludeSummary(checked as boolean)}
                  />
                  <label
                    htmlFor="includeSummary"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    包含摘要信息
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDetails"
                    checked={includeDetails}
                    onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
                  />
                  <label
                    htmlFor="includeDetails"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    包含详细记录
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                  />
                  <label
                    htmlFor="includeCharts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    包含图表
                  </label>
                </div>
              </div>
            </div>
          </div>

          <TabsContent value="download" className="space-y-4">
            <div className="space-y-2">
              <Label>导出格式</Label>
              <RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as "pdf" | "excel")}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel" id="excel" />
                    <Label htmlFor="excel">Excel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf">PDF</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">收件人</Label>
              <Input
                id="recipients"
                placeholder="输入收件人邮箱，多个收件人用逗号分隔"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">邮件主题</Label>
              <Input
                id="subject"
                placeholder="输入邮件主题"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>附件格式</Label>
              <RadioGroup value={emailFormat} onValueChange={(value) => setEmailFormat(value as "pdf" | "excel")}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel" id="email-excel" />
                    <Label htmlFor="email-excel">Excel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="email-pdf" />
                    <Label htmlFor="email-pdf">PDF</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-recipients">收件人</Label>
              <Input
                id="schedule-recipients"
                placeholder="输入收件人邮箱，多个收件人用逗号分隔"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-subject">邮件主题</Label>
              <Input
                id="schedule-subject"
                placeholder="输入邮件主题"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>发送频率</Label>
              <RadioGroup
                value={frequency}
                onValueChange={(value) => setFrequency(value as "daily" | "weekly" | "monthly")}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">每天</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">每周</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">每月</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="weekDay">星期几</Label>
                <Select value={weekDay} onValueChange={setWeekDay}>
                  <SelectTrigger id="weekDay">
                    <SelectValue placeholder="选择星期几" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">星期一</SelectItem>
                    <SelectItem value="tuesday">星期二</SelectItem>
                    <SelectItem value="wednesday">星期三</SelectItem>
                    <SelectItem value="thursday">星期四</SelectItem>
                    <SelectItem value="friday">星期五</SelectItem>
                    <SelectItem value="saturday">星期六</SelectItem>
                    <SelectItem value="sunday">星期日</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="monthDay">每月几号</Label>
                <Select value={monthDay} onValueChange={setMonthDay}>
                  <SelectTrigger id="monthDay">
                    <SelectValue placeholder="选择每月几号" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}号
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="scheduleTime">发送时间</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            取消
          </Button>

          {activeTab === "download" && (
            <Button onClick={handleDownload} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  下载报表
                </>
              )}
            </Button>
          )}

          {activeTab === "email" && (
            <Button onClick={handleSendNow} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  立即发送
                </>
              )}
            </Button>
          )}

          {activeTab === "schedule" && (
            <Button onClick={handleSchedule} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  创建定时任务
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
