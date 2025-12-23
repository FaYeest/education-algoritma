# Setup Quiz dengan LLM (Hugging Face)

## 📋 Fitur

✅ **Daily Quiz Pool** - Generate 30 pertanyaan per difficulty setiap hari (90 total)
✅ **Random Selection** - User dapat 10 pertanyaan random, tidak akan sama
✅ **3 Difficulty Levels** - Easy, Medium, Hard dengan gamifikasi
✅ **AI-Generated** - Pertanyaan bervariasi menggunakan Mistral-7B-Instruct
✅ **Auto Scheduling** - Regenerate otomatis setiap midnight
✅ **Caching** - Pertanyaan disimpan untuk efisiensi
✅ **Fallback** - Jika LLM gagal, ada fallback questions

## 🚀 Setup Backend

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Hugging Face Token

1. Buat akun di [Hugging Face](https://huggingface.co/)
2. Generate token di [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Buat file `.env` di folder `backend/`:

```bash
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Test Generator (Optional)

Test apakah LLM generator bekerja:

```bash
cd backend
python utils/llm_quiz_generator.py
```

### 4. Generate Initial Quiz Pool

```bash
cd backend
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(5); g.save_quiz_pool(pool)"
```

Ini akan generate 5 pertanyaan per difficulty (15 total) sebagai test.

### 5. Run Backend

```bash
cd backend
python main.py
```

Backend akan:
- Start di `http://localhost:8000`
- Setup scheduler untuk auto-generate setiap midnight
- Load existing quiz pool atau generate baru jika belum ada

## 🎮 Setup Frontend

### 1. Update Environment Variables

Buat/update file `.env` di root project:

```bash
VITE_API_URL=http://localhost:8000
```

### 2. Run Frontend

```bash
npm run dev
```

### 3. Akses Quiz AI

Buka browser:
- Quiz biasa: `http://localhost:5173/quiz`
- Quiz AI: `http://localhost:5173/quiz-ai`

## 📡 API Endpoints

### Get Quiz Questions

```
GET /api/quiz/{difficulty}?count=10
```

Parameters:
- `difficulty`: easy, medium, hard
- `count`: jumlah pertanyaan (1-50)

Response:
```json
{
  "success": true,
  "difficulty": "medium",
  "count": 10,
  "questions": [
    {
      "question": "Apa kompleksitas waktu...",
      "answers": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      "correctAnswer": 1,
      "explanation": "Penjelasan lengkap...",
      "topic": "sorting",
      "algorithm": "Quick Sort",
      "difficulty": "medium"
    }
  ]
}
```

### Check Quiz Status

```
GET /api/quiz/status
```

Response:
```json
{
  "status": "ready",
  "date": "2025-12-19",
  "is_current": true,
  "questions_count": {
    "easy": 30,
    "medium": 30,
    "hard": 30
  },
  "total": 90
}
```

### Manually Regenerate Quiz

```
POST /api/quiz/regenerate
Content-Type: application/json

{
  "questions_per_difficulty": 30
}
```

## ⚙️ Configuration

### Ubah Jumlah Pertanyaan per Hari

Edit `backend/main.py`:

```python
quiz_pool = generator.generate_daily_quiz_pool(questions_per_difficulty=30)  # Ubah angka ini
```

### Ubah Model LLM

Edit `backend/utils/llm_quiz_generator.py`:

```python
self.api_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
```

Model alternatif:
- `meta-llama/Llama-2-7b-chat-hf`
- `HuggingFaceH4/zephyr-7b-beta`
- `google/flan-t5-xxl`

### Ubah Jadwal Auto-Generate

Edit `backend/main.py`:

```python
# Generate setiap jam 2 pagi
scheduler.add_job(
    generate_daily_quiz,
    CronTrigger(hour=2, minute=0),
    ...
)
```

## 🔧 Troubleshooting

### Error: "Model is loading"

Hugging Face perlu warm-up model. Tunggu 1-2 menit dan coba lagi.

### Error: "Rate limit exceeded"

Hugging Face free tier punya rate limit. Solusi:
1. Tunggu beberapa menit
2. Gunakan Hugging Face Pro ($9/bulan)
3. Self-host model di VPS

### Quiz Pool Tidak Generate

Manual trigger:

```bash
curl -X POST http://localhost:8000/api/quiz/regenerate \
  -H "Content-Type: application/json" \
  -d '{"questions_per_difficulty": 30}'
```

### Pertanyaan Tidak Bervariasi

Cek apakah quiz pool sudah outdated:

```bash
curl http://localhost:8000/api/quiz/status
```

Jika `is_current: false`, manual regenerate atau restart backend.

## 📊 Production Tips

### 1. Pre-Generate Saat Deploy

Tambah script di deployment:

```bash
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(30); g.save_quiz_pool(pool)"
```

### 2. Backup Quiz Cache

```bash
# Backup
cp backend/quiz_cache.json backend/quiz_cache_backup.json

# Restore
cp backend/quiz_cache_backup.json backend/quiz_cache.json
```

### 3. Monitor API Usage

Track request ke Hugging Face API untuk avoid rate limits.

### 4. Hybrid Mode

Kombinasi static questions + LLM:
- 50% dari static `quizData.js`
- 50% dari LLM generated

## 🎯 Roadmap

- [ ] Leaderboard harian berdasarkan quiz pool
- [ ] User bisa report pertanyaan yang salah
- [ ] Adaptive difficulty (adjust based on user performance)
- [ ] Multi-language support
- [ ] Custom topics (user pilih topik spesifik)
- [ ] Question difficulty scoring oleh AI

## 📝 Notes

- Quiz pool disimpan di `backend/quiz_cache.json`
- File ini auto-generated dan git-ignored
- Scheduler berjalan di background thread
- Rate limit Hugging Face: ~1000 requests/hour (free tier)
- Generation time: ~2-5 detik per pertanyaan
- Total generation time untuk 90 pertanyaan: ~5-15 menit

## 🆘 Support

Jika ada masalah:
1. Check backend logs
2. Verify Hugging Face token
3. Test dengan pertanyaan kecil dulu (5 per difficulty)
4. Check API documentation: http://localhost:8000/docs
