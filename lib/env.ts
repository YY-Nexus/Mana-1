// 环境变量处理
export const env = {
  // 数据库配置
  DATABASE_URL: process.env.DATABASE_URL || "",

  // 邮件服务配置
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.example.com",
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@example.com",

  // Redis配置（用于速率限制）
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",

  // 加密配置
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "",

  // 应用配置
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: process.env.APP_URL || "http://localhost:3000",

  // 验证必要的环境变量
  validate() {
    const requiredVars = ["DATABASE_URL", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "ENCRYPTION_KEY"]

    const missing = requiredVars.filter((key) => !this[key])

    if (missing.length > 0) {
      throw new Error(`缺少必要的环境变量: ${missing.join(", ")}`)
    }

    return this
  },
}
