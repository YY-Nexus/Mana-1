"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarDays, ClipboardList, Clock, BarChart2 } from "lucide-react"

export function AttendanceHeader() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/attendance/reports",
      label: "考勤报表",
      icon: BarChart2,
      active: pathname === "/attendance/reports",
    },
    {
      href: "/attendance/records",
      label: "打卡记录",
      icon: ClipboardList,
      active: pathname === "/attendance/records",
    },
    {
      href: "/attendance/schedule",
      label: "排班管理",
      icon: CalendarDays,
      active: pathname === "/attendance/schedule",
    },
    {
      href: "/mobile-checkin",
      label: "在线打卡",
      icon: Clock,
      active: pathname === "/mobile-checkin",
    },
  ]

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">考勤管理</h1>
        <p className="text-muted-foreground">管理员工考勤、查看报表和处理异常情况</p>
      </div>
      <div className="flex items-center space-x-2 overflow-auto pb-2 md:pb-0">
        {navItems.map((item) => (
          <Button key={item.href} variant={item.active ? "default" : "outline"} size="sm" asChild>
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
