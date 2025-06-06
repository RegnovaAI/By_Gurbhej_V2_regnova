import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/utils/api_constants";
import React, { useEffect, useState } from "react";

// Helper to group files as policy/report
function groupByType(files) {
  return {
    policy: files.filter(f => f.filename.toLowerCase().includes("policy")),
    report: files.filter(f => f.filename.toLowerCase().includes("report")),
  };
}

// Download file handler
const downloadReport = async (projectId, auditTypeId, filename, token) => {
  const url = `${BASE_URL}/project/${projectId}/audit/${auditTypeId}/download-report/${filename}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    alert("Failed to download file");
    return;
  }

  const disposition = response.headers.get("content-disposition");
  let downloadFilename = filename;
  if (disposition && disposition.indexOf("filename=") !== -1) {
    downloadFilename = disposition.split("filename=")[1].replace(/"/g, "");
  }

  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = downloadFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(urlBlob);
};

export default function Documents() {
  const [groupedFiles, setGroupedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleDownload = (projectId, auditTypeId, filename) => {
    const token = localStorage.getItem("rg-token");
    downloadReport(projectId, auditTypeId, filename, token);
  };

  return (
    <div className="flex bg-gray-900 flex-col w-screen h-screen lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        {loading && <div>Loading...</div>}
        {!loading && groupedFiles.length === 0 && <div>No documents found.</div>}
        <ul>
          {groupedFiles.map((group, idx) => {
            const { policy, report } = groupByType(group.files || []);
            return (
              <li key={idx} className="mb-6">
                <div className="font-bold text-lg mb-2">
                  Project ID: {group.project_id} | Audit ID: {group.audit_type_id}
                </div>
                <div className="ml-4">
                  {/* <div className="font-medium">Policy Documents:</div>
                  <ul className="list-disc ml-6">
                    {policy.length === 0 && <li>No policy documents.</li>}
                    {policy.map((file) => (
                      <li key={file.filename}>
                        <button
                          className="text-blue-400 underline bg-transparent border-none p-0 cursor-pointer"
                          onClick={() =>
                            handleDownload(group.project_id, group.audit_type_id, file.filename)
                          }
                        >
                          {file.filename}
                        </button>
                      </li>
                    ))}
                  </ul> */}
                  <div className="font-medium mt-2">Report Documents:</div>
                  <ul className="list-disc ml-6">
                    {report.length === 0 && <li>No report documents.</li>}
                    {report.map((file) => (
                      <li key={file.filename}>
                        <button
                          className="text-blue-400 underline bg-transparent border-none p-0 cursor-pointer"
                          onClick={() =>
                            handleDownload(group.project_id, group.audit_type_id, file.filename)
                          }
                        >
                          {file.filename}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}