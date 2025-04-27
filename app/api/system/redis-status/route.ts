import { NextResponse } from "next/server"
import { getRedisStatus } from "@/lib/redis"

export async function GET() {
  try {
    const status = await getRedisStatus()

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("获取Redis状态失败:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
