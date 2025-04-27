import Link from "next/link"
import { getRoles } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { RoleTable } from "@/components/admin/role-table"

export default async function RolesPage() {
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">角色管理</h1>
        <Link href="/admin/roles/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            添加角色
          </Button>
        </Link>
      </div>

      <RoleTable roles={roles} />
    </div>
  )
}
