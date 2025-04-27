"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RedisDashboard } from "@/components/admin/monitoring/redis-dashboard"
import { SystemDashboard } from "@/components/admin/monitoring/system-dashboard"
import { DatabaseDashboard } from "@/components/admin/monitoring/database-dashboard"
import { useToast } from "@/components/ui/use-toast"

export function MonitoringDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("redis")
  const [isLoading, setIsLoading] = useState(true)
  const [monitoringData, setMonitoringData] = useState({
    redis: null,
    system: null,
    database: null,
  })

  const loadData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/monitoring/stats")
      const data = await response.json()

      if (data.success) {
        setMonitoringData(data.stats)
      } else {
        throw new Error(data.message || "获取监控数据失败")
      }
    } catch (error) {
      console.error("加载监控数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载监控数据，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // 每30秒刷新一次数据
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="redis">Redis监控</TabsTrigger>
        <TabsTrigger value="system">系统监控</TabsTrigger>
        <TabsTrigger value="database">数据库监控</TabsTrigger>
      </TabsList>

      <TabsContent value="redis" className="space-y-4">
        <RedisDashboard data={monitoringData.redis} isLoading={isLoading} onRefresh={loadData} />
      </TabsContent>

      <TabsContent value="system" className="space-y-4">
        <SystemDashboard data={monitoringData.system} isLoading={isLoading} onRefresh={loadData} />
      </TabsContent>

      <TabsContent value="database" className="space-y-4">
        <DatabaseDashboard data={monitoringData.database} isLoading={isLoading} onRefresh={loadData} />
      </TabsContent>
    </Tabs>
  )
}
