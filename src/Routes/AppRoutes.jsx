// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import UserType from '../components/Login';
import StudentPage from '../pages/Students/Students';
import TeacherPage from '../pages/Teachers/TeacherDashboard';
// import AssessmentGame from '../pages/Students/assesmentPage';

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserType />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacherDashboard" element={<TeacherPage />} />
        {/* <Route path="/assessmentPage" element={<AssessmentGame/>}/> */}
      </Routes>
  );
};

export default AppRoutes;
