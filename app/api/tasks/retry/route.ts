import { type NextRequest, NextResponse } from "next/server"
import { retryFailedTask } from "@/lib/task-queue"
import { broadcastTaskAdded } from "@/lib/websocket-service"

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json()

    if (!taskId) {
      return NextResponse.json({ error: "缺少任务ID" }, { status: 400 })
    }

    await retryFailedTask(taskId)

    // 广播任务添加事件
    broadcastTaskAdded(taskId, "retry")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("重试任务失败:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "重试任务失败" }, { status: 500 })
  }
}
