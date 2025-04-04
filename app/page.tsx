import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, Flame, Stethoscope, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="relative">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-screen overflow-hidden z-0">
        <video autoPlay loop muted className="absolute min-w-full min-h-full object-cover">
          <source src="/videos/firefighters.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Crowd-Sourced Emergency Response</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl">
            Report emergencies, help others, and make your community safer together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/register">Join as Reporter</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              <Link href="/register?role=responder">Become a Responder</Link>
            </Button>
          </div>
        </section>
      </div>

      <div className="container mx-auto px-4">
        {/* Emergency Types Section */}
        <section className="py-12 md:py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Types of Emergencies We Handle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <EmergencyCard
              icon={<Flame className="h-12 w-12 text-red-500" />}
              title="Fire Emergencies"
              description="Report building fires, wildfires, or any fire-related hazards in your area."
            />
            <EmergencyCard
              icon={<AlertTriangle className="h-12 w-12 text-amber-500" />}
              title="Accidents"
              description="Report vehicle accidents, workplace incidents, or other dangerous situations."
            />
            <EmergencyCard
              icon={<Stethoscope className="h-12 w-12 text-green-500" />}
              title="Medical Emergencies"
              description="Report situations requiring immediate medical attention or assistance."
            />
            <EmergencyCard
              icon={<Shield className="h-12 w-12 text-blue-500" />}
              title="Security Incidents"
              description="Report crimes, suspicious activities, or security threats in your community."
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-20 bg-muted rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Report an Emergency"
              description="Use our mobile-friendly app to quickly report emergencies with location details."
            />
            <StepCard
              number="2"
              title="Responders Verify"
              description="Trained community responders verify and assess the emergency situation."
            />
            <StepCard
              number="3"
              title="Get Rewarded"
              description="Earn points for valid reports and climb the community leaderboard."
            />
          </div>
        </section>

        {/* Call to Action Section (replacing Map Preview) */}
        <section className="py-12 md:py-20">
          <h2 className="text-3xl font-bold text-center mb-8">Join Our Emergency Response Network</h2>
          <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Be part of a community that works together to respond quickly to emergencies and save lives. Sign up today
            to start reporting emergencies or become a verified responder.
          </p>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/register">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

function EmergencyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

