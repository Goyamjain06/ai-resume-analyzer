import requests

def generate_skill_gap_analysis(resume_text, job_description):
    prompt = f"""
You are a senior technical recruiter.

Compare this resume with the job description.

Provide:
1. Missing skills
2. Improvement suggestions
3. Overall evaluation

Resume:
{resume_text}

Job Description:
{job_description}

Respond in clean bullet points.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3:8b",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()["response"]
    return result[:800]   # ← This line trims long output