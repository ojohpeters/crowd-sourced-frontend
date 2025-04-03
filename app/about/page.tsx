import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Flame, Stethoscope, Shield, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Our Emergency Response System</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        <p className="text-lg text-muted-foreground">
          Our Crowd-Sourced Emergency Response System is designed to empower communities to respond quickly and
          effectively to emergencies. By leveraging the power of community reporting and verification, we can create
          safer neighborhoods for everyone.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To create a platform that enables communities to collaborate in identifying, verifying, and responding to
              emergencies, ultimately saving lives and reducing the impact of disasters through timely intervention.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-6">How It Works</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Report</CardTitle>
                <CardDescription>Community members report emergencies</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Anyone can report an emergency through our platform. Simply provide details about the situation, its
                location, and any relevant information that might help responders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Verify</CardTitle>
                <CardDescription>Trained responders verify reports</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our network of verified responders quickly assess the situation to confirm the emergency and provide
                additional information to emergency services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Respond</CardTitle>
                <CardDescription>Coordinate effective responses</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Based on verification, appropriate emergency services are notified, and community responders can provide
                immediate assistance while waiting for professional help.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Reward</CardTitle>
                <CardDescription>Contributors earn points and recognition</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Users who contribute by reporting valid emergencies or helping with verification earn points that can be
                redeemed for rewards, encouraging active community participation.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">Types of Emergencies We Handle</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Flame className="h-6 w-6 text-red-500" />
              <CardTitle>Fire Emergencies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Building fires, wildfires, or any fire-related hazards that pose a threat to people or property.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <CardTitle>Accidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Vehicle accidents, workplace incidents, or other situations that may require immediate assistance.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Stethoscope className="h-6 w-6 text-green-500" />
              <CardTitle>Medical Emergencies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Situations where someone requires immediate medical attention due to injury or sudden illness.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-6 w-6 text-blue-500" />
              <CardTitle>Security Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Criminal activities, suspicious behavior, or security threats that may endanger community members.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Whether you want to report emergencies or become a verified responder, your contribution makes a difference.
          </p>
        </div>
      </div>
    </div>
  )
}

