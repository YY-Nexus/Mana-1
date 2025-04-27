import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { WithErrorBoundary } from "@/components/with-error-boundary"
import { reportError } from "@/lib/error-reporting"
import { FloatingActionButtons } from "@/components/floating-action-buttons"
import { ThemeProvider } from "@/contexts/theme-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { FeedbackCollector } from "@/components/feedback/feedback-collector"
import { I18nProvider } from "@/contexts/i18n-context"
import { DesignTokenProvider } from "@/contexts/design-token-context"

export const metadata: Metadata = {
  title: "言语『启智』运维管理中心",
  description: "智能化运维管理系统，提升企业运营效率",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <I18nProvider>
            <DesignTokenProvider>
              <NotificationProvider>
                <WithErrorBoundary
                  name="RootLayout"
                  onError={(error, errorInfo) => {
                    reportError(error, {
                      source: "client",
                      context: {
                        componentStack: errorInfo.componentStack,
                        location: "RootLayout",
                      },
                    })
                  }}
                >
                  {children}
                  <FloatingActionButtons />
                  <FeedbackCollector />
                </WithErrorBoundary>
              </NotificationProvider>
            </DesignTokenProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
