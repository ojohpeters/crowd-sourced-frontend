import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Flame, Stethoscope, Shield, Award, Users, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About CrowdSourced</h1>
          <p className="text-lg text-muted-foreground">
            Our Crowd-Sourced Emergency Response System is designed to empower communities to respond quickly and
            effectively to emergencies.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-2">
                  To create a platform that enables communities to collaborate in identifying, verifying, and responding
                  to emergencies, ultimately saving lives and reducing the impact of disasters through timely
                  intervention.
                </p>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Report</CardTitle>
                    <CardDescription>Community members report emergencies</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Anyone can report an emergency through our platform. Simply provide details about the situation, its
                    location, and any relevant information that might help responders.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Verify</CardTitle>
                    <CardDescription>Trained responders verify reports</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our network of verified responders quickly assess the situation to confirm the emergency and provide
                    additional information to emergency services.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Respond</CardTitle>
                    <CardDescription>Coordinate effective responses</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Based on verification, appropriate emergency services are notified, and community responders can
                    provide immediate assistance while waiting for professional help.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Reward</CardTitle>
                    <CardDescription>Contributors earn points and recognition</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Users who contribute by reporting valid emergencies or helping with verification earn points that
                    can be redeemed for rewards, encouraging active community participation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Why Choose CrowdSourced?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Faster Response</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce emergency response times through community verification and real-time updates.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Community Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Leverage the power of community to create safer neighborhoods for everyone.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Verified Information</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce false alarms with our multi-step verification process by trusted responders.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Types of Emergencies We Handle</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Flame className="h-6 w-6 text-red-500" />
                  <CardTitle>Fire Emergencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Building fires, wildfires, or any fire-related hazards that pose a threat to people or property.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <CardTitle>Accidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vehicle accidents, workplace incidents, or other situations that may require immediate assistance.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Stethoscope className="h-6 w-6 text-green-500" />
                  <CardTitle>Medical Emergencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Situations where someone requires immediate medical attention due to injury or sudden illness.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <CardTitle>Security Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Criminal activities, suspicious behavior, or security threats that may endanger community members.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="bg-gradient-to-r from-red-600 to-red-700 -mx-4 md:-mx-8 px-4 md:px-8 py-12 text-white text-center rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6 max-w-xl mx-auto">
              Whether you want to report emergencies or become a verified responder, your contribution makes a
              difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

