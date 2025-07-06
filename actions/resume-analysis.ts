"use server"

import { callGroqAPI, MODELS } from "@/lib/ai-client"
import type { ResumeAnalysis } from "@/types/resume"

export interface CompanyDetails {
  companyName: string;
  industry: string;
  location: string;
  companySize: string;
  companyDescription?: string;
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
    additionalInfo: `${companyDetails.companyName} is a leading company in the industry. We are an equal opportunity employer and value diversity at our company.`
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

    if (!process.env.NVIDIA_API_KEY) {
      console.warn("NVIDIA_API_KEY is not configured, using default job description");
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
            content: "You are an expert HR professional who creates compelling job descriptions. You MUST respond with ONLY valid JSON. Do not include any thinking tags, explanations, or additional text - just the JSON object."
          },
          {
            role: "user",
            content: `Create a compelling job description for ${jobDetails.title} position at ${companyDetails.companyName}, a company in the ${industryContext} space.

COMPANY INFORMATION:
Company: ${companyDetails.companyName}
Industry: ${companyDetails.industry || 'Technology'}
Location: ${companyDetails.location}
Company Size: ${companyDetails.companySize}${companyDetails.companyDescription ? `
Company Description: ${companyDetails.companyDescription}` : ''}

JOB DETAILS:
Title: ${jobDetails.title}
Department: ${jobDetails.department}
Employment Type: ${jobDetails.employmentType}
Experience Level: ${jobDetails.experienceLevel}
Workplace Type: ${jobDetails.workplaceType}

IMPORTANT: Respond with ONLY a valid JSON object. No explanations, no thinking tags, no additional text.

JSON format:
{
  "jobTitle": "${jobDetails.title}",
  "overview": "A compelling 2-3 sentence overview of the role and opportunity",
  "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3", "Responsibility 4", "Responsibility 5"],
  "requirements": ["Requirement 1", "Requirement 2", "Requirement 3", "Requirement 4"],
  "qualifications": ["Education requirement", "Experience requirement", "Skill requirement"],
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
  "additionalInfo": "Brief company culture info and equal opportunity statement"
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
      console.error("Empty response from AI API");
      return createDefaultJobDescription(jobDetails, companyDetails);
    }

    try {
      // Clean the response - remove any thinking tags, HTML, or non-JSON content
      let cleanedResult = result.trim();
      
      // Remove thinking tags if present
      cleanedResult = cleanedResult.replace(/<think>[\s\S]*?<\/think>/gi, '');
      
      // Extract JSON from the response if it's wrapped in other content
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResult = jsonMatch[0];
      }
      
      // Try to find JSON even if it's between code blocks
      const codeBlockMatch = cleanedResult.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
      if (codeBlockMatch) {
        cleanedResult = codeBlockMatch[1];
      }

      const parsed = JSON.parse(cleanedResult);
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
      console.error("Error parsing AI API response:", parseError);
      console.error("Raw response:", result?.substring(0, 500) + "...");
      
      // Try to create a fallback response from the text
      try {
        const fallbackDescription = createJobDescriptionFromText(result, jobDetails, companyDetails);
        if (fallbackDescription) {
          return fallbackDescription;
        }
      } catch (fallbackError) {
        console.error("Fallback parsing also failed:", fallbackError);
      }
      
      return createDefaultJobDescription(jobDetails, companyDetails);
    }
  } catch (error) {
    console.error("Error generating job description:", error);
    return createDefaultJobDescription(jobDetails, companyDetails);
  }
}

// Helper function to create job description from unstructured text
function createJobDescriptionFromText(
  text: string,
  jobDetails: JobDetails,
  companyDetails: CompanyDetails
): GeneratedJobDescription | null {
  try {
    // Clean the text
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/```[^`]*```/g, '').trim();
    
    // Extract sections using common patterns
    const sections = {
      overview: '',
      responsibilities: [] as string[],
      requirements: [] as string[],
      qualifications: [] as string[],
      benefits: [] as string[]
    };

    // Try to extract overview (first meaningful paragraph)
    const overviewMatch = cleanText.match(/(?:overview|description|about|summary)[:\-\s]*([^\.]*\.(?:[^\.]*\.)*)/i);
    sections.overview = overviewMatch ? overviewMatch[1].trim() : `Join ${companyDetails.companyName} as a ${jobDetails.title} and make an impact in our ${jobDetails.department} team.`;

    // Extract responsibilities
    const responsMatch = cleanText.match(/(?:responsibilities|duties|role)[:\-\s]*([^]*?)(?=(?:requirements|qualifications|benefits|skills|$))/i);
    if (responsMatch) {
      sections.responsibilities = responsMatch[1]
        .split(/[•\-\*\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 10)
        .slice(0, 7);
    }

    // Extract requirements
    const reqMatch = cleanText.match(/(?:requirements|qualifications|skills)[:\-\s]*([^]*?)(?=(?:benefits|compensation|$))/i);
    if (reqMatch) {
      sections.requirements = reqMatch[1]
        .split(/[•\-\*\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 5)
        .slice(0, 6);
    }

    // Add default values if sections are empty
    if (sections.responsibilities.length === 0) {
      sections.responsibilities = [
        `Lead ${jobDetails.department} initiatives and projects`,
        `Collaborate with cross-functional teams to achieve objectives`,
        `Drive innovation and continuous improvement`,
        `Mentor team members and contribute to knowledge sharing`
      ];
    }

    if (sections.requirements.length === 0) {
      sections.requirements = [
        `Bachelor's degree in relevant field`,
        `${jobDetails.experienceLevel === 'Entry Level' ? '1-2' : jobDetails.experienceLevel === 'Mid-Level' ? '3-5' : '5+'} years of experience`,
        `Strong communication and collaboration skills`,
        `Experience with modern tools and technologies`
      ];
    }

    return {
      jobTitle: jobDetails.title,
      overview: sections.overview,
      responsibilities: sections.responsibilities,
      requirements: sections.requirements,
      qualifications: sections.requirements.slice(0, 3), // Use subset of requirements
      benefits: [
        "Competitive salary and benefits package",
        "Health, dental, and vision insurance",
        "Flexible work arrangements",
        "Professional development opportunities",
        "Retirement savings plan"
      ],
      additionalInfo: `${companyDetails.companyName} is a leading company in the industry. We are an equal opportunity employer and value diversity at our company.`
    };
  } catch (error) {
    console.error("Error creating job description from text:", error);
    return null;
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
      throw new Error("No response from AI API (Cover Letter)");
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
      throw new Error("No response from AI API (Resume Analysis)");
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