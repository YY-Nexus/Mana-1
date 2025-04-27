"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApprovalTrend } from "@/lib/salary-report-service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ApprovalDepartmentComparisonProps {
  data: ApprovalTrend
  loading: boolean
}

export function ApprovalDepartmentComparison({ data, loading }: ApprovalDepartmentComparisonProps) {
  // 检查是否有数据
  const hasData = data.byDepartment.length > 0 && data.byDepartment.some((item) => item.count > 0)

  // 计算部门通过率
  const departmentApprovalRates = data.byDepartment
    .map((item) => ({
      department: item.department,
      通过率: Number.parseFloat(((item.approved / (item.approved + item.rejected || 1)) * 100).toFixed(1)),
      总数: item.count,
    }))
    .sort((a, b) => b.通过率 - a.通过率) // 按通过率降序排序

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>部门审批数量对比</CardTitle>
          <CardDescription>各部门的审批数量和通过/拒绝情况</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无部门审批数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byDepartment} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "已通过") return [`${value} 条`, name]
                      if (name === "已拒绝") return [`${value} 条`, name]
                      return [value, name]
                    }}
                    labelFormatter={(label) => `部门: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="approved" stackId="a" fill="#10b981" name="已通过" />
                  <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="已拒绝" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>部门审批通过率</CardTitle>
          <CardDescription>各部门的审批通过率对比</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无部门审批通过率数据</AlertDescription>
            </Alert>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentApprovalRates} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "通过率") return [`${value}%`, name]
                      if (name === "总数") return [`${value} 条`, name]
                      return [value, name]
                    }}
                    labelFormatter={(label) => `部门: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="通过率"
                    fill="#8884d8"
                    name="通过率"
                    radius={[4, 4, 0, 0]}
                    // 根据通过率设置不同颜色
                    fill={(entry) => {
                      const rate = entry.通过率
                      if (rate >= 90) return "#10b981" // 高通过率 - 绿色
                      if (rate >= 70) return "#3b82f6" // 中等通过率 - 蓝色
                      return "#ef4444" // 低通过率 - 红色
                    }}
                  />
                  <Bar dataKey="总数" fill="#82ca9d" name="总数" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
