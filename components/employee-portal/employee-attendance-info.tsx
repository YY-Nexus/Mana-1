"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart } from "@/components/ui/chart"
import { Clock, Download, Filter } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

// 模拟考勤数据
const ATTENDANCE_DATA = [
  {
    date: "2023-04-25",
    checkIn: "08:55",
    checkOut: "18:10",
    workHours: 9.25,
    status: "normal",
    location: "公司办公室",
  },
  {
    date: "2023-04-24",
    checkIn: "08:50",
    checkOut: "18:05",
    workHours: 9.25,
    status: "normal",
    location: "公司办公室",
  },
  {
    date: "2023-04-23",
    checkIn: "09:10",
    checkOut: "18:15",
    workHours: 9.08,
    status: "late",
    location: "公司办公室",
  },
  {
    date: "2023-04-22",
    checkIn: "08:45",
    checkOut: "19:30",
    workHours: 10.75,
    status: "overtime",
    location: "公司办公室",
  },
  {
    date: "2023-04-21",
    checkIn: "08:50",
    checkOut: "18:00",
    workHours: 9.17,
    status: "normal",
    location: "公司办公室",
  },
  {
    date: "2023-04-20",
    checkIn: "08:55",
    checkOut: "17:45",
    workHours: 8.83,
    status: "early",
    location: "公司办公室",
  },
  {
    date: "2023-04-19",
    checkIn: null,
    checkOut: null,
    workHours: 0,
    status: "leave",
    location: "年假",
  },
]

export function EmployeeAttendanceInfo() {
  const [month, setMonth] = useState("2023-04")
  const [date, setDate] = useState<Date | undefined>(new Date())

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            正常
          </Badge>
        )
      case "late":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            迟到
          </Badge>
        )
      case "early":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            早退
          </Badge>
        )
      case "absent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            缺勤
          </Badge>
        )
      case "leave":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            请假
          </Badge>
        )
      case "overtime":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            加班
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 考勤统计数据
  const attendanceStats = [
    { name: "正常", value: 15 },
    { name: "迟到", value: 2 },
    { name: "早退", value: 1 },
    { name: "加班", value: 3 },
    { name: "请假", value: 1 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">考勤信息</h2>
          <p className="text-muted-foreground">查看您的考勤记录和统计</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择月份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-04">2023年4月</SelectItem>
              <SelectItem value="2023-03">2023年3月</SelectItem>
              <SelectItem value="2023-02">2023年2月</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">考勤记录</TabsTrigger>
          <TabsTrigger value="calendar">考勤日历</TabsTrigger>
          <TabsTrigger value="stats">考勤统计</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>签到时间</TableHead>
                    <TableHead>签退时间</TableHead>
                    <TableHead>工作时长</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>位置</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ATTENDANCE_DATA.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>{item.checkIn || "-"}</TableCell>
                      <TableCell>{item.checkOut || "-"}</TableCell>
                      <TableCell>{item.workHours > 0 ? `${item.workHours}小时` : "-"}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">下载</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>考勤日历</CardTitle>
              <CardDescription>查看每日考勤状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  locale={zhCN}
                  modifiers={{
                    normal: [new Date("2023-04-21"), new Date("2023-04-24"), new Date("2023-04-25")],
                    late: [new Date("2023-04-23")],
                    early: [new Date("2023-04-20")],
                    overtime: [new Date("2023-04-22")],
                    leave: [new Date("2023-04-19")],
                  }}
                  modifiersClassNames={{
                    normal: "bg-green-50 text-green-700",
                    late: "bg-amber-50 text-amber-700",
                    early: "bg-blue-50 text-blue-700",
                    overtime: "bg-indigo-50 text-indigo-700",
                    leave: "bg-purple-50 text-purple-700",
                  }}
                />

                {date && (
                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{format(date, "yyyy年MM月dd日", { locale: zhCN })}</CardTitle>
                      <CardDescription>{format(date, "EEEE", { locale: zhCN })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const selectedDate = format(date, "yyyy-MM-dd")
                        const record = ATTENDANCE_DATA.find((item) => item.date === selectedDate)

                        if (!record) {
                          return (
                            <div className="flex items-center justify-center h-32 text-muted-foreground">
                              暂无考勤记录
                            </div>
                          )
                        }

                        return (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">签到时间</div>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-green-600" />
                                  <span className="font-medium">{record.checkIn || "-"}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">签退时间</div>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-red-600" />
                                  <span className="font-medium">{record.checkOut || "-"}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">工作时长</div>
                                <div className="font-medium">
                                  {record.workHours > 0 ? `${record.workHours}小时` : "-"}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">状态</div>
                                <div>{getStatusBadge(record.status)}</div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">位置</div>
                              <div className="font-medium">{record.location}</div>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>考勤统计</CardTitle>
                <CardDescription>本月考勤状态统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={attendanceStats}
                    index="name"
                    categories={["value"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value}天`}
                    yAxisWidth={40}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>考勤汇总</CardTitle>
                <CardDescription>本月考勤汇总信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">应出勤天数</div>
                      <div className="text-2xl font-bold">22天</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">实际出勤天数</div>
                      <div className="text-2xl font-bold">21天</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">出勤率</div>
                      <div className="text-2xl font-bold">95.5%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">准时率</div>
                      <div className="text-2xl font-bold">90.5%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">详细统计</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">正常出勤</span>
                        <span className="text-sm font-medium">15天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">迟到</span>
                        <span className="text-sm font-medium">2天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">早退</span>
                        <span className="text-sm font-medium">1天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">加班</span>
                        <span className="text-sm font-medium">3天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">请假</span>
                        <span className="text-sm font-medium">1天</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">缺勤</span>
                        <span className="text-sm font-medium">0天</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
