import { Suspense } from "react"
import type { Metadata } from "next"
import { AttendanceReportHeader } from "@/components/attendance/report/attendance-report-header"
import { AttendanceReportFilter } from "@/components/attendance/report/attendance-report-filter"
import { AttendanceReportTable } from "@/components/attendance/report/attendance-report-table"
import { AttendanceReportSkeleton } from "@/components/attendance/report/attendance-report-skeleton"
import { AttendanceReportCharts } from "@/components/attendance/report/attendance-report-charts"
import { AttendanceEmailSettings } from "@/components/attendance/report/attendance-email-settings"
import { AttendanceEmailHistory } from "@/components/attendance/report/attendance-email-history"
import { DynamicReportTabs } from "@/components/attendance/report/dynamic-report-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getAttendanceReportPermissions } from "@/lib/attendance"

export const metadata: Metadata = {
  title: "考勤报表 | 言语『启智』运维管理中心",
  description: "查看和导出员工考勤报表数据",
}

export default async function AttendanceReportPage() {
  // 获取当前用户的报表权限
  const permissions = await getAttendanceReportPermissions()

  return (
    <div className="space-y-6">
      <AttendanceReportHeader permissions={permissions} />

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">表格视图</TabsTrigger>
          <TabsTrigger value="charts">图表视图</TabsTrigger>
          {permissions.canManageSchedule && <TabsTrigger value="schedule">定时发送</TabsTrigger>}
          {permissions.canManageFields && <TabsTrigger value="fields">字段管理</TabsTrigger>}
          {permissions.canManageSchedule && <TabsTrigger value="email">邮件设置</TabsTrigger>}
          {permissions.canManageSchedule && <TabsTrigger value="email-history">发送历史</TabsTrigger>}
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>考勤报表</CardTitle>
              <CardDescription>查看员工考勤数据，支持筛选、排序和导出</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AttendanceReportFilter />
              <Separator />
              <Suspense fallback={<AttendanceReportSkeleton />}>
                <AttendanceReportTable permissions={permissions} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>考勤数据可视化</CardTitle>
              <CardDescription>通过图表直观展示考勤数据和趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center">加载图表中...</div>}>
                <AttendanceReportCharts />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        {permissions.canManageSchedule && (
          <TabsContent value="schedule" className="space-y-4">
            <DynamicReportTabs canManageSchedule={true} canManageFields={false} />
          </TabsContent>
        )}

        {permissions.canManageFields && (
          <TabsContent value="fields" className="space-y-4">
            <DynamicReportTabs canManageSchedule={false} canManageFields={true} />
          </TabsContent>
        )}

        {permissions.canManageSchedule && (
          <TabsContent value="email" className="space-y-4">
            <Suspense fallback={<AttendanceReportSkeleton />}>
              <AttendanceEmailSettings />
            </Suspense>
          </TabsContent>
        )}

        {permissions.canManageSchedule && (
          <TabsContent value="email-history" className="space-y-4">
            <Suspense fallback={<AttendanceReportSkeleton />}>
              <AttendanceEmailHistory />
            </Suspense>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
