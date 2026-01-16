import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOTAL_LEVELS = 10;
const QUESTIONS_PER_LEVEL = 4;

const AssessmentGame = () => {
  const [level, setLevel] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [state, setState] = useState("playing");

  const sessionId = `session_${Date.now()}`;

  /* ---------------- FETCH QUESTIONS ---------------- */
  const fetchQuestions = async (lvl) => {
    setLoading(true);

    try {
      let data = { questions: [] };

      try {
        const res = await fetch(`${API_BASE_URL}/api/level/${lvl}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, child_age: 8 }),
        });

        if (!res.ok) throw new Error();
        data = await res.json();
      } catch {
        // fallback to demo questions
        data.questions = generateDemoQuestions(lvl);
      }

      // Shuffle questions for variety
      const shuffled = [...data.questions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setQIndex(0);

      // Small delay to show loading screen
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ON COMPONENT MOUNT ---------------- */
  useEffect(() => {
    fetchQuestions(1);
  }, []);

  /* ---------------- COMPLETE QUESTION ---------------- */
  const completeQuestion = (qData, metrics) => {
    setResults((prev) => [...prev, { level, qIndex, ...qData, ...metrics }]);

    if (qIndex < QUESTIONS_PER_LEVEL - 1) {
      setQIndex((p) => p + 1);
    } else if (level < TOTAL_LEVELS) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      fetchQuestions(nextLevel);
    } else {
      setState("completed");
    }
  };

  /* ---------------- LOADING SCREEN ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-6 animate-bounce">🧠</div>

        <div className="font-sans text-3xl font-bold tracking-wide text-pink-600">
          Loading Level {level}…
        </div>

        <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-2 bg-pink-500 animate-pulse"
            style={{
              width: `${Math.min((level / TOTAL_LEVELS) * 100, 100)}%`,
            }}
          />
        </div>

        <div className="mt-3 text-sm text-gray-500 tracking-widest uppercase">
          Please wait…
        </div>
      </div>
    );
  }

  /* ---------------- COMPLETED SCREEN ---------------- */
  if (state === "completed") {
    return <ResultsScreen results={results} />;
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black font-semibold">
        Preparing questions…
      </div>
    );
  }

  /* ---------------- GAME SCREEN ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">
        <GameHeader level={level} qIndex={qIndex} total={QUESTIONS_PER_LEVEL} />
        <QuestionRenderer question={questions[qIndex]} onComplete={completeQuestion} />
      </div>
    </div>
  );
};

/* ---------------- HEADER ---------------- */
const GameHeader = ({ level, qIndex, total }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 font-semibold text-sm">
        Level {level}
      </span>
      <span className="text-sm text-gray-600">
        Question {qIndex + 1}/{total}
      </span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-pink-500 rounded-full transition-all"
        style={{ width: `${((qIndex + 1) / total) * 100}%` }}
      />
    </div>
  </div>
);

/* ---------------- QUESTION ROUTER ---------------- */
const QuestionRenderer = ({ question, onComplete }) => {
  if (question.type === "mcq") {
    return <MCQQuestion question={question} onComplete={onComplete} />;
  }

  if (question.type === "gesture") {
    return <GestureQuestion question={question} onComplete={onComplete} />;
  }

  if (question.type === "memory") {
    return <MemoryQuestion question={question} onComplete={onComplete} />;
  }

  return (
    <div className="text-center text-black font-semibold">
      Unsupported question type
    </div>
  );
};

/* ---------------- MCQ ---------------- */
const MCQQuestion = ({ question, onComplete }) => {
  const [selected, setSelected] = useState(null);
  const startTime = Date.now();

  return (
    <div className="font-serif text-black">
      <h2 className="text-lg font-semibold mb-4 text-center text-black">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full p-3 rounded-lg border text-left transition text-black ${
              selected === i
                ? "bg-pink-100 border-pink-400 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={selected === null}
        onClick={() =>
          onComplete(
            { selected, correct: selected === question.correct_answer },
            { time_taken: Date.now() - startTime }
          )
        }
        className="mt-6 w-full py-3 rounded-lg bg-pink-500 text-white font-semibold disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
};

/* ---------------- MEMORY ---------------- */
const MemoryQuestion = ({ question, onComplete }) => {
  const [shown, setShown] = useState(true);
  const [input, setInput] = useState("");
  const startTime = Date.now();

  useEffect(() => {
    const timer = setTimeout(() => setShown(false), 2000); // show memory for 2s
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    const correct = input.trim() === question.answer;
    onComplete({ input, correct }, { time_taken: Date.now() - startTime });
  };

  return (
    <div className="font-serif text-black text-center">
      {shown ? (
        <div className="text-2xl font-bold mb-4">{question.memory}</div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full max-w-xs text-black"
            placeholder="Type what you saw"
          />
          <button
            onClick={handleSubmit}
            className="py-2 px-6 bg-pink-500 text-white rounded-lg font-semibold"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- GESTURE ---------------- */
const GestureQuestion = ({ question, onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {});
  }, []);

  return (
    <div className="text-center font-serif text-black">
      <p className="mb-4 font-semibold">
        Show this gesture: <span className="text-2xl">{question.target_gesture}</span>
      </p>

      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border mb-4" />

      <button
        onClick={() => onComplete({ gesture: question.target_gesture }, { time_taken: 3000 })}
        className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold"
      >
        Detect Gesture
      </button>
    </div>
  );
};

/* ---------------- RESULTS ---------------- */
const ResultsScreen = ({ results }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white rounded-xl shadow p-8 w-[420px] text-center font-serif text-black">
      <div className="text-4xl mb-2">🏁</div>
      <h1 className="text-2xl font-semibold mb-4">Assessment Complete</h1>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {results.map((r, i) => (
          <div
            key={i}
            className={`py-2 rounded-lg font-semibold ${
              r.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold"
      >
        Restart
      </button>
    </div>
  </div>
);

/* ---------------- DEMO QUESTIONS ---------------- */
const generateDemoQuestions = (level) => [
  {
    type: "mcq",
    question: `${level} + ${level + 1} = ?`,
    options: [level, level * 2, level + level + 1, level + 3],
    correct_answer: 2,
  },
  {
    type: "mcq",
    question: `${level + 5} − ${level} = ?`,
    options: [3, 5, level, level + 2],
    correct_answer: 1,
  },
  {
    type: "mcq",
    question: `What comes next? ${level}, ${level + 2}, ${level + 4}, ?`,
    options: [level + 5, level + 6, level + 8, level + 10],
    correct_answer: 1,
  },
  {
    type: "memory",
    memory: `Remember: ${level}-${level + 3}-${level + 5}`,
    answer: `${level}-${level + 3}-${level + 5}`,
  },
  {
    type: "gesture",
    question: "Show gesture",
    target_gesture: ["✋", "✌️", "👌", "👍"][level % 4],
  },
];

export default AssessmentGame;
