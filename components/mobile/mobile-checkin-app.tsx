"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Coffee,
  Briefcase,
  Home,
  Calendar,
  BarChart3,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

// 模拟位置数据
const MOCK_LOCATION = {
  latitude: 39.9123,
  longitude: 116.4551,
  accuracy: 15.5,
}

export function MobileCheckinApp() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error" | "mock">("loading")
  const [checkInStatus, setCheckInStatus] = useState<"none" | "checking" | "success" | "error">("none")
  const [checkInProgress, setCheckInProgress] = useState(0)
  const [checkInType, setCheckInType] = useState<"check-in" | "check-out" | "break-start" | "break-end">("check-in")
  const [activeTab, setActiveTab] = useState("checkin")
  const [checkInHistory, setCheckInHistory] = useState<
    Array<{
      type: string
      time: Date
      location: string
      status: string
    }>
  >([])

  const { toast } = useToast()

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 获取位置信息
  useEffect(() => {
    setLocationStatus("loading")

    // 尝试获取真实位置
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            })
            setLocationStatus("success")
          },
          (error) => {
            console.error("Error getting location:", error)
            // 使用模拟位置数据
            setLocation(MOCK_LOCATION)
            setLocationStatus("mock")
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        // 使用模拟位置数据
        setLocation(MOCK_LOCATION)
        setLocationStatus("mock")
      }
    } else {
      // 浏览器不支持地理位置
      setLocation(MOCK_LOCATION)
      setLocationStatus("mock")
    }
  }, [])

  // 模拟打卡
  const handleCheckIn = () => {
    setCheckInStatus("checking")
    setCheckInProgress(0)

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      setCheckInProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 20)
        return newProgress > 90 ? 90 : newProgress
      })
    }, 300)

    // 模拟打卡完成
    setTimeout(() => {
      clearInterval(progressInterval)
      setCheckInProgress(100)

      // 随机成功或失败（90%成功率）
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        setCheckInStatus("success")
        // 添加打卡记录
        setCheckInHistory([
          {
            type: getCheckInTypeLabel(checkInType),
            time: new Date(),
            location: "公司办公室",
            status: "成功",
          },
          ...checkInHistory,
        ])

        // 更新下一次打卡类型
        updateNextCheckInType()

        toast({
          title: "打卡成功",
          description: `您已成功完成${getCheckInTypeLabel(checkInType)}`,
          variant: "default",
        })
      } else {
        setCheckInStatus("error")
        toast({
          title: "打卡失败",
          description: "请检查您的位置信息是否正确，或稍后重试",
          variant: "destructive",
        })
      }

      // 3秒后重置状态
      setTimeout(() => {
        setCheckInStatus("none")
      }, 3000)
    }, 2000)
  }

  // 更新下一次打卡类型
  const updateNextCheckInType = () => {
    switch (checkInType) {
      case "check-in":
        setCheckInType("break-start")
        break
      case "break-start":
        setCheckInType("break-end")
        break
      case "break-end":
        setCheckInType("check-out")
        break
      case "check-out":
        setCheckInType("check-in")
        break
    }
  }

  // 获取打卡类型标签
  const getCheckInTypeLabel = (type: string) => {
    switch (type) {
      case "check-in":
        return "上班打卡"
      case "check-out":
        return "下班打卡"
      case "break-start":
        return "休息开始"
      case "break-end":
        return "休息结束"
      default:
        return type
    }
  }

  // 获取打卡类型图标
  const getCheckInTypeIcon = (type: string) => {
    switch (type) {
      case "check-in":
        return <Briefcase className="h-5 w-5" />
      case "check-out":
        return <Home className="h-5 w-5" />
      case "break-start":
        return <Coffee className="h-5 w-5" />
      case "break-end":
        return <Briefcase className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  // 渲染打卡界面
  const renderCheckinTab = () => (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold"
            >
              {formatTime(currentTime)}
            </motion.div>
            <div className="text-sm text-gray-500 mt-1">{formatDate(currentTime)}</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">位置信息</div>
              <div>
                {locationStatus === "loading" && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    获取中
                  </Badge>
                )}
                {locationStatus === "success" && (
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    已获取
                  </Badge>
                )}
                {locationStatus === "mock" && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    模拟位置
                  </Badge>
                )}
                {locationStatus === "error" && (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    获取失败
                  </Badge>
                )}
              </div>
            </div>

            {(locationStatus === "success" || locationStatus === "mock") && location && (
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <div>公司办公室</div>
                    <div className="text-xs text-gray-500 mt-1">
                      经度: {location.longitude.toFixed(6)}, 纬度: {location.latitude.toFixed(6)}
                    </div>
                    <div className="text-xs text-gray-500">精确度: {location.accuracy.toFixed(2)}米</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">打卡类型</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={checkInType === "check-in" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setCheckInType("check-in")}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                上班打卡
              </Button>
              <Button
                variant={checkInType === "check-out" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setCheckInType("check-out")}
              >
                <Home className="h-4 w-4 mr-2" />
                下班打卡
              </Button>
              <Button
                variant={checkInType === "break-start" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setCheckInType("break-start")}
              >
                <Coffee className="h-4 w-4 mr-2" />
                休息开始
              </Button>
              <Button
                variant={checkInType === "break-end" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setCheckInType("break-end")}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                休息结束
              </Button>
            </div>
          </div>

          {checkInStatus === "checking" ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">打卡进度</span>
                <span className="text-sm">{checkInProgress}%</span>
              </div>
              <Progress value={checkInProgress} className="h-2" />
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>正在处理打卡请求，请稍候...</span>
                </div>
              </div>
            </div>
          ) : checkInStatus === "success" ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                您已成功完成{getCheckInTypeLabel(checkInType)}，打卡时间：{formatTime(new Date())}
              </AlertDescription>
            </Alert>
          ) : checkInStatus === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>请检查您的位置信息是否正确，或稍后重试。</AlertDescription>
            </Alert>
          ) : (
            <motion.div whileTap={{ scale: 0.95 }} className="mt-4">
              <Button
                className="w-full gap-2 h-12 text-lg"
                disabled={(locationStatus !== "success" && locationStatus !== "mock") || checkInStatus === "checking"}
                onClick={handleCheckIn}
              >
                {getCheckInTypeIcon(checkInType)}
                {getCheckInTypeLabel(checkInType)}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">今日打卡记录</CardTitle>
        </CardHeader>
        <CardContent>
          {checkInHistory.length > 0 ? (
            <div className="space-y-2">
              {checkInHistory.map((record, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {record.type === "上班打卡" && <Briefcase className="h-4 w-4 text-blue-500" />}
                    {record.type === "下班打卡" && <Home className="h-4 w-4 text-blue-500" />}
                    {record.type === "休息开始" && <Coffee className="h-4 w-4 text-blue-500" />}
                    {record.type === "休息结束" && <Briefcase className="h-4 w-4 text-blue-500" />}
                    <div>
                      <div className="text-sm font-medium">{record.type}</div>
                      <div className="text-xs text-gray-500">{record.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatTime(record.time)}</div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                      {record.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md border-gray-200">
              <div className="text-center">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">今日暂无打卡记录</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // 渲染统计界面
  const renderStatsTab = () => (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">考勤统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">本月出勤</div>
              <div className="text-2xl font-bold text-blue-600">21天</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">准时率</div>
              <div className="text-2xl font-bold text-green-600">95%</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">迟到</div>
              <div className="text-2xl font-bold text-amber-600">1次</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">加班</div>
              <div className="text-2xl font-bold text-purple-600">8小时</div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">本周考勤</h3>
            <div className="grid grid-cols-7 gap-1">
              {["一", "二", "三", "四", "五", "六", "日"].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500">周{day}</div>
                  <div
                    className={`
                    w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs mt-1
                    ${index < 4 ? "bg-green-100 text-green-600" : index === 4 ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"}
                  `}
                  >
                    {index < 5 ? "√" : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">考勤详情</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">正常出勤</span>
                <span className="text-sm font-medium">18天</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">迟到</span>
                <span className="text-sm font-medium">1天</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">早退</span>
                <span className="text-sm font-medium">0天</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">缺勤</span>
                <span className="text-sm font-medium">0天</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">请假</span>
                <span className="text-sm font-medium">2天</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 渲染日历界面
  const renderCalendarTab = () => (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">考勤日历</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">2023年4月</h3>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((day, index) => (
            <div key={index} className="text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1
            let status = "normal"

            // 模拟一些状态
            if (day === 5) status = "late"
            if (day === 12) status = "leave"
            if (day === 15) status = "absent"
            if (day === 20) status = "overtime"
            if (day > 21) status = "future"

            return (
              <div key={i} className="aspect-square p-1">
                <div
                  className={`
                  w-full h-full rounded-full flex items-center justify-center text-xs
                  ${
                    status === "normal"
                      ? "bg-green-100 text-green-600"
                      : status === "late"
                        ? "bg-amber-100 text-amber-600"
                        : status === "leave"
                          ? "bg-blue-100 text-blue-600"
                          : status === "absent"
                            ? "bg-red-100 text-red-600"
                            : status === "overtime"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-400"
                  }
                `}
                >
                  {day}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100"></div>
            <span className="text-xs text-gray-500">正常</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-100"></div>
            <span className="text-xs text-gray-500">迟到</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100"></div>
            <span className="text-xs text-gray-500">请假</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100"></div>
            <span className="text-xs text-gray-500">缺勤</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-100"></div>
            <span className="text-xs text-gray-500">加班</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-100"></div>
            <span className="text-xs text-gray-500">未到</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 h-14 mb-4">
          <TabsTrigger value="checkin" className="flex flex-col items-center justify-center space-y-1 h-full">
            <Clock className="h-4 w-4" />
            <span className="text-xs">打卡</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex flex-col items-center justify-center space-y-1 h-full">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">统计</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex flex-col items-center justify-center space-y-1 h-full">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">日历</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-0">
          {renderCheckinTab()}
        </TabsContent>

        <TabsContent value="stats" className="mt-0">
          {renderStatsTab()}
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          {renderCalendarTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
