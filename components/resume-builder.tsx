"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeForm from "@/components/resume-form"
import ResumePreview from "@/components/resume-preview"
import JobTargeting from "@/components/job-targeting"
import CoverLetterGenerator from "@/components/cover-letter-generator"
import type { ResumeData, JobTarget, JobDescription } from "@/types/resume"
import { enhanceResume } from "@/actions/resume-actions"
import { Loader2, Layout, FileText, Palette } from "lucide-react"
import { LocationSearch } from "@/components/ui/location-search"
import { Label } from "@/components/ui/label"

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    icon: <Layout className="h-5 w-5 text-primary" />,
    description: "Clean, modern layout with bold headings."
  },
  {
    id: "classic",
    name: "Classic",
    icon: <FileText className="h-5 w-5 text-primary" />,
    description: "Traditional, ATS-friendly format."
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: <Palette className="h-5 w-5 text-primary" />,
    description: "Minimalist, elegant design."
  }
]

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experience: [
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        achievements: [""],
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        location: "",
        graduationDate: "",
        gpa: "",
        achievements: [""],
      },
    ],
    skills: [""],
    projects: [
      {
        name: "",
        description: "",
        technologies: [""],
        link: "",
      },
    ],
  })

  const [jobTarget, setJobTarget] = useState<JobTarget>({
    title: "",
    description: "",
    company: "",
    industry: "",
  })

  const [jobDescription, setJobDescription] = useState<JobDescription>({
    title: "",
    company: "",
    description: "",
    requirements: [],
    responsibilities: [],
    qualifications: [],
  })

  const [enhancedResume, setEnhancedResume] = useState<ResumeData | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [selectedTemplate, setSelectedTemplate] = useState("modern")

  const handleResumeChange = (newData: ResumeData) => {
    setResumeData(newData)
  }

  const handleJobTargetChange = (newTarget: JobTarget) => {
    setJobTarget(newTarget)
    setJobDescription({
      title: newTarget.title,
      company: newTarget.company,
      description: newTarget.description,
      requirements: [],
      responsibilities: [],
      qualifications: [],
    })
  }

  const handleEnhanceResume = async () => {
    setIsLoading(true)
    try {
      const result = await enhanceResume(resumeData, jobTarget)
      setEnhancedResume(result.enhancedResume)
      setFeedback(result.feedback)
      setScore(result.score)
      setActiveTab("preview")
    } catch (error) {
      console.error("Error enhancing resume:", error)
      setFeedback("We encountered an error while enhancing your resume. Please try again later.")
      setScore(0)
      setEnhancedResume(resumeData)
      setActiveTab("preview")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-muted rounded-xl shadow">
        <div className="font-semibold text-lg flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Choose Resume Template:
        </div>
        <div className="flex gap-4 flex-wrap">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all shadow-sm ${selectedTemplate === tpl.id ? "border-primary bg-primary/10" : "border-muted"}`}
              onClick={() => setSelectedTemplate(tpl.id)}
              type="button"
              title={tpl.description}
            >
              {tpl.icon}
              <span className="mt-1 font-medium text-sm">{tpl.name}</span>
            </button>
          ))}
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">Edit Resume</TabsTrigger>
          <TabsTrigger value="preview" disabled={!enhancedResume}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="cover-letter" disabled={!enhancedResume}>
            Cover Letter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <JobTargeting jobTarget={jobTarget} onChange={handleJobTargetChange} />
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <LocationSearch
              value={resumeData.personalInfo.location}
              onChange={(value) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, location: value } })}
              placeholder="Search for your location"
            />
          </div>
          <ResumeForm resumeData={resumeData} onChange={handleResumeChange} />
          <div className="flex justify-end">
            <Button onClick={handleEnhanceResume} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing Resume...
                </>
              ) : (
                "Enhance Resume with AI"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {enhancedResume && (
            <ResumePreview
              resumeData={enhancedResume || resumeData}
              feedback={feedback}
              score={score}
              jobTarget={jobTarget}
              atsFeedback={feedback ? undefined : undefined}
              template={selectedTemplate}
            />
          )}
        </TabsContent>

        <TabsContent value="cover-letter">
          {enhancedResume && <CoverLetterGenerator resumeData={enhancedResume} jobDescription={jobDescription} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
