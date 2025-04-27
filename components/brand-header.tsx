"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { NotificationCenter } from "@/components/notification/notification-center"

export function BrandHeader() {
  const isMobile = useMobile()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 检测系统暗色模式
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(isDark)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 content-overlay border-b border-blue-100 dark:border-blue-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold brand-title">言语『启智』运维管理中心</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
