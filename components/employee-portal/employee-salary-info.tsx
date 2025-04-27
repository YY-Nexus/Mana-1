"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Download, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// 模拟薪资数据
const SALARY_DATA = [
  {
    month: "2023-04",
    baseSalary: 15000,
    bonus: 3000,
    overtime: 800,
    allowance: 1200,
    insurance: -1000,
    tax: -1200,
    total: 17800,
    status: "已发放",
  },
  {
    month: "2023-03",
    baseSalary: 15000,
    bonus: 2500,
    overtime: 600,
    allowance: 1200,
    insurance: -1000,
    tax: -1100,
    total: 17200,
    status: "已发放",
  },
  {
    month: "2023-02",
    baseSalary: 15000,
    bonus: 2500,
    overtime: 500,
    allowance: 1200,
    insurance: -1000,
    tax: -1100,
    total: 17100,
    status: "已发放",
  },
  {
    month: "2023-01",
    baseSalary: 15000,
    bonus: 2000,
    overtime: 700,
    allowance: 1200,
    insurance: -1000,
    tax: -1000,
    total: 16900,
    status: "已发放",
  },
  {
    month: "2022-12",
    baseSalary: 14000,
    bonus: 5000,
    overtime: 900,
    allowance: 1200,
    insurance: -900,
    tax: -1500,
    total: 18700,
    status: "已发放",
  },
  {
    month: "2022-11",
    baseSalary: 14000,
    bonus: 2000,
    overtime: 600,
    allowance: 1200,
    insurance: -900,
    tax: -1000,
    total: 15900,
    status: "已发放",
  },
]

export function EmployeeSalaryInfo() {
  const { toast } = useToast()
  const [year, setYear] = useState("2023")

  const handleDownload = (month: string) => {
    toast({
      title: "下载薪资单",
      description: `正在下载${month}薪资单...`,
    })
  }

  // 图表数据
  const salaryChartData = SALARY_DATA.map((item) => ({
    month: item.month,
    total: item.total,
    baseSalary: item.baseSalary,
    bonus: item.bonus,
  }))

  const salaryCompositionData = [
    { name: "基本工资", value: 15000 },
    { name: "绩效奖金", value: 3000 },
    { name: "加班工资", value: 800 },
    { name: "津贴", value: 1200 },
  ]

  const deductionsData = [
    { name: "社保", value: 1000 },
    { name: "个税", value: 1200 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">薪资信息</h2>
          <p className="text-muted-foreground">查看和下载您的薪资单</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择年份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023年</SelectItem>
              <SelectItem value="2022">2022年</SelectItem>
              <SelectItem value="2021">2021年</SelectItem>
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
          <TabsTrigger value="list">薪资列表</TabsTrigger>
          <TabsTrigger value="chart">薪资趋势</TabsTrigger>
          <TabsTrigger value="composition">薪资构成</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>月份</TableHead>
                    <TableHead>基本工资</TableHead>
                    <TableHead>绩效奖金</TableHead>
                    <TableHead>加班工资</TableHead>
                    <TableHead>津贴</TableHead>
                    <TableHead>社保</TableHead>
                    <TableHead>个税</TableHead>
                    <TableHead>实发工资</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SALARY_DATA.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell>¥{item.baseSalary.toLocaleString()}</TableCell>
                      <TableCell>¥{item.bonus.toLocaleString()}</TableCell>
                      <TableCell>¥{item.overtime.toLocaleString()}</TableCell>
                      <TableCell>¥{item.allowance.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">¥{item.insurance.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">¥{item.tax.toLocaleString()}</TableCell>
                      <TableCell className="font-bold">¥{item.total.toLocaleString()}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(item.month)}>
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

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>薪资趋势</CardTitle>
              <CardDescription>查看您的薪资变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart
                  data={salaryChartData}
                  index="month"
                  categories={["total", "baseSalary", "bonus"]}
                  colors={["blue", "green", "purple"]}
                  valueFormatter={(value) => `¥${value.toLocaleString()}`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="composition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>薪资构成</CardTitle>
                <CardDescription>当月薪资构成分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart
                    data={salaryCompositionData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `¥${value.toLocaleString()}`}
                    colors={["blue", "green", "purple", "amber"]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>扣除项目</CardTitle>
                <CardDescription>当月扣除项目分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={deductionsData}
                    index="name"
                    categories={["value"]}
                    colors={["red"]}
                    valueFormatter={(value) => `¥${Math.abs(value).toLocaleString()}`}
                    yAxisWidth={60}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>薪资说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">薪资组成</h3>
              <p className="text-sm text-muted-foreground">您的薪资由基本工资、绩效奖金、加班工资和津贴组成。</p>
            </div>
            <div>
              <h3 className="font-medium">扣除项目</h3>
              <p className="text-sm text-muted-foreground">扣除项目包括社会保险和个人所得税。</p>
            </div>
            <div>
              <h3 className="font-medium">发放时间</h3>
              <p className="text-sm text-muted-foreground">薪资将于每月10日发放到您的银行账户。</p>
            </div>
            <div>
              <h3 className="font-medium">问题咨询</h3>
              <p className="text-sm text-muted-foreground">如有薪资相关问题，请联系人力资源部：hr@example.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
