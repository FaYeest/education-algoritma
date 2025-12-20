from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from algorithms import sorting, search, graph, dp, mst, greedy, divide_conquer, quiz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from utils.llm_quiz_generator import LLMQuizGenerator
import os

app = FastAPI(
    title="AlgoViz API",
    description="Algorithm Visualization Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
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
app.include_router(quiz.router, prefix="/api", tags=["Quiz"])

# Scheduler for daily quiz generation
QUIZ_CACHE_PATH = os.path.join(os.path.dirname(__file__), "quiz_cache.json")

def generate_daily_quiz():
    """Background job to generate daily quiz pool"""
    print("Generating daily quiz pool...")
    try:
        generator = LLMQuizGenerator()
        quiz_pool = generator.generate_daily_quiz_pool(questions_per_difficulty=30)
        generator.save_quiz_pool(quiz_pool, QUIZ_CACHE_PATH)
        print("Daily quiz pool generated successfully!")
    except Exception as e:
        print(f"Error generating daily quiz: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize scheduler on startup"""
    scheduler = BackgroundScheduler()
    
    # Schedule quiz generation every day at midnight
    scheduler.add_job(
        generate_daily_quiz,
        CronTrigger(hour=0, minute=0),
        id="daily_quiz_generation",
        replace_existing=True
    )
    
    scheduler.start()
    print("Quiz scheduler started - will generate new questions daily at midnight")

@app.get("/")
def root():
    return {"message": "AlgoViz API is running", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
