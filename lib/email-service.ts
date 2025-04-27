import { createTransport } from "nodemailer"
import type { Attachment } from "nodemailer/lib/mailer"
import { formatDate } from "@/lib/utils"
import { env } from "@/lib/env"
import { createEmailLog } from "@/lib/db/email-logs"
import { getDecryptedConfigData, storeSecureConfig } from "@/lib/db/secure-configs"
import { sanitizeHtml } from "@/lib/sanitize"
import { neon } from "@neondatabase/serverless"

// 邮件配置类型
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

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

// 获取邮件配置
async function getEmailConfig(): Promise<EmailConfig> {
  // 尝试从安全存储获取配置
  const storedConfig = await getDecryptedConfigData<EmailConfig>("email_config")

  if (storedConfig) {
    return storedConfig
  }

  // 使用环境变量创建默认配置
  const defaultConfig: EmailConfig = {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
    from: env.EMAIL_FROM,
  }

  // 存储默认配置
  await storeSecureConfig("email_config", defaultConfig)

  return defaultConfig
}

// 创建邮件传输器
async function createMailTransporter() {
  const config = await getEmailConfig()

  return createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  })
}

/**
 * 发送考勤报表邮件
 */
export async function sendAttendanceReportEmail({
  recipients,
  subject,
  reportDate,
  reportType,
  attachments,
  includeInBody = true,
  taskId,
}: {
  recipients: string[]
  subject: string
  reportDate: Date | string
  reportType: string
  attachments?: Attachment[]
  includeInBody?: boolean
  taskId?: number
}): Promise<{ success: boolean; message?: string; id?: number }> {
  try {
    // 获取邮件配置
    const config = await getEmailConfig()

    // 格式化日期
    const formattedDate = typeof reportDate === "string" ? reportDate : formatDate(reportDate)

    // 构建邮件内容
    const htmlContent = generateAttendanceReportEmailTemplate({
      reportDate: formattedDate,
      reportType,
      includeInBody,
    })

    // 创建传输器
    const transporter = await createMailTransporter()

    // 发送邮件
    const info = await transporter.sendMail({
      from: config.from,
      to: recipients.join(", "),
      subject,
      html: sanitizeHtml(htmlContent),
      attachments,
    })

    // 记录发送成功
    const log = await createEmailLog({
      taskId,
      taskName: subject,
      recipients,
      subject,
      sentAt: new Date(),
      status: "success",
      metadata: {
        messageId: info.messageId,
        response: info.response,
      },
    })

    return {
      success: true,
      id: log.id,
    }
  } catch (error) {
    console.error("发送邮件失败:", error)

    // 记录发送失败
    const log = await createEmailLog({
      taskId,
      taskName: subject,
      recipients,
      subject,
      sentAt: new Date(),
      status: "failed",
      errorMessage: error instanceof Error ? error.message : String(error),
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "发送邮件时发生未知错误",
      id: log.id,
    }
  }
}

/**
 * 生成考勤报表邮件模板
 */
function generateAttendanceReportEmailTemplate({
  reportDate,
  reportType,
  includeInBody,
}: {
  reportDate: string
  reportType: string
  includeInBody: boolean
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>考勤报表</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .title {
          font-size: 20px;
          color: #111827;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 16px;
          color: #6b7280;
        }
        .content {
          padding: 20px 0;
        }
        .report-info {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .report-info p {
          margin: 5px 0;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          margin-top: 15px;
        }
        .note {
          font-size: 14px;
          color: #6b7280;
          font-style: italic;
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #eaeaea;
        }
        th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">言语『启智』运维管理中心</div>
          <div class="title">考勤报表通知</div>
          <div class="subtitle">${reportDate}</div>
        </div>
        
        <div class="content">
          <div class="report-info">
            <p><strong>报表类型:</strong> ${reportType}</p>
            <p><strong>生成日期:</strong> ${reportDate}</p>
            <p><strong>报表状态:</strong> 已生成完成</p>
          </div>
          
          <p>尊敬的管理员：</p>
          <p>您的考勤报表已生成完成，请查收附件。</p>
          
          ${
            includeInBody
              ? `
          <h3>报表摘要</h3>
          <table>
            <tr>
              <th>指标</th>
              <th>数值</th>
            </tr>
            <tr>
              <td>员工总数</td>
              <td>50</td>
            </tr>
            <tr>
              <td>出勤率</td>
              <td>92.5%</td>
            </tr>
            <tr>
              <td>准时率</td>
              <td>88.3%</td>
            </tr>
            <tr>
              <td>平均工作时长</td>
              <td>8.2小时</td>
            </tr>
          </table>
          `
              : ""
          }
          
          <p>您可以通过以下方式查看完整报表：</p>
          <ol>
            <li>打开附件查看详细报表</li>
            <li>登录系统查看在线报表</li>
          </ol>
          
          <div style="text-align: center;">
            <a href="https://example.com/attendance/reports" class="button">查看在线报表</a>
          </div>
          
          <p class="note">注：此邮件由系统自动发送，请勿直接回复。如有问题，请联系系统管理员。</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} 言语『启智』运维管理中心 | 版本 1.0.0</p>
          <p>如需帮助，请联系: <a href="mailto:support@example.com">support@example.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * 测试邮件服务连接
 */
export async function testEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = await createMailTransporter()
    await transporter.verify()
    return { success: true, message: "邮件服务连接成功" }
  } catch (error) {
    console.error("邮件服务连接失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "邮件服务连接失败",
    }
  }
}

/**
 * 发送测试邮件
 */
export async function sendTestEmail(recipient: string): Promise<{ success: boolean; message: string }> {
  try {
    const config = await getEmailConfig()
    const transporter = await createMailTransporter()

    await transporter.sendMail({
      from: config.from,
      to: recipient,
      subject: "测试邮件 - 言语『启智』运维管理中心",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #2563eb;">邮件服务测试</h2>
          <p>这是一封测试邮件，用于验证邮件服务是否正常工作。</p>
          <p>如果您收到此邮件，说明邮件服务配置正确。</p>
          <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 14px; color: #6b7280;">
            发送时间: ${new Date().toLocaleString("zh-CN")}
          </p>
        </div>
      `,
    })

    // 记录测试邮件发送
    await createEmailLog({
      taskName: "测试邮件",
      recipients: [recipient],
      subject: "测试邮件 - 言语『启智』运维管理中心",
      sentAt: new Date(),
      status: "success",
    })

    return { success: true, message: "测试邮件发送成功" }
  } catch (error) {
    console.error("测试邮件发送失败:", error)

    // 记录测试邮件发送失败
    await createEmailLog({
      taskName: "测试邮件",
      recipients: [recipient],
      subject: "测试邮件 - 言语『启智』运维管理中心",
      sentAt: new Date(),
      status: "failed",
      errorMessage: error instanceof Error ? error.message : String(error),
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "测试邮件发送失败",
    }
  }
}

/**
 * 更新邮件配置
 */
export async function updateEmailConfig(config: EmailConfig): Promise<{ success: boolean; message: string }> {
  try {
    await storeSecureConfig("email_config", config)
    return { success: true, message: "邮件配置更新成功" }
  } catch (error) {
    console.error("更新邮件配置失败:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "更新邮件配置失败",
    }
  }
}

/**
 * 获取邮件日志
 * @param limit 限制返回的记录数
 * @param offset 偏移量
 * @returns 邮件日志列表
 */
export async function getEmailLogs(limit = 50, offset = 0): Promise<EmailLog[]> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql.query(
      `SELECT 
        id,
        task_id as "taskId",
        task_name as "taskName",
        recipients,
        subject,
        sent_at as "sentAt",
        status,
        error_message as "errorMessage",
        metadata
      FROM email_logs
      ORDER BY sent_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    )

    return result.rows.map((row: any) => ({
      ...row,
      recipients: Array.isArray(row.recipients) ? row.recipients : JSON.parse(row.recipients || "[]"),
      metadata: row.metadata ? (typeof row.metadata === "object" ? row.metadata : JSON.parse(row.metadata)) : undefined,
    }))
  } catch (error) {
    console.error("获取邮件日志失败:", error)
    return []
  }
}
