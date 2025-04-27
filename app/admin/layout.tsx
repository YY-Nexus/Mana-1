import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { BrandHeader } from "@/components/brand-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BrandHeader />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="content-overlay p-6 h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
