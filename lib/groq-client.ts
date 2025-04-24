import { groq } from "@ai-sdk/groq"

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables")
}

// Initialize Groq client with API key
export const groqClient = groq(process.env.GROQ_API_KEY)

// Model configuration
export const MODELS = {
  RESUME_ANALYSIS: "llama2-70b-4096",
  JOB_MATCHING: "llama2-70b-4096",
  COVER_LETTER: "llama2-70b-4096",
} as const

// Utility function for parallel processing
export async function processInParallel<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrent = 3
): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < tasks.length; i += maxConcurrent) {
    const batch = tasks.slice(i, i + maxConcurrent)
    const batchResults = await Promise.all(batch.map(task => task()))
    results.push(...batchResults)
  }
  return results
}

// Resume analysis prompt template
export const RESUME_ANALYSIS_PROMPT = `
Analyze the following resume for ATS (Applicant Tracking System) compatibility and provide detailed feedback:

RESUME:
{resumeData}

Please provide:
1. Overall ATS score (0-100)
2. ATS-friendly formatting suggestions
3. Keyword optimization recommendations
4. Section structure improvements
5. Industry-standard formatting tips

Focus on:
- Proper keyword usage and placement
- Clean, parseable formatting
- Standard section headings
- Bullet point optimization
- Proper date formatting
- Consistent styling

Return as JSON with the following structure:
{
  "score": number,
  "strengths": string[],
  "improvements": string[],
  "keywords": string[],
  "recommendations": string[],
  "atsSpecificFeedback": {
    "formatting": string[],
    "keywords": string[],
    "structure": string[],
    "compatibility": number
  }
}
`

// Job matching prompt template
export const JOB_MATCHING_PROMPT = `
Match the following resume with job requirements:

RESUME:
{resumeData}

JOB DESCRIPTION:
{jobDescription}

Analyze and provide:
1. Match score (0-100)
2. Key matching skills
3. Missing skills
4. Experience alignment
5. Suggested resume modifications

Return as JSON with the following structure:
{
  "matchScore": number,
  "matchingSkills": string[],
  "missingSkills": string[],
  "experienceAlignment": string,
  "suggestedModifications": string[]
}
`

// Cover letter generation prompt template
export const COVER_LETTER_PROMPT = `
Generate a personalized cover letter based on:

RESUME:
{resumeData}

JOB DESCRIPTION:
{jobDescription}

COMPANY:
{companyInfo}

Create a professional cover letter that:
1. Highlights relevant experience
2. Demonstrates cultural fit
3. Shows enthusiasm for the role
4. Addresses key job requirements

Return as JSON with the following structure:
{
  "coverLetter": string,
  "highlights": string[],
  "keywords": string[]
}
`