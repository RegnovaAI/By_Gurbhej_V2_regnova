import Sidebar from "../components/Sidebar";
import { Search, User, ChevronRight, X, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { auditTypes, scopeOptions } from "@/utils/constant";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { BASE_URL } from "@/utils/api_constants";
import { toast, Toaster } from "react-hot-toast"; // <-- Add Toaster import
import ProfileImage from "@/components/ProfileImage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generatePDFReport } from "@/utils/generatePDF";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Download helper - same as in [id].js
async function downloadReportsAsPdfOrZip(results) {
  if (!results || results.length === 0) return;
  if (results.length === 1) {
    const { filename, risk_report } = results[0];
    generatePDFReport(filename, risk_report);
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

export default function Dashboard() {
  // User state
  const [user, setUser] = useState(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    company_name: "",
    // role: "",
  });

  // Project state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error message

  // Modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState([]);
  const [selectedScopes, setSelectedScopes] = useState({}); // New state for scopes
  const [selectedFile, setSelectedFile] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    riskLevel: "Low",
    description: "",
  });
  const [isDemo, setIsDemo] = useState(false);

  // New states for project actions
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [projectToUpload, setProjectToUpload] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);

  // Add at the top of the Dashboard component:
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [selectedAuditTypeByProject, setSelectedAuditTypeByProject] = useState(
    {}
  );
  const [uploadAuditTypeOptions, setUploadAuditTypeOptions] = useState([]);

  // Fetch user and projects on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("rg-token");
        const res = await fetch(`${BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    async function fetchProjects() {
      setProjectsLoading(true);
      try {
        const token = localStorage.getItem("rg-token");
        const res = await fetch(`${BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setProjects([]);
          setProjectsLoading(false);
          setError(
            "Something went wrong while loading projects. Please try again."
          );
          return;
        }
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        setProjects([]);
        console.error("Failed to fetch projects:", err);
      } finally {
        setProjectsLoading(false);
      }
    }

    fetchUser();
    fetchProjects();
  }, []);

  // Edit user modal open
  const openEditUserModal = () => {
    setEditUserData({
      name: user?.name || "",
      email: user?.email || "",
      company_name: user?.company_name || "",
      // role: user?.role || "",
    });
    setIsEditUserOpen(true);
  };

  // Audit type selection
  const toggleAuditType = (auditType) => {
    setSelectedAuditTypes((prevSelected) => {
      const isCurrentlySelected = prevSelected.includes(auditType);
      let newSelected;

      if (isCurrentlySelected) {
        // Remove the audit type
        newSelected = prevSelected.filter((type) => type !== auditType);
        // Clear scopes for this audit type
        setSelectedScopes((prev) => {
          const newScopes = { ...prev };
          delete newScopes[auditType];
          return newScopes;
        });
      } else {
        // Add the audit type
        newSelected = [...prevSelected, auditType];
      }

      return newSelected;
    });
    setErrorText("");
  };

  // Remove audit type
  const removeAuditType = (auditType) => {
    setSelectedAuditTypes((prev) => prev.filter((type) => type !== auditType));
  };

  // Handle scope selection
  const toggleScope = (auditType, scope) => {
    setSelectedScopes((prev) => {
      const currentScopes = prev[auditType] || [];
      const isSelected = currentScopes.includes(scope);

      return {
        ...prev,
        [auditType]: isSelected
          ? currentScopes.filter((s) => s !== scope)
          : [...currentScopes, scope],
      };
    });
  };

  // Handle input change for project form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle project form submit (dummy, replace with actual API if needed)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setErrorText("Project name is required.");
      return;
    }
    if (selectedAuditTypes.length === 0) {
      setErrorText("Select at least one audit type.");
      return;
    }

    // Check if required scopes are selected for audit types that need them
    const auditTypesWithScopes = selectedAuditTypes.filter(
      (type) => scopeOptions[type]
    );
    const missingScopeAuditTypes = auditTypesWithScopes.filter(
      (type) => !selectedScopes[type] || selectedScopes[type].length === 0
    );

    if (missingScopeAuditTypes.length > 0) {
      setErrorText(
        `Please select at least one scope for: ${missingScopeAuditTypes.join(
          ", "
        )}`
      );
      return;
    }

    setErrorText("");
    const form = new FormData();
    form.append("name", formData.name);
    selectedAuditTypes.forEach((type) => form.append("audittypes", type));

    // Add scope data to form - send as JSON for nested structure
    const scopeData = {};
    Object.keys(selectedScopes).forEach((auditType) => {
      if (selectedScopes[auditType] && selectedScopes[auditType].length > 0) {
        scopeData[auditType] = selectedScopes[auditType];
      }
    });

    if (Object.keys(scopeData).length > 0) {
      form.append("scopes", JSON.stringify(scopeData));
    }

    selectedFile.forEach((file) => form.append("files", file));

    try {
      const token = localStorage.getItem("rg-token");
      const res = await fetch(`${BASE_URL}/project`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create project");
      }

      toast.success("Project created successfully!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        department: "",
        riskLevel: "Low",
        description: "",
      });
      setSelectedAuditTypes([]);
      setSelectedScopes({}); // Clear scopes
      setSelectedFile([]);
      // Refresh projects list
      setProjectsLoading(true);
      const projectsRes = await fetch(`${BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projectsData = await projectsRes.json();
      setProjects(
        Array.isArray(projectsData) ? projectsData : projectsData.projects || []
      );
      setProjectsLoading(false);
    } catch (err) {
      setErrorText(err.message || "Failed to create project");
      toast.error(err.message || "Failed to create project");
    }
  };

  // Modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      department: "",
      riskLevel: "Low",
      description: "",
    });
    setSelectedAuditTypes([]);
    setSelectedScopes({}); // Clear scopes when closing modal
  };

  // File handling for Add Project & Edit Project
  const removeFile = (index) => {
    setSelectedFile((prev) => prev.filter((_, i) => i !== index));
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

  // --- Upload Docs Modal Dropzone ---
  // Add a new state to track the selected audit type for upload
  const [uploadAuditType, setUploadAuditType] = useState(null);

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

  const removeUploadFile = (index) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Project Actions Handlers ---

  // Delete project
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      const token = localStorage.getItem("rg-token");
      const res = await fetch(`${BASE_URL}/project/${projectToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      toast.success("Project deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  // Upload docs
  const handleUploadDocs = async (e) => {
    e.preventDefault();
    if (!uploadFiles.length) {
      toast.error("Please select files to upload.");
      return;
    }
    if (!projectToUpload || !uploadAuditType) {
      toast.error("No project or audit type selected.");
      return;
    }
    try {
      const token = localStorage.getItem("rg-token");
      const form = new FormData();
      uploadFiles.forEach((file) => form.append("files", file));
      const res = await fetch(
        `${BASE_URL}/project/${projectToUpload.id}/audit/${uploadAuditType}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );
      if (!res.ok) {
        // Try to parse error message
        let errMsg = "Failed to upload documents";
        try {
          const errData = await res.json();
          if (Array.isArray(errData.detail)) {
            errMsg = errData.detail
              .map((e) => e.msg || JSON.stringify(e))
              .join(", ");
          } else if (typeof errData.detail === "object") {
            errMsg = errData.detail.msg || JSON.stringify(errData.detail);
          } else if (errData.detail) {
            errMsg = errData.detail;
          }
        } catch {}
        toast.error(errMsg);
        setIsUploadModalOpen(false);
        setUploadFiles([]);
        setProjectToUpload(null);
        setUploadAuditType(null);
        return;
      }
      toast.success("Documents uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFiles([]);
      setProjectToUpload(null);
      setUploadAuditType(null);
    } catch (err) {
      toast.error(err.message || "Failed to upload documents");
    }
  };

  // Edit project modal
  const openEditProjectModal = (project) => {
    // Transform the project data to match expected structure
    const transformedProject = {
      ...project,
      audittypes: project.audittypes?.map((at) => at.name) || [],
    };

    setEditProjectData(transformedProject);

    // Initialize scopes for edit mode
    const projectScopes = {};
    if (project.audittypes && Array.isArray(project.audittypes)) {
      project.audittypes.forEach((auditTypeObj) => {
        if (
          auditTypeObj.name &&
          auditTypeObj.scopes &&
          Array.isArray(auditTypeObj.scopes)
        ) {
          projectScopes[auditTypeObj.name] = auditTypeObj.scopes;
        }
      });
    }
    setSelectedScopes(projectScopes);

    setIsEditProjectOpen(true);
  };

  // Edit project handler
  const handleEditProject = async (e) => {
    e.preventDefault();
    if (!editProjectData?.name) return;

    // Check if required scopes are selected for audit types that need them
    const auditTypesWithScopes = (editProjectData?.audittypes || []).filter(
      (type) => scopeOptions[type]
    );
    const missingScopeAuditTypes = auditTypesWithScopes.filter(
      (type) => !selectedScopes[type] || selectedScopes[type].length === 0
    );

    if (missingScopeAuditTypes.length > 0) {
      toast.error(
        `Please select at least one scope for: ${missingScopeAuditTypes.join(
          ", "
        )}`
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", editProjectData.name);

    (editProjectData?.audittypes || []).forEach((type) => {
      formData.append("audittypes", type);
    });

    // Add scope data to form - send as JSON for nested structure
    const scopeData = {};
    Object.keys(selectedScopes).forEach((auditType) => {
      if (selectedScopes[auditType] && selectedScopes[auditType].length > 0) {
        scopeData[auditType] = selectedScopes[auditType];
      }
    });

    if (Object.keys(scopeData).length > 0) {
      formData.append("scopes", JSON.stringify(scopeData));
    }

    selectedFile.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = localStorage.getItem("rg-token");
      const res = await fetch(`${BASE_URL}/project/${editProjectData.id}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Project updated successfully");
        setIsEditProjectOpen(false);
        setSelectedScopes({}); // Clear scopes

        // Refresh projects list
        setProjectsLoading(true);
        const projectsRes = await fetch(`${BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projectsData = await projectsRes.json();
        setProjects(
          Array.isArray(projectsData)
            ? projectsData
            : projectsData.projects || []
        );
        setProjectsLoading(false);
      } else {
        toast.error(data.detail || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Something went wrong");
    }
  };

  // --- New: Run and Download, Delete functions ---
  const handleDownloadReport = async (projectId, auditTypeId) => {
    if (!auditTypeId) {
      toast.error("Please select an audit type.");
      return;
    }
    try {
      const token = localStorage.getItem("rg-token");
      const response = await fetch(
        `${BASE_URL}/project/${projectId}/audit/${auditTypeId}/risk-report`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch risk report");
      const data = await response.json();
      await downloadReportsAsPdfOrZip(data.results);
      toast.success("Risk report downloaded!");
    } catch (error) {
      toast.error(error?.message || "Download failed.");
    }
  };

  const handleDeleteAuditType = async (projectId, auditTypeId) => {
    if (!auditTypeId) {
      toast.error("Please select an audit type.");
      return;
    }
    try {
      const token = localStorage.getItem("rg-token");
      const res = await fetch(
        `${BASE_URL}/project/${projectId}/audit/${auditTypeId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete audit type");
      toast.success("Audit deleted successfully!");
      // Refresh project list after deletion
      setProjectsLoading(true);
      const projectsRes = await fetch(`${BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projectsData = await projectsRes.json();
      setProjects(
        Array.isArray(projectsData) ? projectsData : projectsData.projects || []
      );
      setProjectsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Failed to delete audit type");
    }
  };

  // Loader and empty view for projects
  const renderProjects = () => {
    if (projectsLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="mb-4 text-lg">{error}</p>
          <button
            onClick={() => setProjectsLoading(true)}
            className="px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-500 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }
    if (!projects || projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="mb-4 text-lg">No projects found.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-500 transition-colors cursor-pointer"
          >
            + Add Project
          </button>
        </div>
      );
    }
    return projects.map((project, index) => {
      const auditTypesForProject = project.audittypes || [];
      const auditTypeOptions = Array.isArray(auditTypesForProject)
        ? auditTypesForProject
        : [];
      const selectedAuditType =
        selectedAuditTypeByProject[project.id] ??
        (auditTypeOptions[0] && auditTypeOptions[0].id) ??
        "";
      const selectedAuditTypeObj = auditTypeOptions.find(
        (opt) => String(opt.id) === String(selectedAuditType)
      );
      return (
        <div
          key={project.id || index}
          className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors mb-2 cursor-pointer"
          onClick={() => {
            setExpandedProjectId(
              expandedProjectId === project.id ? null : project.id
            );
            // Optionally auto-select the first audit type when opening
            if (expandedProjectId !== project.id) {
              const firstAuditTypeId =
                (project.audittypes &&
                  project.audittypes[0] &&
                  project.audittypes[0].id) ||
                "";
              setSelectedAuditTypeByProject((prev) => ({
                ...prev,
                [project.id]: firstAuditTypeId,
              }));
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <button
                    className="text-xl underline font-semibold mb-1 text-left focus:outline-none"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#60a5fa",
                      cursor: "pointer",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.name}
                  </button>
                  <div className="text-gray-400 text-sm mb-3">
                    Created on{" "}
                    {formatDate(project.createdDate || project.created_at)}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      className="text-yellow-400 hover:text-yellow-300 text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditProjectModal(project);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                        setProjectToDelete(project);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex space-x-12">
                  <div className="flex items-center space-x-2">
                    <div>
                      <div
                        className={`font-medium mb-1 ${
                          project.statusColor || "text-blue-400"
                        }`}
                      >
                        {project.status || "In Progress"}
                      </div>
                      <div className="text-gray-400 text-sm cursor-pointer">
                        {project.status || "In Progress"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Accordion content */}
          {expandedProjectId === project.id && (
            <div
              className="mt-4 bg-gray-900 rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <select
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none"
                  value={selectedAuditType}
                  onChange={(e) =>
                    setSelectedAuditTypeByProject((prev) => ({
                      ...prev,
                      [project.id]: e.target.value,
                    }))
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {auditTypeOptions.length === 0 && (
                    <option value="">No Audit Types</option>
                  )}
                  {auditTypeOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUploadModalOpen(true);
                    setProjectToUpload(project);
                    setUploadAuditType(selectedAuditType); // <-- this is now the ID
                    const auditTypesForProject = project.audittypes || [];
                    const auditTypeOptions = Array.isArray(auditTypesForProject)
                      ? auditTypesForProject
                      : [];
                    setUploadAuditTypeOptions(auditTypeOptions);
                  }}
                >
                  Upload Document
                </button>
                {/* --- UPDATED BUTTONS! --- */}
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadReport(project.id, selectedAuditType);
                  }}
                  disabled={!selectedAuditType}
                >
                  Run and Download Report
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAuditType(project.id, selectedAuditType);
                  }}
                  disabled={!selectedAuditType}
                >
                  Delete
                </button>
              </div>
              {/* --- SCOPES AS BADGES --- */}
              {selectedAuditTypeObj &&
                Array.isArray(selectedAuditTypeObj.scopes) &&
                selectedAuditTypeObj.scopes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedAuditTypeObj.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-4 py-1 rounded-full font-medium text-white text-sm"
                        style={{
                          background:
                            "linear-gradient(90deg, #5f98ff 0%, #a845ff 100%)",
                          boxShadow: "0 1px 4px 0 rgba(60,35,140,0.12)",
                        }}
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="flex flex-col w-screen h-screen lg:flex-row"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster position="top-right" /> {/* <-- Add Toaster here */}
      <div className="hidden lg:flex h-full p-4">
        <Sidebar />
      </div>
      <div className="text-white flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center md:hidden gap-4">
            <Sidebar />
          </div>
          <div className="text-xl font-semibold">Dashboard</div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
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
              {/* <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden">
                <img
                  src={
                    user?.avatar ||
                    "https://images.pexels.com/photos/1181293/pexels-photo-1181293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  }
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              </div> */}
              {user && <ProfileImage user={user} />}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">
                      {user?.name || ""}
                    </h1>
                    <div className="text-gray-400 mb-1">
                      {user?.role || "Compliance Manager"}
                    </div>
                    {user?.company_name && (
                      <div className="text-gray-400 mb-3">
                        {user?.company_name || ""}
                      </div>
                    )}
                    <button
                      className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                      onClick={openEditUserModal}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">
                  <span>Email: {user?.email || ""}</span>
                  {/* <span className="ml-8">
                    {console.log("user?.created_at", user?.created_at)}
                    {formatDate(user?.created_at) || "May 25, 2025 — 10:14 AM"}
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 rounded-lg text-sm hover:bg-green-500 mb-4 transition-colors cursor-pointer"
            >
              + Add Project
            </button>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">{renderProjects()}</div>
        </div>
      </div>
      {/* Add Project Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Add New Project
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="max-w-2xl mx-auto">
                <div className="mt-8 mb-6">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Project Name"
                    className="ml-4 bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 w-64"
                  />
                </div>
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
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-[#192447] border-[#2e3a5e] hover:border-blue-400`}
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

                {/* Scope Selection */}
                {selectedAuditTypes.some((type) => scopeOptions[type]) && (
                  <div className="mb-8">
                    <h3 className="mb-5 text-3xl font-semibold text-white-200">
                      Select Scopes
                    </h3>
                    {selectedAuditTypes
                      .filter((type) => scopeOptions[type])
                      .map((auditType) => (
                        <div key={auditType} className="mb-6">
                          <h4 className="mb-3 text-xl font-semibold text-blue-400">
                            {auditType} Scopes
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {scopeOptions[auditType].map((scope) => {
                              const isSelected =
                                selectedScopes[auditType]?.includes(scope) ||
                                false;
                              return (
                                <label
                                  key={scope}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-400"
                                      : "bg-[#192447] border-[#2e3a5e] hover:border-blue-400"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      toggleScope(auditType, scope)
                                    }
                                    className="form-checkbox w-4 h-4 accent-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-white font-medium">
                                    {scope}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                {errorText && (
                  <p className="text-red-400 text-lg mt-4">{errorText}</p>
                )}
                {selectedFile && selectedFile.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white">
                      Selected Files:
                    </h3>
                    <div className="flex flex-col flex-wrap gap-2 mt-2 justify-start items-start">
                      {selectedFile.map((file, index) => (
                        <span
                          key={file.name}
                          className="flex items-center bg-gradient-to-r from-green-200 to-green-400 text-green-900 px-4 py-1 rounded shadow "
                        >
                          {file.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="ml-2 px-2 py-1 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white hover:bg-red-600 transition"
                            title="Remove file"
                            disabled={isDemo}
                          >
                            Delete
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors cursor-pointer"
                  >
                    Create Project
                  </button>
                </div>

                {/* Contact note */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm text-center font-medium">
                    💡 To add new policy, please contact us!
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {isEditUserOpen && (
        <div
          className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setIsEditUserOpen(false)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
              <button
                onClick={() => setIsEditUserOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem("rg-token");
                  const res = await fetch(`${BASE_URL}/user`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editUserData),
                  });
                  if (!res.ok) throw new Error("Update failed");
                  const updated = await res.json();
                  setUser(updated);
                  setIsEditUserOpen(false);
                  toast.success("Profile updated successfully!");
                } catch (err) {
                  toast.error("Failed to update user");
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Company Name</label>
                <input
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                  value={editUserData.company_name}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      company_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditUserOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Project Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Project
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{projectToDelete?.name}</span>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Upload Docs Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Upload Documents
            </h2>
            <div className="mb-2 text-white text-sm">
              <span className="font-semibold">Audit Type:</span>{" "}
              {uploadAuditTypeOptions.find((opt) => opt.id === uploadAuditType)
                ?.name || uploadAuditType}
            </div>
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
                          disabled={isDemo}
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
                  disabled={isDemo}
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
      {isEditProjectOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Edit Project</h2>
              <button
                onClick={() => setIsEditProjectOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditProject}>
              <div className="max-w-2xl mx-auto">
                <div className="mt-8 mb-6">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editProjectData?.name || ""}
                    onChange={(e) =>
                      setEditProjectData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Project Name"
                    className="ml-4 bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 w-64"
                  />
                </div>
                <h3 className="mb-5 text-3xl font-semibold text-white-200">
                  Audit Types
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                  {auditTypes.map((auditType) => {
                    const isChecked = (
                      editProjectData?.audittypes || []
                    ).includes(auditType);
                    return (
                      <label
                        key={auditType}
                        htmlFor={`edit-checkbox-${auditType}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-[#192447] border-[#2e3a5e] hover:border-blue-400`}
                      >
                        <input
                          type="checkbox"
                          id={`edit-checkbox-${auditType}`}
                          value={auditType}
                          checked={isChecked}
                          onChange={() => {
                            setEditProjectData((prev) => {
                              const prevTypes = prev?.audittypes || [];
                              const newTypes = prevTypes.includes(auditType)
                                ? prevTypes.filter((type) => type !== auditType)
                                : [...prevTypes, auditType];

                              // Clear scopes when deselecting audit type
                              if (prevTypes.includes(auditType)) {
                                setSelectedScopes((prevScopes) => {
                                  const newScopes = { ...prevScopes };
                                  delete newScopes[auditType];
                                  return newScopes;
                                });
                              }

                              return {
                                ...prev,
                                audittypes: newTypes,
                              };
                            });
                          }}
                          className="form-checkbox w-5 h-5 accent-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-white font-semibold">
                          {auditType}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Scope Selection for Edit Project */}
                {(editProjectData?.audittypes || []).some(
                  (type) => scopeOptions[type]
                ) && (
                  <div className="mb-8">
                    <h3 className="mb-5 text-3xl font-semibold text-white-200">
                      Select Scopes
                    </h3>
                    {(editProjectData?.audittypes || [])
                      .filter((type) => scopeOptions[type])
                      .map((auditType) => (
                        <div key={auditType} className="mb-6">
                          <h4 className="mb-3 text-xl font-semibold text-blue-400">
                            {auditType} Scopes
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {scopeOptions[auditType].map((scope) => {
                              const isSelected =
                                selectedScopes[auditType]?.includes(scope) ||
                                false;
                              return (
                                <label
                                  key={scope}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-400"
                                      : "bg-[#192447] border-[#2e3a5e] hover:border-blue-400"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      toggleScope(auditType, scope)
                                    }
                                    className="form-checkbox w-4 h-4 accent-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-white font-medium">
                                    {scope}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                {/* File upload section for Edit Project */}
                {selectedFile && selectedFile.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white">
                      Selected Files:
                    </h3>
                    <div className="flex flex-col flex-wrap gap-2 mt-2 justify-start items-start">
                      {selectedFile.map((file, index) => (
                        <span
                          key={file.name}
                          className="flex items-center bg-gradient-to-r from-green-200 to-green-400 text-green-900 px-4 py-1 rounded shadow "
                        >
                          {file.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="ml-2 px-2 py-1 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white hover:bg-red-600 transition"
                            title="Remove file"
                            disabled={isDemo}
                          >
                            Delete
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditProjectOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
