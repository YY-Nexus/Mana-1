import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BarChart3, Building, Users } from "lucide-react"

export function SalaryReportSkeleton() {
  return (
    <div className="space-y-6">
      {/* 指标卡片骨架 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 标签页骨架 */}
      <Tabs defaultValue="efficiency">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="efficiency">
            <Clock className="mr-2 h-4 w-4" />
            审批效率
          </TabsTrigger>
          <TabsTrigger value="trends">
            <BarChart3 className="mr-2 h-4 w-4" />
            审批趋势
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building className="mr-2 h-4 w-4" />
            部门分析
          </TabsTrigger>
          <TabsTrigger value="approvers">
            <Users className="mr-2 h-4 w-4" />
            审批人分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="efficiency" className="space-y-6">
          {/* 效率指标骨架 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>

          {/* 时间分布骨架 */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
