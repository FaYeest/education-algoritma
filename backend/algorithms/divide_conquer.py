from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

def merge_sort_steps(arr: List[int]) -> tuple:
    steps = []
    
    def merge_sort_recursive(array: List[int], left: int, right: int, depth: int):
        if left >= right:
            return
        
        mid = (left + right) // 2
        
        # Step 1: Divide
        steps.append({
            "action": "divide",
            "array": array.copy(),
            "left": left,
            "right": right,
            "mid": mid,
            "depth": depth,
            "message": f"Divide [{left}:{right+1}] into [{left}:{mid+1}] and [{mid+1}:{right+1}]"
        })
        
        # Recursively sort left half
        merge_sort_recursive(array, left, mid, depth + 1)
        
        # Recursively sort right half
        merge_sort_recursive(array, mid + 1, right, depth + 1)
        
        # Step 2: Merge
        merge(array, left, mid, right, depth)
    
    def merge(array: List[int], left: int, mid: int, right: int, depth: int):
        left_part = array[left:mid+1].copy()
        right_part = array[mid+1:right+1].copy()
        
        steps.append({
            "action": "merge_start",
            "array": array.copy(),
            "left": left,
            "right": right,
            "mid": mid,
            "depth": depth,
            "left_part": left_part,
            "right_part": right_part,
            "message": f"Merge {left_part} and {right_part}"
        })
        
        i = j = 0
        k = left
        
        while i < len(left_part) and j < len(right_part):
            if left_part[i] <= right_part[j]:
                array[k] = left_part[i]
                steps.append({
                    "action": "merge_compare",
                    "array": array.copy(),
                    "comparing": [left + i, mid + 1 + j],
                    "placing": k,
                    "value": left_part[i],
                    "depth": depth,
                    "message": f"Place {left_part[i]} at position {k}"
                })
                i += 1
            else:
                array[k] = right_part[j]
                steps.append({
                    "action": "merge_compare",
                    "array": array.copy(),
                    "comparing": [left + i, mid + 1 + j],
                    "placing": k,
                    "value": right_part[j],
                    "depth": depth,
                    "message": f"Place {right_part[j]} at position {k}"
                })
                j += 1
            k += 1
        
        # Copy remaining elements
        while i < len(left_part):
            array[k] = left_part[i]
            steps.append({
                "action": "merge_remaining",
                "array": array.copy(),
                "placing": k,
                "value": left_part[i],
                "depth": depth,
                "message": f"Place remaining {left_part[i]} at position {k}"
            })
            i += 1
            k += 1
        
        while j < len(right_part):
            array[k] = right_part[j]
            steps.append({
                "action": "merge_remaining",
                "array": array.copy(),
                "placing": k,
                "value": right_part[j],
                "depth": depth,
                "message": f"Place remaining {right_part[j]} at position {k}"
            })
            j += 1
            k += 1
        
        steps.append({
            "action": "merge_complete",
            "array": array.copy(),
            "left": left,
            "right": right,
            "depth": depth,
            "message": f"Merged [{left}:{right+1}] = {array[left:right+1]}"
        })
    
    arr_copy = arr.copy()
    merge_sort_recursive(arr_copy, 0, len(arr_copy) - 1, 0)
    
    steps.append({
        "action": "complete",
        "array": arr_copy,
        "message": "Sorting complete!"
    })
    
    return steps, arr_copy

@router.post("/divide-conquer/merge-sort")
async def merge_sort(request: dict):
    array = request.get("array", [])
    
    if not array:
        raise HTTPException(status_code=400, detail="Array cannot be empty")
    
    if len(array) > 50:
        raise HTTPException(status_code=400, detail="Array too large (max 50 elements)")
    
    steps, sorted_array = merge_sort_steps(array)
    
    return {
        "steps": steps,
        "sorted": sorted_array,
        "complexity": {
            "time": "O(n log n)",
            "space": "O(n)"
        }
    }
