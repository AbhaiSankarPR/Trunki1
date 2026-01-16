import React, { useState, useEffect } from "react";
import mascot from "../../assets/imagesvg.png";
import AssessmentGame from "./assesmentPage";

const StudentPlay = () => {
  const [step, setStep] = useState(1);
  const [classnumber, setClassNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentName] = useState("Player"); // safe default

  /* Auto move from loading → game */
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        setStep(5);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex bg-pink-500 text-white">

      {/* LEFT SIDE – MASCOT */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-pink-600">
        <img
          src={mascot}
          alt="Game Mascot"
          className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl"
        />
      </div>

      {/* RIGHT SIDE – CONTENT */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 relative">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight">
              Are you ready <br /> for the game? 🎮
            </h1>

            <button
              onClick={() => setStep(2)}
              className="bg-white text-pink-600 px-8 py-4 rounded-full 
                         font-bold shadow-lg hover:scale-105 transition"
            >
              Start →
            </button>
          </div>
        )}

        {/* STEP 2 – CLASS CODE */}
        {step === 2 && (
          <div className="bg-white text-pink-600 p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              What’s your Class Code?
            </h2>

            <input
              type="text"
              value={classnumber}
              onChange={(e) => setClassNumber(e.target.value)}
              placeholder="Enter class code"
              className="w-full px-4 py-3 rounded-lg border text-lg
                         focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              disabled={!classnumber}
              onClick={() => setStep(3)}
              className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg
                         font-bold disabled:opacity-50"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 3 – ROLL NUMBER */}
        {step === 3 && (
          <div className="bg-white text-pink-600 p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              What’s your Roll Number?
            </h2>

            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter roll number"
              className="w-full px-4 py-3 rounded-lg border text-lg
                         focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              disabled={!rollNumber}
              onClick={() => setStep(4)}
              className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg
                         font-bold disabled:opacity-50"
            >
              Start Game →
            </button>
          </div>
        )}

        {/* STEP 4 – LOADING */}
        {step === 4 && (
          <div className="text-center animate-pulse space-y-3">
            <h1 className="text-4xl font-extrabold">
              Get Ready, {studentName}! 🚀
            </h1>
            <p className="text-lg">Loading your game…</p>
          </div>
        )}

        {/* STEP 5 – GAME */}
        {step === 5 && (
          <div className="w-full h-full">
            <AssessmentGame />
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentPlay;
