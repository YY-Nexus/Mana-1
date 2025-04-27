"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, CheckCircle, AlertCircle, RefreshCw, Coffee, Briefcase, Home, Navigation } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

// 模拟位置数据（当真实位置不可用时使用）
const MOCK_LOCATION = {
  latitude: 39.9123,
  longitude: 116.4551,
  accuracy: 15.5,
}

export function AttendanceCheckIn() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<"loading" | "success" | "error" | "mock">("loading")
  const [checkInStatus, setCheckInStatus] = useState<"none" | "checking" | "success" | "error">("none")
  const [checkInProgress, setCheckInProgress] = useState(0)
  const [checkInType, setCheckInType] = useState<"check-in" | "check-out" | "break-start" | "break-end">("check-in")
  const [checkInHistory, setCheckInHistory] = useState<
    Array<{
      type: string
      time: Date
      location: string
      status: string
    }>
  >([])

  const isMobile = useMobile()

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
      } else {
        setCheckInStatus("error")
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>打卡签到</CardTitle>
          <CardDescription>员工定位打卡</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-500 mt-1">{formatDate(currentTime)}</div>
          </div>

          <Separator />

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
                    {locationStatus === "mock" && (
                      <div className="text-xs text-amber-500 mt-1">
                        注意：当前使用模拟位置数据，实际应用中将使用真实位置
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {locationStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>位置获取失败</AlertTitle>
                <AlertDescription>请确保已授予位置权限，并重试。</AlertDescription>
              </Alert>
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
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            disabled={(locationStatus !== "success" && locationStatus !== "mock") || checkInStatus === "checking"}
            onClick={handleCheckIn}
          >
            {checkInStatus === "checking" ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                打卡中...
              </>
            ) : (
              <>
                {getCheckInTypeIcon(checkInType)}
                {getCheckInTypeLabel(checkInType)}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>打卡状态</CardTitle>
          <CardDescription>今日打卡状态和记录</CardDescription>
        </CardHeader>
        <CardContent>
          {checkInStatus === "checking" ? (
            <div className="space-y-4">
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
              <AlertTitle className="text-green-600">打卡成功</AlertTitle>
              <AlertDescription>
                您已成功完成{getCheckInTypeLabel(checkInType)}，打卡时间：{formatTime(new Date())}
              </AlertDescription>
            </Alert>
          ) : checkInStatus === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>打卡失败</AlertTitle>
              <AlertDescription>请检查您的位置信息是否正确，或稍后重试。</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">今日考勤</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">上班时间</span>
                        </div>
                        <span className="text-sm font-medium">09:00:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">下班时间</span>
                        </div>
                        <span className="text-sm font-medium">18:00:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">工作时长</span>
                        </div>
                        <span className="text-sm font-medium">8小时</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">打卡地点</span>
                        </div>
                        <span className="text-sm font-medium">公司办公室</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">打卡提醒</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">请记得按时下班打卡</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <p>工作时间: 09:00 - 18:00</p>
                        <p>午休时间: 12:00 - 13:00</p>
                        <p>打卡范围: 公司 500 米范围内</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">今日打卡记录</h3>
                {checkInHistory.length > 0 ? (
                  <div className="space-y-2">
                    {checkInHistory.map((record, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
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
                      </div>
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
