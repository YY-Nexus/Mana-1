import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: "blue" | "indigo" | "purple" | "cyan" | "emerald" | "amber" | "red"
}

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-500 dark:text-blue-400",
    hover: "hover:border-blue-300 dark:hover:border-blue-700",
    shadow: "group-hover:shadow-blue-500/25",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    icon: "text-indigo-500 dark:text-indigo-400",
    hover: "hover:border-indigo-300 dark:hover:border-indigo-700",
    shadow: "group-hover:shadow-indigo-500/25",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-500 dark:text-purple-400",
    hover: "hover:border-purple-300 dark:hover:border-purple-700",
    shadow: "group-hover:shadow-purple-500/25",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-200 dark:border-cyan-800",
    icon: "text-cyan-500 dark:text-cyan-400",
    hover: "hover:border-cyan-300 dark:hover:border-cyan-700",
    shadow: "group-hover:shadow-cyan-500/25",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "text-emerald-500 dark:text-emerald-400",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    shadow: "group-hover:shadow-emerald-500/25",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: "text-amber-500 dark:text-amber-400",
    hover: "hover:border-amber-300 dark:hover:border-amber-700",
    shadow: "group-hover:shadow-amber-500/25",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-500 dark:text-red-400",
    hover: "hover:border-red-300 dark:hover:border-red-700",
    shadow: "group-hover:shadow-red-500/25",
  },
}

export function FeatureCard({ title, description, icon: Icon, href, color }: FeatureCardProps) {
  const colors = colorMap[color]

  return (
    <Link href={href} className="group">
      <div
        className={`
        h-full rounded-xl border ${colors.border} ${colors.bg} ${colors.hover}
        p-6 transition-all duration-200 
        hover:shadow-lg ${colors.shadow}
        flex flex-col
      `}
      >
        <div
          className={`
          rounded-full w-12 h-12 flex items-center justify-center
          ${colors.icon} mb-4
        `}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">{description}</p>
        <div className="flex justify-end mt-4">
          <span className={`text-sm font-medium ${colors.icon} flex items-center`}>查看详情</span>
        </div>
      </div>
    </Link>
  )
}
