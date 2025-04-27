"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Database, Search, Users } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function DatabaseDashboard({ data, isLoading, onRefresh }) {
  // 如果数据未加载，使用模拟数据
  const dbData = data || {
    connectionStats: {
      active: 0,
      idle: 0,
      max: 20,
      usedPercentage: 0,
    },
    queryStats: {
      totalQueries: 0,
      queriesPerSecond: 0,
      slowQueries: 0,
      avgResponseTime: 0,
    },
    storageStats: {
      databaseSize: 0,
      tablesCount: 0,
      indexSize: 0,
      usedPercentage: 0,
    },
    topQueries: [
      { query: "SELECT", count: 0, avgTime: 0 },
      { query: "INSERT", count: 0, avgTime: 0 },
      { query: "UPDATE", count: 0, avgTime: 0 },
      { query: "DELETE", count: 0, avgTime: 0 },
    ],
    queryHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        queries: 0,
      })),
    responseTimeHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        responseTime: 0,
      })),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">数据库监控面板</h2>
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>连接状态</CardTitle>
              <CardDescription>数据库连接使用情况</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{dbData.connectionStats.usedPercentage.toFixed(1)}%</div>
                <Badge
                  variant="outline"
                  className={
                    dbData.connectionStats.usedPercentage > 80
                      ? "bg-red-50 text-red-700 border-red-200"
                      : dbData.connectionStats.usedPercentage > 60
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {dbData.connectionStats.usedPercentage > 80
                    ? "高负载"
                    : dbData.connectionStats.usedPercentage > 60
                      ? "中等负载"
                      : "低负载"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>活跃: {dbData.connectionStats.active}</span>
                  <span>空闲: {dbData.connectionStats.idle}</span>
                  <span>最大: {dbData.connectionStats.max}</span>
                </div>
                <Progress value={dbData.connectionStats.usedPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>查询统计</CardTitle>
              <CardDescription>数据库查询性能</CardDescription>
            </div>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{dbData.queryStats.queriesPerSecond.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">每秒查询数</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>总查询: {dbData.queryStats.totalQueries.toLocaleString()}</span>
                  <span>慢查询: {dbData.queryStats.slowQueries}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>平均响应时间: {dbData.queryStats.avgResponseTime.toFixed(2)} ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>存储统计</CardTitle>
              <CardDescription>数据库存储使用情况</CardDescription>
            </div>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {(dbData.storageStats.databaseSize / 1024 / 1024).toFixed(2)} MB
                </div>
                <Badge
                  variant="outline"
                  className={
                    dbData.storageStats.usedPercentage > 80
                      ? "bg-red-50 text-red-700 border-red-200"
                      : dbData.storageStats.usedPercentage > 60
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {dbData.storageStats.usedPercentage > 80
                    ? "高负载"
                    : dbData.storageStats.usedPercentage > 60
                      ? "中等负载"
                      : "低负载"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>表数量: {dbData.storageStats.tablesCount}</span>
                  <span>索引大小: {(dbData.storageStats.indexSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <Progress value={dbData.storageStats.usedPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>查询趋势</CardTitle>
            <CardDescription>24小时查询数变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dbData.queryHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 查询/秒`, "查询数"]} />
                  <Legend />
                  <Line type="monotone" dataKey="queries" stroke="#8884d8" activeDot={{ r: 8 }} name="查询数" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>响应时间趋势</CardTitle>
            <CardDescription>24小时响应时间变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dbData.responseTimeHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ms`, "响应时间"]} />
                  <Legend />
                  <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" activeDot={{ r: 8 }} name="响应时间" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>热门查询</CardTitle>
          <CardDescription>最常执行的数据库查询</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dbData.topQueries} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="query" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}`, "执行次数"]} />
                <Legend />
                <Bar dataKey="count" name="执行次数" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
