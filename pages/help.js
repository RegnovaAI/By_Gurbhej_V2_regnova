import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import React from "react";

export default function Help() {
  const router = useRouter()
    return (
    <div className="flex bg-gray-900 flex-col w-screen h-screen lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-xl w-full">
          <h1 className="text-3xl font-bold mb-4 text-white text-center">Help & Support</h1>
          <p className="text-gray-300 mb-6 text-center">
            Need assistance? We're here to help! Check the resources below or contact our support team.
          </p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Frequently Asked Questions</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>How do I upload documents?</li>
              <li>How can I reset my password?</li>
              <li>Where can I view my account details?</li>
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Contact Support</h2>
            <p className="text-gray-300 mb-2">
              Email: <a href="mailto:founder@regnovaai.com" className="text-blue-400 underline">founder@regnovaai.com</a>
            </p>
            <p className="text-gray-300">
              Phone: <a href="tel:+4917676697872" className="text-blue-400 underline">+49 176 76697872</a>
            </p>
          </div>
          <div className="text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200" onClick={() => router.push('/contact')}>
              Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}