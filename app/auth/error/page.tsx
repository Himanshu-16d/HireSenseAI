"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error") || "unknown"

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support."
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in."
      case "Verification":
        return "The verification link may have been used or is no longer valid."
      case "OAuthSignin":
        return "Error in the OAuth sign-in process. Please try again."
      case "OAuthCallback":
        return "Error in the OAuth callback process. Please try again."
      case "OAuthCreateAccount":
        return "Could not create an OAuth account. Please try again."
      case "EmailCreateAccount":
        return "Could not create an email account. Please try again."
      case "Callback":
        return "Error in the authentication callback. Please try again."
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in using the original provider."
      case "EmailSignin":
        return "Error sending the email. Please try again."
      case "CredentialsSignin":
        return "Sign in failed. Check the details you provided are correct."
      case "SessionRequired":
        return "Please sign in to access this page."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  return (
    <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground text-center">Error code: {error}</p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
