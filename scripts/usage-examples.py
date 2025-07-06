#!/usr/bin/env python3
"""
Command Line Usage Examples for NVIDIA AI Integration
"""

import sys
import os

# Add the script directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nvidia_ai_client import NvidiaAIClient

def main():
    print("🚀 NVIDIA AI Command Line Usage Examples")
    print("=" * 50)
    
    # Initialize client
    client = NvidiaAIClient()
    
    # Example 1: Your original code structure
    print("\n1. 💬 Chat with AI (Your Original Code Structure)")
    print("-" * 30)
    
    messages = [
        {"role": "user", "content": "What are the best practices for writing a software engineer resume?"}
    ]
    
    try:
        response = client.chat_completion(messages)
        print(f"AI Response: {response[:200]}...")
    except Exception as e:
        print(f"Error: {e}")
    
    # Example 2: Resume analysis
    print("\n2. 📄 Resume Analysis")
    print("-" * 30)
    
    sample_resume = """
    Jane Doe
    Full Stack Developer
    
    Experience:
    • Senior Developer at StartupCorp (2021-2024)
    • Built scalable web applications using React, Node.js, and PostgreSQL
    • Led a team of 3 developers and improved deployment process
    • Reduced page load time by 40% through optimization
    
    Skills: JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker
    Education: BS Computer Science, State University (2019)
    """
    
    try:
        analysis = client.analyze_resume(sample_resume)
        print(f"Resume Analysis: {analysis[:300]}...")
    except Exception as e:
        print(f"Error: {e}")
    
    # Example 3: Job skills extraction
    print("\n3. 🎯 Job Skills Extraction")
    print("-" * 30)
    
    job_posting = """
    Senior Software Engineer - Full Stack
    
    We are looking for an experienced software engineer to join our team.
    
    Requirements:
    - 5+ years of experience in web development
    - Strong proficiency in JavaScript, TypeScript, and React
    - Experience with Node.js and Express
    - Knowledge of SQL and NoSQL databases
    - Familiarity with cloud platforms (AWS, Azure)
    - Experience with containerization (Docker, Kubernetes)
    - Strong problem-solving and communication skills
    """
    
    try:
        skills = client.extract_job_skills(job_posting)
        print("Extracted Skills:")
        for i, skill in enumerate(skills, 1):
            print(f"  {i}. {skill}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ All examples completed!")
    print("\n🔧 Usage Tips:")
    print("• Run 'python interactive-ai.py' for interactive mode")
    print("• Use the API server for Next.js integration")
    print("• Check 'python nvidia-examples.py' for your original code")

if __name__ == "__main__":
    main()
