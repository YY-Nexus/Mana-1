"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { NeuroCard } from "@/components/neuro-card"

export default function AttendancePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/attendance/reports")
  }, [router])

  // 显示加载状态，防止页面闪烁
  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <NeuroCard className="p-8 max-w-md">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">正在加载考勤管理页面...</div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse rounded-full"></div>
          </div>
        </div>
      </NeuroCard>
    </div>
  )
}
