import Link from "next/link"
import { getUsers } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { UserTable } from "@/components/admin/user-table"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">用户管理</h1>
        <Link href="/admin/users/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            添加用户
          </Button>
        </Link>
      </div>

      <UserTable users={users} />
    </div>
  )
}
