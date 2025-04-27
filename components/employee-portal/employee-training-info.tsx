"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, BadgeIcon as Certificate, Clock, Play } from "lucide-react"

// 培训课程类型
interface TrainingCourse {
  id: string
  title: string
  description: string
  progress: number
  status: "not_started" | "in_progress" | "completed" | "expired"
  dueDate?: string
  certificateId?: string
}

// 组件属性
interface EmployeeTrainingInfoProps {
  courses?: TrainingCourse[]
  isLoading?: boolean
}

/**
 * 员工培训信息组件
 * 显示员工的培训课程和进度
 */
export function EmployeeTrainingInfo({ courses = [], isLoading = false }: EmployeeTrainingInfoProps) {
  // 如果没有提供课程数据，使用示例数据
  const trainingCourses =
    courses.length > 0
      ? courses
      : ([
          {
            id: "course-1",
            title: "信息安全基础培训",
            description: "了解公司信息安全政策和最佳实践",
            progress: 75,
            status: "in_progress",
            dueDate: "2023-12-31",
          },
          {
            id: "course-2",
            title: "新员工入职培训",
            description: "公司文化、制度和流程介绍",
            progress: 100,
            status: "completed",
            certificateId: "CERT-2023-001",
          },
          {
            id: "course-3",
            title: "职业发展规划",
            description: "职业发展路径和技能提升指南",
            progress: 0,
            status: "not_started",
          },
        ] as TrainingCourse[])

  // 获取状态标签
  const getStatusBadge = (status: TrainingCourse["status"]) => {
    switch (status) {
      case "not_started":
        return <Badge variant="outline">未开始</Badge>
      case "in_progress":
        return <Badge variant="secondary">进行中</Badge>
      case "completed":
        return <Badge variant="success">已完成</Badge>
      case "expired":
        return <Badge variant="destructive">已过期</Badge>
      default:
        return null
    }
  }

  // 获取操作按钮
  const getActionButton = (course: TrainingCourse) => {
    switch (course.status) {
      case "not_started":
        return (
          <Button size="sm" className="mt-2">
            <Play className="mr-1 h-4 w-4" />
            开始学习
          </Button>
        )
      case "in_progress":
        return (
          <Button size="sm" className="mt-2">
            <Play className="mr-1 h-4 w-4" />
            继续学习
          </Button>
        )
      case "completed":
        return (
          <Button size="sm" variant="outline" className="mt-2">
            <Certificate className="mr-1 h-4 w-4" />
            查看证书
          </Button>
        )
      case "expired":
        return (
          <Button size="sm" variant="outline" className="mt-2">
            <Clock className="mr-1 h-4 w-4" />
            申请延期
          </Button>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>培训与发展</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-gray-100 animate-pulse rounded-md" />
            <div className="h-20 bg-gray-100 animate-pulse rounded-md" />
            <div className="h-20 bg-gray-100 animate-pulse rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>培训与发展</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainingCourses.map((course) => (
            <div key={course.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{course.title}</h4>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
                {getStatusBadge(course.status)}
              </div>

              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>学习进度</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              {course.dueDate && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>截止日期: {course.dueDate}</span>
                </div>
              )}

              <div className="mt-2">{getActionButton(course)}</div>
            </div>
          ))}

          <Button variant="outline" className="w-full">
            查看全部培训课程
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
