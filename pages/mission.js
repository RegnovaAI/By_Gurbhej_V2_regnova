import React from 'react'

export default function Mission() {
  return (
    <div
      className="min-h-screen items-center justify-center flex flex-col text-white px-4 pt-24"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h3 className="mb-6 lg:mb-8 text-2xl lg:text-4xl font-bold text-center">Mission Statement</h3>
        <p className="text-lg lg:text-xl text-justify">RegnovaAI's mission is to revolutionize enterprise compliance by deploying cutting-edge AI that automates audit risk analysis, compliance scoring, and reporting at scale. We are building a platform that eliminates regulatory friction, accelerates audit cycles, and delivers audit-grade insights in real time—so that high-growth companies can focus on scaling without compliance bottlenecks. By combining deep document intelligence with domain-specific models, we aim to be the invisible engine powering audit readiness across fintech, healthcare, defense, and beyond.</p>
      </div>
    </div>
  )
}
