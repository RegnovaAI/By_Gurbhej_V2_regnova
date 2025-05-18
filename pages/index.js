

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
  const [errorText, setErrorText] = useState("");

  const toggleAuditType = (auditType) => {
    setSelectedAuditTypes(
      (prevSelected) =>
        prevSelected.includes(auditType)
          ? prevSelected.filter((type) => type !== auditType) // Unselect
          : [...prevSelected, auditType] // Select
    );
    setErrorText("")
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




          {selectAuditOption && (
            <div className="max-w-2xl mx-auto">
              <h3 className="mb-5 text-2xl">Select Audit Types</h3>
             
             
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {auditTypes.map((auditType) => {
                  const isChecked = selectedAuditTypes.includes(auditType);

                  return (
                    <div
                      key={auditType}
                      className="flex items-center gap-2 transition duration-300 ease-in-out"
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${auditType}`}
                        value={auditType}
                        checked={isChecked}
                        onChange={() => toggleAuditType(auditType)}
                        className="form-checkbox w-5 h-5 accent-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`checkbox-${auditType}`}
                        className="cursor-pointer text-white"
                      >
                        {auditType}
                      </label>
                    </div>
                  );
                })}
              </div>


              
                <div className="flex justify-center mt-4 gap-2 mt-8">
                <button
                  onClick={() => {
                    if (selectedAuditTypes.length === 0) {
                      setErrorText("Please select at least one audit type.");
                      return;
                    }
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
              {errorText && (
                <p className="text-red-500 text-sm mt-2">{errorText}</p>
              )}
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

