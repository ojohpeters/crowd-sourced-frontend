"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  MapPin,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  Filter,
  Search,
} from "lucide-react"
import axios from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getEmergencyTypeData, getStatusData, formatDate } from "@/lib/utils"

// Helper function to normalize boolean values
const normalizeBoolean = (value: boolean | number | undefined): boolean => {
  if (value === undefined) return false
  if (typeof value === "boolean") return value
  return value === 1
}

type Reporter = {
  id: number
  name: string
  email?: string
  phone?: string
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
  reporter?: Reporter
  reporter_id?: number
  reporter_name?: string
  photo_url?: string
  created_at: string
  updated_at?: string
  verified_by?: string
  resolved_by?: string
}

export default function ResponderDashboard() {
  const [activeTab, setActiveTab] = useState("list")
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [filteredEmergencies, setFilteredEmergencies] = useState<Emergency[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedEmergencyId, setExpandedEmergencyId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "verified"])
  const [typeFilter, setTypeFilter] = useState<string[]>(["fire", "accident", "medical", "security", "other"])
  const { toast } = useToast()

  useEffect(() => {
    fetchEmergencies()

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchEmergencies(false) // Don't show loading state for polling
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Apply filters and search whenever dependencies change
  useEffect(() => {
    if (!emergencies.length) {
      setFilteredEmergencies([])
      return
    }

    let filtered = [...emergencies]

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((e) => statusFilter.includes(e.status))
    }

    // Apply type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter((e) => typeFilter.includes(e.type))
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          (e.reporter?.name && e.reporter.name.toLowerCase().includes(query)) ||
          (e.reporter_name && e.reporter_name.toLowerCase().includes(query)),
      )
    }

    setFilteredEmergencies(filtered)
  }, [emergencies, statusFilter, typeFilter, searchQuery])

  const fetchEmergencies = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await axios.get("/responder/emergencies")
      const data = response.data.data || []
      setEmergencies(data)
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

  const resolveEmergency = async (id: number) => {
    setLoading(true)
    try {
      await axios.post(`/emergencies/${id}/resolve`)
      toast({
        title: "Success",
        description: "Emergency marked as resolved",
      })
      fetchEmergencies()
    } catch (error) {
      console.error("Error resolving emergency:", error)
      toast({
        title: "Error",
        description: "Failed to resolve emergency",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: number) => {
    if (expandedEmergencyId === id) {
      setExpandedEmergencyId(null)
    } else {
      setExpandedEmergencyId(id)
    }
  }

  // Render emergency type badge
  const renderEmergencyTypeBadge = (type: string) => {
    const typeData = getEmergencyTypeData(type)
    return (
      <Badge variant="outline" className={typeData.className}>
        {typeData.label}
      </Badge>
    )
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const statusData = getStatusData(status)
    return (
      <Badge variant="outline" className={statusData.className}>
        {statusData.label}
      </Badge>
    )
  }

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-6">Responder Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Emergency List</TabsTrigger>
          <TabsTrigger value="verified">Verified Emergencies</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between mt-4 mb-2">
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search emergencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Status</h4>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("pending")}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked ? [...statusFilter, "pending"] : statusFilter.filter((s) => s !== "pending"),
                      )
                    }}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("verified")}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked ? [...statusFilter, "verified"] : statusFilter.filter((s) => s !== "verified"),
                      )
                    }}
                  >
                    Verified
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("resolved")}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked ? [...statusFilter, "resolved"] : statusFilter.filter((s) => s !== "resolved"),
                      )
                    }}
                  >
                    Resolved
                  </DropdownMenuCheckboxItem>
                </div>
                <div className="p-2 border-t">
                  <h4 className="mb-2 text-sm font-medium">Type</h4>
                  <DropdownMenuCheckboxItem
                    checked={typeFilter.includes("fire")}
                    onCheckedChange={(checked) => {
                      setTypeFilter(checked ? [...typeFilter, "fire"] : typeFilter.filter((t) => t !== "fire"))
                    }}
                  >
                    Fire
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={typeFilter.includes("accident")}
                    onCheckedChange={(checked) => {
                      setTypeFilter(checked ? [...typeFilter, "accident"] : typeFilter.filter((t) => t !== "accident"))
                    }}
                  >
                    Accident
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={typeFilter.includes("medical")}
                    onCheckedChange={(checked) => {
                      setTypeFilter(checked ? [...typeFilter, "medical"] : typeFilter.filter((t) => t !== "medical"))
                    }}
                  >
                    Medical
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={typeFilter.includes("security")}
                    onCheckedChange={(checked) => {
                      setTypeFilter(checked ? [...typeFilter, "security"] : typeFilter.filter((t) => t !== "security"))
                    }}
                  >
                    Security
                  </DropdownMenuCheckboxItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="outline" size="sm" onClick={() => fetchEmergencies()} disabled={loading}>
            Refresh
          </Button>
        </div>

        <TabsContent value="list" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>All Emergencies</CardTitle>
              <CardDescription>Review and manage reported emergencies in your area</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && filteredEmergencies.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredEmergencies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No emergencies found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEmergencies.map((emergency) => (
                    <Collapsible
                      key={emergency.id}
                      open={expandedEmergencyId === emergency.id}
                      onOpenChange={() => toggleExpand(emergency.id)}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-1 h-auto">
                                {expandedEmergencyId === emergency.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <h3 className="font-medium">{emergency.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderEmergencyTypeBadge(emergency.type)}
                            {renderStatusBadge(emergency.status)}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2 text-sm">
                          <div className="flex items-center text-muted-foreground mb-2 md:mb-0">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {formatDate(emergency.created_at)}
                          </div>

                          <div className="flex items-center text-muted-foreground">
                            <User className="h-3.5 w-3.5 mr-1" />
                            Reported by: {emergency.reporter?.name || emergency.reporter_name || "Anonymous"}
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          Location: {emergency.coordinates?.latitude.toFixed(4)},{" "}
                          {emergency.coordinates?.longitude.toFixed(4)}
                        </div>

                        <div className="flex gap-2 mt-4">
                          {emergency.status === "pending" && (
                            <Button
                              onClick={() => verifyEmergency(emergency.id)}
                              size="sm"
                              className="flex-1"
                              disabled={loading}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify
                            </Button>
                          )}

                          {emergency.status === "verified" && (
                            <Button
                              onClick={() => resolveEmergency(emergency.id)}
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              disabled={loading}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="border-t p-4 bg-muted/30">
                          {emergency.photo_url && (
                            <div className="mb-4">
                              <img
                                src={emergency.photo_url || "/placeholder.svg"}
                                alt={`Emergency: ${emergency.title}`}
                                className="w-full h-48 object-cover rounded-md"
                              />
                            </div>
                          )}

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Description</h4>
                              <p className="text-sm text-muted-foreground">{emergency.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Reporter Details</h4>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">Name:</span>{" "}
                                    {emergency.reporter?.name || emergency.reporter_name || "Anonymous"}
                                  </p>
                                  {emergency.reporter?.email && (
                                    <p className="text-sm flex items-center">
                                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      {emergency.reporter.email}
                                    </p>
                                  )}
                                  {emergency.reporter?.phone && (
                                    <p className="text-sm flex items-center">
                                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      {emergency.reporter.phone}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Emergency Status</h4>
                                <div className="space-y-1">
                                  {emergency.verified_by && (
                                    <p className="text-sm">
                                      <span className="text-muted-foreground">Verified by:</span>{" "}
                                      {emergency.verified_by}
                                    </p>
                                  )}
                                  {emergency.resolved_by && (
                                    <p className="text-sm">
                                      <span className="text-muted-foreground">Resolved by:</span>{" "}
                                      {emergency.resolved_by}
                                    </p>
                                  )}
                                  {emergency.updated_at && (
                                    <p className="text-sm flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      Last updated: {formatDate(emergency.updated_at)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Button
                                onClick={() =>
                                  window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${emergency.coordinates.latitude},${emergency.coordinates.longitude}`,
                                    "_blank",
                                  )
                                }
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                Get Directions
                              </Button>
                            </div>
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

        <TabsContent value="verified" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Verified Emergencies</CardTitle>
              <CardDescription>View emergencies you have verified</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && filteredEmergencies.filter((e) => e.status === "verified").length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredEmergencies.filter((e) => e.status === "verified").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No verified emergencies found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEmergencies
                    .filter((e) => e.status === "verified")
                    .map((emergency) => (
                      <div key={emergency.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{emergency.title}</h3>
                          {renderEmergencyTypeBadge(emergency.type)}
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
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(emergency.created_at)}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mb-4">
                          <MapPin className="h-3 w-3 mr-1" />
                          Location: {emergency.coordinates?.latitude.toFixed(4)},{" "}
                          {emergency.coordinates?.longitude.toFixed(4)}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => resolveEmergency(emergency.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={loading}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </Button>
                        </div>
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

