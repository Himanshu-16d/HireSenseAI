"use server"

import { callNvidiaAPI, MODELS, analyzeResumeRealtime } from "@/lib/groq-client"
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

export async function generateJobDescription(
  companyDetails: CompanyDetails,
  jobDetails: JobDetails
): Promise<GeneratedJobDescription> {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is not configured, using default job description");
      return createDefaultJobDescription(jobDetails, companyDetails);
    }

    const prompt = `You are writing a job description for ${jobDetails.title} position at ${companyDetails.companyName}.

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

Format the response as a valid JSON object with the following structure:
{
  "jobTitle": string,
  "overview": string,
  "responsibilities": string[],
  "requirements": string[],
  "qualifications": string[],
  "benefits": string[],
  "additionalInfo": string
}`

    const response = await callNvidiaAPI([
      {
        role: "system",
        content: "You are an expert HR professional who creates compelling job descriptions."
      },
      {
        role: "user",
        content: prompt
      }
    ], MODELS.JOB_MATCHING);

    const result = response.choices[0]?.message?.content;
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

    const response = await callNvidiaAPI([
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

    const response = await callNvidiaAPI([
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