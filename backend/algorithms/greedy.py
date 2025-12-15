from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

def coin_change_steps(coins: List[int], amount: int) -> tuple:
    steps = []
    result = {}
    remaining = amount
    total_coins = 0
    
    sorted_coins = sorted(coins, reverse=True)
    
    for coin in sorted_coins:
        if remaining == 0:
            break
        
        # Add "select" step
        steps.append({
            "coin": coin,
            "action": "select",
            "remaining": remaining
        })
        
        count = remaining // coin
        if count > 0:
            result[str(coin)] = count
            total_coins += count
            remaining -= coin * count
            
            # Add "use" step with count
            steps.append({
                "coin": coin,
                "count": count,
                "remaining": remaining,
                "action": "use"
            })
        else:
            # Skip this coin
            steps.append({
                "coin": coin,
                "count": 0,
                "remaining": remaining,
                "action": "skip"
            })
    
    return steps, result, total_coins, remaining == 0

def activity_selection_steps(activities: List[dict]) -> tuple:
    # Activities should have "start" and "finish" times
    steps = []
    sorted_activities = sorted(activities, key=lambda x: x["finish"])
    selected = []
    last_finish = 0
    
    for i, activity in enumerate(sorted_activities):
        if activity["start"] >= last_finish:
            selected.append(i)
            last_finish = activity["finish"]
            steps.append({
                "activity": activity,
                "index": i,
                "action": "select",
                "lastFinish": last_finish
            })
        else:
            steps.append({
                "activity": activity,
                "index": i,
                "action": "reject",
                "reason": "overlaps with previous",
                "lastFinish": last_finish
            })
    
    return steps, selected

@router.post("/greedy/coin-change")
async def coin_change(request: dict):
    coins = request.get("coins", [])
    amount = request.get("amount", 0)
    
    if not coins:
        raise HTTPException(status_code=400, detail="Coins list cannot be empty")
    
    if amount < 0:
        raise HTTPException(status_code=400, detail="Amount must be non-negative")
    
    steps, result, total, possible = coin_change_steps(coins, amount)
    
    return {
        "steps": steps,
        "result": result,
        "totalCoins": total,
        "possible": possible,
        "complexity": {
            "time": "O(n)",
            "space": "O(1)"
        }
    }

@router.post("/greedy/activity-selection")
async def activity_selection(request: dict):
    activities = request.get("activities", [])
    
    if not activities:
        raise HTTPException(status_code=400, detail="Activities list cannot be empty")
    
    steps, selected = activity_selection_steps(activities)
    
    return {
        "steps": steps,
        "selected": selected,
        "maxActivities": len(selected),
        "complexity": {
            "time": "O(n log n)",
            "space": "O(1)"
        }
    }
