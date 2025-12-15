from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class StepResponse(BaseModel):
    array: Optional[List[int]] = None
    indices: Optional[List[int]] = None
    comparing: Optional[bool] = None
    swapping: Optional[bool] = None
    index: Optional[int] = None
    value: Optional[int] = None
    found: Optional[bool] = None

class ComplexityResponse(BaseModel):
    time: str
    space: str

class SortingResponse(BaseModel):
    steps: List[Dict[str, Any]]
    complexity: ComplexityResponse
    comparisons: int
    swaps: int

class SearchResponse(BaseModel):
    steps: List[Dict[str, Any]]
    result: Dict[str, Any]
    complexity: ComplexityResponse
