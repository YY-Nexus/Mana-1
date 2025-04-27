// 检测当前环境
export const isServer = typeof window === "undefined"

// 提供空的实现
export const fs = {}
export const path = {}
export const dns = {}
export const net = {}
