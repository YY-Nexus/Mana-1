"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight } from "lucide-react"

// 公告类型
interface Announcement {
  id: string
  title: string
  date: string
  category: string
  isNew: boolean
  summary: string
}

// 组件属性
interface EmployeeAnnouncementsProps {
  announcements?: Announcement[]
  isLoading?: boolean
}

/**
 * 员工公告组件
 * 显示公司最新公告
 */
export function EmployeeAnnouncements({ announcements, isLoading = false }: EmployeeAnnouncementsProps) {
  // 默认公告数据
  const defaultAnnouncements: Announcement[] = [
    {
      id: "ann-1",
      title: "公司年度体检安排",
      date: "2023-11-15",
      category: "福利",
      isNew: true,
      summary: "年度体检将于下月开始，请各部门员工按照安排时间前往指定医院进行体检。",
    },
    {
      id: "ann-2",
      title: "办公系统升级通知",
      date: "2023-11-10",
      category: "系统",
      isNew: true,
      summary: "公司办公系统将于本周六进行升级维护，届时系统将暂停使用8小时。",
    },
    {
      id: "ann-3",
      title: "年终奖金发放通知",
      date: "2023-11-05",
      category: "薪资",
      isNew: false,
      summary: "2023年度年终奖金将于12月15日随当月工资一起发放，请留意工资单。",
    },
  ]

  // 使用提供的公告或默认公告
  const companyAnnouncements = announcements || defaultAnnouncements

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>公司公告</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>公司公告</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companyAnnouncements.map((announcement) => (
            <div key={announcement.id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">
                  {announcement.title}
                  {announcement.isNew && (
                    <Badge variant="secondary" className="ml-2">
                      新
                    </Badge>
                  )}
                </h4>
              </div>

              <div className="flex items-center text-xs text-gray-500 mt-1">
                <CalendarDays className="h-3 w-3 mr-1" />
                <span>{announcement.date}</span>
                <Badge variant="outline" className="ml-2">
                  {announcement.category}
                </Badge>
              </div>

              <p className="text-sm mt-2">{announcement.summary}</p>

              <Button variant="ghost" size="sm" className="mt-1 h-7 px-2">
                查看详情
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full">
            查看全部公告
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
