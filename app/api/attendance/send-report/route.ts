import { type NextRequest, NextResponse } from "next/server"
import { sendAttendanceReportEmail } from "@/lib/email-service"
import { exportAttendanceReport } from "@/lib/attendance"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, subject, reportDate, reportType, format, options } = body

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, message: "收件人列表不能为空" }, { status: 400 })
    }

    if (!subject) {
      return NextResponse.json({ success: false, message: "邮件主题不能为空" }, { status: 400 })
    }

    // 导出报表
    const exportResult = await exportAttendanceReport({
      format: format || "excel",
      options: options || { includeSummary: true, includeDetails: true, includeCharts: true },
    })

    if (!exportResult.success) {
      return NextResponse.json({ success: false, message: "导出报表失败" }, { status: 500 })
    }

    // 发送邮件
    const result = await sendAttendanceReportEmail({
      recipients,
      subject,
      reportDate: reportDate || new Date(),
      reportType: reportType || "考勤报表",
      attachments: [
        {
          filename: `考勤报表_${new Date().toISOString().split("T")[0]}.${format || "xlsx"}`,
          content: exportResult.data,
          encoding: "base64",
        },
      ],
      includeInBody: options?.includeSummary !== false,
    })

    return NextResponse.json({
      success: true,
      message: "报表邮件发送成功",
    })
  } catch (error) {
    console.error("发送报表邮件失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "发送报表邮件时发生未知错误",
      },
      { status: 500 },
    )
  }
}
