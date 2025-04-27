import Link from "next/link"
import { BrandHeader } from "@/components/brand-header"
import { FeatureCard } from "@/components/feature-card"
import { StatCard } from "@/components/stat-card"
import { DevelopmentPlan } from "@/components/development-plan"
import { Button } from "@/components/ui/button"
import {
  Users,
  Shield,
  Clock,
  FileText,
  BarChart3,
  Briefcase,
  Brain,
  MessageSquare,
  ArrowRight,
  Layers,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrandHeader />

      <main className="flex-1 container mx-auto px-4 pt-20 pb-10">
        <div className="content-overlay p-8 mb-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-title">言语『启智』运维管理中心</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              智能化运维管理系统，提升企业运营效率，实现数字化转型
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              title="权限管理"
              description="基于RBAC的权限管理系统，精细化控制用户权限"
              icon={Shield}
              href="/admin"
              color="blue"
            />
            <FeatureCard
              title="考勤管理"
              description="智能考勤系统，支持移动打卡、统计报表"
              icon={Clock}
              href="/attendance"
              color="indigo"
            />
            <FeatureCard
              title="薪资管理"
              description="完整的薪资计算、审批、发放流程"
              icon={Briefcase}
              href="/salary"
              color="purple"
            />
            <FeatureCard
              title="HR智能引擎"
              description="AI驱动的人力资源管理，包括智能招聘、培训"
              icon={Brain}
              href="/hr-engine"
              color="cyan"
            />
            <FeatureCard
              title="内容生成器"
              description="自动生成营销文案、海报设计等内容"
              icon={MessageSquare}
              href="/content-generator"
              color="emerald"
            />
            <FeatureCard
              title="流程引擎"
              description="自动化业务流程，提高工作效率"
              icon={Layers}
              href="/process-engine"
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="活跃用户" value="128" change="+12%" icon={Users} color="blue" />
            <StatCard title="考勤率" value="96.5%" change="+2.3%" icon={Clock} color="green" />
            <StatCard title="审批效率" value="3.2h" change="-15%" icon={FileText} color="indigo" />
            <StatCard title="系统负载" value="28%" change="稳定" icon={BarChart3} color="purple" />
          </div>

          <div className="flex justify-center mb-8">
            <Link href="/admin">
              <Button size="lg" className="gap-2">
                进入管理中心
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <DevelopmentPlan />
      </main>

      <footer className="content-overlay p-6 text-center">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} 言语『启智』运维管理中心 | 版本 1.0.0</p>
      </footer>
    </div>
  )
}
