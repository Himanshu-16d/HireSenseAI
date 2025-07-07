export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  url: string
  postedDate: string
  salary: string // Made mandatory to ensure salary always appears
  skills: string[]
  matchScore: number
  source: string
  commuteTime?: number
  distance?: number
}

export interface JobSearchParams {
  title?: string
  location?: string
  keywords?: string
}

export interface ResumeData {
  skills: string[]
  experience: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
}

export interface JobSearchResponse {
  jobs: Job[]
  total: number
  page: number
  limit: number
}