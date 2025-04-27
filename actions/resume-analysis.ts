"use server"

import { callGroqAPI, MODELS, analyzeResumeRealtime } from "@/lib/groq-client"
import type { ResumeAnalysis } from "@/types/resume"

export interface CompanyDetails {
  companyName: string;
  industry: string;
  location: string;
  companySize: string;
  companyDescription: string;
}

export interface JobDetails {
  title: string;
  department: string;
  employmentType: string;
  experienceLevel: string;
  workplaceType: string;
}

export interface GeneratedJobDescription {
  jobTitle: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  additionalInfo: string;
}

export async function generateJobDescription(
  companyDetails: CompanyDetails,
  jobDetails: JobDetails
): Promise<GeneratedJobDescription> {
  try {
    const prompt = `
Generate a detailed job description for the following position:

COMPANY INFORMATION:
Company: ${companyDetails.companyName}
Industry: ${companyDetails.industry}
Location: ${companyDetails.location}
Company Size: ${companyDetails.companySize}
Company Description: ${companyDetails.companyDescription}

JOB DETAILS:
Title: ${jobDetails.title}
Department: ${jobDetails.department}
Employment Type: ${jobDetails.employmentType}
Experience Level: ${jobDetails.experienceLevel}
Workplace Type: ${jobDetails.workplaceType}

Please create a comprehensive job description that includes:
1. A compelling job overview
2. Key responsibilities
3. Required skills and qualifications
4. Educational requirements
5. Benefits and perks
6. Additional relevant information

Return the response in the following JSON format:
{
  "jobTitle": string,
  "overview": string,
  "responsibilities": string[],
  "requirements": string[],
  "qualifications": string[],
  "benefits": string[],
  "additionalInfo": string
}
`

    const response = await callGroqAPI([
      {
        role: "system",
        content: "You are an expert HR professional who creates compelling job descriptions."
      },
      {
        role: "user",
        content: prompt
      }
    ], MODELS.JOB_MATCHING)

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    try {
      return JSON.parse(result)
    } catch (parseError) {
      console.error("Error parsing Groq API response:", parseError)
      throw new Error("Invalid JSON response from Groq API")
    }
  } catch (error) {
    console.error("Error generating job description:", error)
    return {
      jobTitle: jobDetails.title,
      overview: "Error generating job description. Please try again.",
      responsibilities: [],
      requirements: [],
      qualifications: [],
      benefits: [],
      additionalInfo: ""
    }
  }
}

export interface CoverLetterRequest {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  positionTitle: string;
}

export async function generateCoverLetter(request: CoverLetterRequest): Promise<string> {
  try {
    const prompt = `
Generate a professional cover letter based on the following information:

RESUME:
${request.resumeText}

JOB DESCRIPTION:
${request.jobDescription}

COMPANY: ${request.companyName}
POSITION: ${request.positionTitle}

Please create a compelling cover letter that:
1. Highlights relevant experience and skills
2. Demonstrates enthusiasm for the position
3. Shows understanding of the company's needs
4. Maintains a professional tone
5. Is tailored to the specific job and company

Return the cover letter as plain text only, with no additional formatting or markdown.
`

    const response = await callGroqAPI([
      {
        role: "system",
        content: "You are an expert career coach who writes compelling cover letters. Always respond with plain text only, no markdown or formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ], MODELS.COVER_LETTER)

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    return result.trim()
      .replace(/^```\s*/, '') // Remove leading ```
      .replace(/```\s*$/, '') // Remove trailing ```
      .trim()
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return "Error generating cover letter. Please try again."
  }
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  try {
    // Get instant analysis
    const instantAnalysis = await analyzeResumeRealtime({ resumeText });
    
    // Get detailed analysis from Groq
    const prompt = `
Analyze the following resume and provide feedback in JSON format:

${resumeText}

Please provide a JSON response with the following structure:
{
  "score": number (0-100),
  "strengths": ["list", "of", "strengths"],
  "improvements": ["list", "of", "areas", "for", "improvement"],
  "keywords": ["list", "of", "important", "keywords", "for", "ATS"],
  "recommendations": ["list", "of", "specific", "recommendations"]
}
`

    const response = await callGroqAPI([
      {
        role: "system",
        content: "You are an expert resume reviewer with years of experience in HR and recruitment. Always respond with valid JSON only, no additional text or formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ], MODELS.RESUME_ANALYSIS)

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    // Clean and parse the response
    const cleanedResult = result.trim()
      .replace(/^```json\s*/, '')
      .replace(/```\s*$/, '')
      .trim()

    const parsedResult = JSON.parse(cleanedResult)
    
    // Combine instant and detailed analysis
    return {
      score: parsedResult.score || instantAnalysis.atsScore || 0,
      strengths: parsedResult.strengths || [],
      improvements: parsedResult.improvements || instantAnalysis.suggestions || [],
      keywords: parsedResult.keywords || instantAnalysis.keywords || [],
      recommendations: parsedResult.recommendations || []
    }
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return {
      score: 0,
      strengths: [],
      improvements: [],
      keywords: [],
      recommendations: []
    }
  }
}