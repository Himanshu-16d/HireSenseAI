# Python NVIDIA AI Integration for HireSenseAI

This directory contains Python-based NVIDIA AI integration for the HireSenseAI project, providing powerful AI capabilities for resume analysis, job matching, and content generation.

## 🚀 Quick Start

### Option 1: Run the API Server (Recommended)

#### Windows:
```bash
./start-python-api.bat
```

#### Linux/Mac:
```bash
chmod +x start-python-api.sh
./start-python-api.sh
```

The API server will start on `http://localhost:5001`

### Option 2: Run Individual Scripts

#### Install Dependencies:
```bash
pip install -r scripts/requirements.txt
```

#### Run Examples:
```bash
cd scripts
python nvidia-examples.py
```

#### Use the Client Library:
```python
from nvidia_ai_client import NvidiaAIClient

client = NvidiaAIClient()
response = client.chat_completion([
    {"role": "user", "content": "Hello, how are you?"}
])
print(response)
```

## 📁 File Structure

```
scripts/
├── nvidia-ai-client.py      # Main Python client library
├── nvidia-examples.py       # Example scripts (including your original code)
├── api-server.py           # Flask API server for integration
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── quick-start.sh         # Quick start script (Linux/Mac)
├── quick-start.bat        # Quick start script (Windows)
start-python-api.sh         # Linux/Mac startup script
start-python-api.bat        # Windows startup script
lib/
└── python-ai-integration.ts # TypeScript integration helpers
```

## 🔧 Configuration

### Environment Variables

Set your NVIDIA API key:

#### Option 1: Environment Variables

#### Windows:
```cmd
set NVIDIA_API_KEY=your_nvidia_api_key_here
```

#### Linux/Mac:
```bash
export NVIDIA_API_KEY=your_nvidia_api_key_here
```

#### Option 2: .env File (Recommended)

1. Copy the example file:
   ```bash
   cp scripts/.env.example scripts/.env
   ```

2. Edit `scripts/.env` and add your API key:
   ```
   NVIDIA_API_KEY=your_nvidia_api_key_here
   ```

> **Note**: Replace `your_nvidia_api_key_here` with your actual NVIDIA API key. You can obtain one from the [NVIDIA Developer Portal](https://developer.nvidia.com/).

### API Server Configuration

- **Port**: Set `PYTHON_API_PORT` (default: 5001)
- **Environment**: Set `FLASK_ENV=development` for debug mode

## 📚 API Endpoints

When running the API server, the following endpoints are available:

### Health Check
```
GET /health
```

### General Chat Completion (Your Original Code)
```
POST /api/ai/chat
{
  "messages": [
    {"role": "user", "content": "I forgot how to kill a process in Linux, can you help?"}
  ],
  "model": "meta/llama-guard-4-12b",
  "max_tokens": 5,
  "temperature": 0.2,
  "top_p": 0.7
}
```

### Resume Analysis
```
POST /api/ai/analyze-resume
{
  "resume_content": "Your resume content here..."
}
```

### Resume Enhancement
```
POST /api/ai/enhance-resume
{
  "resume_data": {...},
  "job_description": "Optional job description"
}
```

### Cover Letter Generation
```
POST /api/ai/generate-cover-letter
{
  "resume_data": {...},
  "job_description": "Job description",
  "company_name": "Company Name"
}
```

### Job Skills Extraction
```
POST /api/ai/extract-job-skills
{
  "job_description": "Job description text"
}
```

### Original Example (Your Code)
```
POST /api/ai/original-example
```

## 🔗 Integration with Next.js

Use the TypeScript integration helpers in `lib/python-ai-integration.ts`:

```typescript
import { pythonAIService } from '@/lib/python-ai-integration';

// Run your original example
const result = await pythonAIService.runOriginalExample();

// Analyze a resume
const analysis = await pythonAIService.analyzeResume(resumeContent);

// Chat completion (your original code structure)
const response = await pythonAIService.chatCompletion([
  {"role": "user", "content": "I forgot how to kill a process in Linux, can you help?"}
], {
  model: "meta/llama-guard-4-12b",
  max_tokens: 5,
  temperature: 0.2,
  top_p: 0.7
});
```

## 🛠️ Development

### Adding New AI Functions

1. Add the function to `nvidia_ai_client.py`
2. Add the API endpoint to `api-server.py`
3. Add the TypeScript wrapper to `python-ai-integration.ts`

### Testing

```bash
# Test the original example
cd scripts
python -c "
from nvidia_ai_client import NvidiaAIClient
client = NvidiaAIClient()
print(client.chat_completion([
    {'role': 'user', 'content': 'Hello, world!'}
]))
"
```

### Production Deployment

For production, consider using Gunicorn:

```bash
cd scripts
gunicorn -w 4 -b 0.0.0.0:5001 api-server:app
```

## 🤖 Available AI Models

The integration supports various NVIDIA AI Foundation Models:

- `meta/llama-guard-4-12b` (default for safety checks)
- `meta/llama-3.1-8b-instruct` (recommended for general tasks)
- `meta/llama-3.1-70b-instruct` (for complex reasoning)
- `nvidia/nemotron-4-340b-instruct` (for advanced tasks)

## 📝 Example Use Cases

### Resume Analysis
```python
client = NvidiaAIClient()
analysis = client.analyze_resume(resume_content)
print(analysis)
```

### Job Matching
```python
skills = client.extract_job_skills(job_description)
enhancement = client.enhance_resume_content(resume_data, job_description)
```

### Cover Letter Generation
```python
cover_letter = client.generate_cover_letter(
    resume_data, 
    job_description, 
    "Google"
)
```

## 🔒 Security Notes

- **Never commit API keys to version control**
- Store API keys in environment variables or `.env` files
- Add `.env` to your `.gitignore` file
- Use HTTPS in production
- Implement rate limiting for the API server
- Validate all input data before sending to AI models

### .gitignore Configuration

Make sure your `.gitignore` includes:
```
# Environment variables
.env
scripts/.env

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
```

## 🐛 Troubleshooting

### Common Issues

1. **Import Error**: Make sure you're in the correct directory and dependencies are installed
2. **API Key Error**: Set the `NVIDIA_API_KEY` environment variable
3. **Connection Error**: Check your internet connection and API endpoint
4. **Port In Use**: Change the `PYTHON_API_PORT` environment variable

### Debug Mode

Run the API server with debug logging:
```bash
export FLASK_ENV=development
python scripts/api-server.py
```

## 📄 License

This Python integration follows the same license as the main HireSenseAI project.

## 🤝 Contributing

1. Add new AI functions to the client library
2. Create corresponding API endpoints
3. Add TypeScript integration helpers
4. Update this documentation
5. Test your changes with the example scripts

---

**Note**: Your original NVIDIA AI code is preserved in both `nvidia-examples.py` and the `/api/ai/original-example` endpoint, so you can run it exactly as you provided it.
