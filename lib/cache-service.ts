import { getCachedData, cacheData, deleteCachedData, clearCacheByPrefix } from "@/lib/redis"
import { getAttendanceReportData, getAttendanceStats } from "@/lib/attendance"
import { getEmailLogs } from "@/lib/db/email-logs"
import { getAllScheduledTasks } from "@/lib/db/scheduled-tasks"

// 缓存键前缀
const CACHE_KEYS = {
  ATTENDANCE_REPORT: "attendance:report",
  ATTENDANCE_STATS: "attendance:stats",
  EMAIL_LOGS: "email:logs",
  SCHEDULED_TASKS: "tasks:scheduled",
}

// 缓存过期时间（秒）
const CACHE_EXPIRY = {
  ATTENDANCE_REPORT: 5 * 60, // 5分钟
  ATTENDANCE_STATS: 15 * 60, // 15分钟
  EMAIL_LOGS: 2 * 60, // 2分钟
  SCHEDULED_TASKS: 1 * 60, // 1分钟
}

/**
 * 获取考勤报表数据（带缓存）
 */
export async function getCachedAttendanceReport(filters?: any) {
  // 创建包含筛选条件的缓存键
  const filterKey = filters ? JSON.stringify(filters) : "default"
  const cacheKey = `${CACHE_KEYS.ATTENDANCE_REPORT}:${filterKey}`

  // 尝试从缓存获取
  const cachedData = await getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // 缓存未命中，从数据库获取
  const reportData = await getAttendanceReportData(filters)

  // 存入缓存
  await cacheData(cacheKey, reportData, CACHE_EXPIRY.ATTENDANCE_REPORT)

  return reportData
}

/**
 * 获取考勤统计数据（带缓存）
 */
export async function getCachedAttendanceStats(dateRange?: any, department?: string) {
  // 创建包含参数的缓存键
  const paramKey = `${dateRange ? JSON.stringify(dateRange) : "all"}_${department || "all"}`
  const cacheKey = `${CACHE_KEYS.ATTENDANCE_STATS}:${paramKey}`

  // 尝试从缓存获取
  const cachedData = await getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // 缓存未命中，从数据库获取
  const statsData = await getAttendanceStats(dateRange, department)

  // 存入缓存
  await cacheData(cacheKey, statsData, CACHE_EXPIRY.ATTENDANCE_STATS)

  return statsData
}

/**
 * 获取邮件日志（带缓存）
 */
export async function getCachedEmailLogs(limit = 100, offset = 0) {
  const cacheKey = `${CACHE_KEYS.EMAIL_LOGS}:${limit}_${offset}`

  // 尝试从缓存获取
  const cachedData = await getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // 缓存未命中，从数据库获取
  const logs = await getEmailLogs(limit, offset)

  // 存入缓存
  await cacheData(cacheKey, logs, CACHE_EXPIRY.EMAIL_LOGS)

  return logs
}

/**
 * 获取定时任务列表（带缓存）
 */
export async function getCachedScheduledTasks() {
  const cacheKey = CACHE_KEYS.SCHEDULED_TASKS

  // 尝试从缓存获取
  const cachedData = await getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // 缓存未命中，从数据库获取
  const tasks = await getAllScheduledTasks()

  // 存入缓存
  await cacheData(cacheKey, tasks, CACHE_EXPIRY.SCHEDULED_TASKS)

  return tasks
}

/**
 * 清除考勤报表缓存
 */
export async function clearAttendanceReportCache() {
  await clearCacheByPrefix(CACHE_KEYS.ATTENDANCE_REPORT)
}

/**
 * 清除考勤统计缓存
 */
export async function clearAttendanceStatsCache() {
  await clearCacheByPrefix(CACHE_KEYS.ATTENDANCE_STATS)
}

/**
 * 清除邮件日志缓存
 */
export async function clearEmailLogsCache() {
  await clearCacheByPrefix(CACHE_KEYS.EMAIL_LOGS)
}

/**
 * 清除定时任务缓存
 */
export async function clearScheduledTasksCache() {
  await deleteCachedData(CACHE_KEYS.SCHEDULED_TASKS)
}

/**
 * 清除所有缓存
 */
export async function clearAllCaches() {
  await Promise.all([
    clearAttendanceReportCache(),
    clearAttendanceStatsCache(),
    clearEmailLogsCache(),
    clearScheduledTasksCache(),
  ])
}
