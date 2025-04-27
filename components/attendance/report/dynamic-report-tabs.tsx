"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { AttendanceReportSkeleton } from "./attendance-report-skeleton"

// 动态导入定时发送和字段管理组件
const AttendanceReportSchedule = dynamic(() => import("@/components/attendance/report/attendance-report-schedule"), {
  ssr: false,
  loading: () => <AttendanceReportSkeleton />,
})

const AttendanceReportFields = dynamic(() => import("@/components/attendance/report/attendance-report-fields"), {
  ssr: false,
  loading: () => <AttendanceReportSkeleton />,
})

interface DynamicReportTabsProps {
  canManageSchedule: boolean
  canManageFields: boolean
}

export function DynamicReportTabs({ canManageSchedule, canManageFields }: DynamicReportTabsProps) {
  return (
    <>
      {canManageSchedule && (
        <Suspense fallback={<AttendanceReportSkeleton />}>
          <AttendanceReportSchedule />
        </Suspense>
      )}

      {canManageFields && (
        <Suspense fallback={<AttendanceReportSkeleton />}>
          <AttendanceReportFields />
        </Suspense>
      )}
    </>
  )
}
