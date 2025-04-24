"use server"

import { groqClient, MODELS, RESUME_ANALYSIS_PROMPT, JOB_MATCHING_PROMPT, COVER_LETTER_PROMPT } from "@/lib/groq-client"
import type { ResumeData, JobDescription, ResumeAnalysis, JobMatch, CoverLetter } from "@/types/resume"

// Test function to verify Groq API connection
export async function testGroqAPI(): Promise<{ success: boolean; message: string }> {
  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Please respond with 'API is working!' if you receive this message."
        }
      ],
      model: MODELS.RESUME_ANALYSIS,
      temperature: 0.7,
      max_tokens: 20,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    console.log("Groq API Response:", result)
    return { success: true, message: result }
  } catch (error) {
    console.error("Groq API Test Error:", error)
    return { success: false, message: error.toString() }
  }
}

export async function analyzeResume(resumeData: ResumeData): Promise<ResumeAnalysis> {
  try {
    const prompt = RESUME_ANALYSIS_PROMPT.replace("{resumeData}", JSON.stringify(resumeData, null, 2))

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer providing detailed, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODELS.RESUME_ANALYSIS,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    return JSON.parse(result)
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return {
      score: 0,
      strengths: ["Error analyzing resume"],
      improvements: ["Please try again later"],
      keywords: [],
      recommendations: [],
    }
  }
}

export async function matchJobDescription(
  resumeData: ResumeData,
  jobDescription: JobDescription
): Promise<JobMatch> {
  try {
    const prompt = JOB_MATCHING_PROMPT
      .replace("{resumeData}", JSON.stringify(resumeData, null, 2))
      .replace("{jobDescription}", JSON.stringify(jobDescription, null, 2))

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert job matcher providing detailed compatibility analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODELS.JOB_MATCHING,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    return JSON.parse(result)
  } catch (error) {
    console.error("Error matching job:", error)
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      experienceAlignment: "Error matching job description",
      suggestedModifications: [],
    }
  }
}

export async function generateCoverLetter(
  resumeData: ResumeData,
  jobDescription: JobDescription,
  companyInfo: string
): Promise<CoverLetter> {
  try {
    const prompt = COVER_LETTER_PROMPT
      .replace("{resumeData}", JSON.stringify(resumeData, null, 2))
      .replace("{jobDescription}", JSON.stringify(jobDescription, null, 2))
      .replace("{companyInfo}", companyInfo)

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer creating compelling, personalized letters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODELS.COVER_LETTER,
      temperature: 0.7,
      max_tokens: 1500,
    })

    const result = completion.choices[0]?.message?.content
    if (!result) {
      throw new Error("No response from Groq API")
    }

    return JSON.parse(result)
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return {
      coverLetter: "Error generating cover letter. Please try again later.",
      highlights: [],
      keywords: [],
    }
  }
}