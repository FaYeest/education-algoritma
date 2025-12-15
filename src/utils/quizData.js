export const quizQuestions = {
  easy: [
    {
      question: "Apa kompleksitas waktu dari linear search (pencarian linear)?",
      answers: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Linear search memeriksa setiap elemen satu per satu, sehingga kompleksitas waktunya adalah O(n) di mana n adalah jumlah elemen."
    },
    {
      question: "Algoritma mana yang mencoba semua kemungkinan?",
      answers: ["Greedy", "Brute Force", "Dynamic Programming", "Divide & Conquer"],
      correctAnswer: 1,
      explanation: "Brute Force mencoba semua kemungkinan solusi untuk menemukan yang paling optimal."
    },
    {
      question: "Apa kepanjangan dari BFS?",
      answers: ["Best First Search", "Binary File Search", "Breadth-First Search", "Branch Factor Search"],
      correctAnswer: 2,
      explanation: "BFS adalah Breadth-First Search, algoritma penelusuran yang menjelajah level per level."
    },
    {
      question: "Algoritma sorting mana yang paling sederhana?",
      answers: ["Quick Sort", "Merge Sort", "Bubble Sort", "Heap Sort"],
      correctAnswer: 2,
      explanation: "Bubble Sort adalah algoritma sorting paling sederhana dengan membandingkan elemen bersebelahan."
    },
    {
      question: "Berapa kompleksitas waktu best case dari Bubble Sort?",
      answers: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correctAnswer: 0,
      explanation: "Best case Bubble Sort adalah O(n) ketika array sudah terurut dan tidak perlu swap."
    },
    {
      question: "Struktur data apa yang digunakan BFS (Breadth-First Search)?",
      answers: ["Stack", "Queue (Antrian)", "Heap", "Tree"],
      correctAnswer: 1,
      explanation: "BFS menggunakan Queue (antrian) untuk menyimpan node yang akan dikunjungi berikutnya, sehingga node diproses dalam urutan FIFO (First In First Out)."
    },
    {
      question: "Apa kepanjangan dari DFS?",
      answers: ["Deep File System", "Depth-First Search", "Direct Forward Search", "Dynamic Function Search"],
      correctAnswer: 1,
      explanation: "DFS adalah Depth-First Search, algoritma penelusuran yang menjelajah sedalam mungkin pada setiap cabang sebelum melakukan backtrack."
    },
    {
      question: "Algoritma mana yang membagi masalah menjadi sub-masalah kecil?",
      answers: ["Brute Force", "Greedy", "Divide & Conquer", "Linear Search"],
      correctAnswer: 2,
      explanation: "Divide & Conquer membagi masalah besar menjadi sub-masalah kecil, lalu menggabungkan solusinya."
    },
    {
      question: "Berapa kompleksitas ruang dari Bubble Sort?",
      answers: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: 0,
      explanation: "Bubble Sort adalah in-place sorting dengan kompleksitas ruang O(1)."
    },
    {
      question: "Algoritma mana yang membuat pilihan optimal lokal?",
      answers: ["Brute Force", "Greedy", "Bubble Sort", "Linear Search"],
      correctAnswer: 1,
      explanation: "Greedy Algorithm selalu memilih opsi terbaik di setiap langkah (locally optimal)."
    }
  ],
  medium: [
    {
      question: "Berapa kompleksitas waktu rata-rata Quick Sort?",
      answers: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: 1,
      explanation: "Quick Sort memiliki average case O(n log n) dengan pembagian yang seimbang."
    },
    {
      question: "Algoritma mana yang menggunakan pendekatan divide-and-conquer?",
      answers: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
      correctAnswer: 2,
      explanation: "Merge Sort membagi array menjadi dua bagian, mengurutkan, lalu menggabungkannya."
    },
    {
      question: "Berapa kompleksitas waktu Binary Search?",
      answers: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: 2,
      explanation: "Binary Search membagi pencarian menjadi setengah di setiap iterasi, hasilnya O(log n)."
    },
    {
      question: "Algoritma mana yang digunakan di Minimum Spanning Tree?",
      answers: ["Dijkstra", "Prim's", "Binary Search", "Quick Sort"],
      correctAnswer: 1,
      explanation: "Prim's Algorithm dan Kruskal's Algorithm adalah dua algoritma utama untuk MST."
    },
    {
      question: "Teknik apa yang digunakan Dynamic Programming?",
      answers: ["Hanya Recursion", "Hanya Iteration", "Memoization", "Random selection"],
      correctAnswer: 2,
      explanation: "Dynamic Programming menggunakan memoization untuk menyimpan hasil sub-masalah."
    },
    {
      question: "Struktur data apa yang terutama digunakan DFS?",
      answers: ["Queue", "Stack", "Heap", "Hash Table"],
      correctAnswer: 1,
      explanation: "DFS menggunakan Stack (tumpukan) atau rekursi untuk menyimpan node."
    },
    {
      question: "Berapa kompleksitas waktu worst case Quick Sort?",
      answers: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: 2,
      explanation: "Worst case Quick Sort adalah O(n²) ketika pivot selalu elemen terkecil/terbesar."
    },
    {
      question: "Algoritma mana yang BUKAN in-place sorting?",
      answers: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: 1,
      explanation: "Merge Sort membutuhkan array tambahan untuk merging, jadi tidak in-place."
    },
    {
      question: "Masalah apa yang bisa diselesaikan optimal oleh Greedy?",
      answers: ["0/1 Knapsack", "Coin Change (dengan koin tertentu)", "Traveling Salesman", "Subset Sum"],
      correctAnswer: 1,
      explanation: "Coin Change dengan koin tertentu (misalnya 1,5,10,25) bisa diselesaikan optimal dengan Greedy."
    },
    {
      question: "Traversal mana yang mengunjungi semua node di level yang sama terlebih dahulu?",
      answers: ["DFS", "BFS", "Inorder", "Postorder"],
      correctAnswer: 1,
      explanation: "BFS mengunjungi semua node di level yang sama sebelum ke level berikutnya."
    }
  ],
  hard: [
    {
      question: "Berapa kompleksitas ruang dari Merge Sort?",
      answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: 2,
      explanation: "Merge Sort membutuhkan array tambahan berukuran O(n) untuk proses merging."
    },
    {
      question: "Algoritma mana yang menyelesaikan 0/1 Knapsack secara optimal?",
      answers: ["Greedy", "Brute Force", "Dynamic Programming", "Divide & Conquer"],
      correctAnswer: 2,
      explanation: "0/1 Knapsack diselesaikan optimal dengan Dynamic Programming menggunakan tabel DP."
    },
    {
      question: "Berapa kompleksitas waktu untuk membangun Min Heap?",
      answers: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
      correctAnswer: 0,
      explanation: "Membangun heap dari array bisa dilakukan dalam O(n) dengan heapify bottom-up."
    },
    {
      question: "Algoritma mana yang mencari Longest Common Subsequence secara efisien?",
      answers: ["Greedy", "Dynamic Programming", "Binary Search", "DFS"],
      correctAnswer: 1,
      explanation: "LCS diselesaikan efisien dengan Dynamic Programming menggunakan tabel 2D."
    },
    {
      question: "Berapa kompleksitas waktu Kruskal's algorithm dengan Union-Find?",
      answers: ["O(V²)", "O(E log V)", "O(V log E)", "O(E + V)"],
      correctAnswer: 1,
      explanation: "Kruskal's dengan Union-Find memiliki kompleksitas O(E log V) untuk sorting edges."
    },
    {
      question: "Algoritma mana yang memiliki worst-case time complexity terbaik untuk sorting?",
      answers: ["Quick Sort", "Heap Sort", "Bubble Sort", "Insertion Sort"],
      correctAnswer: 1,
      explanation: "Heap Sort memiliki worst-case O(n log n), sementara Quick Sort worst-case O(n²)."
    },
    {
      question: "Berapa kompleksitas ruang dari recursive DFS?",
      answers: ["O(1)", "O(V)", "O(E)", "O(V + E)"],
      correctAnswer: 1,
      explanation: "Recursive DFS menggunakan call stack dengan kedalaman maksimal O(V)."
    },
    {
      question: "Teknik apa yang digunakan algoritma Bellman-Ford?",
      answers: ["Greedy", "Dynamic Programming", "Divide & Conquer", "Backtracking"],
      correctAnswer: 1,
      explanation: "Bellman-Ford menggunakan Dynamic Programming dengan relaxation bertahap."
    },
    {
      question: "Berapa kompleksitas waktu algoritma Floyd-Warshall?",
      answers: ["O(V²)", "O(V³)", "O(E log V)", "O(V + E)"],
      correctAnswer: 1,
      explanation: "Floyd-Warshall menggunakan 3 nested loops untuk semua pasangan node, hasilnya O(V³)."
    },
    {
      question: "Algoritma sorting mana yang stable DAN memiliki O(n log n) worst-case?",
      answers: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
      correctAnswer: 2,
      explanation: "Merge Sort adalah stable sorting dengan guaranteed O(n log n) worst-case time."
    }
  ]
}
