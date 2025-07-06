"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search, FileText, Upload, Clock, ExternalLink } from "lucide-react"
import { findJobs } from "@/actions/job-actions"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Job, JobSearchParams, ResumeData } from "@/types/job"
import JobListingCard from "@/components/job-listing-card"
import ResumeUpload from "@/components/resume-upload"
import { LocationSearch } from "@/components/ui/location-search"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

interface RecentSearch {
  skills: string[]
  location: string
  title: string
  timestamp: number
}

export default function JobFinder() {
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    title: "",
    location: "",
    keywords: ""
  })
  const [resumeData, setResumeData] = useState<ResumeData>({
    skills: [],
    experience: [
      {
        title: "",
        company: "",
        duration: "",
        description: ""
      }
    ],
    education: [
      {
        degree: "",
        institution: "",
        year: ""
      }
    ]
  })
  const [jobListings, setJobListings] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [resumeEntryMethod, setResumeEntryMethod] = useState<"upload" | "manual">("upload")
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [locationWarning, setLocationWarning] = useState<string | null>(null)
  const { toast } = useToast();

  const handleSearchParamChange = (key: keyof JobSearchParams, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data)
  }

  const handleManualResumeChange = (field: string, value: string) => {
    if (field === "skills") {
      setResumeData((prev) => ({
        ...prev,
        skills: value.split(",").map((skill) => skill.trim()),
      }))
    } else if (field.startsWith("experience")) {
      const [_, index, prop] = field.split(".")
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp, i) => 
          i === parseInt(index) ? { ...exp, [prop]: value } : exp
        ),
      }))
    } else if (field.startsWith("education")) {
      const [_, index, prop] = field.split(".")
      setResumeData((prev) => ({
        ...prev,
        education: prev.education.map((edu, i) => 
          i === parseInt(index) ? { ...edu, [prop]: value } : edu
        ),
      }))
    }
  }

  const handleSearch = async () => {
    console.log('Starting job search...');
    setIsLoading(true);
    setLocationWarning(null);
    
    try {
      console.log('Calling findJobs with params:', searchParams);
      const results = await findJobs(searchParams, resumeData);
      console.log('Received results:', results);
      
      if (Array.isArray(results)) {
        setJobListings(results);
        if (results.length > 0) {
          setActiveTab("results");
        }
      } else {
        console.error('Results is not an array:', results);
        setJobListings([]);
      }
    } catch (error) {
      console.error("Error finding jobs:", error);
      setJobListings([]);
      toast({
        title: "Error",
        description: "There was a problem finding jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('Search completed, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="results" disabled={jobListings.length === 0}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Search</CardTitle>
                  <CardDescription>Enter your job search criteria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input
                        id="job-title"
                        placeholder="Software Engineer, Product Manager, etc."
                        value={searchParams.title}
                        onChange={(e) => handleSearchParamChange("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <LocationSearch
                        value={searchParams.location}
                        onChange={(value) => handleSearchParamChange("location", value)}
                        placeholder="Search for a location"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Textarea
                      id="keywords"
                      placeholder="React, JavaScript, Product Management, etc."
                      value={searchParams.keywords}
                      onChange={(e) => handleSearchParamChange("keywords", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Find Jobs
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Upload or enter your resume information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={resumeEntryMethod}
                    onValueChange={(value) => setResumeEntryMethod(value as "upload" | "manual")}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="manual">
                        <FileText className="h-4 w-4 mr-2" />
                        Manual Entry
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload">
                      <ResumeUpload onUpload={handleResumeUpload} />
                    </TabsContent>

                    <TabsContent value="manual">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="skills">Key Skills (comma separated)</Label>
                          <Textarea
                            id="skills"
                            placeholder="JavaScript, React, Node.js, Project Management"
                            value={resumeData?.skills?.join(", ") || ""}
                            onChange={(e) => handleManualResumeChange("skills", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor="job-title">Current/Recent Job Title</Label>
                            <Input
                              id="job-title"
                              placeholder="Software Engineer"
                              value={resumeData?.experience?.[0]?.title || ""}
                              onChange={(e) => handleManualResumeChange("experience.0.title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              placeholder="Acme Inc."
                              value={resumeData?.experience?.[0]?.company || ""}
                              onChange={(e) => handleManualResumeChange("experience.0.company", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {locationWarning && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                  {locationWarning}
                </div>
              )}
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[450px] w-full rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : jobListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    We couldn't find any jobs matching your criteria.<br />
                    Try adjusting your search or check back later!
                  </p>
                  <img src="/empty-state.svg" alt="No jobs" className="w-40 h-40 opacity-70" />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Found {jobListings.length} jobs</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4 mr-1.5" />
                        Save All
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1.5" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {jobListings.map((job) => (
                      <div key={job.id}>
                        <JobListingCard job={job} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>Your recent job searches</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {recentSearches.map((search, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {search.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Location: {search.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Title: {search.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(search.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
