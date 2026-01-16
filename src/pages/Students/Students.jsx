import React, { useState, useEffect } from "react";
import { Gamepad2 } from "lucide-react";

const StudentPlay = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(4);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex bg-pink-500 text-white">

      {/* LEFT SIDE – ICON AREA */}
      <div className="w-1/2 flex items-center justify-center bg-pink-600">
        <Gamepad2 size={180} strokeWidth={1.5} />
      </div>

      {/* RIGHT SIDE – CONTENT */}
      <div className="w-1/2 flex items-center justify-center relative px-10">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-4xl font-extrabold text-center">
              Are you ready<br />for the game? 🎮
            </h1>

            <button
              onClick={() => setStep(2)}
              className="absolute bottom-8 right-8 bg-white text-pink-600 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              Start →
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white text-pink-600 p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-center">
              What’s your name? 😊
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              disabled={!name}
              onClick={() => setStep(3)}
              className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              Continue →
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center animate-pulse">
            <h1 className="text-4xl font-extrabold mb-3">
              Get Ready, {name}! 🚀
            </h1>
            <p className="text-lg">Loading your game...</p>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4">
              Quiz Time! 🧠
            </h1>
            <p className="mb-6">Let’s begin, {name} 🎉</p>

            <div className="bg-white text-pink-600 p-6 rounded-xl">
              Quiz Component Goes Here
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentPlay;
