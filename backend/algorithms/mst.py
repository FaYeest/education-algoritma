from fastapi import APIRouter, HTTPException
from models.requests import MSTRequest
from typing import List, Dict, Any

router = APIRouter()

class UnionFind:
    def __init__(self, nodes: List[str]):
        self.parent = {node: node for node in nodes}
        self.rank = {node: 0 for node in nodes}
    
    def find(self, x: str) -> str:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: str, y: str) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True
    
    def get_components(self) -> List[List[str]]:
        components = {}
        for node in self.parent:
            root = self.find(node)
            if root not in components:
                components[root] = []
            components[root].append(node)
        return list(components.values())

def kruskal_steps(nodes: List[str], edges: List[dict]) -> tuple:
    steps = []
    sorted_edges = sorted(edges, key=lambda e: e.get("weight", e.get("w", 0)))
    uf = UnionFind(nodes)
    selected_edges = []
    selected_nodes = set()
    total_weight = 0
    
    for edge in sorted_edges:
        u = edge.get("from", edge.get("u"))
        v = edge.get("to", edge.get("v"))
        w = edge.get("weight", edge.get("w"))
        
        steps.append({
            "from": u,
            "to": v,
            "weight": w,
            "action": "consider",
            "selected_edges": [{"from": e.get("from", e.get("u")), 
                               "to": e.get("to", e.get("v")), 
                               "weight": e.get("weight", e.get("w"))} for e in selected_edges],
            "selected_nodes": list(selected_nodes),
            "total_weight": total_weight
        })
        
        if uf.union(u, v):
            selected_edges.append(edge)
            selected_nodes.add(u)
            selected_nodes.add(v)
            total_weight += w
            steps.append({
                "from": u,
                "to": v,
                "weight": w,
                "action": "select_edge",
                "selected_edges": [{"from": e.get("from", e.get("u")), 
                                   "to": e.get("to", e.get("v")), 
                                   "weight": e.get("weight", e.get("w"))} for e in selected_edges],
                "selected_nodes": list(selected_nodes),
                "total_weight": total_weight
            })
        else:
            steps.append({
                "from": u,
                "to": v,
                "weight": w,
                "action": "reject",
                "reason": "creates cycle",
                "selected_edges": [{"from": e.get("from", e.get("u")), 
                                   "to": e.get("to", e.get("v")), 
                                   "weight": e.get("weight", e.get("w"))} for e in selected_edges],
                "selected_nodes": list(selected_nodes),
                "total_weight": total_weight
            })
    
    return steps, selected_edges, total_weight

def prim_steps(nodes: List[str], edges: List[dict], start: str = None) -> tuple:
    if not start:
        start = nodes[0]
    
    steps = []
    visited = {start}
    selected_edges = []
    total_weight = 0
    
    # Build adjacency list
    adj = {node: [] for node in nodes}
    for edge in edges:
        u = edge.get("from", edge.get("u"))
        v = edge.get("to", edge.get("v"))
        w = edge.get("weight", edge.get("w"))
        adj[u].append({"to": v, "w": w, "from": u})
        adj[v].append({"to": u, "w": w, "from": v})
    
    steps.append({
        "action": "start",
        "current": start,
        "selected_nodes": list(visited),
        "selected_edges": [],
        "total_weight": 0
    })
    
    while len(visited) < len(nodes):
        min_edge = None
        min_weight = float('inf')
        from_node = None
        to_node = None
        
        # Find minimum weight edge from visited to unvisited
        for node in visited:
            for neighbor in adj[node]:
                if neighbor["to"] not in visited and neighbor["w"] < min_weight:
                    min_weight = neighbor["w"]
                    from_node = neighbor["from"]
                    to_node = neighbor["to"]
        
        if from_node is None:
            break
        
        steps.append({
            "from": from_node,
            "to": to_node,
            "weight": min_weight,
            "action": "consider",
            "selected_edges": [{"from": e["from"], "to": e["to"], "weight": e["w"]} 
                              for e in selected_edges],
            "selected_nodes": list(visited),
            "total_weight": total_weight
        })
        
        # Add edge
        visited.add(to_node)
        selected_edges.append({"from": from_node, "to": to_node, "w": min_weight})
        total_weight += min_weight
        
        steps.append({
            "from": from_node,
            "to": to_node,
            "weight": min_weight,
            "action": "select_edge",
            "selected_edges": [{"from": e["from"], "to": e["to"], "weight": e["w"]} 
                              for e in selected_edges],
            "selected_nodes": list(visited),
            "total_weight": total_weight
        })
    
    return steps, selected_edges, total_weight

@router.post("/mst")
async def mst(request: MSTRequest):
    if not request.nodes:
        raise HTTPException(status_code=400, detail="Nodes list cannot be empty")
    
    if not request.edges:
        raise HTTPException(status_code=400, detail="Edges list cannot be empty")
    
    algo = request.algorithm.lower()
    
    if algo == "kruskal":
        steps, used, total = kruskal_steps(request.nodes, request.edges)
        complexity = {"time": "O(E log E)", "space": "O(V)"}
    elif algo == "prim":
        steps, used, total = prim_steps(request.nodes, request.edges)
        complexity = {"time": "O(E log V)", "space": "O(V)"}
    else:
        raise HTTPException(status_code=400, detail=f"Algorithm '{algo}' not supported")
    
    return {
        "steps": steps,
        "used": used,
        "totalWeight": total,
        "complexity": complexity
    }

# Individual endpoints for 3D visualization
@router.post("/graph/kruskal")
async def kruskal_endpoint(request: MSTRequest):
    if not request.nodes or not request.edges:
        raise HTTPException(status_code=400, detail="Invalid input")
    
    steps, used, total = kruskal_steps(request.nodes, request.edges)
    return {
        "steps": steps,
        "selected_edges": used,
        "total_weight": total,
        "complexity": {"time": "O(E log E)", "space": "O(V)"}
    }

@router.post("/graph/prim")
async def prim_endpoint(request: MSTRequest):
    if not request.nodes or not request.edges:
        raise HTTPException(status_code=400, detail="Invalid input")
    
    steps, used, total = prim_steps(request.nodes, request.edges)
    return {
        "steps": steps,
        "selected_edges": used,
        "total_weight": total,
        "complexity": {"time": "O(E log V)", "space": "O(V)"}
    }
