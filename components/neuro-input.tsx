"use client"

import type React from "react"

import { forwardRef, type InputHTMLAttributes, useId } from "react"

interface NeuroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
}

export const NeuroInput = forwardRef<HTMLInputElement, NeuroInputProps>(
  ({ label, error, icon, helperText, className = "", id: propId, ...props }, ref) => {
    const generatedId = useId()
    const id = propId || `neuro-input-${generatedId}`
    const errorId = error ? `${id}-error` : undefined
    const helperId = helperText ? `${id}-helper` : undefined

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{icon}</div>}
          <input
            ref={ref}
            id={id}
            className={`neuro-input ${icon ? "pl-10" : ""} ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
            } ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={errorId || helperId}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1" id={errorId} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-gray-500 text-xs mt-1" id={helperId}>
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

NeuroInput.displayName = "NeuroInput"
