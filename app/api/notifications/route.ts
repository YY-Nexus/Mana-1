import { NextResponse } from "next/server"

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

// 获取通知列表
export async function GET(request: Request) {
  try {
    // 返回模拟数据，确保前端始终能获取到数据
    return NextResponse.json({
      success: true,
      notifications: getMockNotifications(),
    })
  } catch (error) {
    console.error("获取通知失败:", error)
    // 即使出错也返回模拟数据
    return NextResponse.json({
      success: true,
      notifications: getMockNotifications(),
    })
  }
}

// 添加模拟通知数据函数
function getMockNotifications(): NotificationData[] {
  return [
    {
      id: "notification_1",
      type: "info",
      title: "系统通知",
      message: "欢迎使用通知系统",
      createdAt: Date.now() - 3600000,
      read: false,
    },
    {
      id: "notification_2",
      type: "success",
      title: "任务完成",
      message: "数据导出任务已成功完成",
      createdAt: Date.now() - 7200000,
      read: true,
    },
    {
      id: "notification_3",
      type: "warning",
      title: "系统警告",
      message: "系统负载较高，请注意监控",
      createdAt: Date.now() - 10800000,
      read: false,
    },
  ]
}

// 发送通知
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, title, message } = body

    if (!type || !title || !message) {
      return NextResponse.json({ success: false, message: "缺少必要参数" }, { status: 400 })
    }

    // 模拟成功响应
    return NextResponse.json({
      success: true,
      message: "通知发送成功",
      notificationId: `notification_${Date.now()}`,
    })
  } catch (error) {
    console.error("发送通知失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: "发送通知失败",
      },
      { status: 500 },
    )
  }
}

// 标记通知为已读或删除通知
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { userId, notificationId, action } = body

    if (!userId || !action) {
      return NextResponse.json({ success: false, message: "缺少必要参数" }, { status: 400 })
    }

    // 模拟成功响应
    return NextResponse.json({
      success: true,
      message: "操作成功",
      result: true,
    })
  } catch (error) {
    console.error("操作通知失败:", error)
    return NextResponse.json(
      {
        success: false,
        message: "操作通知失败",
      },
      { status: 500 },
    )
  }
}
