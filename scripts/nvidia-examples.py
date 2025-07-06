
#!/usr/bin/env python3
"""
Simple example script using your original NVIDIA AI code
This demonstrates the exact code you provided working in the project structure
"""

import requests
import base64
import os

# Try to load .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, skip
    pass

def run_original_nvidia_example():
    """
    Your original NVIDIA AI API code
    """
    invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    stream = False

    # Use environment variable for API key - set NVIDIA_API_KEY in your environment
    api_key = os.getenv("NVIDIA_API_KEY")
    
    if not api_key:
        print("Error: NVIDIA_API_KEY environment variable is not set.")
        print("Please set your API key by running:")
        print("  Windows: set NVIDIA_API_KEY=your_api_key_here")
        print("  Linux/Mac: export NVIDIA_API_KEY=your_api_key_here")
        return None

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "text/event-stream" if stream else "application/json"
    }

    payload = {
        "model": "meta/llama-guard-4-12b",
        "messages": [
            {"role":"user","content":"I forgot how to kill a process in Linux, can you help?"},
            {"role":"assistant","content":"Sure! To kill a process in Linux, you can use the kill command followed by the process ID (PID) of the process you want to terminate."}
        ],
        "max_tokens": 5,
        "temperature": 0.20,
        "top_p": 0.70,
        "stream": stream
    }

    try:
        response = requests.post(invoke_url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        if stream:
            for line in response.iter_lines():
                if line:
                    print(line.decode("utf-8"))
        else:
            result = response.json()
            print("NVIDIA AI Response:")
            print(result)
            
            # Extract and print just the content
            if "choices" in result and result["choices"]:
                content = result["choices"][0].get("message", {}).get("content", "")
                print(f"\nExtracted Content: {content}")
                
    except requests.exceptions.RequestException as e:
        print(f"Error calling NVIDIA API: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def run_resume_analysis_example():
    """
    Example of using NVIDIA AI for resume analysis (relevant to your HireSenseAI project)
    """
    invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    api_key = os.getenv("NVIDIA_API_KEY")
    
    if not api_key:
        print("Error: NVIDIA_API_KEY environment variable is not set.")
        print("Please set your API key before running resume analysis.")
        return
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    }
    
    # Example resume content
    resume_content = """
    John Smith
    Software Engineer
    
    Experience:
    • Software Developer at ABC Corp (2022-2024)
    • Developed web applications using React.js and Node.js
    • Collaborated with cross-functional teams
    • Improved system performance by 30%
    
    Skills: JavaScript, Python, React, Node.js, SQL
    Education: Bachelor's in Computer Science
    """
    
    payload = {
        "model": "meta/llama-3.1-8b-instruct",  # Better model for longer content
        "messages": [
            {
                "role": "system",
                "content": "You are an expert resume analyst. Provide constructive feedback on resumes for job applications."
            },
            {
                "role": "user",
                "content": f"Please analyze this resume and provide suggestions for improvement:\n\n{resume_content}"
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.7,
        "top_p": 0.9,
        "stream": False
    }
    
    try:
        response = requests.post(invoke_url, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        print("\n" + "="*50)
        print("RESUME ANALYSIS EXAMPLE")
        print("="*50)
        
        if "choices" in result and result["choices"]:
            content = result["choices"][0].get("message", {}).get("content", "")
            print(f"AI Analysis:\n{content}")
        else:
            print("No analysis content received")
            
    except Exception as e:
        print(f"Error in resume analysis: {e}")

if __name__ == "__main__":
    print("Running NVIDIA AI Examples for HireSenseAI")
    print("=" * 50)
    
    # Run your original example
    print("1. Original Example (Process killing in Linux):")
    run_original_nvidia_example()
    
    # Run a HireSenseAI-relevant example
    print("\n2. Resume Analysis Example (relevant to your project):")
    run_resume_analysis_example()
    
    print("\n" + "="*50)
    print("Examples completed!")
    print("To integrate with your main app, consider using the nvidia-ai-client.py module")
