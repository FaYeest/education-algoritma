from fastapi import APIRouter, HTTPException
from models.requests import KnapsackRequest, LCSRequest
from typing import List, Dict, Any

router = APIRouter()

def knapsack_steps(capacity: int, items: List[dict]) -> tuple:
    n = len(items)
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    steps = []
    
    for i in range(1, n + 1):
        weight = items[i - 1]["weight"]
        value = items[i - 1]["value"]
        
        for w in range(capacity + 1):
            if weight <= w:
                take = dp[i - 1][w - weight] + value
                skip = dp[i - 1][w]
                dp[i][w] = max(take, skip)
                
                steps.append({
                    "i": i,
                    "w": w,
                    "value": dp[i][w],
                    "action": "take" if take > skip else "skip",
                    "itemWeight": weight,
                    "itemValue": value
                })
            else:
                dp[i][w] = dp[i - 1][w]
                steps.append({
                    "i": i,
                    "w": w,
                    "value": dp[i][w],
                    "action": "skip",
                    "reason": "too heavy"
                })
    
    # Backtrack to find selected items
    selected = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(i - 1)
            w -= items[i - 1]["weight"]
    
    selected.reverse()
    
    return steps, dp, selected, dp[n][capacity]

def lcs_steps(a: str, b: str) -> tuple:
    m, n = len(a), len(b)
    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
    steps = []
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                steps.append({
                    "i": i,
                    "j": j,
                    "charA": a[i - 1],
                    "charB": b[j - 1],
                    "value": dp[i][j],
                    "action": "match"
                })
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                steps.append({
                    "i": i,
                    "j": j,
                    "charA": a[i - 1],
                    "charB": b[j - 1],
                    "value": dp[i][j],
                    "action": "max"
                })
    
    # Backtrack to find LCS
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            lcs.append(a[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    lcs.reverse()
    
    return steps, dp, ''.join(lcs), dp[m][n]

@router.post("/dp/knapsack")
async def knapsack(request: KnapsackRequest):
    if request.capacity <= 0:
        raise HTTPException(status_code=400, detail="Capacity must be positive")
    
    if not request.items:
        raise HTTPException(status_code=400, detail="Items list cannot be empty")
    
    steps, table, selected, max_value = knapsack_steps(request.capacity, request.items)
    
    return {
        "steps": steps,
        "table": table,
        "selected": selected,
        "maxValue": max_value,
        "complexity": {
            "time": "O(n × W)",
            "space": "O(n × W)"
        }
    }

@router.post("/dp/lcs")
async def lcs(request: LCSRequest):
    if not request.a or not request.b:
        raise HTTPException(status_code=400, detail="Strings cannot be empty")
    
    steps, table, lcs_str, length = lcs_steps(request.a, request.b)
    
    return {
        "steps": steps,
        "table": table,
        "lcs": lcs_str,
        "length": length,
        "complexity": {
            "time": "O(m × n)",
            "space": "O(m × n)"
        }
    }
