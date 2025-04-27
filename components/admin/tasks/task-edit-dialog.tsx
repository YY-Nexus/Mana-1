"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { updateScheduledTask } from "@/lib/db/scheduled-tasks"
import { calculateNextRun } from "@/lib/scheduler"
import { RefreshCw } from "lucide-react"

export function TaskEditDialog({ open, onOpenChange, task, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    name: task.name,
    frequency: task.frequency,
    day: task.day,
    time: task.time,
    recipients: Array.isArray(task.recipients) ? task.recipients.join(",") : task.recipients,
    format: task.format,
    options: {
      includeCharts: task.options?.includeCharts ?? true,
      includeSummary: task.options?.includeSummary ?? true,
      includeDetails: task.options?.includeDetails ?? true,
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // 计算下次执行时间
      const nextRun = calculateNextRun(formData.frequency, formData.day, formData.time)

      // 准备更新数据
      const updateData = {
        name: formData.name,
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
      }

      // 更新任务
      await updateScheduledTask(task.id, updateData)

      // 关闭对话框并通知父组件
      onOpenChange(false)
      if (onTaskUpdated) onTaskUpdated()
    } catch (error) {
      console.error("更新任务失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>编辑定时任务</DialogTitle>
          <DialogDescription>修改定时任务的设置和执行计划</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              任务名称
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              className="col-span-3"
              placeholder="多个邮箱用逗号分隔"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">发送频率</Label>
            <div className="col-span-3">
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
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              {formData.frequency === "weekly" ? "星期几" : formData.frequency === "monthly" ? "日期" : "时间"}
            </Label>
            {formData.frequency === "weekly" ? (
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
            ) : formData.frequency === "monthly" ? (
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
            ) : null}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              时间
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-[180px]"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">导出格式</Label>
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

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">内容选项</Label>
            <div className="col-span-3 space-y-2">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "保存更改"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
