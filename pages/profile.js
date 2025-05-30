"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import ProjectCard from "../components/ProjectCard";
import ProfileHeader from "../components/ProfileHeader";
import { Search, User, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { auditTypes } from "@/utils/constant";
import { useDropzone } from "react-dropzone";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState([]);
  const [isShowDocs, setIsShowDocs] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    riskLevel: "Low",
    description: "",
  });
  const [isDemo, setIsDemo] = useState(false);

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

  // useEffect(() => {
  //   if (selectedAuditTypes.length === 0) {
  //     setSelectAuditOption(true);
  //   }
  // }, [selectedAuditTypes]);

  const projects = [
    {
      name: "Project Alpha",
      createdDate: "Apr 18, 2023",
      department: "Finance",
      dueDate: "Due Jan on Apr 18",
      riskLevel: "Medium",
      auditScore: 72,
      status: "In Progress",
      statusColor: "text-blue-400",
    },
    {
      name: "Project Beta",
      createdDate: "Apr 13, 2023",
      department: "Arcanai",
      dueDate: "Cue Jad on Apr 18",
      riskLevel: "High",
      auditScore: 89,
      status: "Completed",
      statusColor: "text-green-400",
    },
    {
      name: "Project Gamma",
      createdDate: "Apr 18, 2023",
      department: "Procect",
      dueDate: "Created on Apr 18",
      riskLevel: "Low",
      auditScore: 91,
      status: "In Progress",
      statusColor: "text-blue-400",
    },
    {
      name: "Project Delta",
      createdDate: "Apr 10, 2023",
      department: "Proc. Delta",
      dueDate: "Due scoree",
      riskLevel: "High",
      auditScore: 67,
      status: "Completed",
      statusColor: "text-green-400",
    },
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("New project data:", formData);
    // Reset form and close modal
    setFormData({
      name: "",
      department: "",
      riskLevel: "Low",
      description: "",
    });
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      department: "",
      riskLevel: "Low",
      description: "",
    });
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

  const handleShowUploadDocs = () => {
    setIsShowDocs(true);
  };

  return (
    <div className="flex flex-col w-screen h-screen lg:flex-row">
      <Sidebar />

      <div className="bg-gray-900 text-white flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="text-xl font-semibold">Dassh</div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Profile Section */}
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1181293/pexels-photo-1181293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Jane Doe"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Jane Doe</h1>
                    <div className="text-gray-400 mb-1">Compliance Manager</div>
                    <div className="text-gray-400 mb-3">Acme Corporation</div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-gray-400 text-sm">
                  <span>email: jane.doe@acme.com</span>
                  <span className="ml-8">May 25, 2025 — 10:14 AM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-500 mb-4 transition-colors"
            >
              + Add Project
            </button>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {project.name}
                        </h3>
                        <div className="text-gray-400 text-sm mb-3">
                          Created on {project.createdDate}
                        </div>

                        <div className="flex space-x-4">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            View Audits
                          </button>
                          {/* <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Manage Team
                          </button> */}
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Upload Docs
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-12">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div
                              className={`font-medium mb-1 ${project.statusColor}`}
                            >
                              {project.status}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {project.status}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Add New Project
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-w-2xl mx-auto">
              <h3 className="mb-5 text-3xl font-semibold text-white-200">
                Audit Types
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
                  onClick={handleShowUploadDocs}
                  className="px-6 py-2 font-semibold rounded-xl bg-blue-600 cursor-pointer text-white shadow-lg hover:scale-105 transition"
                >
                  Continue
                </button>
              </div>
              {errorText && (
                <p className="text-red-400 text-lg mt-4">{errorText}</p>
              )}
              {isShowDocs && (
                <div
                  {...getRootProps()}
                  className="flex flex-col items-center border-2 border-dashed border-[#3e5074] bg-[#000f26] rounded-xl p-8 shadow-xl transition mt-8"
                >
                  <input {...getInputProps()} multiple />
                  <button
                    type="button"
                    onClick={open}
                    disabled={isDemo}
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
                    disabled={isDemo}
                    className="mt-6 px-8 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
                    type="button"
                  >
                    Analyze & Get Audit Report
                  </button>
                  {errorText && (
                    <p className="text-red-400 text-lg mt-4">{errorText}</p>
                  )}
                </div>
              )}
               <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
