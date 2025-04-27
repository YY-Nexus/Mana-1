import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    // 获取Redis信息
    const redisInfo = await getRedisStats()

    // 获取系统信息（在实际应用中，这里应该从系统监控服务获取）
    const systemInfo = getSystemStats()

    // 获取数据库信息（在实际应用中，这里应该从数据库监控服务获取）
    const dbInfo = getDatabaseStats()

    return NextResponse.json({
      success: true,
      stats: {
        redis: redisInfo,
        system: systemInfo,
        database: dbInfo,
      },
    })
  } catch (error) {
    const errorResponse = handleApiError(error, "获取监控数据失败")
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}

// 获取Redis统计信息
async function getRedisStats() {
  // 在实际应用中，这里应该从Redis获取真实的统计信息
  // 由于Upstash Redis REST API的限制，这里使用模拟数据

  // 获取一些基本信息
  const keysCount = await redis.dbsize()

  // 模拟内存使用数据
  const memoryUsage = {
    used: 1024 * 1024 * 10, // 10MB
    peak: 1024 * 1024 * 12, // 12MB
    total: 1024 * 1024 * 100, // 100MB
    usedPercentage: 10,
  }

  // 模拟键空间统计
  const keyspaceStats = {
    totalKeys: keysCount || 100,
    expiringKeys: Math.floor((keysCount || 100) * 0.3),
    keysByType: {
      string: Math.floor((keysCount || 100) * 0.6),
      list: Math.floor((keysCount || 100) * 0.1),
      set: Math.floor((keysCount || 100) * 0.1),
      zset: Math.floor((keysCount || 100) * 0.1),
      hash: Math.floor((keysCount || 100) * 0.1),
    },
  }

  // 模拟操作统计
  const operationStats = {
    commandsProcessed: 10000,
    opsPerSecond: 50,
    hitRate: 0.85,
    missRate: 0.15,
  }

  // 模拟连接统计
  const connectionStats = {
    connectedClients: 5,
    blockedClients: 0,
    rejectedConnections: 0,
  }

  // 模拟命中/未命中统计
  const keyspaceHitMiss = [
    { name: "命中", value: 8500 },
    { name: "未命中", value: 1500 },
  ]

  // 模拟命令统计
  const commandStats = [
    { name: "GET", value: 5000 },
    { name: "SET", value: 3000 },
    { name: "DEL", value: 1000 },
    { name: "INCR", value: 500 },
    { name: "EXPIRE", value: 500 },
  ]

  // 模拟内存使用历史
  const memoryUsageHistory = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      usage: 5 + Math.random() * 10, // 5-15MB
    }))

  // 模拟操作历史
  const operationsHistory = Array(24)
    .fill(0)
    .map((_, i) => ({
      time: `${i}:00`,
      ops: 30 + Math.random() * 40, // 30-70 ops/s
    }))

  return {
    memoryUsage,
    keyspaceStats,
    operationStats,
    connectionStats,
    keyspaceHitMiss,
    commandStats,
    memoryUsageHistory,
    operationsHistory,
  }
}

// 获取系统统计信息（模拟数据）
function getSystemStats() {
  return {
    cpu: {
      usage: 25 + Math.random() * 20, // 25-45%
      cores: 4,
    },
    memory: {
      total: 1024 * 1024 * 1024 * 16, // 16GB
      used: 1024 * 1024 * 1024 * 6, // 6GB
      free: 1024 * 1024 * 1024 * 10, // 10GB
      usedPercentage: 37.5,
    },
    disk: {
      total: 1024 * 1024 * 1024 * 500, // 500GB
      used: 1024 * 1024 * 1024 * 200, // 200GB
      free: 1024 * 1024 * 1024 * 300, // 300GB
      usedPercentage: 40,
    },
    network: {
      rx: 1024 * 1024 * 100, // 100MB
      tx: 1024 * 1024 * 50, // 50MB
    },
    uptime: 60 * 60 * 24 * 7, // 7天
    cpuHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        usage: 20 + Math.random() * 30, // 20-50%
      })),
    memoryHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        usage: 30 + Math.random() * 20, // 30-50%
      })),
  }
}

// 获取数据库统计信息（模拟数据）
function getDatabaseStats() {
  return {
    connectionStats: {
      active: 5,
      idle: 10,
      max: 20,
      usedPercentage: 25,
    },
    queryStats: {
      totalQueries: 50000,
      queriesPerSecond: 10.5,
      slowQueries: 25,
      avgResponseTime: 15.3,
    },
    storageStats: {
      databaseSize: 1024 * 1024 * 50, // 50MB
      tablesCount: 15,
      indexSize: 1024 * 1024 * 10, // 10MB
      usedPercentage: 30,
    },
    topQueries: [
      { query: "SELECT", count: 30000, avgTime: 10.2 },
      { query: "INSERT", count: 15000, avgTime: 20.5 },
      { query: "UPDATE", count: 4000, avgTime: 25.3 },
      { query: "DELETE", count: 1000, avgTime: 15.7 },
    ],
    queryHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        queries: 5 + Math.random() * 15, // 5-20 queries/s
      })),
    responseTimeHistory: Array(24)
      .fill(0)
      .map((_, i) => ({
        time: `${i}:00`,
        responseTime: 10 + Math.random() * 20, // 10-30ms
      })),
  }
}
