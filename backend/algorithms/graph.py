from fastapi import APIRouter, HTTPException
from models.requests import GraphRequest
from typing import List, Dict, Any
from collections import deque

router = APIRouter()

def build_adjacency_list(nodes: List[str], edges: List[dict]) -> dict:
    adj = {node: [] for node in nodes}
    for edge in edges:
        adj[edge["from"]].append(edge["to"])
        if edge.get("bidirectional", True):
            adj[edge["to"]].append(edge["from"])
    return adj

def bfs_steps(nodes: List[str], edges: List[dict], start: str) -> tuple:
    adj = build_adjacency_list(nodes, edges)
    steps = []
    visited = set()
    queue = deque([start])
    visited.add(start)
    traversal_order = []
    
    steps.append({
        "visiting": start,
        "queue": list(queue),
        "visited": list(visited),
        "action": "start"
    })
    
    while queue:
        current = queue.popleft()
        traversal_order.append(current)
        
        steps.append({
            "visiting": current,
            "queue": list(queue),
            "visited": list(visited),
            "action": "visit"
        })
        
        for neighbor in adj.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
                steps.append({
                    "visiting": current,
                    "neighbor": neighbor,
                    "queue": list(queue),
                    "visited": list(visited),
                    "action": "enqueue"
                })
    
    return steps, traversal_order

def dfs_steps(nodes: List[str], edges: List[dict], start: str) -> tuple:
    adj = build_adjacency_list(nodes, edges)
    steps = []
    visited = set()
    stack = [start]
    traversal_order = []
    
    steps.append({
        "visiting": start,
        "stack": stack.copy(),
        "visited": list(visited),
        "action": "start"
    })
    
    while stack:
        current = stack.pop()
        
        if current in visited:
            continue
            
        visited.add(current)
        traversal_order.append(current)
        
        steps.append({
            "visiting": current,
            "stack": stack.copy(),
            "visited": list(visited),
            "action": "visit"
        })
        
        for neighbor in reversed(adj.get(current, [])):
            if neighbor not in visited:
                stack.append(neighbor)
                
                steps.append({
                    "visiting": current,
                    "neighbor": neighbor,
                    "stack": stack.copy(),
                    "visited": list(visited),
                    "action": "push"
                })
    
    return steps, traversal_order

@router.post("/graph/bfs")
async def bfs(request: GraphRequest):
    if request.start not in request.nodes:
        raise HTTPException(status_code=400, detail="Start node not in nodes list")
    
    steps, traversal = bfs_steps(request.nodes, request.edges, request.start)
    
    return {
        "steps": steps,
        "traversalOrder": traversal,
        "complexity": {
            "time": "O(V + E)",
            "space": "O(V)"
        }
    }

@router.post("/graph/dfs")
async def dfs(request: GraphRequest):
    if request.start not in request.nodes:
        raise HTTPException(status_code=400, detail="Start node not in nodes list")
    
    steps, traversal = dfs_steps(request.nodes, request.edges, request.start)
    
    return {
        "steps": steps,
        "traversalOrder": traversal,
        "complexity": {
            "time": "O(V + E)",
            "space": "O(V)"
        }
    }
