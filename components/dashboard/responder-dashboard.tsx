"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
// Add imports for XCircle for decline functionality
import {
  AlertCircle,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Flame,
  Stethoscope,
  Shield,
} from "lucide-react"
// Add import for getImageUrl
import axios, { getImageUrl } from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"

// Update the type definition to include location_url
type Emergency = {
  id: number
  title: string
  description: string
  type: string
  status: string
  location_link?: string
  reporter: Reporter
  photo_url?: string
  created_at: string
  updated_at?: string
}

type Reporter = {
  id: number
  name: string
  email: string
}

// Type for emergency statistics
type EmergencyStats = {
  pending: number
  verified: number
  resolved: number
  total: number
  byType: {
    accident: number
    fire: number
    medical: number
    security: number
    other: number
  }
}

export default function ResponderDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [stats, setStats] = useState<EmergencyStats>({
    pending: 0,
    verified: 0,
    resolved: 0,
    total: 0,
    byType: {
      accident: 0,
      fire: 0,
      medical: 0,
      security: 0,
      other: 0,
    },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchEmergencies()

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchEmergencies(false) // Don't show loading state for polling
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [activeTab])

  // Update the fetchEmergencies function to use the correct endpoint
  const fetchEmergencies = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await axios.get("/responder/emergencies")
      // Filter emergencies based on active tab
      let filtered = response.data.data || []

      // Calculate statistics
      const newStats: EmergencyStats = {
        pending: 0,
        verified: 0,
        resolved: 0,
        total: filtered.length,
        byType: {
          accident: 0,
          fire: 0,
          medical: 0,
          security: 0,
          other: 0,
        },
      }

      filtered.forEach((e: Emergency) => {
        // Count by status
        if (e.status === "pending") newStats.pending++
        else if (e.status === "verified") newStats.verified++
        else if (e.status === "resolved") newStats.resolved++

        // Count by type
        if (e.type === "accident") newStats.byType.accident++
        else if (e.type === "fire") newStats.byType.fire++
        else if (e.type === "medical") newStats.byType.medical++
        else if (e.type === "security") newStats.byType.security++
        else newStats.byType.other++
      })

      setStats(newStats)

      if (activeTab === "pending") {
        filtered = filtered.filter((e: Emergency) => e.status === "pending")
      } else if (activeTab === "verified") {
        filtered = filtered.filter((e: Emergency) => e.status === "verified")
      }

      setEmergencies(filtered)
    } catch (error) {
      console.error("Error fetching emergencies:", error)
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load emergencies",
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // Update the verifyEmergency function to match the API endpoint
  const verifyEmergency = async (id: number) => {
    setLoading(true)
    try {
      await axios.post(`/emergencies/${id}/verify`)
      toast({
        title: "Success",
        description: "Emergency verified successfully",
      })
      fetchEmergencies()
    } catch (error) {
      console.error("Error verifying emergency:", error)
      toast({
        title: "Error",
        description: "Failed to verify emergency",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add the declineEmergency function
  const declineEmergency = async (id: number) => {
    setLoading(true)
    try {
      await axios.post(`/emergency/${id}/decline`)
      toast({
        title: "Success",
        description: "Emergency declined successfully",
      })
      fetchEmergencies()
    } catch (error) {
      console.error("Error declining emergency:", error)
      toast({
        title: "Error",
        description: "Failed to decline emergency",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEmergencyTypeIcon = (type: string) => {
    switch (type) {
      case "accident":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Accident
          </Badge>
        )
      case "fire":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Fire
          </Badge>
        )
      case "medical":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Medical
          </Badge>
        )
      case "security":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Security
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Verified
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const isExpanded = (id: number) => !!expandedItems[id]

  // Remove EmergencyMap component and replace with location_url link
  // Update the EmergencyDetailSheet component
  const EmergencyDetailSheet = ({ emergency }: { emergency: Emergency }) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            Details
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 flex-wrap">
              {emergency.title}
              {getStatusBadge(emergency.status)}
            </SheetTitle>
            <SheetDescription>Emergency ID: {emergency.id}</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {emergency.photo_url && (
              <div>
                <h4 className="text-sm font-medium mb-2">Photo</h4>
                <img
                  src={getImageUrl(emergency.photo_url) || "/placeholder.svg"}
                  alt={`Emergency: ${emergency.title}`}
                  className="w-full h-60 object-cover rounded-md"
                />
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{emergency.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Emergency Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {getEmergencyTypeIcon(emergency.type)}
                  <span className="text-muted-foreground">Emergency Type</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reported: {formatDate(emergency.created_at)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Location:</p>
                    {emergency.location_link ? (
                      <p className="text-muted-foreground">
                        <a
                          href={emergency.location_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          View on Google Maps
                        </a>
                      </p>
                    ) : (
                      <p className="text-muted-foreground">Location information not available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Reporter Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{emergency.reporter.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{emergency.reporter.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reporter ID: {emergency.reporter.id}</span>
                </div>
              </div>
            </div>

            {emergency.status === "pending" && (
              <div className="border-t pt-4 space-y-2">
                <Button onClick={() => verifyEmergency(emergency.id)} className="w-full" disabled={loading}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Emergency
                </Button>
                <Button
                  onClick={() => declineEmergency(emergency.id)}
                  variant="destructive"
                  className="w-full"
                  disabled={loading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline Emergency
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Component for the emergency type card in the overview
  const EmergencyTypeCard = ({
    icon,
    title,
    count,
    total,
  }: {
    icon: React.ReactNode
    title: string
    count: number
    total: number
  }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0

    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">{title}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{percentage}%</p>
              </div>
              <Progress value={percentage} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Responder Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>

        {/* Remove map from the map tab and replace with a list view */}
        {/* Replace map tab with overview dashboard */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Overview</CardTitle>
              <CardDescription>Summary of all reported emergencies in your area</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Status summary cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-yellow-50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Pending</p>
                            <h3 className="text-3xl font-bold text-yellow-900">{stats.pending}</h3>
                          </div>
                          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                          </div>
                        </div>
                        <p className="text-xs text-yellow-700 mt-2">Emergencies awaiting verification</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-blue-800">Verified</p>
                            <h3 className="text-3xl font-bold text-blue-900">{stats.verified}</h3>
                          </div>
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">Emergencies you've verified</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-green-800">Resolved</p>
                            <h3 className="text-3xl font-bold text-green-900">{stats.resolved}</h3>
                          </div>
                          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <p className="text-xs text-green-700 mt-2">Emergencies that have been resolved</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Emergency types breakdown */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Emergency Types</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <EmergencyTypeCard
                        icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
                        title="Accidents"
                        count={stats.byType.accident}
                        total={stats.total}
                      />
                      <EmergencyTypeCard
                        icon={<Flame className="h-6 w-6 text-red-600" />}
                        title="Fires"
                        count={stats.byType.fire}
                        total={stats.total}
                      />
                      <EmergencyTypeCard
                        icon={<Stethoscope className="h-6 w-6 text-green-600" />}
                        title="Medical"
                        count={stats.byType.medical}
                        total={stats.total}
                      />
                      <EmergencyTypeCard
                        icon={<Shield className="h-6 w-6 text-blue-600" />}
                        title="Security"
                        count={stats.byType.security}
                        total={stats.total}
                      />
                    </div>
                  </div>

                  {/* Recent emergencies */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Emergencies</h3>
                    <div className="space-y-4">
                      {emergencies.slice(0, 3).map((emergency) => (
                        <Card key={emergency.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                              {emergency.photo_url && (
                                <div className="mb-2">
                                  <img
                                    src={getImageUrl(emergency.photo_url) || "/placeholder.svg"}
                                    alt={`Emergency: ${emergency.title}`}
                                    className="w-full h-32 object-cover rounded-md"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-medium">{emergency.title}</h3>
                                {getStatusBadge(emergency.status)}
                                {getEmergencyTypeIcon(emergency.type)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{emergency.description}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(emergency.created_at)}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {emergency.location_link ? (
                                  <a
                                    href={emergency.location_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View Location
                                  </a>
                                ) : (
                                  "Location not available"
                                )}
                              </div>
                              <div className="mt-2">
                                <EmergencyDetailSheet emergency={emergency} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {emergencies.length > 3 && (
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("pending")}>
                          View All Emergencies
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Emergencies</CardTitle>
              <CardDescription>Review and verify reported emergencies in your area</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : emergencies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No pending emergencies to verify.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emergencies.map((emergency) => (
                    <Collapsible
                      key={emergency.id}
                      open={isExpanded(emergency.id)}
                      onOpenChange={() => toggleExpand(emergency.id)}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-medium">{emergency.title}</h3>
                              {getStatusBadge(emergency.status)}
                              {getEmergencyTypeIcon(emergency.type)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{emergency.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(emergency.created_at)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              Reported by: {emergency.reporter.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isExpanded(emergency.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle details</span>
                              </Button>
                            </CollapsibleTrigger>
                            <EmergencyDetailSheet emergency={emergency} />
                          </div>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-2 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Emergency Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <div>
                                    <p className="text-muted-foreground">Location:</p>
                                    {emergency.location_link ? (
                                      <a
                                        href={emergency.location_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        View on Google Maps
                                      </a>
                                    ) : (
                                      <p className="text-muted-foreground">Location information not available</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-2">Reporter Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{emergency.reporter.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{emergency.reporter.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Reporter ID: {emergency.reporter.id}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {emergency.photo_url && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Photo</h4>
                              <img
                                src={getImageUrl(emergency.photo_url) || "/placeholder.svg"}
                                alt={`Emergency: ${emergency.title}`}
                                className="w-full h-40 object-cover rounded-md"
                              />
                            </div>
                          )}

                          {/* Update the pending tab to include decline button */}
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <Button onClick={() => verifyEmergency(emergency.id)} className="flex-1" disabled={loading}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify Emergency
                            </Button>
                            <Button
                              onClick={() => declineEmergency(emergency.id)}
                              variant="destructive"
                              className="flex-1"
                              disabled={loading}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline Emergency
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Verified Emergencies</CardTitle>
              <CardDescription>View emergencies you have verified</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : emergencies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>You haven&apos;t verified any emergencies yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emergencies.map((emergency) => (
                    <Collapsible
                      key={emergency.id}
                      open={isExpanded(emergency.id)}
                      onOpenChange={() => toggleExpand(emergency.id)}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-medium">{emergency.title}</h3>
                              {getStatusBadge(emergency.status)}
                              {getEmergencyTypeIcon(emergency.type)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{emergency.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(emergency.created_at)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              Reported by: {emergency.reporter.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isExpanded(emergency.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle details</span>
                              </Button>
                            </CollapsibleTrigger>
                            <EmergencyDetailSheet emergency={emergency} />
                          </div>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-2 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Emergency Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <div>
                                    <p className="text-muted-foreground">Location:</p>
                                    {emergency.location_link ? (
                                      <a
                                        href={emergency.location_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        View on Google Maps
                                      </a>
                                    ) : (
                                      <p className="text-muted-foreground">Location information not available</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-2">Reporter Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{emergency.reporter.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{emergency.reporter.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Reporter ID: {emergency.reporter.id}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {emergency.photo_url && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Photo</h4>
                              <img
                                src={getImageUrl(emergency.photo_url) || "/placeholder.svg"}
                                alt={`Emergency: ${emergency.title}`}
                                className="w-full h-40 object-cover rounded-md"
                              />
                            </div>
                          )}

                          <div className="mt-4">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              Verified by you
                            </Badge>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

