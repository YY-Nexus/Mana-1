import { type NextRequest, NextResponse } from "next/server"
import { getTaskPriorityDistribution } from "@/lib/task-queue"

export async function GET(request: NextRequest) {
  try {
    const distribution = await getTaskPriorityDistribution()

    return NextResponse.json(distribution)
  } catch (error) {
    console.error("获取任务优先级分布失败:", error)
    return NextResponse.json({ error: "获取任务优先级分布失败" }, { status: 500 })
  }
}
