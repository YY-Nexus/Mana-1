import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export function DevelopmentPlan() {
  const completedTasks = [
    "基础权限管理系统开发",
    "薪资管理系统基础功能",
    "考勤管理系统基础功能",
    "HR智能引擎原型开发",
    "系统UI优化与统一",
  ]

  const inProgressTasks = [
    "员工自助查询功能",
    "薪资审批流程优化",
    "考勤报表详细功能",
    "移动端打卡应用开发",
    "第三方地图服务集成",
  ]

  const plannedTasks = [
    "考勤报表导出功能",
    "考勤报表定时发送功能",
    "考勤数据可视化图表",
    "考勤报表权限控制",
    "考勤报表自定义字段",
    "AI训练模型优化",
    "移动端适配全面升级",
    "第三方服务集成扩展",
    "内容分发渠道拓展",
  ]

  return (
    <div className="content-overlay p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 brand-title">下一步开发计划</h2>
        <p className="text-gray-600 dark:text-gray-300">根据业务需求和用户反馈，我们制定了以下开发计划</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="tech-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <CardTitle>已完成功能</CardTitle>
            </div>
            <CardDescription>已经开发完成的系统功能</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completedTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="tech-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <CardTitle>进行中功能</CardTitle>
            </div>
            <CardDescription>正在开发的系统功能</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {inProgressTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="tech-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-blue-500" />
              <CardTitle>计划功能</CardTitle>
            </div>
            <CardDescription>计划开发的系统功能</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plannedTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Circle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-2">开发建议</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          基于当前系统状态和业务需求，我们建议按以下优先级进行开发：
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>
            <strong>移动端打卡应用</strong> - 提高考勤便捷性，满足移动办公需求
          </li>
          <li>
            <strong>考勤报表导出与定时发送</strong> - 提升管理效率，自动化报表分发
          </li>
          <li>
            <strong>薪资审批流程优化</strong> - 完善审批链条，提高薪资管理规范性
          </li>
          <li>
            <strong>考勤数据可视化</strong> - 直观展示考勤数据，辅助决策分析
          </li>
          <li>
            <strong>员工自助查询</strong> - 减轻HR工作负担，提升员工体验
          </li>
        </ol>
      </div>
    </div>
  )
}
