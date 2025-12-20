# Troubleshooting Guide - Quiz AI

## ❌ Masalah: Pertanyaan Tidak Random / Pool Terlalu Kecil

### **Symptoms:**
- Pertanyaan yang sama muncul terus
- Tidak ada variasi
- Pool questions terlalu sedikit

### **Root Cause:**
Quiz cache hanya berisi sedikit pertanyaan (contoh: 3-9 pertanyaan per difficulty)

### **Solution:**

#### 1. Generate Pertanyaan Lebih Banyak

**Test Mode (10 per difficulty = 30 total):**
```bash
cd backend
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(10); g.save_quiz_pool(pool)"
```
⏱️ Waktu: ~3-5 menit

**Production Mode (30 per difficulty = 90 total):**
```bash
cd backend
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(30); g.save_quiz_pool(pool)"
```
⏱️ Waktu: ~10-15 menit

#### 2. Verifikasi File Updated

```bash
cd backend
python -c "import json; cache = json.load(open('quiz_cache.json')); print(f\"Easy: {len(cache['easy'])}, Medium: {len(cache['medium'])}, Hard: {len(cache['hard'])}, Total: {len(cache['easy'])+len(cache['medium'])+len(cache['hard'])}\")"
```

**Expected Output:**
```
Easy: 10, Medium: 10, Hard: 10, Total: 30
```

atau untuk production:
```
Easy: 30, Medium: 30, Hard: 30, Total: 90
```

#### 3. Restart Backend

```bash
# Stop existing backend (Ctrl+C)
# Then restart:
cd backend
python main.py
```

#### 4. Test via API

```bash
curl http://localhost:8000/api/quiz/status
```

**Expected Response:**
```json
{
  "status": "ready",
  "date": "2025-12-19",
  "is_current": true,
  "questions_count": {
    "easy": 10,
    "medium": 10,
    "hard": 10
  },
  "total": 30
}
```

#### 5. Test Random Selection

Get quiz 3x dan cek apakah pertanyaan berbeda:

```bash
# Request 1
curl "http://localhost:8000/api/quiz/medium?count=3"

# Request 2  
curl "http://localhost:8000/api/quiz/medium?count=3"

# Request 3
curl "http://localhost:8000/api/quiz/medium?count=3"
```

Seharusnya pertanyaan berbeda-beda (random dari 10/30 pool)

---

## ❌ Masalah: Backend Tidak Auto-Update Quiz

### **Symptoms:**
- Scheduler tidak jalan
- Quiz tidak update setiap hari

### **Root Cause:**
Scheduler belum aktif atau backend mati

### **Solution:**

#### 1. Check Scheduler Status

Saat start backend, seharusnya muncul log:
```
Quiz scheduler started - will generate new questions daily at midnight
```

#### 2. Manual Trigger via API

```bash
curl -X POST http://localhost:8000/api/quiz/regenerate \
  -H "Content-Type: application/json" \
  -d '{"questions_per_difficulty": 30}'
```

#### 3. Setup Cron Job (Production)

Jika scheduler tidak reliable, gunakan system cron:

**Linux/Mac:**
```bash
crontab -e

# Add this line (run at midnight)
0 0 * * * cd /path/to/backend && python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(30); g.save_quiz_pool(pool)"
```

**Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 00:00
4. Action: Start a program
   - Program: `python`
   - Arguments: `-c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(30); g.save_quiz_pool(pool)"`
   - Start in: `C:\path\to\backend`

---

## ❌ Masalah: File quiz_cache.json Tidak Ditemukan

### **Solution:**

Generate initial file:
```bash
cd backend
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(10); g.save_quiz_pool(pool)"
```

---

## ✅ Best Practices

### 1. Initial Setup
```bash
# Generate pool untuk development (cepat)
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(10); g.save_quiz_pool(pool)"
```

### 2. Production Deployment
```bash
# Generate full pool (90 pertanyaan)
python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(30); g.save_quiz_pool(pool)"
```

### 3. Monitoring
```bash
# Daily check
curl http://localhost:8000/api/quiz/status

# View file directly
cat quiz_cache.json | python -m json.tool
```

### 4. Backup
```bash
# Backup before regenerate
cp quiz_cache.json quiz_cache_backup_$(date +%Y%m%d).json

# Restore if needed
cp quiz_cache_backup_20251219.json quiz_cache.json
```

---

## 📊 Recommended Pool Size

| Environment | Questions/Difficulty | Total | Random Chance |
|-------------|---------------------|-------|---------------|
| Development | 5-10 | 15-30 | Good |
| Staging | 20 | 60 | Better |
| Production | 30 | 90 | Best |

**Formula untuk variasi:**
- User dapat 10 pertanyaan per quiz
- Dari pool 30 pertanyaan per difficulty
- Kemungkinan kombinasi: C(30,10) = 30,045,015 kombinasi!
- Hampir tidak mungkin dapat pertanyaan sama 2x berturut-turut

---

## 🔧 Quick Commands Cheat Sheet

```bash
# Generate quiz (10 per difficulty)
cd backend && python -c "from utils.llm_quiz_generator import LLMQuizGenerator; g = LLMQuizGenerator(); pool = g.generate_daily_quiz_pool(10); g.save_quiz_pool(pool)"

# Check status
curl http://localhost:8000/api/quiz/status

# Manual regenerate
curl -X POST http://localhost:8000/api/quiz/regenerate -H "Content-Type: application/json" -d '{"questions_per_difficulty": 30}'

# View count
cd backend && python -c "import json; c=json.load(open('quiz_cache.json')); print(f'Total: {sum([len(c[d]) for d in [\"easy\",\"medium\",\"hard\"]])}')"

# Backup
cd backend && cp quiz_cache.json quiz_cache_backup.json

# Test random
curl "http://localhost:8000/api/quiz/medium?count=3"
```

---

## 🆘 Still Having Issues?

1. Check logs: Backend console output
2. Verify token: `echo $HUGGINGFACE_API_TOKEN`
3. Test generator: `python utils/llm_quiz_generator.py`
4. Check file permissions: `ls -l quiz_cache.json`
5. Validate JSON: `cat quiz_cache.json | python -m json.tool`

---

**Last Updated:** 2025-12-19
