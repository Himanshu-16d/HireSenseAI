"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, Printer, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ResumeData, JobTarget } from "@/types/resume"
import { useRef } from "react"
import ATSResumePreview from "@/components/ats-resume-preview"

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
}

export default function ResumePreview({ resumeData, feedback, score, jobTarget, atsFeedback }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = resumeRef.current
    if (!printContent) return

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
            h1, h2, h3 {
              color: #2563eb;
              margin-top: 0;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            h2 {
              font-size: 18px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin-top: 20px;
            }
            .contact-info {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .contact-item {
              margin-right: 15px;
            }
            .section {
              margin-bottom: 20px;
            }
            .experience-item, .education-item, .project-item {
              margin-bottom: 15px;
            }
            .title-line {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle-line {
              display: flex;
              justify-content: space-between;
              font-style: italic;
              margin-bottom: 5px;
            }
            ul {
              margin-top: 5px;
              padding-left: 20px;
            }
            .skills-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              list-style-type: none;
              padding: 0;
            }
            .skill-item {
              background-color: #f3f4f6;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
              }
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
    const resumeContent = resumeRef.current
    if (!resumeContent) return

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
            h1, h2, h3 {
              color: #2563eb;
              margin-top: 0;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            h2 {
              font-size: 18px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin-top: 20px;
            }
            .contact-info {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .contact-item {
              margin-right: 15px;
            }
            .section {
              margin-bottom: 20px;
            }
            .experience-item, .education-item, .project-item {
              margin-bottom: 15px;
            }
            .title-line {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle-line {
              display: flex;
              justify-content: space-between;
              font-style: italic;
              margin-bottom: 5px;
            }
            ul {
              margin-top: 5px;
              padding-left: 20px;
            }
            .skills-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              list-style-type: none;
              padding: 0;
            }
            .skill-item {
              background-color: #f3f4f6;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          ${resumeContent.innerHTML}
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card className="p-6 shadow-lg">
            <div ref={resumeRef} className="resume-content">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-primary">{resumeData.personalInfo.name}</h1>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mt-2">
                  {resumeData.personalInfo.email && (
                    <span className="contact-item">{resumeData.personalInfo.email}</span>
                  )}
                  {resumeData.personalInfo.phone && (
                    <span className="contact-item">{resumeData.personalInfo.phone}</span>
                  )}
                  {resumeData.personalInfo.location && (
                    <span className="contact-item">{resumeData.personalInfo.location}</span>
                  )}
                  {resumeData.personalInfo.linkedin && (
                    <span className="contact-item">{resumeData.personalInfo.linkedin}</span>
                  )}
                  {resumeData.personalInfo.website && (
                    <span className="contact-item">{resumeData.personalInfo.website}</span>
                  )}
                </div>
              </div>

              {resumeData.summary && (
                <div className="section">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">Professional Summary</h2>
                  <p>{resumeData.summary}</p>
                </div>
              )}

              {resumeData.experience.length > 0 && resumeData.experience[0].company && (
                <div className="section">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">Experience</h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="experience-item mb-4">
                      <div className="title-line">
                        <span>{exp.title}</span>
                        <span>
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <div className="subtitle-line">
                        <span>
                          {exp.company}
                          {exp.location ? `, ${exp.location}` : ""}
                        </span>
                      </div>
                      {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                      {exp.achievements.filter((a) => a).length > 0 && (
                        <ul className="text-sm mt-2">
                          {exp.achievements
                            .filter((a) => a)
                            .map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.education.length > 0 && resumeData.education[0].institution && (
                <div className="section">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">Education</h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="education-item mb-4">
                      <div className="title-line">
                        <span>{edu.degree}</span>
                        <span>{edu.graduationDate}</span>
                      </div>
                      <div className="subtitle-line">
                        <span>
                          {edu.institution}
                          {edu.location ? `, ${edu.location}` : ""}
                        </span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                      {edu.achievements.filter((a) => a).length > 0 && (
                        <ul className="text-sm mt-2">
                          {edu.achievements
                            .filter((a) => a)
                            .map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.filter((s) => s).length > 0 && (
                <div className="section">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">Skills</h2>
                  <ul className="skills-list">
                    {resumeData.skills
                      .filter((s) => s)
                      .map((skill, index) => (
                        <li key={index} className="skill-item">
                          {skill}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {resumeData.projects.length > 0 && resumeData.projects[0].name && (
                <div className="section">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">Projects</h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="project-item mb-4">
                      <div className="title-line">
                        <span>{project.name}</span>
                        {project.link && <span className="text-sm text-primary">{project.link}</span>}
                      </div>
                      {project.description && <p className="text-sm mt-1">{project.description}</p>}
                      {project.technologies.filter((t) => t).length > 0 && (
                        <div className="text-sm mt-2">
                          <span className="font-medium">Technologies: </span>
                          {project.technologies.filter((t) => t).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
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
        </div>
        <div className="w-full md:w-1/3 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Resume Score</h3>
                <div className="mt-4 mb-2">
                  <Progress value={score || 0} className="h-3" />
                </div>
                <p className="text-2xl font-bold">{score || 0}/100</p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Target Job</h4>
                <p className="text-sm">
                  {jobTarget.title} {jobTarget.company ? `at ${jobTarget.company}` : ""}
                </p>
                <p className="text-sm text-gray-500 mt-1">{jobTarget.industry}</p>
              </div>
            </CardContent>
          </Card>

          <Alert variant={score && score >= 70 ? "default" : "destructive"}>
            {score && score >= 70 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{score && score >= 70 ? "Good Match" : "Needs Improvement"}</AlertTitle>
            <AlertDescription className="mt-2 text-sm whitespace-pre-line">{feedback}</AlertDescription>
          </Alert>

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
