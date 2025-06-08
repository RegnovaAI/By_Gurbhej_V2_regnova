// ...existing imports...
import React, { useEffect, useState } from "react";
import {
  Search,
  User,
  ChevronLeft,
  FileText,
  AlertTriangle,
  CheckCircle,
  Edit,
  Shield,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/router";
import { BASE_URL } from "@/utils/api_constants";

// ...existing code...

export default function AuditView() {
  // State for sidebar expansion and selection
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [expandedAudit, setExpandedAudit] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedClause, setSelectedClause] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [riskTab, setRiskTab] = useState("all"); // NEW: risk filter tab

  console.log('selectedAudit', selectedAudit)
  console.log('selectedDocument', selectedDocument)

  // API data state
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiResults, setApiResults] = useState([]);
  const [frameworkScores, setFrameworkScores] = useState({});

  const router = useRouter();

  // Utility for risk bg color
  const getRiskBg = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-800/80 border-red-500/40";
      case "medium":
        return "bg-yellow-800/80 border-yellow-500/40";
      case "low":
        return "bg-blue-800/80 border-blue-500/40";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

  // Utility for risk icon bg
  const getRiskIconBg = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-500/20";
      case "medium":
        return "bg-yellow-500/20";
      case "low":
        return "bg-blue-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  // Utility for risk icon color
  const getRiskIconColor = (risk) => {
    switch (risk) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  // Build auditTypes and auditDocuments from API results
  const auditTypes = React.useMemo(() => {
    const types = [];
    const seen = new Set();
    apiResults.forEach((result) => {
      if (!seen.has(result.audit_type)) {
        types.push({
          name: result.audit_type,
          status:
            result.risk_report &&
            result.risk_report.risks.some((r) => r.risk_level === "High")
              ? "high"
              : result.risk_report &&
                result.risk_report.risks.some((r) => r.risk_level === "Medium")
              ? "medium"
              : result.risk_report &&
                result.risk_report.risks.some((r) => r.risk_level === "Low")
              ? "low"
              : "missing",
          count: apiResults.filter((r) => r.audit_type === result.audit_type)
            .length,
        });
        seen.add(result.audit_type);
      }
    });
    return types;
  }, [apiResults]);

  // Build auditDocuments structure from API results
  const auditDocuments = React.useMemo(() => {
    const docs = {};
    apiResults.forEach((result) => {
      if (!docs[result.audit_type]) docs[result.audit_type] = [];
      docs[result.audit_type].push({
        id: result.filename,
        name: result.filename,
        clauses: [
          ...(result.risk_report || []).map((r, idx) => ({
            id: `${result.filename}-risk-${idx}`,
            text: r.issue,
            risk: r.risk_level ? r.risk_level.toLowerCase() : "missing",
            suggestion: r.suggestion,
            riskDetail: r.explanation,
            citation: r.citation,
            validation_status: r.validation_status,
          })),
          ...(result.tagged_clauses || []).map((c, idx) => ({
            id: `${result.filename}-clause-${idx}`,
            text: c.clause,
            risk: c.risk_level ? c.risk_level.toLowerCase() : "missing",
            suggestion: "",
            riskDetail: "",
            citation: c.citation,
            validation_status: c.validation_status,
          })),
        ],
      });
    });
    return docs;
  }, [apiResults]);

  // Fetch API data and handle loading/error state
  async function fetchProjects() {
    setApiLoading(true);
    setApiError(null);
    try {
      const token = localStorage.getItem("rg-token");
      const res = await fetch(
        `${BASE_URL}/project/${router?.query?.projectId}/audit-report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();

      console.log("data", data);
      setApiResults(data.results || []);
      setFrameworkScores(data.framework_scores || {});
      // Set default selected audit and document
      if (data.results && data.results.length > 0) {
        setSelectedAudit(data.results[0].audit_type);
        setSelectedDocument({
          id: data.results[0].filename,
          name: data.results[0].filename,
          clauses: [
            ...(data.results[0].risk_report || []).map((r, idx) => ({
              id: `${data.results[0].filename}-risk-${idx}`,
              text: r.issue,
              risk: r.risk_level ? r.risk_level.toLowerCase() : "missing",
              suggestion: r.suggestion,
              riskDetail: r.explanation,
              citation: r.citation,
              validation_status: r.validation_status,
            })),
            ...(data.results[0].tagged_clauses || []).map((c, idx) => ({
              id: `${data.results[0].filename}-clause-${idx}`,
              text: c.clause,
              risk: c.risk_level ? c.risk_level.toLowerCase() : "missing",
              suggestion: "",
              riskDetail: "",
              citation: c.citation,
              validation_status: c.validation_status,
            })),
          ],
        });
      }
    } catch (err) {
      setApiError("Failed to fetch projects: " + err.message);
      setApiResults([]);
      setFrameworkScores({});
    } finally {
      setApiLoading(false);
    }
  }

  useEffect(() => {
    if (router?.query?.projectId) {
      fetchProjects();
    }
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      case "missing":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "high":
        return "High Risk";
      case "medium":
        return "Medium Risk";
      case "low":
        return "Low Risk";
      case "missing":
        return "Missing";
      default:
        return "Unknown";
    }
  };

  // Responsive font size utility
  const fontSize = "text-base sm:text-base md:text-lg lg:text-xl xxl:text-xl";
  const headingSize = "text-lg sm:text-xl md:text-xl xxl:text-3xl";
  const subheadingSize =
    "text-base sm:text-lg md:text-xl lg:text-xl xxl:text-2xl";

 async function handleFixAuditReport(projectId) {
  try {
    const token = localStorage.getItem("rg-token");
    const response = await fetch(`${BASE_URL}/project/${projectId}/fix-risk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: selectedDocument.name,
        audit_type: selectedAudit,
        option: 'fix'
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate fixed report");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Extract extension from original filename
    const extension = selectedDocument.name.split('.').pop();
    link.download = `fixed_audit_report_project_${projectId}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the fixed report:", error);
    alert("Something went wrong. Try again.");
  }
}


  return (
    <div className="flex flex-col w-screen h-screen lg:flex-row bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 lg:hidden">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
          <div className={`font-semibold ${headingSize}`}>Audit View</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Policy Documents Only */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div
              className="flex items-center space-x-2 mb-6 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              <h2 className={`font-semibold ${headingSize}`}>
                RegnovaPilot<sup>TM</sup>
              </h2>
            </div>
            {/* Only show policy documents */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Audit Type</h4>
              {auditTypes.map((audit, index) => (
                <div key={index}>
                  <div
                    onClick={() => {
                      setExpandedAudit(
                        expandedAudit === audit.name ? null : audit.name
                      );
                      setSelectedAudit(audit.name);
                      setSelectedDocument(null);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedAudit === audit.name
                        ? "bg-gray-700 border-blue-500"
                        : "bg-gray-750 border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${fontSize}`}>
                          {audit.name}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div
                            className={`w-2 h-2 ${getStatusColor(
                              audit.status
                            )} rounded-full`}
                          ></div>
                          <span className="text-base text-gray-400">
                            {getStatusText(audit.status)}
                          </span>
                        </div>
                      </div>
                      {audit.count > 0 && (
                        <div
                          className={`px-2 py-1 text-base rounded-full ${getStatusColor(
                            audit.status
                          )} text-white`}
                        >
                          {audit.count}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Only show policy docs */}
                  {expandedAudit === audit.name &&
                    auditDocuments[audit.name] && (
                      <div className="ml-4 mt-2 space-y-1">
                        {auditDocuments[audit.name].map((doc) => (
                          <div
                            key={doc.id}
                            className={`cursor-pointer text-base py-1 ${
                              selectedDocument && selectedDocument.id === doc.id
                                ? "text-blue-400 font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedDocument(doc);
                              setSelectedClause(null);
                            }}
                          >
                            {doc.name}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
            {/* API Loading/Error State */}
            {apiLoading && (
              <div className="mt-4 text-blue-400 flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" /> Loading audit
                report...
              </div>
            )}
            {apiError && <div className="mt-4 text-red-400">{apiError}</div>}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className={`font-semibold ${headingSize}`}>Audit Details</div>
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
            {/* Framework Scores */}
            {Object.keys(frameworkScores).length > 0 && (
              <div className="mb-6 flex flex-wrap gap-4">
                {Object.entries(frameworkScores).map(([fw, score]) => (
                  <div
                    key={fw}
                    className="bg-gray-800 px-4 py-2 rounded-lg text-sm"
                  >
                    <span className="font-semibold">{fw}:</span>{" "}
                    <span className="text-blue-400">{score}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Audit Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className={`font-semibold mb-2 ${headingSize}`}>
                    {selectedAudit}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      {/* Risk filter tabs */}
                      <div className="flex space-x-2">
                        {["all", "high", "medium", "low"].map((riskType) => (
                          <button
                            key={riskType}
                            onClick={() => setRiskTab(riskType)}
                            className={`px-3 py-1 rounded text-base font-semibold transition-colors ${
                              riskTab === riskType
                                ? riskType === "high"
                                  ? "bg-red-500 text-white"
                                  : riskType === "medium"
                                  ? "bg-yellow-500 text-white"
                                  : riskType === "low"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-700 text-white"
                                : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                          >
                            {riskType === "all"
                              ? "All"
                              : riskType.charAt(0).toUpperCase() +
                                riskType.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* <div className="text-gray-400">•</div>
                    <div className="text-gray-400">Last updated: May 25, 2025</div> */}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center space-x-2" onClick={() => handleFixAuditReport(router?.query?.projectId)}>
                    <Edit className="w-4 h-4" />
                    <span>Fix It</span>ss
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Modify Policy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "description"
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Description & Suggestions
                </button>
                <button
                  onClick={() => setActiveTab("policy")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "policy"
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Clauses
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "description" && (
              <div className="space-y-6">
                {/* Loader for right side */}
                {apiLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
                  </div>
                ) : (
                  <>
                    {/* Risk Assessment - dynamic from risk_report, filtered by riskTab */}
                    {selectedDocument &&
                    selectedDocument.clauses &&
                    selectedDocument.clauses.filter((c) => c.risk !== "missing")
                      .length > 0 ? (
                      selectedDocument.clauses
                        .filter((clause) =>
                          riskTab === "all"
                            ? clause.risk === "high" ||
                              clause.risk === "medium" ||
                              clause.risk === "low"
                            : clause.risk === riskTab
                        )
                        .map((clause, idx) => (
                          <div
                            key={clause.id}
                            className={`rounded-lg p-6 border ${getRiskBg(
                              clause.risk
                            )} transition-all`}
                          >
                            <div className="flex items-start space-x-4">
                              <div
                                className={`p-2 rounded-lg ${getRiskIconBg(
                                  clause.risk
                                )}`}
                              >
                                {clause.risk === "high" ? (
                                  <AlertTriangle
                                    className={`w-6 h-6 ${getRiskIconColor(
                                      clause.risk
                                    )}`}
                                  />
                                ) : clause.risk === "medium" ? (
                                  <Shield
                                    className={`w-6 h-6 ${getRiskIconColor(
                                      clause.risk
                                    )}`}
                                  />
                                ) : (
                                  <CheckCircle
                                    className={`w-6 h-6 ${getRiskIconColor(
                                      clause.risk
                                    )}`}
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3
                                  className={`font-semibold mb-2 ${subheadingSize} ${getRiskIconColor(
                                    clause.risk
                                  )}`}
                                >
                                  {clause.risk.charAt(0).toUpperCase() +
                                    clause.risk.slice(1)}{" "}
                                  Risk
                                </h3>
                                <div
                                  className={`mb-2 text-gray-300 ${fontSize}`}
                                >
                                  {clause.text}
                                </div>
                                {clause.riskDetail && (
                                  <div className="text-base text-gray-400 mb-2">
                                    {clause.riskDetail}
                                  </div>
                                )}
                                {clause.suggestion && (
                                  <div className="mt-2">
                                    <span className="font-semibold text-blue-400">
                                      Recommendation:{" "}
                                    </span>
                                    <span className="text-gray-200">
                                      {clause.suggestion}
                                    </span>
                                    {clause.citation && (
                                      <span className="ml-2 text-base text-gray-400">
                                        ({clause.citation})
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className="mt-2 text-base text-gray-400">
                                  <span>
                                    Status: {clause.validation_status || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold mb-2 text-green-400 ${subheadingSize}`}
                            >
                              No Risks Detected
                            </h3>
                            <p className={`text-gray-300 ${fontSize}`}>
                              No significant risks were found in this document.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "policy" && (
              <div className="space-y-6">
                {/* Loader for right side */}
                {apiLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
                  </div>
                ) : (
                  selectedDocument && (
                    <div className="bg-gray-800 rounded-lg p-6 mt-6 border border-gray-700">
                      <h3
                        className={`font-semibold mb-4 text-blue-400 ${subheadingSize}`}
                      >
                        Clauses
                      </h3>
                      <div className="space-y-2">
                        {selectedDocument.clauses.length === 0 && (
                          <div className="text-base text-gray-400">
                            No clauses found.
                          </div>
                        )}
                        {selectedDocument.clauses.map((clause) => (
                          <div
                            key={clause.id}
                            className={`cursor-pointer py-2 px-3 rounded hover:bg-gray-700 ${fontSize}`}
                            onClick={() => setSelectedClause(clause)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{clause.text}</span>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-base ${
                                  clause.risk === "high"
                                    ? "bg-red-500 text-white"
                                    : clause.risk === "medium"
                                    ? "bg-yellow-500 text-white"
                                    : clause.risk === "low"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-500 text-white"
                                }`}
                              >
                                {clause.risk
                                  ? clause.risk.charAt(0).toUpperCase() +
                                    clause.risk.slice(1)
                                  : "Unknown"}
                              </span>
                            </div>
                            {selectedClause &&
                              selectedClause.id === clause.id && (
                                <div className="mt-2 ml-2 text-base text-gray-300">
                                  <div>
                                    <strong>Suggestion:</strong>{" "}
                                    {clause.suggestion}
                                  </div>
                                  <div>
                                    <strong>Risk Detail:</strong>{" "}
                                    {clause.riskDetail}
                                  </div>
                                  <div>
                                    <strong>Citation:</strong> {clause.citation}
                                  </div>
                                  <div>
                                    <strong>Status:</strong>{" "}
                                    {clause.validation_status}
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ...end of file...
