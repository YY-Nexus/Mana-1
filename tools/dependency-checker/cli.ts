#!/usr/bin/env node
import path from "path"
import { checkProjectDependencies } from "./core"
import chalk from "chalk"

interface Dependency {
  importPath: string
  source: string
  line: number
  error?: string
}

async function main() {
  try {
    console.log(chalk.blue("===== 项目依赖检查工具 ====="))
    console.log(chalk.gray("正在扫描项目依赖..."))

    const projectRoot = process.cwd()
    const result = await checkProjectDependencies(projectRoot)

    console.log("\n" + chalk.green("✓ 扫描完成"))
    console.log(chalk.white(`扫描了 ${result.scannedFiles} 个文件，发现 ${result.totalImports} 个导入语句`))
    console.log(chalk.green(`✓ 成功解析: ${result.resolvedImports.length} 个导入`))

    if (result.unresolvedImports.length > 0) {
      console.log(chalk.red(`✗ 无法解析: ${result.unresolvedImports.length} 个导入`))
      console.log("\n" + chalk.yellow("以下导入无法解析:"))

      result.unresolvedImports.forEach((dep, index) => {
        const relativePath = path.relative(projectRoot, dep.source)
        console.log(chalk.red(`${index + 1}. ${dep.importPath}`))
        console.log(chalk.gray(`   文件: ${relativePath}:${dep.line}`))
        if (dep.error) {
          console.log(chalk.gray(`   错误: ${dep.error}`))
        }
        console.log("")
      })

      // 提供修复建议
      console.log(chalk.yellow("修复建议:"))
      const commonIssues = new Map<string, Dependency[]>()

      result.unresolvedImports.forEach((dep) => {
        if (!commonIssues.has(dep.importPath)) {
          commonIssues.set(dep.importPath, [])
        }
        commonIssues.get(dep.importPath)!.push(dep)
      })

      commonIssues.forEach((deps, importPath) => {
        console.log(chalk.yellow(`模块 "${importPath}" 在 ${deps.length} 个地方被引用但无法解析`))

        // 根据导入路径提供具体建议
        if (importPath.startsWith("@/")) {
          console.log(chalk.gray(`  - 检查项目中是否存在 ${importPath.replace("@/", "")} 文件或目录`))
          console.log(chalk.gray(`  - 确保 tsconfig.json 中正确配置了路径别名`))
        } else if (importPath.startsWith("./") || importPath.startsWith("../")) {
          console.log(chalk.gray(`  - 检查相对路径是否正确`))
          console.log(chalk.gray(`  - 确保目标文件存在`))
        } else if (importPath === "@v0/lib/sanitize") {
          console.log(chalk.gray(`  - 这是一个已知的缺失模块，请使用自定义的 lib/sanitize.ts 替代`))
          console.log(chalk.gray(`  - 修改导入语句为: import { ... } from '@/lib/sanitize'`))
        } else {
          console.log(chalk.gray(`  - 检查 package.json 中是否包含此依赖`))
          console.log(chalk.gray(`  - 运行 npm install ${importPath} 或 yarn add ${importPath}`))
        }

        console.log("")
      })

      process.exit(1)
    } else {
      console.log(chalk.green("\n✓ 所有导入都可以成功解析!"))
    }
  } catch (error) {
    console.error(chalk.red("运行依赖检查时出错:"), error)
    process.exit(1)
  }
}

main()
