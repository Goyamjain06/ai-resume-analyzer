# AI Resume Analyzer

AI-powered Resume Analyzer built using FastAPI, TF-IDF, and a local LLM (Llama3 via Ollama).

## Features

- Upload PDF resume
- TF-IDF + Cosine Similarity scoring
- Keyword extraction
- Missing skill detection
- Contextual skill-gap analysis using Llama3 (Ollama)

## Tech Stack

- Python
- FastAPI
- Scikit-learn
- Ollama (Llama3)
- Requests

## Run Locally

1. Install dependencies:
pip install -r requirements.txt

2. Start Ollama:
brew services start ollama

3. Run backend:
uvicorn main:app --reload

4. Open:
http://127.0.0.1:8000/docs
