#!/usr/bin/env python3
"""
NVIDIA AI API Client for HireSenseAI
This script provides Python integration with NVIDIA AI Foundation Models API
for advanced resume analysis and job matching capabilities.
"""

import os
import json
import requests
from typing import List, Dict, Optional, Union
from dataclasses import dataclass
import base64


@dataclass
class ChatMessage:
    """Represents a chat message for the AI model"""
    role: str  # "user", "assistant", or "system"
    content: str


class NvidiaAIClient:
    """
    Python client for NVIDIA AI Foundation Models API
    Provides methods for resume enhancement, job matching, and content generation
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the NVIDIA AI client
        
        Args:
            api_key: NVIDIA API key. If not provided, will try to read from environment
        """
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY")
        self.invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        
        if not self.api_key:
            raise ValueError(
                "NVIDIA API key is required. Set NVIDIA_API_KEY environment variable or pass it directly.\n"
                "Get your API key from: https://developer.nvidia.com/"
            )
    
    def chat_completion(
        self, 
        messages: List[Union[ChatMessage, Dict]], 
        model: str = "meta/llama-guard-4-12b",
        max_tokens: int = 1000,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stream: bool = False
    ) -> Union[str, Dict]:
        """
        Send a chat completion request to NVIDIA AI API
        
        Args:
            messages: List of chat messages
            model: AI model to use
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0.0 to 1.0)
            top_p: Top-p sampling parameter
            stream: Whether to stream the response
            
        Returns:
            Response content as string or full response dict if streaming
        """
        # Convert messages to dict format if they're ChatMessage objects
        formatted_messages = []
        for msg in messages:
            if isinstance(msg, ChatMessage):
                formatted_messages.append({"role": msg.role, "content": msg.content})
            else:
                formatted_messages.append(msg)
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "text/event-stream" if stream else "application/json",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "messages": formatted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p,
            "stream": stream
        }
        
        try:
            response = requests.post(self.invoke_url, headers=headers, json=payload)
            response.raise_for_status()
            
            if stream:
                return self._handle_stream_response(response)
            else:
                result = response.json()
                return result.get("choices", [{}])[0].get("message", {}).get("content", "")
                
        except requests.exceptions.RequestException as e:
            print(f"Error calling NVIDIA API: {e}")
            raise
    
    def _handle_stream_response(self, response) -> str:
        """Handle streaming response from NVIDIA API"""
        content = ""
        for line in response.iter_lines():
            if line:
                line_str = line.decode("utf-8")
                if line_str.startswith("data: "):
                    try:
                        data = json.loads(line_str[6:])
                        if "choices" in data and data["choices"]:
                            delta = data["choices"][0].get("delta", {})
                            if "content" in delta:
                                content += delta["content"]
                    except json.JSONDecodeError:
                        continue
        return content
    
    def analyze_resume(self, resume_content: str) -> str:
        """
        Analyze a resume and provide improvement suggestions
        
        Args:
            resume_content: The resume content to analyze
            
        Returns:
            Analysis and suggestions as a string
        """
        messages = [
            ChatMessage(
                role="system",
                content="You are an expert resume analyst with deep knowledge of ATS optimization, industry best practices, and hiring trends. Provide detailed, actionable feedback."
            ),
            ChatMessage(
                role="user",
                content=f"""Analyze this resume and provide comprehensive feedback:

{resume_content}

Please provide:
1. Overall assessment and ATS compatibility score (1-10)
2. Strengths and weaknesses
3. Specific improvement suggestions
4. Keyword optimization recommendations
5. Formatting and structure feedback
6. Industry-specific advice if applicable

Format your response in a clear, structured manner."""
            )
        ]
        
        return self.chat_completion(messages, max_tokens=2000)
    
    def enhance_resume_content(self, resume_data: Dict, job_description: str = "") -> str:
        """
        Enhance resume content to better match job requirements
        
        Args:
            resume_data: Resume data as a dictionary
            job_description: Optional job description to tailor the resume
            
        Returns:
            Enhanced resume suggestions
        """
        job_context = f"\n\nJob Description to match:\n{job_description}" if job_description else ""
        
        messages = [
            ChatMessage(
                role="system",
                content="You are an expert resume writer that enhances resumes to match job requirements while maintaining authenticity and ATS optimization."
            ),
            ChatMessage(
                role="user",
                content=f"""Enhance this resume content:

{json.dumps(resume_data, indent=2)}
{job_context}

Please provide enhanced content that:
1. Maintains all truthful information
2. Improves language and impact
3. Adds relevant keywords naturally
4. Optimizes for ATS scanning
5. Highlights achievements with metrics
6. Ensures proper formatting and structure

Provide the enhanced content in a structured format."""
            )
        ]
        
        return self.chat_completion(messages, max_tokens=2000)
    
    def generate_cover_letter(self, resume_data: Dict, job_description: str, company_name: str) -> str:
        """
        Generate a personalized cover letter
        
        Args:
            resume_data: Resume data as a dictionary
            job_description: Job description to tailor the cover letter
            company_name: Name of the company
            
        Returns:
            Generated cover letter
        """
        messages = [
            ChatMessage(
                role="system",
                content="You are an expert cover letter writer who creates compelling, personalized cover letters that highlight relevant experience and show genuine interest in the role."
            ),
            ChatMessage(
                role="user",
                content=f"""Create a professional cover letter based on:

Resume Data:
{json.dumps(resume_data, indent=2)}

Job Description:
{job_description}

Company: {company_name}

The cover letter should:
1. Be 3-4 paragraphs long
2. Show genuine interest in the role and company
3. Highlight relevant experience and achievements
4. Use a professional but engaging tone
5. Include a strong opening and closing
6. Be ATS-friendly

Please generate a complete cover letter."""
            )
        ]
        
        return self.chat_completion(messages, max_tokens=1500)
    
    def extract_job_skills(self, job_description: str) -> List[str]:
        """
        Extract key skills and requirements from a job description
        
        Args:
            job_description: The job description text
            
        Returns:
            List of extracted skills
        """
        messages = [
            ChatMessage(
                role="system",
                content="You are an expert at analyzing job descriptions and extracting key skills, technologies, and requirements."
            ),
            ChatMessage(
                role="user",
                content=f"""Extract all skills, technologies, and requirements from this job description:

{job_description}

Please provide:
1. Technical skills (programming languages, tools, frameworks)
2. Soft skills
3. Required experience levels
4. Educational requirements
5. Industry-specific knowledge

Format the response as a JSON list of skills for easy parsing."""
            )
        ]
        
        response = self.chat_completion(messages, max_tokens=800)
        
        # Try to parse as JSON, fallback to simple text processing
        try:
            skills_data = json.loads(response)
            if isinstance(skills_data, list):
                return skills_data
        except:
            # Fallback: extract skills from text response
            skills = []
            for line in response.split('\n'):
                line = line.strip()
                if line and not line.startswith('{') and not line.startswith('}'):
                    # Remove common prefixes and clean up
                    line = line.replace('- ', '').replace('• ', '').replace('"', '').replace(',', '')
                    if line:
                        skills.append(line)
            return skills[:20]  # Limit to top 20 skills
        
        return []


def main():
    """
    Demo function showing how to use the NVIDIA AI client
    """
    # Initialize the client
    client = NvidiaAIClient()
    
    # Example 1: Basic chat completion (your original code)
    print("=== Basic Chat Completion ===")
    messages = [
        {"role": "user", "content": "I forgot how to kill a process in Linux, can you help?"},
        {"role": "assistant", "content": "Sure! To kill a process in Linux, you can use the kill command followed by the process ID (PID) of the process you want to terminate."}
    ]
    
    response = client.chat_completion(
        messages=messages,
        max_tokens=5,
        temperature=0.20,
        top_p=0.70
    )
    print(f"Response: {response}")
    
    # Example 2: Resume analysis
    print("\n=== Resume Analysis ===")
    sample_resume = """
    John Doe
    Software Engineer
    
    Experience:
    - Software Developer at TechCorp (2022-2024)
    - Built web applications using React and Node.js
    - Worked with databases and APIs
    
    Skills: JavaScript, Python, React, Node.js
    Education: BS Computer Science
    """
    
    analysis = client.analyze_resume(sample_resume)
    print(f"Resume Analysis:\n{analysis}")


if __name__ == "__main__":
    main()
