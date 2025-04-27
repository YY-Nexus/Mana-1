"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// 默认字段
const defaultFields = [
  { id: "employeeId", name: "工号", type: "text", required: true, visible: true, editable: false, system: true },
  { id: "name", name: "姓名", type: "text", required: true, visible: true, editable: false, system: true },
  { id: "department", name: "部门", type: "text", required: true, visible: true, editable: false, system: true },
  { id: "date", name: "日期", type: "date", required: true, visible: true, editable: false, system: true },
  { id: "checkIn", name: "签到时间", type: "time", required: true, visible: true, editable: true, system: true },
  { id: "checkOut", name: "签退时间", type: "time", required: true, visible: true, editable: true, system: true },
  { id: "workHours", name: "工作时长", type: "number", required: true, visible: true, editable: false, system: true },
  { id: "status", name: "状态", type: "select", required: true, visible: true, editable: true, system: true },
  { id: "notes", name: "备注", type: "textarea", required: false, visible: true, editable: true, system: true },
]

// 自定义字段
const customFields = [
  { id: "location", name: "工作地点", type: "text", required: false, visible: true, editable: true, system: false },
  { id: "project", name: "项目", type: "text", required: false, visible: true, editable: true, system: false },
  { id: "overtime", name: "加班时长", type: "number", required: false, visible: true, editable: true, system: false },
]

export default function AttendanceReportFields() {
  const [fields, setFields] = useState([...defaultFields, ...customFields])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [newField, setNewField] = useState({
    name: "",
    type: "text",
    required: false,
  })

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFields(items)
  }

  const handleToggleVisibility = (id: string) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, visible: !field.visible } : field)))
  }

  const handleToggleRequired = (id: string) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, required: !field.required } : field)))
  }

  const handleAddField = () => {
    if (!newField.name.trim()) {
      toast({
        title: "字段名称不能为空",
        variant: "destructive",
      })
      return
    }

    // 检查字段名称是否已存在
    if (fields.some((field) => field.name === newField.name)) {
      toast({
        title: "字段名称已存在",
        description: "请使用不同的字段名称",
        variant: "destructive",
      })
      return
    }

    const id = newField.name.toLowerCase().replace(/\s+/g, "_")

    const newFieldObj = {
      id,
      name: newField.name,
      type: newField.type,
      required: newField.required,
      visible: true,
      editable: true,
      system: false,
    }

    setFields([...fields, newFieldObj])
    setIsAddDialogOpen(false)

    // 重置表单
    setNewField({
      name: "",
      type: "text",
      required: false,
    })

    toast({
      title: "添加成功",
      description: `字段"${newField.name}"已添加`,
    })
  }

  const handleDeleteField = () => {
    if (fieldToDelete) {
      const fieldToRemove = fields.find((field) => field.id === fieldToDelete)

      if (fieldToRemove && fieldToRemove.system) {
        toast({
          title: "无法删除",
          description: "系统字段不能被删除",
          variant: "destructive",
        })
        return
      }

      setFields(fields.filter((field) => field.id !== fieldToDelete))
      setFieldToDelete(null)
      setIsDeleteDialogOpen(false)

      toast({
        title: "删除成功",
        description: "自定义字段已删除",
      })
    }
  }

  const handleSaveChanges = () => {
    setIsSaving(true)

    // 模拟保存操作
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "保存成功",
        description: "字段设置已更新",
      })
    }, 1000)
  }

  const getFieldTypeLabel = (type: string) => {
    const typeMap = {
      text: "文本",
      number: "数字",
      date: "日期",
      time: "时间",
      select: "选择",
      textarea: "多行文本",
    }
    return typeMap[type] || type
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>报表字段管理</CardTitle>
              <CardDescription>自定义考勤报表中显示的字段</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  添加字段
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>添加自定义字段</DialogTitle>
                  <DialogDescription>创建新的自定义字段以满足特定需求</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="field-name" className="text-right">
                      字段名称
                    </Label>
                    <Input
                      id="field-name"
                      value={newField.name}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      className="col-span-3"
                      placeholder="例如：工作地点"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="field-type" className="text-right">
                      字段类型
                    </Label>
                    <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="选择字段类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">文本</SelectItem>
                        <SelectItem value="number">数字</SelectItem>
                        <SelectItem value="date">日期</SelectItem>
                        <SelectItem value="time">时间</SelectItem>
                        <SelectItem value="select">选择</SelectItem>
                        <SelectItem value="textarea">多行文本</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">
                      <Label htmlFor="field-required">必填</Label>
                    </div>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Checkbox
                        id="field-required"
                        checked={newField.required}
                        onCheckedChange={(checked) => setNewField({ ...newField, required: !!checked })}
                      />
                      <Label htmlFor="field-required">设为必填字段</Label>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddField}>添加</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 py-2 px-4 font-medium text-sm text-muted-foreground">
                    <div className="col-span-1"></div>
                    <div className="col-span-3">字段名称</div>
                    <div className="col-span-2">类型</div>
                    <div className="col-span-2 text-center">显示</div>
                    <div className="col-span-2 text-center">必填</div>
                    <div className="col-span-2 text-right">操作</div>
                  </div>

                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-md border"
                        >
                          <div className="col-span-1">
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="col-span-3 font-medium">
                            {field.name}
                            {field.system && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                系统
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 text-gray-600">{getFieldTypeLabel(field.type)}</div>
                          <div className="col-span-2 flex justify-center">
                            <Switch
                              checked={field.visible}
                              onCheckedChange={() => handleToggleVisibility(field.id)}
                              disabled={field.system && field.required}
                            />
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <Switch
                              checked={field.required}
                              onCheckedChange={() => handleToggleRequired(field.id)}
                              disabled={field.system && field.required}
                            />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <AlertDialog
                              open={isDeleteDialogOpen && fieldToDelete === field.id}
                              onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open)
                                if (!open) setFieldToDelete(null)
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={field.system}
                                  onClick={() => {
                                    setFieldToDelete(field.id)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">删除</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    您确定要删除"{field.name}"字段吗？此操作无法撤销。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteField}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    删除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">提示：拖拽字段可以调整显示顺序</div>
            <Button onClick={handleSaveChanges} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "保存中..." : "保存更改"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>字段权限设置</CardTitle>
          <CardDescription>设置不同角色对字段的访问权限</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 py-2 px-4 font-medium text-sm text-muted-foreground">
              <div className="col-span-1">字段名称</div>
              <div className="col-span-1 text-center">管理员</div>
              <div className="col-span-1 text-center">部门经理</div>
              <div className="col-span-1 text-center">HR专员</div>
              <div className="col-span-1 text-center">普通员工</div>
            </div>

            {fields.map((field) => (
              <div key={field.id} className="grid grid-cols-5 gap-4 items-center p-4 bg-gray-50 rounded-md border">
                <div className="col-span-1 font-medium">{field.name}</div>
                <div className="col-span-1 flex justify-center">
                  <Checkbox checked={true} disabled />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Checkbox defaultChecked={field.id !== "notes"} />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Checkbox defaultChecked={!["project", "overtime"].includes(field.id)} />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Checkbox
                    defaultChecked={["employeeId", "name", "department", "date", "checkIn", "checkOut"].includes(
                      field.id,
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            onClick={() => {
              toast({
                title: "权限已保存",
                description: "字段权限设置已更新",
              })
            }}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            保存权限设置
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
