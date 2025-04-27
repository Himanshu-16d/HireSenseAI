console.log("DEBUG: GROQ_API_KEY =", process.env.GROQ_API_KEY);
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables")
}

// Model configuration
export const MODELS = {
  RESUME_ANALYSIS: "deepseek-r1-distill-llama-70b",
  JOB_MATCHING: "deepseek-r1-distill-llama-70b",
  COVER_LETTER: "deepseek-r1-distill-llama-70b",
  SKILL_ANALYSIS: "deepseek-r1-distill-llama-70b",
  REALTIME_MATCHING: "deepseek-r1-distill-llama-70b"
} as const

// Function to make Groq API calls
export async function callGroqAPI(messages: { role: string; content: string }[], model: string) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 2048,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Groq API error: ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    return response.json();
  } catch (error) {
    console.error("Groq API call failed:", error);
    throw error;
  }
}

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