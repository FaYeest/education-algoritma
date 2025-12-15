# 🎮 ALGORITMA VISUALIZATIONS - Panduan Lengkap

## 📖 Daftar Isi
1. [Brute Force Search](#1-brute-force-search)
2. [Divide & Conquer (Binary Search)](#2-divide--conquer-binary-search)
3. [Sorting Algorithms](#3-sorting-algorithms)
4. [BFS - Maze Solver](#4-bfs---maze-solver)
5. [DFS - Maze Explorer](#5-dfs---maze-explorer)
6. [Greedy - Coin Change](#6-greedy---coin-change)
7. [Dynamic Programming - Knapsack](#7-dynamic-programming---knapsack)
8. [MST - City Network](#8-mst---city-network)

---

## 1. 🔍 BRUTE FORCE SEARCH

### Konsep
**Brute Force** adalah metode pencarian paling sederhana yang memeriksa setiap elemen satu per satu secara berurutan hingga menemukan target atau sampai akhir array.

### Cara Main
1. **Input**: Array angka acak dan target yang dicari
2. **Goal**: Temukan posisi index target dalam array
3. **Controls**:
   - MULAI - Jalankan pencarian
   - PAUSE - Jeda visualisasi
   - RESET - Ulang dari awal
   - Slider Kecepatan (1x - 10x)

### Visualisasi
- 🔵 **BIRU** = Elemen sedang diperiksa
- 🟢 **HIJAU** = Target ditemukan!
- ⚪ **ABU-ABU** = Belum diperiksa
- ⚫ **HITAM** = Sudah diperiksa (bukan target)

### Penjelasan Step-by-Step
1. Mulai dari index 0
2. Bandingkan elemen dengan target
3. Jika sama → KETEMU! ✅
4. Jika beda → Lanjut ke index berikutnya
5. Ulangi sampai ketemu atau array habis

### Complexity
- **Time**: O(n) - Worst case harus cek semua elemen
- **Space**: O(1) - Hanya butuh variabel counter

### Kapan Digunakan?
- Array tidak terurut
- Data kecil
- Implementasi sederhana
- Tidak ada info tambahan tentang data

### Tips Belajar
⚠️ Brute Force = LAMBAT tapi PASTI!
- Cocok untuk data kecil
- Baseline untuk compare dengan algoritma lain
- Always works, tapi tidak efisien

---

## 2. ✂️ DIVIDE & CONQUER (Binary Search)

### Konsep
**Divide & Conquer** membagi masalah besar jadi masalah kecil. Binary Search membagi array jadi 2 bagian, pilih sisi yang mungkin ada target, repeat!

### Cara Main
1. **Input**: Array terurut dan target
2. **Goal**: Temukan target dengan minimal perbandingan
3. **Controls**: Play, Pause, Reset, Speed slider

### Visualisasi
- 🟦 **BIRU** = Range aktif (left-right)
- 🟨 **KUNING** = Mid (titik tengah)
- 🟢 **HIJAU** = Target ditemukan!
- ⬛ **HITAM** = Diabaikan (tidak mungkin)

### Penjelasan Step-by-Step
1. **Inisialisasi**: left = 0, right = array.length - 1
2. **Cari mid**: mid = (left + right) / 2
3. **Bandingkan**:
   - array[mid] == target → KETEMU! ✅
   - array[mid] < target → Cari kanan (left = mid + 1)
   - array[mid] > target → Cari kiri (right = mid - 1)
4. **Repeat** sampai ketemu atau left > right

### Complexity
- **Time**: O(log n) - Setiap step potong separuh!
- **Space**: O(1) iterative, O(log n) recursive

### Kapan Digunakan?
✅ **HARUS terurut!**
- Database dengan index
- Dictionary / phonebook
- Search in sorted data
- Git bisect

### Perbandingan dengan Brute Force
| Aspek | Brute Force | Binary Search |
|-------|-------------|---------------|
| Array | Any | Sorted only ✅ |
| Speed | O(n) 🐌 | O(log n) 🚀 |
| Steps (1000 items) | ~1000 | ~10 |

### Tips Belajar
💡 Binary Search = DIVIDE array jadi 2!
- Jauh lebih cepat dari Brute Force
- Tapi HARUS sorted dulu
- Prinsip: "Buang separuh yang salah"

---

## 3. 📊 SORTING ALGORITHMS

### Konsep
Mengurutkan array dari kecil ke besar (ascending) atau besar ke kecil (descending).

### Algoritma Tersedia
1. **Bubble Sort** - Tukar elemen bersebelahan
2. **Selection Sort** - Pilih terkecil, letakkan di depan
3. **Insertion Sort** - Sisipkan ke posisi yang benar
4. **Merge Sort** - Divide, sort, merge
5. **Quick Sort** - Pilih pivot, partition

### Cara Main
1. Pilih algoritma sorting
2. Generate array acak atau custom
3. Klik PLAY
4. Amati perbandingan & pertukaran

### Visualisasi
- 🟦 **CYAN** = Belum diproses
- 🟡 **KUNING** = Sedang dibandingkan
- 🔴 **MERAH** = Sedang ditukar
- 🟢 **HIJAU** = Sudah terurut

### Stats yang Ditampilkan
- **Langkah**: Total step yang dilakukan
- **Perbandingan**: Jumlah compare
- **Pertukaran**: Jumlah swap
- **Progress**: Persentase completion

### Perbandingan Sorting
| Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space |
|-----------|-------------|------------|--------------|-------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) |
| Selection | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion | O(n) | O(n²) | O(n²) | O(1) |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) |

### Kapan Menggunakan?
- **Bubble**: Teaching, small data
- **Selection**: Memory terbatas
- **Insertion**: Nearly sorted data
- **Merge**: Stability penting
- **Quick**: General purpose (fastest avg)

### Tips Belajar
🎯 Compare algoritma! Lihat:
- Speed: Quick & Merge fastest
- Swaps: Selection minimal swap
- Stability: Merge & Insertion stable

---

## 4. 🌊 BFS - MAZE SOLVER

### Konsep
**Breadth-First Search** adalah algoritma graph traversal yang explore **level per level**. BFS menjamin path terpendek dalam unweighted graph!

### Skenario Game: Maze Solver
🎯 **Tujuan**: Temukan jalan TERCEPAT dari START ke GOAL dalam labirin!

### Cara Main
1. **Pilih Level**:
   - 🟢 MUDAH (5x5)
   - 🟡 SEDANG (7x7)
   - 🔴 SULIT (9x9)

2. **Klik MULAI** untuk jalankan BFS
3. **Amati**:
   - Bagaimana BFS explore level per level
   - Queue (antrian) FIFO
   - Path terpendek yang ditemukan

### Visualisasi
- 🟦 **BIRU** = START (posisi awal)
- 🟨 **KUNING** = GOAL (tujuan)
- ⬛ **HITAM** = Tembok (tidak bisa lewat)
- 🔵 **BIRU MUDA** = Dalam Queue (menunggu)
- ⚪ **ABU-ABU** = Visited (sudah dikunjungi)
- 🟢 **HIJAU** = Path terpendek! ✅

### Cara Kerja BFS
1. **Init**: Masukkan START ke queue
2. **Loop**:
   - Ambil node dari DEPAN queue (FIFO)
   - Cek apakah GOAL → Kalau ya, SELESAI! 🎉
   - Explore tetangga (atas, bawah, kiri, kanan)
   - Tambahkan tetangga yang belum visited ke queue
3. **Repeat** sampai ketemu GOAL atau queue kosong

### Stats
- **Sel Dikunjungi**: Jumlah cell yang di-explore
- **Panjang Path**: Jumlah langkah dari START ke GOAL
- **Efisiensi**: Path length / Cells visited × 100%

### Keunggulan BFS
✅ **Menjamin path terpendek** (unweighted)
✅ Systematic exploration (level by level)
✅ Cocok untuk shortest path problem

### Kekurangan BFS
❌ Memory intensive (simpan semua nodes di level)
❌ Tidak efisien untuk graph sangat besar

### Use Cases Real World
- 🌐 **Web Crawling**: Crawl website level per level
- 📱 **Social Network**: "People you may know" (degree of separation)
- 🗺️ **GPS Navigation**: Shortest route (unweighted roads)
- 🎮 **Game AI**: Pathfinding untuk NPC

### Tips Belajar
💡 **BFS = Explore LEBAR dulu!**
- Queue (FIFO) = antrian supermarket
- Level by level = lapisan bawang
- Shortest path GUARANTEED!

---

## 5. 🌊 DFS - MAZE EXPLORER

### Konsep
**Depth-First Search** adalah algoritma graph traversal yang explore **sedalam mungkin** sebelum backtrack!

### Skenario Game: Maze Explorer
🎯 **Tujuan**: Explore maze sedalam mungkin, temukan GOAL!

### Cara Main
1. **Pilih Level**: Mudah, Sedang, Sulit
2. **Klik MULAI** untuk jalankan DFS
3. **Amati**:
   - DFS dive deep dulu
   - Backtrack saat mentok
   - Path yang ditemukan (TIDAK SELALU TERPENDEK!)

### Visualisasi
- 🟦 **BIRU** = START
- 🟨 **KUNING** = GOAL
- ⬛ **HITAM** = Tembok
- 🟣 **UNGU** = Dalam Stack (menunggu)
- 🔴 **MERAH** = Backtracking! (mundur)
- 🟢 **HIJAU** = Path yang ditemukan

### Cara Kerja DFS
1. **Init**: Push START ke stack
2. **Loop**:
   - Pop node dari ATAS stack (LIFO)
   - Cek apakah GOAL → Kalau ya, SELESAI!
   - Explore tetangga
   - Push tetangga yang belum visited ke stack
   - Kalau mentok → BACKTRACK!
3. **Repeat** sampai ketemu GOAL atau stack kosong

### Stats
- **Sel Dikunjungi**: Total cells explored
- **Depth Level**: Kedalaman pencarian
- **Backtrack**: Berapa kali mundur
- **Path Length**: Panjang path (bisa lebih panjang dari BFS!)

### Perbandingan BFS vs DFS

| Aspek | BFS | DFS |
|-------|-----|-----|
| Data Structure | Queue (FIFO) | Stack (LIFO) |
| Strategy | Level by level | Deep first |
| Path | Shortest ✅ | Not always |
| Memory | Higher | Lower |
| Backtrack | No | Yes ✅ |
| Complete | Yes | Yes (finite graph) |

### Use Cases Real World
- 🧩 **Maze Solving**: Explore all paths
- 🎮 **Game Tree**: Chess, checkers
- 🔍 **Topological Sort**: Task scheduling
- 🕸️ **Web Scraping**: Deep crawl
- 📁 **File System**: Directory traversal

### Kapan Pakai DFS?
✅ Memory terbatas
✅ Explore semua possibilities
✅ Backtracking problem
✅ Detect cycles

### Kapan Pakai BFS?
✅ Shortest path needed
✅ Level-based exploration
✅ Memory cukup

### Tips Belajar
🎯 **DFS = Explore DALAM dulu!**
- Stack (LIFO) = tumpukan piring
- Deep dive lalu backtrack
- Path TIDAK GUARANTEED terpendek!

---

## 6. 💰 GREEDY - COIN CHANGE

### Konsep
**Greedy Algorithm** membuat pilihan terbaik di setiap langkah tanpa memikirkan future consequences. "Be greedy NOW!"

### Skenario Game: Coin Change Problem
🎯 **Tujuan**: Kembalikan uang dengan MINIMAL jumlah koin!

### Cara Main
1. **Pilih Skenario**:
   - 🇮🇩 Rupiah (Rp100, Rp500, Rp1000, Rp2000)
   - 🇺🇸 USD ($1, $5, $10, $25)
   - 🇪🇺 EURO (€1, €2, €5, €10)

2. **Input Jumlah**: Masukkan jumlah yang mau dikembalikan
3. **Klik MULAI**: Lihat Greedy Algorithm bekerja!

### Visualisasi
- 🪙 **Koin Card** dengan nilai & gambar
- 🟢 **HIJAU** = Koin terpilih (used)
- 🔵 **BIRU** = Koin sedang dicek
- ⚪ **ABU-ABU** = Koin tidak dipakai

### Cara Kerja Greedy Coin Change
1. **Sort** koin dari terbesar ke terkecil
2. **Loop**:
   - Ambil koin terbesar yang ≤ sisa
   - Gunakan koin sebanyak mungkin
   - Update sisa
3. **Repeat** sampai sisa = 0

### Example: Kembalian Rp 1700
```
Koin: [2000, 1000, 500, 100]
Step 1: 2000 > 1700 → SKIP
Step 2: 1000 ≤ 1700 → AMBIL 1x → Sisa: 700
Step 3: 1000 > 700 → SKIP
Step 4: 500 ≤ 700 → AMBIL 1x → Sisa: 200
Step 5: 500 > 200 → SKIP
Step 6: 100 ≤ 200 → AMBIL 2x → Sisa: 0
SELESAI! Total: 4 koin (1×Rp1000 + 1×Rp500 + 2×Rp100)
```

### Stats
- **Total Koin**: Jumlah koin digunakan
- **Total Nilai**: Nilai yang dikembalikan
- **Sisa**: Uang yang belum dikembalikan
- **Efficiency**: Semakin sedikit koin = semakin baik!

### Kapan Greedy Optimal?
✅ **Canonical coin system** (Rupiah, USD, Euro)
- Greedy ALWAYS optimal!

❌ **Non-canonical system**
- Example: [1, 3, 4] untuk target 6
  - Greedy: 4 + 1 + 1 = 3 koin
  - Optimal: 3 + 3 = 2 koin ❌
- Butuh Dynamic Programming!

### Use Cases Greedy
- 💵 **Change Making**: ATM, kasir
- 📦 **Fractional Knapsack**: Bisa potong item
- 🚦 **Activity Selection**: Schedule meetings
- 🌳 **Huffman Coding**: Kompresi data
- 📡 **MST**: Kruskal & Prim algorithm

### Complexity
- **Time**: O(n) - n = jumlah denominasi koin
- **Space**: O(1) - Hanya counter

### Tips Belajar
🎯 **Greedy = Pilih TERBAIK sekarang!**
- Fast & simple
- Tidak always optimal
- Best for canonical coin systems

---

## 7. 🎒 DYNAMIC PROGRAMMING - KNAPSACK

### Konsep
**Dynamic Programming** memecah masalah jadi sub-problems, simpan hasilnya (memoization), dan build solution dari bawah ke atas!

### Skenario Game: 0/1 Knapsack - "Nyusun Tas"
🎯 **Tujuan**: Maksimalkan nilai barang dalam tas dengan kapasitas terbatas!

### Cara Main
1. **Pilih Skenario**:
   - 🎒 **TRAVELING**: Nyusun tas travel (Laptop, Kamera, Buku)
   - 💰 **TREASURE HUNT**: Cari harta (Emas, Berlian, Ruby)
   - 🛍️ **SHOPPING**: Belanja hemat (Smartphone, Headphone)

2. **Klik MULAI**: Lihat DP table dibangun step by step
3. **Amati**:
   - Tabel DP terisi
   - Decision: Include or Exclude?
   - Backtrack untuk cari solusi

### Visualisasi
- 📊 **DP Table**: Baris = Item, Kolom = Kapasitas
- 🟢 **HIJAU** = Item dimasukkan (include)
- 🟡 **KUNING** = Item dilewati (exclude)
- 🔴 **MERAH** = Terlalu berat (skip)
- 🔙 **Backtrack**: Cari item mana yang optimal

### Cara Kerja 0/1 Knapsack

#### Step 1: Build DP Table
```
dp[i][w] = nilai maksimal dengan i item & kapasitas w
```

#### Step 2: Decision for Each Item
```javascript
if (item.weight > w) {
  // Terlalu berat, skip
  dp[i][w] = dp[i-1][w]
} else {
  // Pilih max: include vs exclude
  include = dp[i-1][w - item.weight] + item.value
  exclude = dp[i-1][w]
  dp[i][w] = Math.max(include, exclude)
}
```

#### Step 3: Backtrack
Trace dari `dp[n][W]` ke `dp[0][0]` untuk cari item mana yang diambil.

### Example: Traveling Scenario
```
Kapasitas Tas: 10kg

Items:
- 💻 Laptop: 4kg, $500
- 📷 Kamera: 3kg, $400
- 📚 Buku: 2kg, $150
- 👕 Pakaian: 5kg, $100
- 🍪 Snack: 1kg, $50

Solusi Optimal:
✅ Laptop (4kg, $500)
✅ Kamera (3kg, $400)
✅ Buku (2kg, $150)
✅ Snack (1kg, $50)
Total: 10kg, $1100 🎉
```

### DP Table Visualization
```
      0kg  1kg  2kg  3kg  4kg  5kg  ...  10kg
∅      $0   $0   $0   $0   $0   $0  ...   $0
💻     $0   $0   $0   $0 $500 $500  ... $500
📷     $0   $0   $0 $400 $500 $500  ... $900
📚     $0   $0 $150 $400 $500 $550  ...$1050
👕     $0   $0 $150 $400 $500 $550  ...$1050
🍪     $0  $50 $150 $400 $500 $550  ...$1100
```

### Stats
- **Item Terpilih**: Jumlah barang
- **Total Berat**: Berat dalam tas
- **Total Nilai**: Nilai maksimal achieved
- **Efisiensi**: Nilai/Berat ratio

### Complexity
- **Time**: O(n × W) - n items, W capacity
- **Space**: O(n × W) - DP table

### Kapan Pakai DP?
✅ **Optimal substructure**: Solusi optimal dari subproblems
✅ **Overlapping subproblems**: Subproblem sama dihitung berkali-kali
✅ **0/1 constraint**: Tidak bisa potong item

### Use Cases DP
- 🎒 **Knapsack**: Resource allocation
- 🧬 **LCS**: DNA sequence alignment
- 💰 **Coin Change**: Minimal coins (non-greedy)
- 📈 **Stock Trading**: Max profit
- 🎮 **Game Theory**: Optimal strategy

### DP vs Greedy

| Aspek | Greedy | DP |
|-------|--------|-----|
| Strategy | Local best | Global best ✅ |
| Optimal | Sometimes | Always ✅ |
| Time | Faster | Slower |
| Memory | O(1) | O(n×W) |
| Use Case | Simple problems | Complex optimization |

### Tips Belajar
💡 **DP = Simpan hasil, pakai lagi!**
- Memoization = ingat jawaban
- Bottom-up = bangun dari kecil
- Include vs Exclude decision
- Always optimal!

---

## 8. 🌆 MST - CITY NETWORK

### Konsep
**Minimum Spanning Tree** adalah tree yang menghubungkan semua node dengan total weight minimal. MST untuk optimasi jaringan!

### Skenario Game: Build City Network
🎯 **Tujuan**: Hubungkan semua kota dengan biaya TERMURAH!

### Cara Main
1. **Pilih Skenario**:
   - 🌐 **INTERNET**: Pasang Fiber Optik antar kota
   - ⚡ **LISTRIK**: Bangun jaringan PLN
   - 🛣️ **JALAN TOL**: Koneksi antar kota

2. **Pilih Algoritma**:
   - 🌳 **Kruskal**: Sort edges, ambil termurah (greedy)
   - 🌱 **Prim**: Grow tree dari 1 node

3. **Klik MULAI**: Lihat MST dibangun step by step!

### Visualisasi
- 🏙️ **Nodes**: Kota dengan emoji icon
- 🔗 **Edges**: Koneksi dengan biaya
- 🟢 **HIJAU**: Edge masuk MST ✅
- 🔴 **MERAH**: Edge ditolak (bikin cycle)
- 🔵 **BIRU**: Edge sedang dicek
- ⚪ **ABU-ABU**: Belum diproses

### Kruskal's Algorithm

#### Cara Kerja
1. **Sort** semua edges by weight (ascending)
2. **Loop** setiap edge:
   - Cek apakah bikin cycle (Union-Find)
   - Kalau TIDAK cycle → TAMBAH ke MST ✅
   - Kalau cycle → TOLAK ❌
3. **Repeat** sampai (n-1) edges (n = jumlah nodes)

#### Example: Internet Fiber
```
Edges (sorted):
1. B-E: Rp3 Juta
2. C-D: Rp3 Juta
3. A-B: Rp4 Juta
4. C-F: Rp4 Juta
5. B-D: Rp5 Juta
6. A-D: Rp6 Juta
...

Steps:
✅ Tambah B-E (Rp3) - No cycle
✅ Tambah C-D (Rp3) - No cycle
✅ Tambah A-B (Rp4) - No cycle
✅ Tambah C-F (Rp4) - No cycle
❌ Tolak B-D (Rp5) - Bikin cycle! (B & D sudah terhubung via A)
...

Total: Rp20 Juta (5 edges untuk 6 kota)
```

### Prim's Algorithm

#### Cara Kerja
1. **Start** dari node random
2. **Loop**:
   - Cari edge termurah connecting visited ↔ unvisited
   - Tambah edge & node baru ke MST
   - Update visited set
3. **Repeat** sampai semua nodes terhubung

#### Example: Power Grid
```
Start: A

Step 1: A visited
  Edges: A-B(Rp10), A-C(Rp6), A-F(Rp5)
  ✅ Pilih A-F (Rp5) - Termurah!

Step 2: A, F visited
  Edges: A-B(Rp10), A-C(Rp6), F-E(Rp7), F-C(Rp6)
  ✅ Pilih A-C atau F-C (Rp6) - Sama murah, pilih salah satu

...

Total: Rp25 Miliar
```

### Stats
- **Total Biaya**: Cost untuk bangun jaringan
- **Edge Terpilih**: Jumlah koneksi
- **Kota Terhubung**: Semua node connected

### Perbandingan Kruskal vs Prim

| Aspek | Kruskal | Prim |
|-------|---------|------|
| Strategy | Sort edges, pick cheap | Grow tree from node |
| Data Structure | Union-Find | Priority Queue |
| Best For | Sparse graph | Dense graph |
| Time | O(E log E) | O(E log V) |
| Implementation | Easier | Bit harder |

### Use Cases MST
- 🌐 **Network Design**: Internet, roads, electricity
- 📡 **Telecom**: Minimize cable cost
- 🏗️ **Construction**: Minimize pipeline cost
- 🚰 **Water Supply**: Connect cities cheaply
- 🛰️ **Satellite**: Minimize signal relay

### Properties MST
- **Unique?** Not always (kalau ada edge dengan weight sama)
- **Edges?** Always (V - 1) edges untuk V nodes
- **Cycle?** Never! (Tree ga boleh ada cycle)
- **Connected?** Always (spanning = cover all nodes)

### Complexity
- **Kruskal**: O(E log E) - Sort dominates
- **Prim**: O(E log V) - Priority queue

### Tips Belajar
🌳 **MST = Tree termurah yang connect semua!**
- Kruskal = Sort & pick cheap
- Prim = Grow tree from node
- No cycles allowed!
- Always (n-1) edges

---

## 🎓 Tips Umum Belajar Algoritma

### 1. Mulai dari Visualisasi
👀 Lihat dulu cara kerja algoritma secara visual sebelum lihat kode.

### 2. Pahami Complexity
⏱️ Time & Space complexity penting untuk pilih algoritma yang tepat.

### 3. Practice Makes Perfect
💪 Coba berbagai input: best case, average case, worst case.

### 4. Compare Algorithms
⚖️ Bandingkan algoritma untuk masalah sama (e.g., BFS vs DFS, Kruskal vs Prim).

### 5. Relate to Real World
🌍 Cari use case real world untuk setiap algoritma.

### 6. Code After Understand
💻 Tulis kode setelah paham konsep visualnya.

### 7. Test Edge Cases
🧪 Test dengan input ekstrim: empty, single element, duplicate, large.

### 8. Review Regularly
📚 Review algoritma yang sudah dipelajari secara berkala.

---

## 📚 Resources Tambahan

### Books
- **Introduction to Algorithms** - Cormen, Leiserson, Rivest, Stein
- **Algorithm Design** - Kleinberg, Tardos
- **Grokking Algorithms** - Aditya Bhargava

### Online
- [Visualgo](https://visualgo.net/)
- [Algorithm Visualizer](https://algorithm-visualizer.org/)
- [GeeksforGeeks](https://www.geeksforgeeks.org/)
- [LeetCode](https://leetcode.com/)

### YouTube Channels
- **Abdul Bari**
- **MyCodeSchool**
- **MIT OpenCourseWare**
- **freeCodeCamp**

---

## 🎯 Quick Reference Table

| Algorithm | Type | Time | Space | Best For |
|-----------|------|------|-------|----------|
| Brute Force | Search | O(n) | O(1) | Small data, any order |
| Binary Search | Search | O(log n) | O(1) | Sorted data |
| Bubble Sort | Sort | O(n²) | O(1) | Teaching, small data |
| Merge Sort | Sort | O(n log n) | O(n) | Stable sort needed |
| Quick Sort | Sort | O(n log n) avg | O(log n) | General sorting |
| BFS | Graph | O(V+E) | O(V) | Shortest path (unweighted) |
| DFS | Graph | O(V+E) | O(V) | Backtracking, topology |
| Greedy | Optimization | O(n) | O(1) | Local optimal = global |
| DP | Optimization | O(n×m) | O(n×m) | Overlapping subproblems |
| Kruskal MST | Graph | O(E log E) | O(V) | Sparse graph |
| Prim MST | Graph | O(E log V) | O(V) | Dense graph |

---

## ❓ FAQ

### Q: Algoritma mana yang harus dipelajari dulu?
**A:** Urutan rekomendasi:
1. Brute Force (paling simple)
2. Binary Search (divide & conquer)
3. Sorting (Bubble → Merge → Quick)
4. BFS & DFS (graph basics)
5. Greedy (optimization intro)
6. DP (advanced optimization)
7. MST (graph optimization)

### Q: Kenapa harus belajar Brute Force kalau lambat?
**A:** 
- Baseline untuk compare
- Simple & always works
- Understanding problem dulu
- Interview question (optimize later)

### Q: Kapan pakai BFS vs DFS?
**A:**
- **BFS**: Shortest path, level-order, memory OK
- **DFS**: Backtracking, topological sort, memory limited

### Q: Greedy vs DP, mana yang lebih baik?
**A:**
- **Greedy**: Faster, simpler, tapi tidak always optimal
- **DP**: Always optimal, tapi slower & more memory

### Q: Kruskal vs Prim untuk MST?
**A:**
- **Kruskal**: Easier, better for sparse graphs
- **Prim**: Better for dense graphs

---

<div align="center">

**Happy Learning! 🚀**

*Made with ❤️ for Computer Science Education*

</div>
