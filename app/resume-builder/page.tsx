"use client"

import ResumeBuilder from "@/components/resume-builder"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"
import { TemplateScanner } from "@/components/template-scanner"
import { useState } from "react"
import type { ResumeData } from "@/types/resume"

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData | undefined>();

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleEnhancedData = (enhancedData: ResumeData) => {
    setResumeData(enhancedData);
  };

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-6">
            <Card className="max-w-5xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Smart Resume Builder</CardTitle>
                <CardDescription>Create professional resumes with real-time AI feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeBuilder initialData={resumeData} onDataChange={handleResumeDataChange} />
              </CardContent>
            </Card>
          </div>

          {resumeData && (
            <TemplateScanner
              resumeData={resumeData}
              onEnhancedData={handleEnhancedData}
            />
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
