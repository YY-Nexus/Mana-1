import { getRoleById, getPermissions, getRolePermissions } from "@/lib/db"
import { RolePermissionForm } from "@/components/admin/role-permission-form"
import { notFound } from "next/navigation"

export default async function RolePermissionsPage({
  params,
}: {
  params: { id: string }
}) {
  const roleId = Number.parseInt(params.id)

  // 获取角色信息
  const role = await getRoleById(roleId)
  if (!role) {
    notFound()
  }

  // 获取所有权限和角色已有权限
  const allPermissions = await getPermissions()
  const rolePermissions = await getRolePermissions(roleId)

  // 标记已分配的权限
  const permissionsWithAssigned = allPermissions.map((permission) => ({
    ...permission,
    assigned: rolePermissions.some((rp) => rp.id === permission.id),
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">角色权限管理</h1>
      <p className="text-gray-500">为角色 "{role.name}" 分配权限</p>

      <RolePermissionForm roleId={roleId} permissions={permissionsWithAssigned} />
    </div>
  )
}
