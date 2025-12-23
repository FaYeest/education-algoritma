# Test Hugging Face API Connection

import os
import requests

# Set your token here for testing
HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")

if not HF_TOKEN:
    print("ERROR: Please set HUGGINGFACE_API_TOKEN environment variable")
    print("Get it from: https://huggingface.co/settings/tokens")
    exit(1)

# Test 1: Check if token is valid
print("=" * 50)
print("Testing Hugging Face API Connection")
print("=" * 50)

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

# Test simple text generation
test_url = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"

payload = {
    "inputs": "What is 2+2?",
    "parameters": {
        "max_new_tokens": 50,
        "return_full_text": False
    },
    "options": {
        "wait_for_model": True
    }
}

print(f"\nTesting model: {test_url.split('/')[-1]}")
print("Sending request...")

try:
    response = requests.post(test_url, headers=headers, json=payload, timeout=30)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("✓ SUCCESS! API is working")
        print(f"Response: {result}")
    elif response.status_code == 503:
        error = response.json()
        print("⏳ Model is loading...")
        if 'estimated_time' in error:
            print(f"Estimated wait: {error['estimated_time']}s")
    else:
        print(f"✗ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"✗ EXCEPTION: {e}")

print("\n" + "=" * 50)
print("Alternative: Try different models")
print("=" * 50)

# Test multiple models
test_models = [
    "microsoft/Phi-3-mini-4k-instruct",
    "google/gemma-2b-it",
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
]

for model in test_models:
    url = f"https://api-inference.huggingface.co/models/{model}"
    print(f"\nTrying: {model}")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            print(f"  ✓ Available!")
        elif response.status_code == 503:
            print(f"  ⏳ Loading...")
        elif response.status_code == 410:
            print(f"  ✗ Deprecated")
        else:
            print(f"  ? Status {response.status_code}")
    except Exception as e:
        print(f"  ✗ Error: {e}")

print("\n" + "=" * 50)
print("Recommendation:")
print("If all models fail, consider using Groq API (free & fast)")
print("See: backend/LLM-ALTERNATIVES.md")
print("=" * 50)
