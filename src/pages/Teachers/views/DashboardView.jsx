import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { performanceData, studentList } from "../dashboardData";
import StatCard from "../components/StatCard";
import StudentRow from "../components/StudentRow";
import { createRoom } from "../../../api/teacher";

const DashboardView = () => {
  const [roomData, setRoomData] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [copied, setCopied] = useState(false);

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("teacher_token");
      const room = await createRoom(token);

      setRoomData(room);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Error creating room");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <button
          onClick={handleCreateRoom}
          className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
        >
          + New Session
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Students" value="42" />
        <StatCard title="Tests Completed" value="38" />
        <StatCard title="At-Risk Alerts" value="6" />
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Recent Students
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th>Number</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student, index) => (
                <StudentRow key={index} {...student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PERFORMANCE CHART */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Student Risk Distribution
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Overview of academic standing across all classes
        </p>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="students" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROOM CREATED MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Session Created
            </h2>

            <p className="text-gray-500 mb-2">Share this room code:</p>

            <div className="bg-gray-100 rounded-lg py-3 px-4 mb-6 flex items-center justify-between">
  <span className="text-2xl font-mono font-bold text-pink-600 select-all">
    {roomData?.room_code}
  </span>

  <button
    onClick={async () => {
      await navigator.clipboard.writeText(roomData?.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }}
    className="text-gray-500 hover:text-pink-600 transition-colors"
    title="Copy to clipboard"
  >
    {copied ? <Check size={22} /> : <Copy size={22} />}
  </button>
</div>


            <button
              onClick={() => setShowModal(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
