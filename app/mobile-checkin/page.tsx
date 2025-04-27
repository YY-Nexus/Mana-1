"use client"

import { useState, useEffect } from "react"
import { MobileCheckinApp } from "@/components/mobile/mobile-checkin-app"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export default function MobileCheckinPage() {
  const [mounted, setMounted] = useState(false)

  // 确保组件只在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 移动端头部 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">返回</span>
              </Button>
            </Link>
            <h1 className="text-lg font-medium">移动打卡</h1>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <h2 className="text-lg font-medium mb-4">菜单</h2>
                <nav className="space-y-2">
                  <Link href="/admin" className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    控制面板
                  </Link>
                  <Link
                    href="/attendance/reports"
                    className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    考勤报表
                  </Link>
                  <Link
                    href="/mobile-checkin"
                    className="block p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
                  >
                    移动打卡
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 container max-w-md mx-auto px-4 py-4">
        <MobileCheckinApp />
      </main>

      {/* 底部导航 */}
      <footer className="sticky bottom-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container max-w-md mx-auto px-4 h-14 flex items-center justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 言语『启智』运维管理中心 | 版本 1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
