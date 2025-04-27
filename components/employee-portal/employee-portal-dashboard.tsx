"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeSalaryInfo } from "@/components/employee-portal/employee-salary-info"
import { EmployeeAttendanceInfo } from "@/components/employee-portal/employee-attendance-info"
import { EmployeeLeaveInfo } from "@/components/employee-portal/employee-leave-info"
import { EmployeePerformanceInfo } from "@/components/employee-portal/employee-performance-info"
import { EmployeeDocumentsInfo } from "@/components/employee-portal/employee-documents-info"
import { EmployeeTrainingInfo } from "@/components/employee-portal/employee-training-info"
import { EmployeeQuickActions } from "@/components/employee-portal/employee-quick-actions"
import { EmployeeAnnouncements } from "@/components/employee-portal/employee-announcements"
import { EmployeeStatCards } from "@/components/employee-portal/employee-stat-cards"

export function EmployeePortalDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <EmployeeStatCards />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
              <TabsTrigger value="overview" className="py-2">
                概览
              </TabsTrigger>
              <TabsTrigger value="salary" className="py-2">
                薪资
              </TabsTrigger>
              <TabsTrigger value="attendance" className="py-2">
                考勤
              </TabsTrigger>
              <TabsTrigger value="leave" className="py-2">
                休假
              </TabsTrigger>
              <TabsTrigger value="performance" className="py-2">
                绩效
              </TabsTrigger>
              <TabsTrigger value="documents" className="py-2">
                文档
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>个人信息</CardTitle>
                  <CardDescription>查看和更新您的个人信息</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">姓名</div>
                      <div className="font-medium">张三</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">工号</div>
                      <div className="font-medium">EMP001</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">部门</div>
                      <div className="font-medium">技术部</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">职位</div>
                      <div className="font-medium">高级工程师</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">入职日期</div>
                      <div className="font-medium">2020-01-15</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">直属上级</div>
                      <div className="font-medium">李经理</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">电子邮箱</div>
                      <div className="font-medium">zhangsan@example.com</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">联系电话</div>
                      <div className="font-medium">138****1234</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>最近考勤</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">今日签到</div>
                        <div className="text-sm font-medium text-green-600">08:55</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">昨日签到</div>
                        <div className="text-sm font-medium text-green-600">08:50</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">昨日签退</div>
                        <div className="text-sm font-medium text-green-600">18:05</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">本月出勤</div>
                        <div className="text-sm font-medium">21天</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>最近薪资</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">2023年4月</div>
                        <div className="text-sm font-medium">¥16,800</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">2023年3月</div>
                        <div className="text-sm font-medium">¥16,500</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">2023年2月</div>
                        <div className="text-sm font-medium">¥16,500</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">2023年1月</div>
                        <div className="text-sm font-medium">¥16,200</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="salary" className="space-y-4">
              <EmployeeSalaryInfo />
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <EmployeeAttendanceInfo />
            </TabsContent>

            <TabsContent value="leave" className="space-y-4">
              <EmployeeLeaveInfo />
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <EmployeePerformanceInfo />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <EmployeeDocumentsInfo />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <EmployeeQuickActions />
          <EmployeeTrainingInfo />
          <EmployeeAnnouncements />
        </div>
      </div>
    </div>
  )
}
