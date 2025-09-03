from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import sqlite3
from datetime import datetime
import google.generativeai as genai
import os
from pydantic import BaseModel

class Task(BaseModel):
    text: str



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # allow all headers
)

# SQLite database functions
def init_database():
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            classification TEXT NOT NULL,
            confidence REAL NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def get_all_tasks():
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, text, classification, confidence, created_at FROM tasks')
    tasks = []
    for row in cursor.fetchall():
        tasks.append({
            'id': row[0],
            'text': row[1], 
            'classification': row[2],
            'confidence': row[3],
            'created_at': row[4]
        })
    conn.close()
    return tasks

def create_task_db(text, classification, confidence, created_at):
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tasks (text, classification, confidence, created_at)
        VALUES (?, ?, ?, ?)
    ''', (text, classification, confidence, created_at))
    task_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {
        'id': task_id,
        'text': text,
        'classification': classification, 
        'confidence': confidence,
        'created_at': created_at
    }

def delete_task_db(task_id):
    conn = sqlite3.connect('tasks.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

# Initialize database on startup
init_database()


@app.get('/')
def read_root():
    return {"message": "Backend is working!"}

@app.get('/ping')
def read_ping():
    return { "status": "ok" }


# Load API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")


def classify_task_with_gemini(text: str):
    prompt = f"""
    You are an EXTREMELY STRICT task classifier. Be RUTHLESS like Steve Jobs.
    Task: "{text}"
    
    SIGNAL = Only these activities count as signal:
    - Deep work, learning, creating, building
    - Exercise, health activities
    - Solving real problems
    - Skill development
    - Meaningful relationships
    
    NOISE = EVERYTHING else is noise, including:
    - ANY social media (scroll, browse, check, post)
    - ANY entertainment (TV, videos, games, memes)  
    - ANY mindless browsing or consumption
    - ANY procrastination activities
    - ANY time-wasting activities
    
    RULE: If the task contains words like "scroll", "browse", "watch", "check social", "entertainment" = AUTOMATICALLY NOISE
    
    Be EXTREMELY harsh. 95% of activities should be NOISE. Only pure productive work is SIGNAL.
    
    Respond ONLY in JSON format with keys "classification" and "confidence".
    """
    response = model.generate_content(prompt)
    
    # Gemini response is text → convert to dict
    import json
    try:
        result = json.loads(response.text)
    except:
        result = {"classification": "signal", "confidence": 0.5}
    
    return result["classification"], result["confidence"]


@app.post("/tasks")
def create_task(task: Task):
    # 🔥 Gemini classification
    classification, confidence = classify_task_with_gemini(task.text)
    created_at = datetime.now().strftime("%d-%m-%Y_%I_%p")
    
    # Save to SQLite database
    new_task = create_task_db(task.text, classification, confidence, created_at)
    return new_task



@app.get('/all-tasks')
def see_tasks():
    return get_all_tasks()


@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    try:
        with open("input.json", "r") as f:
            tasks = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No tasks found")

    for t in tasks:
        if t["id"] == task_id:
            # Re-run Gemini classification for updated text
            classification, confidence = classify_task_with_gemini(task.text)
            t["text"] = task.text
            t["classification"] = classification
            t["confidence"] = confidence
            t["created_at"] = datetime.now().strftime("%d-%m-%Y_%I_%p")
            
            with open("input.json", "w") as f:
                json.dump(tasks, f, indent=2)
            return t
    
    raise HTTPException(status_code=404, detail="Task not found")

# -----------------------------
# DELETE
# -----------------------------
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    deleted = delete_task_db(task_id)
    if deleted:
        return {"message": f"Task {task_id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")