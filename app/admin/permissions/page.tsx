import Link from "next/link"
import { getPermissions } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PermissionTable } from "@/components/admin/permission-table"

export default async function PermissionsPage() {
  const permissions = await getPermissions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">权限管理</h1>
        <Link href="/admin/permissions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            添加权限
          </Button>
        </Link>
      </div>

      <PermissionTable permissions={permissions} />
    </div>
  )
}
