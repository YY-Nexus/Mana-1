"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Shield, Key, Settings, Home, Menu, BarChart, FileText, Database, Layers, Package } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: "控制面板", href: "/admin" },
    { icon: Users, label: "用户管理", href: "/admin/users" },
    { icon: Shield, label: "角色管理", href: "/admin/roles" },
    { icon: Key, label: "权限管理", href: "/admin/permissions" },
    { icon: BarChart, label: "数据分析", href: "/admin/analytics" },
    { icon: FileText, label: "系统日志", href: "/admin/logs" },
    { icon: Database, label: "数据备份", href: "/admin/backup" },
    { icon: Settings, label: "系统设置", href: "/admin/settings" },
    { icon: Layers, label: "处理引擎", href: "/process-engine" },
  ]

  const sidebarContent = (
    <div className="w-64 h-full content-overlay border-r border-blue-100 dark:border-blue-900 mt-16">
      <nav className="p-4">
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-4">主要功能</h3>
          <ul className="space-y-1">
            {menuItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={`nav-item flex items-center gap-3 px-4 py-2.5 ${isActive ? "active" : ""}`}
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-4">系统管理</h3>
          <ul className="space-y-1">
            {menuItems.slice(4).map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={`nav-item flex items-center gap-3 px-4 py-2.5 ${isActive ? "active" : ""}`}
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 工具部分 */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">开发工具</h2>
          <div className="space-y-1">
            <Link
              href="/tools/dependency-checker"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/tools/dependency-checker" ? "bg-accent" : "transparent",
              )}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>依赖检查</span>
            </Link>
            {/* 其他工具链接 */}
          </div>
        </div>
      </nav>
    </div>
  )

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden content-overlay m-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-16">
        {sidebarContent}
      </SheetContent>
    </Sheet>
  ) : (
    sidebarContent
  )
}
