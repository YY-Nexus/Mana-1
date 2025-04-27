import { Redis } from "@upstash/redis"

// 创建Redis客户端实例，添加错误处理
let redisClient: Redis | null = null
let redisConnectionError: Error | null = null

try {
  // 检查环境变量是否存在且非空
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token && url.trim() !== "" && token.trim() !== "") {
    redisClient = new Redis({
      url,
      token,
      retry: { retries: 3 }, // 添加重试配置
    })
    console.log("Redis客户端初始化成功")
  } else {
    console.warn("Redis环境变量未设置或为空，Redis功能将被禁用")
    redisConnectionError = new Error("Redis环境变量未设置或为空")
  }
} catch (error) {
  console.error("Redis连接初始化失败:", error)
  redisConnectionError = error instanceof Error ? error : new Error(String(error))
}

// 检查Redis连接是否可用的函数
export async function isRedisAvailable(): Promise<boolean> {
  if (!redisClient) return false

  try {
    // 尝试执行一个简单的操作来检查连接
    await redisClient.ping()
    return true
  } catch (error) {
    console.error("Redis连接检查失败:", error)
    return false
  }
}

// 导出Redis客户端，添加错误处理
export const redis = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient) return null
      return await redisClient.get<T>(key)
    } catch (error) {
      console.error(`Redis get操作失败 (${key}):`, error)
      return null
    }
  },

  async set(key: string, value: any, options?: any): Promise<any> {
    try {
      if (!redisClient) return false
      return await redisClient.set(key, value, options)
    } catch (error) {
      console.error(`Redis set操作失败 (${key}):`, error)
      return false
    }
  },

  async del(...keys: string[]): Promise<number> {
    try {
      if (!redisClient || keys.length === 0) return 0
      return await redisClient.del(...keys)
    } catch (error) {
      console.error(`Redis del操作失败:`, error)
      return 0
    }
  },

  async incr(key: string): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.incr(key)
    } catch (error) {
      console.error(`Redis incr操作失败 (${key}):`, error)
      return 0
    }
  },

  async expire(key: string, seconds: number): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.expire(key, seconds)
    } catch (error) {
      console.error(`Redis expire操作失败 (${key}):`, error)
      return 0
    }
  },

  async keys(pattern: string): Promise<string[]> {
    try {
      if (!redisClient) return []
      return await redisClient.keys(pattern)
    } catch (error) {
      console.error(`Redis keys操作失败 (${pattern}):`, error)
      return []
    }
  },

  async eval(script: string, keys: string[], args: any[]): Promise<any> {
    try {
      if (!redisClient) return null
      return await redisClient.eval(script, keys, args)
    } catch (error) {
      console.error(`Redis eval操作失败:`, error)
      return null
    }
  },

  async zadd(key: string, score: { score: number; member: string }): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.zadd(key, score)
    } catch (error) {
      console.error(`Redis zadd操作失败 (${key}):`, error)
      return 0
    }
  },

  async zrange(key: string, start: number, end: number): Promise<string[]> {
    try {
      if (!redisClient) return []
      return await redisClient.zrange(key, start, end)
    } catch (error) {
      console.error(`Redis zrange操作失败 (${key}):`, error)
      return []
    }
  },

  async zrem(key: string, ...members: string[]): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.zrem(key, ...members)
    } catch (error) {
      console.error(`Redis zrem操作失败 (${key}):`, error)
      return 0
    }
  },

  async zcard(key: string): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.zcard(key)
    } catch (error) {
      console.error(`Redis zcard操作失败 (${key}):`, error)
      return 0
    }
  },

  async publish(channel: string, message: string): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.publish(channel, message)
    } catch (error) {
      console.error(`Redis publish操作失败 (${channel}):`, error)
      return 0
    }
  },

  async dbsize(): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.dbsize()
    } catch (error) {
      console.error(`Redis dbsize操作失败:`, error)
      return 0
    }
  },

  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.lpush(key, ...values)
    } catch (error) {
      console.error(`Redis lpush操作失败 (${key}):`, error)
      return 0
    }
  },

  async rpush(key: string, ...values: string[]): Promise<number> {
    try {
      if (!redisClient) return 0
      return await redisClient.rpush(key, ...values)
    } catch (error) {
      console.error(`Redis rpush操作失败 (${key}):`, error)
      return 0
    }
  },

  async lrange(key: string, start: number, end: number): Promise<string[]> {
    try {
      if (!redisClient) return []
      return await redisClient.lrange(key, start, end)
    } catch (error) {
      console.error(`Redis lrange操作失败 (${key}):`, error)
      return []
    }
  },

  async ltrim(key: string, start: number, end: number): Promise<string> {
    try {
      if (!redisClient) return "OK"
      return await redisClient.ltrim(key, start, end)
    } catch (error) {
      console.error(`Redis ltrim操作失败 (${key}):`, error)
      return "OK"
    }
  },

  async ping(): Promise<string> {
    try {
      if (!redisClient) return "DISCONNECTED"
      return await redisClient.ping()
    } catch (error) {
      console.error(`Redis ping操作失败:`, error)
      return "ERROR"
    }
  },
}

/**
 * 缓存数据到Redis
 * @param key 缓存键
 * @param data 要缓存的数据
 * @param expireSeconds 过期时间（秒）
 */
export async function cacheData<T>(key: string, data: T, expireSeconds = 3600): Promise<void> {
  try {
    if (!(await isRedisAvailable())) return
    await redis.set(key, JSON.stringify(data), { ex: expireSeconds })
  } catch (error) {
    console.error(`缓存数据失败 (${key}):`, error)
  }
}

/**
 * 从Redis获取缓存数据
 * @param key 缓存键
 * @returns 缓存的数据，如果不存在则返回null
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    if (!(await isRedisAvailable())) return null
    const data = await redis.get<string>(key)
    if (!data) return null
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`获取缓存数据失败 (${key}):`, error)
    return null
  }
}

/**
 * 删除Redis缓存
 * @param key 缓存键
 */
export async function deleteCachedData(key: string): Promise<void> {
  try {
    if (!(await isRedisAvailable())) return
    await redis.del(key)
  } catch (error) {
    console.error(`删除缓存数据失败 (${key}):`, error)
  }
}

/**
 * 清除指定前缀的所有缓存
 * @param prefix 缓存键前缀
 */
export async function clearCacheByPrefix(prefix: string): Promise<void> {
  try {
    if (!(await isRedisAvailable())) return
    const keys = await redis.keys(`${prefix}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error(`清除缓存前缀失败 (${prefix}):`, error)
  }
}

/**
 * 实现分布式锁
 * @param lockName 锁名称
 * @param ttlSeconds 锁的生存时间（秒）
 * @returns 锁ID，用于解锁
 */
export async function acquireLock(lockName: string, ttlSeconds = 30): Promise<string | null> {
  try {
    if (!(await isRedisAvailable())) return null
    const lockId = Date.now().toString()
    const acquired = await redis.set(`lock:${lockName}`, lockId, {
      nx: true,
      ex: ttlSeconds,
    })

    return acquired ? lockId : null
  } catch (error) {
    console.error(`获取锁失败 (${lockName}):`, error)
    return null
  }
}

/**
 * 释放分布式锁
 * @param lockName 锁名称
 * @param lockId 锁ID
 * @returns 是否成功释放锁
 */
export async function releaseLock(lockName: string, lockId: string): Promise<boolean> {
  try {
    if (!(await isRedisAvailable())) return false
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `

    const result = await redis.eval(script, [`lock:${lockName}`], [lockId])

    return result === 1
  } catch (error) {
    console.error(`释放锁失败 (${lockName}):`, error)
    return false
  }
}

/**
 * 增加计数器
 * @param key 计数器键
 * @param increment 增加值
 * @param expireSeconds 过期时间（秒）
 */
export async function incrementCounter(key: string, increment = 1, expireSeconds?: number): Promise<number> {
  try {
    if (!(await isRedisAvailable())) return 0
    const count = await redis.incr(key)
    if (expireSeconds && count === increment) {
      await redis.expire(key, expireSeconds)
    }
    return count
  } catch (error) {
    console.error(`增加计数器失败 (${key}):`, error)
    return 0
  }
}

/**
 * 获取计数器值
 * @param key 计数器键
 */
export async function getCounter(key: string): Promise<number> {
  try {
    if (!(await isRedisAvailable())) return 0
    const value = await redis.get<string>(key)
    return value ? Number.parseInt(value, 10) : 0
  } catch (error) {
    console.error(`获取计数器失败 (${key}):`, error)
    return 0
  }
}

/**
 * 添加到有序集合
 * @param key 集合键
 * @param score 分数
 * @param member 成员
 */
export async function addToSortedSet(key: string, score: number, member: string): Promise<void> {
  try {
    if (!(await isRedisAvailable())) return
    await redis.zadd(key, { score, member })
  } catch (error) {
    console.error(`添加到有序集合失败 (${key}):`, error)
  }
}

/**
 * 获取有序集合的范围
 * @param key 集合键
 * @param start 开始索引
 * @param end 结束索引
 */
export async function getRangeFromSortedSet(key: string, start = 0, end = -1): Promise<string[]> {
  try {
    if (!(await isRedisAvailable())) return []
    return await redis.zrange(key, start, end)
  } catch (error) {
    console.error(`获取有序集合范围失败 (${key}):`, error)
    return []
  }
}

/**
 * 发布消息到频道
 * @param channel 频道名
 * @param message 消息内容
 */
export async function publishMessage(channel: string, message: any): Promise<void> {
  try {
    if (!(await isRedisAvailable())) return
    await redis.publish(channel, JSON.stringify(message))
  } catch (error) {
    console.error(`发布消息失败 (${channel}):`, error)
  }
}

/**
 * 获取Redis连接状态
 * @returns Redis连接状态信息
 */
export async function getRedisStatus(): Promise<{
  available: boolean
  error: string | null
  ping: string | null
}> {
  try {
    const available = await isRedisAvailable()
    const ping = available ? await redis.ping() : null

    return {
      available,
      error: redisConnectionError ? redisConnectionError.message : null,
      ping,
    }
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : String(error),
      ping: null,
    }
  }
}
