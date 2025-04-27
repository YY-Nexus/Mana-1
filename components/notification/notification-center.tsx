"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, Check, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// 通知类型
type NotificationType = "info" | "success" | "warning" | "error" | "task_completed" | "system_alert"

// 通知数据类型
interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: number
  read: boolean
  link?: string
  data?: any
}

// 默认通知数据
const DEFAULT_NOTIFICATIONS: NotificationData[] = [
  {
    id: "default_1",
    type: "info",
    title: "欢迎使用",
    message: "欢迎使用通知中心",
    createdAt: Date.now(),
    read: false,
  },
]

export function NotificationCenter() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // 加载通知
  const loadNotifications = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // 添加错误处理和超时
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`/api/notifications?userId=admin&t=${Date.now()}`, {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      clearTimeout(timeoutId)

      // 检查响应状态
      if (!response.ok) {
        const errorText = await response.text()
        console.error("通知API错误:", response.status, errorText)
        throw new Error(`API错误 (${response.status})`)
      }

      let data
      try {
        data = await response.json()
      } catch (e) {
        console.error("解析JSON失败:", e)
        throw new Error("无法解析API响应")
      }

      if (data && data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount((data.notifications || []).filter((n: NotificationData) => !n.read).length)
        setHasError(false)
        setRetryCount(0)
      } else {
        throw new Error(data?.message || "获取通知失败")
      }
    } catch (error) {
      console.error("加载通知失败:", error)

      // 如果是首次加载失败，使用默认通知
      if (notifications.length === 0) {
        setNotifications(DEFAULT_NOTIFICATIONS)
        setUnreadCount(DEFAULT_NOTIFICATIONS.filter((n) => !n.read).length)
      }

      setHasError(true)

      // 如果重试次数小于3，则在3秒后重试
      if (retryCount < 3) {
        setRetryCount((prev) => prev + 1)
        setTimeout(() => {
          loadNotifications()
        }, 3000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 标记通知为已读
  const markAsRead = async (notificationId: string) => {
    try {
      // 先更新本地状态，提供即时反馈
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))

      // 如果有错误，不发送请求
      if (hasError) return

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "admin",
          notificationId,
          action: "read",
        }),
      })

      if (!response.ok) {
        throw new Error(`API错误 (${response.status})`)
      }
    } catch (error) {
      console.error("标记通知已读失败:", error)
      // 错误已处理，不需要回滚UI状态
    }
  }

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    try {
      // 先更新本地状态，提供即时反馈
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)

      // 如果有错误，不发送请求
      if (hasError) return

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "admin",
          action: "read_all",
        }),
      })

      if (!response.ok) {
        throw new Error(`API错误 (${response.status})`)
      }
    } catch (error) {
      console.error("标记所有通知已读失败:", error)
      // 错误已处理，不需要回滚UI状态
    }
  }

  // 删除通知
  const deleteNotification = async (notificationId: string) => {
    try {
      // 先更新本地状态，提供即时反馈
      const deletedNotification = notifications.find((n) => n.id === notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      // 如果有错误，不发送请求
      if (hasError) return

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "admin",
          notificationId,
          action: "delete",
        }),
      })

      if (!response.ok) {
        throw new Error(`API错误 (${response.status})`)
      }
    } catch (error) {
      console.error("删除通知失败:", error)
      // 错误已处理，不需要回滚UI状态
    }
  }

  // 获取通知图标
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "system_alert":
        return <AlertTriangle className="h-4 w-4 text-purple-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)

      if (diffSec < 60) {
        return "刚刚"
      } else if (diffMin < 60) {
        return `${diffMin}分钟前`
      } else if (diffHour < 24) {
        return `${diffHour}小时前`
      } else if (diffDay < 30) {
        return `${diffDay}天前`
      } else {
        return date.toLocaleDateString()
      }
    } catch (error) {
      console.error("格式化时间错误:", error)
      return "未知时间"
    }
  }

  // 过滤通知
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  // 初始加载和打开时刷新
  useEffect(() => {
    loadNotifications()

    // 每60秒刷新一次
    const interval = setInterval(loadNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] bg-red-500 text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">通知中心</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={loadNotifications} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                <Check className="h-3 w-3 mr-1" />
                全部已读
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start px-4 pt-2 bg-transparent">
            <TabsTrigger value="all" className="text-xs">
              全部
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              未读
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              信息
            </TabsTrigger>
            <TabsTrigger value="success" className="text-xs">
              成功
            </TabsTrigger>
            <TabsTrigger value="warning" className="text-xs">
              警告
            </TabsTrigger>
            <TabsTrigger value="error" className="text-xs">
              错误
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[300px]">
              {hasError && (
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <p className="text-xs text-amber-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    通知服务暂时不可用，显示本地缓存数据
                  </p>
                </div>
              )}

              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">暂无通知</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 ${!notification.read ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 break-words">{notification.message}</p>
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                            >
                              查看详情
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
