import { BASE_URL } from "@/utils/api_constants";
import Link from "next/link";
import React, { useState } from "react";

export default function Login() {
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  // State for login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // State for forgot password form
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
    setResetEmail("");
    setResetError("");
    setResetSuccess("");
  };
  const closeForgotPasswordModal = () => setForgotPasswordModalOpen(false);

  // Simple email validation
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email.");
      setIsLoggingIn(false);
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      setIsLoggingIn(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Login error:", data);
        setLoginError(data.detail || "Login failed.");
      } else {
        localStorage.setItem("rg-token", data.access_token);
        window.location.href = "/";
      }
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle password reset submit
  const handleReset = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setIsResetting(true);
    if (!validateEmail(resetEmail)) {
      setResetError("Please enter a valid email.");
      setIsResetting(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (!res.ok) {
        const data = await res.json();
        setResetError(data.detail || "Failed to send reset link.");
      } else {
        setResetSuccess("Reset link sent! Check your email.");
      }
    } catch (err) {
      setResetError(err.message || "An error occurred while sending reset link.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md w-full bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h3 className="mb-6 text-3xl font-bold text-center">Welcome Back</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          {loginError && (
            <div className="text-red-400 text-sm mb-2">{loginError}</div>
          )}
          <div className="mb-4 flex justify-end text-sm">
            <button
              type="button"
              onClick={openForgotPasswordModal}
              className="text-blue-400 text-lg cursor-pointer hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="w-full bg-[#9135e2] text-white text-lg py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <p className="text-center pt-5 text-lg">
          Not Registered?{" "}
          <Link href="/register" className="text-[#9135e2] font-bold text-lg">
            Create an account
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">Reset Your Password</h3>
            <p className="text-lg mb-4">
              Enter your email address below, and we'll send you instructions to
              reset your password.
            </p>
            <form onSubmit={handleReset}>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Enter your email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              {resetError && (
                <div className="text-red-400 text-sm mb-2">{resetError}</div>
              )}
              {resetSuccess && (
                <div className="text-green-400 text-sm mb-2">{resetSuccess}</div>
              )}
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="bg-[#9135e2] text-white py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors mb-4 flex items-center justify-center"
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
                <button
                  onClick={closeForgotPasswordModal}
                  type="button"
                  className="cursor-pointer text-sm text-gray-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}