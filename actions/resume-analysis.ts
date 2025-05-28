"use server"

import { callGroqAPI, MODELS } from "@/lib/groq-client"
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

// Helper function to validate job description format
function validateJobDescription(description: any): description is GeneratedJobDescription {
  return (
    description &&
    typeof description.jobTitle === "string" &&
    typeof description.overview === "string" &&
    Array.isArray(description.responsibilities) &&
    Array.isArray(description.requirements) &&
    Array.isArray(description.qualifications) &&
    Array.isArray(description.benefits) &&
    typeof description.additionalInfo === "string"
  );
}

// Helper function to create a default job description
function createDefaultJobDescription(
  jobDetails: JobDetails,
  companyDetails: CompanyDetails
): GeneratedJobDescription {
  const overview = `Join ${companyDetails.companyName} as a ${jobDetails.title} in our ${jobDetails.department} department. We are seeking an experienced professional to contribute to our growing team in a ${jobDetails.workplaceType.toLowerCase()} environment.`;

  return {
    jobTitle: jobDetails.title,
    overview,
    responsibilities: [
      `Contribute to the development and growth of ${companyDetails.companyName}'s ${jobDetails.department} initiatives`,
      "Collaborate with cross-functional teams to achieve business objectives",
      "Apply industry best practices and maintain high quality standards",
      "Participate in planning and execution of key projects"
    ],
    requirements: [
      `${jobDetails.experienceLevel} experience in ${jobDetails.department}`,
      "Strong analytical and problem-solving skills",
      "Excellent communication and teamwork abilities",
      "Proven track record of delivering results"
    ],
    qualifications: [
      "Bachelor's degree in a related field",
      `${jobDetails.experienceLevel === 'Entry-Level' ? '0-2' : 
        jobDetails.experienceLevel === 'Mid-Level' ? '3-5' :
        jobDetails.experienceLevel === 'Senior' ? '5+' :
        jobDetails.experienceLevel === 'Lead' ? '7+' : '10+'} years of relevant experience`,
      "Professional certifications are a plus"
    ],
    benefits: [
      "Competitive salary and benefits package",
      `${jobDetails.workplaceType} work environment`,
      "Professional development opportunities",
      "Health insurance and retirement plans"
    ],
    additionalInfo: `${companyDetails.companyName} is ${companyDetails.companyDescription} We are an equal opportunity employer and value diversity at our company.`
  };
}

// Simple in-memory cache for job descriptions
const jobDescriptionCache = new Map<string, { description: GeneratedJobDescription; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function generateJobDescription(
  companyDetails: CompanyDetails,
  jobDetails: JobDetails
): Promise<GeneratedJobDescription> {
  try {
    // Create a cache key from the input parameters
    const cacheKey = JSON.stringify({ companyDetails, jobDetails });
    
    // Check cache first
    const cached = jobDescriptionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.description;
    }

    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is not configured, using default job description");
      return createDefaultJobDescription(jobDetails, companyDetails);
    }

    const industries = {
      technology: "software, hardware, and digital innovation",
      finance: "financial services and technology",
      healthcare: "healthcare and medical technology",
      education: "educational technology and services",
      retail: "retail and e-commerce solutions"
    };
    
    const industryContext = industries[companyDetails.industry.toLowerCase() as keyof typeof industries] || companyDetails.industry;

    const maxRetries = 2;
    let attempts = 0;
    let result;

    while (attempts < maxRetries) {
      try {
        const response = await callGroqAPI([
          {
            role: "system",
            content: "You are an expert HR professional who creates compelling job descriptions that are modern, engaging, and optimized for candidates in the technology industry."
          },
          {
            role: "user",
            content: `Create a compelling job description for ${jobDetails.title} position at ${companyDetails.companyName}, a company in the ${industryContext} space.

COMPANY INFORMATION:
Company: ${companyDetails.companyName}
Industry: ${companyDetails.industry || 'Technology'}
Location: ${companyDetails.location}
Company Size: ${companyDetails.companySize}
Company Description: ${companyDetails.companyDescription}

JOB DETAILS:
Title: ${jobDetails.title}
Department: ${jobDetails.department}
Employment Type: ${jobDetails.employmentType}
Experience Level: ${jobDetails.experienceLevel}
Workplace Type: ${jobDetails.workplaceType}

Create a compelling and detailed job description that will attract top talent. Include:
1. A powerful overview highlighting the impact and opportunity
2. 5-7 key responsibilities focused on outcomes
3. Required technical skills and qualifications
4. Essential educational requirements
5. Competitive benefits and perks
6. Company culture and growth opportunities

Return ONLY a valid JSON object with this structure:
{
  "jobTitle": string,
  "overview": string,
  "responsibilities": string[],
  "requirements": string[],
  "qualifications": string[],
  "benefits": string[],
  "additionalInfo": string
}`
          }
        ], MODELS.JOB_MATCHING);

        result = response.choices[0]?.message?.content;
        if (result && result.trim()) break;
      } catch (apiError) {
        attempts++;
        if (attempts === maxRetries) throw apiError;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
      }
    }

    if (!result) {
      console.error("Empty response from Groq API");
      return createDefaultJobDescription(jobDetails, companyDetails);
    }

    try {
      const parsed = JSON.parse(result);
      if (!validateJobDescription(parsed)) {
        console.error("Invalid job description format from API");
        return createDefaultJobDescription(jobDetails, companyDetails);
      }

      // Cache the successful result
      jobDescriptionCache.set(cacheKey, {
        description: parsed,
        timestamp: Date.now()
      });

      return parsed;
    } catch (parseError) {
      console.error("Error parsing Groq API response:", parseError);
      return createDefaultJobDescription(jobDetails, companyDetails);
    }
  } catch (error) {
    console.error("Error generating job description:", error);
    return createDefaultJobDescription(jobDetails, companyDetails);
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
    const response = await callGroqAPI([
      {
        role: "system",
        content: "You are an expert career coach who writes compelling cover letters. Always respond with plain text only, no markdown or formatting."
      },
      {
        role: "user",
        content: `Generate a professional cover letter based on the following information:

RESUME:
${request.resumeText}

JOB DESCRIPTION:
${request.jobDescription}

COMPANY: ${request.companyName}
POSITION: ${request.positionTitle}

Create a compelling cover letter that:
1. Highlights relevant experience and skills
2. Demonstrates enthusiasm for the position
3. Shows understanding of the company's needs
4. Maintains a professional tone
5. Is tailored to the specific job and company

Return the cover letter as plain text only, with no additional formatting.`
      }
    ], MODELS.COVER_LETTER);

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq API");
    }

    return result.trim()
      .replace(/^```\s*/, '') // Remove leading ```
      .replace(/```\s*$/, '') // Remove trailing ```
      .trim();
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return "Error generating cover letter. Please try again.";
  }
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  try {
    const response = await callGroqAPI([
      {
        role: "system",
        content: "You are an expert resume reviewer with years of experience in HR and recruitment. Always respond with valid JSON only."
      },
      {
        role: "user",
        content: `Analyze the following resume and provide feedback:

${resumeText}

Return ONLY a valid JSON object with this structure:
{
  "score": number between 0-100,
  "strengths": array of strings listing strengths,
  "improvements": array of strings listing areas for improvement,
  "keywords": array of strings listing important keywords for ATS,
  "recommendations": array of strings with specific recommendations
}`
      }
    ], MODELS.RESUME_ANALYSIS);

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq API");
    }

    const parsedResult = JSON.parse(result);
    return {
      score: parsedResult.score || 0,
      strengths: parsedResult.strengths || [],
      improvements: parsedResult.improvements || [],
      keywords: parsedResult.keywords || [],
      recommendations: parsedResult.recommendations || []
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      score: 0,
      strengths: [],
      improvements: [],
      keywords: [],
      recommendations: []
    };
  }
}