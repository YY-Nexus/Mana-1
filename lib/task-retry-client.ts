/**
 * 获取失败的任务列表
 * @param limit 限制返回的记录数量
 * @returns 失败任务列表
 */
export async function getFailedTasks(limit = 10): Promise<
  Array<{
    id: number
    taskId: string
    taskType: string
    errorMessage: string
    failedAt: string
    priority: number
    retryCount: number
  }>
> {
  try {
    const response = await fetch(`/api/tasks/failed?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取失败任务列表失败:", error)
    throw new Error("获取失败任务列表失败")
  }
}

/**
 * 重试失败的任务
 * @param taskId 任务ID
 * @returns 是否成功重试
 */
export async function retryFailedTask(taskId: string): Promise<boolean> {
  try {
    const response = await fetch("/api/tasks/retry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API错误: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("重试任务失败:", error)
    throw new Error(error instanceof Error ? error.message : "重试任务失败")
  }
}
