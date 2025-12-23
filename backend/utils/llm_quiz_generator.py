import os
import json
import requests
from datetime import datetime
from typing import List, Dict
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LLMQuizGenerator:
    def __init__(self):
        # Using NEW Hugging Face Router API
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.api_token = os.getenv("HUGGINGFACE_API_TOKEN", "")
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        # Available models on the new router
        self.model_name = "meta-llama/Llama-3.1-8B-Instruct"
        
        # Check if token is set
        if not self.api_token or self.api_token == "":
            print("WARNING: HUGGINGFACE_API_TOKEN not set! Please set it in .env file")
            print("Get token from: https://huggingface.co/settings/tokens")
        
        self.topics = {
            "sorting": ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort", "Insertion Sort"],
            "search": ["Linear Search", "Binary Search", "Jump Search", "Interpolation Search"],
            "graph": ["BFS", "DFS", "Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Kruskal", "Prim"],
            "dp": ["Knapsack", "LCS", "Fibonacci", "Coin Change", "Matrix Chain Multiplication"],
            "greedy": ["Activity Selection", "Huffman Coding", "Fractional Knapsack"],
            "divide_conquer": ["Merge Sort", "Quick Sort", "Binary Search", "Strassen's Algorithm"]
        }
    
    def generate_prompt(self, topic: str, algorithm: str, difficulty: str) -> str:
        """Generate prompt for LLM based on difficulty and topic"""
        
        difficulty_context = {
            "easy": "basic understanding, simple concepts, beginner-friendly",
            "medium": "intermediate understanding, requires analysis, moderate complexity",
            "hard": "advanced understanding, complex analysis, expert level"
        }
        
        prompt = f"""Generate a quiz question about {algorithm} in {topic} algorithms.

Difficulty: {difficulty} ({difficulty_context[difficulty]})

Requirements:
1. Create ONE multiple choice question with EXACTLY 4 answer options
2. Question must be in Indonesian (Bahasa Indonesia)
3. Mark which answer is correct (index 0-3)
4. Provide a clear explanation in Indonesian
5. Make sure the question tests understanding, not just memorization

Return ONLY valid JSON with this exact structure:
{{
    "question": "Question text in Indonesian",
    "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
    "correctAnswer": 0,
    "explanation": "Explanation in Indonesian"
}}

Do not include any other text, only the JSON."""
        
        return prompt
    
    def query_llm(self, prompt: str) -> Dict:
        """Query Hugging Face Router API using chat completions"""
        try:
            # Use OpenAI-compatible chat completion format
            payload = {
                "model": self.model_name,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that generates quiz questions in Indonesian language. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 500,
                "temperature": 0.7,
                "top_p": 0.9
            }
            
            print(f"Querying Hugging Face Router API ({self.model_name})...")
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=90
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Extract message content from chat completion response
            if 'choices' in result and len(result['choices']) > 0:
                message_content = result['choices'][0]['message']['content']
                print("✓ Got response from API")
                return {"generated_text": message_content}
            
            print(f"Unexpected response format: {result}")
            return None
            
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error {e.response.status_code}: {e}")
            try:
                error_detail = e.response.json()
                print(f"Error detail: {error_detail}")
            except:
                pass
            return None
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def parse_llm_response(self, response_text: str) -> Dict:
        """Parse LLM response and extract JSON"""
        try:
            # Clean up response text
            text = response_text.strip()
            
            # Try to find JSON in response
            start = text.find('{')
            end = text.rfind('}') + 1
            
            if start != -1 and end != 0:
                json_str = text[start:end]
                question_data = json.loads(json_str)
                
                # Validate structure
                required_keys = ["question", "answers", "correctAnswer", "explanation"]
                if all(key in question_data for key in required_keys):
                    if len(question_data["answers"]) == 4:
                        if isinstance(question_data["correctAnswer"], int) and 0 <= question_data["correctAnswer"] <= 3:
                            return question_data
            
            print(f"Invalid response structure: {text[:200]}...")
            return None
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Response text: {response_text[:200]}...")
            return None
        except Exception as e:
            print(f"Error parsing response: {e}")
            return None
    
    def generate_single_question(self, topic: str, algorithm: str, difficulty: str, retries: int = 3) -> Dict:
        """Generate a single quiz question with retries"""
        
        for attempt in range(retries):
            prompt = self.generate_prompt(topic, algorithm, difficulty)
            
            response = self.query_llm(prompt)
            
            if response and 'generated_text' in response:
                response_text = response['generated_text']
                question = self.parse_llm_response(response_text)
                
                if question:
                    question["topic"] = topic
                    question["algorithm"] = algorithm
                    question["difficulty"] = difficulty
                    print(f"✓ Successfully generated question for {algorithm} ({difficulty})")
                    return question
            
            print(f"Attempt {attempt + 1} failed, retrying...")
        
        # Fallback to template if all retries fail
        print(f"All attempts failed, using fallback for {algorithm} ({difficulty})")
        return self.generate_fallback_question(topic, algorithm, difficulty)
    
    def generate_fallback_question(self, topic: str, algorithm: str, difficulty: str) -> Dict:
        """Generate a fallback question if LLM fails"""
        import random
        
        # High-quality fallback questions organized by algorithm and difficulty
        fallback_templates = {
            "sorting": {
                "Quick Sort": {
                    "easy": [
                        {
                            "question": "Apa prinsip dasar dari Quick Sort?",
                            "answers": ["Membagi array menjadi dua bagian", "Menukar elemen bersebelahan", "Memilih pivot dan partisi", "Menggabungkan array terurut"],
                            "correctAnswer": 2,
                            "explanation": "Quick Sort memilih elemen pivot dan membagi array menjadi dua partisi: elemen lebih kecil dan lebih besar dari pivot."
                        },
                        {
                            "question": "Berapa kompleksitas waktu rata-rata Quick Sort?",
                            "answers": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                            "correctAnswer": 1,
                            "explanation": "Quick Sort memiliki kompleksitas waktu rata-rata O(n log n) dengan pembagian yang seimbang."
                        }
                    ],
                    "medium": [
                        {
                            "question": "Apa yang terjadi pada Quick Sort jika pivot selalu elemen terkecil atau terbesar?",
                            "answers": ["Tetap O(n log n)", "Menjadi O(n²)", "Menjadi O(n)", "Error"],
                            "correctAnswer": 1,
                            "explanation": "Jika pivot selalu ekstrem, Quick Sort menghasilkan partisi tidak seimbang, degradasi ke O(n²) worst case."
                        }
                    ],
                    "hard": [
                        {
                            "question": "Strategi pemilihan pivot mana yang paling efektif untuk menghindari worst case?",
                            "answers": ["Selalu elemen pertama", "Selalu elemen terakhir", "Median-of-three", "Random"],
                            "correctAnswer": 2,
                            "explanation": "Median-of-three (mengambil median dari elemen pertama, tengah, terakhir) memberikan partisi lebih seimbang dan menghindari worst case."
                        }
                    ]
                }
            }
        }
        
        # Try to get specific template
        if topic in fallback_templates and algorithm in fallback_templates[topic]:
            templates = fallback_templates[topic][algorithm].get(difficulty, [])
            if templates:
                template = random.choice(templates)
                return {
                    **template,
                    "topic": topic,
                    "algorithm": algorithm,
                    "difficulty": difficulty,
                    "is_fallback": True
                }
        
        # Generic fallback
        generic_questions = [
            {
                "question": f"Apa kompleksitas waktu rata-rata dari algoritma {algorithm}?",
                "answers": ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
                "correctAnswer": 2,
                "explanation": f"Ini adalah pertanyaan fallback tentang {algorithm}. Sistem LLM sedang dalam perbaikan."
            },
            {
                "question": f"Kategori algoritma apa yang digunakan oleh {algorithm}?",
                "answers": ["Greedy", "Divide & Conquer", "Dynamic Programming", "Brute Force"],
                "correctAnswer": 1,
                "explanation": f"Ini adalah pertanyaan fallback tentang {algorithm}. Sistem LLM sedang dalam perbaikan."
            }
        ]
        
        template = random.choice(generic_questions)
        return {
            **template,
            "topic": topic,
            "algorithm": algorithm,
            "difficulty": difficulty,
            "is_fallback": True
        }
    
    def generate_daily_quiz_pool(self, questions_per_difficulty: int = 30) -> Dict:
        """Generate daily quiz pool for all difficulties"""
        today = datetime.now().strftime("%Y-%m-%d")
        
        quiz_pool = {
            "date": today,
            "easy": [],
            "medium": [],
            "hard": []
        }
        
        print(f"Generating quiz pool for {today}...")
        
        for difficulty in ["easy", "medium", "hard"]:
            questions_generated = 0
            
            while questions_generated < questions_per_difficulty:
                # Random topic and algorithm
                topic = random.choice(list(self.topics.keys()))
                algorithm = random.choice(self.topics[topic])
                
                print(f"Generating {difficulty} question {questions_generated + 1}/{questions_per_difficulty} - {algorithm}")
                
                question = self.generate_single_question(topic, algorithm, difficulty)
                
                if question:
                    quiz_pool[difficulty].append(question)
                    questions_generated += 1
        
        return quiz_pool
    
    def save_quiz_pool(self, quiz_pool: Dict, filepath: str = "quiz_cache.json"):
        """Save quiz pool to file"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(quiz_pool, f, ensure_ascii=False, indent=2)
        print(f"Quiz pool saved to {filepath}")
    
    def load_quiz_pool(self, filepath: str = "quiz_cache.json") -> Dict:
        """Load quiz pool from file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return None
    
    def get_random_questions(self, difficulty: str, count: int = 10, filepath: str = "quiz_cache.json") -> List[Dict]:
        """Get random questions from today's pool"""
        quiz_pool = self.load_quiz_pool(filepath)
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Check if we need to regenerate
        if not quiz_pool or quiz_pool.get("date") != today:
            print("Generating new quiz pool...")
            quiz_pool = self.generate_daily_quiz_pool()
            self.save_quiz_pool(quiz_pool, filepath)
        
        # Get random questions
        questions = quiz_pool.get(difficulty, [])
        
        if len(questions) < count:
            return questions
        
        return random.sample(questions, count)


if __name__ == "__main__":
    # Test generation
    generator = LLMQuizGenerator()
    
    # Generate a single test question
    question = generator.generate_single_question("sorting", "Quick Sort", "medium")
    print("\n=== Test Question ===")
    print(json.dumps(question, ensure_ascii=False, indent=2))
    
    # Uncomment to generate full daily pool (takes time!)
    # quiz_pool = generator.generate_daily_quiz_pool(questions_per_difficulty=5)
    # generator.save_quiz_pool(quiz_pool)
