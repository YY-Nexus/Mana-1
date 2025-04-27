#!/usr/bin/env node
import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import chalk from "chalk"

/**
 * 构建调试工具
 * 用于帮助定位和解决构建过程中的错误
 */

// 检查是否有未闭合的JSX标签
function checkUnclosedTags() {
  console.log(chalk.blue("检查未闭合的JSX标签..."))

  const jsxFiles = findJsxFiles()
  let hasErrors = false

  for (const file of jsxFiles) {
    try {
      const content = fs.readFileSync(file, "utf-8")
      // 简单检查是否有未闭合的标签
      const openTags = content.match(/<[A-Z][a-zA-Z0-9]*(?=\s|>)/g) || []
      const closeTags = content.match(/<\/[A-Z][a-zA-Z0-9]*>/g) || []
      const selfClosingTags = content.match(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g) || []

      // 如果开标签数量不等于闭标签数量加自闭合标签数量，可能存在未闭合标签
      if (openTags.length !== closeTags.length + selfClosingTags.length) {
        console.log(chalk.red(`可能存在未闭合标签: ${file}`))
        console.log(
          chalk.gray(`开标签: ${openTags.length}, 闭标签: ${closeTags.length}, 自闭合标签: ${selfClosingTags.length}`),
        )
        hasErrors = true
      }
    } catch (error) {
      console.error(chalk.red(`检查文件时出错: ${file}`), error)
    }
  }

  if (!hasErrors) {
    console.log(chalk.green("未发现明显的未闭合标签问题"))
  }

  return hasErrors
}

// 查找所有JSX/TSX文件
function findJsxFiles() {
  const result: string[] = []

  function scanDir(dir: string) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && !fullPath.includes("node_modules") && !fullPath.includes(".next")) {
        scanDir(fullPath)
      } else if (stat.isFile() && (file.endsWith(".jsx") || file.endsWith(".tsx"))) {
        result.push(fullPath)
      }
    }
  }

  scanDir(process.cwd())
  return result
}

// 检查TypeScript类型错误
function checkTypeErrors() {
  console.log(chalk.blue("检查TypeScript类型错误..."))

  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" })
    console.log(chalk.green("未发现TypeScript类型错误"))
    return false
  } catch (error) {
    console.log(chalk.red("发现TypeScript类型错误:"))
    console.log(error.stdout.toString())
    return true
  }
}

// 检查依赖问题
function checkDependencies() {
  console.log(chalk.blue("检查依赖问题..."))

  try {
    // 使用我们之前创建的依赖检查工具
    execSync("npm run check-deps", { stdio: "inherit" })
    return false
  } catch (error) {
    console.log(chalk.red("依赖检查失败"))
    return true
  }
}

// 尝试使用更详细的构建命令
function runDetailedBuild() {
  console.log(chalk.blue("尝试使用更详细的构建命令..."))

  try {
    // 设置更详细的输出
    execSync("next build --debug", { stdio: "inherit" })
    console.log(chalk.green("构建成功!"))
    return false
  } catch (error) {
    console.log(chalk.red("构建失败，查看上面的错误信息"))
    return true
  }
}

// 主函数
async function main() {
  console.log(chalk.blue("===== 构建调试工具 ====="))

  const hasUnclosedTags = checkUnclosedTags()
  const hasTypeErrors = checkTypeErrors()
  const hasDependencyIssues = checkDependencies()

  if (!hasUnclosedTags && !hasTypeErrors && !hasDependencyIssues) {
    console.log(chalk.blue("未发现常见错误，尝试详细构建..."))
    const buildFailed = runDetailedBuild()

    if (buildFailed) {
      console.log(chalk.yellow("\n可能的解决方案:"))
      console.log("1. 检查是否有环境变量缺失")
      console.log("2. 尝试清除缓存: rm -rf .next")
      console.log("3. 检查是否有导入但未使用的组件")
      console.log("4. 检查是否有循环依赖")
      console.log("5. 检查是否有不兼容的依赖版本")
    }
  } else {
    console.log(chalk.yellow("\n请修复上述问题后再次尝试构建"))
  }
}

main().catch((error) => {
  console.error("调试工具运行出错:", error)
  process.exit(1)
})
