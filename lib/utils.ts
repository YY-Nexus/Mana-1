import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期字符串，如：2023年4月21日
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 格式化时间
 * @param date 日期对象或日期字符串
 * @returns 格式化后的时间字符串，如：14:30:45
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

/**
 * 格式化日期时间
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期时间字符串，如：2023年4月21日 14:30:45
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}
