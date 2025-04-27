import { NextResponse } from "next/server"
import { getTaskQueueLength } from "@/lib/task-queue"

export async function GET() {
  try {
    const length = await getTaskQueueLength()
    return NextResponse.json({ length })
  } catch (error) {
    console.error("获取队列长度失败:", error)
    return NextResponse.json({ error: "获取队列长度失败" }, { status: 500 })
  }
}
