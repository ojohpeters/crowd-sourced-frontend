"use client"

import { useAuth } from "@/hooks/use-auth"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import ReporterDashboard from "@/components/dashboard/reporter-dashboard"
import ResponderDashboard from "@/components/dashboard/responder-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import LoadingSpinner from "@/components/loading-spinner"

export default function DashboardPage() {
  const { user, loading, isAdmin } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login")
    }
  }, [user, loading])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  // IMPORTANT: Admin check takes precedence over role
  // If is_admin is true, always show admin dashboard regardless of role
  if (isAdmin) {
    console.log("User is admin, showing admin dashboard")
    return <AdminDashboard />
  }

  // Only check role if user is not an admin
  console.log("User is not admin, checking role:", user.role)

  switch (user.role) {
    case "reporter":
      return <ReporterDashboard />
    case "responder":
      return <ResponderDashboard />
    default:
      return <div>Unknown user role</div>
  }
}

