// 客户端任务队列工具

/**
 * 获取队列长度
 * @returns 队列中的任务数量
 */
export async function getQueueLength(): Promise<number> {
  try {
    const response = await fetch("/api/tasks/queue-length")
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    const data = await response.json()
    return data.length
  } catch (error) {
    console.error("获取队列长度失败:", error)
    throw new Error("获取队列长度失败")
  }
}

/**
 * 处理任务队列
 * @returns 处理结果
 */
export async function processTaskQueue(): Promise<{
  beforeCount: number
  afterCount: number
  processedCount: number
}> {
  try {
    const response = await fetch("/api/tasks/process-queue", {
      method: "POST",
    })
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("处理任务队列失败:", error)
    throw new Error("处理任务队列失败")
  }
}

/**
 * 添加任务到队列
 * @param type 任务类型
 * @param payload 任务数据
 * @param priority 优先级
 * @returns 任务ID
 */
export async function enqueueTask(type: string, payload: any, priority = 10): Promise<string> {
  try {
    const response = await fetch("/api/tasks/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload, priority }),
    })
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    const data = await response.json()
    return data.taskId
  } catch (error) {
    console.error("添加任务到队列失败:", error)
    throw new Error("添加任务到队列失败")
  }
}
