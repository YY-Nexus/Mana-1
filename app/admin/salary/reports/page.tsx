import { SalaryApprovalReportDashboard } from "@/components/salary/reports/salary-approval-report-dashboard"

export default function SalaryReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">薪资审批数据分析</h1>
        <p className="text-muted-foreground">查看薪资审批流程的效率指标、趋势分析和部门对比</p>
      </div>

      <SalaryApprovalReportDashboard />
    </div>
  )
}
