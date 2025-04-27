"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApprovalTrend } from "@/lib/salary-report-service"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ApprovalTrendChartsProps {
  data: ApprovalTrend
  loading: boolean
}

export function ApprovalTrendCharts({ data, loading }: ApprovalTrendChartsProps) {
  // 检查是否有数据
  const hasData = data.byMonth.length > 0 && data.byMonth.some((item) => item.count > 0)

  // 格式化月份标签
  const formattedData = data.byMonth.map((item) => ({
    ...item,
    // 将 YYYY-MM 格式转换为 YYYY年MM月
    formattedMonth: item.month.replace(/(\d{4})-(\d{2})/, "$1年$2月"),
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>审批数量趋势</CardTitle>
          <CardDescription>按月份统计的审批数量变化</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无审批数量趋势数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedMonth" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}`, "审批数量"]}
                    labelFormatter={(label) => `月份: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="审批数量"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>处理时间趋势</CardTitle>
          <CardDescription>按月份统计的平均处理时间变化（小时）</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无处理时间趋势数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedMonth" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(1)} 小时`, "平均处理时间"]}
                    labelFormatter={(label) => `月份: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#82ca9d"
                    name="平均处理时间"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
