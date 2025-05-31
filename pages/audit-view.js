import React, { useState } from 'react';
import { Search, User, ChevronLeft, FileText, AlertTriangle, CheckCircle, Edit, Shield } from 'lucide-react';
import { useRouter } from 'next/router';

export default function AuditView() {
  const [selectedAudit, setSelectedAudit] = useState('GDPR Data Processing Agreement');
  const [activeTab, setActiveTab] = useState('description');

  const auditTypes = [
    { name: 'GDPR', status: 'high', count: 3 },
    { name: 'GDPR Data Processing Agreement', status: 'high', count: 1 },
    { name: 'GDPR Privacy Policy', status: 'medium', count: 2 },
    { name: 'HIPAA', status: 'low', count: 1 },
    { name: 'HIPAA Security Rule Policy', status: 'missing', count: 1 },
    { name: 'PCI DSS', status: 'medium', count: 2 },
    { name: 'PCI DSS Compliance Policy', status: 'low', count: 1 },
    { name: 'SOC 2', status: 'high', count: 1 },
    { name: 'SOC 2 Security and Availability Policy', status: 'missing', count: 1 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'missing': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      case 'missing': return 'Missing';
      default: return 'Unknown';
    }
  };

  const router = useRouter()

  return (
    <div className="flex flex-col w-screen h-screen lg:flex-row bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 lg:hidden">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push('/profile')}>
          <ChevronLeft className="w-5 h-5 text-gray-400" />
          <div className="text-xl font-semibold">Audit View</div>
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
        {/* Sidebar - Audit Types */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              <h2 className="text-xl font-semibold">Audit Types</h2>
            </div>
            
            {/* Risk Level Legend */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Low</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">High</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-300">Missing</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {auditTypes.map((audit, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAudit(audit.name)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedAudit === audit.name
                      ? 'bg-gray-700 border-blue-500'
                      : 'bg-gray-750 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{audit.name}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 ${getStatusColor(audit.status)} rounded-full`}></div>
                        <span className="text-xs text-gray-400">{getStatusText(audit.status)}</span>
                      </div>
                    </div>
                    {audit.count > 0 && (
                      <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(audit.status)} text-white`}>
                        {audit.count}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="text-xl font-semibold">Audit Details</div>
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
            {/* Audit Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold mb-2">{selectedAudit}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-400 font-medium">High Risk</span>
                    </div>
                    <div className="text-gray-400">•</div>
                    <div className="text-gray-400">Last updated: May 25, 2025</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Fix It</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Modify Policy</span>
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Validate</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Description & Suggestions
                </button>
                <button
                  onClick={() => setActiveTab('policy')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'policy'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Policy & Validation
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                {/* Risk Assessment Card */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-red-400">Risk Assessment</h3>
                      <p className="text-gray-300 mb-4">
                        Individuals may lack control over their data being shared with third parties, potentially 
                        leading to unauthorized data disclosure.
                      </p>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h4 className="font-medium text-red-400 mb-2">Critical Issues Found:</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                          <li>Missing data subject consent mechanisms</li>
                          <li>Inadequate third-party data sharing controls</li>
                          <li>No clear opt-out procedures defined</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions Card */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-blue-400">Recommendations</h3>
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h4 className="font-medium text-blue-400 mb-2">Immediate Actions:</h4>
                          <ul className="list-decimal list-inside text-gray-300 space-y-2">
                            <li>Implement explicit consent collection mechanisms for data sharing</li>
                            <li>Create clear opt-out procedures accessible to all data subjects</li>
                            <li>Establish data sharing agreements with third parties</li>
                            <li>Implement technical measures to respond to data subject requests</li>
                          </ul>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <h4 className="font-medium text-green-400 mb-2">Long-term Improvements:</h4>
                          <ul className="list-decimal list-inside text-gray-300 space-y-2">
                            <li>Regular auditing of data sharing practices</li>
                            <li>Staff training on GDPR compliance requirements</li>
                            <li>Automated systems for handling data subject requests</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'policy' && (
              <div className="space-y-6">
                {/* Policy Content */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-4 text-purple-400">Policy Statement</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 mb-4">
                          This statement sets out data subjects' rights and data processors' obligations 
                          regarding data subject requests.
                        </p>
                        <h4 className="text-white font-medium mb-2">Key Requirements:</h4>
                        <div className="bg-gray-750 rounded-lg p-4 mb-4">
                          <p className="text-gray-300 mb-3">
                            <strong className="text-white">Data Opt-out Rights:</strong> The data importer shall provide 
                            the data subject with the ability to opt out of having personal data disclosed to third parties.
                          </p>
                          <p className="text-gray-300 mb-3">
                            <strong className="text-white">Technical Measures:</strong> The data importer shall ensure that 
                            appropriate technical and organizational measures are in place to respond to data subject requests.
                          </p>
                          <p className="text-gray-300">
                            <strong className="text-white">Response Capability:</strong> Independent clauses shall provide 
                            the data subject with the ability to respond to data subject requests.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Status */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-4 text-yellow-400">Validation Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
                          <span className="text-gray-300">Consent Mechanisms</span>
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Missing</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
                          <span className="text-gray-300">Opt-out Procedures</span>
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Missing</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
                          <span className="text-gray-300">Technical Measures</span>
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Partial</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-750 rounded-lg p-3">
                          <span className="text-gray-300">Documentation</span>
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}