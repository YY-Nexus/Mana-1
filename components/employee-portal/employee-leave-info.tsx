"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText, Plus } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// 模拟休假数据
const LEAVE_DATA = [
  {
    id: "L-2023-001",
    type: "年假",
    startDate: "2023-04-19",
    endDate: "2023-04-19",
    days: 1,
    reason: "个人事务",
    status: "approved",
    approver: "李经理",
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: "L-2023-002",
    type: "病假",
    startDate: "2023-03-10",
    endDate: "2023-03-11",
    days: 2,
    reason: "感冒发烧",
    status: "approved",
    approver: "李经理",
    createdAt: "2023-03-09T14:20:00Z",
  },
  {
    id: "L-2023-003",
    type: "事假",
    startDate: "2023-02-15",
    endDate: "2023-02-15",
    days: 1,
    reason: "家庭事务",
    status: "approved",
    approver: "李经理",
    createdAt: "2023-02-13T09:15:00Z",
  },
  {
    id: "L-2023-004",
    type: "年假",
    startDate: "2023-05-10",
    endDate: "2023-05-12",
    days: 3,
    reason: "休息",
    status: "pending",
    approver: "李经理",
    createdAt: "2023-04-25T16:45:00Z",
  },
]

// 休假类型
const LEAVE_TYPES = [
  { value: "annual", label: "年假" },
  { value: "sick", label: "病假" },
  { value: "personal", label: "事假" },
  { value: "marriage", label: "婚假" },
  { value: "maternity", label: "产假" },
  { value: "paternity", label: "陪产假" },
  { value: "bereavement", label: "丧假" },
]

// 休假余额
const LEAVE_BALANCE = [
  { type: "年假", total: 10, used: 2, remaining: 8 },
  { type: "病假", total: 5, used: 2, remaining: 3 },
  { type: "事假", total: 5, used: 1, remaining: 4 },
  { type: "婚假", total: 3, used: 0, remaining: 3 },
]

export function EmployeeLeaveInfo() {
  const { toast } = useToast()
  const [leaveType, setLeaveType] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            待审批
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            已批准
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            已拒绝
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            已取消
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 提交休假申请
  const handleSubmitLeave = () => {
    toast({
      title: "休假申请已提交",
      description: "您的休假申请已成功提交，请等待审批。",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">休假管理</h2>
          <p className="text-muted-foreground">查看和申请休假</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              申请休假
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>申请休假</DialogTitle>
              <DialogDescription>填写休假申请信息，提交后将发送给您的直属上级审批。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="leave-type">休假类型</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="选择休假类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>休假日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "yyyy-MM-dd", { locale: zhCN })} -{" "}
                            {format(dateRange.to, "yyyy-MM-dd", { locale: zhCN })}
                          </>
                        ) : (
                          format(dateRange.from, "yyyy-MM-dd", { locale: zhCN })
                        )
                      ) : (
                        "选择休假日期"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={zhCN}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">休假原因</Label>
                <Textarea id="reason" placeholder="请输入休假原因" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">紧急联系方式</Label>
                <Input id="contact" placeholder="请输入紧急联系方式" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">取消</Button>
              <Button onClick={handleSubmitLeave}>提交申请</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {LEAVE_BALANCE.map((item) => (
          <Card key={item.type}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">{item.type}余额</div>
                <div className="text-2xl font-bold">{item.remaining}天</div>
                <div className="text-xs text-muted-foreground">
                  总计: {item.total}天 | 已使用: {item.used}天
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部申请</TabsTrigger>
          <TabsTrigger value="pending">待审批</TabsTrigger>
          <TabsTrigger value="approved">已批准</TabsTrigger>
          <TabsTrigger value="rejected">已拒绝</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申请编号</TableHead>
                    <TableHead>休假类型</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>天数</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>审批人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAVE_DATA.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell>{item.endDate}</TableCell>
                      <TableCell>{item.days}天</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.approver}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">详情</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申请编号</TableHead>
                    <TableHead>休假类型</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>天数</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>审批人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAVE_DATA.filter((item) => item.status === "pending").map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell>{item.endDate}</TableCell>
                      <TableCell>{item.days}天</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.approver}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">详情</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申请编号</TableHead>
                    <TableHead>休假类型</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>天数</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>审批人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAVE_DATA.filter((item) => item.status === "approved").map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell>{item.endDate}</TableCell>
                      <TableCell>{item.days}天</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.approver}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">详情</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申请编号</TableHead>
                    <TableHead>休假类型</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>天数</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>审批人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAVE_DATA.filter((item) => item.status === "rejected").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        暂无已拒绝的休假申请
                      </TableCell>
                    </TableRow>
                  ) : (
                    LEAVE_DATA.filter((item) => item.status === "rejected").map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.startDate}</TableCell>
                        <TableCell>{item.endDate}</TableCell>
                        <TableCell>{item.days}天</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.approver}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">详情</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>休假政策</CardTitle>
          <CardDescription>公司休假政策说明</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">年假</h3>
              <p className="text-sm text-muted-foreground">
                工作满1年的员工每年可享受10天带薪年假，工作满5年的员工每年可享受15天带薪年假。年假可以分次使用，但每次不少于半天。
              </p>
            </div>
            <div>
              <h3 className="font-medium">病假</h3>
              <p className="text-sm text-muted-foreground">
                员工因病不能工作时，可以请病假。病假期间，前三天按照基本工资的80%发放，第四天起按照基本工资的60%发放。连续病假超过7天需提供医院证明。
              </p>
            </div>
            <div>
              <h3 className="font-medium">事假</h3>
              <p className="text-sm text-muted-foreground">
                员工因个人事务需要请假的，可以请事假。事假为无薪假期，不超过5天/年。
              </p>
            </div>
            <div>
              <h3 className="font-medium">婚假</h3>
              <p className="text-sm text-muted-foreground">
                员工结婚可享受3天婚假，晚婚（男性25周岁，女性23周岁以上）可增加3天婚假。
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">如有疑问，请联系人力资源部门。</p>
        </CardFooter>
      </Card>
    </div>
  )
}
