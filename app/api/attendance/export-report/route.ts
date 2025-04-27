import { type NextRequest, NextResponse } from "next/server"
import { exportAttendanceReport } from "@/lib/report-export-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, dateRange, department, includeSummary, includeDetails, includeCharts } = body

    // 验证必要参数
    if (!format || (format !== "pdf" && format !== "excel")) {
      return NextResponse.json({ success: false, message: "无效的导出格式" }, { status: 400 })
    }

    // 导出报表
    const result = await exportAttendanceReport({
      format,
      dateRange,
      department,
      includeSummary: includeSummary !== false,
      includeDetails: includeDetails !== false,
      includeCharts: includeCharts !== false,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }

    // 设置响应头
    const headers = new Headers()
    headers.set("Content-Disposition", `attachment; filename="${result.filename}"`)
    headers.set(
      "Content-Type",
      format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )

    // 返回文件
    return new NextResponse(result.data as Blob, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("导出报表失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "导出报表时发生未知错误",
      },
      { status: 500 },
    )
  }
}
