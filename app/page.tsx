import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, Flame, Stethoscope, Shield, ArrowRight, Users, Award, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Video Background with better mobile handling */}
      <div className="absolute inset-0 w-full h-screen overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          poster="/placeholder.svg?height=1080&width=1920"
        >
          <source src="/videos/firefighters.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-20 flex flex-col items-center justify-center px-4 py-16 md:py-24 lg:py-32 min-h-[80vh]">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Community-powered emergency response
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white max-w-4xl mx-auto leading-tight">
            Crowd-Sourced <span className="text-red-500">Emergency Response</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Report emergencies, help others, and make your community safer together through our collaborative platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 h-12 rounded-full">
              <Link href="/register">
                Join as Reporter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20 h-12 rounded-full"
            >
              <Link href="/register?role=responder">Become a Responder</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Users className="h-8 w-8 text-red-400 mb-2" />
              <p className="text-white text-sm">Community-Driven</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <AlertTriangle className="h-8 w-8 text-amber-400 mb-2" />
              <p className="text-white text-sm">Real-time Alerts</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
              <p className="text-white text-sm">Verified Reports</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Award className="h-8 w-8 text-blue-400 mb-2" />
              <p className="text-white text-sm">Reward System</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 bg-white py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects community members, responders, and emergency services to create a faster, more
              effective emergency response system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-xl font-bold z-10">
                1
              </div>
              {/* Line connector (hidden on mobile) */}
              <div className="absolute top-6 left-1/2 w-0.5 h-full bg-gray-200 -translate-x-1/2 hidden md:block"></div>

              <div className="pt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative z-20">
                <div className="bg-red-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Report an Emergency</h3>
                <p className="text-gray-600">
                  Use our mobile-friendly app to quickly report emergencies with location details and photos.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-bold z-10">
                2
              </div>
              {/* Line connector (hidden on mobile) */}
              <div className="absolute top-6 left-1/2 w-0.5 h-full bg-gray-200 -translate-x-1/2 hidden md:block"></div>

              <div className="pt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative z-20">
                <div className="bg-amber-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Responders Verify</h3>
                <p className="text-gray-600">
                  Trained community responders verify and assess the emergency situation in real-time.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold z-10">
                3
              </div>

              <div className="pt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative z-20">
                <div className="bg-green-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Rewarded</h3>
                <p className="text-gray-600">
                  Earn points for valid reports and climb the community leaderboard for your contributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Types Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Types of Emergencies We Handle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EmergencyCard
              icon={<Flame className="h-10 w-10 text-red-500" />}
              title="Fire Emergencies"
              description="Report building fires, wildfires, or any fire-related hazards in your area."
              color="red"
            />
            <EmergencyCard
              icon={<AlertTriangle className="h-10 w-10 text-amber-500" />}
              title="Accidents"
              description="Report vehicle accidents, workplace incidents, or other dangerous situations."
              color="amber"
            />
            <EmergencyCard
              icon={<Stethoscope className="h-10 w-10 text-green-500" />}
              title="Medical Emergencies"
              description="Report situations requiring immediate medical attention or assistance."
              color="green"
            />
            <EmergencyCard
              icon={<Shield className="h-10 w-10 text-blue-500" />}
              title="Security Incidents"
              description="Report crimes, suspicious activities, or security threats in your community."
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Emergency Response Network</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our platform provides real-time emergency information to help communities respond quickly and effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 h-12 rounded-full">
              <Link href="/register">Sign Up Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20 h-12 rounded-full"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function EmergencyCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: "red" | "amber" | "green" | "blue"
}) {
  const colorClasses = {
    red: "bg-red-50 border-red-100 hover:border-red-200 hover:shadow-red-100/50",
    amber: "bg-amber-50 border-amber-100 hover:border-amber-200 hover:shadow-amber-100/50",
    green: "bg-green-50 border-green-100 hover:border-green-200 hover:shadow-green-100/50",
    blue: "bg-blue-50 border-blue-100 hover:border-blue-200 hover:shadow-blue-100/50",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-6 rounded-xl border transition-all duration-300 hover:shadow-lg",
        colorClasses[color],
      )}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

