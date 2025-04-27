import { Suspense } from "react"
import { TaskDashboard } from "@/components/admin/tasks/task-dashboard"
import { TaskListSkeleton } from "@/components/admin/tasks/task-list-skeleton"

export const metadata = {
  title: "定时任务管理 | 言语『启智』运维管理中心",
  description: "管理系统定时任务，设置自动化报表和通知",
}

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">定时任务管理</h1>
        <p className="text-muted-foreground">管理系统定时任务，设置自动化报表和通知</p>
      </div>

      <Suspense fallback={<TaskListSkeleton />}>
        <TaskDashboard />
      </Suspense>
    </div>
  )
}
