"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAttendanceReportData } from "@/lib/attendance"
import { useToast } from "@/components/ui/use-toast"

interface AttendanceRecord {
  id: string
  employeeId: string
  name: string
  department: string
  date: string
  checkIn: string
  checkOut: string
  workHours: number
  status: "normal" | "late" | "early" | "absent" | "overtime"
  notes: string
}

interface AttendanceReportPermissions {
  canExport: boolean
  canSchedule: boolean
  canManageSchedule: boolean
  canManageFields: boolean
}

export function AttendanceReportTable({ permissions }: { permissions: AttendanceReportPermissions }) {
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // 获取考勤数据
  const data = getAttendanceReportData()

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "employeeId",
      header: "工号",
      cell: ({ row }) => <div className="font-medium">{row.getValue("employeeId")}</div>,
    },
    {
      accessorKey: "name",
      header: "姓名",
    },
    {
      accessorKey: "department",
      header: "部门",
    },
    {
      accessorKey: "date",
      header: "日期",
    },
    {
      accessorKey: "checkIn",
      header: "签到时间",
    },
    {
      accessorKey: "checkOut",
      header: "签退时间",
    },
    {
      accessorKey: "workHours",
      header: "工作时长",
      cell: ({ row }) => <div>{row.getValue("workHours")}小时</div>,
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusMap = {
          normal: { label: "正常", variant: "outline", className: "bg-green-50 text-green-700 border-green-200" },
          late: { label: "迟到", variant: "outline", className: "bg-amber-50 text-amber-700 border-amber-200" },
          early: { label: "早退", variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200" },
          absent: { label: "缺勤", variant: "outline", className: "bg-red-50 text-red-700 border-red-200" },
          overtime: { label: "加班", variant: "outline", className: "bg-purple-50 text-purple-700 border-purple-200" },
        }

        const { label, className } = statusMap[status] || { label: status, className: "" }

        return (
          <Badge variant="outline" className={className}>
            {label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "notes",
      header: "备注",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const record = row.original

        return (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(record)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">查看详情</span>
            </Button>
            {permissions.canExport && (
              <Button variant="ghost" size="icon" onClick={() => handleExportSingle(record)}>
                <Download className="h-4 w-4" />
                <span className="sr-only">导出</span>
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleViewDetails = (record: AttendanceRecord) => {
    toast({
      title: "查看考勤详情",
      description: `员工: ${record.name}, 日期: ${record.date}`,
    })
  }

  const handleExportSingle = (record: AttendanceRecord) => {
    toast({
      title: "导出单条记录",
      description: `正在导出 ${record.name} 在 ${record.date} 的考勤记录`,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-1 items-center space-x-2">
          <div>
            <p className="text-sm text-muted-foreground">共 {table.getFilteredRowModel().rows.length} 条记录</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              显示列 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "employeeId"
                      ? "工号"
                      : column.id === "name"
                        ? "姓名"
                        : column.id === "department"
                          ? "部门"
                          : column.id === "date"
                            ? "日期"
                            : column.id === "checkIn"
                              ? "签到时间"
                              : column.id === "checkOut"
                                ? "签退时间"
                                : column.id === "workHours"
                                  ? "工作时长"
                                  : column.id === "status"
                                    ? "状态"
                                    : column.id === "notes"
                                      ? "备注"
                                      : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>已选择 {table.getFilteredSelectedRowModel().rows.length} 条记录</span>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}
