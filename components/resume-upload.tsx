"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Loader2 } from 'lucide-react'
import type { ResumeData as FullResumeData } from '@/types/resume'
import type { ResumeData as JobResumeData } from '@/types/job'

interface ResumeUploadProps {
  onUpload: (resumeData: JobResumeData) => void
}

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to parse resume')
      }

      const fullResumeData: FullResumeData = await response.json()
      
      // Convert full resume data to job resume data format
      const jobResumeData: JobResumeData = {
        skills: fullResumeData.skills,
        experience: fullResumeData.experience.map(exp => ({
          title: exp.title,
          company: exp.company,
          duration: `${exp.startDate} - ${exp.endDate}`,
          description: exp.description
        })),
        education: fullResumeData.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.graduationDate
        }))
      }

      onUpload(jobResumeData)
    } catch (error) {
      console.error('Error parsing resume:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Parsing resume...
        </div>
      )}
    </div>
  )
}
