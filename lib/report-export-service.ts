import { jsPDF } from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { getAttendanceReportData } from "@/lib/attendance"
import { sendAttendanceReportEmail } from "@/lib/email-service"

// 报表导出选项类型
export interface ReportExportOptions {
  format: "pdf" | "excel"
  dateRange?: {
    from: Date
    to: Date
  }
  department?: string
  includeSummary: boolean
  includeDetails: boolean
  includeCharts: boolean
}

// 导出考勤报表
export async function exportAttendanceReport(options: ReportExportOptions): Promise<{
  success: boolean
  data?: string | Blob
  filename?: string
  message?: string
}> {
  try {
    // 获取考勤数据
    const reportData = getAttendanceReportData()

    // 根据格式导出
    if (options.format === "pdf") {
      return exportToPdf(reportData, options)
    } else {
      return exportToExcel(reportData, options)
    }
  } catch (error) {
    console.error("导出报表失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "导出报表时发生未知错误",
    }
  }
}

// 导出为PDF
async function exportToPdf(
  data: any[],
  options: ReportExportOptions,
): Promise<{
  success: boolean
  data?: Blob
  filename?: string
}> {
  // 创建PDF文档
  const doc = new jsPDF()

  // 添加标题
  doc.setFontSize(18)
  doc.text("考勤报表", 105, 15, { align: "center" })

  // 添加报表信息
  doc.setFontSize(12)
  const dateRangeText = options.dateRange
    ? `日期范围: ${format(options.dateRange.from, "yyyy-MM-dd", { locale: zhCN })} 至 ${format(options.dateRange.to, "yyyy-MM-dd", { locale: zhCN })}`
    : `生成日期: ${format(new Date(), "yyyy-MM-dd", { locale: zhCN })}`
  doc.text(dateRangeText, 14, 25)

  if (options.department) {
    doc.text(`部门: ${options.department}`, 14, 32)
  }

  // 如果包含摘要信息
  if (options.includeSummary) {
    doc.setFontSize(14)
    doc.text("考勤摘要", 14, 42)

    // 添加摘要表格
    const summaryData = [
      ["总人数", "50人"],
      ["出勤率", "92.5%"],
      ["准时率", "88.3%"],
      ["平均工作时长", "8.2小时"],
    ]

    // @ts-ignore - jspdf-autotable类型定义问题
    doc.autoTable({
      startY: 45,
      head: [["指标", "数值"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [66, 139, 202] },
    })
  }

  // 如果包含详细信息
  if (options.includeDetails) {
    doc.setFontSize(14)
    // @ts-ignore - jspdf-autotable类型定义问题
    doc.text("考勤详情", 14, doc.autoTable.previous.finalY + 10)

    // 准备表格数据
    const tableHeaders = [["工号", "姓名", "部门", "日期", "签到时间", "签退时间", "工作时长", "状态"]]
    const tableBody = data.map((item) => [
      item.employeeId,
      item.name,
      item.department,
      item.date,
      item.checkIn,
      item.checkOut,
      `${item.workHours}小时`,
      getStatusLabel(item.status),
    ])

    // @ts-ignore - jspdf-autotable类型定义问题
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: tableHeaders,
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [66, 139, 202] },
      styles: { overflow: "linebreak" },
      columnStyles: { 7: { halign: "center" } },
    })
  }

  // 添加页脚
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(`第 ${i} 页，共 ${pageCount} 页 | 言语『启智』运维管理中心`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    })
  }

  // 生成PDF文件
  const pdfBlob = doc.output("blob")

  // 生成文件名
  const filename = `考勤报表_${format(new Date(), "yyyyMMdd")}.pdf`

  return {
    success: true,
    data: pdfBlob,
    filename,
  }
}

// 导出为Excel
async function exportToExcel(
  data: any[],
  options: ReportExportOptions,
): Promise<{
  success: boolean
  data?: Blob
  filename?: string
}> {
  // 创建工作簿
  const wb = XLSX.utils.book_new()

  // 如果包含摘要信息
  if (options.includeSummary) {
    // 创建摘要工作表
    const summaryData = [
      ["考勤摘要", ""],
      ["生成日期", format(new Date(), "yyyy-MM-dd", { locale: zhCN })],
      [""],
      ["总人数", "50人"],
      ["出勤率", "92.5%"],
      ["准时率", "88.3%"],
      ["平均工作时长", "8.2小时"],
    ]

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, "考勤摘要")
  }

  // 如果包含详细信息
  if (options.includeDetails) {
    // 准备表格数据
    const tableHeaders = ["工号", "姓名", "部门", "日期", "签到时间", "签退时间", "工作时长", "状态", "备注"]
    const tableData = data.map((item) => [
      item.employeeId,
      item.name,
      item.department,
      item.date,
      item.checkIn,
      item.checkOut,
      item.workHours,
      getStatusLabel(item.status),
      item.notes,
    ])

    // 创建详情工作表
    const detailsWs = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData])
    XLSX.utils.book_append_sheet(wb, detailsWs, "考勤详情")
  }

  // 生成Excel文件
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  // 生成文件名
  const filename = `考勤报表_${format(new Date(), "yyyyMMdd")}.xlsx`

  return {
    success: true,
    data: excelBlob,
    filename,
  }
}

// 获取状态标签
function getStatusLabel(status: string): string {
  switch (status) {
    case "normal":
      return "正常"
    case "late":
      return "迟到"
    case "early":
      return "早退"
    case "absent":
      return "缺勤"
    case "overtime":
      return "加班"
    default:
      return status
  }
}

// 定时发送报表
export async function scheduleReportEmail({
  recipients,
  subject,
  reportType,
  exportOptions,
  scheduleOptions,
}: {
  recipients: string[]
  subject: string
  reportType: string
  exportOptions: ReportExportOptions
  scheduleOptions: {
    frequency: "daily" | "weekly" | "monthly"
    day?: string // 周几或每月几号
    time: string // HH:MM 格式
  }
}): Promise<{ success: boolean; message?: string; taskId?: number }> {
  try {
    // 计算下次执行时间
    const nextRun = calculateNextRunTime(scheduleOptions)

    // 创建定时任务
    const task = {
      name: subject,
      type: "report_email",
      frequency: scheduleOptions.frequency,
      day: scheduleOptions.day || "",
      time: scheduleOptions.time,
      recipients,
      format: exportOptions.format,
      options: {
        includeCharts: exportOptions.includeCharts,
        includeSummary: exportOptions.includeSummary,
        includeDetails: exportOptions.includeDetails,
      },
      lastRun: null,
      nextRun,
      status: "active" as const,
    }

    // 在实际应用中，这里应该调用数据库API保存任务
    // 这里为了演示，返回模拟数据
    console.log("创建定时任务:", task)

    return {
      success: true,
      message: `报表将于 ${format(nextRun, "yyyy-MM-dd HH:mm", { locale: zhCN })} 发送`,
      taskId: Math.floor(Math.random() * 1000) + 1,
    }
  } catch (error) {
    console.error("创建定时任务失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "创建定时任务时发生未知错误",
    }
  }
}

// 计算下次执行时间
function calculateNextRunTime(options: {
  frequency: "daily" | "weekly" | "monthly"
  day?: string
  time: string
}): Date {
  const now = new Date()
  const [hours, minutes] = options.time.split(":").map(Number)

  // 设置时间
  const nextRun = new Date(now)
  nextRun.setHours(hours, minutes, 0, 0)

  // 如果时间已过，设置为明天
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1)
  }

  // 根据频率调整日期
  if (options.frequency === "weekly" && options.day) {
    const targetDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(
      options.day.toLowerCase(),
    )

    if (targetDay >= 0) {
      const currentDay = nextRun.getDay()
      const daysToAdd = (targetDay - currentDay + 7) % 7

      if (daysToAdd > 0 || (daysToAdd === 0 && nextRun <= now)) {
        nextRun.setDate(nextRun.getDate() + daysToAdd)
      }
    }
  } else if (options.frequency === "monthly" && options.day) {
    const targetDay = Number.parseInt(options.day, 10)

    if (!isNaN(targetDay) && targetDay >= 1 && targetDay <= 31) {
      nextRun.setDate(targetDay)

      // 如果日期已过，设置为下个月
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1)
      }
    }
  }

  return nextRun
}

// 立即发送报表
export async function sendReportNow({
  recipients,
  subject,
  reportType,
  exportOptions,
}: {
  recipients: string[]
  subject: string
  reportType: string
  exportOptions: ReportExportOptions
}): Promise<{ success: boolean; message?: string }> {
  try {
    // 导出报表
    const exportResult = await exportAttendanceReport(exportOptions)

    if (!exportResult.success || !exportResult.data) {
      return {
        success: false,
        message: exportResult.message || "导出报表失败",
      }
    }

    // 将Blob转换为Base64
    const base64Data = await blobToBase64(exportResult.data as Blob)

    // 发送邮件
    const emailResult = await sendAttendanceReportEmail({
      recipients,
      subject,
      reportDate: new Date(),
      reportType,
      attachments: [
        {
          filename: exportResult.filename || `考勤报表.${exportOptions.format === "pdf" ? "pdf" : "xlsx"}`,
          content: base64Data.split(",")[1],
          encoding: "base64",
        },
      ],
      includeInBody: exportOptions.includeSummary,
    })

    return {
      success: emailResult.success,
      message: emailResult.success ? "报表已成功发送" : emailResult.message || "发送报表失败",
    }
  } catch (error) {
    console.error("发送报表失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "发送报表时发生未知错误",
    }
  }
}

// 将Blob转换为Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
