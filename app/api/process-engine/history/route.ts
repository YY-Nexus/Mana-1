import { NextResponse } from "next/server"
import { getTaskHistory } from "@/lib/task-queue"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const history = await getTaskHistory(limit)
    return NextResponse.json({ history })
  } catch (error) {
    console.error("获取历史记录失败:", error)
    return NextResponse.json({ error: "获取历史记录失败" }, { status: 500 })
  }
}
