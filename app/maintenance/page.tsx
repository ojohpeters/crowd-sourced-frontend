import { AlertTriangle, CreditCard, Server, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Required</h1>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Emergency Response System</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">Service Interrupted</p>
              <p className="mt-3 text-base text-gray-500">
                Our free trial period has expired. To continue providing this critical emergency response service, we
                need to renew our hosting and domain subscriptions.
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Server className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Server Hosting</span>
                </div>
                <span className="text-sm font-medium text-red-600">Expired</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Domain Registration</span>
                </div>
                <span className="text-sm font-medium text-red-600">Expired</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Please contact the administrator to make a payment and restore service.
              </p>

              <Button className="w-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Contact Administrator
              </Button>

              <p className="mt-4 text-xs text-gray-500">
                For urgent matters, please call our emergency hotline at{" "}
                <span className="font-medium">+1 (555) 123-4567</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <p className="text-sm text-gray-500">This is a critical service. Please resolve payment issues promptly.</p>
        </div>
      </div>
    </div>
  )
}
