import { neon } from "@neondatabase/serverless"
import { AppError } from "@/lib/error-handler"

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 邮件日志类型
export interface EmailLog {
  id: number
  taskId?: number
  taskName: string
  recipients: string[]
  subject: string
  sentAt: Date
  status: "success" | "failed"
  errorMessage?: string
  metadata?: Record<string, any>
}

// 创建邮件日志
export async function createEmailLog(log: Omit<EmailLog, "id">): Promise<EmailLog> {
  try {
    // 将recipients数组转换为字符串
    const recipientsStr = Array.isArray(log.recipients) ? log.recipients.join(",") : log.recipients

    const result = await sql`
      INSERT INTO email_logs (
        task_id, task_name, recipients, subject, sent_at, status, error_message, metadata
      ) VALUES (
        ${log.taskId || null}, ${log.taskName}, ${recipientsStr}, ${log.subject}, 
        ${log.sentAt.toISOString()}, ${log.status}, ${log.errorMessage || null}, 
        ${log.metadata ? JSON.stringify(log.metadata) : null}
      )
      RETURNING *
    `

    if (!result || result.length === 0) {
      throw new AppError("创建邮件日志失败", 500)
    }

    // 将数据库结果转换为应用类型
    return mapDbLogToAppLog(result[0])
  } catch (error) {
    console.error("创建邮件日志失败:", error)
    throw error instanceof AppError ? error : new AppError("创建邮件日志失败", 500)
  }
}

// 获取所有邮件日志
export async function getEmailLogs(limit = 100, offset = 0): Promise<EmailLog[]> {
  try {
    const result = await sql`
      SELECT * FROM email_logs 
      ORDER BY sent_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    return result.map(mapDbLogToAppLog)
  } catch (error) {
    console.error("获取邮件日志失败:", error)
    throw error instanceof AppError ? error : new AppError("获取邮件日志失败", 500)
  }
}

// 获取任务相关的邮件日志
export async function getEmailLogsByTaskId(taskId: number): Promise<EmailLog[]> {
  try {
    const result = await sql`
      SELECT * FROM email_logs 
      WHERE task_id = ${taskId}
      ORDER BY sent_at DESC
    `

    return result.map(mapDbLogToAppLog)
  } catch (error) {
    console.error(`获取任务(ID: ${taskId})相关的邮件日志失败:`, error)
    throw error instanceof AppError ? error : new AppError("获取任务相关的邮件日志失败", 500)
  }
}

// 获取最近的邮件日志
export async function getRecentEmailLogs(limit = 10): Promise<EmailLog[]> {
  try {
    const result = await sql`
      SELECT * FROM email_logs 
      ORDER BY sent_at DESC 
      LIMIT ${limit}
    `

    return result.map(mapDbLogToAppLog)
  } catch (error) {
    console.error("获取最近的邮件日志失败:", error)
    throw error instanceof AppError ? error : new AppError("获取最近的邮件日志失败", 500)
  }
}

// 将数据库结果映射为应用类型
function mapDbLogToAppLog(dbLog: any): EmailLog {
  return {
    id: dbLog.id,
    taskId: dbLog.task_id,
    taskName: dbLog.task_name,
    recipients: dbLog.recipients ? dbLog.recipients.split(",") : [],
    subject: dbLog.subject,
    sentAt: new Date(dbLog.sent_at),
    status: dbLog.status,
    errorMessage: dbLog.error_message,
    metadata: typeof dbLog.metadata === "string" ? JSON.parse(dbLog.metadata) : dbLog.metadata,
  }
}
