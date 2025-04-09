"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, CreditCard, Server, Globe, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function MaintenancePage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  })

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1
        if (totalSeconds <= 0) {
          clearInterval(timer)
          return { hours: 0, minutes: 0, seconds: 0 }
        }

        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const isDarkMode = theme === "dark"

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-black" : "bg-white"} px-4`}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Alert Icon */}
        <div className="flex justify-center">
          <div className={`${isDarkMode ? "bg-red-900" : "bg-red-100"} p-4 rounded-full`}>
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Critical Warning */}
        <div className={`border-2 border-red-600 p-2 rounded-md ${isDarkMode ? "bg-red-900/20" : "bg-red-50"}`}>
          <h1 className="text-2xl font-extrabold text-red-600 uppercase tracking-wider">CRITICAL WARNING</h1>
        </div>

        {/* Main Content */}
        <div
          className={`shadow-lg overflow-hidden rounded-lg border ${isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Emergency Response System
              </p>
              <p className={`mt-1 text-3xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                DOMAIN TERMINATION IMMINENT
              </p>
              <p className={`mt-3 text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Our domain and hosting services will be{" "}
                <span className="font-bold text-red-500">PERMANENTLY DELETED</span> in:
              </p>

              {/* Countdown Timer */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className={`p-3 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className={`text-3xl font-mono font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>HOURS</div>
                </div>
                <div className={`p-3 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className={`text-3xl font-mono font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>MINUTES</div>
                </div>
                <div className={`p-3 rounded-md ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className={`text-3xl font-mono font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>SECONDS</div>
                </div>
              </div>
            </div>

            <div className={`mt-6 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"} pt-6`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Server className={`h-5 w-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"} mr-2`} />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>Server Hosting</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">EXPIRED</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className={`h-5 w-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"} mr-2`} />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Domain Registration
                    </span>
                  </div>
                  <span className="text-sm font-medium text-red-600">EXPIRED</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trash2 className={`h-5 w-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"} mr-2`} />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>Domain Deletion</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm font-medium text-red-600">24 HOURS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`px-4 py-5 sm:p-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
            <div className="text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"} mb-4 font-medium`}>
                IMMEDIATE PAYMENT REQUIRED TO PREVENT DATA LOSS
              </p>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                CONTACT ADMINISTRATOR NOW
              </Button>

              <p className={`mt-4 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                For urgent matters, call emergency hotline: <span className="font-bold">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            ALL DATA WILL BE PERMANENTLY LOST if payment is not received within 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
