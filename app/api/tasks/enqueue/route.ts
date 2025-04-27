import { NextResponse } from "next/server"
import { enqueueTask } from "@/lib/task-queue"
import { handleApiError } from "@/lib/error-handler"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, payload, priority } = body

    if (!type || !payload) {
      return NextResponse.json({ success: false, message: "缺少必要参数" }, { status: 400 })
    }

    const taskId = await enqueueTask(type, payload, priority)

    return NextResponse.json({
      success: true,
      message: "任务已添加到队列",
      taskId,
    })
  } catch (error) {
    const errorResponse = handleApiError(error, "添加任务到队列失败")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}
