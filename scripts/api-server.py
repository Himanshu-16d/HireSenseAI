#!/usr/bin/env python3
"""
Python API Server for NVIDIA AI Integration
This Flask server provides Python-based AI endpoints that can be called from your Next.js frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
# Import dependencies
import sys
import os
import requests
import json

# Try to load .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, skip
    pass

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Define the NVIDIA AI client inline for better compatibility
class NvidiaAIClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY")
        self.invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        if not self.api_key:
            raise ValueError(
                "NVIDIA API key is required. Set NVIDIA_API_KEY environment variable.\n"
                "Get your API key from: https://developer.nvidia.com/"
            )
    
    def chat_completion(self, messages, model="meta/llama-guard-4-12b", max_tokens=1000, temperature=0.7, top_p=0.9):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
            "stream": False
        }
        response = requests.post(self.invoke_url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        return result.get("choices", [{}])[0].get("message", {}).get("content", "")
    
    def analyze_resume(self, resume_content):
        messages = [
            {"role": "system", "content": "You are an expert resume analyst with deep knowledge of ATS optimization and hiring trends."},
            {"role": "user", "content": f"Analyze this resume and provide improvement suggestions: {resume_content}"}
        ]
        return self.chat_completion(messages, model="meta/llama-3.1-8b-instruct", max_tokens=1500)
    
    def enhance_resume_content(self, resume_data, job_description=""):
        job_context = f"\n\nJob Description: {job_description}" if job_description else ""
        messages = [
            {"role": "system", "content": "You are an expert resume writer that enhances resumes for job applications."},
            {"role": "user", "content": f"Enhance this resume: {json.dumps(resume_data)}{job_context}"}
        ]
        return self.chat_completion(messages, max_tokens=2000)
    
    def generate_cover_letter(self, resume_data, job_description, company_name):
        messages = [
            {"role": "system", "content": "You are an expert cover letter writer."},
            {"role": "user", "content": f"Write a professional cover letter for {company_name}. Resume: {json.dumps(resume_data)}. Job: {job_description}"}
        ]
        return self.chat_completion(messages, max_tokens=1500)
    
    def extract_job_skills(self, job_description):
        messages = [
            {"role": "system", "content": "Extract key skills from job descriptions. List them clearly."},
            {"role": "user", "content": f"List the key skills required in this job: {job_description[:500]}"}  # Truncate to avoid token limits
        ]
        response = self.chat_completion(messages, model="meta/llama-3.1-8b-instruct", max_tokens=300)
        # Simple parsing - in production you'd want more sophisticated parsing
        skills = []
        for line in response.split('\n'):
            line = line.strip().replace('- ', '').replace('• ', '').replace('"', '').replace(',', '')
            if line and len(line) < 50 and not line.startswith('*'):  # Filter out long sentences and headers
                skills.append(line)
        return skills[:8]  # Return up to 8 skills

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Initialize NVIDIA AI client
nvidia_client = NvidiaAIClient()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "nvidia-ai-python-api"})

@app.route('/api/ai/chat', methods=['POST'])
def chat_completion():
    """
    General chat completion endpoint
    Compatible with your original code structure
    """
    try:
        data = request.get_json()
        
        messages = data.get('messages', [])
        model = data.get('model', 'meta/llama-guard-4-12b')
        max_tokens = data.get('max_tokens', 1000)
        temperature = data.get('temperature', 0.7)
        top_p = data.get('top_p', 0.9)
        
        response = nvidia_client.chat_completion(
            messages=messages,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p
        )
        
        return jsonify({
            "success": True,
            "content": response
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/analyze-resume', methods=['POST'])
def analyze_resume():
    """
    Analyze a resume and provide feedback
    """
    try:
        data = request.get_json()
        resume_content = data.get('resume_content', '')
        
        if not resume_content:
            return jsonify({
                "success": False,
                "error": "Resume content is required"
            }), 400
        
        analysis = nvidia_client.analyze_resume(resume_content)
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/enhance-resume', methods=['POST'])
def enhance_resume():
    """
    Enhance resume content for better job matching
    """
    try:
        data = request.get_json()
        resume_data = data.get('resume_data', {})
        job_description = data.get('job_description', '')
        
        if not resume_data:
            return jsonify({
                "success": False,
                "error": "Resume data is required"
            }), 400
        
        enhancement = nvidia_client.enhance_resume_content(resume_data, job_description)
        
        return jsonify({
            "success": True,
            "enhancement": enhancement
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/generate-cover-letter', methods=['POST'])
def generate_cover_letter():
    """
    Generate a personalized cover letter
    """
    try:
        data = request.get_json()
        resume_data = data.get('resume_data', {})
        job_description = data.get('job_description', '')
        company_name = data.get('company_name', '')
        
        if not all([resume_data, job_description, company_name]):
            return jsonify({
                "success": False,
                "error": "Resume data, job description, and company name are required"
            }), 400
        
        cover_letter = nvidia_client.generate_cover_letter(resume_data, job_description, company_name)
        
        return jsonify({
            "success": True,
            "cover_letter": cover_letter
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/extract-job-skills', methods=['POST'])
def extract_job_skills():
    """
    Extract skills from a job description
    """
    try:
        data = request.get_json()
        job_description = data.get('job_description', '')
        
        if not job_description:
            return jsonify({
                "success": False,
                "error": "Job description is required"
            }), 400
        
        skills = nvidia_client.extract_job_skills(job_description)
        
        return jsonify({
            "success": True,
            "skills": skills
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/original-example', methods=['POST'])
def original_example():
    """
    Your original NVIDIA AI example as an API endpoint
    """
    try:
        # Your original payload
        messages = [
            {"role":"user","content":"I forgot how to kill a process in Linux, can you help?"},
            {"role":"assistant","content":"Sure! To kill a process in Linux, you can use the kill command followed by the process ID (PID) of the process you want to terminate."}
        ]
        
        response = nvidia_client.chat_completion(
            messages=messages,
            model="meta/llama-guard-4-12b",
            max_tokens=5,
            temperature=0.20,
            top_p=0.70
        )
        
        return jsonify({
            "success": True,
            "response": response,
            "original_example": True
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PYTHON_API_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"Starting NVIDIA AI Python API server on port {port}")
    print(f"Debug mode: {debug}")
    print("Available endpoints:")
    print("  GET  /health")
    print("  POST /api/ai/chat")
    print("  POST /api/ai/analyze-resume")
    print("  POST /api/ai/enhance-resume")
    print("  POST /api/ai/generate-cover-letter")
    print("  POST /api/ai/extract-job-skills")
    print("  POST /api/ai/original-example")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
