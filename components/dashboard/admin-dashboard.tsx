"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Users, Award, CheckCircle, XCircle, Clock } from "lucide-react"
import axios from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"

// Helper function to normalize boolean values
const normalizeBoolean = (value: boolean | number | undefined): boolean => {
  if (value === undefined) return false
  if (typeof value === "boolean") return value
  return value === 1
}

type Responder = {
  id: number
  name: string
  email: string
  phone: string
  status: string
  created_at: string
}

type Emergency = {
  id: number
  title: string
  description: string
  type: string
  status: string
  coordinates: {
    latitude: number
    longitude: number
  }
  verified_by: string | null
  resolved_by: string | null
  photo_url?: string
  created_at: string
  updated_at?: string
}

type LeaderboardEntry = {
  id: number
  name: string
  points: number
}

type RewardClaim = {
  id: number
  user_name: string
  reward_id: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("responders")
  const [responders, setResponders] = useState<Responder[]>([])
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [rewardClaims, setRewardClaims] = useState<RewardClaim[]>([])
  const [loading, setLoading] = useState(false)
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

  const fetchResponders = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/responders")
      setResponders(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error fetching responders:", error)
      toast({
        title: "Error",
        description: "Failed to load responders",
        variant: "destructive",
      })
      setResponders([]) // Ensure it's an empty array on error
    } finally {
      setLoading(false)
    }
  }

  const fetchEmergencies = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/emergencies")
      setEmergencies(Array.isArray(response.data.data) ? response.data.data : [])
    } catch (error) {
      console.error("Error fetching emergencies:", error)
      toast({
        title: "Error",
        description: "Failed to load emergencies",
        variant: "destructive",
      })
      setEmergencies([]) // Ensure it's an empty array on error
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/leaderboard")
      setLeaderboard(Array.isArray(response.data.top_users) ? response.data.top_users : [])
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive",
      })
      setLeaderboard([]) // Ensure it's an empty array on error
    } finally {
      setLoading(false)
    }
  }

  const fetchRewardClaims = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/admin/reward-claims")
      setRewardClaims(Array.isArray(response.data.claims) ? response.data.claims : [])
    } catch (error) {
      console.error("Error fetching reward claims:", error)
      toast({
        title: "Error",
        description: "Failed to load reward claims",
        variant: "destructive",
      })
      setRewardClaims([]) // Ensure it's an empty array on error
    } finally {
      setLoading(false)
    }
  }

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

  const processRewardClaim = async (id: number) => {
    setLoading(true)
    try {
      await axios.post(`/process-reward/${id}`)
      toast({
        title: "Success",
        description: "Reward claim processed successfully",
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
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Declined
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

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="responders">Responders</TabsTrigger>
          <TabsTrigger value="emergencies">Emergencies</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Reward Claims</TabsTrigger>
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
                  {(Array.isArray(responders) ? responders : []).map((responder) => (
                    <div key={responder.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{responder.name}</h3>
                        {getStatusBadge(responder.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Email: {responder.email}</p>
                      <p className="text-sm text-muted-foreground mb-2">Phone: {responder.phone}</p>
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Clock className="h-3 w-3 mr-1" />
                        Applied on: {formatDate(responder.created_at)}
                      </div>
                      {responder.status === "pending" && (
                        <div className="flex gap-2 mt-4">
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
            <CardHeader>
              <CardTitle>All Emergencies</CardTitle>
              <CardDescription>View and manage all reported emergencies</CardDescription>
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
                <div className="space-y-4">
                  {(Array.isArray(emergencies) ? emergencies : []).map((emergency) => (
                    <div key={emergency.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{emergency.title}</h3>
                        {getStatusBadge(emergency.status)}
                      </div>
                      {emergency.photo_url && (
                        <div className="mb-3">
                          <img
                            src={emergency.photo_url || "/placeholder.svg"}
                            alt={`Emergency: ${emergency.title}`}
                            className="w-full h-40 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mb-2">{emergency.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Reported: {formatDate(emergency.created_at)}
                      </div>
                      {emergency.verified_by && (
                        <p className="text-xs text-muted-foreground mb-1">Verified by: {emergency.verified_by}</p>
                      )}
                      {emergency.resolved_by && (
                        <p className="text-xs text-muted-foreground mb-1">Resolved by: {emergency.resolved_by}</p>
                      )}
                    </div>
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
                  {(Array.isArray(leaderboard) ? leaderboard : []).map((entry, index) => (
                    <div key={entry.id} className="border rounded-lg p-4 flex justify-between items-center">
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
                  {(Array.isArray(rewardClaims) ? rewardClaims : []).map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Claim by {claim.user_name}</h3>
                        {getStatusBadge(claim.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Reward ID: {claim.reward_id}</p>
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Clock className="h-3 w-3 mr-1" />
                        Claimed on: {formatDate(claim.created_at)}
                      </div>
                      {claim.status === "pending" && (
                        <Button
                          onClick={() => processRewardClaim(claim.id)}
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Process Claim
                        </Button>
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

