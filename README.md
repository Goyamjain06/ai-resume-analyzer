# AI Resume Analyzer

A FastAPI service that scores how well a resume matches a job description, combining classic TF-IDF similarity with LLM-based skill-gap analysis.

## Features

- **PDF resume parsing** — extracts raw text from an uploaded resume using `pdfplumber`
- **TF-IDF + cosine similarity scoring** — quantifies how closely a resume matches a job description
- **Keyword extraction** — surfaces the most important terms from the job description
- **Missing-skill detection** — flags job-description keywords that don't appear in the resume
- **LLM-powered skill-gap analysis** — uses a local Llama 3 model (via Ollama) to generate a recruiter-style breakdown of missing skills, improvement suggestions, and an overall evaluation

## Tech Stack

- **Python 3** + **FastAPI** — HTTP API and request handling
- **scikit-learn** — `TfidfVectorizer` and cosine similarity for resume/JD matching
- **pdfplumber** — PDF text extraction
- **Ollama** (Llama 3 8B) — local LLM inference for qualitative skill-gap analysis
- **Uvicorn** — ASGI server

## Setup

These steps assume a fresh machine with no prior setup.

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ai-resume-analyzer
   ```

2. **Create and activate a virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # on Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install and start Ollama** (required for the LLM skill-gap analysis)
   ```bash
   brew install ollama          # macOS; see ollama.com for other platforms
   brew services start ollama
   ollama pull llama3:8b
   ```
   The rest of the API (PDF parsing, TF-IDF scoring) works without this step — only the `llm_analysis` field in the response requires Ollama to be running.

## Running the App

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive Swagger docs are at `http://127.0.0.1:8000/docs`.

### Example request

```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -F "resume=@resume.pdf" \
  -F "job_description=Looking for a Python developer with FastAPI and AWS experience."
```

### Example response

```json
{
  "similarity_score": 42.7,
  "important_keywords": ["python", "fastapi", "aws", "developer", "..."],
  "missing_keywords": ["aws"],
  "llm_analysis": "- Missing skills: ...\n- Improvement suggestions: ...\n- Overall evaluation: ..."
}
```

## Technical Highlights

- **Single endpoint, dual analysis path**: `/analyze` runs a fast, deterministic TF-IDF comparison alongside a slower, qualitative LLM pass, returning both in one response.
- **Local-first LLM**: skill-gap analysis runs entirely against a local Ollama model — no external API calls or API keys required.
- **Graceful degradation**: if Ollama isn't running, the endpoint still returns the TF-IDF results with a clear error message in `llm_analysis` instead of failing the whole request.
- **Keyword importance via TF-IDF**: important keywords are selected from the job description's own TF-IDF weights, so terms specific to that JD are prioritized over generic English words.

## Screenshots / Demo

_Add a screenshot of the Swagger UI (`/docs`) or a sample request/response here._
