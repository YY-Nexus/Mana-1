"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApprovalEfficiency } from "@/lib/salary-report-service"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface ApprovalTimeDistributionProps {
  data: ApprovalEfficiency
  loading: boolean
}

export function ApprovalTimeDistribution({ data, loading }: ApprovalTimeDistributionProps) {
  // 模拟处理时间分布数据
  const timeDistributionData = [
    { name: "0-4小时", count: Math.floor(data.totalApprovals * 0.15) },
    { name: "4-8小时", count: Math.floor(data.totalApprovals * 0.25) },
    { name: "8-24小时", count: Math.floor(data.totalApprovals * 0.3) },
    { name: "1-3天", count: Math.floor(data.totalApprovals * 0.2) },
    { name: "3天以上", count: Math.floor(data.totalApprovals * 0.1) },
  ]

  // 模拟审批效率趋势数据
  const efficiencyTrendData = [
    { month: "2023-01", avgTime: 18.5, approvalRate: 85 },
    { month: "2023-02", avgTime: 17.2, approvalRate: 86 },
    { month: "2023-03", avgTime: 16.8, approvalRate: 87 },
    { month: "2023-04", avgTime: 15.5, approvalRate: 88 },
    { month: "2023-05", avgTime: 14.2, approvalRate: 89 },
    { month: "2023-06", avgTime: 12.8, approvalRate: 90 },
  ].map((item) => ({
    ...item,
    formattedMonth: item.month.replace(/(\d{4})-(\d{2})/, "$1年$2月"),
  }))

  // 检查是否有数据
  const hasData = data.totalApprovals > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>审批时间分布</CardTitle>
          <CardDescription>审批处理时间的分布情况</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无审批时间分布数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistributionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 条`, "数量"]} />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="审批数量" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>审批效率趋势</CardTitle>
          <CardDescription>平均处理时间与通过率的关系</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedMonth" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "平均处理时间") return [`${value} 小时`, name]
                    if (name === "通过率") return [`${value}%`, name]
                    return [value, name]
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgTime"
                  stroke="#8884d8"
                  name="平均处理时间"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="approvalRate"
                  stroke="#82ca9d"
                  name="通过率"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
