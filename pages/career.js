import React, { useState } from 'react';

export default function Career() {
  const [resume, setResume] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resume) {
      alert(`Resume uploaded: ${resume.name}`);
      // Add logic to handle file upload (e.g., API call)
    } else {
      alert('Please upload a resume before submitting.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="mb-6 text-2xl lg:text-4xl font-extrabold tracking-tight">
          Join Our Team
        </h3>
        <p className="mb-8 lg:text-lg leading-relaxed text-gray-300">
          Be part of something amazing. Upload your resume and apply for exciting opportunities to shape the future with us.
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1a2543] border border-[#0d276b] text-black p-8 rounded-xl shadow-2xl max-w-lg mx-auto"
        >
          <div className="mb-6">
            <label
              htmlFor="resume"
              className="block text-lg font-semibold text-white mb-5"
            >
              Upload Your Resume
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-[#0d276b] rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-[#9135e2] text-white py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}