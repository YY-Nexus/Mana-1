"use client"

import type React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

// 图表容器属性
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

// 图表工具提示属性
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  className?: string
  formatter?: (value: number) => string
}

// 图表工具提示内容属性
interface ChartTooltipContentProps {
  className?: string
}

// 图表容器组件
export function ChartContainer({ children, config, className, ...props }: ChartContainerProps) {
  return (
    <div
      className={cn("chart-container", className)}
      style={
        {
          "--color-chart-1": config?.["1"]?.color || "hsl(var(--chart-1))",
          "--color-chart-2": config?.["2"]?.color || "hsl(var(--chart-2))",
          "--color-chart-3": config?.["3"]?.color || "hsl(var(--chart-3))",
          "--color-chart-4": config?.["4"]?.color || "hsl(var(--chart-4))",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

// 图表工具提示组件
export function ChartTooltip({ className, ...props }: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip content={<ChartTooltipContent />} cursor={{ opacity: 0.1 }} {...props} />
}

// 图表工具提示内容组件
export function ChartTooltipContent({ className, ...props }: ChartTooltipContentProps) {
  return <div className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props} />
}

// 柱状图组件
export function BarChart({
  data,
  xField = "name",
  yField = "value",
  categories,
  colors = ["var(--color-chart-1)"],
  className,
  ...props
}: {
  data: any[]
  xField?: string
  yField?: string
  categories?: string[]
  colors?: string[]
  className?: string
} & Omit<React.ComponentProps<typeof RechartsBarChart>, "data">) {
  const fields = categories || [yField]

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey={xField} />
        <YAxis />
        <ChartTooltip />
        <Legend />
        {fields.map((field, index) => (
          <Bar key={field} dataKey={field} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

// 折线图组件
export function LineChart({
  data,
  xField = "name",
  yField = "value",
  categories,
  colors = ["var(--color-chart-1)"],
  className,
  ...props
}: {
  data: any[]
  xField?: string
  yField?: string
  categories?: string[]
  colors?: string[]
  className?: string
} & Omit<React.ComponentProps<typeof RechartsLineChart>, "data">) {
  const fields = categories || [yField]

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey={xField} />
        <YAxis />
        <ChartTooltip />
        <Legend />
        {fields.map((field, index) => (
          <Line
            key={field}
            type="monotone"
            dataKey={field}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

// 雷达图组件
export function RadarChart({
  data,
  nameKey = "name",
  dataKey = "value",
  className,
  ...props
}: {
  data: any[]
  nameKey?: string
  dataKey?: string
  className?: string
} & Omit<React.ComponentProps<typeof RechartsRadarChart>, "data">) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsRadarChart data={data} {...props}>
        <PolarGrid />
        <PolarAngleAxis dataKey={nameKey} />
        <PolarRadiusAxis />
        <Radar
          name="数据"
          dataKey={dataKey}
          stroke="var(--color-chart-1)"
          fill="var(--color-chart-1)"
          fillOpacity={0.6}
        />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}

// 饼图组件
export function PieChart({
  data,
  nameKey = "name",
  dataKey = "value",
  colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"],
  className,
  ...props
}: {
  data: any[]
  nameKey?: string
  dataKey?: string
  colors?: string[]
  className?: string
} & Omit<React.ComponentProps<typeof RechartsPieChart>, "data">) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart {...props}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
