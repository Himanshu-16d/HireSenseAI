// Example of how to integrate the Python NVIDIA AI API with your Next.js frontend
// This can be used in your existing components or as a new service

interface PythonAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class PythonAIService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5001') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred');
      }

      return result;
    } catch (error) {
      console.error('Python API Error:', error);
      throw error;
    }
  }

  // Original NVIDIA AI example
  async runOriginalExample(): Promise<string> {
    const response = await this.makeRequest<{response: string}>('/api/ai/original-example');
    return response.response;
  }

  // General chat completion (your original code structure)
  async chatCompletion(messages: Array<{role: string, content: string}>, options?: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
  }): Promise<string> {
    const response = await this.makeRequest<{content: string}>('/api/ai/chat', {
      messages,
      ...options
    });
    return response.content;
  }

  // Resume analysis
  async analyzeResume(resumeContent: string): Promise<string> {
    const response = await this.makeRequest<{analysis: string}>('/api/ai/analyze-resume', {
      resume_content: resumeContent
    });
    return response.analysis;
  }

  // Resume enhancement
  async enhanceResume(resumeData: any, jobDescription?: string): Promise<string> {
    const response = await this.makeRequest<{enhancement: string}>('/api/ai/enhance-resume', {
      resume_data: resumeData,
      job_description: jobDescription
    });
    return response.enhancement;
  }

  // Cover letter generation
  async generateCoverLetter(resumeData: any, jobDescription: string, companyName: string): Promise<string> {
    const response = await this.makeRequest<{cover_letter: string}>('/api/ai/generate-cover-letter', {
      resume_data: resumeData,
      job_description: jobDescription,
      company_name: companyName
    });
    return response.cover_letter;
  }

  // Job skills extraction
  async extractJobSkills(jobDescription: string): Promise<string[]> {
    const response = await this.makeRequest<{skills: string[]}>('/api/ai/extract-job-skills', {
      job_description: jobDescription
    });
    return response.skills;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export the service
export const pythonAIService = new PythonAIService();

// Example usage in a React component:
export const useNvidiaPythonAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async (resumeContent: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await pythonAIService.analyzeResume(resumeContent);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceResume = async (resumeData: any, jobDescription?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const enhancement = await pythonAIService.enhanceResume(resumeData, jobDescription);
      return enhancement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const runOriginalExample = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await pythonAIService.runOriginalExample();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeResume,
    enhanceResume,
    runOriginalExample,
    isLoading,
    error
  };
};

// Example component that uses the Python AI service:
/*
import { useNvidiaPythonAI } from './python-ai-integration';

export const ResumeAnalyzer = () => {
  const { analyzeResume, isLoading, error } = useNvidiaPythonAI();
  const [analysis, setAnalysis] = useState<string>('');

  const handleAnalyze = async () => {
    try {
      const result = await analyzeResume("Your resume content here...");
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
      {error && <div className="error">{error}</div>}
      {analysis && <div className="analysis">{analysis}</div>}
    </div>
  );
};
*/
