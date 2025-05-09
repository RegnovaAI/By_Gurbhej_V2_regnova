import React from "react";

export default function Plans() {
  const plans = [
    {
      title: "Startup",
      monthPrice: 49,
      content:
        "Perfect for early-stage teams and solo entrepreneurs beginning their compliance journey. Includes access to essential document analysis and reporting tools to ensure you meet basic regulatory requirements efficiently and cost-effectively.",
      features: ["Basic Support", "1 Project", "5 GB Storage"],
    },
    {
      title: "SMB",
      monthPrice: 149,
      content:
        "Designed for growing small to medium-sized businesses needing more robust compliance and audit capabilities. This plan offers advanced document scanning, risk scoring, detailed compliance breakdowns, and team collaboration tools to streamline operations.",
      features: ["Priority Support", "5 Projects", "50 GB Storage"],
    },
    {
      title: "Mid-Market",
      monthPrice: 499,
      content:
        "Tailored for established businesses with higher data volume and more complex compliance workflows. Includes everything in the SMB plan, plus prioritized risk alerts, automated audit trail generation, and integration with your internal systems for seamless operation.",
      features: ["24/7 Support", "Unlimited Projects", "200 GB Storage"],
    },
    {
      title: "Enterprise",
      monthPrice: 1999,
      content:
        "Built for large enterprises and regulated industries. Offers full platform access with custom onboarding, dedicated account management, API access, unlimited document processing, and advanced reporting capabilities to meet enterprise- scale audit and security demands.",
      features: ["Dedicated Support", "Custom Solutions", "Unlimited Storage"],
    },
  ];

  return (
    <div
      className="pt-32 min-h-screen flex flex-col justify-center items-center text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Membership Plans
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-[#1a2543] shadow-lg rounded-xl p-8 hover:shadow-2xl border border-[#0d276b]"
            >
              <h2 className="text-2xl text-white font-bold text-gray-800 mb-4 text-center">
                {plan.title}
              </h2>
              <p className="text-sm text-white font-normal text-[#000f26] mb-6 text-center">
                {plan.content}
              </p>
              <p className="text-sm text-white font-normal text-[#000f26] mb-6 text-center">
                <span className="font-bold">Monthly:</span> €{plan.monthPrice}
                <br />
                <span className="font-bold">Yearly:</span>{" "}
                €{plan.monthPrice * 10}
              </p>
              <button className="bg-[#9135e2] text-white py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors">
                Select This Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
