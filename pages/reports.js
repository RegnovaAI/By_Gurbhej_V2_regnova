import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/utils/api_constants";
import { generatePDFReport } from "@/utils/generatePDF";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";

// Helper to group files as policy/report
function groupByType(files) {
  return {
    policy: files.filter((f) => f.filename.toLowerCase().includes("policy")),
    report: files.filter((f) => f.filename.toLowerCase().includes("report")),
  };
}

async function downloadReportsAsPdfOrZip(results) {
  if (!results || results.length === 0) return;

  if (results.length === 1) {
    const { filename, risk_report } = results[0];
    generatePDFReport(filename, risk_report); // triggers download
    return;
  }

  const zip = new JSZip();

  for (const item of results) {
    const { filename, risk_report } = item;

    try {
      const blob = await generatePDFReport(filename, risk_report, true); // returnBlob = true
      const pdfFilename = `${filename.replace(
        /\.[^/.]+$/,
        ""
      )}-Audit-Report.pdf`;
      zip.file(pdfFilename, blob);
    } catch (e) {
      console.error("PDF generation failed for:", filename, e);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "RegnovaAI-Risk-Reports.zip");
}

export default function Reports() {
  const [groupedFiles, setGroupedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false); // Loader for download
  const [selectedAuditType, setSelectedAuditType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("rg-token");
    setLoading(true);
    fetch(`${BASE_URL}/user/files/grouped`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setGroupedFiles(data || []))
      .catch(() => setGroupedFiles([]))
      .finally(() => setLoading(false));
  }, []);

  const downloadFiles = async (auditTypeId, projectId) => {
    const token = localStorage.getItem("rg-token");
    const res = await fetch(
      `http://localhost:8000/project/${projectId}/audit/${auditTypeId}/risk-report/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error("Download failed:", error.detail);
      return;
    }

    const riskReport = await res.json();

    downloadReportsAsPdfOrZip(riskReport?.results || []);
  };

  return (
    <div
      className="flex bg-gray-900 flex-col w-screen h-screen lg:flex-row"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        {loading && <div>Loading...</div>}
        {!loading && groupedFiles.length === 0 && <div>No reports found.</div>}
        <ul>
          {groupedFiles.map((project, idx) => (
            <li
              key={idx}
              className="bg-gray-800 rounded-lg shadow-md group transition-all p-3"
            >
              <h2 className="text-xl text-white font-semibold mb-2">
                Project: {project.project_name}
              </h2>

              {project.audits
                .filter((audit) => audit.audit_type_id && audit.audit_name)
                .map((audit, auditIdx) => (
                  <div key={auditIdx} className="ml-4 mb-4">
                    <h3 className="text-lg text-gray-300 font-medium mb-2 border-b border-gray-700 pb-2 mb-4">
                      Audit: {audit.audit_name || "Unknown"}
                    </h3>

                    {audit.files.length === 0 ? (
                      <p className="text-gray-500 ml-4">No files available.</p>
                    ) : (
                      <ul className="list-disc">
                        {audit.files.map((file, fileIdx) => (
                          <li
                            key={fileIdx}
                            className="flex justify-between items-center p-2 text-gray-200"
                          >
                            <span className="flex items-center">
                              <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>{" "}
                              {/* Dot */}
                              {file.filename}
                            </span>
                            <button
                              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => {
                                setSelectedAuditType(audit.audit_type_id);
                                downloadFiles(
                                  audit.audit_type_id,
                                  project.project_id,
                                  file.filename
                                );
                              }}
                              disabled={
                                downloadLoading &&
                                selectedAuditType === audit.audit_type_id
                              }
                            >
                              {downloadLoading &&
                              selectedAuditType === audit.audit_type_id ? (
                                <span className="flex items-center">
                                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                  Downloading...
                                </span>
                              ) : (
                                "Download Report"
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
