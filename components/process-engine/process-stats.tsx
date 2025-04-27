"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { getProcessStats } from "@/lib/process-stats-client"

export function ProcessStats() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsData, setStatsData] = useState<{
    daily: Array<{ name: string; count: number }>
    weekly: Array<{ name: string; count: number }>
    totalProcessed: number
    successRate: string
  }>({
    daily: [],
    weekly: [],
    totalProcessed: 0,
    successRate: "0%",
  })
  const [activeTab, setActiveTab] = useState("daily")

  useEffect(() => {
    // 获取统计数据
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getProcessStats()
        setStatsData(data)
      } catch (err) {
        console.error("获取统计数据失败:", err)
        setError("获取统计数据失败")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    // 设置定时刷新
    const interval = setInterval(fetchStats, 300000) // 每5分钟刷新一次
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>处理统计</CardTitle>
        <CardDescription>任务处理数量统计</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 bg-red-50 rounded-md text-red-700 text-sm flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">今日</TabsTrigger>
            <TabsTrigger value="weekly">本周</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="pt-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : statsData.daily.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">暂无今日数据</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="处理任务数" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          <TabsContent value="weekly" className="pt-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : statsData.weekly.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">暂无本周数据</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData.weekly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" name="处理任务数" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">总处理任务</div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : statsData.totalProcessed.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-md">
            <div className="text-sm text-muted-foreground">成功率</div>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : statsData.successRate}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
