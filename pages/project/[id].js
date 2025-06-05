import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { BASE_URL } from "@/utils/api_constants";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
// import { ChevronDownIcon } from '@heroicons/react/24/outline'
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generatePDFReport } from "@/utils/generatePDF";
import { auditTypes } from "@/utils/constant";

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

export default function ProjectDetails() {
  const [projectDetails, setProjectDetails] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedAuditType, setSelectedAuditType] = useState(null);
  const [loading, setLoading] = useState(false); // Loader for main content
  const [error, setError] = useState(""); // Error for main content
  const [downloadLoading, setDownloadLoading] = useState(false); // Loader for download
  const [uploadLoading, setUploadLoading] = useState(false); // Loader for upload
  const [isAddAuditModalOpen, setIsAddAuditModalOpen] = useState(false);
  const [addAuditLoading, setAddAuditLoading] = useState(false);
  const [auditTypeName, setAuditTypeName] = useState("");

  const removeUploadFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Enhanced error handling for fetchProjectDetails
  const fetchProjectDetails = async (idx) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("rg-token");
      const resp = await fetch(`${BASE_URL}/project/${idx}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resp.ok) alert("Failed to fetch project details");
      const response = await resp.json();
      setProjectDetails(response || {});
    } catch (err) {
      setError(err?.message || "Failed to fetch project details");
      setProjectDetails({}); // fallback to empty object to avoid UI break
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    const id = router?.query?.id;
    if (id) {
      fetchProjectDetails(id);
    }
  }, [router]);

  const onUploadDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploadFiles((prev) => {
        const existingNames = prev.map((f) => f.name);
        const newFiles = acceptedFiles.filter(
          (f) => !existingNames.includes(f.name)
        );
        return [...prev, ...newFiles];
      });
    }
  }, []);

  const {
    getRootProps: getUploadRootProps,
    getInputProps: getUploadInputProps,
    open: openUpload,
  } = useDropzone({
    onDrop: onUploadDrop,
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

  // Enhanced error handling for upload
  const handleUploadDocs = async (e) => {
    e.preventDefault();
    if (!uploadFiles.length) {
      toast.error("Please select files to upload.");
      return;
    }
    setUploadLoading(true);
    try {
      const token = localStorage.getItem("rg-token");
      const form = new FormData();
      uploadFiles.forEach((file) => form.append("files", file)); // <-- key must be "files"
      const res = await fetch(
        `${BASE_URL}/project/${projectDetails.id}/audit/${selectedAuditType}/upload`, // <-- match your FastAPI route
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );
      if (!res.ok) throw new Error("Failed to upload documents");
      toast.success("Documents uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFiles([]);
      setSelectedAuditType(null);
      fetchProjectDetails(projectDetails.id);
    } catch (err) {
      toast.error(err?.message || "Failed to upload documents");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteAudit = async (auditId) => {
    setUploadLoading(true);
    try {
      const token = localStorage.getItem("rg-token");
      const res = await fetch(
        `${BASE_URL}/project/${projectDetails.id}/audit/${auditId}`, // <-- match your FastAPI route
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) console.log("Failed to delete audit");
      toast.success("Audit deleted successfully!");
      setUploadFiles([]);
      setSelectedAuditType(null);
      fetchProjectDetails(projectDetails.id);
    } catch (err) {
      toast.error(err?.message || "Failed to delete audit");
    } finally {
      setUploadLoading(false);
    }
  };

  // Enhanced error handling for download

  // const downloadFiles = async (auditId) => {
  //   if (!auditId) {
  //     toast.error("Please select an audit type.");
  //     return;
  //   }

  //   setDownloadLoading(true);

  //   try {
  //     const token = localStorage.getItem("rg-token");
  //     const response = await fetch(
  //       `${BASE_URL}/project/${projectDetails.id}/audit/${auditId}/risk-report`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch risk report");
  //     }

  //     const disposition = response.headers.get("Content-Disposition");
  //     let filename = "risk-report.json";
  //     if (disposition && disposition.includes("filename=")) {
  //       const match = disposition.match(/filename="?([^"]+)"?/);
  //       if (match?.[1]) filename = match[1];
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);

  //     toast.success("Risk report downloaded!");
  //     fetchProjectDetails(projectDetails.id);
  //   } catch (error) {
  //     console.error("Error fetching risk report:", error);
  //     toast.error(error?.message || "Failed to download risk report.");
  //   } finally {
  //     setDownloadLoading(false);
  //   }
  // };

  const downloadFiles = async (auditId) => {
    if (!auditId) {
      toast.error("Please select an audit type.");
      return;
    }

    setDownloadLoading(true);

    try {
      const token = localStorage.getItem("rg-token");
      const response = await fetch(
        `${BASE_URL}/project/${projectDetails.id}/audit/${auditId}/risk-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) console.log("Failed to fetch risk report");
      
      const data = await response.json(); // expect { results: [...], dna_score: 87 }
      
      if(data?.warning) {
        alert(data?.warning)
        return
      }

      await downloadReportsAsPdfOrZip(data.results);
      toast.success("Risk report downloaded!");

      fetchProjectDetails(projectDetails.id);
    } catch (error) {
      console.error("Error fetching risk report:", error);
      toast.error(error?.message || "Download failed.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleAddAudit = async (e) => {
    e.preventDefault();
    if (!auditTypeName.trim()) {
      toast.error("Please enter an audit type name.");
      return;
    }
    setAddAuditLoading(true);
    try {
      const token = localStorage.getItem("rg-token");
      const formData = new FormData();
      formData.append("audit_type_name", auditTypeName);
      const res = await fetch(
        `${BASE_URL}/project/${projectDetails.id}/audit/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to add audit type");
      toast.success("Audit type added!");
      setIsAddAuditModalOpen(false);
      setAuditTypeName("");
      // Refresh project details to show new audit
      fetchProjectDetails(projectDetails.id);
    } catch (err) {
      toast.error(err?.message || "Failed to add audit type");
    } finally {
      setAddAuditLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-900 text-white w-screen h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400">
          <ol className="list-reset flex">
            <li>
              <Link href="/" className="text-gray-300 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/profile" className="text-gray-300 hover:underline">
                Projects
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-100">Project Details</li>
          </ol>
        </nav>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Audit Types</h1>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm"
            onClick={() => setIsAddAuditModalOpen(true)}
          >
            Add Audit
          </button>
        </div>

        {/* Loader and Error */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-2"></span>
            <span>Loading project details...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-700 text-white px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Audit Accordions */}
        {!loading && !error && Array.isArray(projectDetails?.audit_types) && (
          <div className="space-y-4">
            {projectDetails.audit_types.map((audit) => (
              <details
                key={audit.name}
                className="bg-gray-800 rounded-lg shadow-md group transition-all"
                open
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 text-lg font-medium text-white hover:bg-gray-700 transition-colors rounded-lg">
                  <span>{audit.name}</span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 group-open:rotate-180 transform transition-transform" />
                </summary>

                <div className="border-t border-gray-700 px-4 pb-4">
                  <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-white">DNA Score:</span>{" "}
                      {audit.dna_score}%
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
                        onClick={() => {
                          setIsUploadModalOpen(true);
                          setSelectedAuditType(audit.id);
                        }}
                        disabled={uploadLoading}
                      >
                        {uploadLoading && selectedAuditType === audit.id ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Uploading...
                          </span>
                        ) : (
                          "Upload Document"
                        )}
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm"
                        onClick={() => {
                          setSelectedAuditType(audit.id);
                          downloadFiles(audit.id);
                        }}
                        disabled={downloadLoading}
                      >
                        {downloadLoading && selectedAuditType === audit.id ? (
                          <span className="flex items-center">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Downloading...
                          </span>
                        ) : (
                          "Run and Download Report"
                        )}
                      </button>
                      {/* <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm">
                        Run Audit
                      </button> */}
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm"
                        onClick={() => {
                          handleDeleteAudit(audit.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}

        {/* If no audit types and not loading/error, show fallback */}
        {!loading &&
          !error &&
          (!projectDetails?.audit_types ||
            projectDetails.audit_types.length === 0) && (
            <div className="text-gray-400 text-center py-10">
              No audit types found for this project.
            </div>
          )}
      </div>
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Upload Documents
            </h2>
            <form onSubmit={handleUploadDocs}>
              {uploadFiles && uploadFiles.length > 0 && (
                <div className="my-6">
                  <h3 className="text-lg font-semibold text-white">
                    Selected Files:
                  </h3>
                  <div className="flex flex-col flex-wrap gap-2 mt-2 justify-start items-start">
                    {uploadFiles.map((file, index) => (
                      <span
                        key={file.name}
                        className="flex items-center bg-gradient-to-r from-green-200 to-green-400 text-green-900 px-4 py-1 rounded shadow "
                      >
                        {file.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUploadFile(index);
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
              <div
                {...getUploadRootProps()}
                className="flex mb-4 flex-col items-center border-2 border-dashed border-[#3e5074] bg-[#000f26] rounded-xl p-8 shadow-xl transition mt-0"
              >
                <input {...getUploadInputProps()} multiple />
                <button
                  type="button"
                  onClick={openUpload}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
                  disabled={uploadLoading}
                >
                  Browse & Select Files
                </button>
                <div className="w-full mt-4 flex flex-col gap-2 items-center">
                  <p className="text-lg font-normal text-white">
                    Drag and drop a document here, or click to select one
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddAuditModalOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Add Audit Type
            </h2>
            <form onSubmit={handleAddAudit}>
              {/* <input
                type="text"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4"
                placeholder="Audit Type Name"
                value={auditTypeName}
                onChange={(e) => setAuditTypeName(e.target.value)}
                disabled={addAuditLoading}
                autoFocus
              /> */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {auditTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border ${
                      auditTypeName === type
                        ? "bg-purple-700 border-purple-500"
                        : "bg-[#192447] border-[#2e3a5e] hover:border-blue-400"
                    }`}
                    onClick={() => setAuditTypeName(type)}
                  >
                    <input
                      type="radio"
                      name="auditTypeRadio"
                      value={type}
                      checked={auditTypeName === type}
                      onChange={() => setAuditTypeName(type)}
                      className="form-radio accent-purple-500"
                      disabled={addAuditLoading}
                    />
                    <span className="text-white font-semibold">{type}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddAuditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                  disabled={addAuditLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors cursor-pointer"
                  disabled={addAuditLoading}
                >
                  {addAuditLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Adding...
                    </span>
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
