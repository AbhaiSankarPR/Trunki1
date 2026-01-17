import React, { useState, useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";


const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const TOTAL_LEVELS = 10;
const QUESTIONS_PER_LEVEL = 4;

/* ---------------- MAIN GAME COMPONENT ---------------- */
const AssessmentGame = () => {
  const [level, setLevel] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [state, setState] = useState("playing");

  const sessionId = useRef(`session_${Date.now()}`).current;

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
        data.questions = generateDemoQuestions(lvl);
      }
      const shuffled = [...data.questions].sort(() => 0.5 - Math.random()).slice(0, QUESTIONS_PER_LEVEL);
      setQuestions(shuffled);
      setQIndex(0);
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-6xl mb-6 animate-bounce">🧠</div>
        <div className="font-sans text-3xl font-bold tracking-wide text-pink-600">
          Loading Level {level}…
        </div>
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-2 bg-pink-500 animate-pulse"
            style={{ width: `${Math.min((level / TOTAL_LEVELS) * 100, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  if (state === "completed") return <ResultsScreen results={results} />;
  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-xl text-gray-600">Preparing...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        <GameHeader level={level} qIndex={qIndex} total={QUESTIONS_PER_LEVEL} />
        <QuestionRenderer question={questions[qIndex]} onComplete={completeQuestion} />
      </div>
    </div>
  );
};

/* ---------------- UI COMPONENTS ---------------- */
const GameHeader = ({ level, qIndex, total }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-3">
      <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-bold text-sm">
        Level {level}
      </span>
      <span className="text-sm text-gray-600 font-medium">
        Question {qIndex + 1} of {total}
      </span>
    </div>
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" 
        style={{ width: `${((qIndex + 1) / total) * 100}%` }} 
      />
    </div>
  </div>
);

const QuestionRenderer = ({ question, onComplete }) => {
  if (question.type === "mcq") return <MCQQuestion question={question} onComplete={onComplete} />;
  if (question.type === "gesture") return <GestureQuestionWithCamera question={question} onComplete={onComplete} />;
  if (question.type === "memory") return <MemoryQuestion question={question} onComplete={onComplete} />;
  return <div className="text-center text-gray-600">Unsupported question type</div>;
};

/* ---------------- MCQ ---------------- */
const MCQQuestion = ({ question, onComplete }) => {
  const [selected, setSelected] = useState(null);
  const startTime = useRef(Date.now()).current;
  
  const handleSubmit = () => {
    if (selected === null) return;
    onComplete(
      { selected, correct: selected === question.correct_answer },
      { time_taken: Date.now() - startTime }
    );
  };

  return (
    <div className="font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        {question.question}
      </h2>
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              selected === i
                ? "bg-pink-100 border-pink-500 shadow-md transform scale-[1.02]"
                : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
            }`}
          >
            <span className="font-bold text-pink-600 mr-3 text-lg">
              {String.fromCharCode(65 + i)}.
            </span>
            <span className="text-gray-800">{opt}</span>
          </button>
        ))}
      </div>
      <button
        disabled={selected === null}
        onClick={handleSubmit}
        className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200"
      >
        Submit Answer
      </button>
    </div>
  );
};

/* ---------------- MEMORY ---------------- */
const MemoryQuestion = ({ question, onComplete }) => {
  const [shown, setShown] = useState(true);
  const [input, setInput] = useState("");
  const startTime = useRef(Date.now()).current;

  useEffect(() => {
    const timer = setTimeout(() => setShown(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    onComplete(
      { input, correct: input.trim().toLowerCase() === question.answer.toLowerCase() },
      { time_taken: Date.now() - startTime }
    );
  };

  return (
    <div className="font-sans text-gray-800 text-center">
      {shown ? (
        <div className="py-12">
          <p className="text-lg text-gray-600 mb-4">Remember this:</p>
          <div className="text-5xl font-bold text-pink-600 mb-4 animate-pulse">
            {question.memory}
          </div>
          <p className="text-sm text-gray-500">Memorize it carefully...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 py-8">
          <p className="text-xl font-semibold text-gray-700 mb-2">
            What did you see?
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="border-2 border-gray-300 rounded-xl px-6 py-3 w-full max-w-md text-center text-xl focus:border-pink-500 focus:outline-none"
            placeholder="Type here..."
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="py-3 px-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- GESTURE (Camera + MediaPipe) ---------------- */
const GestureQuestionWithCamera = ({ question, onComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [countdown, setCountdown] = useState(3);
  const [status, setStatus] = useState("waiting");
  const [liveGesture, setLiveGesture] = useState("—");

  const stableFrames = useRef(0);
  const startTime = useRef(Date.now()).current;

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      // Draw hand skeleton
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
            color: "#ec4899",
            lineWidth: 4,
          });
          drawLandmarks(ctx, landmarks, {
            color: "#7c3aed",
            lineWidth: 2,
          });
        }
      }

      if (countdown > 0) return;

      if (results.multiHandLandmarks?.length) {
        const detected = detectGesture(results.multiHandLandmarks[0]);
        setLiveGesture(detected);

        if (detected === question.target_gesture) {
          stableFrames.current += 1;
          setStatus("detecting");

          if (stableFrames.current >= 15) {
            onComplete(
              { correct: true, gesture: detected },
              { time_taken: Date.now() - startTime }
            );
          }
        } else {
          stableFrames.current = 0;
          setStatus("wrong");
        }
      } else {
        setLiveGesture("—");
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
    return () => camera.stop();
  }, [countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="text-center font-sans">
      <p className="text-xl font-bold mb-2">
        Show this gesture
      </p>

      <div className="text-6xl mb-3">
        {question.target_gesture}
      </div>

      <div className="relative border-4 border-pink-300 rounded-xl overflow-hidden">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} width={640} height={480} />
        {countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-pink-500 bg-white/70">
            {countdown}
          </div>
        )}
      </div>

      <div className="mt-4 text-lg font-semibold">
        Detected: <span className="text-pink-600">{liveGesture}</span>
      </div>

      <div className="mt-2 font-semibold">
        {status === "waiting" && "Get ready…"}
        {status === "detecting" && "Hold steady…"}
        {status === "wrong" && "Wrong gesture"}
      </div>

      <button
        onClick={() =>
          onComplete(
            { manual: true, correct: false },
            { time_taken: Date.now() - startTime }
          )
        }
        className="mt-4 w-full py-3 bg-gray-300 rounded-xl font-semibold"
      >
        Skip Gesture
      </button>
    </div>
  );
};

const detectGesture = (lm) => {
  const isUp = (tip, pip) => lm[tip].y < lm[pip].y;

  const thumbUp = lm[4].x > lm[3].x; // right hand assumption
  const indexUp = isUp(8, 6);
  const middleUp = isUp(12, 10);
  const ringUp = isUp(16, 14);
  const pinkyUp = isUp(20, 18);

  const fingers = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;

  if (fingers === 4 && thumbUp) return "✋";
  if (indexUp && middleUp && !ringUp && !pinkyUp) return "✌️";
  if (thumbUp && fingers === 0) return "👍";

  return "unknown";
};



/* ---------------- RESULTS SCREEN ---------------- */
const ResultsScreen = ({ results }) => {
  const correctCount = results.filter(r => r.correct).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl text-center">
        <div className="text-6xl mb-6">
          {percentage >= 80 ? '🌟' : percentage >= 60 ? '🎉' : '💪'}
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Assessment Complete!
        </h1>
        <div className="text-5xl font-bold text-pink-600 mb-6">
          {correctCount} / {totalQuestions}
        </div>
        <div className="text-2xl text-gray-600 mb-8">
          {percentage}% Correct
        </div>
        
        <div className="grid grid-cols-10 gap-2 mb-8 max-w-xl mx-auto">
          {results.map((r, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg font-bold flex items-center justify-center text-sm ${
                r.correct
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              title={`Level ${r.level}, Q${r.qIndex + 1}: ${r.correct ? 'Correct' : 'Incorrect'}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

/* ---------------- DEMO QUESTIONS ---------------- */
const generateDemoQuestions = (level) => {
  const questions = [];
  
  // MCQ Questions
  questions.push({
    type: "mcq",
    question: `What is ${level} + ${level + 1}?`,
    options: [level, level * 2, level + level + 1, level + 3],
    correct_answer: 2
  });
  
  questions.push({
    type: "mcq",
    question: `Which number is larger?`,
    options: [`${level}`, `${level + 5}`, `${level - 1}`, `${level + 2}`],
    correct_answer: 1
  });

  // Memory Question
  questions.push({
    type: "memory",
    memory: `${level}-${level + 3}`,
    answer: `${level}-${level + 3}`
  });

  // Gesture Question
  questions.push({
    type: "gesture",
    target_gesture: ["✋", "✌️", "👍"][level % 3]
  });

  return questions;
};

export default AssessmentGame;
