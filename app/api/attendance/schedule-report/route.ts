import { type NextRequest, NextResponse } from "next/server"
import { scheduleReportEmail } from "@/lib/report-export-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, subject, reportType, exportOptions, scheduleOptions } = body

    // 验证必要参数
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, message: "收件人列表不能为空" }, { status: 400 })
    }

    if (!subject) {
      return NextResponse.json({ success: false, message: "邮件主题不能为空" }, { status: 400 })
    }

    if (!scheduleOptions || !scheduleOptions.frequency || !scheduleOptions.time) {
      return NextResponse.json({ success: false, message: "定时设置不完整" }, { status: 400 })
    }

    // 创建定时任务
    const result = await scheduleReportEmail({
      recipients,
      subject,
      reportType: reportType || "考勤报表",
      exportOptions: {
        format: exportOptions?.format || "excel",
        includeSummary: exportOptions?.includeSummary !== false,
        includeDetails: exportOptions?.includeDetails !== false,
        includeCharts: exportOptions?.includeCharts !== false,
      },
      scheduleOptions,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      taskId: result.taskId,
    })
  } catch (error) {
    console.error("创建定时任务失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "创建定时任务时发生未知错误",
      },
      { status: 500 },
    )
  }
}
