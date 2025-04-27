import type { ReactNode } from "react"

interface NeuroCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  headerAction?: ReactNode
}

export function NeuroCard({ children, title, subtitle, className = "", headerAction }: NeuroCardProps) {
  return (
    <div className={`neuro-card ${className}`}>
      {(title || subtitle) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
            {subtitle && <p className="text-sm opacity-70 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
