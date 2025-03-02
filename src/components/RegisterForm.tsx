"use client"; // Mark this as a Client Component

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });
      console.log("Registration Response:", res.data);
      router.push("/login"); // Redirect to the login page after successful registration
    } catch (error: any) {
      console.error("Registration Error:", error.response?.data);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border rounded-lg p-2">
          <FaUser className="text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="ml-2 flex-grow outline-none"
            required
          />
        </div>
        <div className="flex items-center border rounded-lg p-2">
          <FaEnvelope className="text-gray-400" />
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
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
