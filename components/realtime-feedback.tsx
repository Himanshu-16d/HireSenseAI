"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import { analyzeResume } from "@/actions/resume-analysis"
import type { ResumeData, ResumeAnalysis } from "@/types/resume"
import debounce from "lodash/debounce"

interface RealtimeFeedbackProps {
  resumeData: ResumeData
  section: string
}

export default function RealtimeFeedback({ resumeData, section }: RealtimeFeedbackProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const updateAnalysis = useCallback(
    debounce(async (data: ResumeData) => {
      setLoading(true)
      try {
        const result = await analyzeResume(data)
        setAnalysis(result)
      } catch (error) {
        console.error("Error analyzing resume:", error)
      } finally {
        setLoading(false)
      }
    }, 1000),
    []
  )

  useEffect(() => {
    updateAnalysis(resumeData)
  }, [resumeData, updateAnalysis])

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Analyzing resume...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  const getSectionFeedback = () => {
    switch (section) {
      case "personal-info":
        return analysis.recommendations.filter(r => r.toLowerCase().includes("contact") || r.toLowerCase().includes("personal"))
      case "summary":
        return analysis.recommendations.filter(r => r.toLowerCase().includes("summary") || r.toLowerCase().includes("objective"))
      case "experience":
        return analysis.recommendations.filter(r => r.toLowerCase().includes("experience") || r.toLowerCase().includes("work"))
      case "education":
        return analysis.recommendations.filter(r => r.toLowerCase().includes("education") || r.toLowerCase().includes("academic"))
      case "skills":
        return analysis.recommendations.filter(r => r.toLowerCase().includes("skill") || r.toLowerCase().includes("technology"))
      case "projects":
        return analysis.recommendations.filter(r => r.toLowerCase().includes("project") || r.toLowerCase().includes("portfolio"))
      default:
        return []
    }
  }

  const sectionFeedback = getSectionFeedback()

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Section Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Section Score</span>
              <span className="text-sm font-medium">{analysis.score}%</span>
            </div>
            <Progress value={analysis.score} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Suggested Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {sectionFeedback.length > 0 && (
            <Alert variant={analysis.score >= 70 ? "default" : "destructive"}>
              {analysis.score >= 70 ? (
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