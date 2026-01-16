import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // later: real teacher auth
    navigate('/teacher');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-600 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Teacher Login
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Only teachers need to sign in
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Teacher Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-4 rounded-full text-xl shadow-lg transition transform hover:scale-105"
          >
            Login as Teacher
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Student Entry */}
        <button
          onClick={() => navigate('/student')}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-full text-xl shadow-lg transition transform hover:scale-105"
        >
          Continue as Student
        </button>
      </div>
    </div>
  );
};

export default Login;
