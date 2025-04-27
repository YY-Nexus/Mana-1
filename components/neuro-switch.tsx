"use client"

import type React from "react"

import { useState, useRef, useId } from "react"
import { useI18n } from "@/contexts/i18n-context"

interface NeuroSwitchProps {
  initialState?: boolean
  onChange?: (isActive: boolean) => void
  label?: string
  disabled?: boolean
  ariaLabel?: string
}

export function NeuroSwitch({ initialState = false, onChange, label, disabled = false, ariaLabel }: NeuroSwitchProps) {
  const [isActive, setIsActive] = useState(initialState)
  const switchRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const { t } = useI18n()

  const handleToggle = () => {
    if (disabled) return

    const newState = !isActive
    setIsActive(newState)
    if (onChange) onChange(newState)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div className="flex items-center">
      {label && (
        <label
          htmlFor={id}
          className={`mr-3 text-sm font-medium ${
            disabled ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={disabled ? undefined : handleToggle}
        >
          {label}
        </label>
      )}
      <div
        ref={switchRef}
        id={id}
        className={`neuro-switch ${isActive ? "active" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={disabled ? undefined : handleToggle}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={isActive}
        aria-label={ariaLabel || label}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      />
    </div>
  )
}
