import React, { useState } from "react";
import { Users, BarChart3, FileText, Settings } from "lucide-react";
import SidebarItem from "./components/SidebarItem";

import DashboardView from "./views/DashboardView";
import StudentsView from "./views/StudentsView"; 
import SettingsView from "./views/SettingsView";
import ReportsView from "./views/ReportsView";

const TeacherDashboard = () => {
  // 1. Initialize state with "Dashboard" as default
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 2. Helper to render the correct view based on state
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardView />;
      case "Students":
        return <StudentsView />;
      case "Reports":
        return <ReportsView/>;
      case "Settings":
        return <SettingsView/>;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 pt-12 h-screen bg-white shadow-md hidden md:flex flex-col fixed">
        <nav className="flex-1 px-4 py-6 space-y-3">
          <SidebarItem 
            icon={<BarChart3 />} 
            label="Dashboard" 
            active={activeTab === "Dashboard"} 
            onClick={() => setActiveTab("Dashboard")}
          />
          <SidebarItem 
            icon={<Users />} 
            label="Students" 
            active={activeTab === "Students"} 
            onClick={() => setActiveTab("Students")}
          />
          <SidebarItem 
            icon={<FileText />} 
            label="Reports" 
            active={activeTab === "Reports"} 
            onClick={() => setActiveTab("Reports")}
          />
          <SidebarItem 
            icon={<Settings />} 
            label="Settings" 
            active={activeTab === "Settings"} 
            onClick={() => setActiveTab("Settings")}
          />
        </nav>
      </aside>

      {/* DYNAMIC MAIN CONTENT */}
      <main className="flex-1 md:ml-64">
        {renderContent()}
      </main>
    </div>
  );
};

export default TeacherDashboard;