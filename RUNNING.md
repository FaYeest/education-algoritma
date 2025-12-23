# 🚀 Cara Running AlgoViz

## Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm atau yarn

---

## 📦 Installation

### 1. Install Dependencies

**Frontend (React):**
```bash
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma
npm install
```

**Backend (Python):**
```bash
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma\backend
pip install -r requirements.txt
```

---

## ▶️ Running the Application

### **Metode 1: Dua Terminal Terpisah (Recommended)**

**Terminal 1 - Backend:**
```bash
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma\backend
python main.py
```
✅ Backend akan berjalan di: `http://localhost:8000`
📄 API Docs: `http://localhost:8000/docs`

**Terminal 2 - Frontend:**
```bash
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma
npm run dev
```
✅ Frontend akan berjalan di: `http://localhost:5173`

---

### **Metode 2: PowerShell (Background Process)**

**Start Backend:**
```powershell
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma\backend
Start-Process python -ArgumentList "main.py" -NoNewWindow
```

**Start Frontend:**
```powershell
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma
npm run dev
```

---

## 🧪 Testing

### 1. **Test Backend API**
Buka browser: `http://localhost:8000/docs`

Coba endpoint:
```json
POST /api/algorithms/sorting
{
  "algorithm": "bubble",
  "array": [5, 3, 8, 2, 7]
}
```

### 2. **Test Frontend**
Buka browser: `http://localhost:5173`
- Klik card "SORTING ALGORITHMS"
- Klik tombol Play ▶
- Lihat animasi sorting

---

## 🛑 Stopping the Servers

**Backend:**
- Tekan `Ctrl + C` di terminal backend

**Frontend:**
- Tekan `Ctrl + C` di terminal frontend

**Atau kill process manually:**
```powershell
# Find process
Get-Process | Where-Object {$_.ProcessName -like "*python*"}
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Kill process
Stop-Process -Name "python" -Force
Stop-Process -Name "node" -Force
```

---

## 📁 Project Structure

```
education-algoritma/
├── backend/                 # FastAPI Backend
│   ├── main.py             # Entry point
│   ├── algorithms/         # Algorithm implementations
│   ├── models/             # Pydantic models
│   └── requirements.txt
│
├── src/                    # React Frontend
│   ├── components/
│   │   ├── Common/        # Reusable components
│   │   └── Visualizations/ # Algorithm visualizations
│   ├── context/           # React Context
│   ├── hooks/             # Custom hooks
│   └── pages/
│
├── package.json
└── vite.config.js
```

---

## 🔧 Troubleshooting

### **API Configuration**

Frontend sekarang menggunakan environment variable untuk API URL.

**Development (Localhost):**
File `.env` sudah diset:
```
VITE_API_URL=http://localhost:8000
```

**Production:**
Setelah deploy backend, buat file `.env.production`:
```
VITE_API_URL=https://your-backend-url.com
```

Atau backend URL akan auto-detect dari hostname di `src/config/api.js`

### **Port Already in Use**

**Backend (8000):**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

**Frontend (5173):**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

### **Module Not Found (Python)**
```bash
cd backend
pip install -r requirements.txt
```

### **Module Not Found (React)**
```bash
npm install
```

### **CORS Error**
Pastikan backend CORS middleware sudah allow `http://localhost:5173`

Check `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    ...
)
```

---

## 🎯 Quick Start (Copy-Paste)

**Terminal 1:**
```bash
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma\backend && python main.py
```

**Terminal 2:**
```bash
cd C:\Users\Farras\Code\algoritma-pemrograma-3\education-algoritma && npm run dev
```

**Lalu buka browser:**
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

---

## 📝 Available Scripts

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
python main.py   # Start FastAPI server
```

---

## ✅ Checklist Running

- [ ] Backend running di port 8000
- [ ] Frontend running di port 5173
- [ ] Bisa akses http://localhost:8000/docs
- [ ] Bisa akses http://localhost:5173
- [ ] Klik sorting algorithm → Play button works
- [ ] Animation berjalan smooth

---

**Happy Coding! 🚀**
