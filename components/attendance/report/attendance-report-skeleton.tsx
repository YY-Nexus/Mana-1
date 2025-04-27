import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AttendanceReportSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-[200px]" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>

          <div className="border rounded-md">
            <div className="h-10 border-b px-4 flex items-center">
              <Skeleton className="h-4 w-full" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-b px-4 flex items-center">
                <div className="grid grid-cols-6 gap-4 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[100px]" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-[70px]" />
              <Skeleton className="h-9 w-[70px]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
