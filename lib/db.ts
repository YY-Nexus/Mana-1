import { neon } from "@neondatabase/serverless"

// 创建数据库连接
export const sql = neon(process.env.DATABASE_URL!)

// 用户相关操作
export async function getUsers() {
  const users = await sql`
    SELECT u.id, u.name, u.email, r.name as role_name, r.id as role_id
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
  `
  return users
}

export async function getUserById(id: number) {
  const [user] = await sql`
    SELECT u.id, u.name, u.email, r.name as role_name, r.id as role_id
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ${id}
  `
  return user
}

export async function createUser(name: string, email: string, password: string, roleId: number | null) {
  const [user] = await sql`
    INSERT INTO users (name, email, password, role_id)
    VALUES (${name}, ${email}, ${password}, ${roleId})
    RETURNING id, name, email, role_id
  `
  return user
}

export async function updateUser(id: number, name: string, email: string, roleId: number | null) {
  const [user] = await sql`
    UPDATE users
    SET name = ${name}, email = ${email}, role_id = ${roleId}
    WHERE id = ${id}
    RETURNING id, name, email, role_id
  `
  return user
}

export async function deleteUser(id: number) {
  await sql`DELETE FROM user_roles WHERE user_id = ${id}`
  await sql`DELETE FROM users WHERE id = ${id}`
  return { success: true }
}

// 角色相关操作
export async function getRoles() {
  const roles = await sql`SELECT id, name, description FROM roles`
  return roles
}

export async function getRoleById(id: number) {
  const [role] = await sql`
    SELECT id, name, description 
    FROM roles 
    WHERE id = ${id}
  `
  return role
}

export async function createRole(name: string, description: string) {
  const [role] = await sql`
    INSERT INTO roles (name, description)
    VALUES (${name}, ${description})
    RETURNING id, name, description
  `
  return role
}

export async function updateRole(id: number, name: string, description: string) {
  const [role] = await sql`
    UPDATE roles
    SET name = ${name}, description = ${description}
    WHERE id = ${id}
    RETURNING id, name, description
  `
  return role
}

export async function deleteRole(id: number) {
  await sql`DELETE FROM role_permissions WHERE role_id = ${id}`
  await sql`DELETE FROM user_roles WHERE role_id = ${id}`
  await sql`UPDATE users SET role_id = NULL WHERE role_id = ${id}`
  await sql`DELETE FROM roles WHERE id = ${id}`
  return { success: true }
}

// 权限相关操作
export async function getPermissions() {
  const permissions = await sql`SELECT id, name, description FROM permissions`
  return permissions
}

export async function getPermissionById(id: number) {
  const [permission] = await sql`
    SELECT id, name, description 
    FROM permissions 
    WHERE id = ${id}
  `
  return permission
}

export async function createPermission(name: string, description: string) {
  const [permission] = await sql`
    INSERT INTO permissions (name, description)
    VALUES (${name}, ${description})
    RETURNING id, name, description
  `
  return permission
}

export async function updatePermission(id: number, name: string, description: string) {
  const [permission] = await sql`
    UPDATE permissions
    SET name = ${name}, description = ${description}
    WHERE id = ${id}
    RETURNING id, name, description
  `
  return permission
}

export async function deletePermission(id: number) {
  await sql`DELETE FROM role_permissions WHERE permission_id = ${id}`
  await sql`DELETE FROM permissions WHERE id = ${id}`
  return { success: true }
}

// 角色权限相关操作
export async function getRolePermissions(roleId: number) {
  const permissions = await sql`
    SELECT p.id, p.name, p.description
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = ${roleId}
  `
  return permissions
}

export async function assignPermissionToRole(roleId: number, permissionId: number) {
  try {
    await sql`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (${roleId}, ${permissionId})
    `
    return { success: true }
  } catch (error) {
    // 可能是因为已经存在该关联
    return { success: false, error }
  }
}

export async function removePermissionFromRole(roleId: number, permissionId: number) {
  await sql`
    DELETE FROM role_permissions 
    WHERE role_id = ${roleId} AND permission_id = ${permissionId}
  `
  return { success: true }
}

// 用户角色相关操作
export async function getUserRoles(userId: number) {
  const roles = await sql`
    SELECT r.id, r.name, r.description
    FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ${userId}
  `
  return roles
}

export async function assignRoleToUser(userId: number, roleId: number) {
  try {
    await sql`
      INSERT INTO user_roles (user_id, role_id)
      VALUES (${userId}, ${roleId})
    `
    return { success: true }
  } catch (error) {
    // 可能是因为已经存在该关联
    return { success: false, error }
  }
}

export async function removeRoleFromUser(userId: number, roleId: number) {
  await sql`
    DELETE FROM user_roles 
    WHERE user_id = ${userId} AND role_id = ${roleId}
  `
  return { success: true }
}

// 检查用户是否有特定权限
export async function checkUserPermission(userId: number, permissionName: string) {
  const result = await sql`
    SELECT COUNT(*) as has_permission
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN role_permissions rp ON ur.role_id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = ${userId} AND p.name = ${permissionName}
    UNION
    SELECT COUNT(*) as has_permission
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = ${userId} AND p.name = ${permissionName}
  `

  // 如果任一查询返回非零计数，则用户拥有该权限
  return result.some((row) => Number.parseInt(row.has_permission) > 0)
}
