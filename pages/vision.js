import React from "react";

export default function Vission() {
  return (
    <div
      className="pt-32 min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="mb-4 text-4xl font-bold text-center">Vision Statement</h3>
        <p className="text-center">Our vision is to become the global standard in AI-driven regulatory co-pilots, helping every enterprise navigate compliance with confidence, speed, and clarity. We envision a world where every audit report is instant, every risk is visible, and every organization—regardless of size—has access to elite-grade governance tools. As we scale, RegnovaAI will be the platform of choice for unicorns and Fortune 500s alike, redefining how the world sees compliance: not as a cost, but as a strategic advantage.</p>
      </div>
    </div>
  );
}
