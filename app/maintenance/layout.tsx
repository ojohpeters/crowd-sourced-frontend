import type React from "react"

export const metadata = {
  title: "Maintenance Mode - Emergency Response System",
  description: "Our service is currently in maintenance mode due to payment issues.",
}

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
