"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts"
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
    { name: "00:00-04:00", value: 10 },
    { name: "04:00-08:00", value: 15 },
    { name: "08:00-12:00", value: 30 },
    { name: "12:00-16:00", value: 25 },
    { name: "16:00-20:00", value: 15 },
    { name: "20:00-24:00", value: 5 },
  ],
}

// 颜色配置
const COLORS = {
  taskTypes: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
  taskStatus: ["#4CAF50", "#F44336", "#2196F3"],
  timeDistribution: ["#8884D8", "#83A6ED", "#8DD1E1", "#82CA9D", "#A4DE6C", "#D0ED57"],
}

export function TaskDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(MOCK_DATA)
  const [activeTab, setActiveTab] = useState("taskTypes")

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setData(MOCK_DATA)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  // 渲染饼图
  const renderPieChart = (data, colors) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // 渲染柱状图
  const renderBarChart = (data, colors) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="value" name="数量">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>任务统计仪表盘</CardTitle>
        <CardDescription>查看任务类型、状态和时间分布的统计数据</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="taskTypes" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="taskTypes">任务类型</TabsTrigger>
            <TabsTrigger value="taskStatus">任务状态</TabsTrigger>
            <TabsTrigger value="timeDistribution">时间分布</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="mt-6 space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <div className="flex justify-center space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="taskTypes" className="mt-4">
                <h3 className="text-lg font-medium mb-2">任务类型分布</h3>
                {renderPieChart(data.taskTypes, COLORS.taskTypes)}
              </TabsContent>

              <TabsContent value="taskStatus" className="mt-4">
                <h3 className="text-lg font-medium mb-2">任务状态分布</h3>
                {renderPieChart(data.taskStatus, COLORS.taskStatus)}
              </TabsContent>

              <TabsContent value="timeDistribution" className="mt-4">
                <h3 className="text-lg font-medium mb-2">任务时间分布</h3>
                {renderBarChart(data.timeDistribution, COLORS.timeDistribution)}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
