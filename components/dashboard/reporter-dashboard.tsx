"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, MapPin, Loader2, ExternalLink, Award } from "lucide-react"
import axios, { getImageUrl } from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Emergency = {
  id: number
  title: string
  description: string
  type: string
  status: string
  location_link?: string
  photo_url?: string
  created_at: string
  updated_at?: string
}

type Reward = {
  id: number
  points: number
  reason: string
  created_at: string
}

export default function ReporterDashboard() {
  const [activeTab, setActiveTab] = useState("report")
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    type: "accident",
    location_link: "",
  })
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [claimAmount, setClaimAmount] = useState<string>("")
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (activeTab === "emergencies") {
      fetchEmergencies()
    } else if (activeTab === "rewards") {
      fetchRewards()
    }
  }, [activeTab])

  // Update the fetchEmergencies function to match the API response structure
  const fetchEmergencies = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/me/emergencies")
      setEmergencies(response.data.data || []) // This is already correct
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

  const fetchRewards = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/me/rewards")
      setRewards(response.data.data || [])
      // Calculate total points from rewards
      const total = response.data.data.reduce((sum: number, reward: Reward) => sum + reward.points, 0)
      setTotalPoints(total)
    } catch (error) {
      console.error("Error fetching rewards:", error)
      toast({
        title: "Error",
        description: "Failed to load rewards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReportForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setReportForm((prev) => ({ ...prev, type: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPhoto(e.target.files[0])
    }
  }

  // Update the handleSubmitReport function to match the API request format
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate location link
    if (!reportForm.location_link) {
      toast({
        title: "Error",
        description: "Location link is required. Please provide a location link.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData()
      formData.append("title", reportForm.title)
      formData.append("description", reportForm.description)
      formData.append("type", reportForm.type)
      formData.append("location_link", reportForm.location_link)

      // Append photo if selected
      if (selectedPhoto) {
        formData.append("photo", selectedPhoto)
      }

      // Use axios to post the form data
      const response = await axios.post("/report-emergency", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Success",
        description: "Emergency reported successfully! Responders have been notified.",
      })

      // Reset form
      setReportForm({
        title: "",
        description: "",
        type: "accident",
        location_link: "",
      })
      setSelectedPhoto(null)

      // Switch to emergencies tab to show the new report
      setActiveTab("emergencies")
      fetchEmergencies()
    } catch (error) {
      console.error("Error reporting emergency:", error)
      toast({
        title: "Error",
        description: "Failed to report emergency",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClaimReward = async () => {
    if (!claimAmount || isNaN(Number(claimAmount)) || Number(claimAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to claim",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await axios.post("/claim-reward", { points: Number(claimAmount) })
      toast({
        title: "Success",
        description: "Reward claim submitted successfully",
      })
      setClaimDialogOpen(false)
      setClaimAmount("")
      fetchRewards()
    } catch (error: any) {
      console.error("Error claiming reward:", error)
      const errorMessage = error.response?.data?.error || "Failed to claim reward"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
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

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Reporter Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="report">Report Emergency</TabsTrigger>
          <TabsTrigger value="emergencies">My Reports</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Report an Emergency</CardTitle>
              <CardDescription>Provide details about the emergency situation you are witnessing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Emergency Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., Car Accident on Express Road"
                    value={reportForm.title}
                    onChange={handleReportChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Emergency Type
                  </label>
                  <Select value={reportForm.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="security">Security/Crime</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide details about the emergency..."
                    value={reportForm.description}
                    onChange={handleReportChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Location</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("https://maps.google.com/", "_blank")}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Open Google Maps
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location_link" className="text-sm font-medium">
                      Location Link
                    </label>
                    <Input
                      id="location_link"
                      name="location_link"
                      placeholder="Paste Google Maps link here (e.g., https://maps.google.com/?q=...)"
                      value={reportForm.location_link}
                      onChange={handleReportChange}
                      required
                      className={!reportForm.location_link ? "border-red-300" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Share your location from Google Maps and paste the link here
                    </p>
                  </div>

                  {reportForm.location_link ? (
                    <div className="flex items-center text-sm text-green-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location link captured successfully.
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      Please provide a location link to continue.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="photo" className="text-sm font-medium">
                    Upload Photo (Optional)
                  </label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="cursor-pointer"
                  />
                  {selectedPhoto && <p className="text-xs text-muted-foreground">Selected: {selectedPhoto.name}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading || !reportForm.location_link}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Report Emergency"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergencies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Emergency Reports</CardTitle>
              <CardDescription>View and track the status of emergencies you have reported</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : emergencies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>You haven&apos;t reported any emergencies yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emergencies.map((emergency) => (
                    <div key={emergency.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{emergency.title}</h3>
                        {getStatusBadge(emergency.status)}
                      </div>
                      {emergency.photo_url && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(emergency.photo_url) || "/placeholder.svg"}
                            alt={`Emergency: ${emergency.title}`}
                            className="w-full h-40 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mb-2">{emergency.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {emergency.location_link ? (
                          <a
                            href={emergency.location_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            View Location <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          "Location not available"
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Reported on: {formatDate(emergency.created_at)}
                      </div>
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
              <CardTitle>My Rewards</CardTitle>
              <CardDescription>Track your reward points and claim rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : rewards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>You haven&apos;t earned any rewards yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-primary/10 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-1">Total Points</h3>
                    <p className="text-3xl font-bold">{totalPoints}</p>
                    <Button onClick={() => setClaimDialogOpen(true)} className="mt-4" disabled={totalPoints <= 0}>
                      <Award className="h-4 w-4 mr-2" />
                      Claim Reward
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Reward History</h3>
                    {rewards.map((reward) => (
                      <div key={reward.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{reward.reason}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(reward.created_at)}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            +{reward.points} points
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claim Reward Dialog */}
              <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Claim Reward Points</DialogTitle>
                    <DialogDescription>
                      Enter the amount of points you want to claim. You currently have {totalPoints} points available.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="claimAmount" className="text-sm font-medium">
                        Points to Claim
                      </label>
                      <Input
                        id="claimAmount"
                        type="number"
                        min="1"
                        max={totalPoints}
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setClaimDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleClaimReward} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Claim Reward"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

