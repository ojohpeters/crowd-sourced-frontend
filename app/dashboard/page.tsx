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

  // Render different dashboard based on user role
  // Use isAdmin helper instead of directly checking user.is_admin
  if (isAdmin) {
    return <AdminDashboard />
  }

  switch (user.role) {
    case "reporter":
      return <ReporterDashboard />
    case "responder":
      return <ResponderDashboard />
    default:
      return <div>Unknown user role</div>
  }
}

