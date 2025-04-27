import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"
import { broadcastTaskAdded } from "./websocket-service"

// 任务类型
export interface Task {
  id: string
  type: string
  data: any
  priority: number
  createdAt: Date
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
}

// 任务分析数据
export interface TaskAnalytics {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  averageProcessingTime: number
  tasksByType: Record<string, number>
}

// 任务历史记录
export interface TaskHistory {
  id: number
  taskId: string
  taskType: string
  status: string
  message: string
  executedAt: string
  duration: number
}

// 任务优先级分布
export interface PriorityDistribution {
  name: string
  value: number
}

// 任务统计数据
export interface TaskStats {
  queueLength: number
  processingRate: number
  successRate: number
  averageWaitTime: number
  peakQueueLength: number
}

/**
 * 将任务添加到队列
 * @param type 任务类型
 * @param data 任务数据
 * @param priority 任务优先级（1-10，10为最高）
 * @returns 任务ID
 */
export async function enqueueTask(type: string, data: any, priority = 5): Promise<string> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 生成任务ID
    const taskId = uuidv4()

    // 插入任务到数据库
    await sql.query(
      `INSERT INTO task_queue (id, type, data, priority, created_at, status) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [taskId, type, JSON.stringify(data), priority, new Date(), "pending"],
    )

    // 广播任务添加事件
    broadcastTaskAdded(taskId, type)

    return taskId
  } catch (error) {
    console.error("添加任务到队列失败:", error)
    throw new Error("添加任务到队列失败")
  }
}

/**
 * 获取队列长度
 * @returns 队列中的任务数量
 */
export async function getQueueLength(): Promise<number> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql.query(`SELECT COUNT(*) as count FROM task_queue WHERE status = 'pending'`)

    return Number.parseInt(result.rows[0].count, 10)
  } catch (error) {
    console.error("获取队列长度失败:", error)
    throw new Error("获取队列长度失败")
  }
}

/**
 * 获取任务队列长度（别名，保持兼容性）
 * @returns 队列中的任务数量
 */
export async function getTaskQueueLength(): Promise<number> {
  return getQueueLength()
}

/**
 * 处理任务队列
 * @param batchSize 一次处理的任务数量
 * @returns 处理的任务数量
 */
export async function processTaskQueue(batchSize = 10): Promise<number> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 获取待处理的任务
    const tasks = await sql.query(
      `SELECT id, type, data, priority FROM task_queue 
       WHERE status = 'pending' 
       ORDER BY priority DESC, created_at ASC 
       LIMIT $1`,
      [batchSize],
    )

    let processedCount = 0

    // 处理每个任务
    for (const task of tasks.rows) {
      try {
        // 更新任务状态为处理中
        await sql.query(`UPDATE task_queue SET status = 'processing', started_at = $1 WHERE id = $2`, [
          new Date(),
          task.id,
        ])

        // 这里应该有实际的任务处理逻辑
        // 模拟任务处理
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 更新任务状态为已完成
        await sql.query(`UPDATE task_queue SET status = 'completed', completed_at = $1 WHERE id = $2`, [
          new Date(),
          task.id,
        ])

        processedCount++
      } catch (error) {
        // 更新任务状态为失败
        await sql.query(`UPDATE task_queue SET status = 'failed', error = $1, completed_at = $2 WHERE id = $3`, [
          error instanceof Error ? error.message : String(error),
          new Date(),
          task.id,
        ])
      }
    }

    return processedCount
  } catch (error) {
    console.error("处理任务队列失败:", error)
    throw new Error("处理任务队列失败")
  }
}

/**
 * 获取任务分析数据
 * @returns 任务分析数据
 */
export async function getTaskAnalytics(): Promise<TaskAnalytics> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 获取总任务数
    const totalResult = await sql.query(`SELECT COUNT(*) as count FROM task_queue`)
    const totalTasks = Number.parseInt(totalResult.rows[0].count, 10)

    // 获取已完成任务数
    const completedResult = await sql.query(`SELECT COUNT(*) as count FROM task_queue WHERE status = 'completed'`)
    const completedTasks = Number.parseInt(completedResult.rows[0].count, 10)

    // 获取失败任务数
    const failedResult = await sql.query(`SELECT COUNT(*) as count FROM task_queue WHERE status = 'failed'`)
    const failedTasks = Number.parseInt(failedResult.rows[0].count, 10)

    // 获取平均处理时间
    const timeResult = await sql.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_time 
       FROM task_queue 
       WHERE status = 'completed' AND started_at IS NOT NULL AND completed_at IS NOT NULL`,
    )
    const averageProcessingTime = timeResult.rows[0].avg_time
      ? Number.parseFloat(timeResult.rows[0].avg_time) * 1000
      : 0

    // 获取按类型分组的任务数
    const typeResult = await sql.query(`SELECT type, COUNT(*) as count FROM task_queue GROUP BY type`)
    const tasksByType: Record<string, number> = {}
    typeResult.rows.forEach((row: any) => {
      tasksByType[row.type] = Number.parseInt(row.count, 10)
    })

    return {
      totalTasks,
      completedTasks,
      failedTasks,
      averageProcessingTime,
      tasksByType,
    }
  } catch (error) {
    console.error("获取任务分析数据失败:", error)
    throw new Error("获取任务分析数据失败")
  }
}

/**
 * 获取任务执行历史
 * @param limit 限制返回的记录数
 * @returns 任务历史记录
 */
export async function getTaskHistory(limit = 100): Promise<TaskHistory[]> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql.query(
      `SELECT 
        id, 
        task_id as "taskId", 
        task_type as "taskType", 
        status, 
        message, 
        created_at as "executedAt",
        CASE 
          WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (completed_at - started_at)) * 1000 
          ELSE NULL 
        END as duration
      FROM task_history
      ORDER BY created_at DESC
      LIMIT $1`,
      [limit],
    )

    return result.rows
  } catch (error) {
    console.error("获取任务历史记录失败:", error)
    throw new Error("获取任务历史记录失败")
  }
}

/**
 * 获取任务优先级分布
 * @returns 优先级分布数据
 */
export async function getTaskPriorityDistribution(): Promise<PriorityDistribution[]> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql.query(
      `SELECT priority, COUNT(*) as count 
       FROM task_queue 
       GROUP BY priority 
       ORDER BY priority`,
    )

    return result.rows.map((row: any) => ({
      name: `优先级 ${row.priority}`,
      value: Number.parseInt(row.count, 10),
    }))
  } catch (error) {
    console.error("获取任务优先级分布失败:", error)
    throw new Error("获取任务优先级分布失败")
  }
}

/**
 * 获取任务统计数据
 * @returns 任务统计数据
 */
export async function getTaskStats(): Promise<TaskStats> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 获取队列长度
    const queueLengthResult = await sql.query(`SELECT COUNT(*) as count FROM task_queue WHERE status = 'pending'`)
    const queueLength = Number.parseInt(queueLengthResult.rows[0].count, 10)

    // 获取处理速率（每分钟完成的任务数）
    const processingRateResult = await sql.query(
      `SELECT COUNT(*) as count 
       FROM task_queue 
       WHERE status = 'completed' 
       AND completed_at > NOW() - INTERVAL '1 hour'`,
    )
    const processingRate = Number.parseInt(processingRateResult.rows[0].count, 10) / 60

    // 获取成功率
    const successRateResult = await sql.query(
      `SELECT 
        (SELECT COUNT(*) FROM task_queue WHERE status = 'completed') as completed,
        (SELECT COUNT(*) FROM task_queue WHERE status IN ('completed', 'failed')) as total`,
    )
    const { completed, total } = successRateResult.rows[0]
    const successRate = total > 0 ? (Number.parseInt(completed, 10) / Number.parseInt(total, 10)) * 100 : 100

    // 获取平均等待时间
    const waitTimeResult = await sql.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (started_at - created_at))) as avg_wait 
       FROM task_queue 
       WHERE status IN ('completed', 'processing') 
       AND started_at IS NOT NULL`,
    )
    const averageWaitTime = waitTimeResult.rows[0].avg_wait
      ? Number.parseFloat(waitTimeResult.rows[0].avg_wait) * 1000
      : 0

    // 获取峰值队列长度（模拟数据）
    const peakQueueLength = Math.max(queueLength, 20) // 实际应用中应该从历史记录中获取

    return {
      queueLength,
      processingRate,
      successRate,
      averageWaitTime,
      peakQueueLength,
    }
  } catch (error) {
    console.error("获取任务统计数据失败:", error)
    throw new Error("获取任务统计数据失败")
  }
}

/**
 * 获取失败的任务
 * @param limit 限制返回的记录数
 * @returns 失败的任务列表
 */
export async function getFailedTasks(limit = 50): Promise<Task[]> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql.query(
      `SELECT id, type, data, priority, created_at as "createdAt", status, error
       FROM task_queue
       WHERE status = 'failed'
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    )

    return result.rows
  } catch (error) {
    console.error("获取失败任务列表失败:", error)
    throw new Error("获取失败任务列表失败")
  }
}

/**
 * 重试失败的任务
 * @param taskId 任务ID
 * @returns 是否成功重试
 */
export async function retryFailedTask(taskId: string): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 获取失败的任务
    const taskResult = await sql.query(`SELECT * FROM task_queue WHERE id = $1 AND status = 'failed'`, [taskId])

    if (taskResult.rows.length === 0) {
      throw new Error("任务不存在或不是失败状态")
    }

    // 更新任务状态为待处理
    await sql.query(
      `UPDATE task_queue 
       SET status = 'pending', error = NULL, started_at = NULL, completed_at = NULL 
       WHERE id = $1`,
      [taskId],
    )

    return true
  } catch (error) {
    console.error("重试失败任务失败:", error)
    throw new Error("重试失败任务失败")
  }
}

/**
 * 获取任务执行日志
 * @param options 过滤选项
 * @returns 任务执行日志列表
 */
export async function getTaskExecutionLogs(
  options: {
    limit?: number
    search?: string
    status?: string[]
  } = {},
): Promise<
  Array<{
    id: number
    taskId: string
    taskType: string
    status: string
    message: string
    executedAt: string
    duration: number
  }>
> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // 构建查询条件
    const conditions = []
    const params: any[] = []
    let index = 1

    if (options.search) {
      conditions.push(`(task_id ILIKE $${index} OR task_type ILIKE $${index})`)
      params.push(`%${options.search}%`)
      index++
    }

    if (options.status && options.status.length > 0) {
      conditions.push(`status IN (${options.status.map((_, i) => `$${index + i}`).join(",")})`)
      params.push(...options.status)
      index += options.status.length
    }

    // 构建WHERE子句
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // 执行查询
    const query = `
      SELECT 
        id, 
        task_id as "taskId", 
        task_type as "taskType", 
        status, 
        message, 
        created_at as "executedAt",
        CASE 
          WHEN completed_at IS NOT NULL AND started_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (completed_at - started_at)) * 1000 
          ELSE NULL 
        END as duration
      FROM task_history
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${index}
    `

    params.push(options.limit || 100)

    const result = await sql.query(query, params)
    return result.rows
  } catch (error) {
    console.error("获取任务执行日志失败:", error)
    throw new Error("获取任务执行日志失败")
  }
}
