import React, { useState } from "react";

// Sample JSON from your API
// const tagged_clauses = [
//   {
//     clause:
//       "RegnovaAI Compliance Risk Report\nFile Audited: 4_CorporateComplianceUpdated.pdf-HIPAA\nRisk Summary:\nHigh: 1\nMedium: 3\nLow: 0\n#\nIssue\nRisk\nLevel\nExplanation\nSuggestion\n1\nLack of specific HIPAA\ncompliance policy\nHigh\nThe document does not mention any\nspecific policies or procedures related\nto HIPAA compliance.",
//     frameworks: ["SOC 2"],
//     risk_level: "High",
//     citation: "SOC 2 CC6.6",
//   },
//   {
//     clause:
//       "This is a\nsignificant risk as it leaves the\norganization vulnerable to potential\nHIPAA violations, which can result in\nsevere penalties.",
//     frameworks: ["HIPAA"],
//     risk_level: "Medium",
//     citation: "HIPAA CC6.6",
//   },
//   {
//     clause:
//       "Include a section specifically\ndedicated to HIPAA compliance,\noutlining the organization's policies\nand procedures for ensuring the\nprivacy and security of Protected\nHealth Information (PHI).",
//     frameworks: ["SOC 2"],
//     risk_level: "High",
//     citation: "SOC 2 CC6.6",
//   },
//   // ... Add all other clauses
// ];


export default function ClauseCam({tagged_clauses}) {
const allFrameworks = [
    ...new Set(tagged_clauses.flatMap((c) => c.frameworks)),
];
  const [selectedFrameworks, setSelectedFrameworks] = useState(allFrameworks);

  const handleToggle = (framework) => {
    setSelectedFrameworks((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework]
    );
  };

  const filteredClauses = tagged_clauses.filter((clause) =>
    clause.frameworks.some((f) => selectedFrameworks.includes(f))
  );

  const riskColors = {
    High: "bg-yellow-800/40 border-yellow-400 text-yellow-300",
    Medium: "bg-purple-800/40 border-purple-400 text-purple-300",
    Low: "bg-green-800/50 border-green-400 text-green-300",
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-48 pr-4">
        <h2 className="text-lg font-semibold mb-4">ClauseCam™</h2>
        <ul className="space-y-2">
          {allFrameworks.map((framework) => (
            <li key={framework}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFrameworks.includes(framework)}
                  onChange={() => handleToggle(framework)}
                  className="form-checkbox text-blue-500"
                />
                <span>{framework}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-1 text-sm">
          <div>
            <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            Safe
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
            Risky (why)
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Missing (from standard)
          </div>
        </div>
      </div>

      {/* Clause Display */}
      <div className="flex-1 space-y-4">
        {filteredClauses.map((clause, index) => (
          <div
            key={index}
            className={`p-4 rounded border-l-4 ${riskColors[clause.risk_level] || "bg-gray-800/40 border-gray-400"}`}
          >
            <p className="whitespace-pre-wrap">{clause.clause}</p>
            <p className="mt-2 text-sm italic text-gray-400">
              Frameworks: {clause.frameworks.join(", ")} | Citation: {clause.citation}
            </p>
          </div>
        ))}

        {filteredClauses.length === 0 && (
          <div className="text-gray-400">No clauses match the selected frameworks.</div>
        )}
      </div>
    </div>
  );
}
