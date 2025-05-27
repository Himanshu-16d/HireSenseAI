const NVIDIA_API_URL = process.env.NVIDIA_API_URL || "https://api.nvcf.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const DEFAULT_MODEL = "deepseek/deepseek-r1";

// Debug logging for deployment troubleshooting
if (process.env.NODE_ENV === 'production') {
  console.log('NVIDIA API Configuration:');
  console.log('API URL:', NVIDIA_API_URL);
  console.log('API Key exists:', !!NVIDIA_API_KEY);
  console.log('Model:', DEFAULT_MODEL);
}

if (!NVIDIA_API_KEY) {
  console.warn("NVIDIA_API_KEY is not defined in environment variables");
}

interface NvidiaError {
  message: string;
  type?: string;
  param?: string;
  code?: string;
}

export async function callNvidiaAPI(messages: { role: string; content: string }[], model: string = DEFAULT_MODEL) {
  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1,
        stream: false,
        model
      })
    });    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: NvidiaError | null = null;
      
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        // If not JSON, use text as is
      }

      // Log detailed error information in production
      if (process.env.NODE_ENV === 'production') {
        console.error('NVIDIA API Error:', {
          status: response.status,
          url: NVIDIA_API_URL,
          errorText,
          errorJson,
          headers: Object.fromEntries(response.headers.entries())
        });
      }

      const errorMessage = errorJson?.message || errorText;
      const error = new Error(`NVIDIA API call failed: ${response.status} - ${errorMessage}`);
      (error as any).status = response.status;
      (error as any).details = errorJson;
      throw error;
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message) {
      throw new Error("Invalid response format from NVIDIA API");
    }

    return data;
  } catch (error) {
    console.error("NVIDIA API call failed:", error);
    throw error;
  }
}

// Model configuration
export const MODELS = {
  RESUME_ANALYSIS: "deepseek/deepseek-r1",
  JOB_MATCHING: "deepseek/deepseek-r1",
  COVER_LETTER: "deepseek/deepseek-r1",
  SKILL_ANALYSIS: "deepseek/deepseek-r1",
  REALTIME_MATCHING: "deepseek/deepseek-r1"
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

  const response = await callNvidiaAPI([
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