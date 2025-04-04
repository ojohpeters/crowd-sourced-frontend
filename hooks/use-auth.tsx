"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "@/lib/axios"

type User = {
  id: number
  name: string
  email?: string
  phone?: string
  role: "reporter" | "responder" | "admin"
  is_admin?: boolean | number
  isApproved?: boolean | number
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  error: string | null
  isAdmin: boolean
  isApproved: boolean
}

type RegisterData = {
  name: string
  email: string
  phone: string
  password: string
  role: "reporter" | "responder"
}

// Helper function to normalize boolean values
const normalizeBoolean = (value: boolean | number | undefined): boolean => {
  if (value === undefined) return false
  if (typeof value === "boolean") return value
  return value === 1
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
  isAdmin: false,
  isApproved: false,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Computed properties that handle both boolean and number values
  const isAdmin = normalizeBoolean(user?.is_admin)
  const isApproved = normalizeBoolean(user?.isApproved)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Log the admin status for debugging
        console.log("User loaded from storage:", parsedUser)
        console.log("is_admin value:", parsedUser.is_admin, "type:", typeof parsedUser.is_admin)
        console.log("Normalized isAdmin:", normalizeBoolean(parsedUser.is_admin))

        // Verify token validity by fetching user profile
        fetchUserProfile(token)
      } catch (e) {
        console.error("Error parsing stored user:", e)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      }
    }

    setLoading(false)
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update user data with the latest from the server
      const userData = response.data.user
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      // Log the admin status for debugging
      console.log("User fetched from API:", userData)
      console.log("is_admin value:", userData.is_admin, "type:", typeof userData.is_admin)
      console.log("Normalized isAdmin:", normalizeBoolean(userData.is_admin))
    } catch (err) {
      // Token might be invalid or expired
      console.error("Error fetching user profile:", err)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const response = await axios.post("/login", { email, password })

      const userData = response.data.user
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(userData))

      // Log the admin status for debugging
      console.log("User logged in:", userData)
      console.log("is_admin value:", userData.is_admin, "type:", typeof userData.is_admin)
      console.log("Normalized isAdmin:", normalizeBoolean(userData.is_admin))

      setUser(userData)
      router.push("/dashboard")
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError("An error occurred during login. Please try again.")
      }
      throw err
    }
  }

  const register = async (userData: RegisterData) => {
    setError(null)
    try {
      const response = await axios.post("/register", userData)

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        setUser(response.data.user)
        router.push("/dashboard")
      } else {
        // For responders who need approval
        router.push("/pending-approval")
      }
    } catch (err: any) {
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
        setError("An error occurred during registration. Please try again.")
      }
      throw err
    }
  }

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await axios.post("/logout")
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        error,
        isAdmin,
        isApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

