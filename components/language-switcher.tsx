"use client"

import { useI18n } from "@/contexts/i18n-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  const toggleLocale = () => {
    setLocale(locale === "zh-CN" ? "en-US" : "zh-CN")
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={locale === "zh-CN" ? "Switch to English" : "切换到中文"}
    >
      <Globe size={16} />
      <span>{locale === "zh-CN" ? "English" : "中文"}</span>
    </button>
  )
}
