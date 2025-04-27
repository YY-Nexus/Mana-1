// 权限常量定义
export const PERMISSIONS = {
  // 用户管理权限
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_EDIT: "user:edit",
  USER_DELETE: "user:delete",

  // 角色管理权限
  ROLE_VIEW: "role:view",
  ROLE_CREATE: "role:create",
  ROLE_EDIT: "role:edit",
  ROLE_DELETE: "role:delete",

  // 权限管理权限
  PERMISSION_VIEW: "permission:view",
  PERMISSION_ASSIGN: "permission:assign",

  // 薪资审批权限
  SALARY_APPROVAL_VIEW: "salary:approval:view",
  SALARY_APPROVAL_CREATE: "salary:approval:create",
  SALARY_APPROVAL_APPROVE: "salary:approval:approve",
  SALARY_APPROVAL_REJECT: "salary:approval:reject",
  SALARY_APPROVAL_BATCH: "salary:approval:batch",
  SALARY_APPROVAL_EXPORT: "salary:approval:export",

  // 薪资计算权限
  SALARY_CALCULATION_VIEW: "salary:calculation:view",
  SALARY_CALCULATION_CREATE: "salary:calculation:create",
  SALARY_CALCULATION_BATCH: "salary:calculation:batch",

  // 考勤管理权限
  ATTENDANCE_VIEW: "attendance:view",
  ATTENDANCE_RECORD: "attendance:record",
  ATTENDANCE_REPORT: "attendance:report",
  ATTENDANCE_EXPORT: "attendance:export",

  // 系统管理权限
  SYSTEM_SETTINGS: "system:settings",
  SYSTEM_LOGS: "system:logs",
  SYSTEM_BACKUP: "system:backup",
}

// 检查用户是否拥有指定权限
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission)
}

// 检查用户是否拥有指定权限中的任意一个
export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some((permission) => userPermissions.includes(permission))
}

// 检查用户是否拥有指定的所有权限
export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

// 获取用户角色的权限
export async function getUserPermissions(userId: string): Promise<string[]> {
  // 实际应用中，这里应该从数据库或API获取用户权限
  // 这里仅作为示例返回模拟数据
  return [
    PERMISSIONS.SALARY_APPROVAL_VIEW,
    PERMISSIONS.SALARY_APPROVAL_APPROVE,
    PERMISSIONS.SALARY_APPROVAL_REJECT,
    PERMISSIONS.SALARY_CALCULATION_VIEW,
  ]
}
