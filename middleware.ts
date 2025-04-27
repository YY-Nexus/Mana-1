import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { incrementCounter } from "@/lib/redis"

// 速率限制中间件
export async function middleware(request: NextRequest) {
  // 仅对API路由应用速率限制
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  try {
    // 获取客户端IP
    const ip = request.ip || "127.0.0.1"

    // 创建Redis键
    const key = `ratelimit:${ip}:${request.nextUrl.pathname}`

    // 设置限制
    // 邮件发送API限制更严格
    const limit = request.nextUrl.pathname.includes("/send-report") ? 10 : 100
    const expiry = 60 * 60 // 1小时

    // 尝试增加计数并设置过期时间
    // 如果Redis不可用，不阻止请求继续
    try {
      const count = await incrementCounter(key, 1, expiry)

      // 检查是否超过限制
      if (count > limit) {
        return NextResponse.json({ success: false, message: "请求过于频繁，请稍后再试" }, { status: 429 })
      }

      // 添加速率限制信息到响应头
      const response = NextResponse.next()
      response.headers.set("X-RateLimit-Limit", String(limit))
      response.headers.set("X-RateLimit-Remaining", String(limit - count))
      return response
    } catch (error) {
      // Redis错误，记录日志但允许请求继续
      console.error("速率限制Redis错误:", error)
      return NextResponse.next()
    }
  } catch (error) {
    // 捕获任何其他错误，确保中间件不会阻止请求
    console.error("中间件错误:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/api/:path*"],
}
