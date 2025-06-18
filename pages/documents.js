"use client";

import Sidebar from "@/components/Sidebar";
import { BASE_URL } from "@/utils/api_constants";
import React, { useEffect, useState } from "react";

function groupByType(files) {
  return {
    policy: files.filter((f) => f.filename.toLowerCase().includes("policy")),
    report: files.filter((f) => f.filename.toLowerCase().includes("report")),
  };
}

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
    typeof window !== "undefined" && localStorage.getItem("rg-token");

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
          audit_name,
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
        await fetchGroupedFiles(); // Refresh
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
      className="flex flex-col lg:flex-row h-screen overflow-hidden overflow-y-auto p-4"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center md:hidden gap-4">
            <Sidebar />
          </div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
        </div>

        {loading && <div className="text-white">Loading...</div>}

        {!loading && groupedFiles.length === 0 && (
          <div className="text-white">No documents found.</div>
        )}

        <ul className="space-y-6">
          {groupedFiles.map((project, idx) => (
            <li
              key={idx}
              className="bg-gray-800 rounded-lg shadow-md transition-all p-4 sm:p-5"
            >
              <h2 className="text-xl text-white font-semibold mb-3">
                Project: {project.project_name}
              </h2>

              {(project.audits || [])
                .filter(
                  (audit) => audit.audit_name && audit.audit_name.trim() !== ""
                )
                .map((audit, auditIdx) => (
                  <div key={auditIdx} className="ml-0 sm:ml-4 mb-6">
                    <h3 className="text-lg text-gray-300 font-medium mb-3 border-b border-gray-700 pb-2">
                      Audit: {audit.audit_name}
                    </h3>
                    <ul className="space-y-2">
                      {audit.files.map((file, fileIdx) => (
                        <li
                          key={fileIdx}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-300 bg-gray-700 px-4 py-2 rounded-md"
                        >
                          <div className="flex items-center mb-2 sm:mb-0">
                            <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
                            {file.filename}
                          </div>
                          <div className="flex flex-wrap gap-2">
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
