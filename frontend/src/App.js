import React, { useState, useRef } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

// ── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 58, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong Match' : score >= 45 ? 'Moderate Match' : 'Weak Match';
  const bg = score >= 70 ? 'rgba(16,185,129,0.1)' : score >= 45 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return (
    <div className="score-ring-wrap" style={{ background: bg }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle cx="75" cy="75" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 75 75)" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
        <text x="75" y="68" textAnchor="middle" fill="white" fontSize="26" fontWeight="800">{score}%</text>
        <text x="75" y="88" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">Match Score</text>
      </svg>
      <div className="score-label" style={{ color }}>{label}</div>
    </div>
  );
}

// ── Keyword Chips ────────────────────────────────────────────────────────────
function Chips({ keywords, type }) {
  if (!keywords?.length) return null;
  return (
    <div className="chip-group">
      {keywords.map((k, i) => <span key={i} className={`chip chip-${type}`}>{k}</span>)}
    </div>
  );
}

// ── LLM Analysis ─────────────────────────────────────────────────────────────
function LLMCard({ text }) {
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div className="llm-body">
      {lines.map((line, i) => {
        const clean = line.replace(/\*\*/g, '');
        if (line.startsWith('**') || /^\d+\./.test(line) && line.length < 60)
          return <h4 key={i} className="llm-h">{clean}</h4>;
        if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• '))
          return <p key={i} className="llm-li">→ {line.slice(2)}</p>;
        return <p key={i} className="llm-p">{clean}</p>;
      })}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const analyzeRef = useRef();

  const handleFile = f => {
    if (f?.type === 'application/pdf') { setResume(f); setError(''); }
    else setError('Please upload a PDF file.');
  };

  const scrollToAnalyze = () => analyzeRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleAnalyze = async () => {
    if (!resume) return setError('Please upload your resume PDF.');
    if (!jd.trim()) return setError('Please paste the job description.');
    setError(''); setLoading(true); setResult(null);
    const form = new FormData();
    form.append('resume', resume);
    form.append('job_description', jd);
    try {
      await fetch(`${API_BASE}/health`).catch(() => {});
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST', body: form,
        signal: AbortSignal.timeout(90000)
      });
      const text = await res.text();
      if (!text) throw new Error('Server is waking up — please try again in 10 seconds.');
      let data;
      try { data = JSON.parse(text); } catch { throw new Error('Server is waking up — please try again in 10 seconds.'); }
      if (!res.ok) throw new Error(data.detail || 'Analysis failed.');
      setResult(data);
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      setError(e.name === 'TimeoutError' ? 'Request timed out — server waking up. Please retry.' : e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="app">
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ResumeAI</span>
        </div>
        <button className="nav-cta" onClick={scrollToAnalyze}>Try for Free →</button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">✨ Powered by Google Gemini AI</div>
        <h1 className="hero-h1">Is Your Resume <span className="grad">Good Enough</span> for the Job?</h1>
        <p className="hero-sub">
          Upload your resume and paste any job description — get an instant ATS match score,
          missing keyword analysis, and AI recruiter feedback in seconds.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={scrollToAnalyze}>Check My Resume Free →</button>
          <div className="hero-trust">
            <span>🔒 Private & Secure</span>
            <span>⚡ Results in &lt;30s</span>
            <span>🤖 Gemini AI Powered</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat"><span className="stat-n">3</span><span className="stat-l">AI Checks</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">100%</span><span className="stat-l">Free</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">&lt;30s</span><span className="stat-l">Analysis Time</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">PDF</span><span className="stat-l">Supported</span></div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how">
        <div className="section-label-top">HOW IT WORKS</div>
        <h2 className="section-h2">3 Simple Steps to a Better Resume</h2>
        <div className="steps-grid">
          {[
            { n: '01', icon: '📄', title: 'Upload Resume', desc: 'Drag & drop your PDF resume. We extract and analyze the full text.' },
            { n: '02', icon: '📋', title: 'Paste Job Description', desc: 'Copy the full JD from any job board — LinkedIn, Naukri, Indeed.' },
            { n: '03', icon: '🤖', title: 'Get AI Feedback', desc: 'Receive a match score, missing keywords, and recruiter-style suggestions.' },
          ].map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="section-label-top">WHAT YOU GET</div>
        <h2 className="section-h2">Everything You Need to Land the Interview</h2>
        <div className="features-grid">
          {[
            { icon: '📊', title: 'ATS Match Score', desc: 'See exactly how well your resume matches the job description with a percentage score.' },
            { icon: '🔑', title: 'Keyword Analysis', desc: 'Find the top keywords recruiters look for — and which ones are missing from your resume.' },
            { icon: '🧠', title: 'AI Recruiter Feedback', desc: 'Get detailed, actionable suggestions written from a senior recruiter\'s perspective.' },
          ].map(f => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ANALYZER SECTION ── */}
      <section className="analyzer" ref={analyzeRef} id="analyze">
        <div className="section-label-top">FREE TOOL</div>
        <h2 className="section-h2">Analyze Your Resume Now</h2>
        <p className="section-sub">No sign-up required. 100% free. Results in under 30 seconds.</p>

        <div className="analyzer-card">
          <div className="analyzer-grid">
            {/* Left: Upload */}
            <div className="upload-col">
              <label className="field-label">📄 Your Resume (PDF)</label>
              <div
                className={`drop-zone ${dragging ? 'drag-over' : ''} ${resume ? 'has-file' : ''}`}
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <input ref={fileRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files[0])} />
                {resume ? (
                  <div className="file-info">
                    <div className="file-thumb">PDF</div>
                    <div>
                      <div className="file-name">{resume.name}</div>
                      <div className="file-meta">{(resume.size / 1024).toFixed(1)} KB · PDF</div>
                    </div>
                    <button className="file-remove" onClick={e => { e.stopPropagation(); setResume(null); }}>✕</button>
                  </div>
                ) : (
                  <div className="drop-hint">
                    <div className="drop-icon-big">☁️</div>
                    <div className="drop-main">Drag & drop your resume here</div>
                    <div className="drop-or">— or —</div>
                    <div className="drop-browse">Browse File</div>
                    <div className="drop-note">PDF only · Max 5MB · Your data stays private</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: JD */}
            <div className="jd-col">
              <label className="field-label">📋 Job Description</label>
              <textarea
                className="jd-area"
                placeholder="Paste the full job description here…&#10;&#10;Include responsibilities, requirements, and qualifications for the best results."
                value={jd}
                onChange={e => setJd(e.target.value)}
                rows={10}
              />
            </div>
          </div>

          {error && <div className="error-box">⚠️ {error}</div>}

          <button className={`analyze-btn ${loading ? 'is-loading' : ''}`} onClick={handleAnalyze} disabled={loading}>
            {loading
              ? <><span className="spin" /> Analyzing… (may take ~30s on first run)</>
              : '🔍 Analyze My Resume — It\'s Free'}
          </button>
          <p className="analyzer-note">🔒 Your resume is never stored or shared.</p>
        </div>
      </section>

      {/* ── RESULTS ── */}
      {result && (
        <section className="results" id="results">
          <div className="section-label-top">YOUR RESULTS</div>
          <h2 className="section-h2">Here's How Your Resume Stacks Up</h2>

          <div className="results-top">
            {/* Score */}
            <div className="res-card score-card">
              <h3 className="res-card-title">Match Score</h3>
              <ScoreRing score={result.similarity_score} />
              <p className="score-hint">
                {result.similarity_score >= 70
                  ? '🎉 Great match! Your resume aligns well with this role.'
                  : result.similarity_score >= 45
                  ? '⚠️ Moderate match. Add missing keywords to improve.'
                  : '❌ Low match. Significant gaps — see suggestions below.'}
              </p>
            </div>

            {/* Keywords */}
            <div className="res-card kw-card">
              <div className="kw-section">
                <h3 className="res-card-title">✅ Top Job Keywords</h3>
                <Chips keywords={result.important_keywords} type="green" />
              </div>
              <div className="kw-divider" />
              <div className="kw-section">
                <h3 className="res-card-title">❌ Missing from Your Resume</h3>
                {result.missing_keywords.length === 0
                  ? <p className="all-good">🎉 All key terms found in your resume!</p>
                  : <>
                      <p className="missing-hint">Add these to improve your ATS score:</p>
                      <Chips keywords={result.missing_keywords} type="red" />
                    </>}
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="res-card ai-card">
            <div className="ai-header">
              <span className="ai-badge">🤖 AI</span>
              <h3 className="res-card-title">Recruiter-Style Feedback</h3>
            </div>
            {result.llm_analysis.startsWith('LLM analysis unavailable')
              ? <p className="llm-na">{result.llm_analysis}</p>
              : <LLMCard text={result.llm_analysis} />}
          </div>

          <div className="results-actions">
            <button className="btn-secondary" onClick={() => { setResult(null); setResume(null); setJd(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              ↩ Analyze Another Resume
            </button>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo"><span className="logo-icon">⚡</span> ResumeAI</div>
        <p>Built by <a href="https://github.com/Goyamjain06" target="_blank" rel="noreferrer">Goyam Jain</a> · Open source on <a href="https://github.com/Goyamjain06/ai-resume-analyzer" target="_blank" rel="noreferrer">GitHub</a></p>
        <p className="footer-note">Your resume data is never stored or shared.</p>
      </footer>
    </div>
  );
}
