import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login({ email, password });
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      {/* Left image section */}
      <div className="hidden md:block w-1/2">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-green-700">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500">
              Please login to your account
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="yashdhadod@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="form-checkbox text-green-600"
                />
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleSubmit}
                disabled={loading}
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="text-green-600 hover:underline hover:cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
