"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, FileText, Clock, HelpCircle, Receipt, Award } from "lucide-react"

// 快速操作类型
interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

// 组件属性
interface EmployeeQuickActionsProps {
  actions?: QuickAction[]
  isLoading?: boolean
}

/**
 * 员工快速操作组件
 * 提供常用操作的快捷入口
 */
export function EmployeeQuickActions({ actions, isLoading = false }: EmployeeQuickActionsProps) {
  // 默认快速操作
  const defaultActions: QuickAction[] = [
    {
      id: "leave-request",
      label: "申请休假",
      icon: <CalendarClock className="h-4 w-4 mr-2" />,
      onClick: () => console.log("申请休假"),
    },
    {
      id: "expense-claim",
      label: "报销申请",
      icon: <Receipt className="h-4 w-4 mr-2" />,
      onClick: () => console.log("报销申请"),
    },
    {
      id: "attendance-record",
      label: "查看考勤",
      icon: <Clock className="h-4 w-4 mr-2" />,
      onClick: () => console.log("查看考勤"),
    },
    {
      id: "salary-slip",
      label: "查看工资单",
      icon: <FileText className="h-4 w-4 mr-2" />,
      onClick: () => console.log("查看工资单"),
    },
    {
      id: "performance",
      label: "绩效评估",
      icon: <Award className="h-4 w-4 mr-2" />,
      onClick: () => console.log("绩效评估"),
    },
    {
      id: "help-desk",
      label: "帮助中心",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      onClick: () => console.log("帮助中心"),
    },
  ]

  // 使用提供的操作或默认操作
  const quickActions = actions || defaultActions

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>快速操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button key={action.id} variant="outline" className="justify-start" onClick={action.onClick}>
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
