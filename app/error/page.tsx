"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="content-overlay text-center space-y-6 p-8 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold">系统错误</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          抱歉，系统处理您的请求时发生了错误。请稍后再试，或联系系统管理员获取帮助。
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            刷新页面
          </Button>
        </div>
      </div>
    </div>
  )
}
