"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, CreditCard, Server, Globe, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function MaintenancePage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set a fixed end time (24 hours from now) that persists across refreshes
  useEffect(() => {
    // Get the end time from localStorage or set a new one if it doesn't exist
    let endTime = localStorage.getItem("maintenanceEndTime")

    if (!endTime) {
      // Set end time to 24 hours from now
      const end = new Date()
      end.setHours(end.getHours() + 24)
      endTime = end.getTime().toString()
      localStorage.setItem("maintenanceEndTime", endTime)
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = Number.parseInt(endTime || "0")
      const distance = end - now

      if (distance <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    // Update immediately
    updateCountdown()

    // Then update every second
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const isDarkMode = theme === "dark"

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isDarkMode ? "bg-black" : "bg-white"
      } overflow-hidden`}
    >
      <div className="max-w-md w-full px-4">
        {/* Alert Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${isDarkMode ? "bg-red-900" : "bg-red-100"} p-4 rounded-full`}>
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* Critical Warning */}
        <div className={`border-2 border-red-600 p-2 rounded-md ${isDarkMode ? "bg-red-900/20" : "bg-red-50"} mb-4`}>
          <h1 className="text-xl font-extrabold text-red-600 uppercase tracking-wider">CRITICAL WARNING</h1>
        </div>

        {/* Main Content */}
        <div
          className={`shadow-lg overflow-hidden rounded-lg border ${
            isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
          }`}
        >
          <div className="px-4 py-4">
            <div className="text-center">
              <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Emergency Response System
              </p>
              <p className={`mt-1 text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                DOMAIN TERMINATION IMMINENT
              </p>
              <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Our domain and hosting services will be{" "}
                <span className="font-bold text-red-500">PERMANENTLY DELETED</span> in:
              </p>

              {/* Countdown Timer */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className={`p-2 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className={`text-2xl font-mono font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>HOURS</div>
                </div>
                <div className={`p-2 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className={`text-2xl font-mono font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>MINUTES</div>
                </div>
                <div className={`p-2 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className={`text-2xl font-mono font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>SECONDS</div>
                </div>
              </div>
            </div>

            <div className={`mt-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"} pt-4`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Server className={`h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"} mr-2`} />
                    <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>Server Hosting</span>
                  </div>
                  <span className="text-xs font-medium text-red-600">EXPIRED</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className={`h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"} mr-2`} />
                    <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Domain Registration
                    </span>
                  </div>
                  <span className="text-xs font-medium text-red-600">EXPIRED</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trash2 className={`h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"} mr-2`} />
                    <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>Domain Deletion</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-xs font-medium text-red-600">IMMINENT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`px-4 py-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            <div className="text-center">
              <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"} mb-3 font-medium`}>
                IMMEDIATE PAYMENT REQUIRED TO PREVENT DATA LOSS
              </p>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                CONTACT ADMINISTRATOR NOW
              </Button>

              <p className={`mt-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                For urgent matters, call: <span className="font-bold">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
          <p className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            ALL DATA WILL BE PERMANENTLY LOST
          </p>
        </div>
      </div>
    </div>
  )
}
