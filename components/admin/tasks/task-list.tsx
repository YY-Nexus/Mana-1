"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock, Calendar, RefreshCw, MoreHorizontal, Play, Pause, Trash2, Edit } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { updateScheduledTask, deleteScheduledTask } from "@/lib/db/scheduled-tasks"
import { enqueueTask } from "@/lib/task-queue"
import { TaskEditDialog } from "@/components/admin/tasks/task-edit-dialog"

export function TaskList({ tasks, isLoading, onRefresh, onTaskUpdated, onTaskDeleted }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async (task) => {
    setIsUpdating(true)
    try {
      const newStatus = task.status === "active" ? "paused" : "active"
      await updateScheduledTask(task.id, { status: newStatus })
      if (onTaskUpdated) onTaskUpdated()
    } catch (error) {
      console.error("更新任务状态失败:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await deleteScheduledTask(taskToDelete.id)
      if (onTaskDeleted) onTaskDeleted()
    } catch (error) {
      console.error("删除任务失败:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleRunNow = async (task) => {
    try {
      await enqueueTask("scheduled_task", { taskId: task.id }, 1)
      if (onTaskUpdated) onTaskUpdated()
    } catch (error) {
      console.error("立即执行任务失败:", error)
    }
  }

  const getFrequencyText = (task) => {
    if (task.frequency === "daily") {
      return "每天"
    } else if (task.frequency === "weekly") {
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
      return `每${weekdays[Number.parseInt(task.day)]}`
    } else if (task.frequency === "monthly") {
      return `每月${task.day}日`
    }
    return task.frequency
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>定时任务列表</CardTitle>
            <CardDescription>查看和管理系统中的所有定时任务</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">暂无定时任务</h3>
              <p className="text-sm text-muted-foreground mt-1">点击"创建任务"标签页添加新的定时任务</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务名称</TableHead>
                    <TableHead>执行频率</TableHead>
                    <TableHead>下次执行</TableHead>
                    <TableHead>上次执行</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        {getFrequencyText(task)} {task.time}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(task.nextRun)} {formatTime(task.nextRun)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.lastRun ? (
                          <div className="flex flex-col">
                            <span>
                              {formatDate(task.lastRun)} {formatTime(task.lastRun)}
                            </span>
                            {task.lastStatus && (
                              <Badge
                                variant="outline"
                                className={
                                  task.lastStatus === "success"
                                    ? "bg-green-50 text-green-700 border-green-200 mt-1"
                                    : "bg-red-50 text-red-700 border-red-200 mt-1"
                                }
                              >
                                {task.lastStatus === "success" ? "成功" : "失败"}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">从未执行</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={task.status === "active"}
                            onCheckedChange={() => handleStatusToggle(task)}
                            disabled={isUpdating}
                          />
                          <span className={task.status === "active" ? "text-green-600" : "text-gray-500"}>
                            {task.status === "active" ? "已启用" : "已暂停"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">打开菜单</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRunNow(task)}>
                              <Play className="mr-2 h-4 w-4" />
                              立即执行
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusToggle(task)}>
                              {task.status === "active" ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  暂停任务
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  启用任务
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setTaskToEdit(task)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              编辑任务
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setTaskToDelete(task)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除任务
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除任务</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除任务 "{taskToDelete?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 编辑任务对话框 */}
      {taskToEdit && (
        <TaskEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          task={taskToEdit}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  )
}
