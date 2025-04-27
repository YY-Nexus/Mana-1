import { NextResponse } from "next/server"
import { executeAllPendingTasks } from "@/lib/scheduler"
import { handleApiError } from "@/lib/error-handler"

// 此API路由由Vercel Cron Jobs或类似服务定期调用
export async function GET() {
  try {
    // 执行所有待执行的任务
    const result = await executeAllPendingTasks()

    return NextResponse.json({
      success: true,
      message: `成功执行了 ${result.succeeded} 个定时任务，失败 ${result.failed} 个`,
      tasksExecuted: result.total,
      succeeded: result.succeeded,
      failed: result.failed,
      errors: result.errors,
    })
  } catch (error) {
    const errorResponse = handleApiError(error, "执行定时任务失败")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}
