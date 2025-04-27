import { ProcessEngineDashboard } from "@/components/process-engine/process-engine-dashboard"
import { ProcessEngineSkeleton } from "@/components/process-engine/process-engine-skeleton"
import { Suspense } from "react"

export const metadata = {
  title: "处理引擎 | 运维中心",
  description: "任务处理引擎监控和管理",
}

export default function ProcessEnginePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">处理引擎</h1>
        <p className="text-muted-foreground">监控和管理系统任务处理引擎</p>
      </div>

      <Suspense fallback={<ProcessEngineSkeleton />}>
        <ProcessEngineDashboard />
      </Suspense>
    </div>
  )
}
