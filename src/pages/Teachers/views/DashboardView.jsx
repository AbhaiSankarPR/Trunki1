import React from "react";
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
  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("teacher_token");

      const room = await createRoom(token);
      alert(`Room Created!\nRoom Code: ${room.room_code}`);

      // optional: store or redirect
      console.log(room);
    } catch (err) {
      alert("Error creating room");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={handleCreateRoom}
          className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
        >
          + New Session
        </button>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Students" value="42" />
        <StatCard title="Tests Completed" value="38" />
        <StatCard title="At-Risk Alerts" value="6" />
      </div>

      {/* RECENT STUDENTS TABLE */}
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
        <div className="flex flex-col mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Student Risk Distribution
          </h2>
          <p className="text-sm text-gray-500">
            Overview of academic standing across all classes
          </p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip
                cursor={{ fill: "#f9fafb" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="students"
                fill="#ec4899"
                radius={[6, 6, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
