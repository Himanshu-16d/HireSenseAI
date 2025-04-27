"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface RealtimeFeedbackProps {
  resumeData: ResumeData
  section: string
}

interface ResumeAnalysis {
  skillMatch: number
  suggestions: string[]
  atsScore: number
  keywords: string[]
  instantFeedback: string
}

const defaultAnalysis: ResumeAnalysis = {
  skillMatch: 0,
  suggestions: [],
  atsScore: 0,
  keywords: [],
  instantFeedback: ""
}

export default function RealtimeFeedback({ resumeData, section }: RealtimeFeedbackProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis>(defaultAnalysis)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const analyzeSection = async () => {
      setIsLoading(true)
      try {
        // Call the server action via API route
        const response = await fetch("/api/realtime-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData })
        })
        const result = await response.json()
        setAnalysis({
          ...defaultAnalysis,
          ...result,
          suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
        })
      } catch (error) {
        console.error("Error analyzing resume:", error)
        setAnalysis(defaultAnalysis)
      } finally {
        setIsLoading(false)
      }
    }

    analyzeSection()
  }, [resumeData])

  const sectionFeedback = (analysis.suggestions ?? []).filter(suggestion => 
    suggestion.toLowerCase().includes(section.toLowerCase())
  )

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {sectionFeedback.length > 0 && (
            <Alert variant={analysis.atsScore >= 70 ? "default" : "destructive"}>
              {analysis.atsScore >= 70 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {sectionFeedback.map((feedback, index) => (
                    <li key={index} className="text-sm">
                      {feedback}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}