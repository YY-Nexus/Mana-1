"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, DollarSign, FileText } from "lucide-react"

export function EmployeeStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">剩余年假</div>
              <div className="text-2xl font-bold">8天</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">本月薪资</div>
              <div className="text-2xl font-bold">¥16,800</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">本月加班</div>
              <div className="text-2xl font-bold">12小时</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-50 rounded-full">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">待办事项</div>
              <div className="text-2xl font-bold">3项</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
