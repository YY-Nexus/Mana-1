import { neon } from "@neondatabase/serverless"
import "jspdf-autotable"

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 获取当前用户的报表权限
export async function getAttendanceReportPermissions() {
  // 在实际应用中，这里应该从数据库或认证系统获取用户权限
  // 这里为了演示，返回模拟数据
  return {
    canExport: true,
    canSchedule: true,
    canManageSchedule: true,
    canManageFields: true,
  }
}

// 获取考勤报表数据
export function getAttendanceReportData() {
  // 在实际应用中，这里应该从数据库获取数据
  // 这里为了演示，返回模拟数据
  return [
    {
      id: "1",
      employeeId: "EMP001",
      name: "张三",
      department: "技术部",
      date: "2023-04-21",
      checkIn: "08:55:23",
      checkOut: "18:03:45",
      workHours: 8.5,
      status: "normal",
      notes: "",
    },
    {
      id: "2",
      employeeId: "EMP002",
      name: "李四",
      department: "人力资源部",
      date: "2023-04-21",
      checkIn: "09:05:12",
      checkOut: "18:30:18",
      workHours: 9,
      status: "late",
      notes: "交通拥堵",
    },
    {
      id: "3",
      employeeId: "EMP003",
      name: "王五",
      department: "财务部",
      date: "2023-04-21",
      checkIn: "08:45:33",
      checkOut: "17:55:08",
      workHours: 8.5,
      status: "normal",
      notes: "",
    },
    {
      id: "4",
      employeeId: "EMP004",
      name: "赵六",
      department: "市场部",
      date: "2023-04-21",
      checkIn: "08:30:45",
      checkOut: "19:15:22",
      workHours: 10.5,
      status: "overtime",
      notes: "项目紧急",
    },
    {
      id: "5",
      employeeId: "EMP005",
      name: "钱七",
      department: "运营部",
      date: "2023-04-21",
      checkIn: "",
      checkOut: "",
      workHours: 0,
      status: "absent",
      notes: "请假",
    },
    {
      id: "6",
      employeeId: "EMP006",
      name: "孙八",
      department: "技术部",
      date: "2023-04-21",
      checkIn: "09:10:33",
      checkOut: "18:05:47",
      workHours: 8.5,
      status: "late",
      notes: "",
    },
    {
      id: "7",
      employeeId: "EMP007",
      name: "周九",
      department: "技术部",
      date: "2023-04-21",
      checkIn: "08:50:21",
      checkOut: "17:45:39",
      workHours: 8,
      status: "early",
      notes: "家中有事",
    },
    {
      id: "8",
      employeeId: "EMP008",
      name: "吴十",
      department: "市场部",
      date: "2023-04-21",
      checkIn: "08:58:42",
      checkOut: "18:10:15",
      workHours: 9,
      status: "normal",
      notes: "",
    },
  ]
}

// 导出考勤报表
export async function exportAttendanceReport({ format, options }) {
  // 获取考勤数据
  const data = getAttendanceReportData()

  // 根据格式导出
  if (format === "excel") {
    return exportToExcel(data, options)
  } else if (format === "pdf") {
    return exportToPdf(data, options)
  }

  throw new Error(`不支持的导出格式: ${format}`)
}

// 导出为Excel
async function exportToExcel(data, options) {
  // 在实际应用中，这里应该使用xlsx库生成Excel文件
  // 这里为了演示，模拟导出过程

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("导出Excel:", { data, options })
      resolve({ success: true })
    }, 1000)
  })
}

// 导出为PDF
async function exportToPdf(data, options) {
  // 在实际应用中，这里应该使用jspdf库生成PDF文件
  // 这里为了演示，模拟导出过程

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("导出PDF:", { data, options })
      resolve({ success: true })
    }, 1000)
  })
}

// 获取考勤统计数据
export async function getAttendanceStats(dateRange, department) {
  // 在实际应用中，这里应该从数据库获取统计数据
  // 这里为了演示，返回模拟数据

  return {
    totalEmployees: 50,
    attendanceRate: 92.5,
    punctualityRate: 88.3,
    averageWorkHours: 8.2,
    statusDistribution: {
      normal: 75,
      late: 10,
      early: 5,
      absent: 3,
      overtime: 7,
    },
    departmentStats: [
      { name: "技术部", attendanceRate: 94.2, punctualityRate: 90.5 },
      { name: "人力资源部", attendanceRate: 96.8, punctualityRate: 92.3 },
      { name: "财务部", attendanceRate: 98.1, punctualityRate: 95.7 },
      { name: "市场部", attendanceRate: 91.5, punctualityRate: 85.2 },
      { name: "运营部", attendanceRate: 93.7, punctualityRate: 88.9 },
    ],
  }
}

// 发送考勤报表邮件
export async function sendAttendanceReportEmail(recipients, subject, format, options) {
  // 在实际应用中，这里应该调用邮件发送API
  // 这里为了演示，模拟发送过程

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("发送报表邮件:", { recipients, subject, format, options })
      resolve({ success: true })
    }, 1000)
  })
}

// 获取自定义字段配置
export async function getCustomFieldsConfig() {
  // 在实际应用中，这里应该从数据库获取配置
  // 这里为了演示，返回模拟数据

  return {
    fields: [
      { id: "employeeId", name: "工号", type: "text", required: true, visible: true, editable: false, system: true },
      { id: "name", name: "姓名", type: "text", required: true, visible: true, editable: false, system: true },
      { id: "department", name: "部门", type: "text", required: true, visible: true, editable: false, system: true },
      { id: "date", name: "日期", type: "date", required: true, visible: true, editable: false, system: true },
      { id: "checkIn", name: "签到时间", type: "time", required: true, visible: true, editable: true, system: true },
      { id: "checkOut", name: "签退时间", type: "time", required: true, visible: true, editable: true, system: true },
      {
        id: "workHours",
        name: "工作时长",
        type: "number",
        required: true,
        visible: true,
        editable: false,
        system: true,
      },
      { id: "status", name: "状态", type: "select", required: true, visible: true, editable: true, system: true },
      { id: "notes", name: "备注", type: "textarea", required: false, visible: true, editable: true, system: true },
      { id: "location", name: "工作地点", type: "text", required: false, visible: true, editable: true, system: false },
      { id: "project", name: "项目", type: "text", required: false, visible: true, editable: true, system: false },
      {
        id: "overtime",
        name: "加班时长",
        type: "number",
        required: false,
        visible: true,
        editable: true,
        system: false,
      },
    ],
    permissions: {
      admin: [
        "employeeId",
        "name",
        "department",
        "date",
        "checkIn",
        "checkOut",
        "workHours",
        "status",
        "notes",
        "location",
        "project",
        "overtime",
      ],
      manager: [
        "employeeId",
        "name",
        "department",
        "date",
        "checkIn",
        "checkOut",
        "workHours",
        "status",
        "location",
        "project",
        "overtime",
      ],
      hr: ["employeeId", "name", "department", "date", "checkIn", "checkOut", "workHours", "status", "notes"],
      employee: ["employeeId", "name", "department", "date", "checkIn", "checkOut"],
    },
  }
}
