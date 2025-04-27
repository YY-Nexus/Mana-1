import { NextResponse } from "next/server"

// 模拟依赖检查结果
const mockDependencyCheckResult = {
  scannedFiles: 120,
  totalImports: 543,
  unresolvedImports: [
    {
      source: "/app/attendance/reports/page.tsx",
      line: 15,
      importPath: "@v0/lib/sanitize",
      importType: "import",
      isResolvable: false,
      error: "已知不存在的模块: @v0/lib/sanitize",
    },
    {
      source: "/components/attendance/report/attendance-report-table.tsx",
      line: 8,
      importPath: "@v0/lib/sanitize",
      importType: "import",
      isResolvable: false,
      error: "已知不存在的模块: @v0/lib/sanitize",
    },
  ],
  resolvedImports: Array(541)
    .fill(0)
    .map((_, i) => ({
      source: `/example/file${i % 30}.tsx`,
      line: Math.floor(Math.random() * 100) + 1,
      importPath: `@/components/example${i % 20}`,
      importType: Math.random() > 0.7 ? "import" : Math.random() > 0.5 ? "require" : "dynamic",
      isResolvable: true,
    })),
  summary: {
    totalFiles: 120,
    totalImports: 543,
    unresolvedCount: 2,
    resolvedCount: 541,
  },
}

export async function GET() {
  try {
    // 返回模拟数据，避免导入依赖检查器
    return NextResponse.json(mockDependencyCheckResult)
  } catch (error) {
    console.error("依赖检查API错误:", error)
    return NextResponse.json({ error: `依赖检查失败: ${(error as Error).message}` }, { status: 500 })
  }
}
