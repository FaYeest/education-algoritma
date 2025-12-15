# Visualization Design Guide - AlgoViz

## Prinsip Desain Visualisasi yang Menarik & Edukatif

### 1. **Progressive Disclosure**
- Tampilkan informasi step-by-step
- Hindari overload informasi di awal
- User control: Play, Pause, Step Forward/Backward, Speed Control

### 2. **Visual Hierarchy**
- **Primary:** Animasi algoritma (area terbesar)
- **Secondary:** Controls & Stats
- **Tertiary:** Penjelasan & Complexity

### 3. **Color Coding Konsisten**
```
🔵 Comparing/Visiting - brutal-secondary (#00D9FF)
🟢 Found/Selected - brutal-success (#00F5A0)
🔴 Rejected/Wrong - brutal-danger (#FF006E)
🟡 Current/Active - brutal-warning (#FFC700)
🟣 Special (Pivot/Key) - brutal-purple (#A855F7)
⚫ Default/Unvisited - border-black
```

---

## Visualisasi Per Kategori

### 🔢 **SORTING (Bubble/Selection/Insertion)**

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Bubble] [Selection] [Insertion]       │
│  ┌─────────────────────────────────┐    │
│  │  ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗        │    │
│  │  ║ 5 ║ ║ 3 ║ ║ 8 ║ ║ 2 ║  ← BAR │    │
│  │  ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝        │    │
│  │     ↑     ↑                      │    │
│  │   comparing indices              │    │
│  └─────────────────────────────────┘    │
│  Comparisons: 10 | Swaps: 5             │
│  [▶ Play] [⏸ Pause] [⏮ Reset] Speed: ━━│
└─────────────────────────────────────────┘
```

**Fitur Edukatif:**
- **Tooltip saat hover bar:** "Index: 2, Value: 8"
- **Highlight swap:** Kedua bar bergerak dengan animasi swap
- **Live stats:** Counter comparisons & swaps
- **Pseudocode panel:** Highlight baris kode yang sedang dieksekusi
- **Time complexity graph:** Show worst/average/best case

**Animasi:**
- Bar tumbuh dari 0 (entrance)
- Comparing: Scale 1.1x + glow effect
- Swapping: Slide horizontal + vertical bounce
- Sorted: Change to green + checkmark icon

---

### 🔍 **SEARCH (Linear/Binary)**

**Linear Search:**
```
┌──────────────────────────────────────┐
│ Target: [8]                          │
│ ┌───┬───┬───┬───┬───┬───┐           │
│ │ 5 │ 3 │ 8 │ 2 │ 7 │ 4 │           │
│ └───┴───┴───┴───┴───┴───┘           │
│   ❌  ❌  ✅                         │
│  Step 3: FOUND at index 2!           │
└──────────────────────────────────────┘
```

**Binary Search:**
```
┌──────────────────────────────────────┐
│ Sorted: [2, 3, 4, 5, 7, 8]           │
│         L       M           R         │
│ ┌───┬───┬───┬───┬───┬───┐           │
│ │ 2 │ 3 │ 4 │ 5 │ 7 │ 8 │           │
│ └───┴───┴───┴───┴───┴───┘           │
│         └─────┘ checking middle      │
│ Target > Mid → Search right half     │
└──────────────────────────────────────┘
```

**Fitur Edukatif:**
- **Speech bubble:** "Checking index 2: 8 == target? YES!"
- **Line pointer:** Left/Mid/Right untuk binary
- **Decision tree:** Show "Go Left" / "Go Right" decisions
- **Comparison counter:** Visual meter

---

### 🌳 **GRAPH (BFS/DFS)**

**Layout:**
```
┌─────────────────────────────────────────┐
│  [BFS] [DFS]                            │
│  ┌─────────────────────────────────┐   │
│  │      (A)──────(B)                │   │
│  │       │ \      │                 │   │
│  │       │   \    │                 │   │
│  │      (C)────(D)                  │   │
│  │                                  │   │
│  │  Visited: [A, B, C]              │   │
│  │  Queue:   [D]                    │   │
│  └─────────────────────────────────┘   │
│  Traversal Order: A → B → C             │
└─────────────────────────────────────────┘
```

**Fitur Edukatif:**
- **Wave animation (BFS):** Level by level expansion
- **Trail animation (DFS):** Path dengan fading trail
- **Queue/Stack visualization:** Sidebar dengan animated add/remove
- **Node states:**
  - Unvisited: Gray border
  - Visiting: Yellow glow + pulse
  - Visited: Green fill
- **Edge highlight:** Active edge thicker + animated
- **Live data structures:** Show queue/stack contents

**BFS - Wave Effect:**
```
Level 0: ⬤ A (start)
Level 1: ⬤ B, ⬤ C (wave expands)
Level 2: ⬤ D (wave continues)
```

**DFS - Path Tracing:**
```
A → B → D (deep dive)
      ↓ backtrack
    C (explore alternative)
```

---

### 💎 **DYNAMIC PROGRAMMING**

**Knapsack - DP Table:**
```
┌────────────────────────────────────────┐
│  Items: [w:3,v:4] [w:4,v:5] [w:7,v:10] │
│  Capacity: 10                           │
│                                         │
│     W →  0  1  2  3  4  5  6  7  8  9 10│
│  i↓ ┌───┬───┬───┬───┬───┬───┬───┬───┐  │
│  0  │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │  │
│  1  │ 0 │ 0 │ 0 │ 4 │ 4 │ 4 │ 4 │ 4 │  │
│  2  │ 0 │ 0 │ 0 │ 4 │ 5 │ 5 │ 5 │ 9 │  │
│  3  │ 0 │ 0 │ 0 │ 4 │ 5 │ 5 │ 5 │10 │  │
│     └───┴───┴───┴───┴───┴───┴───┴───┘  │
│          ↑ current cell filling         │
│  Decision: TAKE item 1 (value: 4)       │
└────────────────────────────────────────┘
```

**Fitur Edukatif:**
- **Heatmap:** Sel yang sering diakses lebih terang
- **Arrow overlay:** Show dp[i-1][w-weight] → dp[i][w]
- **Item preview:** Hover item untuk highlight kontribusinya
- **Backtrack animation:** Trace dari dp[n][W] ke awal
- **Decision tooltip:** "Skip vs Take, max = 5"

**LCS - Character Matrix:**
```
      B  D  C  A  B  A
  ┌───┬───┬───┬───┬───┬───┐
A │ 0 │ 0 │ 0 │ 1 │ 1 │ 1 │
B │ 1 │ 1 │ 1 │ 1 │ 2 │ 2 │
C │ 1 │ 1 │ 2 │ 2 │ 2 │ 2 │
B │ 1 │ 1 │ 2 │ 2 │ 3 │ 3 │
D │ 1 │ 2 │ 2 │ 2 │ 3 │ 3 │
A │ 1 │ 2 │ 2 │ 3 │ 3 │ 4 │
B │ 2 │ 2 │ 2 │ 3 │ 4 │ 4 │
  └───┴───┴───┴───┴───┴───┘
   ↖ diagonal = match
```

---

### 🌲 **MST (Kruskal/Prim)**

**Layout:**
```
┌────────────────────────────────────────┐
│  [Kruskal] [Prim]                      │
│  ┌─────────────────────────────────┐  │
│  │      (A)                         │  │
│  │     4/ \3                        │  │
│  │     /   \                        │  │
│  │   (B)──2──(C)                    │  │
│  │                                  │  │
│  │  Edges sorted: [2,3,4]          │  │
│  │  Total Weight: 5                 │  │
│  └─────────────────────────────────┘  │
│  ✅ (B)-(C):2  ✅ (A)-(C):3  ❌ (A)-(B):4│
│     accepted     accepted    cycle!   │
└────────────────────────────────────────┘
```

**Fitur Edukatif:**
- **Edge list panel:** Sorted edges dengan status
- **Union-Find visualization:** Show component merging
- **Cycle detection:** Flash red saat terdeteksi
- **Weight accumulator:** Running total animasi
- **Component coloring:** Setiap komponen warna berbeda
- **Prim frontier:** Highlight edge candidates

**Kruskal - Union-Find:**
```
Step 1: {A} {B} {C}
Step 2: {A} {B-C}      ← merge B,C
Step 3: {A-B-C}        ← merge A dengan BC
```

---

### 🪙 **GREEDY (Coin Change)**

```
┌────────────────────────────────────────┐
│  Amount: 63 cents                      │
│  Available: [25¢, 10¢, 5¢, 1¢]        │
│                                        │
│  ┌──────────────────────────────┐     │
│  │  25¢ × 2 = 50¢  [🪙🪙]        │     │
│  │  10¢ × 1 = 10¢  [🪙]          │     │
│  │   5¢ × 0 =  0¢               │     │
│  │   1¢ × 3 =  3¢  [🪙🪙🪙]      │     │
│  └──────────────────────────────┘     │
│  Total: 6 coins | Remaining: 0¢       │
└────────────────────────────────────────┘
```

**Fitur Edukatif:**
- **Coin stack animation:** Coins terbang ke stack
- **Remainder meter:** Visual bar berkurang
- **Decision text:** "Take 2 × 25¢ → 13¢ left"
- **Optimal vs Greedy:** Bandingkan solusi

---

## 🎮 Interactive Features

### 1. **Playback Controls**
```
[⏮ Reset] [⏪ Prev] [▶ Play/⏸ Pause] [⏩ Next] [⏭ End]
Speed: [━━━●━━━━━━] 1x
```

### 2. **Code Panel** (Optional Toggle)
```python
for i in range(n):
→   for j in range(n-i-1):  ← YOU ARE HERE
        if arr[j] > arr[j+1]:
            swap(arr[j], arr[j+1])
```

### 3. **Stats Dashboard**
```
┌──────────────────┐
│ Comparisons: 45  │
│ Swaps: 12        │
│ Time: O(n²)      │
│ Space: O(1)      │
└──────────────────┘
```

### 4. **Challenge Mode** 🎯
- "Predict next step"
- "How many swaps?"
- "What's the time complexity?"
- Award points/badges

### 5. **Export Options**
- Download as GIF
- Share link dengan preset data
- Copy code snippet

---

## 🎨 Animation Library

**Framer Motion Variants:**
```jsx
const barVariants = {
  comparing: { 
    scale: 1.1, 
    y: -10,
    backgroundColor: "#FFC700",
    transition: { duration: 0.2 }
  },
  swapping: {
    x: [0, 50, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  sorted: {
    backgroundColor: "#00F5A0",
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 }
  }
}
```

**D3.js for Graphs:**
- Force-directed layout (draggable nodes)
- Path interpolation (smooth curves)
- Zoom & Pan

---

## 📱 Responsive Design

**Mobile:**
- Stack controls vertically
- Simplified graph (fewer nodes)
- Touch gestures (swipe = next step)

**Desktop:**
- Split screen (visualization + code)
- Keyboard shortcuts (Space = play/pause, ← → = step)

---

## 🧠 Pedagogical Elements

1. **Before-After Comparison**
2. **Worst/Best Case Examples**
3. **Step Counter & Progress Bar**
4. **Quiz after visualization**
5. **Related Algorithms Suggestions**

---

**Next Step:** Implementasi komponen reusable:
- `<BarChart />` untuk sorting
- `<GraphCanvas />` untuk BFS/DFS/MST
- `<DPTable />` untuk DP
- `<PlaybackControls />` global
