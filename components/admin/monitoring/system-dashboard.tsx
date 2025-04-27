"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Cpu, HardDrive, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function SystemDashboard({ data, isLoading, onRefresh }) {
  // 如果数据未加载，使用模拟数据
  const systemData = data || {
    cpu: {
      usage: 0,
      cores: 0,
    },
    memory: {
      total: 0,
      used: 0,
      free: 0,
      usedPercentage: 0,
    },
    disk: {
      total: 0,
      used: 0,
      free: 0,
      usedPercentage: 0,
    },
    network: {
      rx: 0,
      tx: 0,
    },
    uptime: 0,
    cpuHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        usage: 0,
      })),
    memoryHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        usage: 0,
      })),
  }

  // 格式化时间
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${days}天 ${hours}小时 ${minutes}分钟`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">系统监控面板</h2>
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>CPU使用率</CardTitle>
              <CardDescription>处理器使用情况</CardDescription>
            </div>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{systemData.cpu.usage.toFixed(1)}%</div>
                <Badge
                  variant="outline"
                  className={
                    systemData.cpu.usage > 80
                      ? "bg-red-50 text-red-700 border-red-200"
                      : systemData.cpu.usage > 60
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {systemData.cpu.usage > 80 ? "高负载" : systemData.cpu.usage > 60 ? "中等负载" : "低负载"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>核心数: {systemData.cpu.cores}</span>
                </div>
                <Progress value={systemData.cpu.usage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>内存使用</CardTitle>
              <CardDescription>系统内存使用情况</CardDescription>
            </div>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{systemData.memory.usedPercentage.toFixed(1)}%</div>
                <Badge
                  variant="outline"
                  className={
                    systemData.memory.usedPercentage > 80
                      ? "bg-red-50 text-red-700 border-red-200"
                      : systemData.memory.usedPercentage > 60
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {systemData.memory.usedPercentage > 80
                    ? "高负载"
                    : systemData.memory.usedPercentage > 60
                      ? "中等负载"
                      : "低负载"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>已用: {(systemData.memory.used / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                  <span>总计: {(systemData.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                </div>
                <Progress value={systemData.memory.usedPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>磁盘使用</CardTitle>
              <CardDescription>存储空间使用情况</CardDescription>
            </div>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{systemData.disk.usedPercentage.toFixed(1)}%</div>
                <Badge
                  variant="outline"
                  className={
                    systemData.disk.usedPercentage > 80
                      ? "bg-red-50 text-red-700 border-red-200"
                      : systemData.disk.usedPercentage > 60
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {systemData.disk.usedPercentage > 80
                    ? "高负载"
                    : systemData.disk.usedPercentage > 60
                      ? "中等负载"
                      : "低负载"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>已用: {(systemData.disk.used / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                  <span>总计: {(systemData.disk.total / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                </div>
                <Progress value={systemData.disk.usedPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>系统运行时间</CardTitle>
              <CardDescription>服务器正常运行时间</CardDescription>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold">{formatUptime(systemData.uptime)}</div>
              <div className="text-sm text-muted-foreground">自上次重启以来的时间</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU使用趋势</CardTitle>
            <CardDescription>24小时CPU使用率变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemData.cpuHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "CPU使用率"]} />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#8884d8" activeDot={{ r: 8 }} name="CPU使用率" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>内存使用趋势</CardTitle>
            <CardDescription>24小时内存使用率变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemData.memoryHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "内存使用率"]} />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#82ca9d" activeDot={{ r: 8 }} name="内存使用率" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
