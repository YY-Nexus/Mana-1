"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

// 模拟数据
const MOCK_DATA = {
  taskTypes: [
    { name: "数据同步", value: 35 },
    { name: "报表生成", value: 25 },
    { name: "邮件发送", value: 20 },
    { name: "数据备份", value: 15 },
    { name: "系统清理", value: 5 },
  ],
  taskStatus: [
    { name: "成功", value: 75 },
    { name: "失败", value: 15 },
    { name: "处理中", value: 10 },
  ],
  timeDistribution: [
    { name: "00:00", count: 5 },
    { name: "03:00", count: 3 },
    { name: "06:00", count: 8 },
    { name: "09:00", count: 15 },
    { name: "12:00", count: 12 },
    { name: "15:00", count: 18 },
    { name: "18:00", count: 10 },
    { name: "21:00", count: 7 },
  ],
  processingTime: [
    { name: "<1秒", count: 45 },
    { name: "1-5秒", count: 30 },
    { name: "5-10秒", count: 15 },
    { name: ">10秒", count: 10 },
  ],
}

// 颜色配置
const COLORS = {
  taskTypes: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
  taskStatus: ["#00C49F", "#FF8042", "#0088FE"],
  timeDistribution: "#0088FE",
  processingTime: "#00C49F",
}

export function TaskAnalysis() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("today")
  const [data, setData] = useState(MOCK_DATA)

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 模拟时间范围变化
  useEffect(() => {
    setIsLoading(true)

    // 模拟不同时间范围的数据
    const timer = setTimeout(() => {
      // 这里只是简单地修改数据值，实际应用中会从API获取不同时间范围的数据
      const multiplier = timeRange === "today" ? 1 : timeRange === "week" ? 5 : 20

      setData({
        ...MOCK_DATA,
        taskTypes: MOCK_DATA.taskTypes.map((item) => ({
          ...item,
          value: Math.floor(item.value * multiplier * (0.8 + Math.random() * 0.4)),
        })),
        timeDistribution: MOCK_DATA.timeDistribution.map((item) => ({
          ...item,
          count: Math.floor(item.count * multiplier * (0.8 + Math.random() * 0.4)),
        })),
      })

      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [timeRange])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>任务分析</CardTitle>
            <CardDescription>任务处理的多维度分析</CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">今日</TabsTrigger>
              <TabsTrigger value="week">本周</TabsTrigger>
              <TabsTrigger value="month">本月</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 任务类型分布 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">任务类型分布</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.taskTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.taskTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.taskTypes[index % COLORS.taskTypes.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 个任务`, "数量"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 任务状态分布 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">任务状态分布</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.taskStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.taskStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.taskStatus[index % COLORS.taskStatus.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 个任务`, "数量"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 时间分布 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">时间分布</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.timeDistribution}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 个任务`, "数量"]} />
                  <Bar dataKey="count" fill={COLORS.timeDistribution} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 处理时间分布 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">处理时间分布</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.processingTime}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 个任务`, "数量"]} />
                  <Bar dataKey="count" fill={COLORS.processingTime} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
