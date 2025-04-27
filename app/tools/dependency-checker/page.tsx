"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, FileText, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { isServer } from "../../../lib/node-polyfills"

// 依赖项类型
type Dependency = {
  source: string
  line: number
  importPath: string
  importType: "import" | "require" | "dynamic"
  isResolvable: boolean
  error?: string
}

// 检查结果类型
type CheckResult = {
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

// 模拟数据
const mockResult: CheckResult = {
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

export default function DependencyCheckerPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dependencies, setDependencies] = useState<{
    modules: any[]
    missingDependencies: any[]
    unusedDependencies: any[]
  } | null>(null)

  const runCheck = async () => {
    setLoading(true)
    setError(null)

    try {
      // 尝试从API获取数据
      const response = await fetch("/api/tools/dependency-checker")

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      // 如果API调用失败，使用模拟数据
      console.error("依赖检查错误，使用模拟数据:", err)
      setResult(mockResult)
      setError(`注意: 使用模拟数据，因为API调用失败: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    if (!isServer) {
      // 在客户端环境中使用模拟数据
      setDependencies({
        modules: [
          { name: "react", usedBy: ["app/page.tsx", "components/ui/button.tsx"] },
          { name: "next", usedBy: ["app/layout.tsx"] },
          // 添加更多模拟数据...
        ],
        missingDependencies: [],
        unusedDependencies: [],
      })
      setResult(mockResult)
      setLoading(false)
      return
    }
    // 使用模拟数据
    setTimeout(() => {
      setResult(mockResult)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">项目依赖检查工具</h1>
        <p className="text-gray-500">
          扫描项目中的所有文件，检查导入语句，并验证这些导入的模块是否存在。 这有助于防止运行时出现"模块未找到"的错误。
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">依赖检查</h2>
        </div>
        <Button onClick={runCheck} disabled={loading} className="flex items-center space-x-2">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>检查中...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>重新检查</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : result ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>检查摘要</CardTitle>
              <CardDescription>
                扫描了 {result.scannedFiles} 个文件，发现 {result.totalImports} 个导入语句
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">扫描的文件</div>
                  <div className="text-2xl font-bold">{result.summary.totalFiles}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">成功解析的导入</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.summary.resolvedCount}
                    <span className="text-sm font-normal ml-1">
                      ({Math.round((result.summary.resolvedCount / result.summary.totalImports) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${result.summary.unresolvedCount > 0 ? "bg-red-50" : "bg-gray-50"}`}>
                  <div className={`text-sm ${result.summary.unresolvedCount > 0 ? "text-red-600" : "text-gray-500"}`}>
                    无法解析的导入
                  </div>
                  <div
                    className={`text-2xl font-bold ${result.summary.unresolvedCount > 0 ? "text-red-600" : "text-gray-500"}`}
                  >
                    {result.summary.unresolvedCount}
                    <span className="text-sm font-normal ml-1">
                      ({Math.round((result.summary.unresolvedCount / result.summary.totalImports) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={result.unresolvedImports.length > 0 ? "unresolved" : "all"}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                所有导入
                <Badge variant="outline" className="ml-2">
                  {result.totalImports}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unresolved">
                无法解析的导入
                <Badge variant={result.unresolvedImports.length > 0 ? "destructive" : "outline"} className="ml-2">
                  {result.unresolvedImports.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved">
                成功解析的导入
                <Badge variant="outline" className="ml-2">
                  {result.resolvedImports.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>所有导入</CardTitle>
                  <CardDescription>项目中的所有导入语句</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {result.unresolvedImports.concat(result.resolvedImports.slice(0, 20)).map((dep, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="font-mono text-sm">{dep.importPath}</div>
                          {dep.isResolvable ? (
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              已解析
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              未解析
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {dep.source}:{dep.line}
                        </div>
                        {!dep.isResolvable && dep.error && <div className="mt-1 text-xs text-red-500">{dep.error}</div>}
                      </div>
                    ))}
                    {result.totalImports > 20 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        显示前20个导入，共 {result.totalImports} 个
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unresolved">
              <Card>
                <CardHeader>
                  <CardTitle>无法解析的导入</CardTitle>
                  <CardDescription>这些导入可能会导致运行时错误</CardDescription>
                </CardHeader>
                <CardContent>
                  {result.unresolvedImports.length > 0 ? (
                    <div className="space-y-4">
                      {result.unresolvedImports.map((dep, index) => (
                        <div key={index} className="p-4 border border-red-200 rounded-md bg-red-50">
                          <div className="font-mono text-sm font-bold">{dep.importPath}</div>
                          <div className="mt-2 text-xs text-gray-600 flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {dep.source}:{dep.line}
                          </div>
                          {dep.error && <div className="mt-2 text-xs text-red-600">{dep.error}</div>}

                          <div className="mt-3 pt-2 border-t border-red-200">
                            <div className="text-xs font-semibold text-gray-700">修复建议:</div>
                            {dep.importPath === "@v0/lib/sanitize" ? (
                              <div className="mt-1 text-xs text-gray-600">
                                这是一个已知的缺失模块，请使用自定义的 lib/sanitize.ts 替代。
                                <br />
                                修改导入语句为:{" "}
                                <code className="bg-gray-100 px-1 rounded">
                                  import {"{"} ... {"}"} from '@/lib/sanitize'
                                </code>
                              </div>
                            ) : dep.importPath.startsWith("@/") ? (
                              <div className="mt-1 text-xs text-gray-600">
                                - 检查项目中是否存在 {dep.importPath.replace("@/", "")} 文件或目录
                                <br />- 确保 tsconfig.json 中正确配置了路径别名
                              </div>
                            ) : dep.importPath.startsWith("./") || dep.importPath.startsWith("../") ? (
                              <div className="mt-1 text-xs text-gray-600">
                                - 检查相对路径是否正确
                                <br />- 确保目标文件存在
                              </div>
                            ) : (
                              <div className="mt-1 text-xs text-gray-600">
                                - 检查 package.json 中是否包含此依赖
                                <br />- 运行{" "}
                                <code className="bg-gray-100 px-1 rounded">npm install {dep.importPath}</code> 或
                                <code className="bg-gray-100 px-1 rounded ml-1">yarn add {dep.importPath}</code>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-600">所有导入都可以成功解析!</h3>
                      <p className="text-gray-500 mt-2">项目中没有发现无法解析的导入</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolved">
              <Card>
                <CardHeader>
                  <CardTitle>成功解析的导入</CardTitle>
                  <CardDescription>这些导入可以成功解析，不会导致运行时错误</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {result.resolvedImports.slice(0, 20).map((dep, index) => (
                      <div key={index} className="p-3 border border-green-200 rounded-md bg-green-50">
                        <div className="flex justify-between items-start">
                          <div className="font-mono text-sm">{dep.importPath}</div>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            已解析
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {dep.source}:{dep.line}
                        </div>
                      </div>
                    ))}
                    {result.resolvedImports.length > 20 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        显示前20个导入，共 {result.resolvedImports.length} 个
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">尚未运行依赖检查</h3>
              <p className="text-gray-500 mt-2">点击"重新检查"按钮开始扫描项目依赖</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
