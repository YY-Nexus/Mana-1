"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApprovalTrend } from "@/lib/salary-report-service"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ApprovalStatusDistributionProps {
  data: ApprovalTrend
  loading: boolean
}

export function ApprovalStatusDistribution({ data, loading }: ApprovalStatusDistributionProps) {
  // 状态对应的颜色
  const STATUS_COLORS = {
    已通过: "#10b981", // 绿色
    已拒绝: "#ef4444", // 红色
    审批中: "#3b82f6", // 蓝色
    待审批: "#6b7280", // 灰色
  }

  // 检查是否有数据
  const hasData = data.byStatus.length > 0 && data.byStatus.some((item) => item.count > 0)

  // 计算总数
  const total = data.byStatus.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>审批状态分布</CardTitle>
        <CardDescription>各状态的审批数量占比</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>暂无审批状态分布数据</AlertDescription>
          </Alert>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {data.byStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const percent = (((value as number) / total) * 100).toFixed(1)
                    return [`${value} 条 (${percent}%)`, props.payload.status]
                  }}
                />
                <Legend
                  formatter={(value, entry) => {
                    const { payload } = entry as any
                    const count = payload.count
                    const percent = ((count / total) * 100).toFixed(1)
                    return `${value}: ${count}条 (${percent}%)`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
