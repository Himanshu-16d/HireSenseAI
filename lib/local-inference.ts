/**
 * Local inference module using WebLLM
 * This allows running LLM models directly in the browser without an API endpoint
 */

// Import WebLLM
import { ChatModule } from "@mlc-ai/web-llm";

interface Message {
  role: string;
  content: string;
}

interface InferenceResponse {
  choices: {
    message: {
      role: string;
      content: string;
    }
  }[];
}

class LocalInferenceService {
  private modelInstances: Record<string, any> = {};
  private isInitialized = false;
  
  constructor() {
    // Initialize will be called lazily when needed
  }
  
  private async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize WebLLM
      if (typeof window !== 'undefined') {  // Only run in browser environment
        const chat = new ChatModule();
        await chat.reload("llama3-70b");
        this.modelInstances["llama3-70b-8192"] = chat;
        
        console.log("Local inference service initialized with WebLLM");
      } else {
        console.log("Running in server environment, WebLLM not initialized");
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize local inference service:", error);
      throw error;
    }
  }
  
  async generateResponse(messages: Message[], model: string = "llama3-70b-8192"): Promise<InferenceResponse> {
    await this.initialize();
    
    // If running in browser and model is loaded
    if (typeof window !== 'undefined' && this.modelInstances[model]) {
      const chat = this.modelInstances[model];
      
      // Get only the content from the last user message
      const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
      
      try {
        // Generate response using WebLLM
        const response = await chat.generate(lastUserMessage);
        
        return {
          choices: [
            {
              message: {
                role: "assistant",
                content: response
              }
            }
          ]
        };
      } catch (error) {
        console.error("WebLLM generation failed:", error);
        // Fall back to mock response
      }
    }
    
    console.log(`Local inference with model ${model} (mock response)`);
    console.log("Input messages:", messages);
    
    // Mock response for demonstration or server-side rendering
    return {
      choices: [
        {
          message: {
            role: "assistant",
            content: `This is a local inference response using the ${model} model.
            
In a real implementation, I would process your prompt:
"${messages[messages.length - 1].content.substring(0, 100)}${messages[messages.length - 1].content.length > 100 ? '...' : ''}"

And generate a proper response using the local model.

To implement this fully:
1. Install WebLLM or another browser-based inference library
2. Download and properly configure the model files
3. Update this implementation to use the actual model`
          }
        }
      ]
    };
  }
}

// Export a singleton instance
export const localInference = new LocalInferenceService(); 