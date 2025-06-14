import React from "react";
import Link from "next/link";

export default function Success() {
  return (
    <div
      className="pt-48 min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center bg-gray-800 bg-opacity-80 rounded-2xl shadow-xl p-10 border border-gray-700">
        <div className="flex flex-col items-center">
          <svg className="w-20 h-20 text-green-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="text-green-500" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12l3 3 5-5" />
          </svg>
          <h1 className="text-4xl font-bold mb-4 text-green-400 text-center">Payment Successful!</h1>
          <p className="text-lg text-gray-200 mb-6 text-center">
            Thank you for your purchase. Your payment was processed successfully.<br />
            You now have access to premium features.
          </p>
          <Link href="/profile">
            <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}