import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "排班管理 | 言语『启智』运维管理中心",
  description: "管理员工排班和工作时间",
}

export default function AttendanceSchedulePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>排班管理</CardTitle>
          <CardDescription>创建和管理员工排班，设置工作时间和休息日</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">排班管理功能正在开发中，敬请期待...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
