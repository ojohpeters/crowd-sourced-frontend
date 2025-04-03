import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PendingApprovalPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-md text-center border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-50 p-4 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Application Submitted</CardTitle>
          <CardDescription>Your responder application is pending approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Thank you for applying to be a responder. Our admin team will review your application shortly. You will
            receive an email notification once your application has been approved.
          </p>
          <p className="text-muted-foreground">
            In the meantime, you can still use the platform as a reporter to submit emergency reports.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="px-8">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

