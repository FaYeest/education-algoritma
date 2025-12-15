# Visualisasi Algoritma — Catatan Project

Dokumen ini berisi ringkasan ide visualisasi untuk setiap algoritma yang akan digunakan dalam website edukasi berbasis React.

---

## 1. **Brute Force — "Try Everything Simulator"**
**Konsep:**
- Menampilkan grid atau array.
- Highlight elemen satu per satu secara berurutan.
- Warna berubah untuk menunjukkan elemen yang sedang dicek.
- Counter: "Step X".

**Interaktif:**
- Atur target.
- Atur kecepatan visualisasi.
- Randomisasi data.

---

## 2. **Divide & Conquer — "Algo-Splitter"**
**Konsep:**
- Array dipecah menjadi dua bagian.
- Animasikan proses "split" dan "merge".
- Tampilkan pohon rekursi (opsional).

**Interaktif:**
- Tombol untuk melihat langkah combine.
- Visualisasi tree rekursi.

---

## 3. **Greedy Algorithm — "Pick What's Best Now"**
**Kasus Umum:**
- Coin Change.
- Activity Selection.

**Konsep Visual:**
- Koin terbesar glowing.
- Timeline event dengan highlight event terpilih.

**Interaktif:**
- Input nominal koin.
- Input event (start–finish).

---

## 4. **Sorting Algorithms — "Sort Arena"**
**Algoritma:** Bubble, Selection, Insertion, Merge, Quick.

**Konsep Visual:**
- Batang bar chart bergerak.
- Quick Sort: pivot glowing.
- Merge Sort: bar turun lalu kembali ke tempat.

**Interaktif:**
- Randomize.
- Speed slider.
- Pilih algoritma.

---

## 5. **BFS — "Wave Explorer"**
**Konsep:**
- Visualisasi graph seperti bubble.
- BFS melebarkan "wave" dari node start.
- Setiap level BFS memiliki warna berbeda.

**Versi Maze:**
- BFS menjalar seperti gelombang di grid.

**Interaktif:**
- Drag node.
- Pilih start node.

---

## 6. **DFS — "Deep Diver"**
**Konsep:**
- DFS merayap ke node terdalam.
- Visualisasi jalur seperti ular.
- Backtracking diberi animasi pulse.

**Versi Maze:**
- Jalur panjang sebelum mundur terlihat jelas.

**Interaktif:**
- Pilih start node.
- Mode stack/rekursi.

---

## 7. Dynamic Programming — "Optimal Substructure Lab"
**Kasus:** Knapsack, Longest Common Subsequence (LCS).

**Konsep Visual:**
- Tabel DP (grid) terisi progresif dengan heatmap intensitas (lebih sering diakses lebih panas).
- Knapsack: highlight pilihan item, jejak keputusan dari dp[i][w] ke dp[i-1][w] atau dp[i-1][w-weight[i]]+value.
- LCS: matriks dengan panah diagonal/atas/kiri; backtrack jalur solusi menyala (glow).

**Interaktif:**
- Toggle memoization vs tabulation.
- Ubah bobot/nilai item atau string input, lihat recompute animasi.
- Step-by-step backtracking untuk rekonstruksi solusi.

---

## 8. Minimum Spanning Tree (MST) — "Network Builder"
**Algoritma:** Kruskal, Prim.

**Konsep Visual:**
- Graph draggable; bobot pada edge terlihat jelas.
- Kruskal: edge disortir; union-find divisualisasikan sebagai cluster bergabung; edge diterima hijau, siklus ditolak merah.
- Prim: frontier mengembang dari node awal; edge bobot minimum berdenyut (pulse) sebelum ditambahkan; total biaya terupdate.

**Interaktif:**
- Pilih algoritma (Kruskal/Prim), pilih start node (Prim).
- Tambah/hapus edge dan ubah bobot secara langsung.
- Tampilkan/sembunyikan status union-find atau priority queue.

## Bonus Fitur Global
- Step-by-step playback.
- Speed control.
- Mode Dark/Light.
- Sidebar penjelasan kompleksitas.
- Tree visualizer untuk algoritma rekursif.

---

**Catatan:**
Dokumen ini menjadi referensi untuk implementasi visualisasi pada aplikasi React dengan TailwindCSS, Konva, D3.js, atau Framer Motion.

