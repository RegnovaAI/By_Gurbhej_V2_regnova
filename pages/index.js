"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import RiskCard from "../components/RiskCard";
import { generatePDFReport } from "../utils/generatePDF";
import { generateCSV } from "../utils/generateCSV";
import { auditTypes } from "@/utils/constant";
import HeroSection from "@/components/HeroSection";
import JSZip from "jszip";
import CircleChart from "@/components/CircularChart";
import ClauseCam from "@/components/ClausesCard";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState([]);
  const [riskReport, setRiskReport] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectAuditOption, setSelectAuditOption] = useState(true);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [activeDashboardRow, setActiveDashboardRow] = useState(null);
  const [dnaScore, setDnaScore] = useState(null);

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
    setActiveDashboardRow(null);
    setErrorText("");
  };

  // Remove a file by index
  const removeFile = (index) => {
    setSelectedFile((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
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
      setDnaScore(data.framework_scores);
      setActiveDashboardRow(null);
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
    setActiveDashboardRow(null);
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

  // Dashboard summary aggregation
  function getDashboardSummary(riskReport, auditTypes) {
    const summary = {};
    riskReport.forEach(({ filename, audit_type, risk_report }) => {
      if (!summary[filename]) {
        summary[filename] = {
          audits: {},
          total: 0,
          High: 0,
          Medium: 0,
          Low: 0,
        };
      }
      summary[filename].audits[audit_type] = true;
      summary[filename].total += risk_report.length;
      risk_report.forEach(({ risk_level }) => {
        summary[filename][risk_level] += 1;
      });
    });
    return Object.entries(summary).map(([filename, data]) => ({
      filename,
      ...data,
    }));
  }

  const dashboardSummary = getDashboardSummary(riskReport, auditTypes);

  // Find the risk report for the selected dashboard row
  const selectedAuditReport =
    activeDashboardRow &&
    riskReport.find(
      (r) =>
        r.filename === activeDashboardRow.filename &&
        r.audit_type === activeDashboardRow.auditType
    );

  const countByRisk = selectedAuditReport?.risk_report?.reduce(
    (acc, { risk_level }) => {
      acc[risk_level] = (acc[risk_level] || 0) + 1;
      return acc;
    },
    {}
  );

  const selectedAuditTypeReports =
    activeDashboardRow &&
    riskReport.filter((r) => r.audit_type === activeDashboardRow.auditType);

  async function handleDownloadAllPDFsZip() {
    if (!riskReport || riskReport.length === 0) {
      console.warn("No reports to process.");
      return;
    }

    const zip = new JSZip();

    for (const report of riskReport) {
      try {
        const pdfBlob = await generatePDFReport(
          `${report.filename}-${report.audit_type}`,
          report.risk_report,
          true // Return Blob
        );
        zip.file(`${report.filename}-${report.audit_type}.pdf`, pdfBlob);
      } catch (error) {
        console.error(`Failed to generate PDF for ${report.filename}:`, error);
      }
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "All-Audit-Reports.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to create or download ZIP:", error);
    }
  }


  const taggedClauses = riskReport[0]?.tagged_clauses || [];

  return (
    <div
      className="pt-40 min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`w-full mx-auto text-center space-y-10 ${
          riskReport.length > 0 ? "max-w-[1680px]" : "max-w-4xl"
        }`}
      >
        <main style={{ minHeight: "calc(100vh - 400px)" }}>
          <div className="space-y-3 mb-20">
            <h1 className="text-2xl sm:text-4xl font-bold">
              Welcome to RegnovaAI
            </h1>
            <HeroSection />
          </div>

          <div className={`${riskReport.length > 0 ? "flex gap-16" : ""} `}>
            <div>
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
                          setErrorText(
                            "Please select at least one audit type."
                          );
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

              {/* Remove vertical tabs and show risk details only if a dashboard row is selected */}
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

              {/* Optionally, you can add a way to select a row to show its risks */}
              {/* Example: Click on a row to show its risks */}
              {riskReport.length > 0 && (
                <div className="overflow-x-auto mt-10">
                  <h2 className="text-2xl font-bold text-blue-200 mb-4">
                    Dashboard Summary
                  </h2>
                  <table className="min-w-full bg-[#101c3a] rounded-xl shadow-lg">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-blue-200">
                          Document
                        </th>
                        {selectedAuditTypes.map((type) => (
                          <th key={type} className="px-4 py-2 text-blue-200">
                            {type}
                          </th>
                        ))}
                        <th className="px-4 py-2 text-blue-200">Total Risks</th>
                        <th className="px-4 py-2 text-blue-200">High</th>
                        <th className="px-4 py-2 text-blue-200">Medium</th>
                        <th className="px-4 py-2 text-blue-200">Low</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardSummary.map((row) => (
                        <tr
                          key={row.filename}
                          className="border-t border-blue-900"
                        >
                          <td className="px-4 py-2 font-semibold text-start">
                            {row.filename}
                          </td>
                          {selectedAuditTypes.map((type) => (
                            <td key={type} className="px-4 py-2 text-center">
                              {row.audits[type] ? (
                                <button
                                  className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:scale-105 transition"
                                  onClick={() => {
                                    const found = riskReport.find(
                                      (r) =>
                                        r.filename === row.filename &&
                                        r.audit_type === type
                                    );
                                    setActiveDashboardRow(
                                      found
                                        ? {
                                            filename: found.filename,
                                            auditType: found.audit_type,
                                          }
                                        : null
                                    );
                                  }}
                                >
                                  View
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-2 text-center">{row.total}</td>
                          <td className="px-4 py-2 text-center">{row.High}</td>
                          <td className="px-4 py-2 text-center">
                            {row.Medium}
                          </td>
                          <td className="px-4 py-2 text-center">{row.Low}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedAuditTypes.length > 0 &&
                activeDashboardRow &&
                selectedAuditReport && (
                  <div className="space-y-8 mt-12">
                    <h2 className="text-2xl font-bold text-blue-100 drop-shadow mb-4">
                      🛡️ Flagged Compliance Risks <br />
                      <span className="text-blue-300">
                        {selectedAuditReport.filename}
                      </span>
                      {" ("}
                      <span className="text-blue-300">
                        {selectedAuditReport.audit_type}
                      </span>
                      {")"}
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

                    {selectedAuditReport?.risk_report?.map((risk, idx) => (
                      <div key={idx} className="mt-4">
                        <RiskCard {...risk} />
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
                      <button
                        onClick={() =>
                          generateCSV(
                            `${activeDashboardRow?.auditType}-All-Reports`,
                            selectedAuditTypeReports?.flatMap(
                              (r) => r.risk_report
                            ) || []
                          )
                        }
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                      >
                        📊 Download {activeDashboardRow?.auditType} CSV Report
                      </button>
                      <button
                        onClick={() =>
                          generatePDFReport(
                            `${activeDashboardRow?.auditType}-All-Reports`,
                            selectedAuditTypeReports?.flatMap(
                              (r) => r.risk_report
                            ) || []
                          )
                        }
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                      >
                        📄 Download {activeDashboardRow?.auditType} PDF Report
                      </button>
                      <button
                        onClick={handleDownloadAllPDFsZip}
                        className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
                      >
                        🗜️ Download All Reports (PDF ZIP)
                      </button>
                    </div>
                  </div>
                )}
            </div>
            {dnaScore && (<div className="flex flex-col items-center max-w-7xl">
              <div className="bg-gray-900 text-white rounded-xl border border-gray-700 mx-auto h-96 overflow-y-auto shadow-lg">
                <ClauseCam tagged_clauses={taggedClauses}/>
                {/* Tooltip-like Detail Box */}
                {/* <div className="mt-6 bg-gray-800 p-4 rounded shadow-lg max-w-xl">
                  <p className="text-white font-semibold">
                    Data will be retained indefinitely for operational purposes
                  </p>
                  <p className="text-yellow-300 mt-2">
                    ⚠️ Risk: SOC 2 → Retention period may be excessive
                  </p>
                  <p className="mt-2 text-blue-300">Industry Benchmark</p>
                  <blockquote className="italic text-gray-300">
                    “Retention should be limited to what is necessary for the
                    purposes for which it is processed.”
                  </blockquote>
                  <p className="text-sm text-gray-400 mt-2">
                    SOC 2 Citation: CC8.3
                  </p>
                  <div className="mt-2 text-blue-400">
                    🔍 <span className="underline">Interactive Suggestion</span>
                    :<br />
                    Consider revising the retention period to align with
                    operational necessity.
                  </div>
                </div> */}
              </div>            
              <div className="mt-10">
                <h2 className="mb-3 text-2xl font-medium">DNA Score:</h2>
                <CircleChart data={dnaScore} />
              </div>
            </div>
            )}
          </div>
        </main>
        <div className="mb-10 mt-16">
          <p className="mb-2 text-blue-200 font-medium">Powered by</p>
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

        <footer className="text-base text-blue-300 font-medium tracking-wide mt-4">
          &copy; {new Date().getFullYear()} RegnovaAI. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
