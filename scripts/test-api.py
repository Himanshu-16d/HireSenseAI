#!/usr/bin/env python3
"""
Test script for the NVIDIA AI Python API server
"""

import requests
import json

def test_api():
    base_url = "http://localhost:5001"
    
    print("Testing NVIDIA AI Python API Server")
    print("=" * 40)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"✅ Health Check: {response.json()}")
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
        return
    
    # Test 2: Original example
    try:
        response = requests.post(f"{base_url}/api/ai/original-example", timeout=30)
        result = response.json()
        print(f"✅ Original Example: {result['response']}")
    except Exception as e:
        print(f"❌ Original Example Failed: {e}")
    
    # Test 3: Resume analysis
    try:
        payload = {
            "resume_content": "John Doe\nSoftware Engineer\n\nExperience:\n- 2 years at TechCorp\n- React and Node.js developer\n\nSkills: JavaScript, Python"
        }
        response = requests.post(
            f"{base_url}/api/ai/analyze-resume", 
            json=payload, 
            timeout=60
        )
        result = response.json()
        if result.get("success"):
            print(f"✅ Resume Analysis: Working (analysis length: {len(result['analysis'])} chars)")
        else:
            print(f"❌ Resume Analysis Failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"❌ Resume Analysis Failed: {e}")
    
    print("\n" + "=" * 40)
    print("API Testing Complete!")

if __name__ == "__main__":
    test_api()
