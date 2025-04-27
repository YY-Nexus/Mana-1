"use client"

import { useState, useEffect } from "react"
import { Plus, X, FileText, Calculator, Download, Settings } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function FloatingActionButtons() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest(".floating-buttons-container")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="floating-buttons-container">
      <div className={`float-menu ${isOpen ? "active" : ""}`}>
        <button className="float-menu-item">
          <FileText size={isMobile ? 16 : 20} />
          <span className="float-menu-tooltip">查看报表</span>
        </button>
        <button className="float-menu-item">
          <Calculator size={isMobile ? 16 : 20} />
          <span className="float-menu-tooltip">薪资计算</span>
        </button>
        <button className="float-menu-item">
          <Download size={isMobile ? 16 : 20} />
          <span className="float-menu-tooltip">导出数据</span>
        </button>
        <button className="float-menu-item">
          <Settings size={isMobile ? 16 : 20} />
          <span className="float-menu-tooltip">系统设置</span>
        </button>
      </div>
      <button
        className={`float-btn float-btn-burst ${isOpen ? "bg-red-500" : ""}`}
        onClick={toggleMenu}
        aria-label={isOpen ? "关闭菜单" : "打开菜单"}
      >
        {isOpen ? <X size={isMobile ? 20 : 24} /> : <Plus size={isMobile ? 20 : 24} />}
      </button>
    </div>
  )
}
