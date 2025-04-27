import { NextResponse } from "next/server"
import { isServer } from "@/lib/node-polyfills"

export async function GET() {
  try {
    // 确保这个API路由只在服务器端运行
    if (!isServer) {
      throw new Error("此API只能在服务器端运行")
    }

    // 动态导入依赖检查器，避免在构建时打包Node.js模块
    const { checkProjectDependencies } = await import("@/tools/dependency-checker/core")
    const projectRoot = process.cwd()
    const result = await checkProjectDependencies(projectRoot)

    return NextResponse.json(result)
  } catch (error) {
    console.error("依赖检查失败:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        success: false,
        // 返回模拟数据
        scannedFiles: 0,
        totalImports: 0,
        unresolvedImports: [],
        resolvedImports: [],
        summary: {
          totalFiles: 0,
          totalImports: 0,
          unresolvedCount: 0,
          resolvedCount: 0,
        },
      },
      { status: 500 },
    )
  }
}
