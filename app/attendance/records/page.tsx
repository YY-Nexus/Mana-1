import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "打卡记录 | 言语『启智』运维管理中心",
  description: "查看员工打卡记录和考勤异常",
}

export default function AttendanceRecordsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>打卡记录</CardTitle>
          <CardDescription>查看和管理员工打卡记录，处理考勤异常</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">打卡记录功能正在开发中，敬请期待...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
