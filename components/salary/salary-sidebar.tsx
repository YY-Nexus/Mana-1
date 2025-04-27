"use client"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Sliders,
  ClipboardList,
  History,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function SalarySidebar() {
  const pathname = usePathname()
  const [isDarkMode] = useState(false)
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: BarChart3, label: "薪资概览", href: "/salary" },
    { icon: Users, label: "员工管理", href: "/salary/employees" },
    { icon: DollarSign, label: "薪资计算", href: "/salary/calculation" },
    { icon: ClipboardList, label: "薪资审批", href: "/salary/approval" },
    { icon: Calendar, label: "薪资发放", href: "/salary/payment" },
    { icon: History, label: "薪资历史", href: "/salary/history" },
    { icon: FileSpreadsheet, label: "薪资报表", href: "/salary/reports" },
    { icon: PieChart, label: "薪资分析", href: "/salary/analysis" },
    { icon: Sliders, label: "薪资设置", href: "/salary/settings" },
  ]

  const sidebarContent = (
    <aside className="w-64 flex-shrink-0 h-full">
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-blue-500/30"
                      : "bg-gradient-to-r from-blue-600/5 to-blue-700/5 border-blue-500/10"
                  } text-left font-medium border shadow-[inset_0_1px_1px_rgba(148,163,184,0.2)] hover:shadow-md transition-all`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="pl-6 pr-8 pt-6 pb-4">
          <SheetTitle>薪资管理系统</SheetTitle>
          <SheetDescription>请选择要访问的功能</SheetDescription>
        </SheetHeader>
        {sidebarContent}
      </SheetContent>
    </Sheet>
  ) : (
    sidebarContent
  )
}
