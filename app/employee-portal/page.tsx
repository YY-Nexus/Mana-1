import { Suspense } from "react"
import { EmployeePortalHeader } from "@/components/employee-portal/employee-portal-header"
import { EmployeePortalDashboard } from "@/components/employee-portal/employee-portal-dashboard"
import { EmployeePortalSkeleton } from "@/components/employee-portal/employee-portal-skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "员工自助服务 | 言语『启智』运维管理中心",
  description: "员工自助查询系统，提供薪资、考勤、假期等个人信息查询服务",
}

export default function EmployeePortalPage() {
  return (
    <div className="space-y-6">
      <EmployeePortalHeader />
      <Suspense fallback={<EmployeePortalSkeleton />}>
        <EmployeePortalDashboard />
      </Suspense>
    </div>
  )
}
