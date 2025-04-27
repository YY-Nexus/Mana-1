"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApprovalTrend, ApprovalEfficiency } from "@/lib/salary-report-service"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  LabelList,
} from "recharts"

interface ApprovalApproverPerformanceProps {
  trendData: ApprovalTrend
  efficiencyData: ApprovalEfficiency
  loading: boolean
}

export function ApprovalApproverPerformance({ trendData, efficiencyData, loading }: ApprovalApproverPerformanceProps) {
  // 检查是否有数据
  const hasData = trendData.byApprover.length > 0 && trendData.byApprover.some((item) => item.count > 0)

  // 审批人处理数量
  const approverCountData = trendData.byApprover
    .map((item) => ({
      name: item.approver,
      数量: item.count,
    }))
    .sort((a, b) => b.数量 - a.数量) // 按数量降序排序

  // 审批人效率散点图数据
  const scatterData = trendData.byApprover.map((item) => ({
    x: item.count, // 处理数量
    y: item.avgTime, // 平均处理时间
    z: 10, // 气泡大小
    name: item.approver, // 审批人名称
  }))

  // 审批人效率排名
  const approverRankData = [...trendData.byApprover]
    .sort((a, b) => a.avgTime - b.avgTime)
    .slice(0, 5)
    .map((item) => ({
      name: item.approver,
      时间: Number.parseFloat(item.avgTime.toFixed(1)),
    }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>审批人处理数量</CardTitle>
            <CardDescription>各审批人处理的审批数量</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasData ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>暂无审批人处理数据</AlertDescription>
              </Alert>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={approverCountData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} 条`, "处理数量"]} />
                    <Legend />
                    <Bar dataKey="数量" fill="#8884d8" name="处理数量">
                      <LabelList dataKey="数量" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>审批人效率排名</CardTitle>
            <CardDescription>处理时间最短的前5名审批人（小时）</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasData || approverRankData.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>暂无审批人效率排名数据</AlertDescription>
              </Alert>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={approverRankData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value} 小时`, "平均处理时间"]} />
                    <Legend />
                    <Bar dataKey="时间" fill="#82ca9d" name="平均处理时间">
                      <LabelList dataKey="时间" position="right" formatter={(value) => `${value}小时`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>审批人效率分析</CardTitle>
          <CardDescription>审批数量与处理时间的关系</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>暂无审批人效率分析数据</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="处理数量"
                      unit="条"
                      label={{ value: "处理数量 (条)", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="平均处理时间"
                      unit="小时"
                      label={{ value: "平均处理时间 (小时)", angle: -90, position: "insideLeft" }}
                    />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value, name, props) => {
                        if (name === "x") return [`${value} 条`, "处理数量"]
                        if (name === "y") return [`${value.toFixed(1)} 小时`, "平均处理时间"]
                        return [value, name]
                      }}
                      labelFormatter={(label, props) => `审批人: ${props[0].payload.name}`}
                    />
                    <Legend />
                    <Scatter name="审批人" data={scatterData} fill="#8884d8">
                      {scatterData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.y < 10 ? "#10b981" : entry.y > 20 ? "#ef4444" : "#3b82f6"}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>高效率（&lt;10小时）</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>中等效率（10-20小时）</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span>低效率（&gt;20小时）</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <p>图表说明：</p>
                <ul className="list-disc list-inside mt-1">
                  <li>横轴表示审批人处理的审批数量</li>
                  <li>纵轴表示审批人的平均处理时间</li>
                  <li>右下区域（处理数量多、时间短）表示高效率审批人</li>
                  <li>左上区域（处理数量少、时间长）表示低效率审批人</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
