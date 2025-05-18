
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
//       formData.append("audits", selectedAudits.join(","));  //test for milestone update. on

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
//     <div className="min-h-screen text-white bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-12">
//       <div className="max-w-4xl mx-auto text-center">

//         <img src="/regnovaai-logo.png" alt="RegnovaAI Logo" className="w-32 mx-auto mb-6" />
//         <h1 className="text-4xl sm:text-5xl font-bold mb-3">Welcome to RegnovaAI</h1>
//         <p className="text-lg text-blue-100 mb-10">
//           AI-powered risk analysis, compliance scoring, and audit reporting for your documents.
//         </p>

//         <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-blue-400 bg-blue-950/30 rounded-xl p-8 shadow-xl transition hover:bg-blue-800">
//           <input {...getInputProps()} />
//           <div className="flex flex-col items-center space-y-4">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 7l-4-4m0 0L8 7m4-4v12" />
//             </svg>
//             <p className="text-lg font-semibold text-blue-100">Drag and drop a document here, or click to select one</p>
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



