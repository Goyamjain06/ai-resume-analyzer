from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.parser import extract_text_from_pdf
from utils.similarity import analyze_similarity
from utils.llm import generate_skill_gap_analysis

app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyze how well your resume matches a job description using TF-IDF + Gemini AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    try:
        resume_text = extract_text_from_pdf(resume.file)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {str(e)}")

    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF. Ensure it is not a scanned image.")

    tfidf_result = analyze_similarity(resume_text, job_description)
    llm_analysis = generate_skill_gap_analysis(resume_text, job_description)

    return {
        **tfidf_result,
        "llm_analysis": llm_analysis
    }
