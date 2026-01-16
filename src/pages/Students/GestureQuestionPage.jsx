import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

/* 🔹 Send metrics to FastAPI */
const saveMetrics = async (metrics) => {
  try {
    await fetch("http://localhost:8000/api/gesture-test/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics),
    });
  } catch (err) {
    console.error("Backend error:", err);
  }
};

/* 🔹 Finger helpers */
const isFingerExtended = (tip, pip, mcp) => {
  return tip.y < pip.y && pip.y < mcp.y;
};

const isFingerFolded = (tip, pip) => {
  return tip.y > pip.y;
};

/* 🔹 Detect ✌️ gesture */
const isTwoGesture = (hand) => {
  if (!hand || hand.length !== 21) return false;

  const indexUp = isFingerExtended(hand[8], hand[6], hand[5]);
  const middleUp = isFingerExtended(hand[12], hand[10], hand[9]);
  const ringDown = isFingerFolded(hand[16], hand[14]);
  const pinkyDown = isFingerFolded(hand[20], hand[18]);

  return indexUp && middleUp && ringDown && pinkyDown;
};

export default function GestureQuestionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);

  const stableCounter = useRef(0);

  const metricsRef = useRef({
    startTime: null,
    lastSeen: Date.now(),
    attentionLoss: 0,
    lowConfidence: 0,
  });

  const [status, setStatus] = useState("waiting");
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);

  /* 🔹 MediaPipe callback */
  const onResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 640, 480);
    ctx.drawImage(results.image, 0, 0, 640, 480);

    if (results.multiHandLandmarks?.length) {
      const landmarks = results.multiHandLandmarks[0];
      metricsRef.current.lastSeen = Date.now();

      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 2,
      });
      drawLandmarks(ctx, landmarks, {
        color: "#FF0000",
        radius: 3,
      });

      // confidence
      const confidence = results.multiHandedness?.[0]?.score || 1;
      if (confidence < 0.6) metricsRef.current.lowConfidence++;

      // debug overlay
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(10, 10, 260, 90);
      ctx.fillStyle = "#00ff00";
      ctx.font = "14px Arial";
      ctx.fillText(`Index: ${isFingerExtended(landmarks[8], landmarks[6], landmarks[5])}`, 20, 35);
      ctx.fillText(`Middle: ${isFingerExtended(landmarks[12], landmarks[10], landmarks[9])}`, 20, 55);
      ctx.fillText(`Ring: ${isFingerFolded(landmarks[16], landmarks[14])}`, 20, 75);

      // gesture logic
      if (status === "detecting" && isTwoGesture(landmarks)) {
        stableCounter.current++;

        if (stableCounter.current > 10) {
          const end = Date.now();
          const metrics = {
            timeTaken: ((end - metricsRef.current.startTime) / 1000).toFixed(2),
            isCorrect: true,
            attentionLost: metricsRef.current.attentionLoss,
            sluggishness: metricsRef.current.lowConfidence,
          };

          console.log("SUCCESS:", metrics);
          saveMetrics(metrics);
          setStatus("success");
          cameraRef.current?.stop();
        }
      } else {
        stableCounter.current = 0;
      }
    } else if (status === "detecting") {
      if (Date.now() - metricsRef.current.lastSeen > 600) {
        metricsRef.current.attentionLoss++;
        metricsRef.current.lastSeen = Date.now();
      }
    }
  };

  /* 🔹 Init MediaPipe */
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults(onResults);
    handsRef.current = hands;

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera
      .start()
      .then(() => setCameraReady(true))
      .catch((err) => setError("Camera permission denied"));

    cameraRef.current = camera;

    return () => {
      camera.stop();
      hands.close();
    };
  }, []);

  const startTest = () => {
    metricsRef.current = {
      startTime: Date.now(),
      lastSeen: Date.now(),
      attentionLoss: 0,
      lowConfidence: 0,
    };
    stableCounter.current = 0;
    setStatus("detecting");
  };

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-4">
          Show ✌️ (Number 2)
        </h1>

        {!cameraReady && (
          <p className="text-center text-gray-500">Starting camera...</p>
        )}

        <div className="flex justify-center">
          <video ref={videoRef} autoPlay playsInline className="hidden" />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="border rounded"
          />
        </div>

        <div className="text-center mt-4">
          {status === "waiting" && (
            <button
              onClick={startTest}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
            >
              Start Test
            </button>
          )}

          {status === "detecting" && (
            <p className="text-blue-600 font-semibold animate-pulse">
              Detecting gesture...
            </p>
          )}

          {status === "success" && (
            <p className="text-green-600 font-bold">
              ✅ Gesture Detected!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}