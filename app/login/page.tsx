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

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState<"recruiter" | "candidate" | null>(null)
  const [step, setStep] = useState<"role" | "login">("role")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (searchParams) {
      const errorParam = searchParams.get("error")
      if (errorParam) {
        console.log("Auth error:", errorParam)
        setError("An error occurred during sign in. Please try again.")
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User authenticated, redirecting to:", callbackUrl)
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      console.log("Initiating Google sign in with role:", selectedRole)
      await signIn("google", { 
        callbackUrl: `${callbackUrl}?role=${selectedRole}`,
        redirect: true
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError("Failed to sign in with Google. Please try again.")
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError("")
      const result = await signIn("credentials", {
        email,
        password,
        role: selectedRole,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push(`${callbackUrl}?role=${selectedRole}`)
      }
    } catch (error) {
      setError("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role: "recruiter" | "candidate") => {
    setSelectedRole(role)
    setStep("login")
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
                  onClick={() => handleRoleSelect("recruiter")}
                  className="w-full h-20 flex flex-col gap-2 p-4 hover:bg-primary/5 border-2 hover:border-primary/20"
                >
                  <Briefcase className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <div className="font-semibold">I'm a Recruiter</div>
                    <div className="text-sm text-muted-foreground">Find and evaluate candidates</div>
                  </div>
                </Button>
                
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
              </div>
            </CardContent>
          </>
        ) : (
          // Login Step
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
              <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center">
                Choose your preferred sign in method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {selectedRole === "candidate" && (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleGoogleSignIn} 
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Sign in with Google
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>
                </>
              )}

              {selectedRole === "recruiter" && (
                <div className="bg-muted/50 border border-orange-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Recruiter Access</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recruiter accounts are managed by administrators. Please use your company-provided credentials to sign in.
                  </p>
                </div>
              )}

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In with Email"
                  )}
                </Button>
              </form>
            </CardContent>
            {selectedRole === "candidate" && (
              <CardFooter className="flex flex-col">
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account?</span>{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Create an account
                  </Link>
                </div>
              </CardFooter>
            )}
          </>
        )}
      </Card>
    </main>
  )
}
