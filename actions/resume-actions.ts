"use server"

import type { ResumeData, JobTarget, ResumeEnhancementResult } from "@/types/resume"
import {
  MODELS,
  RESUME_ANALYSIS_PROMPT,
  JOB_MATCHING_PROMPT,
  COVER_LETTER_PROMPT,
  callGroqAPI,
  processInParallel
} from "@/lib/groq-client"

export async function enhanceResume(resumeData: ResumeData, jobTarget: JobTarget, template: string = "template1"): Promise<ResumeEnhancementResult> {
  try {
    const resumeString = JSON.stringify(resumeData, null, 2)
    const jobTargetString = JSON.stringify(jobTarget, null, 2)

    // Get headers from request context
    const { headers } = (process as any).experimental?.invokeHeaders() || { headers: undefined }

    const response = await callGroqAPI([
      {
        role: "system",
        content: "You are an expert resume enhancer who tailors resumes to specific job targets."
      },
      {
        role: "user",
        content: `
          Enhance this resume to better match the target job:

          RESUME:
          ${resumeString}

          TARGET JOB:
          ${jobTargetString}

          TEMPLATE: ${template}

          Please provide:
          1. The enhanced resume JSON
          2. Brief feedback on the changes made
          3. A match score from 0-100

          Return as JSON with the following structure:
          {
            "enhancedResume": {...},
            "feedback": "string with feedback",
            "score": number
          }
        `
      }
    ], MODELS.RESUME_ANALYSIS, headers)

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      throw new Error("Invalid response from AI")
    }

    // Parse the JSON response
    const result = JSON.parse(content)
    
    return {
      enhancedResume: result.enhancedResume,
      feedback: result.feedback,
      score: result.score
    }
  } catch (error) {
    console.error("Error enhancing resume:", error)
    throw error
  }
}

export async function scoreResume(
  resumeData: ResumeData,
  jobTarget: JobTarget,
): Promise<{ score: number; feedback: string }> {
  try {
    // Convert resume data to a string format for the AI
    const resumeString = JSON.stringify(resumeData, null, 2)
    const jobTargetString = JSON.stringify(jobTarget, null, 2)
    
    // Get headers from request context
    const { headers } = (process as any).experimental?.invokeHeaders() || { headers: undefined }
    
    // Generate score and feedback using Groq AI
    const response = await callGroqAPI([
      { 
        role: "system", 
        content: "You are an expert resume reviewer and ATS specialist who provides accurate scoring and actionable feedback. You ALWAYS respond with valid JSON only."
      },
      {
        role: "user",
        content: `
        You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. Your task is to score the following resume for the specified job target and provide detailed feedback.
        
        RESUME:
        ${resumeString}
        
        JOB TARGET:
        ${jobTargetString}
        
        Analyze this resume and provide:
        1. A compatibility score from 0-100 based on how well the resume matches the job target
        2. Detailed feedback on how to improve the resume for this specific job
        
        Focus on:
        - Skills matching
        - Experience relevance
        - Keyword optimization
        - ATS compatibility
        - Overall presentation
        
        Return your analysis as JSON with the following structure:
        {
          "score": number,
          "feedback": "string with detailed feedback"
        }
        `
      }
    ], MODELS.JOB_MATCHING, headers)
    
    // Extract the AI response content
    const content = response.choices[0]?.message?.content
    
    if (!content) {
      throw new Error("Invalid response from AI")
    }
    
    // Parse the JSON response
    const result = JSON.parse(content)
    
    return {
      score: result.score,
      feedback: result.feedback
    }
  } catch (error) {
    console.error("Error scoring resume:", error)
    throw error
  }
}

// Update the parseResume function to handle token limits
export async function parseResume(resumeText: string): Promise<ResumeData> {
  try {
    // Truncate the resume text to avoid token limit errors
    const truncatedText = truncateResumeText(resumeText, 4000)
    console.log(`Original resume length: ${resumeText.length}, Truncated length: ${truncatedText.length}`)

    // Generate parsed resume using Groq AI
    const response = await callGroqAPI([
      { 
        role: "system", 
        content: "You are a resume parser that extracts key information from resumes. Be concise and focus on the most important details." 
      },
      {
        role: "user",
        content: `Extract structured information from this resume text and format it as JSON.\n\nRESUME TEXT:\n${truncatedText}`
      }
    ], MODELS.RESUME_ANALYSIS)
    
    const text = response.choices[0].message.content

    // Try to parse the response as JSON
    try {
      return JSON.parse(text) as ResumeData
    } catch (parseError) {
      console.error("Failed to parse initial response:", parseError)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as ResumeData
        } catch (extractError) {
          console.error("Failed to extract JSON from response:", extractError)
        }
      }
      return extractBasicResumeInfo(resumeText)
    }
  } catch (error: any) {
    console.error("Error parsing resume:", error instanceof Error ? error.message : error)
    if (error.toString().includes("token") || error.toString().includes("too large")) {
      console.log("Token limit exceeded, falling back to basic extraction")
      return extractBasicResumeInfo(resumeText)
    }
    return getDefaultResumeData()
  }
}

// Helper function to truncate resume text intelligently
function truncateResumeText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  // Split the text into sections to prioritize important parts
  const sections = text.split(/\n\s*\n/)
  let result = ""

  // Always include the first section (usually contact info)
  if (sections.length > 0) {
    result += sections[0] + "\n\n"
  }

  // Try to include experience and education sections
  const experienceSectionIndex = findSectionIndex(sections, ["experience", "work", "employment"])
  const educationSectionIndex = findSectionIndex(sections, ["education", "academic", "university"])
  const skillsSectionIndex = findSectionIndex(sections, ["skills", "technologies", "competencies"])

  // Add experience section (most important)
  if (experienceSectionIndex >= 0) {
    result += sections[experienceSectionIndex] + "\n\n"
  }

  // Add education section
  if (educationSectionIndex >= 0 && result.length + sections[educationSectionIndex].length < maxLength) {
    result += sections[educationSectionIndex] + "\n\n"
  }

  // Add skills section
  if (skillsSectionIndex >= 0 && result.length + sections[skillsSectionIndex].length < maxLength) {
    result += sections[skillsSectionIndex] + "\n\n"
  }

  // If we still have room, add other sections
  for (let i = 0; i < sections.length; i++) {
    if (i !== 0 && i !== experienceSectionIndex && i !== educationSectionIndex && i !== skillsSectionIndex) {
      if (result.length + sections[i].length < maxLength) {
        result += sections[i] + "\n\n"
      }
    }
  }

  // Final truncation if still too long
  if (result.length > maxLength) {
    result = result.substring(0, maxLength)
  }

  return result
}

// Helper function to find section indices
function findSectionIndex(sections: string[], keywords: string[]): number {
  for (let i = 0; i < sections.length; i++) {
    const sectionLower = sections[i].toLowerCase()
    if (keywords.some((keyword) => sectionLower.includes(keyword))) {
      return i
    }
  }
  return -1
}

// Function to extract basic resume information without using AI
function extractBasicResumeInfo(resumeText: string): ResumeData {
  const lines = resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  const result = getDefaultResumeData()

  // Try to extract name (usually one of the first lines)
  if (lines.length > 0) {
    // Assume the first line that's not an email or phone is the name
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (!lines[i].includes("@") && !lines[i].match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
        result.personalInfo.name = lines[i]
        break
      }
    }
  }

  // Try to extract email
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) {
    result.personalInfo.email = emailMatch[0]
  }

  // Try to extract phone
  const phoneMatch = resumeText.match(/(\+\d{1,3}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/)
  if (phoneMatch) {
    result.personalInfo.phone = phoneMatch[0]
  }

  // Try to extract LinkedIn
  const linkedinMatch = resumeText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/)
  if (linkedinMatch) {
    result.personalInfo.linkedin = linkedinMatch[0]
  }

  // Extract skills (look for common skill keywords)
  const skillKeywords = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "HTML",
    "CSS",
    "SQL",
    "NoSQL",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Git",
    "Agile",
    "Scrum",
    "Project Management",
    "Leadership",
    "Communication",
  ]

  const skills = skillKeywords.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()))

  if (skills.length > 0) {
    result.skills = skills
  }

  return result
}

// Helper function to get default resume data
function getDefaultResumeData(): ResumeData {
  return {
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
  }
}
