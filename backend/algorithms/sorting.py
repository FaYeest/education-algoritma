from fastapi import APIRouter, HTTPException
from models.requests import SortingRequest
from models.responses import SortingResponse, ComplexityResponse
from typing import List, Dict, Any

router = APIRouter()

def bubble_sort_steps(arr: List[int]) -> tuple:
    steps = []
    arr_copy = arr.copy()
    n = len(arr_copy)
    comparisons = 0
    swaps = 0
    sorted_indices = []
    
    for i in range(n):
        for j in range(n - i - 1):
            comparisons += 1
            steps.append({
                "array": arr_copy.copy(),
                "comparing": [j, j + 1],
                "swapped": [],
                "sorted": sorted_indices.copy()
            })
            
            if arr_copy[j] > arr_copy[j + 1]:
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                swaps += 1
                steps.append({
                    "array": arr_copy.copy(),
                    "comparing": [],
                    "swapped": [j, j + 1],
                    "sorted": sorted_indices.copy()
                })
        sorted_indices.insert(0, n - i - 1)
    
    steps.append({
        "array": arr_copy.copy(),
        "comparing": [],
        "swapped": [],
        "sorted": list(range(n))
    })
    
    return steps, comparisons, swaps

def selection_sort_steps(arr: List[int]) -> tuple:
    steps = []
    arr_copy = arr.copy()
    n = len(arr_copy)
    comparisons = 0
    swaps = 0
    sorted_indices = []
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            steps.append({
                "array": arr_copy.copy(),
                "comparing": [min_idx, j],
                "swapped": [],
                "sorted": sorted_indices.copy()
            })
            
            if arr_copy[j] < arr_copy[min_idx]:
                min_idx = j
        
        if min_idx != i:
            arr_copy[i], arr_copy[min_idx] = arr_copy[min_idx], arr_copy[i]
            swaps += 1
            steps.append({
                "array": arr_copy.copy(),
                "comparing": [],
                "swapped": [i, min_idx],
                "sorted": sorted_indices.copy()
            })
        sorted_indices.append(i)
    
    steps.append({
        "array": arr_copy.copy(),
        "comparing": [],
        "swapped": [],
        "sorted": list(range(n))
    })
    
    return steps, comparisons, swaps

def insertion_sort_steps(arr: List[int]) -> tuple:
    steps = []
    arr_copy = arr.copy()
    n = len(arr_copy)
    comparisons = 0
    swaps = 0
    sorted_indices = [0]
    
    for i in range(1, n):
        key = arr_copy[i]
        j = i - 1
        
        while j >= 0 and arr_copy[j] > key:
            comparisons += 1
            steps.append({
                "array": arr_copy.copy(),
                "comparing": [j, j + 1],
                "swapped": [],
                "sorted": sorted_indices.copy()
            })
            
            arr_copy[j + 1] = arr_copy[j]
            swaps += 1
            steps.append({
                "array": arr_copy.copy(),
                "comparing": [],
                "swapped": [j, j + 1],
                "sorted": sorted_indices.copy()
            })
            j -= 1
        
        arr_copy[j + 1] = key
        sorted_indices = list(range(i + 1))
    
    steps.append({
        "array": arr_copy.copy(),
        "comparing": [],
        "swapped": [],
        "sorted": list(range(n))
    })
    
    return steps, comparisons, swaps

def quick_sort_steps(arr: List[int]) -> tuple:
    steps = []
    arr_copy = arr.copy()
    comparisons = [0]
    swaps = [0]
    
    def partition(low, high):
        pivot = arr_copy[high]
        i = low - 1
        
        steps.append({
            "array": arr_copy.copy(),
            "comparing": [],
            "swapping": [],
            "sorted": [],
            "pivot": high,
            "action": "select_pivot"
        })
        
        for j in range(low, high):
            comparisons[0] += 1
            steps.append({
                "array": arr_copy.copy(),
                "comparing": [j, high],
                "swapping": [],
                "sorted": [],
                "pivot": high,
                "action": "compare"
            })
            
            if arr_copy[j] < pivot:
                i += 1
                arr_copy[i], arr_copy[j] = arr_copy[j], arr_copy[i]
                swaps[0] += 1
                steps.append({
                    "array": arr_copy.copy(),
                    "comparing": [],
                    "swapping": [i, j],
                    "sorted": [],
                    "pivot": high,
                    "action": "swap"
                })
        
        arr_copy[i + 1], arr_copy[high] = arr_copy[high], arr_copy[i + 1]
        swaps[0] += 1
        steps.append({
            "array": arr_copy.copy(),
            "comparing": [],
            "swapping": [i + 1, high],
            "sorted": [],
            "pivot": i + 1,
            "action": "swap"
        })
        
        return i + 1
    
    def quick_sort_recursive(low, high):
        if low < high:
            pi = partition(low, high)
            quick_sort_recursive(low, pi - 1)
            quick_sort_recursive(pi + 1, high)
    
    quick_sort_recursive(0, len(arr_copy) - 1)
    
    steps.append({
        "array": arr_copy.copy(),
        "comparing": [],
        "swapping": [],
        "sorted": list(range(len(arr_copy))),
        "action": "complete"
    })
    
    return steps, comparisons[0], swaps[0]

@router.post("/sorting")
async def sort_array(request: SortingRequest):
    algo = request.algorithm.lower()

    if algo == "bubble":
        steps, comp, swaps = bubble_sort_steps(request.array)
        complexity = ComplexityResponse(time="O(n²)", space="O(1)")
    elif algo == "selection":
        steps, comp, swaps = selection_sort_steps(request.array)
        complexity = ComplexityResponse(time="O(n²)", space="O(1)")
    elif algo == "insertion":
        steps, comp, swaps = insertion_sort_steps(request.array)
        complexity = ComplexityResponse(time="O(n²)", space="O(1)")
    else:
        raise HTTPException(status_code=400, detail=f"Algorithm '{algo}' not supported")

    return {
        "steps": steps,
        "complexity": complexity,
        "comparisons": comp,
        "swaps": swaps
    }

# Individual endpoints for 3D visualization
@router.post("/sorting/bubble")
async def bubble_sort_endpoint(request: SortingRequest):
    steps, comp, swaps = bubble_sort_steps(request.array)
    return {
        "steps": steps,
        "complexity": {"time": "O(n²)", "space": "O(1)"},
        "comparisons": comp,
        "swaps": swaps
    }

@router.post("/sorting/selection")
async def selection_sort_endpoint(request: SortingRequest):
    steps, comp, swaps = selection_sort_steps(request.array)
    return {
        "steps": steps,
        "complexity": {"time": "O(n²)", "space": "O(1)"},
        "comparisons": comp,
        "swaps": swaps
    }

@router.post("/sorting/insertion")
async def insertion_sort_endpoint(request: SortingRequest):
    steps, comp, swaps = insertion_sort_steps(request.array)
    return {
        "steps": steps,
        "complexity": {"time": "O(n²)", "space": "O(1)"},
        "comparisons": comp,
        "swaps": swaps
    }

@router.post("/sorting/quick")
async def quick_sort_endpoint(request: SortingRequest):
    steps, comp, swaps = quick_sort_steps(request.array)
    return {
        "steps": steps,
        "complexity": {"time": "O(n log n)", "space": "O(log n)"},
        "comparisons": comp,
        "swaps": swaps
    }
