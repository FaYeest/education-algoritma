from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.llm_quiz_generator import LLMQuizGenerator

router = APIRouter()
generator = LLMQuizGenerator()

QUIZ_CACHE_PATH = os.path.join(os.path.dirname(__file__), "..", "quiz_cache.json")

class QuizQuestion(BaseModel):
    question: str
    answers: List[str]
    correctAnswer: int
    explanation: str
    topic: str = ""
    algorithm: str = ""
    difficulty: str = ""

class QuizRequest(BaseModel):
    difficulty: str = "medium"
    count: int = 10

class QuizRegenerateRequest(BaseModel):
    questions_per_difficulty: int = 30

@router.get("/quiz/{difficulty}")
async def get_quiz_questions(difficulty: str, count: int = 10):
    """
    Get random quiz questions for specified difficulty
    
    - **difficulty**: easy, medium, or hard
    - **count**: number of questions (default 10)
    """
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Difficulty must be easy, medium, or hard")
    
    if count < 1 or count > 50:
        raise HTTPException(status_code=400, detail="Count must be between 1 and 50")
    
    try:
        questions = generator.get_random_questions(difficulty, count, QUIZ_CACHE_PATH)
        
        if not questions:
            raise HTTPException(status_code=500, detail="Failed to generate questions")
        
        return {
            "success": True,
            "difficulty": difficulty,
            "count": len(questions),
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quiz: {str(e)}")

@router.post("/quiz/regenerate")
async def regenerate_quiz_pool(request: QuizRegenerateRequest):
    """
    Manually regenerate the daily quiz pool
    
    - **questions_per_difficulty**: number of questions to generate per difficulty level
    """
    try:
        quiz_pool = generator.generate_daily_quiz_pool(request.questions_per_difficulty)
        generator.save_quiz_pool(quiz_pool, QUIZ_CACHE_PATH)
        
        return {
            "success": True,
            "message": "Quiz pool regenerated successfully",
            "date": quiz_pool["date"],
            "total_questions": sum(len(quiz_pool[d]) for d in ["easy", "medium", "hard"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error regenerating quiz: {str(e)}")

@router.get("/quiz/status")
async def get_quiz_status():
    """Get status of current quiz pool"""
    try:
        quiz_pool = generator.load_quiz_pool(QUIZ_CACHE_PATH)
        
        if not quiz_pool:
            return {
                "status": "no_cache",
                "message": "No quiz pool found. Questions will be generated on first request."
            }
        
        from datetime import datetime
        today = datetime.now().strftime("%Y-%m-%d")
        is_current = quiz_pool.get("date") == today
        
        return {
            "status": "ready" if is_current else "outdated",
            "date": quiz_pool.get("date"),
            "is_current": is_current,
            "questions_count": {
                "easy": len(quiz_pool.get("easy", [])),
                "medium": len(quiz_pool.get("medium", [])),
                "hard": len(quiz_pool.get("hard", []))
            },
            "total": sum(len(quiz_pool.get(d, [])) for d in ["easy", "medium", "hard"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking status: {str(e)}")
