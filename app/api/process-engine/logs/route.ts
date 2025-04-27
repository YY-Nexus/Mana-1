import { type NextRequest, NextResponse } from "next/server"
import { getTaskExecutionLogs } from "@/lib/task-queue"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "100", 10)
    const search = searchParams.get("search") || undefined
    const status = searchParams.getAll("status") || undefined

    const logs = await getTaskExecutionLogs({ limit, search, status })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("获取任务执行日志失败:", error)
    return NextResponse.json({ error: "获取任务执行日志失败" }, { status: 500 })
  }
}
