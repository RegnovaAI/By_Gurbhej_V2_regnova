import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { BASE_URL } from "@/utils/api_constants";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
// import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function ProjectDetails() {
  const [projectDetails, setProjectDetails] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [selectedAuditType, setSelectedAuditType] = useState(null)

  const removeUploadFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchProjectDetails = async (idx) => {
    try {
      const token = localStorage.getItem("rg-token");
      const resp = await fetch(`${BASE_URL}/project/${idx}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await resp.json();
      console.log(response);
      setProjectDetails(response || {});
    } catch (err) {
      console.log(err);
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

  const handleUploadDocs = async (e) => {
    e.preventDefault();
    if (!uploadFiles.length) {
      toast.error("Please select files to upload.");
      return;
    }
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
      setProjectToUpload(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload documents");
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

        <h1 className="text-2xl font-semibold text-white">Audit Types</h1>

        {/* Audit Accordions */}
        <div className="space-y-4">
          {projectDetails?.audit_types?.map((audit) => (
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
                        setIsUploadModalOpen(true)
                        setSelectedAuditType(audit.id)
                      }}
                    >
                      Upload Document
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm">
                      Download Report
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm">
                      Run Audit
                    </button>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
