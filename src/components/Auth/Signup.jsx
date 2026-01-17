import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmChange = (value) => {
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "teacher",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-600 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Teacher Signup
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create a teacher account
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-pink-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-pink-500"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full px-5 py-3 rounded-full border ${
                !passwordMatch ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-pink-500`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              className={`w-full px-5 py-3 rounded-full border ${
                !passwordMatch ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-pink-500`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-3.5 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Match Message */}
          {confirmPassword && (
            <p
              className={`text-sm text-center ${
                passwordMatch ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordMatch ? "Passwords match" : "Passwords do not match"}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !passwordMatch}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-4 rounded-full text-xl shadow-lg transition transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-pink-600 font-bold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
