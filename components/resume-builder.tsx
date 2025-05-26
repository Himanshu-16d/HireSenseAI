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

const TEMPLATES = [  {
    id: "template1",
    name: "Template 1",
    icon: <Layout className="h-5 w-5 text-primary" />,
    description: "Clean, modern layout with bold headings.",
    image: "/templates/template1.png"
  },
  {
    id: "template2",
    name: "Template 2",
    icon: <FileText className="h-5 w-5 text-primary" />,
    description: "Traditional, ATS-friendly format.",
    image: "/templates/template2.png"
  },
  {
    id: "template3",
    name: "Template 3",
    icon: <Palette className="h-5 w-5 text-primary" />,
    description: "Minimalist, elegant design.",
    image: "/templates/template3.png"
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
  const [selectedTemplate, setSelectedTemplate] = useState("template1")

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
        </div>        <div className="flex gap-8 flex-wrap justify-center">          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}              className={`group relative flex flex-col items-center rounded-lg border-2 transition-all w-[150px] ${
                selectedTemplate === tpl.id 
                  ? "border-primary bg-primary/5 shadow-[0_0_25px_rgba(139,92,246,0.4)] dark:shadow-[0_0_25px_rgba(139,92,246,0.3)] scale-105" 
                  : "border-muted hover:border-primary/50"
              }`}
              onClick={() => setSelectedTemplate(tpl.id)}
              type="button"
            >              <div className="relative w-full aspect-[3/4] overflow-visible rounded-t-lg">
                <img
                  src={tpl.image}
                  alt={`${tpl.name} template preview`}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-primary/10 transition-opacity ${
                  selectedTemplate === tpl.id ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                }`} />
                {/* Hover Preview */}
                <div className="fixed opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                     style={{
                       left: 'calc(100% + 16px)',
                       top: '50%',
                       transform: 'translateY(-50%)',
                     }}>
                  <div className="bg-background border-2 border-border rounded-lg p-2 shadow-xl">
                    <img
                      src={tpl.image}
                      alt={`${tpl.name} template large preview`}
                      className="w-[400px] aspect-[3/4] object-cover rounded"
                    />
                  </div>
                </div>
              </div><div className="p-1.5 text-center w-full border-t border-border bg-background">
                <div className="flex items-center justify-center gap-1">
                  {tpl.icon}
                  <span className="font-medium text-xs">{tpl.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tpl.description}</p>
              </div>
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
