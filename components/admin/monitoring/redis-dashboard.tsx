"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Database, Key, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { clearAllCaches } from "@/lib/cache-service"
import { useToast } from "@/components/ui/use-toast"

export function RedisDashboard({ data, isLoading, onRefresh }) {
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)

  // 如果数据未加载，使用模拟数据
  const redisData = data || {
    memoryUsage: {
      used: 0,
      peak: 0,
      total: 100,
      usedPercentage: 0,
    },
    keyspaceStats: {
      totalKeys: 0,
      expiringKeys: 0,
      keysByType: {
        string: 0,
        list: 0,
        set: 0,
        zset: 0,
        hash: 0,
      },
    },
    operationStats: {
      commandsProcessed: 0,
      opsPerSecond: 0,
      hitRate: 0,
      missRate: 0,
    },
    connectionStats: {
      connectedClients: 0,
      blockedClients: 0,
      rejectedConnections: 0,
    },
    keyspaceHitMiss: [
      { name: "命中", value: 0 },
      { name: "未命中", value: 0 },
    ],
    commandStats: [
      { name: "GET", value: 0 },
      { name: "SET", value: 0 },
      { name: "DEL", value: 0 },
      { name: "INCR", value: 0 },
      { name: "EXPIRE", value: 0 },
    ],
    memoryUsageHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        usage: 0,
      })),
    operationsHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        ops: 0,
      })),
  }

  const handleClearCache = async () => {
    setIsClearing(true)
    try {
      await clearAllCaches()
      toast({
        title: "清除成功",
        description: "所有缓存已成功清除",
      })
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("清除缓存失败:", error)
      toast({
        title: "清除失败",
        description: "清除缓存时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  // 饼图颜色
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Redis 监控面板</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleClearCache} disabled={isClearing}>
            {isClearing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                清除中...
              </>
            ) : (
              "清除所有缓存"
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>内存使用</CardTitle>
              <CardDescription>Redis内存使用情况</CardDescription>
            </div>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{redisData.memoryUsage.usedPercentage.toFixed(1)}%</div>
                <Badge
                  variant="outline"
                  className={
                    redisData.memoryUsage.usedPercentage > 80
                      ? "bg-red-50 text-red-700 border-red-200"
                      : redisData.memoryUsage.usedPercentage > 60
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {redisData.memoryUsage.usedPercentage > 80
                    ? "高负载"
                    : redisData.memoryUsage.usedPercentage > 60
                      ? "中等负载"
                      : "低负载"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>已用: {(redisData.memoryUsage.used / 1024 / 1024).toFixed(2)} MB</span>
                  <span>峰值: {(redisData.memoryUsage.peak / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <Progress value={redisData.memoryUsage.usedPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>键空间</CardTitle>
              <CardDescription>Redis键统计</CardDescription>
            </div>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{redisData.keyspaceStats.totalKeys.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">总键数</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>过期键: {redisData.keyspaceStats.expiringKeys.toLocaleString()}</span>
                  <span>
                    {redisData.keyspaceStats.expiringKeys > 0
                      ? ((redisData.keyspaceStats.expiringKeys / redisData.keyspaceStats.totalKeys) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    redisData.keyspaceStats.totalKeys > 0
                      ? (redisData.keyspaceStats.expiringKeys / redisData.keyspaceStats.totalKeys) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>操作统计</CardTitle>
              <CardDescription>Redis操作性能</CardDescription>
            </div>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{redisData.operationStats.opsPerSecond.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">每秒操作数</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>命中率: {(redisData.operationStats.hitRate * 100).toFixed(1)}%</span>
                  <span>未命中率: {(redisData.operationStats.missRate * 100).toFixed(1)}%</span>
                </div>
                <Progress value={redisData.operationStats.hitRate * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>内存使用趋势</CardTitle>
            <CardDescription>24小时内存使用变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={redisData.memoryUsageHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} MB`, "内存使用"]} />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#8884d8" activeDot={{ r: 8 }} name="内存使用" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>操作趋势</CardTitle>
            <CardDescription>24小时操作数变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={redisData.operationsHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ops/s`, "操作数"]} />
                  <Legend />
                  <Line type="monotone" dataKey="ops" stroke="#82ca9d" activeDot={{ r: 8 }} name="每秒操作数" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>命中率分析</CardTitle>
            <CardDescription>缓存命中与未命中比例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={redisData.keyspaceHitMiss}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {redisData.keyspaceHitMiss.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>命令统计</CardTitle>
            <CardDescription>最常用的Redis命令</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={redisData.commandStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, "调用次数"]} />
                  <Legend />
                  <Bar dataKey="value" name="调用次数" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>键类型分布</CardTitle>
          <CardDescription>Redis中不同类型键的分布</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(redisData.keyspaceStats.keysByType).map(([key, value]) => ({
                    name: key,
                    value,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.keys(redisData.keyspaceStats.keysByType).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "键数量"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
