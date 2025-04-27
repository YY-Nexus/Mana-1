// 由于浏览器环境中无法直接使用Node.js的ws模块，我们需要创建一个客户端友好的WebSocket服务

// WebSocket事件类型
export type WebSocketEventType =
  | "queue-update" // 队列状态更新
  | "task-processed" // 任务处理完成
  | "task-failed" // 任务处理失败
  | "task-added" // 新任务添加到队列
  | "system-alert" // 系统警报

// WebSocket事件数据
export interface WebSocketEvent {
  type: WebSocketEventType
  data: any
  timestamp: number
}

// 模拟WebSocket连接状态
let isConnected = false
let eventHandlers: Record<string, ((event: WebSocketEvent) => void)[]> = {}

/**
 * 初始化WebSocket客户端
 */
export function initWebSocketClient() {
  console.log("WebSocket客户端初始化")

  // 在实际应用中，这里会创建真正的WebSocket连接
  // 但在预览环境中，我们只模拟连接状态
  isConnected = true

  // 模拟连接成功事件
  setTimeout(() => {
    triggerEvent({
      type: "queue-update",
      data: { queueLength: 5 },
      timestamp: Date.now(),
    })
  }, 1000)

  return {
    isConnected: () => isConnected,
    disconnect: () => {
      isConnected = false
      eventHandlers = {}
    },
  }
}

/**
 * 初始化WebSocket服务器
 * 在服务器端使用，用于创建WebSocket服务
 */
export function initWebSocketServer() {
  console.log("WebSocket服务器初始化")

  // 在实际应用中，这里会创建真正的WebSocket服务器
  // 但在预览环境中，我们只返回一个模拟对象
  return {
    broadcast: (event: WebSocketEvent) => {
      console.log(`广播事件: ${event.type}`, event.data)
    },
    close: () => {
      console.log("关闭WebSocket服务器")
    },
  }
}

/**
 * 广播任务添加事件
 * 在服务器端使用，通知所有客户端有新任务添加
 */
export function broadcastTaskAdded(taskId: string, taskType: string) {
  const server = initWebSocketServer()
  server.broadcast({
    type: "task-added",
    data: { taskId, taskType },
    timestamp: Date.now(),
  })
}

/**
 * 注册事件处理器
 */
export function onWebSocketEvent(type: WebSocketEventType | "all", handler: (event: WebSocketEvent) => void) {
  if (!eventHandlers[type]) {
    eventHandlers[type] = []
  }
  eventHandlers[type].push(handler)

  // 返回取消注册函数
  return () => {
    eventHandlers[type] = eventHandlers[type].filter((h) => h !== handler)
  }
}

/**
 * 触发事件
 */
export function triggerEvent(event: WebSocketEvent) {
  // 调用特定类型的处理器
  if (eventHandlers[event.type]) {
    eventHandlers[event.type].forEach((handler) => handler(event))
  }

  // 调用通用处理器
  if (eventHandlers["all"]) {
    eventHandlers["all"].forEach((handler) => handler(event))
  }
}

/**
 * 模拟发送队列更新事件
 */
export function simulateQueueUpdate(queueLength: number) {
  triggerEvent({
    type: "queue-update",
    data: { queueLength },
    timestamp: Date.now(),
  })
}

/**
 * 模拟发送任务处理完成事件
 */
export function simulateTaskProcessed(taskId: string, taskType: string) {
  triggerEvent({
    type: "task-processed",
    data: { taskId, taskType },
    timestamp: Date.now(),
  })
}

/**
 * 模拟发送任务处理失败事件
 */
export function simulateTaskFailed(taskId: string, taskType: string, error: string) {
  triggerEvent({
    type: "task-failed",
    data: { taskId, taskType, error },
    timestamp: Date.now(),
  })
}
