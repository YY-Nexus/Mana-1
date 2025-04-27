import { format, subMonths, parseISO, differenceInHours } from "date-fns"

// 审批记录类型
export interface ApprovalRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  position: string
  month: string
  totalSalary: number
  status: "pending" | "approved" | "rejected" | "in_progress"
  createdAt: string
  updatedAt: string
  completedAt: string | null
  approvalChain: {
    id: number
    level: number
    approverId: string
    approverName: string
    status: "pending" | "approved" | "rejected" | null
    startTime: string | null
    endTime: string | null
    processingTime: number | null // 处理时间（小时）
  }[]
  processingTime: number | null // 总处理时间（小时）
}

// 审批效率指标
export interface ApprovalEfficiency {
  totalApprovals: number
  approvedCount: number
  rejectedCount: number
  pendingCount: number
  inProgressCount: number
  approvalRate: number
  rejectionRate: number
  avgProcessingTime: number
  avgApproverTime: { level: number; approverName: string; avgTime: number }[]
}

// 审批趋势数据
export interface ApprovalTrend {
  byMonth: { month: string; count: number; avgTime: number }[]
  byDepartment: { department: string; count: number; approved: number; rejected: number }[]
  byStatus: { status: string; count: number }[]
  byApprover: { approver: string; count: number; avgTime: number }[]
}

// 获取审批效率指标
export async function getApprovalEfficiency(
  startDate?: string,
  endDate?: string,
  department?: string,
): Promise<ApprovalEfficiency> {
  try {
    // 在实际应用中，这里应该从API获取数据
    // 这里使用模拟数据
    const approvals = await getApprovalRecords(startDate, endDate, department)

    const totalApprovals = approvals.length
    const approvedCount = approvals.filter((a) => a.status === "approved").length
    const rejectedCount = approvals.filter((a) => a.status === "rejected").length
    const pendingCount = approvals.filter((a) => a.status === "pending").length
    const inProgressCount = approvals.filter((a) => a.status === "in_progress").length

    // 计算审批率
    const approvalRate = totalApprovals > 0 ? (approvedCount / totalApprovals) * 100 : 0
    const rejectionRate = totalApprovals > 0 ? (rejectedCount / totalApprovals) * 100 : 0

    // 计算平均处理时间
    const completedApprovals = approvals.filter((a) => a.processingTime !== null)
    const avgProcessingTime =
      completedApprovals.length > 0
        ? completedApprovals.reduce((sum, a) => sum + (a.processingTime || 0), 0) / completedApprovals.length
        : 0

    // 计算各级审批人的平均处理时间
    const approverTimeMap = new Map<string, { count: number; totalTime: number; level: number }>()

    approvals.forEach((approval) => {
      approval.approvalChain.forEach((step) => {
        if (step.processingTime !== null) {
          const key = `${step.level}-${step.approverName}`
          if (!approverTimeMap.has(key)) {
            approverTimeMap.set(key, { count: 0, totalTime: 0, level: step.level })
          }
          const data = approverTimeMap.get(key)!
          data.count++
          data.totalTime += step.processingTime || 0
        }
      })
    })

    const avgApproverTime = Array.from(approverTimeMap.entries()).map(([key, data]) => ({
      level: data.level,
      approverName: key.split("-")[1],
      avgTime: data.count > 0 ? data.totalTime / data.count : 0,
    }))

    return {
      totalApprovals,
      approvedCount,
      rejectedCount,
      pendingCount,
      inProgressCount,
      approvalRate,
      rejectionRate,
      avgProcessingTime,
      avgApproverTime,
    }
  } catch (error) {
    console.error("获取审批效率指标失败:", error)
    throw new Error("获取审批效率指标失败")
  }
}

// 获取审批趋势数据
export async function getApprovalTrend(months = 6, department?: string): Promise<ApprovalTrend> {
  try {
    // 在实际应用中，这里应该从API获取数据
    // 这里使用模拟数据
    const endDate = new Date()
    const startDate = subMonths(endDate, months)
    const approvals = await getApprovalRecords(
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd"),
      department,
    )

    // 按月统计
    const monthMap = new Map<string, { count: number; totalTime: number }>()
    for (let i = 0; i <= months; i++) {
      const date = subMonths(endDate, i)
      const monthKey = format(date, "yyyy-MM")
      monthMap.set(monthKey, { count: 0, totalTime: 0 })
    }

    approvals.forEach((approval) => {
      const monthKey = approval.month
      if (monthMap.has(monthKey)) {
        const data = monthMap.get(monthKey)!
        data.count++
        if (approval.processingTime !== null) {
          data.totalTime += approval.processingTime
        }
      }
    })

    const byMonth = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        count: data.count,
        avgTime: data.count > 0 ? data.totalTime / data.count : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // 按部门统计
    const departmentMap = new Map<string, { count: number; approved: number; rejected: number }>()

    approvals.forEach((approval) => {
      if (!departmentMap.has(approval.department)) {
        departmentMap.set(approval.department, { count: 0, approved: 0, rejected: 0 })
      }
      const data = departmentMap.get(approval.department)!
      data.count++
      if (approval.status === "approved") {
        data.approved++
      } else if (approval.status === "rejected") {
        data.rejected++
      }
    })

    const byDepartment = Array.from(departmentMap.entries()).map(([department, data]) => ({
      department,
      count: data.count,
      approved: data.approved,
      rejected: data.rejected,
    }))

    // 按状态统计
    const statusMap = new Map<string, number>()
    statusMap.set("已通过", 0)
    statusMap.set("已拒绝", 0)
    statusMap.set("审批中", 0)
    statusMap.set("待审批", 0)

    approvals.forEach((approval) => {
      if (approval.status === "approved") {
        statusMap.set("已通过", statusMap.get("已通过")! + 1)
      } else if (approval.status === "rejected") {
        statusMap.set("已拒绝", statusMap.get("已拒绝")! + 1)
      } else if (approval.status === "in_progress") {
        statusMap.set("审批中", statusMap.get("审批中")! + 1)
      } else if (approval.status === "pending") {
        statusMap.set("待审批", statusMap.get("待审批")! + 1)
      }
    })

    const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }))

    // 按审批人统计
    const approverMap = new Map<string, { count: number; totalTime: number }>()

    approvals.forEach((approval) => {
      approval.approvalChain.forEach((step) => {
        if (step.status === "approved" || step.status === "rejected") {
          if (!approverMap.has(step.approverName)) {
            approverMap.set(step.approverName, { count: 0, totalTime: 0 })
          }
          const data = approverMap.get(step.approverName)!
          data.count++
          if (step.processingTime !== null) {
            data.totalTime += step.processingTime
          }
        }
      })
    })

    const byApprover = Array.from(approverMap.entries()).map(([approver, data]) => ({
      approver,
      count: data.count,
      avgTime: data.count > 0 ? data.totalTime / data.count : 0,
    }))

    return {
      byMonth,
      byDepartment,
      byStatus,
      byApprover,
    }
  } catch (error) {
    console.error("获取审批趋势数据失败:", error)
    throw new Error("获取审批趋势数据失败")
  }
}

// 获取审批记录
export async function getApprovalRecords(
  startDate?: string,
  endDate?: string,
  department?: string,
): Promise<ApprovalRecord[]> {
  try {
    // 在实际应用中，这里应该从API获取数据
    // 这里使用模拟数据
    const records = generateMockApprovalRecords()

    // 筛选
    return records.filter((record) => {
      // 按日期筛选
      if (startDate && record.createdAt < startDate) {
        return false
      }
      if (endDate && record.createdAt > endDate) {
        return false
      }
      // 按部门筛选
      if (department && department !== "all" && record.department !== department) {
        return false
      }
      return true
    })
  } catch (error) {
    console.error("获取审批记录失败:", error)
    throw new Error("获取审批记录失败")
  }
}

// 生成模拟数据
function generateMockApprovalRecords(): ApprovalRecord[] {
  const departments = ["技术部", "人力资源部", "财务部", "市场部", "销售部"]
  const positions = ["经理", "主管", "专员", "助理"]
  const approvers = [
    { id: "user1", name: "王经理" },
    { id: "user2", name: "李主管" },
    { id: "user3", name: "张总监" },
    { id: "user4", name: "赵经理" },
  ]
  const statuses = ["pending", "approved", "rejected", "in_progress"] as const

  const records: ApprovalRecord[] = []

  // 生成过去12个月的数据
  for (let i = 0; i < 12; i++) {
    const month = format(subMonths(new Date(), i), "yyyy-MM")

    // 每月生成10-30条记录
    const recordCount = 10 + Math.floor(Math.random() * 20)

    for (let j = 0; j < recordCount; j++) {
      const department = departments[Math.floor(Math.random() * departments.length)]
      const position = positions[Math.floor(Math.random() * positions.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      // 创建基本记录
      const createdAt = format(subMonths(new Date(), i + Math.random()), "yyyy-MM-dd'T'HH:mm:ss'Z'")
      let updatedAt = createdAt
      let completedAt: string | null = null

      // 创建审批链
      const approvalChain = []
      const chainLength = 1 + Math.floor(Math.random() * 3) // 1-3级审批

      for (let k = 0; k < chainLength; k++) {
        const approver = approvers[Math.floor(Math.random() * approvers.length)]
        let stepStatus: "pending" | "approved" | "rejected" | null = null
        let startTime: string | null = null
        let endTime: string | null = null
        let processingTime: number | null = null

        // 根据记录状态设置审批链状态
        if (status === "approved") {
          stepStatus = "approved"
          startTime = createdAt
          // 每级审批耗时4-48小时
          const processingHours = 4 + Math.floor(Math.random() * 44)
          const endDate = new Date(parseISO(createdAt).getTime() + processingHours * 60 * 60 * 1000)
          endTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
          processingTime = processingHours
          updatedAt = endTime
          completedAt = endTime
        } else if (status === "rejected") {
          if (k === 0 || Math.random() > 0.7) {
            stepStatus = "rejected"
            startTime = createdAt
            const processingHours = 4 + Math.floor(Math.random() * 44)
            const endDate = new Date(parseISO(createdAt).getTime() + processingHours * 60 * 60 * 1000)
            endTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
            processingTime = processingHours
            updatedAt = endTime
            completedAt = endTime
          } else {
            stepStatus = "approved"
            startTime = createdAt
            const processingHours = 4 + Math.floor(Math.random() * 44)
            const endDate = new Date(parseISO(createdAt).getTime() + processingHours * 60 * 60 * 1000)
            endTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
            processingTime = processingHours
          }
        } else if (status === "in_progress") {
          if (k < Math.ceil(chainLength / 2)) {
            stepStatus = "approved"
            startTime = createdAt
            const processingHours = 4 + Math.floor(Math.random() * 44)
            const endDate = new Date(parseISO(createdAt).getTime() + processingHours * 60 * 60 * 1000)
            endTime = format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
            processingTime = processingHours
            updatedAt = endTime
          } else if (k === Math.ceil(chainLength / 2)) {
            stepStatus = "pending"
            startTime = updatedAt
            endTime = null
            processingTime = null
          } else {
            stepStatus = null
            startTime = null
            endTime = null
            processingTime = null
          }
        } else {
          // pending
          if (k === 0) {
            stepStatus = "pending"
            startTime = createdAt
            endTime = null
            processingTime = null
          } else {
            stepStatus = null
            startTime = null
            endTime = null
            processingTime = null
          }
        }

        approvalChain.push({
          id: k + 1,
          level: k + 1,
          approverId: approver.id,
          approverName: approver.name,
          status: stepStatus,
          startTime,
          endTime,
          processingTime,
        })
      }

      // 计算总处理时间
      let processingTime: number | null = null
      if (completedAt) {
        processingTime = differenceInHours(parseISO(completedAt), parseISO(createdAt))
      }

      // 创建完整记录
      records.push({
        id: `SA-${month}-${j.toString().padStart(3, "0")}`,
        employeeId: `EMP${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        employeeName: `员工${Math.floor(Math.random() * 100)}`,
        department,
        position,
        month,
        totalSalary: 5000 + Math.floor(Math.random() * 15000),
        status,
        createdAt,
        updatedAt,
        completedAt,
        approvalChain,
        processingTime,
      })
    }
  }

  return records
}

// 获取部门列表
export async function getDepartments(): Promise<string[]> {
  try {
    const records = await getApprovalRecords()
    const departments = new Set<string>()

    records.forEach((record) => {
      departments.add(record.department)
    })

    return Array.from(departments).sort()
  } catch (error) {
    console.error("获取部门列表失败:", error)
    throw new Error("获取部门列表失败")
  }
}
