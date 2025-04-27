/**
 * 获取任务执行日志
 * @param options 过滤选项
 * @returns 任务执行日志列表
 */
export async function getTaskExecutionLogs(
  options: {
    limit?: number
    search?: string
    status?: string[]
  } = {},
): Promise<
  Array<{
    id: number
    taskId: string
    taskType: string
    status: string
    message: string
    executedAt: string
    duration: number
  }>
> {
  try {
    // 构建查询参数
    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.search) params.append("search", options.search)
    if (options.status && options.status.length > 0) {
      options.status.forEach((status) => params.append("status", status))
    }

    const response = await fetch(`/api/process-engine/logs?${params.toString()}`, {
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
    console.error("获取任务执行日志失败:", error)
    throw new Error("获取任务执行日志失败")
  }
}

/**
 * 下载任务执行日志
 * @param options 过滤选项
 */
export async function downloadTaskLogs(
  options: {
    search?: string
    status?: string[]
  } = {},
): Promise<void> {
  try {
    // 构建查询参数
    const params = new URLSearchParams()
    if (options.search) params.append("search", options.search)
    if (options.status && options.status.length > 0) {
      options.status.forEach((status) => params.append("status", status))
    }

    const response = await fetch(`/api/process-engine/logs/download?${params.toString()}`, {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`)
    }

    // 获取文件名
    const contentDisposition = response.headers.get("content-disposition")
    let filename = "task-logs.csv"
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1]
      }
    }

    // 下载文件
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error("下载任务执行日志失败:", error)
    throw new Error("下载任务执行日志失败")
  }
}
