import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "CRITICAL WARNING - Domain Termination Imminent",
  description: "Emergency Response System domain will be permanently deleted in 24 hours due to payment issues.",
}

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
