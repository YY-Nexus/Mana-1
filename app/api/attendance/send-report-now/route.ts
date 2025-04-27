import { type NextRequest, NextResponse } from "next/server"
import { sendReportNow } from "@/lib/report-export-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, subject, reportType, exportOptions } = body

    // 验证必要参数
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, message: "收件人列表不能为空" }, { status: 400 })
    }

    if (!subject) {
      return NextResponse.json({ success: false, message: "邮件主题不能为空" }, { status: 400 })
    }

    // 立即发送报表
    const result = await sendReportNow({
      recipients,
      subject,
      reportType: reportType || "考勤报表",
      exportOptions: {
        format: exportOptions?.format || "excel",
        includeSummary: exportOptions?.includeSummary !== false,
        includeDetails: exportOptions?.includeDetails !== false,
        includeCharts: exportOptions?.includeCharts !== false,
      },
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("发送报表失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "发送报表时发生未知错误",
      },
      { status: 500 },
    )
  }
}
