"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { assignPermissionToRole, removePermissionFromRole } from "@/lib/db"
import { toast } from "@/components/ui/use-toast"

type Permission = {
  id: number
  name: string
  description: string | null
  assigned: boolean
}

export function RolePermissionForm({
  roleId,
  permissions,
}: {
  roleId: number
  permissions: Permission[]
}) {
  const router = useRouter()
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    permissions.filter((p) => p.assigned).map((p) => p.id),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // 获取原始已分配权限
      const originalAssigned = permissions.filter((p) => p.assigned).map((p) => p.id)

      // 需要添加的权限
      const toAdd = selectedPermissions.filter((id) => !originalAssigned.includes(id))

      // 需要移除的权限
      const toRemove = originalAssigned.filter((id) => !selectedPermissions.includes(id))

      // 添加新权限
      for (const permissionId of toAdd) {
        await assignPermissionToRole(roleId, permissionId)
      }

      // 移除旧权限
      for (const permissionId of toRemove) {
        await removePermissionFromRole(roleId, permissionId)
      }

      toast({
        title: "权限更新成功",
        description: "角色权限已成功更新。",
      })

      router.refresh()
    } catch (error) {
      console.error("更新权限失败:", error)
      toast({
        title: "权限更新失败",
        description: "更新角色权限时发生错误。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>权限分配</CardTitle>
        <CardDescription>选择要分配给该角色的权限</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
              <Checkbox
                id={`permission-${permission.id}`}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={() => handleTogglePermission(permission.id)}
              />
              <div className="space-y-1">
                <label htmlFor={`permission-${permission.id}`} className="font-medium cursor-pointer">
                  {permission.name}
                </label>
                {permission.description && <p className="text-sm text-gray-500">{permission.description}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存权限"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
