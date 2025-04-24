"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // For development, allow access without authentication
    if (process.env.NODE_ENV === "development") {
      return
    }

    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // For development, show content immediately
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}
