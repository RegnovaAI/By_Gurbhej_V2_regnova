import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/utils/api_constants";
import { generatePDFReport } from "@/utils/generatePDF";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";

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
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedAuditType, setSelectedAuditType] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("rg-token");
    if (!token) return;
    setLoading(true);

    fetch(`${BASE_URL}/user/files/grouped`, {
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
    setDownloadLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${BASE_URL}/project/${projectId}/audit/${auditTypeId}/risk-report/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Download failed");
      }

      const riskReport = await res.json();
      downloadReportsAsPdfOrZip(riskReport?.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white p-4"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center md:hidden gap-4">
            <Sidebar />
          </div>
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>

        {loading && <p>Loading reports...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && groupedFiles.length === 0 && <p>No reports found.</p>}

        <ul className="space-y-6">
          {groupedFiles.map((project, idx) => (
            <li key={idx} className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">
                Project: {project.project_name}
              </h2>
              {project.audits
                .filter((audit) => audit.audit_type_id && audit.audit_name)
                .map((audit, aIdx) => (
                  <div key={aIdx} className="ml-2 mb-4">
                    <h3 className="text-md font-medium mb-2">
                      Audit: {audit.audit_name.replace(".json", ".pdf")}
                    </h3>

                    {audit.files.length === 0 ? (
                      <p className="text-sm text-gray-400 ml-4">
                        No files available.
                      </p>
                    ) : (
                      <ul className="list-disc pl-6">
                        {audit.files.map((file, fIdx) => (
                          <li
                            key={fIdx}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2"
                          >
                            <span className="text-sm">
                              <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                              {file.filename.replace(".json", ".pdf")}
                            </span>
                            <button
                              className="mt-2 sm:mt-0 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold transition disabled:opacity-50"
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
                                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
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
