"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  MapPin,
  ExternalLink,
  CheckCheck,
} from "lucide-react"
// Add import for getImageUrl
import axios, { getImageUrl } from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type Responder = {
  id: number
  name: string
  email: string
  phone: string
  status: string
  created_at: string
  isApproved: number
}

// Update the Emergency type to match the API response
type Emergency = {
  id: number
  user_id: number
  title: string
  description: string
  type: string
  status: string
  image_path: string | null
  location_link?: string
  verified_by: number | null
  resolved_by: number | null
  created_at: string
  updated_at?: string
  user?: {
    id: number
    name: string
    email: string
  }
  verifier?: {
    id: number
    name: string
    email: string
  }
}

type LeaderboardEntry = {
  id: number
  name: string
  points: number
}

// Updated reward claim type to match the API response
type RewardClaim = {
  id: number
  user_id: number
  points: number
  status: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
    phone: string
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("emergencies")
  const [responders, setResponders] = useState<Responder[]>([])
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>([])
  const [loading, setLoading] = useState(false)
  const [processingClaim, setProcessingClaim] = useState<number | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (activeTab === "responders") {
      fetchResponders()
    } else if (activeTab === "emergencies") {
      fetchEmergencies()
    } else if (activeTab === "leaderboard") {
      fetchLeaderboard()
    } else if (activeTab === "rewards") {
      fetchRewardClaims()
    }
  }, [activeTab])

  // Update the fetchResponders function to handle the correct API response format
  const fetchResponders = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/responders")
      // Update to access the "responder" array in the response
      setResponders(response.data.responder || [])
    } catch (error) {
      console.error("Error fetching responders:", error)
      toast({
        title: "Error",
        description: "Failed to load responders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the fetchEmergencies function to handle the correct response format
  const fetchEmergencies = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/emergencies")
      setEmergencies(response.data.emergencies || [])
    } catch (error) {
      console.error("Error fetching emergencies:", error)
      toast({
        title: "Error",
        description: "Failed to load emergencies",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the approveResponder function to match the API endpoint
  const approveResponder = async (id: number) => {
    setLoading(true)
    try {
      await axios.post(`/admin/responders/${id}/approve`)
      toast({
        title: "Success",
        description: "Responder approved successfully",
      })
      fetchResponders()
    } catch (error) {
      console.error("Error approving responder:", error)
      toast({
        title: "Error",
        description: "Failed to approve responder",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the declineResponder function to match the API endpoint
  const declineResponder = async (id: number) => {
    setLoading(true)
    try {
      await axios.post(`/admin/responders/${id}/decline`)
      toast({
        title: "Success",
        description: "Responder application declined",
      })
      fetchResponders()
    } catch (error) {
      console.error("Error declining responder:", error)
      toast({
        title: "Error",
        description: "Failed to decline responder",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the fetchLeaderboard function to use the correct endpoint and response format
  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/leaderboard")
      // Transform the data to match our LeaderboardEntry type
      const leaderboardData = response.data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        points: user.rewards_sum_points || 0,
      }))
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the fetchRewardClaims function to use the correct endpoint
  const fetchRewardClaims = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/claimrequests")
      setRewardClaims(response.data.claims || [])
    } catch (error) {
      console.error("Error fetching reward claims:", error)
      toast({
        title: "Error",
        description: "Failed to load reward claims",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the processRewardClaim function to use the correct endpoint and include status
  const processRewardClaim = async (id: number, status: "approved" | "rejected") => {
    setProcessingClaim(id)
    try {
      await axios.post(`/process-reward/${id}`, { status })
      toast({
        title: "Success",
        description: `Reward claim ${status} successfully`,
      })
      fetchRewardClaims()
    } catch (error) {
      console.error("Error processing reward claim:", error)
      toast({
        title: "Error",
        description: "Failed to process reward claim",
        variant: "destructive",
      })
    } finally {
      setProcessingClaim(null)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        )
      case "declined":
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {status === "declined" ? "Declined" : "Rejected"}
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
      case "processed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Processed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const isExpanded = (id: number) => !!expandedItems[id]

  // Update the EmergencyDetailSheet component to use getImageUrl
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
            {emergency.image_path && (
              <div>
                <h4 className="text-sm font-medium mb-2">Photo</h4>
                <img
                  src={getImageUrl(emergency.image_path) || "/placeholder.svg"}
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
                {emergency.updated_at && emergency.updated_at !== emergency.created_at && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Updated: {formatDate(emergency.updated_at)}</span>
                  </div>
                )}
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
                          View Location
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
                  <span className="text-muted-foreground">{emergency.user?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{emergency.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reporter ID: {emergency.user_id}</span>
                </div>
              </div>
            </div>

            {emergency.verified_by && emergency.verifier && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Verification Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">Verified by: {emergency.verifier.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{emergency.verifier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Verifier ID: {emergency.verified_by}</span>
                  </div>
                </div>
              </div>
            )}

            {emergency.resolved_by && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Resolution Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Resolved by ID: {emergency.resolved_by}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="container py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="responders">Responders</TabsTrigger>
          <TabsTrigger value="emergencies">Emergencies</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="responders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Responders</CardTitle>
              <CardDescription>Approve or decline responder applications</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : responders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No responder applications to review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responders.map((responder) => (
                    <div key={responder.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <h3 className="font-medium">{responder.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            responder.isApproved
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {responder.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Email: {responder.email}</p>
                      <p className="text-sm text-muted-foreground mb-2">Phone: {responder.phone}</p>
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Clock className="h-3 w-3 mr-1" />
                        Applied on: {formatDate(responder.created_at)}
                      </div>
                      {responder.isApproved === 0 && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button
                            onClick={() => approveResponder(responder.id)}
                            variant="outline"
                            className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
                            disabled={loading}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => declineResponder(responder.id)}
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                            disabled={loading}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergencies" className="mt-6">
          <Card>
            {/* Remove map from the emergencies tab header */}
            <CardHeader>
              <div>
                <CardTitle>All Emergencies</CardTitle>
                <CardDescription>View and manage all reported emergencies</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : emergencies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No emergencies have been reported yet.</p>
                </div>
              ) : (
                // Update the emergency item display in the emergencies tab
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
                            {emergency.image_path && (
                              <div className="mb-2">
                                <img
                                  src={getImageUrl(emergency.image_path) || "/placeholder.svg"}
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
                            <div className="flex items-center text-xs text-muted-foreground mb-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(emergency.created_at)}
                            </div>
                            {/* Update the emergency item display to show location_link instead of coordinates */}
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
                                        View Location
                                      </a>
                                    ) : (
                                      <p className="text-muted-foreground">Location information not available</p>
                                    )}
                                  </div>
                                </div>
                                {emergency.verified_by && (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                    <span className="text-muted-foreground">
                                      Verified by: {emergency.verifier?.name || emergency.verified_by}
                                    </span>
                                  </div>
                                )}
                                {emergency.resolved_by && (
                                  <div className="flex items-center gap-2">
                                    <CheckCheck className="h-4 w-4 text-green-500" />
                                    <span className="text-muted-foreground">
                                      Resolved by ID: {emergency.resolved_by}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-2">Reporter Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{emergency.user?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{emergency.user?.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Reporter ID: {emergency.user_id}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {emergency.image_path && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Photo</h4>
                              <img
                                src={getImageUrl(emergency.image_path) || "/placeholder.svg"}
                                alt={`Emergency: ${emergency.title}`}
                                className="w-full h-40 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>View top contributors in the community</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No users have earned points yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="border rounded-lg p-4 flex justify-between items-center flex-wrap gap-2"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <h3 className="font-medium">{entry.name}</h3>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        {entry.points} points
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward Claims</CardTitle>
              <CardDescription>Process reward claims from users</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : rewardClaims.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No reward claims to process.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rewardClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <div>
                          <h3 className="font-medium">Claim by {claim.user.name}</h3>
                          <p className="text-sm text-muted-foreground">Email: {claim.user.email}</p>
                          <p className="text-sm text-muted-foreground">Phone: {claim.user.phone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(claim.status)}
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                            {claim.points} points
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Clock className="h-3 w-3 mr-1" />
                        Claimed on: {formatDate(claim.created_at)}
                      </div>
                      {claim.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button
                            onClick={() => processRewardClaim(claim.id, "approved")}
                            variant="outline"
                            className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
                            disabled={processingClaim === claim.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Claim
                          </Button>
                          <Button
                            onClick={() => processRewardClaim(claim.id, "rejected")}
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                            disabled={processingClaim === claim.id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Claim
                          </Button>
                        </div>
                      )}
                    </div>
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

