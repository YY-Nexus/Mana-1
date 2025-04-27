import type React from "react"
import { ErrorBoundary } from "./error-boundary"

interface WithErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  name?: string
}

export function WithErrorBoundary({ children, fallback, onError, name }: WithErrorBoundaryProps): JSX.Element {
  return (
    <ErrorBoundary fallback={fallback} onError={onError} name={name}>
      {children}
    </ErrorBoundary>
  )
}
