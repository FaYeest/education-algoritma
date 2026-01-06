from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import uuid

router = APIRouter()

def merge_sort_steps(arr: List[int]) -> tuple:
    steps = []
    threads = {}  # Track parallel threads
    
    def merge_sort_recursive(array: List[int], left: int, right: int, depth: int, thread_id: str = None):
        if left >= right:
            return
        
        mid = (left + right) // 2
        
        # Step 1: Divide
        left_size = mid - left + 1
        right_size = right - mid
        desc = f"Pecah array menjadi 2 bagian: {left_size} elemen KIRI dan {right_size} elemen KANAN"
        
        # Create thread IDs for parallel processing
        left_thread_id = str(uuid.uuid4())[:8]
        right_thread_id = str(uuid.uuid4())[:8]
        
        steps.append({
            "action": "divide",
            "array": array.copy(),
            "left": left,
            "right": right,
            "mid": mid,
            "depth": depth,
            "message": desc,
            "description": desc,
            "thread_id": thread_id,
            "spawns_threads": [left_thread_id, right_thread_id]
        })
        
        # Mark parallel processing start
        steps.append({
            "action": "parallel_start",
            "array": array.copy(),
            "left": left,
            "right": right,
            "mid": mid,
            "depth": depth,
            "message": f"PARALEL: Proses KIRI dan KANAN berjalan bersamaan!",
            "description": f"Thread KIRI ({left_thread_id}) dan Thread KANAN ({right_thread_id}) bekerja secara paralel",
            "left_thread": left_thread_id,
            "right_thread": right_thread_id,
            "left_range": [left, mid],
            "right_range": [mid + 1, right]
        })
        
        # Recursively sort left half (simulate parallel execution)
        merge_sort_recursive(array, left, mid, depth + 1, left_thread_id)
        
        # Recursively sort right half (simulate parallel execution)
        merge_sort_recursive(array, mid + 1, right, depth + 1, right_thread_id)
        
        # Mark parallel processing end
        steps.append({
            "action": "parallel_end",
            "array": array.copy(),
            "left": left,
            "right": right,
            "mid": mid,
            "depth": depth,
            "message": f"PARALEL SELESAI: Kedua thread sudah selesai, siap merge!",
            "description": f"Thread KIRI dan KANAN selesai, hasil akan digabung",
            "left_thread": left_thread_id,
            "right_thread": right_thread_id
        })
        
        # Step 2: Merge
        merge(array, left, mid, right, depth, thread_id)
    
    def merge(array: List[int], left: int, mid: int, right: int, depth: int, thread_id: str = None):
        left_part = array[left:mid+1].copy()
        right_part = array[mid+1:right+1].copy()
        
        desc = f"Gabungkan {left_part} dan {right_part} menjadi terurut"
        steps.append({
            "action": "merge_start",
            "array": array.copy(),
            "left": left,
            "right": right,
            "mid": mid,
            "depth": depth,
            "left_part": left_part,
            "right_part": right_part,
            "message": desc,
            "description": desc,
            "thread_id": thread_id
        })
        
        i = j = 0
        k = left
        
        while i < len(left_part) and j < len(right_part):
            if left_part[i] <= right_part[j]:
                array[k] = left_part[i]
                desc = f"Letakkan angka {left_part[i]} (dari KIRI lebih kecil)"
                steps.append({
                    "action": "merge_compare",
                    "array": array.copy(),
                    "comparing": [left + i, mid + 1 + j],
                    "placing": k,
                    "value": left_part[i],
                    "depth": depth,
                    "message": desc,
                    "description": desc,
                    "thread_id": thread_id
                })
                i += 1
            else:
                array[k] = right_part[j]
                desc = f"Letakkan angka {right_part[j]} (dari KANAN lebih kecil)"
                steps.append({
                    "action": "merge_compare",
                    "array": array.copy(),
                    "comparing": [left + i, mid + 1 + j],
                    "placing": k,
                    "value": right_part[j],
                    "depth": depth,
                    "message": desc,
                    "description": desc,
                    "thread_id": thread_id
                })
                j += 1
            k += 1
        
        # Copy remaining elements
        while i < len(left_part):
            array[k] = left_part[i]
            desc = f"Letakkan sisa angka {left_part[i]} dari KIRI"
            steps.append({
                "action": "merge_remaining",
                "array": array.copy(),
                "placing": k,
                "value": left_part[i],
                "depth": depth,
                "message": desc,
                "description": desc,
                "thread_id": thread_id
            })
            i += 1
            k += 1
        
        while j < len(right_part):
            array[k] = right_part[j]
            desc = f"Letakkan sisa angka {right_part[j]} dari KANAN"
            steps.append({
                "action": "merge_remaining",
                "array": array.copy(),
                "placing": k,
                "value": right_part[j],
                "depth": depth,
                "message": desc,
                "description": desc,
                "thread_id": thread_id
            })
            j += 1
            k += 1
        
        desc = f"Selesai menggabungkan! Hasil: {array[left:right+1]}"
        steps.append({
            "action": "merge_complete",
            "array": array.copy(),
            "left": left,
            "right": right,
            "depth": depth,
            "message": desc,
            "description": desc,
            "thread_id": thread_id
        })
    
    arr_copy = arr.copy()
    main_thread = str(uuid.uuid4())[:8]
    merge_sort_recursive(arr_copy, 0, len(arr_copy) - 1, 0, main_thread)
    
    desc = "Selesai! Array sudah terurut sempurna!"
    steps.append({
        "action": "complete",
        "array": arr_copy,
        "message": desc,
        "description": desc,
        "thread_id": main_thread
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
