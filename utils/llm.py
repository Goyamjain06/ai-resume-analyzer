import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3:8b"


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

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return f"LLM analysis unavailable: could not reach Ollama ({e})"

    return response.json()["response"]
