import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="content-overlay text-center space-y-6 p-8 max-w-md">
        <div className="flex justify-center">
          <ShieldAlert className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold">访问被拒绝</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          您没有权限访问此页面。请联系系统管理员获取适当的权限，或返回首页。
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline">返回管理面板</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
