import { type NextRequest, NextResponse } from "next/server"
import { getTaskExecutionLogs } from "@/lib/task-queue"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || undefined
    const status = searchParams.getAll("status") || undefined

    // 获取所有日志
    const logs = await getTaskExecutionLogs({ limit: 1000, search, status })

    // 生成CSV内容
    const headers = ["任务ID", "任务类型", "状态", "消息", "执行时间", "持续时间(毫秒)"]
    const rows = logs.map((log) => [
      log.taskId,
      log.taskType,
      log.status,
      log.message.replace(/"/g, '""'), // 转义双引号
      new Date(log.executedAt).toLocaleString("zh-CN"),
      log.duration?.toString() || "",
    ])

    // 添加BOM以确保Excel正确识别UTF-8
    let csv = "\uFEFF"

    // 添加标题行
    csv += headers.map((header) => `"${header}"`).join(",") + "\r\n"

    // 添加数据行
    csv += rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\r\n")

    // 设置文件名
    const date = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)
    const filename = `task-logs-${date}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("下载任务执行日志失败:", error)
    return NextResponse.json({ error: "下载任务执行日志失败" }, { status: 500 })
  }
}
