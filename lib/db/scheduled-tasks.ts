import { neon } from "@neondatabase/serverless"
import { AppError } from "@/lib/error-handler"

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 定时任务类型
export interface ScheduledTask {
  id: number
  name: string
  type: string
  frequency: "daily" | "weekly" | "monthly"
  day: string
  time: string
  recipients: string[]
  format: "excel" | "pdf"
  options: {
    includeCharts: boolean
    includeSummary: boolean
    includeDetails: boolean
  }
  lastRun: Date | null
  nextRun: Date
  status: "active" | "paused"
  lastStatus?: string
  lastError?: string
  createdAt: Date
  updatedAt: Date
}

// 创建定时任务
export async function createScheduledTask(
  task: Omit<ScheduledTask, "id" | "createdAt" | "updatedAt">,
): Promise<ScheduledTask> {
  try {
    // 将recipients数组转换为字符串
    const recipientsStr = Array.isArray(task.recipients) ? task.recipients.join(",") : task.recipients

    const result = await sql`
      INSERT INTO scheduled_tasks (
        name, type, frequency, day, time, recipients, format, options, 
        next_run, status
      ) VALUES (
        ${task.name}, ${task.type}, ${task.frequency}, ${task.day}, ${task.time}, 
        ${recipientsStr}, ${task.format}, ${JSON.stringify(task.options)}, 
        ${task.nextRun.toISOString()}, ${task.status}
      )
      RETURNING *
    `

    if (!result || result.length === 0) {
      throw new AppError("创建定时任务失败", 500)
    }

    // 将数据库结果转换为应用类型
    return mapDbTaskToAppTask(result[0])
  } catch (error) {
    console.error("创建定时任务失败:", error)
    throw error instanceof AppError ? error : new AppError("创建定时任务失败", 500)
  }
}

// 获取所有定时任务
export async function getAllScheduledTasks(): Promise<ScheduledTask[]> {
  try {
    const result = await sql`SELECT * FROM scheduled_tasks ORDER BY created_at DESC`
    return result.map(mapDbTaskToAppTask)
  } catch (error) {
    console.error("获取定时任务失败:", error)
    throw error instanceof AppError ? error : new AppError("获取定时任务失败", 500)
  }
}

// 获取单个定时任务
export async function getScheduledTaskById(id: number): Promise<ScheduledTask | null> {
  try {
    const result = await sql`SELECT * FROM scheduled_tasks WHERE id = ${id}`

    if (!result || result.length === 0) {
      return null
    }

    return mapDbTaskToAppTask(result[0])
  } catch (error) {
    console.error(`获取定时任务(ID: ${id})失败:`, error)
    throw error instanceof AppError ? error : new AppError("获取定时任务失败", 500)
  }
}

// 更新定时任务
export async function updateScheduledTask(id: number, updates: Partial<ScheduledTask>): Promise<ScheduledTask> {
  try {
    // 构建更新字段
    const updateFields = []
    const updateValues = {}

    if (updates.name !== undefined) {
      updateFields.push("name = ${name}")
      updateValues.name = updates.name
    }

    if (updates.frequency !== undefined) {
      updateFields.push("frequency = ${frequency}")
      updateValues.frequency = updates.frequency
    }

    if (updates.day !== undefined) {
      updateFields.push("day = ${day}")
      updateValues.day = updates.day
    }

    if (updates.time !== undefined) {
      updateFields.push("time = ${time}")
      updateValues.time = updates.time
    }

    if (updates.recipients !== undefined) {
      updateFields.push("recipients = ${recipients}")
      updateValues.recipients = Array.isArray(updates.recipients) ? updates.recipients.join(",") : updates.recipients
    }

    if (updates.format !== undefined) {
      updateFields.push("format = ${format}")
      updateValues.format = updates.format
    }

    if (updates.options !== undefined) {
      updateFields.push("options = ${options}")
      updateValues.options = JSON.stringify(updates.options)
    }

    if (updates.nextRun !== undefined) {
      updateFields.push("next_run = ${nextRun}")
      updateValues.nextRun = updates.nextRun.toISOString()
    }

    if (updates.status !== undefined) {
      updateFields.push("status = ${status}")
      updateValues.status = updates.status
    }

    if (updates.lastRun !== undefined) {
      updateFields.push("last_run = ${lastRun}")
      updateValues.lastRun = updates.lastRun ? updates.lastRun.toISOString() : null
    }

    if (updates.lastStatus !== undefined) {
      updateFields.push("last_status = ${lastStatus}")
      updateValues.lastStatus = updates.lastStatus
    }

    if (updates.lastError !== undefined) {
      updateFields.push("last_error = ${lastError}")
      updateValues.lastError = updates.lastError
    }

    // 添加更新时间
    updateFields.push("updated_at = NOW()")

    if (updateFields.length === 0) {
      throw new AppError("没有提供要更新的字段", 400)
    }

    // 构建SQL查询
    const updateQuery = `
      UPDATE scheduled_tasks 
      SET ${updateFields.join(", ")} 
      WHERE id = ${id} 
      RETURNING *
    `

    const result = await sql.query(updateQuery, updateValues)

    if (!result || result.length === 0) {
      throw new AppError(`未找到ID为${id}的定时任务`, 404)
    }

    return mapDbTaskToAppTask(result[0])
  } catch (error) {
    console.error(`更新定时任务(ID: ${id})失败:`, error)
    throw error instanceof AppError ? error : new AppError("更新定时任务失败", 500)
  }
}

// 删除定时任务
export async function deleteScheduledTask(id: number): Promise<boolean> {
  try {
    const result = await sql`DELETE FROM scheduled_tasks WHERE id = ${id} RETURNING id`
    return result && result.length > 0
  } catch (error) {
    console.error(`删除定时任务(ID: ${id})失败:`, error)
    throw error instanceof AppError ? error : new AppError("删除定时任务失败", 500)
  }
}

// 获取待执行的定时任务
export async function getPendingTasks(): Promise<ScheduledTask[]> {
  try {
    const now = new Date()

    const result = await sql`
      SELECT * FROM scheduled_tasks 
      WHERE status = 'active' AND next_run <= ${now.toISOString()}
      ORDER BY next_run ASC
    `

    return result.map(mapDbTaskToAppTask)
  } catch (error) {
    console.error("获取待执行的定时任务失败:", error)
    throw error instanceof AppError ? error : new AppError("获取待执行的定时任务失败", 500)
  }
}

// 更新任务执行状态
export async function updateTaskExecutionStatus(
  id: number,
  lastRun: Date,
  nextRun: Date,
  success: boolean,
  errorMessage?: string,
): Promise<void> {
  try {
    await sql`
      UPDATE scheduled_tasks
      SET 
        last_run = ${lastRun.toISOString()},
        next_run = ${nextRun.toISOString()},
        last_status = ${success ? "success" : "failed"},
        last_error = ${errorMessage || null},
        updated_at = NOW()
      WHERE id = ${id}
    `
  } catch (error) {
    console.error(`更新任务执行状态(ID: ${id})失败:`, error)
    throw error instanceof AppError ? error : new AppError("更新任务执行状态失败", 500)
  }
}

// 将数据库结果映射为应用类型
function mapDbTaskToAppTask(dbTask: any): ScheduledTask {
  return {
    id: dbTask.id,
    name: dbTask.name,
    type: dbTask.type,
    frequency: dbTask.frequency,
    day: dbTask.day,
    time: dbTask.time,
    recipients: dbTask.recipients ? dbTask.recipients.split(",") : [],
    format: dbTask.format,
    options: typeof dbTask.options === "string" ? JSON.parse(dbTask.options) : dbTask.options,
    lastRun: dbTask.last_run ? new Date(dbTask.last_run) : null,
    nextRun: new Date(dbTask.next_run),
    status: dbTask.status,
    lastStatus: dbTask.last_status,
    lastError: dbTask.last_error,
    createdAt: new Date(dbTask.created_at),
    updatedAt: new Date(dbTask.updated_at),
  }
}
