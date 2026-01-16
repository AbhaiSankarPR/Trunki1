import React, { useState, useEffect, useRef } from 'react';
import './styles/assessment.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOTAL_LEVELS = 10;
const QUESTIONS_PER_LEVEL = 4;

const AssessmentGame = () => {
  const [state, setState] = useState('welcome'); // welcome, playing, completed
  const [level, setLevel] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const [results, setResults] = useState([]);

  // Fetch questions (demo fallback included)
  const fetchQuestions = async (lvl) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/level/${lvl}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, child_age: profile?.age || 8 })
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setQuestions(data.questions);
      setQIndex(0);
    } catch {
      setQuestions(generateDemoQuestions(lvl));
    } finally { setLoading(false); }
  };

  const startGame = (child) => {
    setProfile(child);
    setState('playing');
    fetchQuestions(1);
  };

  const completeQuestion = async (qData, metrics) => {
    const result = { level, qIndex, ...qData, ...metrics, timestamp: new Date().toISOString() };
    setResults(prev => [...prev, result]);

    // Send to backend
    try {
      await fetch(`${API_BASE_URL}/api/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, ...result })
      });
    } catch (err) { console.error('Save error:', err); }

    if (qIndex < QUESTIONS_PER_LEVEL - 1) setQIndex(qIndex + 1);
    else if (level < TOTAL_LEVELS) {
      setLevel(level + 1);
      fetchQuestions(level + 1);
    } else completeGame();
  };

  const completeGame = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, results })
      });
      const analysis = await res.json();
      sessionStorage.setItem('analysis', JSON.stringify(analysis));
    } catch (err) { console.error('Analysis error:', err); }
    setState('completed');
  };

  if (state === 'welcome') return <WelcomeScreen onStart={startGame} />;
  if (state === 'completed') return <ResultsScreen sessionId={sessionId} results={results} />;
  if (loading) return <div className="loading-screen">Loading Level {level}...</div>;

  return (
    <div className="game-container">
      <GameHeader level={level} qIndex={qIndex} total={QUESTIONS_PER_LEVEL} />
      {questions[qIndex] && <QuestionRenderer question={questions[qIndex]} onComplete={completeQuestion} />}
    </div>
  );
};

// -------------------- WELCOME SCREEN --------------------
const WelcomeScreen = ({ onStart }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);

  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <div className="icon-container">
          <span className="main-icon">🧠</span>
          <span className="sparkle">✨</span>
        </div>
        <h1>Adventure Quest</h1>
        <div className="form-group">
          <label>Name</label>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <select value={age} onChange={e => setAge(Number(e.target.value))}>
            {[5,6,7,8,9,10,11,12].map(a => <option key={a} value={a}>{a} yrs</option>)}
          </select>
        </div>
        <button className="start-button" onClick={() => onStart({name, age})} disabled={!name}>
          ▶️ Start
        </button>
      </div>
    </div>
  );
};

// -------------------- QUESTION RENDERER --------------------
const QuestionRenderer = ({ question, onComplete }) => {
  switch(question.type){
    case 'mcq': return <MCQQuestion question={question} onComplete={onComplete} />;
    case 'match': return <MatchQuestion question={question} onComplete={onComplete} />;
    case 'memory': return <MemoryQuestion question={question} onComplete={onComplete} />;
    case 'gesture': return <GestureQuestion question={question} onComplete={onComplete} />;
    default: return <div>Unknown question type</div>;
  }
};

// -------------------- GAME HEADER --------------------
const GameHeader = ({ level, qIndex, total }) => (
  <div className="game-header">
    <div className="level-info">
      <div className="level-badge">Level {level}</div>
      <div className="question-counter">Q{qIndex+1}/{total}</div>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{width:`${((qIndex+1)/total)*100}%`}}></div>
    </div>
  </div>
);

// -------------------- MCQ --------------------
const MCQQuestion = ({ question, onComplete }) => {
  const [sel, setSel] = useState(null);
  const start = Date.now();

  const handleSubmit = () => {
    const correct = sel === question.correct_answer;
    onComplete({ selected: sel, correct }, { time_taken: Date.now()-start });
  };

  return (
    <div className="question-card">
      <div className="question-text">{question.question}</div>
      <div className="options-grid">
        {question.options.map((opt,i)=>(
          <button
            key={i}
            className={`option-button ${sel===i?'selected':''}`}
            onClick={()=>setSel(i)}
          >
            <span className="option-label">{String.fromCharCode(65+i)}</span>
            <span className="option-text">{opt}</span>
          </button>
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit} disabled={sel===null}>Submit</button>
    </div>
  );
};

// -------------------- MATCH --------------------
const MatchQuestion = ({ question, onComplete }) => (
  <div className="question-card">Match Question Placeholder</div>
);

// -------------------- MEMORY --------------------
const MemoryQuestion = ({ question, onComplete }) => (
  <div className="question-card">Memory Question Placeholder</div>
);

// -------------------- GESTURE --------------------
const GestureQuestion = ({ question, onComplete }) => {
  const videoRef = useRef(null);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video:true});
        videoRef.current.srcObject = stream;
      } catch { console.error('Camera error'); }
    };
    startCamera();
  }, []);

  const handleDetect = () => {
    setDetected(true);
    onComplete({ gesture_detected: question.target_gesture }, { time_taken: 3000 });
  };

  return (
    <div className="question-card">
      <div className="gesture-instruction">{question.question} - Show: {question.target_gesture}</div>
      <div className="camera-container">
        <video ref={videoRef} autoPlay playsInline className={`camera-feed ${detected?'detected':''}`} />
      </div>
      {!detected && <button className="skip-button" onClick={handleDetect}>Simulate Detection</button>}
      {detected && <p>✅ Detected!</p>}
    </div>
  );
};

// -------------------- RESULTS --------------------
const ResultsScreen = ({ sessionId, results }) => {
  const analysis = JSON.parse(sessionStorage.getItem('analysis')||"{}");

  return (
    <div className="results-screen">
      <div className="results-card">
        <div className="trophy-icon">🏆</div>
        <h1>Adventure Complete!</h1>
        <p>Questions answered: {results.length}</p>
        <p>Session: {sessionId}</p>

        <div className="stats-grid">
          {results.map((r,i)=>(
            <div key={i} className="stat-item">
              <div className="stat-value">{r.correct?'✔️':'❌'}</div>
              <div className="stat-label">Q{i+1}</div>
            </div>
          ))}
        </div>

        <pre>{JSON.stringify(analysis,null,2)}</pre>
        <button className="restart-button" onClick={()=>window.location.reload()}>Restart</button>
      </div>
    </div>
  );
};

// -------------------- DEMO QUESTIONS --------------------
const generateDemoQuestions = (level) => ([
  {type:'mcq', question:`${level}+${level}?`, options:[level,level+1,level+2,level+3], correct_answer:1},
  {type:'match', question:'Match shapes', left_items:['⭐','⚫'], right_items:['Circle','Star'], correct_matches:{0:1,1:0}},
  {type:'memory', question:'Remember items', items_to_remember:['🍎','🚗'], all_items:['🍎','🚗','⚽']},
  {type:'gesture', question:'Show gesture', target_gesture:'✌️'}
]);

export default AssessmentGame;
