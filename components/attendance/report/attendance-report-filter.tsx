"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

export function AttendanceReportFilter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const handleReset = () => {
    setSearchTerm("")
    setDepartment("")
    setStatus("")
    setDateRange({ from: undefined, to: undefined })
  }

  const hasFilters = searchTerm || department || status || dateRange.from || dateRange.to

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索员工姓名或工号..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              <SelectItem value="tech">技术部</SelectItem>
              <SelectItem value="hr">人力资源部</SelectItem>
              <SelectItem value="finance">财务部</SelectItem>
              <SelectItem value="marketing">市场部</SelectItem>
              <SelectItem value="operations">运营部</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="考勤状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="normal">正常</SelectItem>
              <SelectItem value="late">迟到</SelectItem>
              <SelectItem value="early">早退</SelectItem>
              <SelectItem value="absent">缺勤</SelectItem>
              <SelectItem value="overtime">加班</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground",
                )}
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
                  "选择日期范围"
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

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={handleReset} className="h-10 w-10">
              <X className="h-4 w-4" />
              <span className="sr-only">清除筛选</span>
            </Button>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-3 w-3" />
          <span>已应用筛选条件</span>
          {searchTerm && <Badge variant="outline">搜索: {searchTerm}</Badge>}
          {department && (
            <Badge variant="outline">
              部门:{" "}
              {{
                tech: "技术部",
                hr: "人力资源部",
                finance: "财务部",
                marketing: "市场部",
                operations: "运营部",
              }[department] || department}
            </Badge>
          )}
          {status && (
            <Badge variant="outline">
              状态:{" "}
              {{
                normal: "正常",
                late: "迟到",
                early: "早退",
                absent: "缺勤",
                overtime: "加班",
              }[status] || status}
            </Badge>
          )}
          {(dateRange.from || dateRange.to) && (
            <Badge variant="outline">
              日期: {dateRange.from ? format(dateRange.from, "yyyy-MM-dd", { locale: zhCN }) : "不限"}
              {dateRange.to ? ` 至 ${format(dateRange.to, "yyyy-MM-dd", { locale: zhCN })}` : ""}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
