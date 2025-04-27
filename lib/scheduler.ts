import { getPendingTasks, updateTaskExecutionStatus } from "@/lib/db/scheduled-tasks"
import { sendAttendanceReportEmail } from "@/lib/email-service"
import { exportAttendanceReport } from "@/lib/attendance"
import { AppError } from "@/lib/error-handler"

// 计算下次执行时间
export function calculateNextRun(frequency: string, day: string, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number)
  const now = new Date()
  const nextRun = new Date()

  // 设置时间
  nextRun.setHours(hours, minutes, 0, 0)

  // 如果当前时间已经过了今天的执行时间，则从明天开始计算
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1)
  }

  if (frequency === "daily") {
    // 每天执行，不需要额外处理
  } else if (frequency === "weekly") {
    // 设置为下一个指定的星期几
    const targetDay = Number.parseInt(day)
    const currentDay = nextRun.getDay()
    const daysToAdd = (targetDay - currentDay + 7) % 7

    // 如果今天就是目标日期，但时间已过，则设为下周
    if (daysToAdd === 0 && nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 7)
    } else {
      nextRun.setDate(nextRun.getDate() + daysToAdd)
    }
  } else if (frequency === "monthly") {
    // 设置为下一个指定的日期
    const targetDay = Number.parseInt(day)

    // 设置为当月的目标日期
    nextRun.setDate(targetDay)

    // 如果当月的目标日期已过，则设为下个月
    if (nextRun <= now) {
      nextRun.setMonth(nextRun.getMonth() + 1)
    }

    // 处理月份天数不足的情况
    const daysInMonth = new Date(nextRun.getFullYear(), nextRun.getMonth() + 1, 0).getDate()
    if (targetDay > daysInMonth) {
      nextRun.setDate(daysInMonth)
    }
  }

  return nextRun
}

// 执行定时任务
export async function executeTask(taskId: number): Promise<void> {
  try {
    // 获取任务详情
    const tasks = await getPendingTasks()
    const task = tasks.find((t) => t.id === taskId)

    if (!task) {
      throw new AppError(`未找到ID为${taskId}的定时任务`, 404)
    }

    console.log(`开始执行定时任务: ${task.name} (ID: ${task.id})`)

    // 导出报表
    const exportResult = await exportAttendanceReport({
      format: task.format,
      options: task.options,
    })

    if (!exportResult.success) {
      throw new AppError(`导出报表失败: ${exportResult.message}`, 500)
    }

    // 发送邮件
    const emailResult = await sendAttendanceReportEmail({
      recipients: task.recipients,
      subject: `${task.name} - ${new Date().toLocaleDateString("zh-CN")}`,
      reportDate: new Date(),
      reportType: task.name,
      attachments: [
        {
          filename: `考勤报表_${new Date().toISOString().split("T")[0]}.${task.format}`,
          content: exportResult.data,
          encoding: "base64",
        },
      ],
      includeInBody: task.options.includeSummary,
      taskId: task.id,
    })

    if (!emailResult.success) {
      throw new AppError(`发送邮件失败: ${emailResult.message}`, 500)
    }

    // 计算下次执行时间
    const nextRun = calculateNextRun(task.frequency, task.day, task.time)

    // 更新任务状态
    await updateTaskExecutionStatus(task.id, new Date(), nextRun, true)

    console.log(`定时任务执行成功: ${task.name} (ID: ${task.id})`)
  } catch (error) {
    console.error(`定时任务执行失败: (ID: ${taskId})`, error)

    // 计算下次执行时间（即使失败也要更新）
    const tasks = await getPendingTasks()
    const task = tasks.find((t) => t.id === taskId)

    if (task) {
      const nextRun = calculateNextRun(task.frequency, task.day, task.time)

      // 更新任务状态为失败
      await updateTaskExecutionStatus(
        task.id,
        new Date(),
        nextRun,
        false,
        error instanceof Error ? error.message : String(error),
      )
    }

    throw error
  }
}

// 执行所有待执行的定时任务
export async function executeAllPendingTasks(): Promise<{
  total: number
  succeeded: number
  failed: number
  errors: Record<number, string>
}> {
  // 获取待执行的任务
  const pendingTasks = await getPendingTasks()

  if (pendingTasks.length === 0) {
    return { total: 0, succeeded: 0, failed: 0, errors: {} }
  }

  const errors: Record<number, string> = {}
  let succeeded = 0
  let failed = 0

  // 逐个执行任务
  for (const task of pendingTasks) {
    try {
      await executeTask(task.id)
      succeeded++
    } catch (error) {
      failed++
      errors[task.id] = error instanceof Error ? error.message : String(error)
    }
  }

  return {
    total: pendingTasks.length,
    succeeded,
    failed,
    errors,
  }
}
