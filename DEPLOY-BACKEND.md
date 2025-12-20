# 🎯 Deploy Backend ke Production

## Pilihan Platform Deploy (Gratis)

### 1. **Railway.app** ⭐ (Recommended)

**Kelebihan:**
- ✅ Auto-detect Python
- ✅ Free $5/month credit
- ✅ Zero config
- ✅ Auto SSL
- ✅ Super mudah!

**Langkah:**
1. Push code ke GitHub
2. Sign up di https://railway.app
3. **New Project → Deploy from GitHub**
4. Select repository
5. Railway auto-detect backend folder
6. Deploy! 🚀

URL: `https://algoviz-api-production.up.railway.app`

---

### 2. **Render.com**

**Kelebihan:**
- ✅ 100% gratis selamanya
- ✅ 750 jam/bulan free tier
- ✅ Auto-deploy dari GitHub

**Langkah:**
1. Push code ke GitHub
2. Sign up di https://render.com
3. **New → Web Service**
4. Connect GitHub repo
5. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy!

URL: `https://algoviz-api.onrender.com`

---

### 3. **Vercel**

**Kelebihan:**
- ⚡ Deploy frontend + backend sekaligus
- ✅ Serverless
- ✅ Global CDN

**Langkah:**
```bash
npm i -g vercel
vercel
```

File `vercel.json` sudah dikonfigurasi!

---

## 📝 Setelah Deploy Backend

### 1. Copy URL backend Anda
Misal: `https://algoviz-api.onrender.com`

### 2. Update file konfigurasi

**Opsi A: Edit `src/config/api.js`:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : 'https://algoviz-api.onrender.com'); // <- Ganti dengan URL Anda
```

**Opsi B: Buat `.env.production`:**
```bash
VITE_API_URL=https://algoviz-api.onrender.com
```

### 3. Update CORS di backend

Edit `backend/main.py`:
```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://algoviz-7392f.web.app",
    "https://algoviz-7392f.firebaseapp.com"
]
```

### 4. Deploy ulang frontend
```bash
npm run build
firebase deploy --only hosting
```

---

## 🧪 Test API Production

```bash
curl https://algoviz-api.onrender.com/health
```

Atau buka di browser:
```
https://algoviz-api.onrender.com/docs
```

---

## ✅ Checklist

- [ ] Backend deployed
- [ ] Frontend bisa akses backend production
- [ ] CORS dikonfigurasi dengan benar
- [ ] API Docs accessible
- [ ] Test sorting algorithm di production

**Done! Website + Backend sudah online! 🎉**
