import { NextResponse } from "next/server"
import { checkProjectDependencies } from "../../../../tools/dependency-checker/core"

export async function GET() {
  try {
    // 获取项目根目录
    const projectRoot = process.cwd()

    // 运行依赖检查
    const result = await checkProjectDependencies(projectRoot)

    // 返回结果
    return NextResponse.json(result)
  } catch (error) {
    console.error("依赖检查API错误:", error)
    return NextResponse.json({ error: `依赖检查失败: ${(error as Error).message}` }, { status: 500 })
  }
}
