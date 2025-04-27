"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from "@/components/admin/tasks/task-list"
import { TaskQueue } from "@/components/admin/tasks/task-queue"
import { TaskHistory } from "@/components/admin/tasks/task-history"
import { TaskCreate } from "@/components/admin/tasks/task-create"
import { getAllScheduledTasks } from "@/lib/db/scheduled-tasks"
import { getQueueLength } from "@/lib/task-queue"
import { useToast } from "@/components/ui/use-toast"

export function TaskDashboard() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState([])
  const [queueLength, setQueueLength] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("list")

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [tasksData, queueData] = await Promise.all([getAllScheduledTasks(), getQueueLength()])
      setTasks(tasksData)
      setQueueLength(queueData)
    } catch (error) {
      console.error("加载任务数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载任务数据，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // 每60秒刷新一次数据
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleTaskCreated = () => {
    loadData()
    setActiveTab("list")
    toast({
      title: "创建成功",
      description: "定时任务已成功创建",
    })
  }

  const handleTaskUpdated = () => {
    loadData()
    toast({
      title: "更新成功",
      description: "定时任务已成功更新",
    })
  }

  const handleTaskDeleted = () => {
    loadData()
    toast({
      title: "删除成功",
      description: "定时任务已成功删除",
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="list">任务列表</TabsTrigger>
        <TabsTrigger value="queue">任务队列</TabsTrigger>
        <TabsTrigger value="history">执行历史</TabsTrigger>
        <TabsTrigger value="create">创建任务</TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onRefresh={loadData}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      </TabsContent>

      <TabsContent value="queue" className="space-y-4">
        <TaskQueue queueLength={queueLength} isLoading={isLoading} onRefresh={loadData} />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <TaskHistory />
      </TabsContent>

      <TabsContent value="create" className="space-y-4">
        <TaskCreate onTaskCreated={handleTaskCreated} />
      </TabsContent>
    </Tabs>
  )
}
