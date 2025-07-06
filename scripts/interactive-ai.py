#!/usr/bin/env python3
"""
Interactive NVIDIA AI Client for HireSenseAI
Use this to test AI features interactively
"""

from nvidia_ai_client import NvidiaAIClient
import json

def interactive_ai():
    print("🤖 Interactive NVIDIA AI Client for HireSenseAI")
    print("=" * 50)
    
    # Initialize client
    try:
        client = NvidiaAIClient()
        print("✅ AI Client initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing client: {e}")
        return
    
    while True:
        print("\n🚀 What would you like to do?")
        print("1. Chat with AI (Your original code structure)")
        print("2. Analyze a resume")
        print("3. Enhance a resume")
        print("4. Generate a cover letter")
        print("5. Extract job skills")
        print("6. Exit")
        
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == "1":
            print("\n💬 AI Chat")
            message = input("Ask AI anything: ")
            try:
                response = client.chat_completion([
                    {"role": "user", "content": message}
                ])
                print(f"\n🤖 AI Response:\n{response}")
            except Exception as e:
                print(f"❌ Error: {e}")
        
        elif choice == "2":
            print("\n📄 Resume Analysis")
            print("Paste your resume content (press Enter twice when done):")
            resume_lines = []
            while True:
                line = input()
                if line == "" and len(resume_lines) > 0:
                    break
                resume_lines.append(line)
            
            resume_content = "\n".join(resume_lines)
            if resume_content.strip():
                try:
                    analysis = client.analyze_resume(resume_content)
                    print(f"\n📊 Resume Analysis:\n{analysis}")
                except Exception as e:
                    print(f"❌ Error: {e}")
            else:
                print("❌ No resume content provided")
        
        elif choice == "3":
            print("\n✨ Resume Enhancement")
            resume_data = input("Enter your resume summary: ")
            job_desc = input("Enter job description (optional): ")
            
            try:
                enhancement = client.enhance_resume_content(
                    {"content": resume_data}, 
                    job_desc if job_desc else ""
                )
                print(f"\n💎 Enhanced Resume:\n{enhancement}")
            except Exception as e:
                print(f"❌ Error: {e}")
        
        elif choice == "4":
            print("\n💌 Cover Letter Generation")
            resume_data = input("Enter your resume summary: ")
            job_desc = input("Enter job description: ")
            company = input("Enter company name: ")
            
            try:
                cover_letter = client.generate_cover_letter(
                    {"content": resume_data}, 
                    job_desc, 
                    company
                )
                print(f"\n📋 Cover Letter:\n{cover_letter}")
            except Exception as e:
                print(f"❌ Error: {e}")
        
        elif choice == "5":
            print("\n🎯 Job Skills Extraction")
            job_desc = input("Enter job description: ")
            
            try:
                skills = client.extract_job_skills(job_desc)
                print(f"\n📝 Extracted Skills:")
                for i, skill in enumerate(skills, 1):
                    print(f"{i}. {skill}")
            except Exception as e:
                print(f"❌ Error: {e}")
        
        elif choice == "6":
            print("👋 Thanks for using NVIDIA AI for HireSenseAI!")
            break
        
        else:
            print("❌ Invalid choice. Please enter 1-6.")

if __name__ == "__main__":
    interactive_ai()
