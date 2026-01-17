// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import UserType from '../components/Auth/Login';
import StudentPage from '../pages/Students/Students';
import TeacherPage from '../pages/Teachers/TeacherDashboard';
import Signup from '../components/Auth/Signup';
// import AssessmentGame from '../pages/Students/assesmentPage';

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserType />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacherDashboard" element={<TeacherPage />} />
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
  );
};

export default AppRoutes;
