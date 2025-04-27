"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

// 导入语言包
import enUS from "@/i18n/locales/en-US.json"
import zhCN from "@/i18n/locales/zh-CN.json"

// 支持的语言
export type Locale = "en-US" | "zh-CN"

// 语言包类型
export type Messages = typeof enUS

// 语言包映射
const locales: Record<Locale, Messages> = {
  "en-US": enUS,
  "zh-CN": zhCN,
}

// 获取浏览器语言
const getBrowserLocale = (): Locale => {
  if (typeof window === "undefined") return "zh-CN" // 默认中文

  const browserLocale = navigator.language
  return browserLocale.startsWith("zh") ? "zh-CN" : "en-US"
}

// 国际化上下文类型
interface I18nContextType {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

// 创建上下文
const I18nContext = createContext<I18nContextType | undefined>(undefined)

// 国际化提供者
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh-CN") // 默认中文
  const [messages, setMessages] = useState<Messages>(zhCN)

  // 初始化语言
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null
    const initialLocale = savedLocale || getBrowserLocale()
    setLocale(initialLocale)
    setMessages(locales[initialLocale])
  }, [])

  // 切换语言
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    setMessages(locales[newLocale])
    localStorage.setItem("locale", newLocale)
  }

  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = messages

    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }

    return value === undefined ? key : value
  }

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale: handleSetLocale, t }}>{children}</I18nContext.Provider>
  )
}

// 使用国际化钩子
export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
