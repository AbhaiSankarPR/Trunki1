import React from 'react';
import { Link } from 'react-router-dom';
import GestureQuestionPage from "../mediapipe/components/GestureQuestionPage";


function TestPage() {
  return (
    <div>
      {/* Optional: Add a back button */}
      <div className="absolute top-4 left-4 z-10">
        <Link 
          to="/"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          ← Back to Home
        </Link>
      </div>

      {/* The gesture recognition component */}
      <GestureQuestionPage />
    </div>
  );
}

export default TestPage;