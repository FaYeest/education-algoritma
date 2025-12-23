# Quick Start - LLM Quiz

## 1. Setup Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "HUGGINGFACE_API_TOKEN=your_token_here" > .env
```

**Get Hugging Face Token:**
1. Sign up at https://huggingface.co/
2. Go to Settings > Access Tokens
3. Create new token (read access)
4. Copy token to `.env`

## 2. Test Generator (Optional)

```bash
python utils/llm_quiz_generator.py
```

## 3. Generate Initial Quiz

```bash
# Generate 5 questions per difficulty (fast test)
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(5); g.save_quiz_pool(pool)"
```

## 4. Run Backend

```bash
python main.py
```

Backend runs at: http://localhost:8000

## 5. Run Frontend

```bash
# From root directory
npm run dev
```

Frontend runs at: http://localhost:5173

## 6. Test Quiz

Visit:
- **Quiz Klasik**: http://localhost:5173/quiz
- **Quiz AI**: http://localhost:5173/quiz-ai

## API Endpoints

```bash
# Get quiz questions
curl http://localhost:8000/api/quiz/medium?count=10

# Check status
curl http://localhost:8000/api/quiz/status

# Manual regenerate
curl -X POST http://localhost:8000/api/quiz/regenerate \
  -H "Content-Type: application/json" \
  -d '{"questions_per_difficulty": 30}'
```

## Production Setup

Generate full quiz pool (30 per difficulty = 90 total):

```bash
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(30); g.save_quiz_pool(pool)"
```

This takes ~10-15 minutes.

## Scheduler

Backend auto-generates new quiz every midnight. No manual action needed!

## Troubleshooting

**"Model is loading"**: Wait 1-2 minutes, Hugging Face warming up model

**Rate limit**: Free tier limited to ~1000 req/hour. Generate during off-peak hours.

**No questions**: Check backend logs and verify Hugging Face token

---

Full documentation: See `LLM-QUIZ-SETUP.md`
