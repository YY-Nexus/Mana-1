import { NextResponse } from "next/server"
import { exportData, exportDataAsync } from "@/lib/export-service"
import { handleApiError } from "@/lib/error-handler"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, format, options, async, recipients, subject } = body

    if (!type || !format) {
      return NextResponse.json({ success: false, message: "缺少必要参数" }, { status: 400 })
    }

    // 异步导出
    if (async && recipients && recipients.length > 0) {
      const taskId = await exportDataAsync(
        type,
        format,
        options,
        Array.isArray(recipients) ? recipients : [recipients],
        subject || `${type}导出`,
      )

      return NextResponse.json({
        success: true,
        message: "导出任务已添加到队列",
        taskId,
      })
    }

    // 同步导出
    const result = await exportData(type, format, options)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    const errorResponse = handleApiError(error, "导出数据失败")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}
