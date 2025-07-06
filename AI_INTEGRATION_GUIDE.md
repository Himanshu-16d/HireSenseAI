# NVIDIA DeepSeek AI Integration Guide

This project is now integrated with NVIDIA's DeepSeek-R1-Distill-Llama-8B model using LangChain for advanced AI capabilities.

## Setup Instructions

1. **Get your NVIDIA API Key:**
   - Sign up at [NVIDIA AI Foundation Models](https://build.nvidia.com/)
   - Get access to the DeepSeek-R1-Distill-Llama-8B model
   - Copy your API key

2. **Add your NVIDIA API key to `.env`:**
```bash
NVIDIA_API_KEY=your-nvidia-api-key-here
AI_DEFAULT_MODEL=deepseek-ai/deepseek-r1-distill-llama-8b
```

3. **Install dependencies (already included):**
```bash
npm install langchain @langchain/core langchain-nvidia-ai-endpoints
```

## Model Configuration

The project uses the **DeepSeek-R1-Distill-Llama-8B** model with the following default settings:
- **Temperature**: 0.6 (controls creativity)
- **Top P**: 0.7 (nucleus sampling)
- **Max Tokens**: 4096 (maximum response length)

## Available Features

### 1. Resume Analysis
```typescript
import { analyzeResumeRealtime } from '@/lib/ai-client';

const analysis = await analyzeResumeRealtime(resumeData, jobDescription);
```

### 2. Job Description Generation
```typescript
import { generateJobDescription } from '@/actions/resume-analysis';

const jobDesc = await generateJobDescription(companyDetails, jobDetails);
```

### 3. Cover Letter Generation
```typescript
import { generateCoverLetter } from '@/actions/resume-analysis';

const coverLetter = await generateCoverLetter({
  resumeText: "...",
  jobDescription: "...",
  companyName: "Google",
  positionTitle: "Software Engineer"
});
```

## Testing the Integration

### Test via API endpoint:
```bash
# GET request to test basic functionality
curl http://localhost:3000/api/test-nvidia

# POST request with custom prompt
curl -X POST http://localhost:3000/api/test-nvidia \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a job description for a Python developer", "temperature": 0.7}'
```

### Test in the application:
1. Start the development server: `npm run dev`
2. Go to the resume builder
3. Try generating content or analyzing resumes
4. Check the job description generator

## Streaming Support

The integration also supports streaming responses for real-time output:

```typescript
const client = getAIClient();
const stream = await client.streamAPI(messages);

for await (const chunk of stream) {
  console.log(chunk); // Process streaming content
}
```

## Error Handling

The system includes robust error handling:
- Automatic fallback to default responses if AI fails
- Detailed error logging
- Graceful degradation for missing API keys

## Environment Variables

Required in your `.env` file:
```bash
# NVIDIA DeepSeek AI Configuration
NVIDIA_API_KEY=your-nvidia-api-key-here
AI_DEFAULT_MODEL=deepseek-ai/deepseek-r1-distill-llama-8b
```

## Advanced Usage

### Custom Temperature and Tokens
```typescript
const response = await client.callAPI(messages, undefined, {
  temperature: 0.8,  // More creative
  maxTokens: 2048,   // Shorter responses
  topP: 0.9          // Different sampling
});
```

### Multiple Models
You can switch between different NVIDIA models:
```typescript
const response = await client.callAPI(messages, "nvidia/llama-3.1-nemotron-70b-instruct");
```

## Troubleshooting

### Common Issues:

1. **API Key Issues**
   - Ensure your NVIDIA API key is valid
   - Check that you have access to the DeepSeek model
   - Verify the key is correctly set in your environment

2. **Rate Limiting**
   - NVIDIA APIs have rate limits
   - Implement retry logic if needed
   - Monitor your usage

3. **Model Availability**
   - DeepSeek-R1-Distill-Llama-8B should be available
   - Check NVIDIA's model catalog for alternatives

### Debug Mode:
Set `NODE_ENV=development` to see detailed logging.

## Model Capabilities

The DeepSeek-R1-Distill-Llama-8B model excels at:
- Code generation and analysis
- Technical writing
- Resume optimization
- Job description creation
- Problem-solving tasks

Perfect for HR and recruitment applications!
