import React, { useState, useEffect } from "react";
import { Gamepad2 } from "lucide-react";
import mascot from "../../assets/imagesvg.png"; // adjust path if needed


const StudentPlay = () => {
  const [step, setStep] = useState(1);
const [classnumber, setclass] = useState("");
const [number, setNumber] = useState("");

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
        <img
          src={mascot}
          alt="Game Mascot"
          className="max-w-[80%] max-h-[80%] object-contain drop-shadow-xl"
        />
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

   
    <h2 className="text-2xl font-bold mb-4 text-center">
      What’s Class Code? 
    </h2>

    <input
      type="tel"
      value={classnumber}
      onChange={(e) => setclass(e.target.value)}
      placeholder="Enter your Class Code"
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
{step === 3 && (
  <div className="bg-white text-pink-600 p-8 rounded-2xl shadow-xl w-full max-w-md">

   
    <h2 className="text-2xl font-bold mb-4 text-center">
      What’s your roll number? 
    </h2>

    <input
      type="tel"
      value={number}
      onChange={(e) => setNumber(e.target.value)}
      placeholder="Enter your roll number"
      className="w-full px-4 py-3 rounded-lg border text-lg 
                 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />

    <button
      disabled={!number}
      onClick={() => setStep(3)}
      className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg 
                 font-bold disabled:opacity-50"
    >
      Continue →
    </button>

  </div>
)}


        {/* STEP 3 */}
        {step === 4 && (
          <div className="text-center animate-pulse">
            <h1 className="text-4xl font-extrabold mb-3">
              Get Ready, {name}! 🚀
            </h1>
            <p className="text-lg">Loading your game...</p>
          </div>
        )}

        {/* STEP 4 */}
        {step === 5 && (
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
