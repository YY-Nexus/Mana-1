// 根据环境导入不同的模块
import { isServer } from "@/lib/node-polyfills"

// 条件导入，只在服务器端导入实际的Node.js模块
const fs = isServer ? require("fs/promises") : require("@/lib/node-polyfills").fs.promises
const path = isServer ? require("path") : require("@/lib/node-polyfills").path
// 使用动态导入来避免webpack打包时的问题
const getGlob = async () => {
  if (isServer) {
    return (await import("glob")).glob
  }
  return () => Promise.resolve([])
}

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
 * 扫描文件中的导入语句
 * @param filePath 文件路径
 * @param projectRoot 项目根目录
 * @returns 依赖项数组
 */
export async function scanFileImports(filePath: string, projectRoot: string): Promise<Dependency[]> {
  // 在客户端环境中返回空数组
  if (!isServer) {
    console.warn("scanFileImports is not supported in browser environment")
    return []
  }

  try {
    const content = await fs.readFile(filePath, "utf-8")
    const lines = content.split("\n")
    const dependencies: Dependency[] = []

    // 正则表达式匹配不同类型的导入
    const importRegex = /import\s+(?:(?:{[^}]*}|\*\s+as\s+[^;]+)\s+from\s+)?['"]([^'"]+)['"]/g
    const requireRegex = /(?:const|let|var)\s+[^=]+=\s+require$$['"]([^'"]+)['"]$$/g
    const dynamicImportRegex = /import$$['"]([^'"]+)['"]$$/g

    // 检查每一行的导入语句
    lines.forEach((line, index) => {
      // 检查 import 语句
      let match
      while ((match = importRegex.exec(line)) !== null) {
        dependencies.push({
          source: filePath,
          line: index + 1,
          importPath: match[1],
          importType: "import",
          isResolvable: false,
        })
      }

      // 检查 require 语句
      importRegex.lastIndex = 0 // 重置正则表达式
      while ((match = requireRegex.exec(line)) !== null) {
        dependencies.push({
          source: filePath,
          line: index + 1,
          importPath: match[1],
          importType: "require",
          isResolvable: false,
        })
      }

      // 检查动态导入语句
      requireRegex.lastIndex = 0 // 重置正则表达式
      while ((match = dynamicImportRegex.exec(line)) !== null) {
        dependencies.push({
          source: filePath,
          line: index + 1,
          importPath: match[1],
          importType: "dynamic",
          isResolvable: false,
        })
      }
    })

    // 检查每个依赖是否可解析
    for (const dep of dependencies) {
      try {
        // 检查是否为相对路径
        if (dep.importPath.startsWith("./") || dep.importPath.startsWith("../")) {
          // 相对于当前文件的路径
          const resolvedPath = path.resolve(path.dirname(filePath), dep.importPath)

          // 尝试不同的扩展名
          const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"]
          let exists = false

          // 检查文件是否存在（带扩展名）
          if (path.extname(resolvedPath)) {
            try {
              await fs.access(resolvedPath)
              exists = true
            } catch {
              exists = false
            }
          }

          // 检查文件是否存在（不带扩展名，尝试添加扩展名）
          if (!exists && !path.extname(resolvedPath)) {
            for (const ext of extensions) {
              try {
                await fs.access(`${resolvedPath}${ext}`)
                exists = true
                break
              } catch {
                // 继续尝试下一个扩展名
              }
            }

            // 检查是否为目录，如果是目录，检查是否有index文件
            if (!exists) {
              try {
                const stats = await fs.stat(resolvedPath)
                if (stats.isDirectory()) {
                  for (const ext of extensions) {
                    try {
                      await fs.access(path.join(resolvedPath, `index${ext}`))
                      exists = true
                      break
                    } catch {
                      // 继续尝试下一个扩展名
                    }
                  }
                }
              } catch {
                // 如果目录不存在，继续
              }
            }
          }

          dep.isResolvable = exists
          if (!exists) {
            dep.error = `无法解析相对路径模块: ${dep.importPath}`
          }
        } else if (dep.importPath.startsWith("@/")) {
          // 处理 @/ 别名
          const aliasPath = dep.importPath.replace("@/", "")
          const resolvedPath = path.join(projectRoot, aliasPath)

          // 尝试不同的扩展名
          const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"]
          let exists = false

          // 检查文件是否存在（带扩展名）
          if (path.extname(resolvedPath)) {
            try {
              await fs.access(resolvedPath)
              exists = true
            } catch {
              exists = false
            }
          }

          // 检查文件是否存在（不带扩展名，尝试添加扩展名）
          if (!exists && !path.extname(resolvedPath)) {
            for (const ext of extensions) {
              try {
                await fs.access(`${resolvedPath}${ext}`)
                exists = true
                break
              } catch {
                // 继续尝试下一个扩展名
              }
            }

            // 检查是否为目录，如果是目录，检查是否有index文件
            if (!exists) {
              try {
                const stats = await fs.stat(resolvedPath)
                if (stats.isDirectory()) {
                  for (const ext of extensions) {
                    try {
                      await fs.access(path.join(resolvedPath, `index${ext}`))
                      exists = true
                      break
                    } catch {
                      // 继续尝试下一个扩展名
                    }
                  }
                }
              } catch {
                // 如果目录不存在，继续
              }
            }
          }

          dep.isResolvable = exists
          if (!exists) {
            dep.error = `无法解析别名路径模块: ${dep.importPath}`
          }
        } else {
          // 处理 node_modules 中的模块
          // 这里简单地假设所有非相对路径和非别名路径的导入都是 node_modules 中的模块
          // 在实际应用中，可能需要更复杂的逻辑来检查这些模块是否存在
          dep.isResolvable = true

          // 检查一些已知不存在的模块
          const knownMissingModules = ["@v0/lib/sanitize"]
          if (knownMissingModules.includes(dep.importPath)) {
            dep.isResolvable = false
            dep.error = `已知不存在的模块: ${dep.importPath}`
          }
        }
      } catch (error) {
        dep.isResolvable = false
        dep.error = `解析错误: ${(error as Error).message}`
      }
    }

    return dependencies
  } catch (error) {
    console.error(`扫描文件 ${filePath} 时出错:`, error)
    return []
  }
}

/**
 * 扫描项目中的所有文件并检查依赖
 * @param projectRoot 项目根目录
 * @returns 检查结果
 */
export async function checkProjectDependencies(projectRoot: string): Promise<CheckResult> {
  // 在客户端环境中返回模拟数据
  if (!isServer) {
    console.warn("checkProjectDependencies is not supported in browser environment")
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

  try {
    // 获取glob函数
    const glob = await getGlob()

    // 获取所有 TypeScript 和 JavaScript 文件
    const files = await glob("**/*.{ts,tsx,js,jsx}", {
      cwd: projectRoot,
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/tools/**", "**/.next/**"],
    })

    let allDependencies: Dependency[] = []
    let scannedFiles = 0

    // 扫描每个文件的导入
    for (const file of files) {
      const filePath = path.join(projectRoot, file)
      const dependencies = await scanFileImports(filePath, projectRoot)
      allDependencies = [...allDependencies, ...dependencies]
      scannedFiles++
    }

    // 分离可解析和不可解析的导入
    const unresolvedImports = allDependencies.filter((dep) => !dep.isResolvable)
    const resolvedImports = allDependencies.filter((dep) => dep.isResolvable)

    return {
      scannedFiles,
      totalImports: allDependencies.length,
      unresolvedImports,
      resolvedImports,
      summary: {
        totalFiles: scannedFiles,
        totalImports: allDependencies.length,
        unresolvedCount: unresolvedImports.length,
        resolvedCount: resolvedImports.length,
      },
    }
  } catch (error) {
    console.error("检查项目依赖时出错:", error)
    throw error
  }
}
