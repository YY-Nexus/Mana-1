/**
 * 获取任务优先级分布
 * @returns 优先级分布数据
 */
export async function getPriorityDistribution(): Promise<Array<{ name: string; value: number }>> {
  try {
    const response = await fetch("/api/process-engine/priority-distribution", {
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
    console.error("获取任务优先级分布失败:", error)
    throw new Error("获取任务优先级分布失败")
  }
}

/**
 * 获取流程统计数据
 * @returns 流程统计数据
 */
export async function getProcessStats(): Promise<{
  totalProcesses: number
  activeProcesses: number
  completedProcesses: number
  averageCompletionTime: number
  successRate: number
}> {
  try {
    const response = await fetch("/api/process-engine/stats", {
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
    console.error("获取流程统计数据失败:", error)
    return {
      totalProcesses: 0,
      activeProcesses: 0,
      completedProcesses: 0,
      averageCompletionTime: 0,
      successRate: 0,
    }
  }
}
