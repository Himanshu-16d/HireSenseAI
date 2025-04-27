export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
}

export interface Education {
  degree: string
  institution: string
  location: string
  graduationDate: string
  gpa: string
  achievements: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
}

export interface JobTarget {
  title: string
  description: string
  company: string
  industry: string
}

export interface ResumeEnhancementResult {
  enhancedResume: ResumeData
  feedback: string
  score: number
}

export interface ResumeAnalysis {
  score: number
  strengths: string[]
  improvements: string[]
  keywords: string[]
  recommendations: string[]
}

export interface JobMatch {
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
  experienceAlignment: string
  suggestedModifications: string[]
}

export interface CoverLetter {
  coverLetter: string
  highlights: string[]
  keywords: string[]
}

export interface JobDescription {
  title: string
  company: string
  description: string
  requirements: string[]
  responsibilities: string[]
  qualifications: string[]
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  description: string
  url: string
  postedDate: string
  salary?: string
  skills: string[]
  matchScore: number
  source: "linkedin" | "indeed" | "other"
  commuteTime: number // in minutes
  distance: number // in miles
}

export interface JobSearchParams {
  title: string
  location: string
  keywords: string
  remote: boolean
  useResume: boolean
  locationType: "any" | "remote" | "hybrid" | "onsite"
}

export interface LinkedInProfile {
  id: string
  name: string
  headline: string
  profileUrl: string
  connections: number
}
