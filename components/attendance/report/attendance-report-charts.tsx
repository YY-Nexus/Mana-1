"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export function AttendanceReportCharts() {
  const [timeRange, setTimeRange] = useState("month")
  const [department, setDepartment] = useState("all")

  // 考勤状态分布数据
  const statusData = [
    { name: "正常", value: 75, color: "#10b981" },
    { name: "迟到", value: 10, color: "#f59e0b" },
    { name: "早退", value: 5, color: "#3b82f6" },
    { name: "缺勤", value: 3, color: "#ef4444" },
    { name: "加班", value: 7, color: "#8b5cf6" },
  ]

  // 部门考勤率数据
  const departmentData = [
    { name: "技术部", 正常率: 92, 异常率: 8 },
    { name: "人力资源部", 正常率: 88, 异常率: 12 },
    { name: "财务部", 正常率: 95, 异常率: 5 },
    { name: "市场部", 正常率: 85, 异常率: 15 },
    { name: "运营部", 正常率: 90, 异常率: 10 },
  ]

  // 考勤趋势数据
  const trendData = [
    { date: "周一", 正常: 45, 迟到: 3, 早退: 1, 缺勤: 1 },
    { date: "周二", 正常: 48, 迟到: 2, 早退: 0, 缺勤: 0 },
    { date: "周三", 正常: 47, 迟到: 2, 早退: 1, 缺勤: 0 },
    { date: "周四", 正常: 44, 迟到: 4, 早退: 1, 缺勤: 1 },
    { date: "周五", 正常: 42, 迟到: 5, 早退: 2, 缺勤: 1 },
    { date: "周六", 正常: 15, 迟到: 0, 早退: 0, 缺勤: 0 },
    { date: "周日", 正常: 10, 迟到: 0, 早退: 0, 缺勤: 0 },
  ]

  // 工作时长分布数据
  const workHoursData = [
    { name: "<6小时", value: 5, color: "#ef4444" },
    { name: "6-7小时", value: 10, color: "#f59e0b" },
    { name: "7-8小时", value: 25, color: "#3b82f6" },
    { name: "8-9小时", value: 40, color: "#10b981" },
    { name: ">9小时", value: 20, color: "#8b5cf6" },
  ]

  // 月度考勤趋势
  const monthlyTrendData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    return {
      date: `${day}日`,
      出勤率: 85 + Math.floor(Math.random() * 15),
      准时率: 80 + Math.floor(Math.random() * 15),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="tech">技术部</SelectItem>
              <SelectItem value="hr">人力资源部</SelectItem>
              <SelectItem value="finance">财务部</SelectItem>
              <SelectItem value="marketing">市场部</SelectItem>
              <SelectItem value="operations">运营部</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          数据更新时间:{" "}
          {new Date().toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>考勤状态分布</CardTitle>
            <CardDescription>各类考勤状态的占比情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}人`, "数量"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>部门考勤率对比</CardTitle>
            <CardDescription>各部门考勤正常率与异常率</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  <Legend />
                  <Bar dataKey="正常率" stackId="a" fill="#10b981" />
                  <Bar dataKey="异常率" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>考勤趋势分析</CardTitle>
            <CardDescription>
              {timeRange === "week"
                ? "本周"
                : timeRange === "month"
                  ? "本月"
                  : timeRange === "quarter"
                    ? "本季度"
                    : "本年度"}
              考勤数据趋势
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="space-y-4">
              <TabsList>
                <TabsTrigger value="daily">每日考勤</TabsTrigger>
                <TabsTrigger value="rate">出勤率趋势</TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="正常" stackId="a" fill="#10b981" />
                      <Bar dataKey="迟到" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="早退" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="缺勤" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="rate">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="出勤率" stroke="#10b981" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="准时率" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>工作时长分布</CardTitle>
            <CardDescription>员工日均工作时长分布情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workHoursData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {workHoursData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "占比"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
