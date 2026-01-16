import React from "react";
import { FileText, Download, TrendingUp, Calendar, Filter } from "lucide-react";

const ReportsView = () => {
  const reports = [
    { id: 1, name: "Monthly Performance Summary", date: "Jan 2026", type: "PDF" },
    { id: 2, name: "At-Risk Student Detailed Analysis", date: "Jan 12, 2026", type: "CSV" },
    { id: 3, name: "Class Attendance & Engagement", date: "Dec 2025", type: "PDF" },
    { id: 4, name: "Mid-Term Exam Results Breakdown", date: "Nov 2025", type: "XLSX" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors">
          <TrendingUp size={18} /> Generate New Report
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ReportMetric label="Avg. Class Score" value="74%" change="+3%" positive />
        <ReportMetric label="Completion Rate" value="92%" change="+1.5%" positive />
        <ReportMetric label="At-Risk Growth" value="12%" change="+2%" positive={false} />
        <ReportMetric label="Active Sessions" value="156" change="0%" />
      </div>

      {/* RECENT REPORTS LIST */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Available Downloads</h2>
          <button className="text-gray-500 hover:text-pink-600 flex items-center gap-1 text-sm font-medium">
            <Filter size={14} /> Filter by Date
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {reports.map((report) => (
            <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{report.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {report.date}
                    </span>
                    <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {report.type}
                    </span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-pink-600 border border-pink-200 px-4 py-2 rounded-lg hover:bg-pink-50 font-medium transition-all">
                <Download size={16} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for small metrics
const ReportMetric = ({ label, value, change, positive }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-gray-500 text-sm">{label}</p>
    <div className="flex items-end justify-between mt-1">
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        change === "0%" ? "bg-gray-100 text-gray-500" : 
        positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      }`}>
        {change}
      </span>
    </div>
  </div>
);

export default ReportsView;