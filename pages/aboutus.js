import React from "react";

export default function Aboutus() {
  return (
    <div
      className="min-h-screen flex item-center justify-center flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="mb-8 text-4xl font-bold text-center">About RegnovaAI</h3>
        <p className="text-xl text-justify">
          RegnovaAI is a pioneering AI startup focused on streamlining
          compliance risk audits for enterprises. By leveraging advanced
          document parsing and LLM-driven analysis, RegnovaAI delivers
          actionable reports on data handling, consent, GDPR, and more — helping
          teams mitigate risk and stay compliant effortlessly.
        </p>
      </div>
    </div>
  );
}
