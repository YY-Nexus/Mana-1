"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileSpreadsheet, FileIcon as FilePdf, Send, Settings, Clock, Mail } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { exportAttendanceReport } from "@/lib/attendance"

interface AttendanceReportPermissions {
  canExport: boolean
  canSchedule: boolean
  canManageSchedule: boolean
  canManageFields: boolean
}

export function AttendanceReportHeader({ permissions }: { permissions: AttendanceReportPermissions }) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel")
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
  })
  const [isExporting, setIsExporting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState("")
  const [emailSubject, setEmailSubject] = useState("考勤报表")

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportAttendanceReport({
        format: exportFormat,
        options: exportOptions,
      })

      toast({
        title: "导出成功",
        description: `考勤报表已成功导出为${exportFormat === "excel" ? "Excel" : "PDF"}格式`,
      })
      setIsExportDialogOpen(false)
    } catch (error) {
      console.error("导出报表失败:", error)
      toast({
        title: "导出失败",
        description: "导出考勤报表时发生错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailRecipients.trim()) {
      toast({
        title: "收件人不能为空",
        description: "请输入至少一个收件人邮箱地址",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      // 解析收件人列表
      const recipients = emailRecipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)

      // 调用API发送邮件
      const response = await fetch("/api/attendance/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject: emailSubject,
          reportDate: new Date(),
          reportType: "考勤报表",
          format: exportFormat,
          options: exportOptions,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "发送成功",
          description: `考勤报表已成功发送至${recipients.length}个收件人`,
        })
        setIsSendDialogOpen(false)
      } else {
        throw new Error(result.message || "发送邮件失败")
      }
    } catch (error) {
      console.error("发送报表邮件失败:", error)
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "发送考勤报表邮件时发生错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">考勤报表</h1>
        <p className="text-muted-foreground">查看、分析和导出员工考勤数据</p>
      </div>
      <div className="flex items-center gap-2">
        {permissions.canExport && (
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                导出报表
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>导出考勤报表</DialogTitle>
                <DialogDescription>选择导出格式和内容选项</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>导出格式</Label>
                  <RadioGroup
                    value={exportFormat}
                    onValueChange={(value) => setExportFormat(value as "excel" | "pdf")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excel" id="excel" />
                      <Label htmlFor="excel" className="flex items-center gap-1 cursor-pointer">
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        Excel
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex items-center gap-1 cursor-pointer">
                        <FilePdf className="h-4 w-4 text-red-600" />
                        PDF
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>导出内容</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-summary"
                        checked={exportOptions.includeSummary}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeSummary: !!checked })}
                      />
                      <Label htmlFor="include-summary" className="cursor-pointer">
                        包含汇总信息
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-details"
                        checked={exportOptions.includeDetails}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeDetails: !!checked })}
                      />
                      <Label htmlFor="include-details" className="cursor-pointer">
                        包含详细记录
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-charts"
                        checked={exportOptions.includeCharts}
                        onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeCharts: !!checked })}
                      />
                      <Label htmlFor="include-charts" className="cursor-pointer">
                        包含图表
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleExport} disabled={isExporting}>
                  {isExporting ? "导出中..." : "导出"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {permissions.canSchedule && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                更多选项
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Calendar className="h-4 w-4" />
                选择日期范围
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setIsSendDialogOpen(true)}>
                <Mail className="h-4 w-4" />
                立即发送报表
              </DropdownMenuItem>
              {permissions.canManageSchedule && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Clock className="h-4 w-4" />
                    管理定时发送
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* 发送邮件对话框 */}
        <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>发送考勤报表</DialogTitle>
              <DialogDescription>将当前考勤报表通过邮件发送</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">收件人</Label>
                <Input
                  id="recipients"
                  placeholder="输入收件人邮箱，多个邮箱用逗号分隔"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">例如: hr@example.com, manager@example.com</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">邮件主题</Label>
                <Input
                  id="subject"
                  placeholder="输入邮件主题"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>报表格式</Label>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as "excel" | "pdf")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel" id="email-excel" />
                    <Label htmlFor="email-excel" className="flex items-center gap-1 cursor-pointer">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      Excel
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="email-pdf" />
                    <Label htmlFor="email-pdf" className="flex items-center gap-1 cursor-pointer">
                      <FilePdf className="h-4 w-4 text-red-600" />
                      PDF
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>邮件内容选项</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-include-summary"
                      checked={exportOptions.includeSummary}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeSummary: !!checked })}
                    />
                    <Label htmlFor="email-include-summary" className="cursor-pointer">
                      在邮件正文中包含汇总信息
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-include-charts"
                      checked={exportOptions.includeCharts}
                      onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeCharts: !!checked })}
                    />
                    <Label htmlFor="email-include-charts" className="cursor-pointer">
                      在附件中包含图表
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSendEmail} disabled={isSending} className="gap-2">
                {isSending ? (
                  <>
                    <Send className="h-4 w-4 animate-spin" />
                    发送中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    发送
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
