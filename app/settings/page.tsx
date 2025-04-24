"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  updateAccountInfo, 
  updatePassword,
  updateNotificationSettings,
  updatePrivacySettings 
} from "@/actions/settings-actions"

export default function SettingsPage() {
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
    <main className="container py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={accountInfo.name}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={accountInfo.email}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Your email" 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAccountUpdate}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={passwordInfo.currentPassword}
                    onChange={(e) => setPasswordInfo(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      value={passwordInfo.newPassword}
                      onChange={(e) => setPasswordInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => setPasswordInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handlePasswordUpdate}>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Other Integrations</CardTitle>
                <CardDescription>Connect other services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Indeed</p>
                    <p className="text-sm text-muted-foreground">Connect to find more job opportunities</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Google Drive</p>
                    <p className="text-sm text-muted-foreground">Connect to store and access your resumes</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive emails about new job matches</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      handleNotificationUpdate()
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about new jobs matching your profile</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.jobAlerts}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, jobAlerts: checked }))
                      handleNotificationUpdate()
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of job opportunities</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))
                      handleNotificationUpdate()
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Manage your privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to recruiters</p>
                  </div>
                  <Switch 
                    checked={privacySettings.profileVisibility}
                    onCheckedChange={(checked) => {
                      setPrivacySettings(prev => ({ ...prev, profileVisibility: checked }))
                      handlePrivacyUpdate()
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Collection</p>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect usage data to improve our services
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.dataCollection}
                    onCheckedChange={(checked) => {
                      setPrivacySettings(prev => ({ ...prev, dataCollection: checked }))
                      handlePrivacyUpdate()
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
