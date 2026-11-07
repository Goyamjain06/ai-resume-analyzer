import React, { useState, useRef } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong Match' : score >= 45 ? 'Moderate Match' : 'Weak Match';

  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{score}%</text>
        <text x="70" y="85" textAnchor="middle" fill="#94a3b8" fontSize="11">{label}</text>
      </svg>
    </div>
  );
}

function KeywordChips({ keywords, type }) {
  if (!keywords || keywords.length === 0) return null;
  return (
    <div className="chip-group">
      {keywords.map((kw, i) => (
        <span key={i} className={`chip chip-${type}`}>{kw}</span>
      ))}
    </div>
  );
}

function LLMCard({ text }) {
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div className="llm-card">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={i} className="llm-heading">{line.replace(/\*\*/g, '')}</h4>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return <p key={i} className="llm-bullet">• {line.slice(2)}</p>;
        }
        if (line.match(/^\d+\./)) {
          return <p key={i} className="llm-numbered">{line}</p>;
        }
        return <p key={i} className="llm-para">{line}</p>;
      })}
    </div>
  );
}

export default function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else {
      setError('Please upload a PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resume) return setError('Please upload your resume PDF.');
    if (!jd.trim()) return setError('Please paste the job description.');
    setError('');
    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append('resume', resume);
    form.append('job_description', jd);

    try {
      const res = await fetch(`${API_BASE}/analyze`, { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Analysis failed.');
      }
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Hero */}
      <header className="hero">
        <div className="hero-badge">✨ Powered by Gemini AI</div>
        <h1 className="hero-title">AI Resume Analyzer</h1>
        <p className="hero-sub">
          Upload your resume and paste a job description — get an instant match score,
          keyword gap analysis, and AI recruiter feedback.
        </p>
      </header>

      {/* Main card */}
      <main className="main-card">
        {/* Upload area */}
        <section className="section">
          <label className="section-label">📄 Your Resume (PDF)</label>
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${resume ? 'has-file' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileRef} type="file" accept=".pdf" hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {resume ? (
              <div className="file-chosen">
                <span className="file-icon">📋</span>
                <div>
                  <div className="file-name">{resume.name}</div>
                  <div className="file-size">{(resume.size / 1024).toFixed(1)} KB</div>
                </div>
                <button className="remove-btn" onClick={(e) => { e.stopPropagation(); setResume(null); }}>✕</button>
              </div>
            ) : (
              <div className="drop-hint">
                <span className="drop-icon">⬆️</span>
                <span>Drag & drop or <u>browse</u></span>
                <span className="drop-sub">PDF only · max 5 MB</span>
              </div>
            )}
          </div>
        </section>

        {/* JD area */}
        <section className="section">
          <label className="section-label">📝 Job Description</label>
          <textarea
            className="jd-input"
            placeholder="Paste the full job description here…"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={8}
          />
        </section>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <button
          className={`analyze-btn ${loading ? 'loading' : ''}`}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading"><span className="spinner" /> Analyzing with AI…</span>
          ) : (
            '🔍 Analyze Resume'
          )}
        </button>
      </main>

      {/* Results */}
      {result && (
        <section className="results">
          <h2 className="results-title">Analysis Results</h2>

          <div className="results-grid">
            {/* Score */}
            <div className="result-card score-card">
              <h3>Match Score</h3>
              <ScoreRing score={result.similarity_score} />
            </div>

            {/* Keywords */}
            <div className="result-card keywords-card">
              <h3>Top Job Keywords</h3>
              <KeywordChips keywords={result.important_keywords} type="blue" />

              <h3 style={{ marginTop: '1.5rem' }}>Missing from Resume</h3>
              {result.missing_keywords.length === 0
                ? <p className="all-good">✅ All key terms found!</p>
                : <KeywordChips keywords={result.missing_keywords} type="red" />
              }
            </div>
          </div>

          {/* AI Analysis */}
          <div className="result-card ai-card">
            <h3>🤖 AI Recruiter Analysis</h3>
            {result.llm_analysis.startsWith('LLM analysis unavailable') ? (
              <p className="llm-unavailable">{result.llm_analysis}</p>
            ) : (
              <LLMCard text={result.llm_analysis} />
            )}
          </div>

          <button className="reset-btn" onClick={() => { setResult(null); setResume(null); setJd(''); }}>
            ↩ Analyze Another Resume
          </button>
        </section>
      )}

      <footer className="footer">
        Built by <a href="https://github.com/Goyamjain06" target="_blank" rel="noreferrer">Goyam Jain</a> · Open Source on GitHub
      </footer>
    </div>
  );
}
