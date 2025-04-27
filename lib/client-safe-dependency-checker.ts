// 客户端安全版本的依赖检查器
// 不使用Node.js特有模块

// 依赖项类型
export type Dependency = {
  source: string
  line: number
  importPath: string
  importType: "import" | "require" | "dynamic"
  isResolvable: boolean
  error?: string
}

// 检查结果类型
export type CheckResult = {
  scannedFiles: number
  totalImports: number
  unresolvedImports: Dependency[]
  resolvedImports: Dependency[]
  summary: {
    totalFiles: number
    totalImports: number
    unresolvedCount: number
    resolvedCount: number
  }
}

/**
 * 从API获取依赖检查结果
 * 这个函数可以在客户端安全使用
 */
export async function getProjectDependencies(): Promise<CheckResult> {
  try {
    const response = await fetch("/api/tools/dependency-checker")

    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取依赖检查结果失败:", error)

    // 返回一个空的结果
    return {
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
    }
  }
}

/**
 * 模拟依赖检查
 * 当服务器API不可用时使用
 */
export function getMockDependencies(): CheckResult {
  return {
    scannedFiles: 120,
    totalImports: 450,
    unresolvedImports: [
      {
        source: "/app/components/example.tsx",
        line: 5,
        importPath: "./missing-module",
        importType: "import",
        isResolvable: false,
        error: "模块不存在",
      },
    ],
    resolvedImports: [],
    summary: {
      totalFiles: 120,
      totalImports: 450,
      unresolvedCount: 1,
      resolvedCount: 449,
    },
  }
}
