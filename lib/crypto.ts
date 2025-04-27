import { randomBytes, createCipheriv, createDecipheriv } from "crypto"

// 加密密钥和初始化向量
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || randomBytes(32).toString("hex")
const IV_LENGTH = 16

// 加密数据
export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return `${iv.toString("hex")}:${encrypted}`
}

// 解密数据
export async function decrypt(text: string): Promise<string> {
  const [ivHex, encryptedHex] = text.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv)

  let decrypted = decipher.update(encryptedHex, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
