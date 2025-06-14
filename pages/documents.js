import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/utils/api_constants";
import React, { useEffect, useState } from "react";

// Helper to group files as policy/report
function groupByType(files) {
  return {
    policy: files.filter((f) => f.filename.toLowerCase().includes("policy")),
    report: files.filter((f) => f.filename.toLowerCase().includes("report")),
  };
}

// Download file handler
const downloadReport = async (projectId, auditTypeId, filename, token) => {
  const url = `${BASE_URL}/project/${projectId}/audit/${auditTypeId}/download-report/${filename}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const [deletingFiles, setDeletingFiles] = useState({});

  const token = typeof window != "undefined" && localStorage.getItem("rg-token");

  const fetchGroupedFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/files/grouped`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setGroupedFiles(data || []);
    } catch {
      setGroupedFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedFiles();
  }, []);

  const handleDownload = (projectId, auditTypeId, filename) => {
    downloadReport(projectId, auditTypeId, filename, token);
  };

  const handleDelete = async (projectId, auditTypeId, filename) => {
    setDeletingFiles((prev) => ({ ...prev, [filename]: true }));

    try {
      const response = await fetch(
        `${BASE_URL}/project/${projectId}/audit/${auditTypeId}/file/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        alert(result.message || "Failed to delete file");
      } else {
        await fetchGroupedFiles(); // Refetch updated list
      }
    } catch (error) {
      alert("Error deleting file");
    } finally {
      setDeletingFiles((prev) => {
        const updated = { ...prev };
        delete updated[filename];
        return updated;
      });
    }
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
        <h1 className="text-2xl font-bold mb-4">Documents</h1>
        {loading && <div>Loading...</div>}
        {!loading && groupedFiles.length === 0 && <div>No documents found.</div>}
        <ul>
          {groupedFiles
            .filter((group) => group.audit_name !== null)
            .map((group, idx) => {
              const { policy } = groupByType(group.files || []);
              const projectHeading = `Project: ${group.project_name}`;
              const auditHeading = `Audit: ${group.audit_name}`;

              return (
                <li key={idx} className="mb-8 border border-gray-700 rounded p-4">
                  <h2 className="text-xl text-white font-semibold mb-2">
                    {projectHeading}
                  </h2>
                  <div className="ml-4">
                    <h3 className="text-lg text-gray-300 font-medium mb-1">
                      {auditHeading}
                    </h3>
                    <div className="ml-4">
                      <div className="font-medium text-gray-400">
                        Policy Documents:
                      </div>
                      <ul className="list-disc ml-6 mb-4">
                        {policy.length === 0 && <li>No policy documents.</li>}
                        {policy.map((file) => (
                          <li key={file.filename} className="flex items-center gap-2">
                            <button
                              className="text-blue-400 underline bg-transparent border-none p-0 cursor-pointer"
                              onClick={() =>
                                handleDownload(
                                  group.project_id,
                                  group.audit_type_id,
                                  file.filename
                                )
                              }
                            >
                              {file.filename}
                            </button>
                            <button
                              className="text-red-500 text-sm"
                              onClick={() =>
                                handleDelete(
                                  group.project_id,
                                  group.audit_type_id,
                                  file.filename
                                )
                              }
                              disabled={deletingFiles[file.filename]}
                            >
                              {deletingFiles[file.filename] ? "Deleting..." : "Delete"}
                            </button>
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
