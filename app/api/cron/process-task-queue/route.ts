import { NextResponse } from "next/server"
import { processTaskQueue, getQueueLength } from "@/lib/task-queue"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    // 获取队列长度
    const beforeCount = await getQueueLength()

    // 处理队列中的任务
    const processedCount = await processTaskQueue(20) // 一次最多处理20个任务

    // 获取处理后的队列长度
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
