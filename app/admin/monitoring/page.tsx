import { Suspense } from "react"
import { MonitoringDashboard } from "@/components/admin/monitoring/monitoring-dashboard"
import { MonitoringSkeleton } from "@/components/admin/monitoring/monitoring-skeleton"

export const metadata = {
  title: "系统监控 | 言语『启智』运维管理中心",
  description: "监控系统性能和资源使用情况",
}

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">系统监控</h1>
        <p className="text-muted-foreground">监控系统性能和资源使用情况</p>
      </div>

      <Suspense fallback={<MonitoringSkeleton />}>
        <MonitoringDashboard />
      </Suspense>
    </div>
  )
}
