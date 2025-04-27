import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: "blue" | "green" | "indigo" | "purple" | "red" | "amber"
}

const colorMap = {
  blue: "text-blue-500 dark:text-blue-400",
  green: "text-green-500 dark:text-green-400",
  indigo: "text-indigo-500 dark:text-indigo-400",
  purple: "text-purple-500 dark:text-purple-400",
  red: "text-red-500 dark:text-red-400",
  amber: "text-amber-500 dark:text-amber-400",
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const iconColor = colorMap[color]

  const isPositive = change.startsWith("+")
  const isNegative = change.startsWith("-")
  const isNeutral = !isPositive && !isNegative

  let changeColor = "text-gray-500"
  let ChangeIcon = Minus

  if (isPositive) {
    changeColor = "text-green-500"
    ChangeIcon = ArrowUpRight
  } else if (isNegative) {
    changeColor = "text-red-500"
    ChangeIcon = ArrowDownRight
  }

  return (
    <Card className="tech-card">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={`flex items-center ${changeColor} text-sm`}>
            <ChangeIcon className="h-3 w-3 mr-1" />
            <span>{change}</span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
