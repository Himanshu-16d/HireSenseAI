// NVIDIA DeepSeek AI client using direct API calls (updated)
export interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIClientOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

// NVIDIA DeepSeek AI client using direct API calls
export class AIClient {
  private apiKey: string;
  private defaultModel: string;
  private baseURL: string = "https://integrate.api.nvidia.com/v1";

  constructor(apiKey: string, model: string = "deepseek-ai/deepseek-r1-distill-llama-8b") {
    this.apiKey = apiKey;
    this.defaultModel = model;
  }

  async callAPI(
    messages: ChatCompletionMessage[],
    options: AIClientOptions = {}
  ): Promise<ChatCompletionResponse> {
    const requestBody = {
      model: this.defaultModel,
      messages: messages,
      temperature: options.temperature || 0.6,
      max_tokens: options.maxTokens || 4096,
      top_p: options.topP || 0.7,
      stream: false
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NVIDIA API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data as ChatCompletionResponse;
    } catch (error) {
      console.error('Error calling NVIDIA API:', error);
      throw error;
    }
  }

  async callAPIStreaming(
    messages: ChatCompletionMessage[],
    options: AIClientOptions = {}
  ): Promise<ReadableStream> {
    const requestBody = {
      model: this.defaultModel,
      messages: messages,
      temperature: options.temperature || 0.6,
      max_tokens: options.maxTokens || 4096,
      top_p: options.topP || 0.7,
      stream: true
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NVIDIA API error (${response.status}): ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body received from NVIDIA API');
      }

      return response.body;
    } catch (error) {
      console.error('Error calling NVIDIA API streaming:', error);
      throw error;
    }
  }
}

// Default model configurations
export const MODELS = {
  RESUME_ANALYSIS: "deepseek-ai/deepseek-r1-distill-llama-8b",
  JOB_MATCHING: "deepseek-ai/deepseek-r1-distill-llama-8b", 
  COVER_LETTER: "deepseek-ai/deepseek-r1-distill-llama-8b",
  CONTENT_GENERATION: "deepseek-ai/deepseek-r1-distill-llama-8b",
  DEFAULT: "deepseek-ai/deepseek-r1-distill-llama-8b"
} as const;

// Global AI client instance
let aiClientInstance: AIClient | null = null;

// Utility function to clean AI response text
export function cleanResponseText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove thinking tags and their content
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    // Remove markdown code block markers if they wrap the entire response
    .replace(/^```[\w]*\n?/, '')
    .replace(/\n?```$/, '')
    // Remove extra whitespace and normalize line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Get or create AI client instance
export function getAIClient(): AIClient {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY environment variable is not set');
  }

  if (!aiClientInstance) {
    const model = process.env.AI_DEFAULT_MODEL || MODELS.DEFAULT;
    aiClientInstance = new AIClient(process.env.NVIDIA_API_KEY, model);
  }

  return aiClientInstance;
}

// Convenience function for making API calls (legacy compatibility)
export async function callGroqAPI(
  messages: ChatCompletionMessage[],
  model?: string,
  options: AIClientOptions = {}
): Promise<ChatCompletionResponse> {
  const client = getAIClient();
  return client.callAPI(messages, { ...options, model: model || MODELS.DEFAULT });
}

// Test function to verify API connectivity
export async function testNVIDIAConnection(): Promise<{ success: boolean; error?: string; response?: any }> {
  try {
    const client = getAIClient();
    const testMessages: ChatCompletionMessage[] = [
      { role: 'user', content: 'Hello! Please respond with "NVIDIA API is working correctly."' }
    ];
    
    const response = await client.callAPI(testMessages);
    
    return {
      success: true,
      response: response.choices[0]?.message?.content || 'No response content'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Prompt templates for various tasks
export const RESUME_ANALYSIS_PROMPT = `Analyze the following resume data and provide detailed feedback on how to improve it for better job matching and ATS optimization:

{resumeData}

Please provide:
1. Overall assessment of the resume
2. Strengths and weaknesses
3. Specific suggestions for improvement
4. ATS optimization recommendations
5. Keyword suggestions for better job matching

Format your response as a structured analysis.`;

export const JOB_MATCHING_PROMPT = `Analyze how well this resume matches the given job target and provide a compatibility score:

Resume: {resumeData}
Job Target: {jobTarget}

Provide:
1. Compatibility score (0-100)
2. Detailed matching analysis
3. Skills alignment assessment
4. Experience relevance evaluation
5. Improvement recommendations

Return as JSON with score and detailed feedback.`;

export const COVER_LETTER_PROMPT = `Generate a professional cover letter based on the resume and job description:

Resume: {resumeData}
Job Description: {jobDescription}
Company: {company}
Position: {position}

Create a compelling cover letter that:
1. Highlights relevant experience
2. Shows enthusiasm for the role
3. Demonstrates company knowledge
4. Maintains professional tone
5. Is tailored to the specific position

Return the cover letter content only.`;

// Utility function for parallel processing of AI requests
export async function processInParallel<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number = 3
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const promise = task().then(result => {
      results[i] = result;
    });
    
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }
  
  await Promise.all(executing);
  return results;
}

// Real-time resume analysis function
export async function analyzeResumeRealtime(
  resumeData: any,
  jobDescription?: string
): Promise<any> {
  try {
    const client = getAIClient();
    
    const analysisPrompt = jobDescription
      ? `Analyze this resume against the job description and provide real-time feedback:
        
        Resume: ${JSON.stringify(resumeData)}
        Job Description: ${jobDescription}
        
        Provide immediate feedback on:
        1. Match percentage
        2. Missing skills
        3. Strengths to highlight
        4. Areas for improvement
        5. ATS optimization tips`
      : `Analyze this resume and provide real-time feedback:
        
        Resume: ${JSON.stringify(resumeData)}
        
        Provide immediate feedback on:
        1. Overall quality score
        2. Formatting recommendations
        3. Content improvements
        4. ATS compatibility
        5. Missing information`;

    const response = await client.callAPI([
      {
        role: 'system',
        content: 'You are an expert resume analyzer providing real-time feedback. Be concise but actionable.'
      },
      {
        role: 'user',
        content: analysisPrompt
      }
    ]);

    const content = response.choices[0]?.message?.content;
    return cleanResponseText(content || '');
  } catch (error) {
    console.error('Error in real-time resume analysis:', error);
    throw error;
  }
}