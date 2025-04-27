"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProcessQueueMonitor } from "./process-queue-monitor"
import { ProcessHistory } from "./process-history"
import { ProcessStats } from "./process-stats"
import { ProcessControl } from "./process-control"
import { TaskAnalysis } from "./task-analysis"
import { FailedTasksList } from "./failed-tasks-list"
import { PriorityDistribution } from "./priority-distribution"
import { TaskExecutionLogs } from "./task-execution-logs"
import { TaskDashboard } from "./task-dashboard"

export function ProcessEngineDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ProcessQueueMonitor />
        <ProcessStats />
        <PriorityDistribution />
        <ProcessControl />
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">处理历史</TabsTrigger>
          <TabsTrigger value="analysis">任务分析</TabsTrigger>
          <TabsTrigger value="failed">失败任务</TabsTrigger>
          <TabsTrigger value="logs">执行日志</TabsTrigger>
          <TabsTrigger value="dashboard">任务仪表盘</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <ProcessHistory />
        </TabsContent>
        <TabsContent value="analysis" className="space-y-4">
          <TaskAnalysis />
        </TabsContent>
        <TabsContent value="failed" className="space-y-4">
          <FailedTasksList />
        </TabsContent>
        <TabsContent value="logs" className="space-y-4">
          <TaskExecutionLogs />
        </TabsContent>
        <TabsContent value="dashboard" className="space-y-4">
          <TaskDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
