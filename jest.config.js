const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // 指向Next.js应用的路径
  dir: "./",
})

// Jest自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // 处理模块别名
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "!components/**/*.stories.{ts,tsx}",
    "!components/**/index.{ts,tsx}",
  ],
}

// createJestConfig会自动处理一些配置，如处理Next.js的/public文件夹
module.exports = createJestConfig(customJestConfig)
