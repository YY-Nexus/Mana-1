import { NextResponse } from "next/server"
import { processTaskQueue, getQueueLength } from "@/lib/task-queue"
import { handleApiError } from "@/lib/error-handler"

export async function POST() {
  try {
    const beforeCount = await getQueueLength()
    const processedCount = await processTaskQueue()
    const afterCount = await getQueueLength()

    return NextResponse.json({
      success: true,
      message: `成功处理了 ${processedCount} 个任务`,
      beforeCount,
      afterCount,
      processedCount,
    })
  } catch (error) {
    const errorResponse = handleApiError(error, "处理任务队列失败")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}
