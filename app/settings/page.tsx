"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import ProtectedRoute from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Bell, Shield, User, Laptop, Download } from "lucide-react"
import { 
  updateAccountInfo, 
  updatePassword,
  updateNotificationSettings,
  updatePrivacySettings 
} from "@/actions/settings-actions"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const { data: session } = useSession()
  
  // Account Information State
  const [accountInfo, setAccountInfo] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || ""
  })

  // Password State
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    jobAlerts: true,
    weeklyDigest: true
  })

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    dataCollection: true
  })

  // Additional Settings State
  const [aiSettings, setAISettings] = useState({
    enhancedAnalysis: true,
    autoSuggestions: true,
    dataSharing: true
  })

  const [exportSettings, setExportSettings] = useState({
    includeHistory: true,
    includeAnalytics: true
  })

  // Handle Account Info Update
  const handleAccountUpdate = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to update your account")
      return
    }

    const result = await updateAccountInfo(accountInfo)
    toast(result.success ? "Success" : "Error", {
      description: result.message,
      ...(result.success ? {} : { style: { backgroundColor: "var(--destructive)", color: "white" } })
    })
  }

  // Handle Password Update
  const handlePasswordUpdate = async () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const result = await updatePassword({
      currentPassword: passwordInfo.currentPassword,
      newPassword: passwordInfo.newPassword
    })

    toast(result.success ? "Success" : "Error", {
      description: result.message,
      ...(result.success ? {} : { style: { backgroundColor: "var(--destructive)", color: "white" } })
    })

    if (result.success) {
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    }
  }

  // Handle Notification Settings Update
  const handleNotificationUpdate = async () => {
    const result = await updateNotificationSettings(notificationSettings)
    toast(result.success ? "Success" : "Error", {
      description: result.message,
      ...(result.success ? {} : { style: { backgroundColor: "var(--destructive)", color: "white" } })
    })
  }

  // Handle Privacy Settings Update
  const handlePrivacyUpdate = async () => {
    const result = await updatePrivacySettings(privacySettings)
    toast(result.success ? "Success" : "Error", {
      description: result.message,
      ...(result.success ? {} : { style: { backgroundColor: "var(--destructive)", color: "white" } })
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-muted p-1">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={accountInfo.name}
                      onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountInfo.email}
                      onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAccountUpdate}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordInfo.currentPassword}
                      onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordInfo.newPassword}
                      onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordUpdate}>Update Password</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your account via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Job Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new job matches
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.jobAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, jobAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your job search progress
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                  }
                />
              </div>
              <Button onClick={handleNotificationUpdate} className="w-full">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to potential employers
                  </p>
                </div>
                <Switch
                  checked={privacySettings.profileVisibility}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({ ...privacySettings, profileVisibility: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow us to collect data to improve your experience
                  </p>
                </div>
                <Switch
                  checked={privacySettings.dataCollection}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({ ...privacySettings, dataCollection: checked })
                  }
                />
              </div>
              <Button onClick={handlePrivacyUpdate} className="w-full">
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
              <CardDescription>
                Configure how AI assists you in your job search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enhanced Analysis</Label>
                  <p className="text-sm text-muted-foreground">
                    Use advanced AI to analyze your resume and applications
                  </p>
                </div>
                <Switch
                  checked={aiSettings.enhancedAnalysis}
                  onCheckedChange={(checked) => 
                    setAISettings({ ...aiSettings, enhancedAnalysis: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive AI-powered suggestions for improvements
                  </p>
                </div>
                <Switch
                  checked={aiSettings.autoSuggestions}
                  onCheckedChange={(checked) => 
                    setAISettings({ ...aiSettings, autoSuggestions: checked })
                  }
                />
              </div>
              <Button className="w-full">
                Save AI Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Include History</Label>
                  <p className="text-sm text-muted-foreground">
                    Include your application history in the export
                  </p>
                </div>
                <Switch
                  checked={exportSettings.includeHistory}
                  onCheckedChange={(checked) => 
                    setExportSettings({ ...exportSettings, includeHistory: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Include Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Include your usage analytics in the export
                  </p>
                </div>
                <Switch
                  checked={exportSettings.includeAnalytics}
                  onCheckedChange={(checked) => 
                    setExportSettings({ ...exportSettings, includeAnalytics: checked })
                  }
                />
              </div>
              <div className="flex gap-4">
                <Button className="flex-1">
                  Export Data
                </Button>
                <Button variant="destructive" className="flex-1">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
