# Setup Instructions - Updated for New HF API

## ⚠️ IMPORTANT UPDATE

Hugging Face has migrated to a new API endpoint:
- **OLD**: `api-inference.huggingface.co` (deprecated ❌)
- **NEW**: `router.huggingface.co` (active ✅)

## Status Check

The new Router API **may require a paid plan**. Let's test first:

### Step 1: Get Hugging Face Token

1. Go to https://huggingface.co/settings/tokens
2. Create new token (select "Read" permission)
3. Copy the token (starts with `hf_...`)

### Step 2: Test API Access

```bash
cd backend

# Create .env file
echo "HUGGINGFACE_API_TOKEN=hf_your_token_here" > .env

# Test the new Router API
python test_router_api.py
```

### Possible Outcomes:

#### ✅ If it works (200 OK):
Great! You can use the quiz system as is.

#### ❌ If you get 402 Payment Required:
The Router API needs a paid plan. Use alternatives below.

## Alternative Solutions

### Option 1: Groq API (RECOMMENDED - Free & Fast) ⭐

**Advantages:**
- ✅ Completely FREE
- ✅ Very fast (~1s per question)
- ✅ 14,400 requests/day free tier
- ✅ Easy setup

**Setup:**

1. Sign up at https://console.groq.com/
2. Get API key
3. Install: `pip install groq`
4. Update `.env`:
   ```
   GROQ_API_KEY=gsk_xxxxx
   ```

**Implementation:** See `backend/LLM-ALTERNATIVES.md`

### Option 2: Use Static Questions

Keep using the current fallback system with high-quality static questions.

**Advantages:**
- ✅ No API needed
- ✅ No rate limits
- ✅ Instant response
- ✅ Works offline

**Implementation:**
The system already has good fallback questions. Just expand `generate_fallback_question()` with more templates.

### Option 3: Ollama (Self-Hosted)

Run LLM locally on your VPS.

**Requirements:**
- 8GB RAM minimum
- Works on Windows/Linux/Mac

**Setup:**
```bash
# Install Ollama
# Download from: https://ollama.ai/download

# Pull model
ollama pull llama3.1:8b

# Run server
ollama serve
```

## Recommendation

**For your case, I recommend Groq API:**
1. Free & unlimited for reasonable use
2. Very fast generation
3. Production-ready
4. No infrastructure needed

**Want me to implement Groq integration now?**

Just let me know and I'll update the code in ~5 minutes!
