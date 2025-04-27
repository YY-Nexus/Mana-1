"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

// 模拟数据
const MOCK_PRIORITY_DATA = [
  { name: "高优先级", value: 15, color: "#ef4444" },
  { name: "中优先级", value: 30, color: "#f59e0b" },
  { name: "低优先级", value: 55, color: "#3b82f6" },
]

export function PriorityDistribution() {
  const [data, setData] = useState(MOCK_PRIORITY_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // 模拟刷新数据
  const handleRefresh = () => {
    setIsRefreshing(true)

    setTimeout(() => {
      // 随机修改数据以模拟刷新效果
      const total = 100
      const high = Math.floor(Math.random() * 30)
      const medium = Math.floor(Math.random() * (total - high) * 0.6)
      const low = total - high - medium

      setData([
        { name: "高优先级", value: high, color: "#ef4444" },
        { name: "中优先级", value: medium, color: "#f59e0b" },
        { name: "低优先级", value: low, color: "#3b82f6" },
      ])

      setIsRefreshing(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">任务优先级分布</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="h-8 w-8">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">刷新</span>
          </Button>
        </div>
        <CardDescription>当前队列中任务的优先级分布</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
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
  )
}
