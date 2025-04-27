"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApprovalEfficiency } from "@/lib/salary-report-service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ApprovalEfficiencyMetricsProps {
  data: ApprovalEfficiency
  loading: boolean
}

export function ApprovalEfficiencyMetrics({ data, loading }: ApprovalEfficiencyMetricsProps) {
  // 格式化审批人效率数据
  const approverData = data.avgApproverTime
    .sort((a, b) => a.level - b.level) // 按级别排序
    .map((item) => ({
      name: `${item.level}级-${item.approverName}`,
      时间: Number.parseFloat(item.avgTime.toFixed(1)),
    }))

  // 计算审批状态分布
  const statusData = [
    { name: "已通过", value: data.approvedCount },
    { name: "已拒绝", value: data.rejectedCount },
    { name: "审批中", value: data.inProgressCount },
    { name: "待审批", value: data.pendingCount },
  ]

  // 检查是否有数据
  const hasApproverData = approverData.length > 0
  const hasStatusData = statusData.some((item) => item.value > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>审批人处理时间</CardTitle>
          <CardDescription>各级审批人的平均处理时间（小时）</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasApproverData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无审批人处理时间数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={approverData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} 小时`, "平均处理时间"]} />
                  <Legend />
                  <Bar dataKey="时间" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>审批状态分布</CardTitle>
          <CardDescription>各状态的审批数量分布</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasStatusData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无审批状态分布数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 条`, "数量"]} />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    name="数量"
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                    // 根据状态设置不同颜色
                    fill={(entry) => {
                      const { name } = entry.payload
                      if (name === "已通过") return "#10b981"
                      if (name === "已拒绝") return "#ef4444"
                      if (name === "审批中") return "#3b82f6"
                      return "#6b7280"
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
