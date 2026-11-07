import os
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


def generate_skill_gap_analysis(resume_text: str, job_description: str) -> str:
    if not GEMINI_API_KEY:
        return "LLM analysis unavailable: GEMINI_API_KEY not set."

    prompt = f"""You are a senior technical recruiter reviewing a candidate's resume against a job description.

Analyze the resume and provide:
1. **Missing Skills** - Key skills from the JD not found in the resume
2. **Improvement Suggestions** - Specific, actionable ways to strengthen the resume
3. **Overall Evaluation** - Brief summary of candidate fit (2-3 sentences)

Resume:
{resume_text[:3000]}

Job Description:
{job_description[:2000]}

Respond in clean bullet points under each heading. Be specific and constructive."""

    try:
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 800}
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"LLM analysis unavailable: {str(e)}"
