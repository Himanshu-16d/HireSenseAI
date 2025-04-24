"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface ATSResumePreviewProps {
  resumeData: ResumeData
  atsScore: number
  keywords: string[]
  feedback: {
    formatting: string[]
    keywords: string[]
    structure: string[]
    compatibility: number
  }
}

export default function ATSResumePreview({ resumeData, atsScore, keywords, feedback }: ATSResumePreviewProps) {
  const handleDownload = () => {
    // Create plain text version for ATS
    const content = generateATSFriendlyText(resumeData)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_ATS_Resume.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateATSFriendlyText = (data: ResumeData): string => {
    const sections = []

    // Personal Information
    sections.push(
      data.personalInfo.name.toUpperCase(),
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.linkedin,
      data.personalInfo.website,
      "\n"
    )

    // Professional Summary
    if (data.summary) {
      sections.push("PROFESSIONAL SUMMARY", data.summary, "\n")
    }

    // Experience
    sections.push("PROFESSIONAL EXPERIENCE")
    data.experience.forEach((exp) => {
      sections.push(
        `${exp.title}`,
        `${exp.company} | ${exp.location}`,
        `${exp.startDate} - ${exp.endDate}`,
        exp.description,
        ...exp.achievements.filter((a) => a),
        "\n"
      )
    })

    // Education
    sections.push("EDUCATION")
    data.education.forEach((edu) => {
      sections.push(
        `${edu.degree}`,
        `${edu.institution} | ${edu.location}`,
        `Graduated: ${edu.graduationDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
        ...edu.achievements.filter((a) => a),
        "\n"
      )
    })

    // Skills
    sections.push("TECHNICAL SKILLS", data.skills.filter((s) => s).join(", "), "\n")

    // Projects
    if (data.projects.some((p) => p.name)) {
      sections.push("PROJECTS")
      data.projects.forEach((project) => {
        if (project.name) {
          sections.push(
            project.name,
            project.description,
            `Technologies: ${project.technologies.filter((t) => t).join(", ")}`,
            project.link ? `Link: ${project.link}` : "",
            "\n"
          )
        }
      })
    }

    return sections.filter((s) => s).join("\n")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>ATS Compatibility Score</span>
            <Badge variant={atsScore >= 80 ? "default" : "destructive"}>{atsScore}%</Badge>
          </CardTitle>
          <CardDescription>
            Analysis of your resume&apos;s compatibility with Applicant Tracking Systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall ATS Compatibility</span>
              <span className="text-sm font-medium">{feedback.compatibility}%</span>
            </div>
            <Progress value={feedback.compatibility} className="h-2" />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Formatting Recommendations</h4>
              <ul className="list-disc pl-4 space-y-1">
                {feedback.formatting.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Keyword Optimization</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Structure Improvements</h4>
              <ul className="list-disc pl-4 space-y-1">
                {feedback.structure.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Alert variant={atsScore >= 80 ? "default" : "destructive"}>
            {atsScore >= 80 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>
              {atsScore >= 80
                ? "Your resume is well-optimized for ATS systems. Download the ATS-friendly version for applications."
                : "Your resume needs optimization for ATS systems. Follow the recommendations above to improve compatibility."}
            </AlertDescription>
          </Alert>

          <Button onClick={handleDownload} className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Download ATS-Friendly Version
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}