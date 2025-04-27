import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, getRoles, getPermissions } from "@/lib/db"
import { BarChart3, Users, Shield, Key, Activity, ArrowUpRight } from "lucide-react"

export default async function AdminDashboard() {
  // 获取统计数据
  const users = await getUsers()
  const roles = await getRoles()
  const permissions = await getPermissions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">管理控制面板</h1>
          <p className="text-gray-500 mt-1">欢迎使用言语『启智』运维管理中心，您可以在这里管理系统权限和用户。</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="tech-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">用户</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>系统中的用户总数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>较上月增长 5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="tech-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">角色</CardTitle>
              <Shield className="h-5 w-5 text-indigo-500" />
            </div>
            <CardDescription>系统中的角色总数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{roles.length}</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Activity className="h-4 w-4 mr-1" />
              <span>稳定</span>
            </div>
          </CardContent>
        </Card>

        <Card className="tech-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">权限</CardTitle>
              <Key className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>系统中的权限总数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{permissions.length}</div>
            <div className="flex items-center mt-2 text-sm text-blue-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>新增 2 项</span>
            </div>
          </CardContent>
        </Card>

        <Card className="tech-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">系统负载</CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>当前系统资源使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23%</div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>运行正常</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="tech-card">
          <CardHeader>
            <CardTitle>最近添加的用户</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <ul className="space-y-2">
                {users.slice(0, 5).map((user) => (
                  <li key={user.id} className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-md">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">暂无用户数据</p>
            )}
          </CardContent>
        </Card>

        <Card className="tech-card">
          <CardHeader>
            <CardTitle>系统角色</CardTitle>
          </CardHeader>
          <CardContent>
            {roles.length > 0 ? (
              <ul className="space-y-2">
                {roles.map((role) => (
                  <li key={role.id} className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-md">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">暂无角色数据</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="wave-container h-12 mt-8">
        <div className="wave"></div>
      </div>
    </div>
  )
}
