"use client"

import { useEffect, useState, useCallback } from "react"
import {
  type WebSocketEvent,
  type WebSocketEventType,
  onWebSocketEvent,
  initWebSocketClient,
  triggerEvent,
} from "@/lib/websocket-service"

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null)

  // 初始化WebSocket连接
  useEffect(() => {
    const client = initWebSocketClient()
    setIsConnected(client.isConnected())

    // 注册事件处理器
    const unsubscribe = onWebSocketEvent("all", (event) => {
      setLastEvent(event)
    })

    return () => {
      unsubscribe()
      client.disconnect()
    }
  }, [])

  // 注册特定类型的事件处理器
  const subscribe = useCallback((type: WebSocketEventType, handler: (data: any) => void) => {
    return onWebSocketEvent(type, (event) => {
      handler(event.data)
    })
  }, [])

  // 模拟发送事件（在预览环境中使用）
  const sendEvent = useCallback((type: WebSocketEventType, data: any) => {
    triggerEvent({
      type,
      data,
      timestamp: Date.now(),
    })
  }, [])

  return {
    isConnected,
    lastEvent,
    subscribe,
    sendEvent,
  }
}
