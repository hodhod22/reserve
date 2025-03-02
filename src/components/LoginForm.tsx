"use client"; // Mark this as a Client Component

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../app/features/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginStart());

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      console.log("Login Response:", res.data);
      localStorage.setItem('token',res.data.token)
      dispatch(loginSuccess(res.data.user));

      // Redirect based on role
      if (res.data.user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data);
      setError(error.response?.data?.message || "An error occurred");
      dispatch(
        loginFailure(error.response?.data?.message || "An error occurred")
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border rounded-lg p-2">
          <FaUser className="text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ml-2 flex-grow outline-none"
            required
          />
        </div>
        <div className="flex items-center border rounded-lg p-2">
          <FaLock className="text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-2 flex-grow outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
