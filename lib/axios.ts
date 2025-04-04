import axios from "axios"

// Update the API base URL to match the documentation
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

const instance = axios.create({
  baseURL: API_BASE_URL,
})

// Add a request interceptor to attach the JWT token to every request
instance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token")

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

// Add a utility function to get the correct image URL
export const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return "/placeholder.svg"

  // Get the base URL without the /api part
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
  const baseUrl = apiBaseUrl.replace(/\/api$/, "")

  // Return the full image URL
  return `${baseUrl}/storage/${imagePath}`
}

export default instance

