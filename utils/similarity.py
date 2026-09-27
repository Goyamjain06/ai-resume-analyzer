from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def analyze_similarity(resume_text, job_description):
    documents = [resume_text, job_description]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity_score = cosine_similarity(
        tfidf_matrix[0:1], tfidf_matrix[1:2]
    )[0][0]

    feature_names = vectorizer.get_feature_names_out()
    job_vector = tfidf_matrix[1].toarray()[0]

    top_indices = np.argsort(job_vector)[-10:]
    important_keywords = [feature_names[i] for i in top_indices]

    missing_keywords = [
        word for word in important_keywords
        if word.lower() not in resume_text.lower()
    ]

    return {
        "similarity_score": round(similarity_score * 100, 2),
        "important_keywords": important_keywords,
        "missing_keywords": missing_keywords
    }
