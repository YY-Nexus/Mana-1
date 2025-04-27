"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

type NotificationType = "success" | "error" | "warning" | "info"

interface NeuroNotificationProps {
  type?: NotificationType
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

export function NeuroNotification({ type = "info", title, message, duration = 5000, onClose }: NeuroNotificationProps) {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useI18n()

  // 处理关闭动画
  const handleClose = () => {
    setLeaving(true)
    setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, 300) // 动画持续时间
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose()
    }
  }

  useEffect(() => {
    // 自动关闭
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        handleClose()
      }, duration)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [duration])

  // 鼠标悬停时暂停计时器
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  // 鼠标离开时重新开始计时器
  const handleMouseLeave = () => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        handleClose()
      }, duration)
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} aria-hidden="true" />
      case "error":
        return <AlertCircle className="text-red-500" size={20} aria-hidden="true" />
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} aria-hidden="true" />
      case "info":
      default:
        return <Info className="text-blue-500" size={20} aria-hidden="true" />
    }
  }

  if (!visible) return null

  return (
    <div
      className={`neuro-notification ${type} ${leaving ? "opacity-0 transform translate-x-10" : ""}`}
      role="alert"
      aria-live="assertive"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "opacity 300ms, transform 300ms" }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs opacity-80 mt-1">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={t("common.close")}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
