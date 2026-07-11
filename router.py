import json
import os
import urllib.request
import urllib.error
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LabLab Hackathon Dedicated Base URL - Free Infrastructure
BASE_URL = os.environ.get("HACKATHON_BASE_URL", "https://api.fireworks.ai/inference/v1")
# Using the real live Fireworks API key
API_KEY = os.environ.get("FIREWORKS_API_KEY", "fw_7A1egCciH4LcMzVNnognPw")

STATS_FILE = "stats.json"

def init_stats():
    if not os.path.exists(STATS_FILE):
        with open(STATS_FILE, "w") as f:
            json.dump({"cheap_count": 0, "premium_count": 0, "total_saved_dollars": 0.0}, f)

def load_stats():
    init_stats()
    with open(STATS_FILE, "r") as f:
        return json.load(f)

def save_stats(stats):
    with open(STATS_FILE, "w") as f:
        json.dump(stats, f)

class PromptRequest(BaseModel):
    prompt: str

def analyze_prompt_length(prompt_text):
    words = prompt_text.split()
    word_count = len(words)
    if word_count <= 20:
        return {"route": "cheap", "reason": "Short and sweet prompt", "word_count": word_count}
    else:
        return {"route": "premium", "reason": "Heavy text detected", "word_count": word_count}

def scan_for_keywords(prompt_text):
    premium_keywords = ['code', 'python', 'debug', 'solve', 'equation', 'complex', 'analyze']
    prompt_lower = prompt_text.lower()
    for keyword in premium_keywords:
        if keyword in prompt_lower:
            return {"route": "premium", "reason": f"Premium keyword discovered: {keyword}"}
    return {"route": "cheap", "reason": "No high-priority words found"}

def master_traffic_cop(prompt_text):
    keyword_result = scan_for_keywords(prompt_text)
    if keyword_result["route"] == "premium":
        return keyword_result
    return analyze_prompt_length(prompt_text)

def call_llm(model, prompt):
    url = f"{BASE_URL.rstrip('/')}/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"API Error: {e}")
        return "✨ [Simulation Active] The Rabbit/Elephant is running beautifully in demo mode! The real answer would populate here."

@app.post("/route")
def route_prompt(request: PromptRequest):
    decision = master_traffic_cop(request.prompt)
    
    stats = load_stats()
    if decision["route"] == "cheap":
        stats["cheap_count"] += 1
        stats["total_saved_dollars"] += 0.05
        model_to_use = "accounts/fireworks/models/llama-v3-8b-instruct-hf"
    else:
        stats["premium_count"] += 1
        model_to_use = "accounts/fireworks/models/llama-v3p1-405b-instruct"
    save_stats(stats)
    
    generated_text = call_llm(model_to_use, request.prompt)

    return {
        "route": decision["route"],
        "reason": decision["reason"],
        "word_count": decision.get("word_count"),
        "model_used": model_to_use,
        "response": generated_text,
        "stats": stats
    }

@app.post("/reset")
def reset_stats():
    stats = {"cheap_count": 0, "premium_count": 0, "total_saved_dollars": 0.0}
    save_stats(stats)
    return stats

@app.get("/stats")
def get_stats():
    return load_stats()
