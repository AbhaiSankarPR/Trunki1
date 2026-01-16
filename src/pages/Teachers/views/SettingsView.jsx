import React, { useState } from "react";
import { User, Bell, Lock, Globe, Save } from "lucide-react";

const SettingsView = () => {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* PROFILE SECTION */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4 text-pink-600">
            <User size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <input 
                type="text" 
                defaultValue="Sarah Johnson"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue="sarah.j@school.edu"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4 text-pink-600">
            <Bell size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-3">
            <ToggleItem label="Email alerts for At-Risk students" defaultChecked />
            <ToggleItem label="Weekly performance reports" defaultChecked />
            <ToggleItem label="New session reminders" />
          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4 text-pink-600">
            <Lock size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <button className="text-pink-600 font-medium hover:underline">
            Change Password
          </button>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-pink-200">
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple reusable Toggle component for the settings page
const ToggleItem = ({ label, defaultChecked }) => {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
          enabled ? "bg-pink-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsView;