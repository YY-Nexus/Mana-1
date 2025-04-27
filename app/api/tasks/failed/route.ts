import { type NextRequest, NextResponse } from "next/server"
import { getFailedTasks } from "@/lib/task-queue"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const failedTasks = await getFailedTasks(limit)

    return NextResponse.json(failedTasks)
  } catch (error) {
    console.error("获取失败任务列表失败:", error)
    return NextResponse.json({ error: "获取失败任务列表失败" }, { status: 500 })
  }
}
