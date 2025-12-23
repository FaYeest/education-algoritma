# 🎓 ALGOVIZ - Platform Visualisasi Algoritma Interaktif

<div align="center">

![AlgoViz Banner](https://img.shields.io/badge/AlgoViz-Educational_Platform-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Platform pembelajaran algoritma interaktif dengan visualisasi yang menarik dan edukatif**

[Demo](#-fitur) • [Instalasi](#-instalasi) • [Dokumentasi](#-dokumentasi) • [Kontribusi](#-kontribusi)

</div>

---

## 📖 Tentang Proyek

**AlgoViz** adalah platform edukasi interaktif yang dirancang untuk membantu mahasiswa dan pengembang memahami algoritma fundamental melalui visualisasi yang menarik. Dibangun dengan **React + Vite** untuk frontend dan **FastAPI** untuk backend, platform ini menyediakan pengalaman belajar yang intuitif dengan desain brutalism yang unik.

### 🎯 Tujuan
- **Visualisasi Interaktif**: Melihat algoritma bekerja secara real-time
- **Pembelajaran Aktif**: Kontrol kecepatan dan observasi setiap langkah
- **Gamifikasi**: Sistem kuis untuk menguji pemahaman
- **Open Source**: Kontribusi terbuka untuk pengembangan lebih lanjut

---

## ✨ Fitur

### 🔍 Algoritma Pencarian
- **Brute Force Search** - Pencarian ekshaustif dengan visualisasi step-by-step
- **Binary Search (Divide & Conquer)** - Pencarian dengan pembagian array

### 📊 Algoritma Sorting
- **Bubble Sort** - Sorting dengan pertukaran bersebelahan
- **Selection Sort** - Sorting dengan pemilihan elemen terkecil
- **Insertion Sort** - Sorting dengan penyisipan
- **Merge Sort** - Sorting dengan divide-and-conquer
- **Quick Sort** - Sorting dengan pivot

### 🌲 Graph Traversal
- **BFS (Breadth-First Search)** - Penjelajahan level per level
- **DFS (Depth-First Search)** - Penjelajahan sedalam mungkin

### 🎯 Algoritma Optimization
- **Greedy Algorithm** - Coin Change Problem
- **Dynamic Programming** - 0/1 Knapsack with interactive scenarios & Dungeon Maze pathfinding
- **Minimum Spanning Tree** - Kruskal's & Prim's Algorithm with city network visualization

### 🎮 Fitur Gamifikasi
- **Quiz System** dengan 3 level kesulitan (Mudah, Sedang, Sulit)
- **Score & Streak System** untuk memotivasi belajar
- **Real-time Feedback** dengan penjelasan detail
- **Interactive Controls** dengan PlaybackControls (Play, Pause, Reset, Next, Prev)
- **Multiple View Modes** (Step-by-Step & List All Steps)
- **Leaderboard** (coming soon)

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 18.3** - UI Library
- ⚡ **Vite** - Build Tool & Dev Server
- 🎨 **TailwindCSS** - Utility-first CSS
- 🎭 **Framer Motion** - Animation Library
- 🧭 **React Router** - Client-side Routing
- 🎨 **Heroicons** - Icon Library

### Backend
- 🚀 **FastAPI** - Modern Python Web Framework
- 🐍 **Python 3.8+** - Programming Language
- 📦 **Pydantic** - Data Validation
- 🔄 **CORS Middleware** - Cross-Origin Resource Sharing
- 📝 **Uvicorn** - ASGI Server

---

## 📦 Instalasi

### Prerequisites
- Node.js v16 atau lebih tinggi
- Python 3.8 atau lebih tinggi
- npm atau yarn

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone <repository-url>
cd education-algoritma
```

2. **Install Dependencies Frontend**
```bash
npm install
```

3. **Install Dependencies Backend**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

4. **Jalankan Backend** (Terminal 1)
```bash
cd backend
python main.py
```
Backend akan berjalan di: `http://localhost:8000`

5. **Jalankan Frontend** (Terminal 2)
```bash
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173` (atau port lain jika 5173 sedang digunakan)

6. **Buka Browser**
```
http://localhost:5173
```

📘 **Lihat [RUNNING.md](./RUNNING.md) untuk panduan lengkap**

---

## 📁 Struktur Proyek

```
education-algoritma/
├── backend/                      # FastAPI Backend
│   ├── algorithms/              # Implementasi algoritma
│   │   ├── sorting.py          # Algoritma sorting
│   │   ├── search.py           # Algoritma pencarian
│   │   ├── graph.py            # BFS & DFS
│   │   ├── dp.py               # Dynamic Programming
│   │   ├── greedy.py           # Greedy algorithms
│   │   ├── mst.py              # Minimum Spanning Tree
│   │   └── divide_conquer.py   # Divide & Conquer
│   ├── models/                  # Pydantic models
│   ├── utils/                   # Helper functions
│   ├── main.py                  # FastAPI entry point
│   └── requirements.txt         # Python dependencies
│
├── src/                         # React Frontend
│   ├── components/
│   │   ├── Common/             # Reusable components
│   │   │   ├── PlaybackControls.jsx  # Universal playback controls
│   │   │   ├── GenericStepsList.jsx  # Generic steps display
│   │   │   ├── DPStepsList.jsx       # DP-specific steps
│   │   │   └── StatsPanel.jsx        # Statistics panel
│   │   ├── Layout/             # Layout components (Navbar, Footer)
│   │   └── Visualizations/     # Algorithm visualizations
│   │       ├── BruteForce/
│   │       ├── Sorting/
│   │       ├── BFS/            # Breadth-First Search
│   │       ├── DFS/            # Depth-First Search
│   │       ├── Greedy/
│   │       ├── DP/             # Dynamic Programming with Dungeon Maze
│   │       └── MST/            # Minimum Spanning Tree
│   ├── context/                # React Context (Theme, Speed)
│   ├── hooks/                  # Custom hooks
│   ├── pages/                  # Page components
│   │   ├── Home.jsx           # Landing page
│   │   ├── AlgorithmDetail.jsx # Algorithm visualization page
│   │   └── Quiz.jsx           # Quiz page
│   ├── utils/                  # Helper functions & data
│   │   ├── quizData.js        # Quiz questions
│   │   └── ...
│   ├── App.jsx                 # Main App component
│   └── main.jsx                # Entry point
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Node dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── README.md                    # This file
```

---

## 🎮 Cara Menggunakan

### 1. Eksplorasi Algoritma
1. Pilih algoritma dari halaman beranda
2. Klik **MULAI** untuk memulai visualisasi
3. Gunakan **PlaybackControls** untuk kontrol penuh:
   - ▶️ **PLAY** - Jalankan animasi otomatis
   - ⏸️ **PAUSE** - Jeda animasi
   - ⏮️ **PREV** - Kembali ke step sebelumnya
   - ⏭️ **NEXT** - Lanjut ke step berikutnya
   - 🔄 **RESET** - Mulai dari awal
4. Atur kecepatan dengan slider **Kecepatan** (Lambat - Kilat)
5. Toggle antara **Step-by-Step** dan **List All Steps** mode
6. Amati setiap langkah dengan indikator visual dan penjelasan detail

### 2. Ikuti Kuis
1. Klik tombol **KUIS** di navbar
2. Pilih level kesulitan (Mudah, Sedang, Sulit)
3. Jawab pertanyaan dalam 30 detik
4. Dapatkan poin bonus untuk jawaban cepat
5. Bangun streak untuk multiplier poin

### 3. Dark Mode
- Klik ikon ☾/☀ di navbar untuk toggle dark mode

---

## 🎨 Desain System

### Brutalism Design Style
AlgoViz menggunakan desain brutalism dengan karakteristik:
- **Bold Typography** - Font tebal dan uppercase
- **High Contrast** - Kontras warna yang kuat
- **Thick Borders** - Border tebal (3-4px)
- **Flat Colors** - Warna solid tanpa gradient (kecuali CTA)
- **Shadow Effects** - Shadow brutal untuk depth

### Color Palette
```css
Primary:   #2563eb (Blue)
Success:   #10b981 (Green)
Warning:   #f59e0b (Orange)
Danger:    #ef4444 (Red)
Secondary: #6b7280 (Gray)
Cyan:      #06b6d4 (Cyan)
Purple:    #8b5cf6 (Purple)
```

---

## 📚 Dokumentasi

- 📘 [RUNNING.md](./RUNNING.md) - Panduan menjalankan aplikasi
- 🎨 [BRUTALISM-STYLE-GUIDE.md](./BRUTALISM-STYLE-GUIDE.md) - Panduan desain brutalism
- 🔧 [BACKEND-PLAN.md](./BACKEND-PLAN.md) - Dokumentasi backend
- 🎭 [VISUALIZATION-DESIGN.md](./VISUALIZATION-DESIGN.md) - Desain visualisasi

---

## 🔌 API Endpoints

Backend menyediakan REST API untuk semua algoritma:

### Sorting
```
POST /api/algorithms/sorting
Body: { "algorithm": "bubble", "array": [5,3,8,2,7] }
```

### Search
```
POST /api/algorithms/search
Body: { "algorithm": "brute_force", "array": [5,3,8,2,7], "target": 8 }
```

### Graph (BFS/DFS)
```
POST /api/algorithms/graph/bfs
Body: { "nodes": [...], "edges": [...], "start": "A" }
```

### Greedy
```
POST /api/algorithms/greedy/coin-change
Body: { "amount": 63, "coins": [1,5,10,25] }
```

### Dynamic Programming
```
POST /api/algorithms/dp/knapsack
Body: { 
  "weights": [4,3,2,5,1], 
  "values": [500,400,150,100,50], 
  "capacity": 10 
}

Response: {
  "steps": [...],  // Step-by-step solving process
  "selected_items": [...],  // Optimal items selected
  "total_value": 1000,
  "total_weight": 9
}
```

**Scenarios Available:**
- Traveling (Nyusun Tas)
- Treasure Hunt (Cari Harta)
- Shopping (Belanja Hemat)
- **Dungeon Maze** (Cari Jalur Terbaik) - Grid-based pathfinding with max coin collection

📄 **Full API Documentation**: http://localhost:8000/docs

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
npm run test
```

### E2E Testing
```bash
npm run test:e2e
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Guidelines
- Ikuti style guide yang ada
- Tulis commit message yang jelas
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika diperlukan

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Farras**

---

## 🙏 Acknowledgments

- Heroicons untuk icon library
- Framer Motion untuk animation library
- TailwindCSS untuk styling framework
- FastAPI untuk backend framework
- React & Vite team

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Buka [Issues](../../issues)
2. Cek [Discussions](../../discussions)
3. Baca [FAQ](#-faq)

---

## 🆕 Latest Updates

### Version 1.2 (December 2024)
- ✅ **PlaybackControls Component** - Universal playback controls across all algorithms
- ✅ **Dungeon Maze Visualization** - Interactive grid-based DP pathfinding
- ✅ **MST Node Names** - Display actual city names instead of IDs
- ✅ **Improved View Modes** - Better Step-by-Step and List view toggle
- ✅ **Speed Control Labels** - Visual labels (Lambat, Sedang, Cepat, Kilat)
- ✅ **Consistent UI/UX** - Unified controls and styling across all visualizations

### Version 1.1 (November 2024)
- ✅ BFS & DFS implementation with unified visualization
- ✅ Enhanced graph traversal with city/location themes
- ✅ MST algorithms with Kruskal's and Prim's visualization

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic algorithm visualizations
- ✅ BFS & DFS implementation
- ✅ Quiz system
- ✅ Dark mode support
- ✅ PlaybackControls for all algorithms
- ✅ Dungeon Maze for DP visualization
- ✅ Multiple scenarios for each algorithm

### Version 2.0 (Planned)
- [ ] More algorithms (A*, Dijkstra, Floyd-Warshall)
- [ ] User authentication
- [ ] Save progress & bookmarks
- [ ] Leaderboard system
- [ ] Code playground
- [ ] Export visualization as video/GIF
- [ ] Multi-language support

---

## ❓ FAQ

### Q: Bagaimana cara menambah algoritma baru?
**A:** 
1. Tambahkan implementasi di `backend/algorithms/`
2. Buat komponen visualisasi di `src/components/Visualizations/`
3. Gunakan `PlaybackControls` component untuk konsistensi
4. Tambahkan view mode toggle (Step-by-Step & List)
5. Update routing di `AlgorithmDetail.jsx`
6. Tambahkan card di `Home.jsx`

### Q: Bagaimana cara menggunakan PlaybackControls?
**A:** PlaybackControls adalah komponen reusable yang menyediakan:
- Play/Pause toggle
- Reset button
- Next/Previous step navigation
- Automatic disable saat animasi selesai

Import dan gunakan seperti ini:
```jsx
import PlaybackControls from '../../Common/PlaybackControls'

<PlaybackControls
  isPlaying={isPlaying}
  onPlay={handlePlay}
  onPause={handlePause}
  onReset={handleReset}
  onStepForward={handleStepForward}
  onStepBackward={handleStepBackward}
  disabled={isComplete}
/>
```

### Q: Kenapa visualisasi lambat?
**A:** Atur kecepatan menggunakan slider kecepatan di setiap halaman algoritma.

### Q: Bagaimana cara menambah pertanyaan kuis?
**A:** Edit file `src/utils/quizData.js` dan tambahkan pertanyaan di level yang sesuai.

### Q: API tidak bisa diakses dari frontend?
**A:** Pastikan backend berjalan di port 8000 dan CORS sudah dikonfigurasi dengan benar di `backend/main.py`.

---

<div align="center">

**Made with ❤️ for Computer Science Education**

⭐ Star this repo if you find it helpful!

</div>
