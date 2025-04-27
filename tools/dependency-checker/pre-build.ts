#!/usr/bin/env node
// 这个文件只能在Node.js环境中运行
// 不要在客户端代码中导入此文件
import path from "path"
import { checkProjectDependencies } from "./core"
import chalk from "chalk"

async function main() {
  try {
    console.log(chalk.blue("===== 构建前依赖检查 ====="))
    console.log(chalk.gray("正在扫描项目依赖..."))

    const projectRoot = process.cwd()
    const result = await checkProjectDependencies(projectRoot)

    console.log("\n" + chalk.green("✓ 扫描完成"))
    console.log(chalk.white(`扫描了 ${result.scannedFiles} 个文件，发现 ${result.totalImports} 个导入语句`))
    console.log(chalk.green(`✓ 成功解析: ${result.resolvedImports.length} 个导入`))

    if (result.unresolvedImports.length > 0) {
      console.log(chalk.red(`✗ 无法解析: ${result.unresolvedImports.length} 个导入`))
      console.log("\n" + chalk.yellow("以下导入无法解析:"))

      // 只显示前5个错误，避免输出过多
      const displayErrors = result.unresolvedImports.slice(0, 5)

      displayErrors.forEach((dep, index) => {
        const relativePath = path.relative(projectRoot, dep.source)
        console.log(chalk.red(`${index + 1}. ${dep.importPath}`))
        console.log(chalk.gray(`   文件: ${relativePath}:${dep.line}`))
        if (dep.error) {
          console.log(chalk.gray(`   错误: ${dep.error}`))
        }
        console.log("")
      })

      if (result.unresolvedImports.length > 5) {
        console.log(chalk.gray(`... 还有 ${result.unresolvedImports.length - 5} 个未解析的导入未显示`))
        console.log(chalk.gray('运行 "npm run check-deps" 查看完整列表'))
      }

      // 提供修复建议
      console.log(chalk.yellow("\n构建可能会失败，请修复上述问题后再次尝试构建"))
      console.log(chalk.yellow('您可以运行 "npm run check-deps" 获取更详细的信息和修复建议'))

      // 如果是CI环境，则退出构建
      if (process.env.CI === "true") {
        console.log(chalk.red("\n在CI环境中检测到依赖错误，构建失败"))
        process.exit(1)
      }

      // 在非CI环境中，询问用户是否继续构建
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      readline.question(chalk.yellow("\n是否继续构建? (y/N) "), (answer: string) => {
        readline.close()
        if (answer.toLowerCase() !== "y") {
          console.log(chalk.red("构建已取消"))
          process.exit(1)
        } else {
          console.log(chalk.yellow("继续构建，但可能会失败..."))
          process.exit(0)
        }
      })
    } else {
      console.log(chalk.green("\n✓ 所有导入都可以成功解析!"))
      console.log(chalk.green("构建可以安全进行"))
      process.exit(0)
    }
  } catch (error) {
    console.error(chalk.red("运行依赖检查时出错:"), error)

    // 在CI环境中，退出构建
    if (process.env.CI === "true") {
      process.exit(1)
    }

    // 在非CI环境中，询问用户是否继续构建
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    readline.question(chalk.yellow("\n依赖检查失败，是否继续构建? (y/N) "), (answer: string) => {
      readline.close()
      if (answer.toLowerCase() !== "y") {
        console.log(chalk.red("构建已取消"))
        process.exit(1)
      } else {
        console.log(chalk.yellow("继续构建，但可能会失败..."))
        process.exit(0)
      }
    })
  }
}

// 防止在导入时执行
if (require.main === module) {
  main()
}
