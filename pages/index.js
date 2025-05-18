"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import RiskCard from "../components/RiskCard";
import { generatePDFReport } from "../utils/generatePDF";
import { generateCSV } from "../utils/generateCSV";
import { auditTypes } from "@/utils/constant";
import HeroSection from "@/components/HeroSection";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState([]);
  const [riskReport, setRiskReport] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectAuditOption, setSelectAuditOption] = useState(true);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState([]);
  const [errorText, setErrorText] = useState("");

  const toggleAuditType = (auditType) => {
    setSelectedAuditTypes((prevSelected) =>
      prevSelected.includes(auditType)
        ? prevSelected.filter((type) => type !== auditType)
        : [...prevSelected, auditType]
    );
    setErrorText("");
  };

  const removeAuditType = (auditType) => {
    setSelectedAuditTypes((prev) => prev.filter((type) => type !== auditType));
  };

  const handleReplaceAuditTypes = () => {
    setSelectAuditOption(true);
    setRiskReport([]);
    setSelectedFile([]);
    setErrorText("");
  };

  // Remove a file by index
  const removeFile = (index) => {
    setSelectedFile((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // Add new files, avoid duplicates by name
      setSelectedFile((prev) => {
        const existingNames = prev.map((f) => f.name);
        const newFiles = acceptedFiles.filter(
          (f) => !existingNames.includes(f.name)
        );
        return [...prev, ...newFiles];
      });
    }
  }, []);

  const handleGetAudit = async () => {
    if (!selectedFile || selectedFile.length === 0) {
      setErrorText("Please select at least one file to audit.");
      return;
    }
    setUploading(true);
    setErrorText("");
    const formData = new FormData();
    selectedFile.forEach((file) => {
      formData.append("files", file);
    });
    selectedAuditTypes.forEach((type) => {
      formData.append("audit_types", type);
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
      setRiskReport(data.results);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      setErrorText("❌ Upload failed. Check console.");
      console.error("❌ Upload failed:", error);
    }
  };

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

    setSelectedFile([{ name: "Demo_Document.pdf" }]);
    setRiskReport([
      {
        filename: "Demo_Document.pdf",
        audit_type: selectedAuditTypes[0] || "Demo",
        risk_report: demoRisks,
      },
    ]);
    setSelectAuditOption(false);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "text/plain": [],
      "text/csv": [],
    },
    maxFiles: 5,
    noClick: true,
    noKeyboard: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const activeReport = riskReport[activeIndex];

  const countByRisk = activeReport?.risk_report?.reduce(
    (acc, { risk_level }) => {
      acc[risk_level] = (acc[risk_level] || 0) + 1;
      return acc;
    },
    {}
  );

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
        <main style={{ minHeight: "calc(100vh - 400px)" }}>
          <div className="space-y-3 mb-20">
            <h1 className="text-2xl sm:text-4xl font-bold">
              Welcome to RegnovaAI
            </h1>
            <HeroSection />
          </div>

          {selectAuditOption && (
            <div className="max-w-2xl mx-auto">
              <h3 className="mb-5 text-3xl font-semibold text-white-200">
                Select Audit Types
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {auditTypes.map((auditType) => {
                  const isChecked = selectedAuditTypes.includes(auditType);
                  return (
                    <label
                      key={auditType}
                      htmlFor={`checkbox-${auditType}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-[#192447] border-[#2e3a5e] hover:border-blue-400
                      `}
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${auditType}`}
                        value={auditType}
                        checked={isChecked}
                        onChange={() => toggleAuditType(auditType)}
                        className="form-checkbox w-5 h-5 accent-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-white font-semibold">
                        {auditType}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => {
                    if (selectedAuditTypes.length === 0) {
                      setErrorText("Please select at least one audit type.");
                      return;
                    }
                    setSelectAuditOption(false);
                    setRiskReport([]);
                    setSelectedFile([]);
                  }}
                  className="px-6 py-2 font-semibold rounded-xl bg-blue-600 cursor-pointer text-white shadow-lg hover:scale-105 transition"
                >
                  Continue
                </button>
                <button
                  onClick={loadDemoFile}
                  className="px-6 py-2 font-semibold rounded-xl cursor-pointer bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:scale-105 transition"
                >
                  Try Demo File
                </button>
              </div>
              {errorText && (
                <p className="text-red-400 text-lg mt-4">{errorText}</p>
              )}
            </div>
          )}

          {!selectAuditOption && (
            <>
              {/* Show selected audit types as removable chips */}
              <div className="mb-6 flex flex-wrap gap-2 justify-center items-center">
                <span className="text-xl font-medium text-white ">
                  Selected Audit Types:
                </span>
                {selectedAuditTypes.length > 0 ? (
                  selectedAuditTypes.map((type) => (
                    <span
                      key={type}
                      className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full shadow font-medium text-base"
                    >
                      {type}
                      <button
                        onClick={() => removeAuditType(type)}
                        className="ml-2 text-white cursor-pointer text-sm"
                        title="Remove audit type"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="ml-2 text-base text-white">None</span>
                )}
                <button
                  onClick={handleReplaceAuditTypes}
                  className="ml-2 px-3 py-1 bg-orange-500 text-white rounded-sm font-semibold shadow transition text-sm"
                  title="Replace Audit Types"
                >
                  UPDATE
                </button>
              </div>

              {/* Custom file input and display */}
              <div
                {...getRootProps()}
                className="flex flex-col items-center border-2 border-dashed border-[#3e5074] bg-[#000f26] rounded-xl p-8 shadow-xl transition"
              >
                <input {...getInputProps()} multiple />
                <button
                  type="button"
                  onClick={open}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
                >
                  Browse & Select Files
                </button>
                <div className="w-full mt-4 flex flex-col gap-2 items-center">
                  <p className="text-lg font-normal text-white">
                    Drag and drop a document here, or click to select one
                  </p>
                </div>
                <button
                  onClick={handleGetAudit}
                  className="mt-6 px-8 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
                  type="button"
                >
                  Analyze & Get Audit Report
                </button>
                {errorText && (
                  <p className="text-red-400 text-lg mt-4">{errorText}</p>
                )}
              </div>
              {selectedFile && selectedFile.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">
                    Selected Files:
                  </h3>
                  <div className="flex flex-col flex-wrap gap-2 mt-2 justify-start items-start">
                    {selectedFile.map((file, index) => (
                      <span
                        key={file.name}
                        className="flex items-center bg-gradient-to-r from-green-200 to-green-400 text-green-900 px-4 py-1 rounded shadow "
                      >
                        {file.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="ml-2 px-2 py-1 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white hover:bg-red-600 transition"
                          title="Remove file"
                        >
                          Delete
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {uploading && (
            <div className="flex flex-col items-center mt-8">
              <div className="w-full max-w-md bg-gray-700 rounded-full h-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full animate-pulse w-2/3"></div>
              </div>
              <p className="text-base text-blue-200 mt-4 font-medium tracking-wide">
                Analyzing document, please wait...
              </p>
            </div>
          )}

          {riskReport.length > 0 && (
            <>
              <div className="flex border-b border-blue-900 my-8 overflow-x-auto pt-2 scrollbar-hide">
                {riskReport.map(({ filename, audit_type }, idx) => (
                  <button
                    key={`${filename}-${audit_type}-${idx}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-6 py-3 mr-2 rounded-t-2xl transition duration-300 text-base font-bold whitespace-nowrap focus:outline-none 
                      ${
                        idx === activeIndex
                          ? "bg-gradient-to-r from-white to-blue-100 text-blue-700 border-b-4 border-blue-500 shadow-lg"
                          : "text-blue-200 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    {filename} – {audit_type}
                  </button>
                ))}
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl font-extrabold text-blue-100 drop-shadow mb-4">
                  🛡️ Flagged Compliance Risks
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-lg mb-6">
                  <div className="bg-gradient-to-r from-red-400 to-red-600 text-white py-3 px-6 rounded-xl shadow font-bold flex items-center gap-2 justify-center">
                    🟥 High: {countByRisk?.High || 0}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 py-3 px-6 rounded-xl shadow font-bold flex items-center gap-2 justify-center">
                    🟧 Medium: {countByRisk?.Medium || 0}
                  </div>
                  <div className="bg-gradient-to-r from-green-300 to-green-500 text-green-900 py-3 px-6 rounded-xl shadow font-bold flex items-center gap-2 justify-center">
                    🟩 Low: {countByRisk?.Low || 0}
                  </div>
                </div>

                {activeReport?.risk_report?.map((risk, idx) => (
                  <div key={idx} className="mt-4">
                    <RiskCard {...risk} />
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
                  <button
                    onClick={() =>
                      generateCSV(
                        `${activeReport?.filename}-${activeReport?.audit_type}`,
                        activeReport?.risk_report
                      )
                    }
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                  >
                    📊 Download CSV Report
                  </button>
                  <button
                    onClick={() =>
                      generatePDFReport(
                        `${activeReport?.filename}-${activeReport?.audit_type}`,
                        activeReport?.risk_report
                      )
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                  >
                    📄 Download PDF Report
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
        <div className="mb-10 mt-16">
          <p className="mb-2 text-blue-200 font-medium">Powered by</p>
          <div className="flex justify-center items-center gap-6">
            <img
              src="/said-logo.png"
              alt="Said Business School"
              className="w-16 h-16 border-2 border-blue-700 rounded-full shadow-lg bg-white"
            />
            <img
              src="/oxford-logo.png"
              alt="Oxford University"
              className="w-16 h-16 border-2 border-blue-700 rounded-full shadow-lg bg-white"
            />
          </div>
        </div>

        <footer className="text-base text-blue-300 font-medium tracking-wide mt-4">
          &copy; {new Date().getFullYear()} RegnovaAI. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
