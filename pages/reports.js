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
          {groupedFiles
            .filter((group) => group.audit_name !== null)
            .map((group, idx) => {
              const { policy } = groupByType(group.files || []);
              const projectHeading = `Project: ${group.project_name}`;
              const auditHeading = `Audit: ${group.audit_name}`;

              return (
                <li
                  key={idx}
                  className="mb-8 border border-gray-700 rounded p-4"
                >
                  <h2 className="text-xl text-white font-semibold mb-2">
                    {projectHeading}
                  </h2>
                  <div className="ml-4">
                    <h3 className="text-lg text-gray-300 font-medium mb-1">
                      {auditHeading}
                    </h3>
                    <div className="ml-4">
                      <div className="font-medium text-gray-400">
                        Policy Reports:
                      </div>
                      <ul className="list-disc ml-6 mb-4">
                        {policy.length === 0 && <li>No policy documents.</li>}
                        {policy.map((file) => (
                          <li key={file.filename}>
                            <div className="flex items-center gap-4">
                              <button
                                className="text-blue-400 bg-transparent border-none p-0 cursor-pointer"
                                // onClick={() =>
                                //   handleDownload(
                                //     group.project_id,
                                //     group.audit_type_id,
                                //     file.filename
                                //   )
                                // }
                              >
                                {file.filename}
                              </button>
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm"
                                onClick={() => {
                                  setSelectedAuditType(group.audit_type_id);
                                  downloadFiles(
                                    group.audit_type_id,
                                    group.project_id,
                                    file.filename,
                                    localStorage.getItem("rg-token")
                                  );
                                }}
                                disabled={downloadLoading}
                              >
                                {downloadLoading &&
                                selectedAuditType === group.audit_type_id ? (
                                  <span className="flex items-center">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                    Downloading...
                                  </span>
                                ) : (
                                  "Download Report"
                                )}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="font-medium text-gray-400">
                        Validation Reports:
                      </div>
                      <ul className="list-disc ml-6">
                        <li>No validation reports available.</li>
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
