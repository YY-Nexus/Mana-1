"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, HelpCircle, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function EmployeePortalHeader() {
  const { toast } = useToast()

  const handleNotification = () => {
    toast({
      title: "通知中心",
      description: "您有3条未读通知",
    })
  }

  const handleHelp = () => {
    toast({
      title: "帮助中心",
      description: "正在跳转到帮助中心...",
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src="/diverse-team-brainstorm.png" alt="员工头像" />
              <AvatarFallback>张</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">张三，欢迎回来</h1>
              <p className="text-muted-foreground">技术部 | 高级工程师</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="icon" onClick={handleNotification}>
              <Bell className="h-4 w-4" />
              <span className="sr-only">通知</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleHelp}>
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">帮助</span>
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              <span>日历</span>
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              <span>设置</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
