# Test New Hugging Face Router API

import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# You need to set your HF token
HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")

if not HF_TOKEN:
    print("ERROR: Please set HUGGINGFACE_API_TOKEN in .env file")
    print("1. Go to https://huggingface.co/settings/tokens")
    print("2. Create a new token (read access is enough)")
    print("3. Add to backend/.env file:")
    print("   HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxx")
    exit(1)

print("=" * 60)
print("Testing New Hugging Face Router API")
print("=" * 60)

API_URL = "https://router.huggingface.co/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

# Test payload
payload = {
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [
        {
            "role": "user",
            "content": "Generate a quiz question about Quick Sort in JSON format with question, 4 answers array, correctAnswer index, and explanation. Respond in Indonesian."
        }
    ],
    "max_tokens": 400,
    "temperature": 0.7
}

print(f"\nAPI URL: {API_URL}")
print(f"Model: {payload['model']}")
print("\nSending request...")

try:
    response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
    
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        result = response.json()
        
        if 'choices' in result:
            content = result['choices'][0]['message']['content']
            print("=" * 60)
            print("✓ SUCCESS! API is working!")
            print("=" * 60)
            print("\nGenerated Response:")
            print("-" * 60)
            print(content)
            print("-" * 60)
            print("\n✓ Quiz generation is working!")
            print("You can now run the backend and frontend.")
        else:
            print("✗ Unexpected response format")
            print(result)
    
    elif response.status_code == 401:
        print("✗ AUTHENTICATION FAILED")
        print("Please check your HUGGINGFACE_API_TOKEN")
        print("Make sure it's valid and has not expired")
    
    elif response.status_code == 402:
        print("✗ PAYMENT REQUIRED")
        error = response.json()
        print(error)
        print("\nThe Router API requires a paid plan.")
        print("See alternatives in: backend/LLM-ALTERNATIVES.md")
    
    else:
        print(f"✗ ERROR: {response.status_code}")
        try:
            error_detail = response.json()
            print(f"Error detail: {error_detail}")
        except:
            print(f"Response text: {response.text}")

except requests.exceptions.Timeout:
    print("✗ REQUEST TIMEOUT")
    print("The model might be loading. Try again in a few minutes.")
    
except Exception as e:
    print(f"✗ EXCEPTION: {e}")

print("\n" + "=" * 60)
print("Note:")
print("- If you get 402 Payment Required, Router API needs paid plan")
print("- Consider using Groq API (free & fast)")
print("- See: backend/LLM-ALTERNATIVES.md")
print("=" * 60)
