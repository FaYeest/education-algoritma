from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms import sorting, search, graph, dp, mst, greedy, divide_conquer

app = FastAPI(
    title="AlgoViz API",
    description="Algorithm Visualization Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sorting.router, prefix="/api/algorithms", tags=["Sorting"])
app.include_router(search.router, prefix="/api/algorithms", tags=["Search"])
app.include_router(graph.router, prefix="/api/algorithms", tags=["Graph"])
app.include_router(dp.router, prefix="/api/algorithms", tags=["Dynamic Programming"])
app.include_router(mst.router, prefix="/api/algorithms", tags=["MST"])
app.include_router(greedy.router, prefix="/api/algorithms", tags=["Greedy"])
app.include_router(divide_conquer.router, prefix="/api/algorithms", tags=["Divide & Conquer"])

@app.get("/")
def root():
    return {"message": "AlgoViz API is running", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
