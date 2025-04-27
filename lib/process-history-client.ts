/**
 * 获取处理历史记录
 * @param limit 限制返回的记录数量
 * @returns 历史记录列表
 */
export async function getProcessHistory(limit = 10): Promise<
  Array<{
    id: number
    taskType: string
    status: string
    timestamp: string
    message: string
  }>
> {
  try {
    const response = await fetch(`/api/process-engine/history?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    const data = await response.json()
    return data.history
  } catch (error) {
    console.error("获取历史记录失败:", error)
    throw new Error("获取历史记录失败")
  }
}
