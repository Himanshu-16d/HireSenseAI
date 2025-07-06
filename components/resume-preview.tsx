"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, Printer, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ResumeData, JobTarget } from "@/types/resume"
import ATSResumePreview from "@/components/ats-resume-preview"
import Template1Preview from "@/components/templates/Template1Preview"
import Template2Preview from "@/components/templates/Template2Preview"
import Template3Preview from "@/components/templates/Template3Preview"
import { useRef } from "react"

interface ResumePreviewProps {
  resumeData: ResumeData
  feedback: string
  score: number | null
  jobTarget: JobTarget
  atsFeedback?: {
    formatting: string[]
    keywords: string[]
    structure: string[]
    compatibility: number
  }
  template?: string
}

export default function ResumePreview({ resumeData, feedback, score, jobTarget, atsFeedback, template = "template1" }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (!resumeRef.current) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printDocument = printWindow.document
    printDocument.write(`
      <html>
        <head>
          <title>${resumeData.personalInfo.name} - Resume</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${resumeRef.current.innerHTML}
        </body>
      </html>
    `)

    printDocument.close()
    printWindow.print()
  }

  const handleDownload = () => {
    if (!resumeRef.current) return

    const html = `
      <html>
        <head>
          <title>${resumeData.personalInfo.name} - Resume</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${resumeRef.current.innerHTML}
        </body>
      </html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_Resume.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const TemplateComponent =
    template === "template2"
      ? Template2Preview
      : template === "template3"
      ? Template3Preview
      : Template1Preview

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card className="p-6">
            <div ref={resumeRef}>
              <TemplateComponent resumeData={resumeData} />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>
        </div>
        <div className="w-full md:w-1/3 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="mt-4">
                <h4 className="font-medium mb-2">Target Job</h4>
                <p className="text-sm">
                  {jobTarget.title} {jobTarget.company ? `at ${jobTarget.company}` : ""}
                </p>
                <p className="text-sm text-gray-500 mt-1">{jobTarget.industry}</p>
              </div>
            </CardContent>
          </Card>

          {atsFeedback && (
            <ATSResumePreview
              resumeData={resumeData}
              atsScore={score || 0}
              keywords={atsFeedback.keywords || []}
              feedback={atsFeedback}
            />
          )}
        </div>
      </div>
    </div>
  )
}
