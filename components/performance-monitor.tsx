"use client"

import { useEffect, useState } from "react"
import { NeuroCard } from "@/components/neuro-card"

interface PerformanceMetrics {
  fps: number
  memory: {
    jsHeapSizeLimit: number
    totalJSHeapSize: number
    usedJSHeapSize: number
  } | null
  cpuUsage: number | null
}

export function PerformanceMonitor({ showInProduction = false }: { showInProduction?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    cpuUsage: null,
  })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 只在开发环境或明确指定时显示
    if (process.env.NODE_ENV !== "development" && !showInProduction) {
      return
    }

    setVisible(true)

    let frameCount = 0
    let lastTime = performance.now()
    let frameId: number

    // 计算FPS
    const measureFPS = (timestamp: number) => {
      frameCount++

      const elapsed = timestamp - lastTime

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed)

        setMetrics((prev) => ({
          ...prev,
          fps,
          // 如果浏览器支持，获取内存使用情况
          memory: (performance as any).memory
            ? {
                jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
                totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              }
            : null,
        }))

        frameCount = 0
        lastTime = timestamp
      }

      frameId = requestAnimationFrame(measureFPS)
    }

    frameId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [showInProduction])

  if (!visible) return null

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getMemoryUsagePercentage = () => {
    if (!metrics.memory) return null
    return Math.round((metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100)
  }

  const memoryPercentage = getMemoryUsagePercentage()

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <NeuroCard title="性能监控" className="w-64 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>FPS</span>
            <span
              className={metrics.fps < 30 ? "text-red-400" : metrics.fps < 50 ? "text-yellow-400" : "text-green-400"}
            >
              {metrics.fps}
            </span>
          </div>

          {metrics.memory && (
            <>
              <div className="flex justify-between">
                <span>内存使用</span>
                <span
                  className={
                    memoryPercentage && memoryPercentage > 80
                      ? "text-red-400"
                      : memoryPercentage && memoryPercentage > 60
                        ? "text-yellow-400"
                        : "text-green-400"
                  }
                >
                  {formatBytes(metrics.memory.usedJSHeapSize)} / {formatBytes(metrics.memory.jsHeapSizeLimit)}
                </span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    memoryPercentage && memoryPercentage > 80
                      ? "bg-red-500"
                      : memoryPercentage && memoryPercentage > 60
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${memoryPercentage || 0}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      </NeuroCard>
    </div>
  )
}
