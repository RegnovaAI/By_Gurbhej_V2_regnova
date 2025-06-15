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

  const token =
    typeof window != "undefined" && localStorage.getItem("rg-token");

  const fetchGroupedFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/files/uploaded/grouped`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // Normalize: group audits under projects
      const grouped = {};

      data.forEach((item) => {
        const { project_id, project_name, audit_type_id, audit_name, files } =
          item;

        if (!grouped[project_id]) {
          grouped[project_id] = {
            project_id,
            project_name,
            audits: [],
          };
        }

        grouped[project_id].audits.push({
          audit_type_id,
          audit_name: audit_name,
          files,
        });
      });

      setGroupedFiles(Object.values(grouped));
    } catch (err) {
      console.error(err);
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
        <h1 className="text-2xl font-bold mb-4 text-white">Documents</h1>
        {loading && <div className="text-white">Loading...</div>}
        {!loading && groupedFiles.length === 0 && (
          <div className="text-white">No documents found.</div>
        )}
        <ul>
          {groupedFiles.map((project, idx) => (
            <li key={idx} className="bg-gray-800 rounded-lg shadow-md group transition-all p-3">
              <h2 className="text-xl text-white font-semibold mb-2">
                Project: {project.project_name}
              </h2>

              {/* Loop audits */}
              {(project.audits || [])
                .filter(
                  (audit) => audit.audit_name && audit.audit_name.trim() !== ""
                )
                .map((audit, auditIdx) => (
                  <div key={auditIdx} className="ml-4 mb-4">
                    <h3 className="text-lg text-gray-300 font-medium mb-2 border-b border-gray-700 pb-2 mb-4">
                      Audit: {audit.audit_name}
                    </h3>
                    <ul className="list-disc">
                      {audit.files.map((file, fileIdx) => (
                        <li
                          key={fileIdx}
                          className="flex justify-between items-center mb-2 text-gray-300"
                        >
                          <span className="flex items-center">
                            <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>{" "}
                            {/* Dot */}
                            {file.filename}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm"
                              onClick={() =>
                                handleDownload(
                                  project.project_id,
                                  audit.audit_type_id,
                                  file.filename
                                )
                              }
                            >
                              Download
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm"
                              onClick={() =>
                                handleDelete(
                                  project.project_id,
                                  audit.audit_type_id,
                                  file.filename
                                )
                              }
                              disabled={deletingFiles[file.filename]}
                            >
                              {deletingFiles[file.filename]
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
