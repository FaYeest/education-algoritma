from fastapi import APIRouter, HTTPException
from models.requests import SearchRequest
from models.responses import SearchResponse, ComplexityResponse
from typing import List, Dict, Any

router = APIRouter()

def linear_search_steps(arr: List[int], target: int) -> tuple:
    steps = []
    found = False
    found_indices = []  # Track ALL matching indices
    
    # Brute force: check ALL elements, don't stop when found
    for i, val in enumerate(arr):
        if val == target:
            found = True
            found_indices.append(i)
            steps.append({
                "index": i,
                "value": val,
                "found": True,
                "checking": True  # Still checking, not final result
            })
        else:
            steps.append({
                "index": i,
                "value": val,
                "found": False,
                "checking": True
            })
    
    # Final step: show result after checking all
    steps.append({
        "indices": found_indices,  # Return all matched indices
        "found": found,
        "checking": False,  # Done checking
        "final": True
    })
    
    return steps, found, found_indices

def binary_search_steps(arr: List[int], target: int) -> tuple:
    steps = []
    sorted_arr = sorted(arr)
    left, right = 0, len(sorted_arr) - 1
    found = False
    found_index = -1
    
    while left <= right:
        mid = (left + right) // 2
        steps.append({
            "index": mid,
            "value": sorted_arr[mid],
            "left": left,
            "right": right,
            "comparing": True
        })
        
        if sorted_arr[mid] == target:
            steps.append({
                "index": mid,
                "value": sorted_arr[mid],
                "found": True
            })
            found = True
            found_index = mid
            break
        elif sorted_arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return steps, found, found_index

@router.post("/search")
async def search_array(request: SearchRequest):
    algo = request.algorithm.lower()
    
    if algo == "linear":
        steps, found, indices = linear_search_steps(request.array, request.target)
        complexity = ComplexityResponse(time="O(n)", space="O(1)")
        # Return indices as array for multiple matches
        result = {
            "found": found, 
            "indices": indices if isinstance(indices, list) else [indices] if indices != -1 else []
        }
    elif algo == "binary":
        steps, found, index = binary_search_steps(request.array, request.target)
        complexity = ComplexityResponse(time="O(log n)", space="O(1)")
        result = {"found": found, "index": index}
    else:
        raise HTTPException(status_code=400, detail=f"Algorithm '{algo}' not supported")
    
    return {
        "steps": steps,
        "result": result,
        "complexity": complexity
    }
