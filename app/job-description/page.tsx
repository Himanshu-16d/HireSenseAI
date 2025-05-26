"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProtectedRoute from "@/components/protected-route"
import ReactMarkdown from 'react-markdown'
import { Checkbox } from "@/components/ui/checkbox"
import * as React from "react"

export default function JobDescriptionPage() {
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [industry, setIndustry] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState<string | null>(null)
  const [conciseFormat, setConciseFormat] = useState(false)
  const [conciseJobDescription, setConciseJobDescription] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setJobDescription(null)
    setConciseJobDescription(null)
    
    if (!jobTitle) {
      setError("Job title is required")
      return
    }
    
    setIsLoading(true)
    
    try {
      if (conciseFormat) {
        // Generate concise job description format
        const conciseDesc = `**${jobTitle}** @ ${company || "Company"}  
Design and develop scalable solutions for ${industry || "the industry"}, collaborating with cross-functional teams to drive innovation in ${jobTitle.toLowerCase().includes('engineer') ? 'engineering' : jobTitle.toLowerCase().includes('design') ? 'design' : 'technology'}.  
Ideal candidates excel in problem-solving, possess strong technical skills, and thrive in fast-paced, mission-driven environments shaping global tech impact.`
        
        setConciseJobDescription(conciseDesc)
      } else {
        // Call API for detailed job description
        const response = await fetch('http://localhost:8003/v1/job-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobTitle,
            company: company || undefined,
            industry: industry || undefined,
          }),
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setJobDescription(data.description)
      }
    } catch (error: any) {
      console.error("Error generating job description:", error)
      setError(error.message || "Failed to generate job description. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 px-4">
        <Card className="max-w-5xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">AI Job Description Generator</CardTitle>
            <CardDescription>Create professional job descriptions powered by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry (optional)</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select Industry</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="conciseFormat" 
                  checked={conciseFormat} 
                  onCheckedChange={(checked) => setConciseFormat(!!checked)}
                />
                <Label htmlFor="conciseFormat" className="text-sm font-medium cursor-pointer">
                  Generate concise 3-line job description format
                </Label>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Job Description"
                )}
              </Button>
            </form>
            
            {conciseJobDescription && (
              <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Concise Job Description</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(conciseJobDescription)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none whitespace-pre-line">
                  <ReactMarkdown>{conciseJobDescription}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {jobDescription && !conciseJobDescription && (
              <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Generated Job Description</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(jobDescription)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{jobDescription}</ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  )
} 