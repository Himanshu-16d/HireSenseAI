"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Download, Copy, CheckCircle } from "lucide-react"
import { generateCoverLetter } from "@/actions/resume-analysis"
import type { ResumeData, JobDescription, CoverLetter } from "@/types/resume"

interface CoverLetterGeneratorProps {
  resumeData: ResumeData
  jobDescription: JobDescription
}

export default function CoverLetterGenerator({ resumeData, jobDescription }: CoverLetterGeneratorProps) {
  const [companyInfo, setCompanyInfo] = useState("")
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await generateCoverLetter(resumeData, jobDescription, companyInfo)
      setCoverLetter(result)
    } catch (error) {
      console.error("Error generating cover letter:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!coverLetter?.coverLetter) return
    try {
      await navigator.clipboard.writeText(coverLetter.coverLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  const handleDownload = () => {
    if (!coverLetter?.coverLetter) return
    const blob = new Blob([coverLetter.coverLetter], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Cover_Letter_${resumeData.personalInfo.name.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Cover Letter</CardTitle>
          <CardDescription>
            Our AI will create a personalized cover letter based on your resume and the job description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Research</label>
            <Textarea
              placeholder="Enter additional information about the company (culture, values, recent news, etc.)"
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleGenerate} disabled={loading || !companyInfo}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Cover Letter"
            )}
          </Button>

          {coverLetter && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Cover Letter</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">{coverLetter.coverLetter}</div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Highlights</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {coverLetter.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Keywords Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {coverLetter.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Remember to review and personalize this cover letter before sending. While AI-generated content is a great
                  starting point, adding your personal touch will make it more authentic.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}