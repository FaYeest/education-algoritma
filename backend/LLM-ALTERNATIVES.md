# Alternative: Using OpenAI/Groq API for Quiz Generation

Karena Hugging Face Inference API untuk model gratis sering unavailable (error 410 Gone), 
berikut adalah alternatif yang lebih stabil:

## Option 1: Groq (Recommended - Fast & Free)

Groq menyediakan API gratis dengan model cepat.

### Setup:

1. Daftar di https://console.groq.com/
2. Get API key
3. Update `llm_quiz_generator.py`:

```python
import os
from groq import Groq

class LLMQuizGenerator:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
    def query_llm(self, prompt):
        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Fast & free
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
```

### Install:
```bash
pip install groq
```

### .env:
```
GROQ_API_KEY=gsk_xxxxx
```

## Option 2: OpenAI API (Paid but Reliable)

```python
from openai import OpenAI

class LLMQuizGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    def query_llm(self, prompt):
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",  # Cheapest option
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
```

Cost: ~$0.002 per 90 questions (very cheap!)

## Option 3: Ollama (Self-Hosted - Free)

Run models locally:

```bash
# Install Ollama
# Windows: Download from https://ollama.ai/download

# Pull model
ollama pull llama3.1:8b

# Run
ollama serve
```

Python code:
```python
import requests

class LLMQuizGenerator:
    def __init__(self):
        self.api_url = "http://localhost:11434/api/generate"
        
    def query_llm(self, prompt):
        response = requests.post(
            self.api_url,
            json={
                "model": "llama3.1:8b",
                "prompt": prompt,
                "stream": False
            }
        )
        return response.json()["response"]
```

## Option 4: Use Static High-Quality Questions

Extend `quizData.js` with more questions instead of LLM:

```javascript
// src/utils/quizData.js
export const quizQuestionsExpanded = {
  easy: [...], // 100+ questions
  medium: [...], // 100+ questions
  hard: [...] // 100+ questions
}
```

## Recommendation for Your Case:

**Best Option: Groq (Free + Fast)**
- Setup time: 5 minutes
- Free tier: 14,400 requests/day
- Speed: Very fast (~1s per question)
- No infrastructure needed

**Want me to implement Groq integration?**

Let me know which option you prefer!
