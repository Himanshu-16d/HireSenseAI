"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, AlertCircle, Users, User, Briefcase, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { registerUser } from "@/actions/auth-actions"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [selectedRole, setSelectedRole] = useState<"recruiter" | "candidate" | null>(null)
  const [step, setStep] = useState<"role" | "register">("role")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (searchParams) {
      const errorParam = searchParams.get("error")
      if (errorParam) {
        setError("An error occurred during registration. Please try again.")
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { 
        callbackUrl: `${callbackUrl}?role=${selectedRole}` 
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setIsLoading(true)
      const result = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: selectedRole || "candidate",
      })

      if (result.success) {
        toast.success("Account created successfully", {
          description: "Please sign in with your new account",
        })
        router.push("/login")
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role: "recruiter" | "candidate") => {
    setSelectedRole(role)
    setStep("register")
  }

  const handleBackToRoleSelection = () => {
    setStep("role")
    setSelectedRole(null)
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
      <Card className="w-full max-w-md">
        {step === "role" ? (
          // Role Selection Step
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Choose Your Role</CardTitle>
              <CardDescription className="text-center">
                Select how you'll be using HireSenseAI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleRoleSelect("candidate")}
                  className="w-full h-20 flex flex-col gap-2 p-4 hover:bg-primary/5 border-2 hover:border-primary/20"
                >
                  <User className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold">I'm a Job Seeker</div>
                    <div className="text-sm text-muted-foreground">Build resumes and find jobs</div>
                  </div>
                </Button>
                
                <div className="w-full h-20 flex flex-col gap-2 p-4 bg-muted/30 border-2 border-muted rounded-lg opacity-60">
                  <Briefcase className="h-6 w-6 text-muted-foreground mx-auto" />
                  <div className="text-center">
                    <div className="font-semibold text-muted-foreground">Recruiter</div>
                    <div className="text-xs text-muted-foreground">Contact admin for access</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Note:</strong> Recruiter accounts are created by administrators only. 
                  If you need recruiter access, please contact your system administrator.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account?</span>{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </>
        ) : (
          // Registration Step
          <>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToRoleSelection}
                  className="p-1 h-8 w-8"
                >
                  ←
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {selectedRole === "recruiter" ? (
                    <>
                      <Briefcase className="h-4 w-4" />
                      Recruiter
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      Job Seeker
                    </>
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create an account and save your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm mt-4">
                <span className="text-muted-foreground">Already have an account?</span>{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  )
}
