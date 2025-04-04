import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEmergencyTypeData = (type: string) => {
  switch (type) {
    case "accident":
      return {
        label: "Accident",
        className: "bg-amber-100 text-amber-800 border-amber-200",
      }
    case "fire":
      return {
        label: "Fire",
        className: "bg-red-100 text-red-800 border-red-200",
      }
    case "medical":
      return {
        label: "Medical",
        className: "bg-green-100 text-green-800 border-green-200",
      }
    case "security":
      return {
        label: "Security",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      }
    default:
      return {
        label: type,
        className: "",
      }
  }
}

export const getStatusData = (status: string) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      }
    case "verified":
      return {
        label: "Verified",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      }
    case "resolved":
      return {
        label: "Resolved",
        className: "bg-green-100 text-green-800 border-green-200",
      }
    case "rejected":
      return {
        label: "Rejected",
        className: "bg-red-100 text-red-800 border-red-200",
      }
    default:
      return {
        label: status,
        className: "",
      }
  }
}

export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

