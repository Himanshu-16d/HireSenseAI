#!/usr/bin/env python3
"""
Comprehensive demo of all NVIDIA AI features for HireSenseAI
"""

import requests
import json
import time

def demo_all_features():
    base_url = "http://localhost:5001"
    
    print("🚀 NVIDIA AI Integration Demo for HireSenseAI")
    print("=" * 50)
    
    # Sample data
    sample_resume = """
    John Smith
    Software Engineer
    
    Experience:
    • Software Developer at TechCorp (2022-2024)
    • Developed web applications using React.js and Node.js
    • Collaborated with cross-functional teams to improve system performance
    • Managed database operations and API integrations
    
    Skills: JavaScript, Python, React, Node.js, SQL, MongoDB
    Education: Bachelor's in Computer Science (2020)
    """
    
    job_description = """
    Senior Software Engineer - Full Stack
    We are looking for an experienced software engineer to join our team.
    
    Requirements:
    - 3+ years of experience in web development
    - Strong knowledge of JavaScript, React, Node.js
    - Experience with databases (SQL, MongoDB)
    - Knowledge of cloud platforms (AWS, Azure)
    - Strong problem-solving skills
    - Excellent communication skills
    """
    
    company_name = "TechCorp Inc."
    
    print("\n1. 🏥 Health Check")
    print("-" * 30)
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"✅ Status: {response.json()['status']}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    print("\n2. 🔧 Original NVIDIA AI Example")
    print("-" * 30)
    try:
        response = requests.post(f"{base_url}/api/ai/original-example", timeout=30)
        result = response.json()
        print(f"✅ Your original code response: '{result['response']}'")
        print(f"   (This shows your original NVIDIA AI integration is working)")
    except Exception as e:
        print(f"❌ Original example failed: {e}")
    
    print("\n3. 📄 Resume Analysis")
    print("-" * 30)
    try:
        payload = {"resume_content": sample_resume.strip()}
        response = requests.post(f"{base_url}/api/ai/analyze-resume", json=payload, timeout=60)
        result = response.json()
        if result.get("success"):
            analysis = result["analysis"]
            print(f"✅ Resume Analysis Complete!")
            print(f"   Preview: {analysis[:200]}...")
        else:
            print(f"❌ Resume analysis failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Resume analysis failed: {e}")
    
    print("\n4. 🎯 Job Skills Extraction")
    print("-" * 30)
    try:
        payload = {"job_description": job_description.strip()}
        response = requests.post(f"{base_url}/api/ai/extract-job-skills", json=payload, timeout=45)
        result = response.json()
        if result.get("success"):
            skills = result["skills"]
            print(f"✅ Extracted {len(skills)} skills:")
            for skill in skills[:5]:  # Show first 5 skills
                print(f"   • {skill}")
            if len(skills) > 5:
                print(f"   ... and {len(skills) - 5} more")
        else:
            print(f"❌ Skills extraction failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Skills extraction failed: {e}")
    
    print("\n5. ✨ Resume Enhancement")
    print("-" * 30)
    try:
        payload = {
            "resume_data": {"content": sample_resume.strip()},
            "job_description": job_description.strip()
        }
        response = requests.post(f"{base_url}/api/ai/enhance-resume", json=payload, timeout=60)
        result = response.json()
        if result.get("success"):
            enhancement = result["enhancement"]
            print(f"✅ Resume Enhancement Complete!")
            print(f"   Preview: {enhancement[:200]}...")
        else:
            print(f"❌ Resume enhancement failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Resume enhancement failed: {e}")
    
    print("\n6. 💌 Cover Letter Generation")
    print("-" * 30)
    try:
        payload = {
            "resume_data": {"content": sample_resume.strip()},
            "job_description": job_description.strip(),
            "company_name": company_name
        }
        response = requests.post(f"{base_url}/api/ai/generate-cover-letter", json=payload, timeout=60)
        result = response.json()
        if result.get("success"):
            cover_letter = result["cover_letter"]
            print(f"✅ Cover Letter Generated!")
            print(f"   Preview: {cover_letter[:200]}...")
        else:
            print(f"❌ Cover letter generation failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Cover letter generation failed: {e}")
    
    print("\n7. 💬 General Chat (Your Original Code Structure)")
    print("-" * 30)
    try:
        payload = {
            "messages": [
                {"role": "user", "content": "What are the key components of a good software engineer resume?"}
            ],
            "model": "meta/llama-3.1-8b-instruct",
            "max_tokens": 200
        }
        response = requests.post(f"{base_url}/api/ai/chat", json=payload, timeout=45)
        result = response.json()
        if result.get("success"):
            chat_response = result["content"]
            print(f"✅ Chat Response:")
            print(f"   {chat_response[:300]}...")
        else:
            print(f"❌ Chat failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Chat failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Demo Complete!")
    print("\n🔗 Integration Ready:")
    print("   • API Server: http://localhost:5001")
    print("   • Health Check: http://localhost:5001/health")
    print("   • Use the TypeScript integration in your Next.js app")
    print("   • Check lib/python-ai-integration.ts for usage examples")
    print("\n📚 Available for HireSenseAI:")
    print("   • Resume Analysis & Enhancement")
    print("   • Job Skills Extraction")
    print("   • Cover Letter Generation")
    print("   • General AI Chat (your original code structure)")

if __name__ == "__main__":
    demo_all_features()
