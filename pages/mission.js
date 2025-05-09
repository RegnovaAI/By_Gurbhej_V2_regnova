import React from 'react'

export default function Mission() {
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
        <h3 className="mb-4 text-4xl font-bold text-center">Mission Statement</h3>
        <p className="text-center">RegnovaAI's mission is to revolutionize enterprise compliance by deploying cutting-edge AI that automates audit risk analysis, compliance scoring, and reporting at scale. We are building a platform that eliminates regulatory friction, accelerates audit cycles, and delivers audit-grade insights in real time—so that high-growth companies can focus on scaling without compliance bottlenecks. By combining deep document intelligence with domain-specific models, we aim to be the invisible engine powering audit readiness across fintech, healthcare, defense, and beyond.</p>
      </div>
    </div>
  )
}
