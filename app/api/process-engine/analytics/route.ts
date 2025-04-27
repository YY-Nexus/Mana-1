import { type NextRequest, NextResponse } from "next/server"
import { getTaskAnalytics } from "@/lib/task-queue"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeRange = (searchParams.get("timeRange") as "day" | "week" | "month") || "week"

    const analytics = await getTaskAnalytics(timeRange)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("获取任务分析数据失败:", error)
    return NextResponse.json({ error: "获取任务分析数据失败" }, { status: 500 })
  }
}
