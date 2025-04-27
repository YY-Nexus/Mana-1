import { redis, publishMessage } from "@/lib/redis"

// 通知类型
export type NotificationType = "info" | "success" | "warning" | "error" | "task_completed" | "system_alert"

// 通知接收者类型
export type NotificationRecipient = "all" | "admin" | "user" | string // 用户ID

// 通知数据类型
export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: number
  read: boolean
  link?: string
  data?: any
}

// 通知频道
const NOTIFICATION_CHANNEL = "notifications"

// 用户通知键前缀
const USER_NOTIFICATIONS_PREFIX = "user:notifications:"

/**
 * 发送通知
 * @param type 通知类型
 * @param title 通知标题
 * @param message 通知内容
 * @param recipient 接收者
 * @param data 附加数据
 * @returns 通知ID
 */
export async function sendNotification(
  type: NotificationType,
  title: string,
  message: string,
  recipient: NotificationRecipient = "all",
  data?: any,
): Promise<string> {
  try {
    // 生成通知ID
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // 创建通知数据
    const notification: NotificationData = {
      id: notificationId,
      type,
      title,
      message,
      createdAt: Date.now(),
      read: false,
      data,
    }

    // 存储通知
    if (recipient === "all") {
      // 广播通知，不存储
    } else {
      try {
        // 存储用户通知
        const userKey = `${USER_NOTIFICATIONS_PREFIX}${recipient}`
        await redis.lpush(userKey, JSON.stringify(notification))

        // 限制通知数量，保留最新的100条
        await redis.ltrim(userKey, 0, 99)
      } catch (error) {
        console.error("存储通知失败:", error)
      }
    }

    // 发布通知消息
    try {
      await publishMessage(NOTIFICATION_CHANNEL, {
        recipient,
        notification,
      })
    } catch (error) {
      console.error("发布通知消息失败:", error)
    }

    return notificationId
  } catch (error) {
    console.error("发送通知失败:", error)
    return `error_${Date.now()}`
  }
}

/**
 * 获取用户通知
 * @param userId 用户ID
 * @param limit 限制数量
 * @param offset 偏移量
 * @returns 通知列表
 */
export async function getUserNotifications(userId: string, limit = 20, offset = 0): Promise<NotificationData[]> {
  try {
    const userKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

    // 获取通知列表
    const notifications = await redis.lrange(userKey, offset, offset + limit - 1)

    // 解析通知数据
    return notifications.map((item) => {
      try {
        return JSON.parse(item) as NotificationData
      } catch (e) {
        console.error("解析通知数据失败:", e)
        return {
          id: `error_${Date.now()}`,
          type: "error",
          title: "无效通知",
          message: "无法解析通知数据",
          createdAt: Date.now(),
          read: true,
        }
      }
    })
  } catch (error) {
    console.error("获取用户通知失败:", error)
    return []
  }
}

/**
 * 标记通知为已读
 * @param userId 用户ID
 * @param notificationId 通知ID
 * @returns 是否成功
 */
export async function markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
  const userKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

  // 获取通知列表
  const notifications = await redis.lrange(userKey, 0, -1)

  // 查找并更新通知
  let updated = false
  const updatedNotifications = notifications.map((item) => {
    const notification = JSON.parse(item) as NotificationData

    if (notification.id === notificationId && !notification.read) {
      notification.read = true
      updated = true
    }

    return JSON.stringify(notification)
  })

  if (updated) {
    // 删除旧通知列表
    await redis.del(userKey)

    // 存储更新后的通知列表
    if (updatedNotifications.length > 0) {
      await redis.rpush(userKey, ...updatedNotifications)
    }
  }

  return updated
}

/**
 * 标记所有通知为已读
 * @param userId 用户ID
 * @returns 已读通知数量
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const userKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

  // 获取通知列表
  const notifications = await redis.lrange(userKey, 0, -1)

  // 更新所有未读通知
  let count = 0
  const updatedNotifications = notifications.map((item) => {
    const notification = JSON.parse(item) as NotificationData

    if (!notification.read) {
      notification.read = true
      count++
    }

    return JSON.stringify(notification)
  })

  if (count > 0) {
    // 删除旧通知列表
    await redis.del(userKey)

    // 存储更新后的通知列表
    if (updatedNotifications.length > 0) {
      await redis.rpush(userKey, ...updatedNotifications)
    }
  }

  return count
}

/**
 * 删除通知
 * @param userId 用户ID
 * @param notificationId 通知ID
 * @returns 是否成功
 */
export async function deleteNotification(userId: string, notificationId: string): Promise<boolean> {
  const userKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

  // 获取通知列表
  const notifications = await redis.lrange(userKey, 0, -1)

  // 过滤掉要删除的通知
  const filteredNotifications = notifications.filter((item) => {
    const notification = JSON.parse(item) as NotificationData
    return notification.id !== notificationId
  })

  // 如果有通知被删除
  if (filteredNotifications.length < notifications.length) {
    // 删除旧通知列表
    await redis.del(userKey)

    // 存储过滤后的通知列表
    if (filteredNotifications.length > 0) {
      await redis.rpush(userKey, ...filteredNotifications)
    }

    return true
  }

  return false
}

/**
 * 获取未读通知数量
 * @param userId 用户ID
 * @returns 未读通知数量
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const userKey = `${USER_NOTIFICATIONS_PREFIX}${userId}`

  // 获取通知列表
  const notifications = await redis.lrange(userKey, 0, -1)

  // 计算未读通知数量
  return notifications.reduce((count, item) => {
    const notification = JSON.parse(item) as NotificationData
    return notification.read ? count : count + 1
  }, 0)
}
