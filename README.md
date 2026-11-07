# 🤖 AI Resume Analyzer

> **Instantly see how well your resume matches any job description — powered by TF-IDF similarity + Google Gemini AI.**

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 📄 **PDF Resume Upload** — drag & drop or browse
- 📊 **Match Score** — TF-IDF cosine similarity shows % fit at a glance
- 🔑 **Keyword Analysis** — top JD keywords highlighted; missing ones flagged in red
- 🤖 **AI Recruiter Feedback** — Gemini 1.5 Flash gives missing skills, improvement tips, overall evaluation
- 🌙 **Dark UI** — clean, modern interface recruiters won't forget
- 📱 **Mobile Responsive** — works on any screen

---

## 🖥️ Live Demo

> 🔗 **[your-deployment-url.vercel.app](#)** ← replace after deploy

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.11, FastAPI, Uvicorn |
| NLP | scikit-learn (TF-IDF + cosine similarity) |
| PDF Parsing | pdfplumber |
| AI / LLM | Google Gemini 1.5 Flash |
| Frontend | React 18, plain CSS |
| Deploy | Render (backend) + Vercel (frontend) |

---

## 🚀 Run Locally

### 1. Clone & set up backend

```bash
git clone https://github.com/Goyamjain06/ai-resume-analyzer
cd ai-resume-analyzer

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Add your Gemini API key

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
# Get a free key at: https://aistudio.google.com/app/apikey
```

### 3. Start backend

```bash
uvicorn main:app --reload
# API runs at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### 4. Start frontend

```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

---

## 📡 API Reference

### `POST /analyze`

Analyzes a resume against a job description.

**Request** (multipart/form-data)
| Field | Type | Description |
|---|---|---|
| `resume` | File | PDF resume |
| `job_description` | string | Full job description text |

**Response**
```json
{
  "similarity_score": 72.4,
  "important_keywords": ["python", "fastapi", "machine learning", ...],
  "missing_keywords": ["docker", "kubernetes"],
  "llm_analysis": "**Missing Skills**\n• Docker containerization..."
}
```

### `GET /health`
Returns `{"status": "ok"}` — used for uptime monitoring.

---

## ☁️ Deploy

### Backend → Render (free)
1. Push repo to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add env var: `GEMINI_API_KEY=your_key`

### Frontend → Vercel (free)
1. Import `frontend/` folder on [vercel.com](https://vercel.com)
2. Add env var: `REACT_APP_API_URL=https://your-render-url.onrender.com`
3. Deploy — done!

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── main.py               # FastAPI app + endpoints
├── utils/
│   ├── parser.py         # PDF text extraction
│   ├── similarity.py     # TF-IDF cosine similarity
│   └── llm.py            # Gemini AI integration
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   └── App.css       # Styles
│   └── package.json
├── Dockerfile            # Docker config for backend
├── render.yaml           # Render deployment config
└── requirements.txt
```

---

## 🔑 Getting a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click **Create API Key**
4. Copy and paste in `.env`

The free tier is generous — more than enough for personal use.

---

## 📄 License

MIT © [Goyam Jain](https://github.com/Goyamjain06)
