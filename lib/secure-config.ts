import { encrypt, decrypt } from "./crypto"

// 敏感配置类型
interface SensitiveConfig {
  emailPassword: string
  apiKeys: Record<string, string>
  [key: string]: any
}

// 加密存储敏感配置
export async function storeSecureConfig(config: SensitiveConfig): Promise<string> {
  try {
    // 加密配置
    const encryptedConfig = await encrypt(JSON.stringify(config))

    // 在实际应用中，这里应该将加密后的配置存储到数据库
    // 这里为了演示，返回加密后的字符串
    return encryptedConfig
  } catch (error) {
    console.error("存储安全配置失败:", error)
    throw new Error("存储安全配置失败")
  }
}

// 解密读取敏感配置
export async function getSecureConfig(encryptedConfig: string): Promise<SensitiveConfig> {
  try {
    // 解密配置
    const decryptedConfig = await decrypt(encryptedConfig)

    // 解析JSON
    return JSON.parse(decryptedConfig)
  } catch (error) {
    console.error("读取安全配置失败:", error)
    throw new Error("读取安全配置失败")
  }
}

// 安全地获取敏感配置项
export async function getSecureConfigItem(encryptedConfig: string, key: string): Promise<any> {
  const config = await getSecureConfig(encryptedConfig)
  return config[key]
}

// 掩码处理敏感信息用于显示
export function maskSensitiveData(data: string): string {
  if (!data) return ""

  // 邮箱掩码
  if (data.includes("@")) {
    const [username, domain] = data.split("@")
    return `${username.substring(0, 3)}${"*".repeat(username.length - 3)}@${domain}`
  }

  // 密码掩码
  if (data.length > 4) {
    return `${"*".repeat(data.length - 4)}${data.substring(data.length - 4)}`
  }

  return "*".repeat(data.length)
}
