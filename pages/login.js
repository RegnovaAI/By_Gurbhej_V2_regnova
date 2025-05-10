import Link from "next/link";
import React, { useState } from "react";

export default function Login() {
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] =
    useState(false);

  const openForgotPasswordModal = () => setForgotPasswordModalOpen(true);
  const closeForgotPasswordModal = () => setForgotPasswordModalOpen(false);

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
        <form>
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
            />
          </div>
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
              className="w-full bg-[#9135e2] text-white text-lg py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center pt-5 text-lg">Not Registered? <Link href="/register" className="text-[#9135e2] font-bold text-lg">Create an account</Link></p>
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
            <form>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Enter your email"
                required
              />
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="bg-[#9135e2] text-white py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors mb-4"
                >
                  Send Reset Link
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
