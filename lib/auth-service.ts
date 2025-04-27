// 模拟用户类型
export interface User {
  id: string
  username: string
  email: string
  role: string
}

// 模拟用户数据库
const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    username: "user",
    email: "user@example.com",
    role: "user",
  },
]

// 模拟登录函数
export async function signIn(usernameOrEmail: string, password: string): Promise<User> {
  // 在实际应用中，这里应该调用API或数据库
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.username === usernameOrEmail || u.email === usernameOrEmail)

      if (user && password) {
        // 在实际应用中，应该验证密码哈希
        resolve(user)
      } else {
        reject(new Error("用户名或密码不正确"))
      }
    }, 1000)
  })
}

// 模拟注册函数
export async function register(username: string, email: string, password: string): Promise<User> {
  // 在实际应用中，这里应该调用API或数据库
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查用户名或邮箱是否已存在
      const existingUser = users.find((u) => u.username === username || u.email === email)

      if (existingUser) {
        reject(new Error("用户名或邮箱已被使用"))
        return
      }

      // 创建新用户
      const newUser: User = {
        id: String(users.length + 1),
        username,
        email,
        role: "user",
      }

      // 在实际应用中，应该存储到数据库
      users.push(newUser)
      resolve(newUser)
    }, 1000)
  })
}

// 模拟请求密码重置函数
export async function requestPasswordReset(email: string): Promise<boolean> {
  // 在实际应用中，这里应该调用API或数据库
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email)

      if (user) {
        // 在实际应用中，应该发送重置邮件
        resolve(true)
      } else {
        reject(new Error("未找到该邮箱对应的用户"))
      }
    }, 1000)
  })
}
