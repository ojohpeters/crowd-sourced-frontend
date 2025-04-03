"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, User, Phone, Mail, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"
import axios from "@/lib/axios"
import LoadingSpinner from "@/components/loading-spinner"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login")
    }

    if (user) {
      // Fetch user profile data
      const fetchProfile = async () => {
        try {
          const response = await axios.get("/api/user")
          const userData = response.data.user
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          })
        } catch (error) {
          console.error("Error fetching profile:", error)
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          })
        }
      }

      fetchProfile()
    }
  }, [user, loading, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axios.put("/api/profile/update", formData)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (err: any) {
      console.error("Error updating profile:", err)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err.response?.data?.details) {
        // Format validation errors
        const details = err.response.data.details
        const errorMessages = Object.keys(details)
          .map((key) => `${key}: ${details[key].join(", ")}`)
          .join("; ")
        setError(errorMessages)
      } else {
        setError("An error occurred while updating your profile. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-red-50 p-3 rounded-full">
              <User className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">My Profile</CardTitle>
          <CardDescription className="text-center">View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  className="pl-10 h-11"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-10 h-11"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  className="pl-10 h-11"
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-muted rounded-md">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  Account Type: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
                <p className="text-xs text-muted-foreground">Account type cannot be changed</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

