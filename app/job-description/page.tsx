"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, Copy } from "lucide-react"
import { JobDescriptionGenerator } from "@/components/job-description-generator"
import ProtectedRoute from "@/components/protected-route"

export default function JobDescriptionPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">AI Job Description Generator</CardTitle>
            <CardDescription>Create professional job descriptions powered by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <JobDescriptionGenerator />
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  )
}