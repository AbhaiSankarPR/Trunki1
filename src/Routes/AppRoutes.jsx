// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import UserType from '../components/Login';
import StudentPage from '../pages/Students/Students';
// import TeacherPage from '../components/TeacherPage';

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserType />} />
        <Route path="/student" element={<StudentPage />} />
        {/* <Route path="/teacher" element={<TeacherPage />} /> */}
      </Routes>
  );
};

export default AppRoutes;
