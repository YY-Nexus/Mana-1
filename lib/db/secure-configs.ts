import { neon } from "@neondatabase/serverless"
import { AppError } from "@/lib/error-handler"
import { encrypt, decrypt } from "@/lib/crypto"

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 安全配置类型
export interface SecureConfig {
  id: number
  name: string
  encryptedData: string
  createdAt: Date
  updatedAt: Date
}

// 存储安全配置
export async function storeSecureConfig(name: string, data: any): Promise<SecureConfig> {
  try {
    // 加密数据
    const encryptedData = await encrypt(JSON.stringify(data))

    // 检查是否已存在同名配置
    const existingConfig = await getSecureConfigByName(name)

    if (existingConfig) {
      // 更新现有配置
      const result = await sql`
        UPDATE secure_configs
        SET encrypted_data = ${encryptedData}, updated_at = NOW()
        WHERE name = ${name}
        RETURNING *
      `

      return mapDbConfigToAppConfig(result[0])
    } else {
      // 创建新配置
      const result = await sql`
        INSERT INTO secure_configs (name, encrypted_data)
        VALUES (${name}, ${encryptedData})
        RETURNING *
      `

      return mapDbConfigToAppConfig(result[0])
    }
  } catch (error) {
    console.error(`存储安全配置(${name})失败:`, error)
    throw error instanceof AppError ? error : new AppError("存储安全配置失败", 500)
  }
}

// 获取安全配置
export async function getSecureConfigByName(name: string): Promise<SecureConfig | null> {
  try {
    const result = await sql`
      SELECT * FROM secure_configs
      WHERE name = ${name}
    `

    if (!result || result.length === 0) {
      return null
    }

    return mapDbConfigToAppConfig(result[0])
  } catch (error) {
    console.error(`获取安全配置(${name})失败:`, error)
    throw error instanceof AppError ? error : new AppError("获取安全配置失败", 500)
  }
}

// 获取并解密安全配置数据
export async function getDecryptedConfigData<T = any>(name: string): Promise<T | null> {
  try {
    const config = await getSecureConfigByName(name)

    if (!config) {
      return null
    }

    // 解密数据
    const decryptedData = await decrypt(config.encryptedData)

    return JSON.parse(decryptedData) as T
  } catch (error) {
    console.error(`解密安全配置(${name})失败:`, error)
    throw error instanceof AppError ? error : new AppError("解密安全配置失败", 500)
  }
}

// 删除安全配置
export async function deleteSecureConfig(name: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM secure_configs
      WHERE name = ${name}
      RETURNING id
    `

    return result && result.length > 0
  } catch (error) {
    console.error(`删除安全配置(${name})失败:`, error)
    throw error instanceof AppError ? error : new AppError("删除安全配置失败", 500)
  }
}

// 将数据库结果映射为应用类型
function mapDbConfigToAppConfig(dbConfig: any): SecureConfig {
  return {
    id: dbConfig.id,
    name: dbConfig.name,
    encryptedData: dbConfig.encrypted_data,
    createdAt: new Date(dbConfig.created_at),
    updatedAt: new Date(dbConfig.updated_at),
  }
}
