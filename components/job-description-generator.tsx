"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CompanyDetails, JobDetails, GeneratedJobDescription, generateJobDescription } from "@/actions/resume-analysis"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function JobDescriptionGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: "",
    industry: "",
    location: "",
    companySize: ""
  })

  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: "",
    department: "",
    employmentType: "Full-time",
    experienceLevel: "Mid-Level",
    workplaceType: "On-site"
  })

  const [generatedDescription, setGeneratedDescription] = useState<GeneratedJobDescription | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date())
  const [conciseFormat, setConciseFormat] = useState(false)
  const [conciseJobDescription, setConciseJobDescription] = useState<string | null>(null)

  const handleCompanyDetailsChange = (field: keyof CompanyDetails, value: string) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleJobDetailsChange = (field: keyof JobDetails, value: string) => {
    setJobDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleMonthSelect = (date: Date | undefined) => {
    setSelectedMonth(date)
  }

  const generateWithRetry = async (retries = 2) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await generateJobDescription(companyDetails, jobDetails);
        if (!result.overview || result.overview.includes("Failed to generate")) {
          throw new Error("Failed to generate job description");
        }
        return result;
      } catch (error) {
        if (i === retries - 1) throw error; // Last attempt failed
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGeneratedDescription(null);
    setConciseJobDescription(null);
    
    // Validate required fields
    const requiredFields = {
      companyName: "Company name",
      location: "Location",
      title: "Job title",
      department: "Department"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!companyDetails[field as keyof CompanyDetails] && field in companyDetails) {
        setError(`${label} is required`);
        return;
      }
      if (!jobDetails[field as keyof JobDetails] && field in jobDetails) {
        setError(`${label} is required`);
        return;
      }
    }
    
    setIsLoading(true);

    try {
      if (conciseFormat) {
        // Generate concise job description format
        const conciseDesc = `**${jobDetails.title}** @ ${companyDetails.companyName}  
Design and develop scalable solutions in ${companyDetails.industry || "the industry"}, collaborating with cross-functional teams to drive innovation in ${jobDetails.department}.  
Ideal candidates excel in problem-solving, possess strong technical skills, and thrive in ${jobDetails.workplaceType.toLowerCase()} environments at ${companyDetails.companyName}.`;
        
        setConciseJobDescription(conciseDesc);
      } else {
        // Generate detailed job description with retries
        const result = await generateWithRetry(2);
        setGeneratedDescription(result);
      }
    } catch (error: any) {
      console.error("Error generating job description:", error);
      setError(error.message || "Failed to generate job description. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Description Generator</CardTitle>
          <CardDescription>
            Fill in the company and job details to generate a comprehensive job description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyDetails.companyName}
                    onChange={(e) => handleCompanyDetailsChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={companyDetails.industry}
                    onChange={(e) => handleCompanyDetailsChange("industry", e.target.value)}
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={companyDetails.location}
                    onChange={(e) => handleCompanyDetailsChange("location", e.target.value)}
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    value={companyDetails.companySize}
                    onChange={(e) => handleCompanyDetailsChange("companySize", e.target.value)}
                    placeholder="e.g., 50-100 employees"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={jobDetails.title}
                    onChange={(e) => handleJobDetailsChange("title", e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={jobDetails.department}
                    onChange={(e) => handleJobDetailsChange("department", e.target.value)}
                    placeholder="e.g., Engineering, Marketing"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={jobDetails.employmentType}
                    onValueChange={(value) => handleJobDetailsChange("employmentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={jobDetails.experienceLevel}
                    onValueChange={(value) => handleJobDetailsChange("experienceLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                      <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workplaceType">Workplace Type</Label>
                  <Select
                    value={jobDetails.workplaceType}
                    onValueChange={(value) => handleJobDetailsChange("workplaceType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedMonth && "text-muted-foreground"
                        )}
                      >
                        {selectedMonth ? (
                          format(selectedMonth, "MMMM yyyy")
                        ) : (
                          <span>Pick a month</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <DayPicker
                        mode="single"
                        selected={selectedMonth}
                        onSelect={handleMonthSelect}
                        initialFocus
                        fromYear={2000}
                        toYear={new Date().getFullYear() + 1}
                        captionLayout="dropdown"
                        ISOWeek
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="conciseFormat"
                  checked={conciseFormat}
                  onChange={(e) => setConciseFormat(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="conciseFormat" className="text-sm font-medium">
                  Generate concise 3-line job description format
                </Label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 4V2" />
                    <path d="M15 16v-2" />
                    <path d="M8 9h2" />
                    <path d="M20 9h2" />
                    <path d="M17.8 11.8 19 13" />
                    <path d="M15 9h0" />
                    <path d="M17.8 6.2 19 5" />
                    <path d="m3 21 9-9" />
                    <path d="M12 12l9-9" />
                  </svg>
                  <span>Generate Job Description with AI</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {conciseJobDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Concise Job Description</CardTitle>
            <CardDescription>3-Line Format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md whitespace-pre-line">
              {conciseJobDescription}
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(conciseJobDescription);
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedDescription && !conciseJobDescription && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedDescription.jobTitle}</CardTitle>
            <CardDescription>Generated Job Description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Overview</h4>
              <p className="text-sm text-gray-600">{generatedDescription.overview}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Responsibilities</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {generatedDescription.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Requirements</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {generatedDescription.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Qualifications</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {generatedDescription.qualifications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Benefits & Perks</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {generatedDescription.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {generatedDescription.additionalInfo && (
              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                <p className="text-sm text-gray-600">{generatedDescription.additionalInfo}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}