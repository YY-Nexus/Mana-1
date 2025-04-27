import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { AttendanceHeader } from "@/components/attendance/attendance-header"

export const metadata: Metadata = {
  title: "考勤管理 | 言语『启智』运维管理中心",
  description: "员工考勤管理、打卡记录和统计报表",
}

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100 rounded-md" />}>
        <AttendanceHeader />
      </Suspense>
      {children}
    </div>
  )
}
