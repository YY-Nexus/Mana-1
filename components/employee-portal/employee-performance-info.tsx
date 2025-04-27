"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, RadarChart } from "@/components/ui/chart"
import { Filter } from "lucide-react"
import { useState } from "react"

// 模拟绩效数据
const PERFORMANCE_DATA = [
  {
    period: "2023-Q1",
    score: 4.2,
    level: "优秀",
    manager: "李经理",
    department: "技术部",
    strengths: ["技术能力强", "团队协作好", "解决问题能力强"],
    improvements: ["可以提高项目管理能力", "加强业务领域知识"],
    goals: ["完成系统重构", "提升代码质量", "指导新员工"],
    comments: "张三在本季度表现优秀，技术能力强，能够高效解决问题，团队协作能力也很好。建议在项目管理方面进一步提升。",
  },
  {
    period: "2022-Q4",
    score: 4.0,
    level: "优秀",
    manager: "李经理",
    department: "技术部",
    strengths: ["技术能力强", "责任心强", "学习能力强"],
    improvements: ["可以提高沟通效率", "加强团队协作"],
    goals: ["完成新功能开发", "优化系统性能", "学习新技术"],
    comments: "张三在本季度表现良好，技术能力强，责任心强，能够按时完成任务。建议在团队协作和沟通方面进一步提升。",
  },
  {
    period: "2022-Q3",
    score: 3.8,
    level: "良好",
    manager: "李经理",
    department: "技术部",
    strengths: ["技术基础扎实", "学习能力强"],
    improvements: ["需要提高代码质量", "加强团队协作", "提高沟通效率"],
    goals: ["完成模块开发", "提升代码质量", "学习新技术"],
    comments: "张三在本季度表现良好，技术基础扎实，学习能力强。建议在代码质量和团队协作方面进一步提升。",
  },
]

// 模拟技能评估数据
const SKILL_ASSESSMENT = [
  { skill: "技术能力", score: 90 },
  { skill: "团队协作", score: 85 },
  { skill: "沟通能力", score: 75 },
  { skill: "解决问题", score: 88 },
  { skill: "项目管理", score: 70 },
  { skill: "创新能力", score: 82 },
]

// 模拟绩效趋势数据
const PERFORMANCE_TREND = [
  { period: "2022-Q1", score: 3.5 },
  { period: "2022-Q2", score: 3.7 },
  { period: "2022-Q3", score: 3.8 },
  { period: "2022-Q4", score: 4.0 },
  { period: "2023-Q1", score: 4.2 },
]

// 模拟雷达图数据
const RADAR_DATA = [
  {
    name: "2022-Q3",
    技术能力: 80,
    团队协作: 70,
    沟通能力: 65,
    解决问题: 75,
    项目管理: 60,
    创新能力: 70,
  },
  {
    name: "2022-Q4",
    技术能力: 85,
    团队协作: 75,
    沟通能力: 70,
    解决问题: 80,
    项目管理: 65,
    创新能力: 75,
  },
  {
    name: "2023-Q1",
    技术能力: 90,
    团队协作: 85,
    沟通能力: 75,
    解决问题: 88,
    项目管理: 70,
    创新能力: 82,
  },
]

export function EmployeePerformanceInfo() {
  const [period, setPeriod] = useState("2023-Q1")
  const selectedPerformance = PERFORMANCE_DATA.find((item) => item.period === period) || PERFORMANCE_DATA[0]

  // 获取绩效等级标签
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "优秀":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">优秀</Badge>
      case "良好":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">良好</Badge>
      case "一般":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">一般</Badge>
      case "需改进":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">需改进</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">绩效评估</h2>
          <p className="text-muted-foreground">查看您的绩效评估结果和反馈</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择周期" />
            </SelectTrigger>
            <SelectContent>
              {PERFORMANCE_DATA.map((item) => (
                <SelectItem key={item.period} value={item.period}>
                  {item.period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">绩效概览</TabsTrigger>
          <TabsTrigger value="details">详细评估</TabsTrigger>
          <TabsTrigger value="trend">绩效趋势</TabsTrigger>
          <TabsTrigger value="skills">技能评估</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>绩效概览 - {selectedPerformance.period}</CardTitle>
              <CardDescription>查看您在{selectedPerformance.period}的绩效评估结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">绩效得分</div>
                    <div className="text-3xl font-bold">{selectedPerformance.score} / 5.0</div>
                    <Progress value={selectedPerformance.score * 20} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">绩效等级</div>
                    <div className="text-3xl font-bold">{getLevelBadge(selectedPerformance.level)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">评估人</div>
                    <div className="text-xl font-medium">{selectedPerformance.manager}</div>
                    <div className="text-sm text-muted-foreground">{selectedPerformance.department}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">优势</h3>
                    <ul className="space-y-1">
                      {selectedPerformance.strengths.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">改进方向</h3>
                    <ul className="space-y-1">
                      {selectedPerformance.improvements.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">绩效目标</h3>
                  <ul className="space-y-1">
                    {selectedPerformance.goals.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">评语</h3>
                  <p className="text-muted-foreground">{selectedPerformance.comments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>详细评估 - {selectedPerformance.period}</CardTitle>
              <CardDescription>查看详细的绩效评估指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">工作表现</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>工作质量</span>
                          <span className="font-medium">4.5 / 5.0</span>
                        </div>
                        <Progress value={4.5 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>工作效率</span>
                          <span className="font-medium">4.2 / 5.0</span>
                        </div>
                        <Progress value={4.2 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>责任心</span>
                          <span className="font-medium">4.3 / 5.0</span>
                        </div>
                        <Progress value={4.3 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>专业知识</span>
                          <span className="font-medium">4.5 / 5.0</span>
                        </div>
                        <Progress value={4.5 * 20} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">团队协作</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>沟通能力</span>
                          <span className="font-medium">3.8 / 5.0</span>
                        </div>
                        <Progress value={3.8 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>团队合作</span>
                          <span className="font-medium">4.2 / 5.0</span>
                        </div>
                        <Progress value={4.2 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>知识分享</span>
                          <span className="font-medium">4.0 / 5.0</span>
                        </div>
                        <Progress value={4.0 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>解决冲突</span>
                          <span className="font-medium">3.9 / 5.0</span>
                        </div>
                        <Progress value={3.9 * 20} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">领导力</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>决策能力</span>
                          <span className="font-medium">3.8 / 5.0</span>
                        </div>
                        <Progress value={3.8 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>影响力</span>
                          <span className="font-medium">3.7 / 5.0</span>
                        </div>
                        <Progress value={3.7 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>指导能力</span>
                          <span className="font-medium">4.0 / 5.0</span>
                        </div>
                        <Progress value={4.0 * 20} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">创新与发展</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>创新能力</span>
                          <span className="font-medium">4.1 / 5.0</span>
                        </div>
                        <Progress value={4.1 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>学习能力</span>
                          <span className="font-medium">4.4 / 5.0</span>
                        </div>
                        <Progress value={4.4 * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>适应能力</span>
                          <span className="font-medium">4.2 / 5.0</span>
                        </div>
                        <Progress value={4.2 * 20} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>绩效趋势</CardTitle>
                <CardDescription>查看您的绩效评分趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart
                    data={PERFORMANCE_TREND}
                    index="period"
                    categories={["score"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value.toFixed(1)}`}
                    yAxisWidth={40}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>能力雷达图</CardTitle>
                <CardDescription>查看您的能力评估雷达图</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <RadarChart
                    data={RADAR_DATA}
                    index="name"
                    categories={["技术能力", "团队协作", "沟通能力", "解决问题", "项目管理", "创新能力"]}
                    colors={["blue", "green", "purple"]}
                    valueFormatter={(value) => `${value}`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>技能评估</CardTitle>
              <CardDescription>查看您的技能评估结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">技能评分</h3>
                    <div className="space-y-4">
                      {SKILL_ASSESSMENT.map((item) => (
                        <div key={item.skill} className="space-y-2">
                          <div className="flex justify-between">
                            <span>{item.skill}</span>
                            <span className="font-medium">{item.score} / 100</span>
                          </div>
                          <Progress value={item.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">技能分布</h3>
                    <div className="h-[300px]">
                      <BarChart
                        data={SKILL_ASSESSMENT}
                        index="skill"
                        categories={["score"]}
                        colors={["blue"]}
                        valueFormatter={(value) => `${value}`}
                        yAxisWidth={40}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">技能提升建议</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium">项目管理能力</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        建议参加项目管理培训课程，学习项目计划、风险管理和资源分配等知识，并在实际项目中应用。
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium">沟通能力</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        建议参加沟通技巧培训，提高表达能力和倾听能力，在团队会议中多发言，主动与团队成员和其他部门沟通。
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium">业务领域知识</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        建议深入了解业务流程和需求，与业务部门多交流，参与业务分析会议，提高对业务的理解能力。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
