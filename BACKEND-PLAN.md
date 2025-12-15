# Backend Architecture Plan - AlgoViz API

## Tech Stack
- **Framework:** FastAPI (Python) - cepat, async, auto-generated docs
- **CORS:** Untuk komunikasi dengan React frontend
- **Structure:** Modular per kategori algoritma

## Endpoint Structure

### 1. Sorting Algorithms
**POST** `/api/algorithms/sorting`
```json
Request: {
  "algorithm": "bubble|selection|insertion|merge|quick",
  "array": [5, 3, 8, 2, 7]
}
Response: {
  "steps": [
    { "array": [3, 5, 8, 2, 7], "indices": [0, 1], "comparing": true },
    { "array": [3, 5, 2, 8, 7], "indices": [2, 3], "swapping": true }
  ],
  "complexity": { "time": "O(n²)", "space": "O(1)" },
  "comparisons": 10,
  "swaps": 5
}
```

### 2. Search Algorithms (Brute Force)
**POST** `/api/algorithms/search`
```json
Request: {
  "algorithm": "linear|binary",
  "array": [5, 3, 8, 2, 7],
  "target": 8
}
Response: {
  "steps": [
    { "index": 0, "value": 5, "found": false },
    { "index": 1, "value": 3, "found": false },
    { "index": 2, "value": 8, "found": true }
  ],
  "result": { "found": true, "index": 2 },
  "complexity": { "time": "O(n)", "space": "O(1)" }
}
```

### 3. Graph Algorithms (BFS/DFS)
**POST** `/api/algorithms/graph/bfs`
**POST** `/api/algorithms/graph/dfs`
```json
Request: {
  "nodes": ["A", "B", "C", "D"],
  "edges": [
    { "from": "A", "to": "B" },
    { "from": "A", "to": "C" },
    { "from": "B", "to": "D" }
  ],
  "start": "A"
}
Response: {
  "steps": [
    { "visiting": "A", "queue": ["B", "C"], "visited": ["A"] },
    { "visiting": "B", "queue": ["C", "D"], "visited": ["A", "B"] }
  ],
  "traversalOrder": ["A", "B", "C", "D"],
  "complexity": { "time": "O(V+E)", "space": "O(V)" }
}
```

### 4. Dynamic Programming
**POST** `/api/algorithms/dp/knapsack`
```json
Request: {
  "capacity": 10,
  "items": [
    { "weight": 3, "value": 4 },
    { "weight": 4, "value": 5 },
    { "weight": 7, "value": 10 }
  ]
}
Response: {
  "steps": [
    { "i": 1, "w": 3, "value": 4, "action": "take" },
    { "i": 1, "w": 4, "value": 4, "action": "skip" }
  ],
  "table": [[0,0,0,...], [0,0,4,...]],
  "selected": [0, 2],
  "maxValue": 14,
  "complexity": { "time": "O(n*W)", "space": "O(n*W)" }
}
```

**POST** `/api/algorithms/dp/lcs`
```json
Request: {
  "a": "ABCBDAB",
  "b": "BDCABA"
}
Response: {
  "steps": [...],
  "table": [[0,0,...], ...],
  "lcs": "BCBA",
  "length": 4
}
```

### 5. Greedy Algorithms
**POST** `/api/algorithms/greedy/coin-change`
```json
Request: {
  "coins": [25, 10, 5, 1],
  "amount": 63
}
Response: {
  "steps": [
    { "coin": 25, "count": 2, "remaining": 13 },
    { "coin": 10, "count": 1, "remaining": 3 },
    { "coin": 1, "count": 3, "remaining": 0 }
  ],
  "result": { "25": 2, "10": 1, "1": 3 },
  "totalCoins": 6
}
```

### 6. Divide & Conquer
**POST** `/api/algorithms/divide-conquer/merge-sort`
(Sudah tercakup di sorting, tambahan visualisasi tree rekursi)

### 7. MST Algorithms
**POST** `/api/algorithms/mst`
```json
Request: {
  "algorithm": "kruskal|prim",
  "nodes": ["A", "B", "C"],
  "edges": [
    { "u": "A", "v": "B", "w": 4 },
    { "u": "A", "v": "C", "w": 3 },
    { "u": "B", "v": "C", "w": 2 }
  ]
}
Response: {
  "steps": [
    { "edge": {"u":"B","v":"C","w":2}, "action": "add", "union": ["B","C"] },
    { "edge": {"u":"A","v":"C","w":3}, "action": "add", "union": ["A","B","C"] },
    { "edge": {"u":"A","v":"B","w":4}, "action": "reject", "reason": "cycle" }
  ],
  "used": [{"u":"B","v":"C","w":2}, {"u":"A","v":"C","w":3}],
  "rejected": [{"u":"A","v":"B","w":4}],
  "totalWeight": 5
}
```

## Project Structure
```
backend/
├── main.py                 # FastAPI app, CORS, routers
├── requirements.txt        # fastapi, uvicorn, pydantic
├── algorithms/
│   ├── __init__.py
│   ├── sorting.py         # Bubble, Selection, Insertion, Merge, Quick
│   ├── search.py          # Linear, Binary
│   ├── graph.py           # BFS, DFS
│   ├── dp.py              # Knapsack, LCS, Coin Change
│   ├── greedy.py          # Coin Change, Activity Selection
│   ├── mst.py             # Kruskal, Prim
│   └── divide_conquer.py  # Merge Sort tree
├── models/
│   ├── __init__.py
│   ├── requests.py        # Pydantic request models
│   └── responses.py       # Pydantic response models
└── utils/
    ├── __init__.py
    └── helpers.py         # Common utilities
```

## Implementation Priority
1. ✅ **Setup FastAPI + CORS**
2. ✅ **Sorting (Bubble, Selection, Insertion)** - paling simple
3. ✅ **Search (Linear)** - untuk brute force
4. ✅ **Graph (BFS, DFS)** - step-by-step traversal
5. ⏳ **DP (Knapsack, LCS)** - table filling steps
6. ⏳ **MST (Kruskal)** - union-find visualization
7. ⏳ **Greedy (Coin Change)** - decision steps

## Validation & Error Handling
- Validate input arrays (max size, type)
- Handle edge cases (empty array, single element)
- Return meaningful error messages
- Rate limiting untuk production

## Testing Strategy
- Unit tests per algoritma
- Integration tests untuk endpoints
- Load testing untuk performa

## Next Steps
1. Setup FastAPI project structure
2. Implement sorting endpoints
3. Test dengan frontend React
4. Iterate per kategori algoritma
