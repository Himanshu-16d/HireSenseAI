const GROQ_API_URL = process.env.GROQ_API_URL || "https://api.groq.com/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "llama3-70b-8192";

// Default to environment variable, but can be overridden by request headers
let USE_LOCAL_INFERENCE = process.env.USE_LOCAL_INFERENCE === "true";

// Function to check request headers for inference preference
export function checkInferencePreference(headers?: Headers) {
  if (typeof window !== 'undefined') {
    // In browser environment, check cookies
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('useLocalInference='))
      ?.split('=')[1];
    
    if (cookieValue) {
      USE_LOCAL_INFERENCE = cookieValue === "true";
    }
  } else if (headers) {
    // In server environment, check request headers
    const headerValue = headers.get('x-use-local-inference');
    if (headerValue) {
      USE_LOCAL_INFERENCE = headerValue === "true";
    }
  }
  
  return USE_LOCAL_INFERENCE;
}

// Import local inference service
import { localInference } from "./local-inference";

// Debug logging for deployment troubleshooting
if (process.env.NODE_ENV === 'production') {
  console.log('Groq API Configuration:');
  console.log('API URL:', GROQ_API_URL);
  console.log('API Key exists:', !!GROQ_API_KEY);
  console.log('Model:', DEFAULT_MODEL);
  console.log('Using local inference (default):', USE_LOCAL_INFERENCE);
}

if (!GROQ_API_KEY && !USE_LOCAL_INFERENCE) {
  console.warn("GROQ_API_KEY is not defined in environment variables and local inference is disabled");
}

interface GroqError {
  message: string;
  type?: string;
  param?: string;
  code?: string;
}

// Function to run local inference
async function runLocalInference(messages: { role: string; content: string }[], model: string = DEFAULT_MODEL) {
  try {
    console.log("Running local inference with model:", model);
    return await localInference.generateResponse(messages, model);
  } catch (error) {
    console.error("Local inference failed:", error);
    throw error;
  }
}

export async function callGroqAPI(
  messages: { role: string; content: string }[], 
  model: string = DEFAULT_MODEL,
  headers?: Headers
) {
  // Check inference preference from headers
  const useLocal = checkInferencePreference(headers);
  
  // If local inference is enabled, use that instead of API call
  if (useLocal) {
    return runLocalInference(messages, model);
  }
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1,
        stream: false,
        model
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: GroqError | null = null;
      
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        // If not JSON, use text as is
      }

      // Log detailed error information in production
      if (process.env.NODE_ENV === 'production') {
        console.error('Groq API Error:', {
          status: response.status,
          url: GROQ_API_URL,
          errorText,
          errorJson,
          headers: Object.fromEntries(response.headers.entries())
        });
      }

      const errorMessage = errorJson?.message || errorText;
      const error = new Error(`Groq API call failed: ${response.status} - ${errorMessage}`);
      (error as any).status = response.status;
      (error as any).details = errorJson;
      throw error;
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message) {
      throw new Error("Invalid response format from Groq API");
    }

    return data;
  } catch (error) {
    console.error("Groq API call failed:", error);
    throw error;
  }
}

// Model configuration
export const MODELS = {
  RESUME_ANALYSIS: "llama3-70b-8192",
  JOB_MATCHING: "llama3-70b-8192",
  COVER_LETTER: "llama3-70b-8192",
  SKILL_ANALYSIS: "llama3-70b-8192",
  REALTIME_MATCHING: "llama3-70b-8192"
} as const

// Real-time analysis function
export async function analyzeResumeRealtime(resumeData: any, jobDescription?: string) {
  const prompt = `
Analyze this resume in real-time and provide instant feedback:

RESUME:
${JSON.stringify(resumeData)}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}

Provide:
1. Instant skill match analysis
2. Real-time improvement suggestions
3. ATS compatibility score
4. Keyword optimization recommendations

Return as JSON with the following structure:
{
  "skillMatch": number,
  "suggestions": string[],
  "atsScore": number,
  "keywords": string[],
  "instantFeedback": string
}
`

  const response = await callGroqAPI([
    {
      role: "system",
      content: "You are a real-time resume analysis expert providing instant feedback."
    },
    {
      role: "user",
      content: prompt
    }
  ], MODELS.REALTIME_MATCHING);

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

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