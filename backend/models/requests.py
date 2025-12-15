from pydantic import BaseModel, Field
from typing import List, Optional

class SortingRequest(BaseModel):
    algorithm: str = Field(..., description="bubble|selection|insertion|merge|quick")
    array: List[int] = Field(..., min_length=1, max_length=50)

class SearchRequest(BaseModel):
    algorithm: str = Field(..., description="linear|binary")
    array: List[int] = Field(..., min_length=1, max_length=100)
    target: int

class GraphRequest(BaseModel):
    nodes: List[str]
    edges: List[dict]
    start: str

class KnapsackRequest(BaseModel):
    capacity: int
    items: List[dict]

class LCSRequest(BaseModel):
    a: str
    b: str

class MSTRequest(BaseModel):
    algorithm: str = Field(..., description="kruskal|prim")
    nodes: List[str]
    edges: List[dict]
