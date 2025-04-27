import { Skeleton } from "@/components/ui/skeleton"

/**
 * 员工门户骨架屏组件
 * 在数据加载时显示
 */
export function EmployeePortalSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* 头部骨架 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* 统计卡片骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-5 w-[120px] mb-2" />
              <Skeleton className="h-8 w-[80px] mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
          ))}
      </div>

      {/* 主要内容骨架 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧面板 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 薪资信息骨架 */}
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-[150px] mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          {/* 考勤信息骨架 */}
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-[150px] mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-6">
          {/* 快速操作骨架 */}
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-[120px] mb-4" />
            <div className="space-y-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
          </div>

          {/* 公告骨架 */}
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-[100px] mb-4" />
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
