from fastapi import FastAPI, UploadFile, File, Form
from utils.parser import extract_text_from_pdf
from utils.similarity import analyze_similarity
from utils.llm import generate_skill_gap_analysis


app = FastAPI()

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_text = extract_text_from_pdf(resume.file)

    tfidf_result = analyze_similarity(resume_text, job_description)

    llm_analysis = generate_skill_gap_analysis(
        resume_text,
        job_description
    )

    return {
        **tfidf_result,
        "llm_analysis": llm_analysis
    }
