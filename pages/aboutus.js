// import React from "react";

// export default function Aboutus() {
//   return (
//     <div
//       className="min-h-screen flex item-center justify-center flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
//       style={{
//         backgroundImage: "url(/bg-hero.png)",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <div className="max-w-4xl mx-auto">
//         <h3 className="mb-8 text-4xl font-bold text-center">About RegnovaAI</h3>
//         <p className="text-xl text-justify">
//           RegnovaAI is a pioneering AI startup focused on streamlining
//           compliance risk audits for enterprises. By leveraging advanced
//           document parsing and LLM-driven analysis, RegnovaAI delivers
//           actionable reports on data handling, consent, GDPR, and more — helping
//           teams mitigate risk and stay compliant effortlessly.
//         </p>
//       </div>
//     </div>
//   );
// }

import { CheckCircle, ChevronRight, Eye, FileText, Target, Upload, Users } from "lucide-react";
import React, { useState } from "react";

export default function Aboutus() {

    const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted with file:', selectedFile);
    // Handle form submission here
  };

  return (
    <div
      className="min-h-screen flex item-center justify-center flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* <div className="max-w-4xl mx-auto">
        <h3 className="mb-8 text-4xl font-bold text-center">About RegnovaAI</h3>
        <p className="text-xl text-justify">
          RegnovaAI is a pioneering AI startup focused on streamlining
          compliance risk audits for enterprises. By leveraging advanced
          document parsing and LLM-driven analysis, RegnovaAI delivers
          actionable reports on data handling, consent, GDPR, and more — helping
          teams mitigate risk and stay compliant effortlessly.
        </p>
      </div> */}
       <section className="relative overflow-hidden">
        <div className="absolute inset-0  from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RegnovaAI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              A pioneering AI startup focused on streamlining compliance risk audits for enterprises. 
              By leveraging advanced document parsing and LLM-driven analysis, RegnovaAI delivers 
              actionable reports on data handling, consent, GDPR, and more — helping teams mitigate 
              risk and stay compliant effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-blue-400">Mission Statement</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              RegnovaAI's mission is to revolutionize enterprise compliance by deploying cutting-edge AI 
              that automates audit risk analysis, compliance scoring, and reporting at scale. We are building 
              a platform that eliminates regulatory friction, accelerates audit cycles, and delivers 
              audit-grade insights in real time—so that high-growth companies can focus on scaling without 
              compliance bottlenecks.
            </p>
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300">
                By combining deep document intelligence with domain-specific models, we aim to be the 
                invisible engine powering audit readiness across fintech, healthcare, defense, and beyond.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-purple-400">Vision Statement</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              Our vision is to become the global standard in AI-driven regulatory co-pilots, helping 
              every enterprise navigate compliance with confidence, speed, and clarity. We envision a 
              world where every audit report is instant, every risk is visible, and every organization—regardless 
              of size—has access to elite-grade governance tools.
            </p>
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <p className="text-gray-300">
                As we scale, RegnovaAI will be the platform of choice for unicorns and Fortune 500s alike, 
                redefining how the world sees compliance: not as a cost, but as a strategic advantage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">What We Deliver</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">Document Intelligence</h3>
            <p className="text-gray-300">Advanced document parsing and analysis powered by cutting-edge AI models.</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Compliance Scoring</h3>
            <p className="text-gray-300">Real-time compliance scoring and risk assessment for enterprise-grade audits.</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <ChevronRight className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-purple-400">Actionable Reports</h3>
            <p className="text-gray-300">Comprehensive reports on GDPR, data handling, consent, and regulatory compliance.</p>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className=" border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl text-gray-300">
              Be part of something amazing. Upload your resume and apply for exciting opportunities 
              to shape the future with us.
            </p>
          </div>

          {/* File Upload Form */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6">Upload Your Resume</h3>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  selectedFile ? 'bg-green-500/20' : 'bg-gray-700'
                }`}>
                  <Upload className={`w-8 h-8 ${selectedFile ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
                
                {selectedFile ? (
                  <div>
                    <p className="text-green-400 font-semibold mb-2">File Selected:</p>
                    <p className="text-white">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-semibold mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports PDF, DOC, DOCX files up to 10MB
                    </p>
                  </div>
                )}
                
                <label
                  htmlFor="resume"
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer transition-colors"
                >
                  {selectedFile ? 'Change File' : 'Choose File'}
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedFile}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                selectedFile
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Application
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
