// 'use client';

// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import RiskCard from '../components/RiskCard';
// import { generatePDFReport } from '../utils/generatePDF';
// import { generateCSV } from '../utils/generateCSV';

// export default function UploadPage() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [riskReport, setRiskReport] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const onDrop = useCallback(async (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (file) {
//       setSelectedFile(file);
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         //const response = await fetch("http://localhost:8000/upload/", {
//           const response = await fetch("https://regnovaai-backend.onrender.com/upload/", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         setRiskReport(data.risk_report);
//         setUploading(false);

//         if (data.content) {
//           alert("✅ File uploaded! Preview:\n" + data.content.slice(0, 300));
//         } else {
//           alert("⚠️ No content returned");
//         }
//       } catch (error) {
//         console.error("❌ Upload failed:", error);
//         alert("❌ Upload failed. Check console.");
//         setUploading(false);
//       }
//     }
//   }, []);

//   const loadDemoFile = () => {
//     const demoRisks = [
//       {
//         issue: "Missing Encryption Policy",
//         risk_level: "High",
//         explanation: "The document lacks guidelines for encrypting data at rest and in transit.",
//         suggestion: "Add a section detailing mandatory encryption practices."
//       },
//       {
//         issue: "Weak Password Requirements",
//         risk_level: "Medium",
//         explanation: "Password complexity rules are not strong enough.",
//         suggestion: "Set minimum password length and complexity rules."
//       },
//       {
//         issue: "Outdated Incident Response Plan",
//         risk_level: "Low",
//         explanation: "Incident response procedures reference old regulations.",
//         suggestion: "Update IRP to align with modern compliance needs."
//       }
//     ];

//     setSelectedFile({ name: "Demo_Document.pdf" });
//     setRiskReport(demoRisks);
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': [],
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
//       'text/plain': [],
//       'text/csv': [],
//     },
//     maxFiles: 1,
//   });

//   const countByRisk = {
//     High: riskReport.filter(r => r.risk_level === 'High').length,
//     Medium: riskReport.filter(r => r.risk_level === 'Medium').length,
//     Low: riskReport.filter(r => r.risk_level === 'Low').length,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 py-10 flex flex-col items-center">
//       <div className="max-w-3xl mx-auto text-center">
//         <h1 className="text-4xl font-bold text-blue-700 mb-4">Upload a Document for Compliance Audit</h1>
//         <p className="text-gray-600 mb-6">
//           Drag and drop your compliance document or click the box to upload.
//         </p>

//         <div className="flex justify-center mt-10">
//   <div
//     {...getRootProps()}
//     className="w-full max-w-[420px] border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl p-6 shadow-md transition hover:bg-blue-100 cursor-pointer"
//   >
//     <input {...getInputProps()} />

//     <div className="flex flex-col items-center justify-center space-y-3">

//       {/* UPDATED ICON STARTS HERE */}
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-1 h-1 text-blue-500"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         width="40"
//         height="40"
//          >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 7l-4-4m0 0L8 7m4-4v12" />
//       </svg>
//       {/* UPDATED ICON ENDS HERE */}

//       <p className="text-lg font-semibold text-gray-700">Drag & Drop files here</p>
//       <p className="text-sm text-gray-500">or</p>

//       <button className="px-4 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
//         Browse Files
//       </button>
//     </div>
//   </div>
// </div>

//         {/* 👇 Demo Button Added here */}
//         <div className="mt-6">
//           <button
//             onClick={loadDemoFile}
//             className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded shadow text-lg"
//           >
//             🚀 Try Demo File
//           </button>
//         </div>

//         {uploading && (
//           <div className="w-full mt-6">
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div className="bg-blue-600 h-3 rounded-full animate-pulse w-2/3"></div>
//             </div>
//             <p className="text-sm text-blue-600 mt-2">Uploading and analyzing...</p>
//           </div>
//         )}

//         {selectedFile && (
//           <div className="mt-6 bg-green-100 text-green-800 px-4 py-2 rounded shadow-sm">
//             ✅ File Selected: {selectedFile.name}
//           </div>
//         )}

//         {riskReport.length > 0 && (
//           <div className="mt-10">
//             <h2 className="text-2xl font-semibold mb-4 text-blue-800">
//               🛡️ Flagged Compliance Risks
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg mb-8">
//               <div className="bg-red-100 text-red-800 py-2 px-4 rounded-lg shadow">🟥 High: {countByRisk.High}</div>
//               <div className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg shadow">🟧 Medium: {countByRisk.Medium}</div>
//               <div className="bg-green-100 text-green-800 py-2 px-4 rounded-lg shadow">🟩 Low: {countByRisk.Low}</div>
//             </div>

//             {riskReport.map((risk, index) => (
//                 <div key={index} className="mt-18">
//                    <RiskCard {...risk} />
//                       </div>
//                          ))}

//             <div className="mt-12  flex flex-col sm:flex-row justify-center items-center gap-6">
//               <button
//                 onClick={() => generateCSV(selectedFile?.name || "document", riskReport)}
//                 className="mt-4 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 shadow text-lg"
//               >
//                 📊 Download CSV Report
//               </button>

//               <button
//                 onClick={() => generatePDFReport(selectedFile?.name || "document", riskReport)}
//                 className="mt-8 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 shadow text-lg"
//               >
//                 📄 Download PDF Report
//               </button>
//             </div>

//             <div className="mb-24"></div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import RiskCard from '../components/RiskCard';
// import { generatePDFReport } from '../utils/generatePDF';
// import { generateCSV } from '../utils/generateCSV';

// export default function UploadPage() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [riskReport, setRiskReport] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const onDrop = useCallback(async (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (file) {
//       setSelectedFile(file);
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const response = await fetch("https://regnovaai-backend.onrender.com/upload/", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         setRiskReport(data.risk_report);
//         setUploading(false);

//         if (data.content) {
//           alert("✅ File uploaded! Preview:\n" + data.content.slice(0, 300));
//         } else {
//           alert("⚠️ No content returned");
//         }
//       } catch (error) {
//         console.error("❌ Upload failed:", error);
//         alert("❌ Upload failed. Check console.");
//         setUploading(false);
//       }
//     }
//   }, []);

//   const loadDemoFile = () => {
//     const demoRisks = [
//       {
//         issue: "Missing Encryption Policy",
//         risk_level: "High",
//         explanation: "The document lacks guidelines for encrypting data at rest and in transit.",
//         suggestion: "Add a section detailing mandatory encryption practices."
//       },
//       {
//         issue: "Weak Password Requirements",
//         risk_level: "Medium",
//         explanation: "Password complexity rules are not strong enough.",
//         suggestion: "Set minimum password length and complexity rules."
//       },
//       {
//         issue: "Outdated Incident Response Plan",
//         risk_level: "Low",
//         explanation: "Incident response procedures reference old regulations.",
//         suggestion: "Update IRP to align with modern compliance needs."
//       }
//     ];

//     setSelectedFile({ name: "Demo_Document.pdf" });
//     setRiskReport(demoRisks);
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': [],
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
//       'text/plain': [],
//       'text/csv': [],
//     },
//     maxFiles: 1,
//   });

//   const countByRisk = {
//     High: riskReport.filter(r => r.risk_level === 'High').length,
//     Medium: riskReport.filter(r => r.risk_level === 'Medium').length,
//     Low: riskReport.filter(r => r.risk_level === 'Low').length,
//   };

//   return (
//      <div className="min-h-screen text-white bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-12"> ---updated with bewlow to centre

//       <div className="max-w-4xl mx-auto text-center">

//         <img src="/regnovaai-logo.png" alt="RegnovaAI Logo" className="w-32 mx-auto mb-6" width="140" height="140"/>
//         <h1 className="text-4xl sm:text-5xl font-bold mb-3">Welcome to RegnovaAI</h1>
//         <p className="text-lg text-blue-100 mb-10">
//           AI-powered risk analysis, compliance scoring, and audit reporting for your documents.
//         </p>

//         <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-blue-400 bg-blue-950/30 rounded-xl p-8 shadow-xl transition hover:bg-blue-800">
//           <input {...getInputProps()} />
//           <div className="flex flex-col items-center space-y-4">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="40" height="40">

//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 7l-4-4m0 0L8 7m4-4v12" />
//             </svg>
//             <p className="text-lg font-semibold text-blue-100">Drag and drop a document here, or click to select one</p>

//                    <button className="px-4 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
//                     Browse Files
//                     </button>

//           </div>
//         </div>

//         <button
//           onClick={loadDemoFile}
//           className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow-lg"
//         >
//           🚀 Try Demo File
//         </button>

//         {uploading && (
//           <div className="mt-8">
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div className="bg-blue-600 h-3 rounded-full animate-pulse w-2/3"></div>
//             </div>
//             <p className="text-sm text-blue-200 mt-2">Analyzing document...</p>
//           </div>
//         )}

//         {selectedFile && (
//           <div className="mt-6 bg-green-100 text-green-800 px-4 py-2 rounded shadow-sm">
//             ✅ File Selected: {selectedFile.name}
//           </div>
//         )}

//         {riskReport.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-semibold mb-4 text-white">
//               🛡️ Flagged Compliance Risks
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg mb-8">
//               <div className="bg-red-100 text-red-800 py-2 px-4 rounded-lg shadow">🟥 High: {countByRisk.High}</div>
//               <div className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg shadow">🟧 Medium: {countByRisk.Medium}</div>
//               <div className="bg-green-100 text-green-800 py-2 px-4 rounded-lg shadow">🟩 Low: {countByRisk.Low}</div>
//             </div>

//             {riskReport.map((risk, index) => (
//               <div key={index} className="mt-6">
//                 <RiskCard {...risk} />
//               </div>
//             ))}

//             <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
//               <button
//                 onClick={() => generateCSV(selectedFile?.name || "document", riskReport)}
//                 className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 shadow"
//               >
//                 📊 Download CSV Report
//               </button>
//               <button
//                 onClick={() => generatePDFReport(selectedFile?.name || "document", riskReport)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 shadow"
//               >
//                 📄 Download PDF Report
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mt-20 text-left bg-white text-gray-800 p-6 rounded-xl shadow-xl">
//           <h3 className="text-2xl font-bold mb-2">About RegnovaAI</h3>
//           <p>
//             RegnovaAI is a pioneering AI startup focused on streamlining compliance risk audits for enterprises. By leveraging advanced document parsing and LLM-driven analysis, RegnovaAI delivers actionable reports on data handling, consent, GDPR, and more — helping teams mitigate risk and stay compliant effortlessly.
//           </p>
//         </div>

//         <footer className="mt-16 text-sm text-blue-200">
//           &copy; {new Date().getFullYear()} RegnovaAI. All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import RiskCard from "../components/RiskCard";
import { generatePDFReport } from "../utils/generatePDF";
import { generateCSV } from "../utils/generateCSV";
import { auditTypes } from "@/utils/constant";
import HeroSection from "@/components/HeroSection";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [riskReport, setRiskReport] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectAuditOption, setSelectAuditOption] = useState(true);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState([]);

  const toggleAuditType = (auditType) => {
    setSelectedAuditTypes(
      (prevSelected) =>
        prevSelected.includes(auditType)
          ? prevSelected.filter((type) => type !== auditType) // Unselect
          : [...prevSelected, auditType] // Select
    );
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles) {
      setSelectedFile(acceptedFiles);
      setUploading(true);

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("file", file); // Append multiple files
      });

      try {
        const response = await fetch(
          "https://regnovaai-backend.onrender.com/upload/",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setRiskReport(data.risk_report);
        setUploading(false);

        if (data.content) {
          alert("✅ File uploaded! Preview:\n" + data.content.slice(0, 300));
        } else {
          alert("⚠️ No content returned");
        }
      } catch (error) {
        console.error("❌ Upload failed:", error);
        alert("❌ Upload failed. Check console.");
        setUploading(false);
      }
    }
  }, []);

  const loadDemoFile = () => {
    const demoRisks = [
      {
        issue: "Missing Encryption Policy",
        risk_level: "High",
        explanation:
          "The document lacks guidelines for encrypting data at rest and in transit.",
        suggestion: "Add a section detailing mandatory encryption practices.",
      },
      {
        issue: "Weak Password Requirements",
        risk_level: "Medium",
        explanation: "Password complexity rules are not strong enough.",
        suggestion: "Set minimum password length and complexity rules.",
      },
      {
        issue: "Outdated Incident Response Plan",
        risk_level: "Low",
        explanation: "Incident response procedures reference old regulations.",
        suggestion: "Update IRP to align with modern compliance needs.",
      },
    ];

    setSelectedFile({ name: "Demo_Document.pdf" });
    setRiskReport(demoRisks);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "text/plain": [],
      "text/csv": [],
    },
    maxFiles: 5,
  });

  const countByRisk = {
    High: riskReport.filter((r) => r.risk_level === "High").length,
    Medium: riskReport.filter((r) => r.risk_level === "Medium").length,
    Low: riskReport.filter((r) => r.risk_level === "Low").length,
  };

  return (
    <div
      className="pt-40 min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-4xl mx-auto text-center space-y-10">
        {/* <img
          src="/regnovaai-logo.png"
          alt="RegnovaAI Logo"
          className="w-32 mx-auto"
          width="140"
          height="140"
        /> */}

        <main style={{ minHeight: "calc(100vh - 400px)", }}>
          <div className="space-y-3 mb-20">
            <h1 className="text-2xl sm:text-4xl font-bold">
              Welcome to RegnovaAI
            </h1>
            {/* <p className="text-lg text-white">
            AI-powered risk analysis, compliance scoring, and audit reporting
            for your documents.
          </p> */}
            <HeroSection />
          </div>




                  <div className="grid grid-cols-2 gap-3 mb-6">
                {auditOptions.map((audit) => (
                  <label key={audit} className="flex items-center space-x-2">
                   <input
                  type="checkbox"
                    checked={selectedAudits.includes(audit)}
                   onChange={() => handleAuditToggle(audit)}
                 />
                  <span>{audit}</span>
                 </label>
                  ))}
                 </div>






          {selectAuditOption && (
            <div className="max-w-2xl mx-auto">
              <h3 className="mb-5 text-2xl">Select Audit Types</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {auditTypes.map((auditType) => (
                  <div
                    key={auditType}
                    className={`border border-1 rounded-lg p-2 cursor-pointer transition duration-300 ease-in-out
                  ${
                    selectedAuditTypes.includes(auditType)
                      ? "bg-[#0e1543] pulse-bg" // Selected with pulse
                      : "bg-[#000f26] pulse-bg" // Default background
                  }
                  border-[#3e5074] hover:bg-[#0e1543]`}
                    onClick={() => toggleAuditType(auditType)}
                  >
                    {auditType}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 gap-2 mt-8">
                <button
                  onClick={() => {
                    setSelectAuditOption(false);
                    setRiskReport([]);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 cursor-pointer  border border-[#3e5074] bg-[#0e1543] text-white rounded-xl transition"
                >
                  Get Started
                </button>
                <button
                  onClick={loadDemoFile}
                  className="px-4 py-2 cursor-pointer  border border-[#3e5074] bg-[#0e1543] text-white rounded-xl transition"
                >
                  Try Demo File
                </button>
              </div>
            </div>
          )}

          {!selectAuditOption && (
            <>
              <div
                {...getRootProps()}
                className="cursor-pointer border-1 border-[#3e5074] bg-[#000f26] rounded-xl p-8 shadow-xl transition"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="40"
                    height="40"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 7l-4-4m0 0L8 7m4-4v12"
                    />
                  </svg>
                  <p className="text-lg font-normal text-white">
                    Drag and drop a document here, or click to select one
                  </p>
                  <button className="px-4 py-2 cursor-pointer  border border-[#3e5074] bg-[#0e1543] text-white rounded transition">
                    Browse Files
                  </button>
                </div>
              </div>

              {/* <button
              onClick={loadDemoFile}
              className="px-4 py-2 cursor-pointer border border-[#3e5074] bg-[#0e1543] text-white rounded transition"
            >
              🚀 Try Demo File
            </button> */}
            </>
          )}

          {uploading && (
            <div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full animate-pulse w-2/3"></div>
              </div>
              <p className="text-sm text-blue-200 mt-2">
                Analyzing document...
              </p>
            </div>
          )}

          {selectedFile?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold">Selected Files:</h2>
              <ul className="list-disc list-inside text-left">
                {selectedFile.map((file, index) => (
                  <li key={index} className="text-sm text-blue-100">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded shadow-sm">
                      ✅ File Selected: {file.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {riskReport.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                🛡️ Flagged Compliance Risks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg">
                <div className="bg-red-100 text-red-800 py-2 px-4 rounded-lg shadow">
                  🟥 High: {countByRisk.High}
                </div>
                <div className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg shadow">
                  🟧 Medium: {countByRisk.Medium}
                </div>
                <div className="bg-green-100 text-green-800 py-2 px-4 rounded-lg shadow">
                  🟩 Low: {countByRisk.Low}
                </div>
              </div>

              {riskReport.map((risk, index) => (
                <div key={index} className="mt-4">
                  <RiskCard {...risk} />
                </div>
              ))}

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <button
                  onClick={() =>
                    generateCSV(selectedFile?.name || "document", riskReport)
                  }
                  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 shadow"
                >
                  📊 Download CSV Report
                </button>
                <button
                  onClick={() =>
                    generatePDFReport(
                      selectedFile?.name || "document",
                      riskReport
                    )
                  }
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 shadow"
                >
                  📄 Download PDF Report
                </button>
              </div>
            </div>
          )}
        </main>
        <div className="mb-6">
          <p className="mb-2">Powered by</p>
          <div className="flex justify-center items-center gap-4">
            <img
              src="/said-logo.png"
              alt="Said Business School"
              className="w-16 h-16 border"
            />
            <img
              src="/oxford-logo.png"
              alt="Oxford University"
              className="w-16 h-16 border"
            />
          </div>
        </div>

        <footer className="text-sm text-blue-200">
          &copy; {new Date().getFullYear()} RegnovaAI. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

// 'use client';
// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';

// export default function HomePage() {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     setSelectedFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: { 'application/pdf': [], 'text/plain': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] },
//     maxFiles: 1
//   });

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white px-4 py-10 flex items-center justify-center"
//       style={{ backgroundImage: "url('/bg-hero.jpg')" }}
//     >
//       <div className="max-w-2xl text-center bg-black/60 p-8 rounded-xl shadow-xl">
//         <img src="/regnovaai-logo.png" alt="RegnovaAI Logo" className="w-24 mx-auto mb-6" />

//         <h1 className="text-3xl sm:text-4xl font-bold mb-3">Welcome to RegnovaAI</h1>
//         <p className="text-lg mb-8">AI-powered risk analysis, compliance scoring, and audit reporting for your documents.</p>

//         {/* Upload Box */}
//         <div
//           {...getRootProps()}
//           className="border-2 border-dashed border-blue-400 p-6 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer mb-4"
//         >
//           <input {...getInputProps()} />
//           <p className="text-white">Drag and drop a document here, or click to select one</p>
//           <button className="mt-3 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded">Browse Files</button>
//         </div>

//         {/* Demo File */}
//         <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded mt-2">
//           🚀 Try Demo File
//         </button>

//         {/* About */}
//         <div className="text-sm mt-8 leading-relaxed text-white">
//           <h3 className="text-xl font-semibold mb-2">About RegnovaAI</h3>
//           <p>
//             RegnovaAI is a pioneering AI startup focused on streamlining compliance risk audits for enterprises. By leveraging advanced document parsing and LLM-driven analysis, RegnovaAI delivers actionable reports on data handling, consent, GDPR, and more — helping teams mitigate risk and stay compliant effortlessly.
//           </p>
//         </div>

//         {/* Logos */}
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <img src="/said-logo.png" alt="Said Business School" className="h-10" />
//           <img src="/oxford-logo.png" alt="Oxford University" className="h-10" />
//         </div>

//         {/* Footer */}
//         <p className="text-xs text-white/70 mt-4">© 2025 RegnovaAI. All rights reserved.</p>
//       </div>
//     </div>
//   );
// }
