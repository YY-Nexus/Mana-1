"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { format, subMonths } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Download, RefreshCw, Clock, BarChart3, Building, Users } from "lucide-react"
import { ApprovalEfficiencyMetrics } from "@/components/salary/reports/approval-efficiency-metrics"
import { ApprovalTrendCharts } from "@/components/salary/reports/approval-trend-charts"
import { ApprovalStatusDistribution } from "@/components/salary/reports/approval-status-distribution"
import { ApprovalTimeDistribution } from "@/components/salary/reports/approval-time-distribution"
import { ApprovalDepartmentComparison } from "@/components/salary/reports/approval-department-comparison"
import { ApprovalApproverPerformance } from "@/components/salary/reports/approval-approver-performance"
import { SalaryReportSkeleton } from "@/components/salary/reports/salary-report-skeleton"
import {
  getApprovalEfficiency,
  getApprovalTrend,
  getDepartments,
  type ApprovalEfficiency,
  type ApprovalTrend,
} from "@/lib/salary-report-service"

export function SalaryApprovalReportDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("efficiency")
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 6),
    to: new Date(),
  })
  const [department, setDepartment] = useState<string>("all")
  const [departments, setDepartments] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState<string>("6")
  const [efficiencyData, setEfficiencyData] = useState<ApprovalEfficiency | null>(null)
  const [trendData, setTrendData] = useState<ApprovalTrend | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  // 加载部门列表
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await getDepartments()
        setDepartments(depts)
      } catch (error) {
        console.error("加载部门列表失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载部门列表，请刷新页面重试",
          variant: "destructive",
        })
      }
    }

    loadDepartments()
  }, [toast])

  // 加载报表数据
  useEffect(() => {
    loadReportData()
  }, [dateRange, department, timeRange])

  // 加载报表数据
  const loadReportData = async () => {
    setLoading(true)

    try {
      // 加载效率数据
      const startDate = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined
      const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
      const effData = await getApprovalEfficiency(startDate, endDate, department === "all" ? undefined : department)
      setEfficiencyData(effData)

      // 加载趋势数据
      const trendData = await getApprovalTrend(
        Number.parseInt(timeRange),
        department === "all" ? undefined : department,
      )
      setTrendData(trendData)

      setLoading(false)
    } catch (error) {
      console.error("加载报表数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载报表数据，请稍后重试",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // 导出报表
  const exportReport = async () => {
    setExportLoading(true)

    try {
      // 模拟导出过程
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "导出成功",
        description: "报表已成功导出为Excel文件",
      })
    } catch (error) {
      console.error("导出报表失败:", error)
      toast({
        title: "导出失败",
        description: "导出报表时发生错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">近3个月</SelectItem>
              <SelectItem value="6">近6个月</SelectItem>
              <SelectItem value="12">近12个月</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={loadReportData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
          <Button onClick={exportReport} disabled={exportLoading}>
            <Download className="mr-2 h-4 w-4" />
            {exportLoading ? "导出中..." : "导出报表"}
          </Button>
        </div>
      </div>

      {loading ? (
        <SalaryReportSkeleton />
      ) : (
        <>
          {efficiencyData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">总审批数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{efficiencyData.totalApprovals}</div>
                  <p className="text-xs text-muted-foreground">
                    已完成: {efficiencyData.approvedCount + efficiencyData.rejectedCount}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">审批通过率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{efficiencyData.approvalRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">已通过: {efficiencyData.approvedCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">审批拒绝率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{efficiencyData.rejectionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">已拒绝: {efficiencyData.rejectedCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">平均处理时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{efficiencyData.avgProcessingTime.toFixed(1)} 小时</div>
                  <p className="text-xs text-muted-foreground">
                    待处理: {efficiencyData.pendingCount + efficiencyData.inProgressCount}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="efficiency" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="efficiency">
                <Clock className="mr-2 h-4 w-4" />
                审批效率
              </TabsTrigger>
              <TabsTrigger value="trends">
                <BarChart3 className="mr-2 h-4 w-4" />
                审批趋势
              </TabsTrigger>
              <TabsTrigger value="departments">
                <Building className="mr-2 h-4 w-4" />
                部门分析
              </TabsTrigger>
              <TabsTrigger value="approvers">
                <Users className="mr-2 h-4 w-4" />
                审批人分析
              </TabsTrigger>
            </TabsList>

            <TabsContent value="efficiency" className="space-y-6">
              {efficiencyData && (
                <>
                  <ApprovalEfficiencyMetrics data={efficiencyData} loading={loading} />
                  <ApprovalTimeDistribution data={efficiencyData} loading={loading} />
                </>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {trendData && (
                <>
                  <ApprovalTrendCharts data={trendData} loading={loading} />
                  <ApprovalStatusDistribution data={trendData} loading={loading} />
                </>
              )}
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              {trendData && <ApprovalDepartmentComparison data={trendData} loading={loading} />}
            </TabsContent>

            <TabsContent value="approvers" className="space-y-6">
              {trendData && efficiencyData && (
                <ApprovalApproverPerformance trendData={trendData} efficiencyData={efficiencyData} loading={loading} />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
