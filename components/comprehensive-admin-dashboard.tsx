"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  Loader2, AlertCircle, Shield, UserPlus, LogOut, Users, Settings, Eye, EyeOff, 
  Trash2, Edit, BarChart3, MessageSquare, TestTube, Activity, FileText, 
  BrainCircuit, Briefcase, TrendingUp, Download, Filter, Search, 
  Star, MapPin, Calendar, Clock, RefreshCw, Bell, Palette, Key,
  Database, AlertTriangle, CheckCircle, XCircle, PieChart
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AdminDashboardProps {
  adminSession?: {
    userId: string
    email: string
    role: string
    isAdmin: boolean
  }
}

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: Date
  updatedAt: Date
  resumeScore?: number
  jobApplications?: number
  lastActive?: Date
  status: 'active' | 'suspended'
}

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  category: string
  salary?: string
  source: 'adzuna' | 'manual'
  status: 'approved' | 'pending' | 'rejected'
  createdAt: Date
}

interface Analytics {
  totalUsers: number
  activeUsers: number
  dailySignups: number
  avgResumeScore: number
  topJobRoles: Array<{ role: string; applications: number }>
  conversionFunnel: {
    resumeUploaded: number
    resumeScored: number
    jobSearched: number
    jobApplied: number
  }
}

interface AIMetrics {
  currentModel: string
  avgScoringTime: number
  failedAttempts: number
  confidenceThreshold: number
}

export default function ComprehensiveAdminDashboard({ adminSession }: AdminDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  
  // State for different sections
  const [users, setUsers] = useState<User[]>([])
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [aiMetrics, setAIMetrics] = useState<AIMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Filters and search
  const [userFilter, setUserFilter] = useState("")
  const [jobFilter, setJobFilter] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate API calls - replace with actual API endpoints
      await Promise.all([
        loadUsers(),
        loadJobs(),
        loadAnalytics(),
        loadAIMetrics()
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      // TODO: Replace with actual API call to fetch users
      // const response = await fetch('/api/admin/users')
      // const data = await response.json()
      // setUsers(data.users || [])
      
      // For now, set empty array - no mock data
      setUsers([])
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([])
    }
  }

  const loadJobs = async () => {
    try {
      // TODO: Replace with actual API call to fetch jobs
      // const response = await fetch('/api/admin/jobs')
      // const data = await response.json()
      // setJobs(data.jobs || [])
      
      // For now, set empty array - no mock data
      setJobs([])
    } catch (error) {
      console.error('Failed to load jobs:', error)
      setJobs([])
    }
  }

  const loadAnalytics = async () => {
    try {
      // TODO: Replace with actual API call to fetch analytics
      // const response = await fetch('/api/admin/analytics')
      // const data = await response.json()
      // setAnalytics(data)
      
      // For now, set null - no mock data
      setAnalytics(null)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalytics(null)
    }
  }

  const loadAIMetrics = async () => {
    try {
      // TODO: Replace with actual API call to fetch AI metrics
      // const response = await fetch('/api/admin/ai-metrics')
      // const data = await response.json()
      // setAIMetrics(data)
      
      // For now, set null - no mock data
      setAIMetrics(null)
    } catch (error) {
      console.error('Failed to load AI metrics:', error)
      setAIMetrics(null)
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin-user')
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/admin/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  const exportUserData = (format: 'csv' | 'json') => {
    // Implementation for data export
    toast({
      title: "Export Started",
      description: `Exporting user data in ${format.toUpperCase()} format`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  HireSenseAI Admin Panel
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {adminSession?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="resumes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resumes</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden sm:inline">AI System</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">A/B Tests</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        analytics?.totalUsers?.toLocaleString() || '0'
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.dailySignups ? `+${analytics.dailySignups} from yesterday` : 'No data available'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        analytics?.activeUsers?.toLocaleString() || '0'
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics && analytics.totalUsers > 0 
                        ? `${((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% of total`
                        : 'No data available'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Resume Score</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        analytics?.avgResumeScore ? `${analytics.avgResumeScore}%` : 'N/A'
                      )}
                    </div>
                    {analytics?.avgResumeScore && (
                      <Progress value={analytics.avgResumeScore} className="mt-2" />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Model Status</CardTitle>
                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-bold text-green-600">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Checking...
                        </div>
                      ) : (
                        aiMetrics ? 'Online' : 'Offline'
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aiMetrics?.avgScoringTime ? `${aiMetrics.avgScoringTime}s avg processing` : 'No data available'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>User Conversion Funnel</CardTitle>
                  <CardDescription>Track user journey from resume upload to job application</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading conversion data...</span>
                    </div>
                  ) : analytics?.conversionFunnel ? (
                    <div className="space-y-4">
                      {Object.entries(analytics.conversionFunnel).map(([stage, count], index) => {
                        const percentage = (count / analytics.conversionFunnel.resumeUploaded) * 100
                        return (
                          <div key={stage} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-blue-500' :
                                index === 1 ? 'bg-green-500' :
                                index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                              }`} />
                              <span className="font-medium capitalize">
                                {stage.replace(/([A-Z])/g, ' $1')}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <Progress value={percentage} className="w-32" />
                              <span className="text-sm font-medium w-16 text-right">
                                {count.toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground w-12 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No conversion data available</p>
                      <p className="text-sm">Data will appear once users start using the platform</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Job Roles */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Job Roles by Applications</CardTitle>
                  <CardDescription>Most popular job categories</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading job role data...</span>
                    </div>
                  ) : analytics?.topJobRoles && analytics.topJobRoles.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.topJobRoles.map((role, index) => (
                        <div key={role.role} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{role.role}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress 
                              value={(role.applications / (analytics?.topJobRoles[0]?.applications || 1)) * 100} 
                              className="w-24" 
                            />
                            <span className="text-sm font-medium w-16 text-right">
                              {role.applications.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No job application data available</p>
                      <p className="text-sm">Popular job roles will appear once users start applying</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <p className="text-muted-foreground">Manage job seekers and their profiles</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => exportUserData('csv')} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={() => exportUserData('json')} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="search">Search Users</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Name, email, or ID..."
                          value={userFilter}
                          onChange={(e) => setUserFilter(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="role-filter">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="candidate">Candidates</SelectItem>
                          <SelectItem value="recruiter">Recruiters</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="score-filter">Resume Score Range</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All scores" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All scores</SelectItem>
                          <SelectItem value="90-100">90-100%</SelectItem>
                          <SelectItem value="80-89">80-89%</SelectItem>
                          <SelectItem value="70-79">70-79%</SelectItem>
                          <SelectItem value="0-69">Below 70%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status-filter">Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading users...</span>
                    </div>
                  ) : users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Resume Score</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.name || 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.resumeScore ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={user.resumeScore} className="w-16" />
                                  <span className="text-sm">{user.resumeScore}%</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No resume</span>
                              )}
                            </TableCell>
                            <TableCell>{user.jobApplications || 0}</TableCell>
                            <TableCell>
                              {user.lastActive ? (
                                <span className="text-sm">
                                  {new Date(user.lastActive).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Never</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No users found</h3>
                      <p>Users will appear here once they register for the platform</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resume Scoring Tab */}
          <TabsContent value="resumes">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Resume Scoring System</h2>
                <p className="text-muted-foreground">Manage scoring algorithms and weights</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scoring Weights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scoring Weights Configuration</CardTitle>
                    <CardDescription>Adjust the importance of different resume factors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Experience (%)</Label>
                        <Input type="number" className="w-20" placeholder="40" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label>Education (%)</Label>
                        <Input type="number" className="w-20" placeholder="20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label>Skills Match (%)</Label>
                        <Input type="number" className="w-20" placeholder="25" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label>Keywords (%)</Label>
                        <Input type="number" className="w-20" placeholder="10" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label>Format Quality (%)</Label>
                        <Input type="number" className="w-20" placeholder="5" />
                      </div>
                    </div>
                    <Button className="w-full">Update Scoring Weights</Button>
                  </CardContent>
                </Card>

                {/* Score Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Score Distribution by Domain</CardTitle>
                    <CardDescription>Average scores across different industries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading score distribution...</span>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No scoring data available</p>
                        <p className="text-sm">Domain statistics will appear once resumes are scored</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sample Scored Resumes */}
              <Card>
                <CardHeader>
                  <CardTitle>Sample Scored Resumes</CardTitle>
                  <CardDescription>Review recent scoring results</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading sample resumes...</span>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No scored resumes available</h3>
                      <p>Sample scored resumes will appear here once users upload and score their resumes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Job Listings Tab */}
          <TabsContent value="jobs">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Job Listings Management</h2>
                  <p className="text-muted-foreground">Manage jobs from Adzuna API and custom postings</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Adzuna
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Custom Job
                  </Button>
                </div>
              </div>

              {/* Job Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Search Jobs</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Title, company..." className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Source</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All sources" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="adzuna">Adzuna API</SelectItem>
                          <SelectItem value="manual">Manual Entry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input placeholder="City, state..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Jobs Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Listings ({jobs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading jobs...</span>
                    </div>
                  ) : jobs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                            </TableCell>
                            <TableCell>{job.category}</TableCell>
                            <TableCell>{job.salary || 'Not specified'}</TableCell>
                            <TableCell>
                              <Badge variant={job.source === 'adzuna' ? 'default' : 'secondary'}>
                                {job.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                job.status === 'approved' ? 'default' :
                                job.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No job listings found</h3>
                      <p>Job listings will appear here once fetched from Adzuna API or manually added</p>
                      <div className="mt-4 flex gap-2 justify-center">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Adzuna
                        </Button>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Custom Job
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Adzuna Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Adzuna API Settings</CardTitle>
                  <CardDescription>Configure automatic job fetching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Fetch Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Every 6 hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Every hour</SelectItem>
                          <SelectItem value="6">Every 6 hours</SelectItem>
                          <SelectItem value="12">Every 12 hours</SelectItem>
                          <SelectItem value="24">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Max Jobs per Fetch</Label>
                      <Input type="number" placeholder="100" />
                    </div>
                    <div>
                      <Label>Auto-approve Jobs</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-approve" />
                        <Label htmlFor="auto-approve">Enable</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI System Tab */}
          <TabsContent value="ai">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">AI System Controls</h2>
                <p className="text-muted-foreground">Monitor and configure AI model performance</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Model Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current AI Model</CardTitle>
                    <CardDescription>Model information and performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading AI metrics...</span>
                      </div>
                    ) : aiMetrics ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Model Name</span>
                          <Badge variant="secondary">{aiMetrics.currentModel}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <Badge variant="default" className="bg-green-600">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Avg Processing Time</span>
                          <span>{aiMetrics.avgScoringTime}s</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Failed Attempts (24h)</span>
                          <span className="text-red-600">{aiMetrics.failedAttempts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Confidence Threshold</span>
                          <span>{aiMetrics.confidenceThreshold}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <BrainCircuit className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No AI metrics available</p>
                        <p className="text-sm">Metrics will appear once AI system is active</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Model Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Model Configuration</CardTitle>
                    <CardDescription>Fine-tune AI behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Confidence Threshold</Label>
                      <Input type="number" step="0.1" min="0" max="1" placeholder="0.8" />
                    </div>
                    <div>
                      <Label>Max Processing Time (seconds)</Label>
                      <Input type="number" placeholder="30" />
                    </div>
                    <div>
                      <Label>Retry Attempts</Label>
                      <Input type="number" placeholder="3" />
                    </div>
                    <Button className="w-full">Update Configuration</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Prompt Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Templates</CardTitle>
                  <CardDescription>Customize AI prompts for different scoring scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="resume-scoring" className="w-full">
                    <TabsList>
                      <TabsTrigger value="resume-scoring">Resume Scoring</TabsTrigger>
                      <TabsTrigger value="job-matching">Job Matching</TabsTrigger>
                      <TabsTrigger value="skill-extraction">Skill Extraction</TabsTrigger>
                    </TabsList>
                    <TabsContent value="resume-scoring">
                      <div className="space-y-4">
                        <Label>Resume Scoring Prompt</Label>
                        <Textarea 
                          placeholder="Enter prompt template for resume scoring..."
                          rows={6}
                          defaultValue=""
                        />
                        <Button>Save Prompt</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="job-matching">
                      <div className="space-y-4">
                        <Label>Job Matching Prompt</Label>
                        <Textarea 
                          placeholder="Enter prompt template for job matching..."
                          rows={6}
                          defaultValue=""
                        />
                        <Button>Save Prompt</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="skill-extraction">
                      <div className="space-y-4">
                        <Label>Skill Extraction Prompt</Label>
                        <Textarea 
                          placeholder="Enter prompt template for skill extraction..."
                          rows={6}
                          defaultValue=""
                        />
                        <Button>Save Prompt</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* AI Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics (Last 24 Hours)</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading AI performance metrics...</span>
                    </div>
                  ) : aiMetrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {/* TODO: Get from API */}
                          0
                        </div>
                        <div className="text-sm text-muted-foreground">Successful Scorings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {aiMetrics.failedAttempts || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Failed Attempts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {aiMetrics.avgScoringTime || 0}s
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Processing</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {/* TODO: Calculate from API data */}
                          0%
                        </div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No AI performance data available</p>
                      <p className="text-sm">Metrics will appear once the AI system processes resumes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <p className="text-muted-foreground">Comprehensive platform insights</p>
              </div>

              {/* Time Range Selector */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Label>Time Range:</Label>
                    <Select defaultValue="7d">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Daily Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">No data available</div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Resume Uploads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">No data available</div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Job Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">No data available</div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Avg Session Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">0m 0s</div>
                        <div className="text-sm text-muted-foreground">No data available</div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* User Engagement Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Funnel</CardTitle>
                  <CardDescription>Track user journey and conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading engagement data...</span>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No engagement data available</h3>
                      <p>User funnel metrics will appear once analytics data is collected</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Locations</CardTitle>
                    <CardDescription>Users by geographic location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading location data...</span>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No location data available</p>
                        <p className="text-sm">Geographic data will appear once users register</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Job Categories</CardTitle>
                    <CardDescription>Most searched job types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading category data...</span>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No job category data available</p>
                        <p className="text-sm">Category statistics will appear once jobs are searched</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Feedback & Support Tab */}
          <TabsContent value="feedback">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Feedback & Support</h2>
                <p className="text-muted-foreground">Manage user feedback and support requests</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">No feedback received</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Open Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">No open support tickets</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N/A</div>
                    <div className="text-sm text-muted-foreground">No data available</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>Latest user feedback and support requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No feedback available</h3>
                    <p>User feedback and support requests will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* A/B Testing Tab */}
          <TabsContent value="testing">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">A/B Testing</h2>
                  <p className="text-muted-foreground">Create and manage experiments</p>
                </div>
                <Button size="sm">
                  <TestTube className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Active Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">No active experiments</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">No tests created yet</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Conversion Lift</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N/A</div>
                    <div className="text-sm text-muted-foreground">No data available</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Experiment History</CardTitle>
                  <CardDescription>Past and current A/B tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <TestTube className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No experiments found</h3>
                    <p>A/B tests will appear here once you create them</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">System Settings</h2>
                <p className="text-muted-foreground">Configure platform settings and integrations</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic platform configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Platform Name</Label>
                      <Input placeholder="HireSenseAI" />
                    </div>
                    <div>
                      <Label>Admin Email</Label>
                      <Input type="email" placeholder="admin@hiresenseai.com" />
                    </div>
                    <div>
                      <Label>Support Email</Label>
                      <Input type="email" placeholder="support@hiresenseai.com" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* API Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>External service integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Adzuna API Key</Label>
                      <Input type="password" placeholder="Enter API key..." />
                    </div>
                    <div>
                      <Label>DeepSeek API Key</Label>
                      <Input type="password" placeholder="Enter API key..." />
                    </div>
                    <div>
                      <Label>Email Service Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Authentication and security configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Session Timeout (minutes)</Label>
                      <Input type="number" placeholder="60" />
                    </div>
                    <div>
                      <Label>Max Login Attempts</Label>
                      <Input type="number" placeholder="5" />
                    </div>
                    <div>
                      <Label>Password Min Length</Label>
                      <Input type="number" placeholder="8" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="two-factor-required" />
                      <Label htmlFor="two-factor-required">Require 2FA for Admins</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">System Logs & Activity</h2>
                  <p className="text-muted-foreground">Monitor system activity and errors</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Log Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Log Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Log Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Service</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="auth">Authentication</SelectItem>
                          <SelectItem value="ai">AI Scoring</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Time Range</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Last 24 hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24 Hours</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Search</Label>
                      <Input placeholder="Search logs..." />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">No logs available</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Errors (24h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">0</div>
                    <div className="text-sm text-muted-foreground">No errors logged</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Warnings (24h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-sm text-muted-foreground">No warnings logged</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-bold text-green-600">Healthy</div>
                    <div className="text-sm text-muted-foreground">All systems operational</div>
                  </CardContent>
                </Card>
              </div>

              {/* Logs Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                  <CardDescription>Latest system activity and errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No logs available</h3>
                    <p>System logs will appear here once the application starts generating activity</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
