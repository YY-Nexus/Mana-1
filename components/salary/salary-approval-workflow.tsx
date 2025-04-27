"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  DollarSign,
  FileText,
  Search,
  X,
  Download,
  Filter,
  RefreshCw,
  Calculator,
  CheckSquare,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { PERMISSIONS } from "@/lib/permission-service"

// 薪资审批状态类型
type ApprovalStatus = "pending" | "approved" | "rejected" | "in_progress"

// 薪资审批记录类型
interface SalaryApproval {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  month: string
  baseSalary: number
  bonus: number
  deductions: number
  totalSalary: number
  status: ApprovalStatus
  currentApprover: string
  approvalChain: {
    id: number
    level: number
    approverId: string
    approverName: string
    status: "pending" | "approved" | "rejected" | null
    comment: string | null
    timestamp: string | null
  }[]
  createdAt: string
  updatedAt: string
}

// 当前用户信息
interface CurrentUser {
  id: string
  name: string
  role: string
  permissions: string[]
}

// 模拟当前用户
const CURRENT_USER: CurrentUser = {
  id: "user1",
  name: "王经理",
  role: "manager",
  permissions: [
    PERMISSIONS.SALARY_APPROVAL_VIEW,
    PERMISSIONS.SALARY_APPROVAL_APPROVE,
    PERMISSIONS.SALARY_APPROVAL_REJECT,
    PERMISSIONS.SALARY_APPROVAL_BATCH,
    PERMISSIONS.SALARY_APPROVAL_EXPORT,
    PERMISSIONS.SALARY_CALCULATION_VIEW,
    PERMISSIONS.SALARY_CALCULATION_CREATE,
    PERMISSIONS.SALARY_CALCULATION_BATCH,
  ],
}

// 模拟数据
const MOCK_APPROVALS: SalaryApproval[] = [
  {
    id: "SA-2023-04-001",
    employeeId: "EMP001",
    employeeName: "张三",
    department: "技术部",
    position: "高级工程师",
    month: "2023-04",
    baseSalary: 15000,
    bonus: 3000,
    deductions: 1200,
    totalSalary: 16800,
    status: "in_progress",
    currentApprover: "李经理",
    approvalChain: [
      {
        id: 1,
        level: 1,
        approverId: "user2",
        approverName: "王主管",
        status: "approved",
        comment: "基本工资和绩效无误",
        timestamp: "2023-04-25T10:30:00Z",
      },
      {
        id: 2,
        level: 2,
        approverId: "user1",
        approverName: "李经理",
        status: "pending",
        comment: null,
        timestamp: null,
      },
      {
        id: 3,
        level: 3,
        approverId: "user3",
        approverName: "赵总监",
        status: null,
        comment: null,
        timestamp: null,
      },
    ],
    createdAt: "2023-04-20T08:00:00Z",
    updatedAt: "2023-04-25T10:30:00Z",
  },
  {
    id: "SA-2023-04-002",
    employeeId: "EMP002",
    employeeName: "李四",
    department: "人力资源部",
    position: "HR专员",
    month: "2023-04",
    baseSalary: 12000,
    bonus: 2000,
    deductions: 1000,
    totalSalary: 13000,
    status: "approved",
    currentApprover: "赵总监",
    approvalChain: [
      {
        id: 4,
        level: 1,
        approverId: "user2",
        approverName: "王主管",
        status: "approved",
        comment: "基本工资和绩效无误",
        timestamp: "2023-04-22T09:15:00Z",
      },
      {
        id: 5,
        level: 2,
        approverId: "user1",
        approverName: "李经理",
        status: "approved",
        comment: "同意",
        timestamp: "2023-04-23T14:20:00Z",
      },
      {
        id: 6,
        level: 3,
        approverId: "user3",
        approverName: "赵总监",
        status: "approved",
        comment: "批准",
        timestamp: "2023-04-24T16:45:00Z",
      },
    ],
    createdAt: "2023-04-20T08:00:00Z",
    updatedAt: "2023-04-24T16:45:00Z",
  },
  {
    id: "SA-2023-04-003",
    employeeId: "EMP003",
    employeeName: "王五",
    department: "财务部",
    position: "会计",
    month: "2023-04",
    baseSalary: 13000,
    bonus: 1500,
    deductions: 1100,
    totalSalary: 13400,
    status: "rejected",
    currentApprover: "李经理",
    approvalChain: [
      {
        id: 7,
        level: 1,
        approverId: "user2",
        approverName: "王主管",
        status: "approved",
        comment: "基本工资和绩效无误",
        timestamp: "2023-04-23T11:20:00Z",
      },
      {
        id: 8,
        level: 2,
        approverId: "user1",
        approverName: "李经理",
        status: "rejected",
        comment: "绩效奖金计算有误，请重新核对",
        timestamp: "2023-04-24T13:10:00Z",
      },
      {
        id: 9,
        level: 3,
        approverId: "user3",
        approverName: "赵总监",
        status: null,
        comment: null,
        timestamp: null,
      },
    ],
    createdAt: "2023-04-20T08:00:00Z",
    updatedAt: "2023-04-24T13:10:00Z",
  },
  {
    id: "SA-2023-04-004",
    employeeId: "EMP004",
    employeeName: "赵六",
    department: "市场部",
    position: "市场专员",
    month: "2023-04",
    baseSalary: 11000,
    bonus: 2500,
    deductions: 900,
    totalSalary: 12600,
    status: "pending",
    currentApprover: "王主管",
    approvalChain: [
      {
        id: 10,
        level: 1,
        approverId: "user2",
        approverName: "王主管",
        status: "pending",
        comment: null,
        timestamp: null,
      },
      {
        id: 11,
        level: 2,
        approverId: "user1",
        approverName: "李经理",
        status: null,
        comment: null,
        timestamp: null,
      },
      {
        id: 12,
        level: 3,
        approverId: "user3",
        approverName: "赵总监",
        status: null,
        comment: null,
        timestamp: null,
      },
    ],
    createdAt: "2023-04-20T08:00:00Z",
    updatedAt: "2023-04-20T08:00:00Z",
  },
  {
    id: "SA-2023-05-001",
    employeeId: "EMP001",
    employeeName: "张三",
    department: "技术部",
    position: "高级工程师",
    month: "2023-05",
    baseSalary: 15000,
    bonus: 4000,
    deductions: 1200,
    totalSalary: 17800,
    status: "pending",
    currentApprover: "王主管",
    approvalChain: [
      {
        id: 13,
        level: 1,
        approverId: "user2",
        approverName: "王主管",
        status: "pending",
        comment: null,
        timestamp: null,
      },
      {
        id: 14,
        level: 2,
        approverId: "user1",
        approverName: "李经理",
        status: null,
        comment: null,
        timestamp: null,
      },
      {
        id: 15,
        level: 3,
        approverId: "user3",
        approverName: "赵总监",
        status: null,
        comment: null,
        timestamp: null,
      },
    ],
    createdAt: "2023-05-20T08:00:00Z",
    updatedAt: "2023-05-20T08:00:00Z",
  },
]

export function SalaryApprovalWorkflow() {
  const { toast } = useToast()
  const [approvals, setApprovals] = useState<SalaryApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApproval, setSelectedApproval] = useState<SalaryApproval | null>(null)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")
  const [filterMonth, setFilterMonth] = useState<string>("")
  const [filterDepartment, setFilterDepartment] = useState<string>("")
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"xlsx" | "csv" | "json">("xlsx")
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [calculateDialogOpen, setCalculateDialogOpen] = useState(false)
  const [calculationMonth, setCalculationMonth] = useState(
    new Date()
      .toISOString()
      .substring(0, 7), // 当前年月，格式：YYYY-MM
  )
  const [calculationDepartment, setCalculationDepartment] = useState<string>("")
  const [generateApprovals, setGenerateApprovals] = useState(true)

  // 检查权限
  const canApprove = CURRENT_USER.permissions.includes(PERMISSIONS.SALARY_APPROVAL_APPROVE)
  const canReject = CURRENT_USER.permissions.includes(PERMISSIONS.SALARY_APPROVAL_REJECT)
  const canBatch = CURRENT_USER.permissions.includes(PERMISSIONS.SALARY_APPROVAL_BATCH)
  const canExport = CURRENT_USER.permissions.includes(PERMISSIONS.SALARY_APPROVAL_EXPORT)
  const canCalculate = CURRENT_USER.permissions.includes(PERMISSIONS.SALARY_CALCULATION_CREATE)
  const canBatchCalculate = CURRENT_USER.permissions.includes(PERMISSIONS.SALARY_CALCULATION_BATCH)

  // 加载审批数据
  useEffect(() => {
    fetchApprovals()
  }, [activeTab])

  // 获取审批数据
  const fetchApprovals = async () => {
    setLoading(true)

    // 模拟API请求
    setTimeout(() => {
      // 根据标签过滤数据
      let filteredData = []

      if (activeTab === "pending") {
        filteredData = MOCK_APPROVALS.filter((a) => a.status === "pending" || a.status === "in_progress")
      } else if (activeTab === "approved") {
        filteredData = MOCK_APPROVALS.filter((a) => a.status === "approved")
      } else if (activeTab === "rejected") {
        filteredData = MOCK_APPROVALS.filter((a) => a.status === "rejected")
      }

      setApprovals(filteredData)
      setLoading(false)
    }, 800)
  }

  // 过滤审批记录
  const filteredApprovals = approvals.filter((approval) => {
    // 根据搜索词过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        approval.employeeName.toLowerCase().includes(searchLower) ||
        approval.employeeId.toLowerCase().includes(searchLower) ||
        approval.department.toLowerCase().includes(searchLower) ||
        approval.id.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false
    }

    // 根据月份过滤
    if (filterMonth && approval.month !== filterMonth) {
      return false
    }

    // 根据部门过滤
    if (filterDepartment && approval.department !== filterDepartment) {
      return false
    }

    return true
  })

  // 处理审批操作
  const handleApproval = (approval: SalaryApproval, action: "approve" | "reject") => {
    if ((action === "approve" && !canApprove) || (action === "reject" && !canReject)) {
      toast({
        title: "权限不足",
        description: `您没有${action === "approve" ? "通过" : "拒绝"}薪资审批的权限`,
        variant: "destructive",
      })
      return
    }

    setSelectedApproval(approval)
    setApprovalComment("")
    setApprovalAction(action)
    setApprovalDialogOpen(true)
  }

  // 提交审批结果
  const submitApproval = async () => {
    if (!selectedApproval) return

    const isApproved = approvalAction === "approve"
    setIsProcessing(true)

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 更新审批链
      const updatedApproval = { ...selectedApproval }

      // 找到当前审批人
      const currentApproverIndex = updatedApproval.approvalChain.findIndex((item) => item.status === "pending")

      if (currentApproverIndex >= 0) {
        // 更新当前审批人的状态
        updatedApproval.approvalChain[currentApproverIndex].status = isApproved ? "approved" : "rejected"
        updatedApproval.approvalChain[currentApproverIndex].comment = approvalComment
        updatedApproval.approvalChain[currentApproverIndex].timestamp = new Date().toISOString()

        // 如果被拒绝，整个审批状态为拒绝
        if (!isApproved) {
          updatedApproval.status = "rejected"
        } else {
          // 如果是最后一个审批人
          if (currentApproverIndex === updatedApproval.approvalChain.length - 1) {
            updatedApproval.status = "approved"
          } else {
            // 更新下一个审批人
            updatedApproval.status = "in_progress"
            updatedApproval.currentApprover = updatedApproval.approvalChain[currentApproverIndex + 1].approverName
          }
        }
      }

      // 更新状态
      setApprovals((prev) => prev.map((item) => (item.id === updatedApproval.id ? updatedApproval : item)))

      setIsProcessing(false)
      setApprovalDialogOpen(false)

      toast({
        title: isApproved ? "审批通过" : "审批拒绝",
        description: `已${isApproved ? "通过" : "拒绝"}${updatedApproval.employeeName}的薪资审批`,
        variant: isApproved ? "default" : "destructive",
      })
    } catch (error) {
      console.error("提交审批失败:", error)
      toast({
        title: "操作失败",
        description: "提交审批时发生错误，请重试",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  // 查看详情
  const viewDetails = (approval: SalaryApproval) => {
    setSelectedApproval(approval)
    setDetailsDialogOpen(true)
  }

  // 处理导出
  const handleExport = async () => {
    if (!canExport) {
      toast({
        title: "权限不足",
        description: "您没有导出薪资审批数据的权限",
        variant: "destructive",
      })
      return
    }

    setExportDialogOpen(true)
  }

  // 执行导出
  const executeExport = async () => {
    setIsProcessing(true)

    try {
      // 模拟导出过程
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setExportDialogOpen(false)
      setIsProcessing(false)

      toast({
        title: "导出成功",
        description: `薪资审批数据已成功导出为${exportFormat.toUpperCase()}格式`,
      })

      // 实际应用中，这里应该触发文件下载
    } catch (error) {
      console.error("导出失败:", error)
      toast({
        title: "导出失败",
        description: "导出数据时发生错误，请重试",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  // 处理批量审批
  const handleBatchApproval = () => {
    if (!canBatch) {
      toast({
        title: "权限不足",
        description: "您没有批量处理薪资审批的权限",
        variant: "destructive",
      })
      return
    }

    if (selectedApprovals.length === 0) {
      toast({
        title: "未选择记录",
        description: "请至少选择一条记录进行批量操作",
        variant: "destructive",
      })
      return
    }

    setBatchDialogOpen(true)
  }

  // 执行批量审批
  const executeBatchApproval = async (action: "approve" | "reject") => {
    setIsProcessing(true)

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 更新选中的审批记录
      const updatedApprovals = [...approvals]
      let successCount = 0

      for (const id of selectedApprovals) {
        const index = updatedApprovals.findIndex((a) => a.id === id)
        if (index >= 0) {
          const approval = { ...updatedApprovals[index] }

          // 找到当前审批人
          const currentApproverIndex = approval.approvalChain.findIndex((item) => item.status === "pending")

          if (currentApproverIndex >= 0) {
            // 更新当前审批人的状态
            approval.approvalChain[currentApproverIndex].status = action === "approve" ? "approved" : "rejected"
            approval.approvalChain[currentApproverIndex].comment = approvalComment
            approval.approvalChain[currentApproverIndex].timestamp = new Date().toISOString()

            // 如果被拒绝，整个审批状态为拒绝
            if (action === "reject") {
              approval.status = "rejected"
            } else {
              // 如果是最后一个审批人
              if (currentApproverIndex === approval.approvalChain.length - 1) {
                approval.status = "approved"
              } else {
                // 更新下一个审批人
                approval.status = "in_progress"
                approval.currentApprover = approval.approvalChain[currentApproverIndex + 1].approverName
              }
            }

            updatedApprovals[index] = approval
            successCount++
          }
        }
      }

      setApprovals(updatedApprovals)
      setSelectedApprovals([])
      setSelectAll(false)
      setBatchDialogOpen(false)
      setIsProcessing(false)

      toast({
        title: "批量操作完成",
        description: `成功${action === "approve" ? "通过" : "拒绝"}了 ${successCount} 条审批记录`,
      })
    } catch (error) {
      console.error("批量审批失败:", error)
      toast({
        title: "操作失败",
        description: "批量审批时发生错误，请重试",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  // 处理薪资计算
  const handleCalculate = () => {
    if (!canCalculate) {
      toast({
        title: "权限不足",
        description: "您没有计算薪资的权限",
        variant: "destructive",
      })
      return
    }

    setCalculateDialogOpen(true)
  }

  // 执行薪资计算
  const executeCalculation = async () => {
    if (!canBatchCalculate && calculationDepartment === "") {
      toast({
        title: "权限不足",
        description: "您没有批量计算薪资的权限",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 2500))

      setCalculateDialogOpen(false)
      setIsProcessing(false)

      toast({
        title: "薪资计算完成",
        description: generateApprovals ? "薪资计算完成并已生成审批流程" : "薪资计算完成，您可以在薪资管理中查看结果",
      })

      // 如果生成了审批，刷新列表
      if (generateApprovals) {
        fetchApprovals()
      }
    } catch (error) {
      console.error("薪资计算失败:", error)
      toast({
        title: "计算失败",
        description: "薪资计算时发生错误，请重试",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  // 处理选择所有
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedApprovals(filteredApprovals.map((a) => a.id))
    } else {
      setSelectedApprovals([])
    }
  }

  // 处理选择单个
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApprovals((prev) => [...prev, id])
    } else {
      setSelectedApprovals((prev) => prev.filter((approvalId) => approvalId !== id))
    }
  }

  // 清除筛选
  const clearFilters = () => {
    setFilterMonth("")
    setFilterDepartment("")
    setSearchTerm("")
  }

  // 获取状态标签
  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            待审批
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            审批中
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已通过
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            已拒绝
          </Badge>
        )
    }
  }

  // 获取审批进度
  const getApprovalProgress = (approval: SalaryApproval) => {
    const totalSteps = approval.approvalChain.length
    const completedSteps = approval.approvalChain.filter((step) => step.status === "approved").length

    return Math.round((completedSteps / totalSteps) * 100)
  }

  // 格式化日期时间
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return format(date, "yyyy-MM-dd HH:mm:ss")
    } catch (error) {
      return dateString
    }
  }

  // 获取最后一个审批人的时间戳
  const getLastApprovalTimestamp = (approval: SalaryApproval) => {
    const approvedSteps = approval.approvalChain.filter((step) => step.status === "approved")
    if (approvedSteps.length === 0) return "-"

    const lastStep = approvedSteps[approvedSteps.length - 1]
    return formatDateTime(lastStep.timestamp)
  }

  // 获取拒绝审批的时间戳
  const getRejectionTimestamp = (approval: SalaryApproval) => {
    const rejectedStep = approval.approvalChain.find((step) => step.status === "rejected")
    if (!rejectedStep) return "-"

    return formatDateTime(rejectedStep.timestamp)
  }

  // 获取拒绝审批的原因
  const getRejectionReason = (approval: SalaryApproval) => {
    const rejectedStep = approval.approvalChain.find((step) => step.status === "rejected")
    if (!rejectedStep || !rejectedStep.comment) return "未提供原因"

    return rejectedStep.comment
  }

  // 获取可用的月份列表
  const getAvailableMonths = () => {
    const months = new Set<string>()
    approvals.forEach((a) => months.add(a.month))
    return Array.from(months).sort().reverse()
  }

  // 获取可用的部门列表
  const getAvailableDepartments = () => {
    const departments = new Set<string>()
    approvals.forEach((a) => departments.add(a.department))
    return Array.from(departments).sort()
  }

  return (
    <div className="space-y-4">
      <div className="neuro-title mb-6">
        <h1 className="text-2xl font-bold text-white">薪资审批流程</h1>
        <p className="text-gray-300 mt-2">管理员工薪资审批流程，支持批量操作和数据导出</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>薪资审批管理</CardTitle>
              <CardDescription>查看和处理员工薪资审批申请</CardDescription>
            </div>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索员工姓名、工号或部门..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      筛选
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>筛选条件</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <div className="mb-2">
                        <label className="text-xs font-medium">月份</label>
                        <Select value={filterMonth} onValueChange={setFilterMonth}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择月份" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_months">全部月份</SelectItem>
                            {getAvailableMonths().map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mb-2">
                        <label className="text-xs font-medium">部门</label>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择部门" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">全部部门</SelectItem>
                            {getAvailableDepartments().map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={clearFilters}>
                        清除筛选
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="neuro-btn">
                      <FileText className="mr-2 h-4 w-4" />
                      操作
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCalculate()}>
                      <Calculator className="mr-2 h-4 w-4" />
                      计算薪资
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBatchApproval()}>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      批量审批
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport()}>
                      <Download className="mr-2 h-4 w-4" />
                      导出数据
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => fetchApprovals()}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      刷新数据
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 py-2 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">待审批</TabsTrigger>
                <TabsTrigger value="approved">已通过</TabsTrigger>
                <TabsTrigger value="rejected">已拒绝</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {canBatch && (
                      <TableHead className="w-12">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="选择所有" />
                      </TableHead>
                    )}
                    <TableHead>审批编号</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>月份</TableHead>
                    <TableHead>总金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>当前审批人</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={canBatch ? 10 : 9} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <div className="neuro-loader"></div>
                          <span className="ml-3">加载中...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canBatch ? 10 : 9} className="h-24 text-center">
                        暂无待审批记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        {canBatch && (
                          <TableCell>
                            <Checkbox
                              checked={selectedApprovals.includes(approval.id)}
                              onCheckedChange={(checked) => handleSelectOne(approval.id, !!checked)}
                              aria-label={`选择 ${approval.employeeName} 的审批`}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{approval.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/abstract-geometric-shapes.png?height=32&width=32&query=${approval.employeeName}`}
                              />
                              <AvatarFallback>{approval.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{approval.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{approval.department}</TableCell>
                        <TableCell>{approval.month}</TableCell>
                        <TableCell>¥{approval.totalSalary.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell>{approval.currentApprover}</TableCell>
                        <TableCell>
                          <div className="w-24">
                            <Progress value={getApprovalProgress(approval)} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => viewDetails(approval)}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">查看详情</span>
                            </Button>
                            {approval.status !== "approved" && approval.status !== "rejected" && (
                              <>
                                {canApprove && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => handleApproval(approval, "approve")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">通过</span>
                                  </Button>
                                )}
                                {canReject && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    onClick={() => handleApproval(approval, "reject")}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">拒绝</span>
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="approved" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {canBatch && (
                      <TableHead className="w-12">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="选择所有" />
                      </TableHead>
                    )}
                    <TableHead>审批编号</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>月份</TableHead>
                    <TableHead>总金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>完成时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={canBatch ? 9 : 8} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <div className="neuro-loader"></div>
                          <span className="ml-3">加载中...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canBatch ? 9 : 8} className="h-24 text-center">
                        暂无已通过记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        {canBatch && (
                          <TableCell>
                            <Checkbox
                              checked={selectedApprovals.includes(approval.id)}
                              onCheckedChange={(checked) => handleSelectOne(approval.id, !!checked)}
                              aria-label={`选择 ${approval.employeeName} 的审批`}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{approval.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/abstract-geometric-shapes.png?height=32&width=32&query=${approval.employeeName}`}
                              />
                              <AvatarFallback>{approval.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{approval.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{approval.department}</TableCell>
                        <TableCell>{approval.month}</TableCell>
                        <TableCell>¥{approval.totalSalary.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell>{getLastApprovalTimestamp(approval)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => viewDetails(approval)}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">查看详情</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="rejected" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {canBatch && (
                      <TableHead className="w-12">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="选择所有" />
                      </TableHead>
                    )}
                    <TableHead>审批编号</TableHead>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>月份</TableHead>
                    <TableHead>总金额</TableHead>
                    <TableHead>拒绝原因</TableHead>
                    <TableHead>拒绝时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={canBatch ? 9 : 8} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <div className="neuro-loader"></div>
                          <span className="ml-3">加载中...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canBatch ? 9 : 8} className="h-24 text-center">
                        暂无已拒绝记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        {canBatch && (
                          <TableCell>
                            <Checkbox
                              checked={selectedApprovals.includes(approval.id)}
                              onCheckedChange={(checked) => handleSelectOne(approval.id, !!checked)}
                              aria-label={`选择 ${approval.employeeName} 的审批`}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{approval.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/abstract-geometric-shapes.png?height=32&width=32&query=${approval.employeeName}`}
                              />
                              <AvatarFallback>{approval.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{approval.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{approval.department}</TableCell>
                        <TableCell>{approval.month}</TableCell>
                        <TableCell>¥{approval.totalSalary.toLocaleString()}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={getRejectionReason(approval)}>
                          {getRejectionReason(approval)}
                        </TableCell>
                        <TableCell>{getRejectionTimestamp(approval)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => viewDetails(approval)}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">查看详情</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 审批对话框 */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{approvalAction === "approve" ? "通过审批" : "拒绝审批"}</DialogTitle>
            <DialogDescription>
              {approvalAction === "approve" ? "请确认您要通过此薪资审批申请" : "请提供拒绝此薪资审批申请的原因"}
            </DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">员工姓名</div>
                  <div className="font-medium">{selectedApproval.employeeName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">部门</div>
                  <div className="font-medium">{selectedApproval.department}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">职位</div>
                  <div className="font-medium">{selectedApproval.position}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">薪资月份</div>
                  <div className="font-medium">{selectedApproval.month}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">基本工资</div>
                  <div className="font-medium">¥{selectedApproval.baseSalary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">奖金</div>
                  <div className="font-medium">¥{selectedApproval.bonus.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">扣除项</div>
                  <div className="font-medium">¥{selectedApproval.deductions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">总计</div>
                  <div className="font-medium">¥{selectedApproval.totalSalary.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  {approvalAction === "approve" ? "审批意见（可选）" : "拒绝原因 *"}
                </label>
                <Textarea
                  id="comment"
                  placeholder={approvalAction === "approve" ? "请输入审批意见..." : "请输入拒绝原因..."}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  required={approvalAction === "reject"}
                  className="neuro-groove"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)} disabled={isProcessing}>
              取消
            </Button>
            <Button
              onClick={submitApproval}
              disabled={isProcessing || (approvalAction === "reject" && !approvalComment)}
              variant={approvalAction === "approve" ? "default" : "destructive"}
              className={approvalAction === "approve" ? "neuro-btn" : ""}
            >
              {isProcessing ? (
                <>
                  <div className="neuro-loader mr-2 h-4 w-4"></div>
                  处理中...
                </>
              ) : approvalAction === "approve" ? (
                "通过"
              ) : (
                "拒绝"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>薪资审批详情</DialogTitle>
            <DialogDescription>查看薪资审批的详细信息和审批流程</DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pr-4">
                <div>
                  <h3 className="text-lg font-medium">基本信息</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">审批编号</div>
                      <div className="font-medium">{selectedApproval.id}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">员工工号</div>
                      <div className="font-medium">{selectedApproval.employeeId}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">员工姓名</div>
                      <div className="font-medium">{selectedApproval.employeeName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">部门</div>
                      <div className="font-medium">{selectedApproval.department}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">职位</div>
                      <div className="font-medium">{selectedApproval.position}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">薪资月份</div>
                      <div className="font-medium">{selectedApproval.month}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">创建时间</div>
                      <div className="font-medium">{formatDateTime(selectedApproval.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">更新时间</div>
                      <div className="font-medium">{formatDateTime(selectedApproval.updatedAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="quantum-divider"></div>

                <div>
                  <h3 className="text-lg font-medium">薪资明细</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">基本工资</div>
                      <div className="font-medium">¥{selectedApproval.baseSalary.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">奖金</div>
                      <div className="font-medium">¥{selectedApproval.bonus.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">扣除项</div>
                      <div className="font-medium">¥{selectedApproval.deductions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">总计</div>
                      <div className="font-medium text-lg text-green-600">
                        ¥{selectedApproval.totalSalary.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quantum-divider"></div>

                <div>
                  <h3 className="text-lg font-medium">审批流程</h3>
                  <div className="mt-2">
                    <div className="space-y-4">
                      {selectedApproval.approvalChain.map((step, index) => (
                        <div key={index} className="neuro-groove">
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                step.status === "approved"
                                  ? "bg-green-100 text-green-600"
                                  : step.status === "rejected"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {step.status === "approved" ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : step.status === "rejected" ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">{step.level}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">
                                  {step.level}级审批人: {step.approverName}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    step.status === "approved"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : step.status === "rejected"
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-gray-100 text-gray-800 border-gray-300"
                                  }
                                >
                                  {step.status === "approved"
                                    ? "已通过"
                                    : step.status === "rejected"
                                      ? "已拒绝"
                                      : "待审批"}
                                </Badge>
                              </div>
                              {step.comment && (
                                <div className="mt-1 text-sm text-muted-foreground">审批意见: {step.comment}</div>
                              )}
                              {step.timestamp && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  审批时间: {formatDateTime(step.timestamp)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)} className="neuro-btn">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导出对话框 */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>导出薪资审批数据</DialogTitle>
            <DialogDescription>选择导出格式和范围</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">导出格式</label>
              <Select value={exportFormat} onValueChange={(value: "xlsx" | "csv" | "json") => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择导出格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">导出范围</label>
              <Select defaultValue="current">
                <SelectTrigger>
                  <SelectValue placeholder="选择导出范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">当前筛选结果</SelectItem>
                  <SelectItem value="all">所有审批记录</SelectItem>
                  <SelectItem value="selected">选中的记录</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)} disabled={isProcessing}>
              取消
            </Button>
            <Button onClick={executeExport} disabled={isProcessing} className="neuro-btn">
              {isProcessing ? (
                <>
                  <div className="neuro-loader mr-2 h-4 w-4"></div>
                  处理中...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量审批对话框 */}
      <AlertDialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>批量处理审批</AlertDialogTitle>
            <AlertDialogDescription>
              您已选择 {selectedApprovals.length} 条记录，请选择要执行的操作。
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="batch-comment" className="text-sm font-medium">
                审批意见（可选）
              </label>
              <Textarea
                id="batch-comment"
                placeholder="请输入批量审批意见..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="neuro-groove"
              />
            </div>
          </div>

          <AlertDialogFooter className="flex items-center justify-between sm:justify-between">
            <AlertDialogCancel disabled={isProcessing}>取消</AlertDialogCancel>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => executeBatchApproval("reject")} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="neuro-loader mr-2 h-4 w-4"></div>
                    处理中...
                  </>
                ) : (
                  "批量拒绝"
                )}
              </Button>
              <AlertDialogAction
                onClick={() => executeBatchApproval("approve")}
                disabled={isProcessing}
                className="neuro-btn"
              >
                {isProcessing ? (
                  <>
                    <div className="neuro-loader mr-2 h-4 w-4"></div>
                    处理中...
                  </>
                ) : (
                  "批量通过"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 薪资计算对话框 */}
      <Dialog open={calculateDialogOpen} onOpenChange={setCalculateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>薪资计算</DialogTitle>
            <DialogDescription>计算员工薪资并生成审批流程</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">薪资月份</label>
              <Input type="month" value={calculationMonth} onChange={(e) => setCalculationMonth(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">部门</label>
              <Select value={calculationDepartment} onValueChange={setCalculationDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="选择部门（全部）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="技术部">技术部</SelectItem>
                  <SelectItem value="人力资源部">人力资源部</SelectItem>
                  <SelectItem value="财务部">财务部</SelectItem>
                  <SelectItem value="市场部">市场部</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-approvals"
                checked={generateApprovals}
                onCheckedChange={(checked) => setGenerateApprovals(!!checked)}
              />
              <label
                htmlFor="generate-approvals"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                自动生成审批流程
              </label>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setCalculateDialogOpen(false)} disabled={isProcessing}>
              取消
            </Button>
            <Button onClick={executeCalculation} disabled={isProcessing} className="neuro-btn neuro-btn-pulse">
              {isProcessing ? (
                <>
                  <div className="neuro-loader mr-2 h-4 w-4"></div>
                  计算中...
                </>
              ) : (
                "开始计算"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
