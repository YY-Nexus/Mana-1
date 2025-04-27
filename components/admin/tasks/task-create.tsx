"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createScheduledTask } from "@/lib/db/scheduled-tasks"
import { calculateNextRun } from "@/lib/scheduler"
import { RefreshCw } from "lucide-react"

export function TaskCreate({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "attendance_report",
    frequency: "weekly",
    day: "1", // 默认周一
    time: "09:00",
    recipients: "",
    format: "excel",
    options: {
      includeCharts: true,
      includeSummary: true,
      includeDetails: true,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "任务名称不能为空"
    }

    if (!formData.recipients.trim()) {
      newErrors.recipients = "接收人不能为空"
    } else {
      const emails = formData.recipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = emails.filter((email) => !emailRegex.test(email))

      if (invalidEmails.length > 0) {
        newErrors.recipients = `以下邮箱格式不正确: ${invalidEmails.join(", ")}`
      }
    }

    if (!formData.time) {
      newErrors.time = "请选择执行时间"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // 计算下次执行时间
      const nextRun = calculateNextRun(formData.frequency, formData.day, formData.time)

      // 准备任务数据
      const taskData = {
        name: formData.name,
        type: formData.type,
        frequency: formData.frequency,
        day: formData.day,
        time: formData.time,
        recipients: formData.recipients
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
        format: formData.format,
        options: formData.options,
        nextRun,
        status: "active",
      }

      // 创建任务
      await createScheduledTask(taskData)

      // 重置表单
      setFormData({
        name: "",
        type: "attendance_report",
        frequency: "weekly",
        day: "1",
        time: "09:00",
        recipients: "",
        format: "excel",
        options: {
          includeCharts: true,
          includeSummary: true,
          includeDetails: true,
        },
      })

      // 通知父组件
      if (onTaskCreated) onTaskCreated()
    } catch (error) {
      console.error("创建任务失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>创建定时任务</CardTitle>
        <CardDescription>设置新的定时任务，自动执行系统操作</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">任务名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="例如：每周考勤报表"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">任务类型</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance_report">考勤报表</SelectItem>
              <SelectItem value="data_backup">数据备份</SelectItem>
              <SelectItem value="system_cleanup">系统清理</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipients">接收人</Label>
          <Input
            id="recipients"
            value={formData.recipients}
            onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
            placeholder="多个邮箱用逗号分隔"
            className={errors.recipients ? "border-red-500" : ""}
          />
          {errors.recipients && <p className="text-sm text-red-500">{errors.recipients}</p>}
          <p className="text-sm text-muted-foreground">例如: hr@example.com, manager@example.com</p>
        </div>

        <div className="space-y-2">
          <Label>执行频率</Label>
          <RadioGroup
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            className="flex gap-4"
          >
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
          </RadioGroup>
        </div>

        {formData.frequency === "weekly" && (
          <div className="space-y-2">
            <Label>星期几</Label>
            <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">周一</SelectItem>
                <SelectItem value="2">周二</SelectItem>
                <SelectItem value="3">周三</SelectItem>
                <SelectItem value="4">周四</SelectItem>
                <SelectItem value="5">周五</SelectItem>
                <SelectItem value="6">周六</SelectItem>
                <SelectItem value="0">周日</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.frequency === "monthly" && (
          <div className="space-y-2">
            <Label>日期</Label>
            <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => (
                  <SelectItem key={i} value={`${i + 1}`}>
                    {i + 1}日
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="time">时间</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className={errors.time ? "border-red-500 w-[180px]" : "w-[180px]"}
          />
          {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
        </div>

        <div className="space-y-2">
          <Label>导出格式</Label>
          <RadioGroup
            value={formData.format}
            onValueChange={(value) => setFormData({ ...formData, format: value })}
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

        <div className="space-y-2">
          <Label>内容选项</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-summary"
                checked={formData.options.includeSummary}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options: { ...formData.options, includeSummary: !!checked },
                  })
                }
              />
              <Label htmlFor="include-summary">包含汇总信息</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-details"
                checked={formData.options.includeDetails}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options: { ...formData.options, includeDetails: !!checked },
                  })
                }
              />
              <Label htmlFor="include-details">包含详细记录</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-charts"
                checked={formData.options.includeCharts}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options: { ...formData.options, includeCharts: !!checked },
                  })
                }
              />
              <Label htmlFor="include-charts">包含图表</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              创建中...
            </>
          ) : (
            "创建任务"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
