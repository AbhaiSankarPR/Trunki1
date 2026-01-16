import React, { useState } from "react";
import { Search, Filter, MoreVertical, Mail } from "lucide-react";
import { studentList } from "../dashboardData";

const StudentsView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic: Match name or phone number
  const filteredStudents = studentList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.number.includes(searchTerm)
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Directory</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={18} /> Filter
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors">
            + Add Student
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or phone number..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* STUDENT LIST TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-gray-500 uppercase text-xs font-semibold tracking-wider">
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Avg Score</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.number}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold
                      ${
                        student.status === "At Risk"
                          ? "bg-red-100 text-red-600"
                          : student.status === "Monitor"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{student.score}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="p-1 hover:text-pink-500 hover:bg-pink-50 rounded">
                        <Mail size={18} />
                      </button>
                      <button className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No students found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentsView;