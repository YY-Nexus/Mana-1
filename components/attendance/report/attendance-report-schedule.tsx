"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Clock, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// 模拟已有的定时发送任务
const scheduleData = [
  {
    id: "1",
    name: "每周考勤报表",
    recipients: "hr@example.com, manager@example.com",
    frequency: "weekly",
    day: "1", // 周一
    time: "09:00",
    format: "excel",
    lastSent: "2023-04-15 09:00",
    nextSend: "2023-04-22 09:00",
    status: "active",
  },
  {
    id: "2",
    name: "月度考勤汇总",
    recipients: "director@example.com, hr@example.com",
    frequency: "monthly",
    day: "1", // 每月1日
    time: "10:00",
    format: "pdf",
    lastSent: "2023-04-01 10:00",
    nextSend: "2023-05-01 10:00",
    status: "active",
  },
  {
    id: "3",
    name: "部门考勤分析",
    recipients: "department-heads@example.com",
    frequency: "monthly",
    day: "15", // 每月15日
    time: "14:00",
    format: "excel",
    lastSent: "2023-04-15 14:00",
    nextSend: "2023-05-15 14:00",
    status: "paused",
  },
]

export default function AttendanceReportSchedule() {
  const [schedules, setSchedules] = useState(scheduleData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)

  const [newSchedule, setNewSchedule] = useState({
    name: "",
    recipients: "",
    frequency: "weekly",
    day: "1",
    time: "09:00",
    format: "excel",
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
  })

  const handleCreateSchedule = () => {
    // 验证表单
    if (!newSchedule.name || !newSchedule.recipients) {
      toast({
        title: "表单不完整",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    // 创建新的定时任务
    const now = new Date()
    const nextSendDate = new Date()

    if (newSchedule.frequency === "weekly") {
      // 设置为下一个指定的星期几
      const dayDiff = Number.parseInt(newSchedule.day) - now.getDay()
      nextSendDate.setDate(now.getDate() + (dayDiff < 0 ? dayDiff + 7 : dayDiff))
    } else if (newSchedule.frequency === "monthly") {
      // 设置为下一个指定的日期
      const day = Number.parseInt(newSchedule.day)
      nextSendDate.setDate(day)
      if (nextSendDate < now) {
        nextSendDate.setMonth(nextSendDate.getMonth() + 1)
      }
    }

    // 设置时间
    const [hours, minutes] = newSchedule.time.split(":").map(Number)
    nextSendDate.setHours(hours, minutes, 0, 0)

    const newTask = {
      id: `${schedules.length + 1}`,
      name: newSchedule.name,
      recipients: newSchedule.recipients,
      frequency: newSchedule.frequency,
      day: newSchedule.day,
      time: newSchedule.time,
      format: newSchedule.format,
      lastSent: "-",
      nextSend: format(nextSendDate, "yyyy-MM-dd HH:mm"),
      status: "active",
    }

    setSchedules([...schedules, newTask])
    setIsCreateDialogOpen(false)

    // 重置表单
    setNewSchedule({
      name: "",
      recipients: "",
      frequency: "weekly",
      day: "1",
      time: "09:00",
      format: "excel",
      includeCharts: true,
      includeSummary: true,
      includeDetails: true,
    })

    toast({
      title: "创建成功",
      description: "定时发送任务已创建",
    })
  }

  const handleDeleteSchedule = () => {
    if (scheduleToDelete) {
      setSchedules(schedules.filter((s) => s.id !== scheduleToDelete))
      setScheduleToDelete(null)
      setIsDeleteDialogOpen(false)

      toast({
        title: "删除成功",
        description: "定时发送任务已删除",
      })
    }
  }

  const handleToggleStatus = (id: string) => {
    setSchedules(
      schedules.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === "active" ? "paused" : "active",
          }
        }
        return s
      }),
    )

    toast({
      title: "状态已更新",
      description: `任务已${schedules.find((s) => s.id === id)?.status === "active" ? "暂停" : "激活"}`,
    })
  }

  const getFrequencyText = (frequency: string, day: string) => {
    if (frequency === "weekly") {
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
      return `每${weekdays[Number.parseInt(day)]}`
    } else if (frequency === "monthly") {
      return `每月${day}日`
    }
    return frequency
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>定时发送设置</CardTitle>
              <CardDescription>设置考勤报表的定时发送任务</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  新建任务
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>创建定时发送任务</DialogTitle>
                  <DialogDescription>设置报表自动发送的时间、频率和接收人</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      任务名称
                    </Label>
                    <Input
                      id="name"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                      className="col-span-3"
                      placeholder="例如：每周考勤报表"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recipients" className="text-right">
                      接收人
                    </Label>
                    <Input
                      id="recipients"
                      value={newSchedule.recipients}
                      onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                      className="col-span-3"
                      placeholder="多个邮箱用逗号分隔"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">发送频率</Label>
                    <div className="col-span-3">
                      <RadioGroup
                        value={newSchedule.frequency}
                        onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">每周</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">每月</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{newSchedule.frequency === "weekly" ? "星期几" : "日期"}</Label>
                    <Select
                      value={newSchedule.day}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {newSchedule.frequency === "weekly" ? (
                          <>
                            <SelectItem value="1">周一</SelectItem>
                            <SelectItem value="2">周二</SelectItem>
                            <SelectItem value="3">周三</SelectItem>
                            <SelectItem value="4">周四</SelectItem>
                            <SelectItem value="5">周五</SelectItem>
                            <SelectItem value="6">周六</SelectItem>
                            <SelectItem value="0">周日</SelectItem>
                          </>
                        ) : (
                          Array.from({ length: 31 }, (_, i) => (
                            <SelectItem key={i} value={`${i + 1}`}>
                              {i + 1}日
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      时间
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      className="w-[180px]"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">导出格式</Label>
                    <RadioGroup
                      value={newSchedule.format}
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, format: value })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excel" id="format-excel" />
                        <Label htmlFor="format-excel">Excel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="format-pdf" />
                        <Label htmlFor="format-pdf">PDF</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">内容选项</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-summary"
                          checked={newSchedule.includeSummary}
                          onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, includeSummary: !!checked })}
                        />
                        <Label htmlFor="include-summary">包含汇总信息</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-details"
                          checked={newSchedule.includeDetails}
                          onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, includeDetails: !!checked })}
                        />
                        <Label htmlFor="include-details">包含详细记录</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-charts"
                          checked={newSchedule.includeCharts}
                          onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, includeCharts: !!checked })}
                        />
                        <Label htmlFor="include-charts">包含图表</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateSchedule}>创建</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务名称</TableHead>
                <TableHead>接收人</TableHead>
                <TableHead>发送频率</TableHead>
                <TableHead>格式</TableHead>
                <TableHead>上次发送</TableHead>
                <TableHead>下次发送</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    暂无定时发送任务
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell>{schedule.recipients}</TableCell>
                    <TableCell>
                      {getFrequencyText(schedule.frequency, schedule.day)} {schedule.time}
                    </TableCell>
                    <TableCell className="uppercase">{schedule.format}</TableCell>
                    <TableCell>{schedule.lastSent}</TableCell>
                    <TableCell>{schedule.nextSend}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={schedule.status === "active"}
                          onCheckedChange={() => handleToggleStatus(schedule.id)}
                        />
                        <span className={schedule.status === "active" ? "text-green-600" : "text-gray-500"}>
                          {schedule.status === "active" ? "已启用" : "已暂停"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog
                        open={isDeleteDialogOpen && scheduleToDelete === schedule.id}
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open)
                          if (!open) setScheduleToDelete(null)
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setScheduleToDelete(schedule.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">删除</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              您确定要删除"{schedule.name}"这个定时发送任务吗？此操作无法撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteSchedule} className="bg-red-600 hover:bg-red-700">
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              <Clock className="inline-block h-4 w-4 mr-1" />
              系统将在设定的时间自动发送报表到指定邮箱
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              刷新状态
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>发送历史记录</CardTitle>
          <CardDescription>查看报表发送历史和状态</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务名称</TableHead>
                <TableHead>发送时间</TableHead>
                <TableHead>接收人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">每周考勤报表</TableCell>
                <TableCell>2023-04-15 09:00:12</TableCell>
                <TableCell>hr@example.com, manager@example.com</TableCell>
                <TableCell className="text-green-600">成功</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">月度考勤汇总</TableCell>
                <TableCell>2023-04-01 10:00:05</TableCell>
                <TableCell>director@example.com, hr@example.com</TableCell>
                <TableCell className="text-green-600">成功</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">部门考勤分析</TableCell>
                <TableCell>2023-03-15 14:00:33</TableCell>
                <TableCell>department-heads@example.com</TableCell>
                <TableCell className="text-red-600">失败</TableCell>
                <TableCell>邮箱地址无效</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
