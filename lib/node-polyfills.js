// 为Node.js核心模块提供浏览器兼容的替代方案

// 检测当前环境
export const isServer = typeof window === "undefined"

// fs模块替代
export const fs = {
  readFileSync: () => {
    throw new Error("fs.readFileSync is not supported in browser environment")
  },
  writeFileSync: () => {
    throw new Error("fs.writeFileSync is not supported in browser environment")
  },
  promises: {
    readFile: async () => {
      throw new Error("fs.promises.readFile is not supported in browser environment")
    },
    writeFile: async () => {
      throw new Error("fs.promises.writeFile is not supported in browser environment")
    },
  },
}

// path模块替代
export const path = {
  join: (...paths) => paths.join("/").replace(/\/+/g, "/"),
  resolve: (...paths) => "/" + paths.join("/").replace(/\/+/g, "/"),
  dirname: (path) => {
    const parts = path.split("/")
    parts.pop()
    return parts.join("/") || "/"
  },
  basename: (path, ext) => {
    const base = path.split("/").pop() || ""
    if (ext && base.endsWith(ext)) {
      return base.slice(0, -ext.length)
    }
    return base
  },
  extname: (path) => {
    const base = path.split("/").pop() || ""
    const lastDotIndex = base.lastIndexOf(".")
    return lastDotIndex < 0 ? "" : base.slice(lastDotIndex)
  },
}

// 其他Node.js模块的浏览器替代方案
export const dns = {
  lookup: () => {
    throw new Error("dns.lookup is not supported in browser environment")
  },
}

export const net = {
  connect: () => {
    throw new Error("net.connect is not supported in browser environment")
  },
  createConnection: () => {
    throw new Error("net.createConnection is not supported in browser environment")
  },
}
