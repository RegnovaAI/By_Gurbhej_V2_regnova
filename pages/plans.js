import Link from "next/link";
import React, { useState } from "react";

export default function Plans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const plans = [
    {
      title: "Startup",
      price: 369,
      content:
        "Perfect for early-stage teams and solo entrepreneurs beginning their compliance journey. Includes access to essential document analysis and reporting tools to ensure you meet basic regulatory requirements efficiently and cost-effectively.",
      features: ["3 uploads", "SOC 2 Lite", "referrals"],
      planId: "prod_SNncXUOcyGtVbj"
    },
    {
      title: "SMB",
      price: 2789,
      content:
        "Designed for growing small to medium-sized businesses needing more robust compliance and audit capabilities. This plan offers advanced document scanning, risk scoring, detailed compliance breakdowns, and team collaboration tools to streamline operations.",
      features: ["50 uploads", "PDF/CSV", "5 frameworks", "alert scheduler"],
      planId: "prod_SNncP6NFRlmCm4"
    },
    {
      title: "Pro",
      price: 5388,
      content:
        "Tailored for established businesses with higher data volume and more complex compliance workflows. Includes everything in the SMB plan, plus prioritized risk alerts, automated audit trail generation, and integration with your internal systems for seamless operation.",
      features: [
        "Unlimited uploads",
        "API",
        "ClauseCam™",
        "telemetry",
        "templates",
      ],
      planId: "prod_SNndj3fL3wGK2U"
    },
    {
      title: "Enterprise",
      price: 9999,
      content:
        "Built for large enterprises and regulated industries. Offers full platform access with custom onboarding, dedicated account management, API access, unlimited document processing, and advanced reporting capabilities to meet enterprise- scale audit and security demands.",
      features: ["Dedicated Support", "Custom Solutions", "Unlimited Storage"],
      planId: "prod_SNndH85KqeF7Qw"
    },
  ];

  const paymentMethods = [
    {
      title: "Bank",
      icon: "🏦",
      description:
        "Secure bank payments via trusted financial institutions and critical for B2B, invoicing models.",
      options: [
        "Everything + Co-Pilot",
        "AI Agents",
        "Regulation radar",
        " on-prem",
      ],
    },
    {
      title: "Cards",
      icon: "💳",
      description:
        "Pay easily using your cards with variant of type and Globally accepted.",
      options: [
        "Credit Card",
        "Debit Card",
        "Visa Card",
        "Master Card",
        "Amex Card",
        "Discover Card",
      ],
    },
    {
      title: "Digital Wallets",
      icon: "📱",
      description:
        "Fast and secure payments through digital wallets with global reach, establishing strong in US/EU.",
      options: ["Apple Pay", "Google Pay", "PayPal"],
    },
    {
      title: "Buy Now, Pay Later",
      icon: "🕒",
      description: "Popular for enterprise SaaS purchases.",
      options: ["Klarna", "Affirm", "Afterpay"],
    },
  ];

  const handleSubscribe = async (priceId) => {
    const res = await fetch("http://localhost:8000/create-checkout-session/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", amount: 379 }),
    });

    const data = await res.json();
    window.location.href = data.checkout_url;
  };

  return (
    <div
      className="pt-32 min-h-screen flex flex-col justify-center items-center text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pricing-container mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Membership Plans
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
    relative bg-gradient-to-br from-[#1a2543] via-[#232e4d] to-[#2d3a5c]
    shadow-xl rounded-2xl p-8 border border-[#2e3a5c]
    hover:shadow-2xl hover:-translate-y-2 hover:border-[#9135e2]
    transition-all duration-300 group
    flex flex-col justify-between
  `}
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-wide">
                  {plan.title}
                </h2>
                <div className="text-center mb-4 border-b border-blue-900 pb-4">
                  <p className="text-4xl font-extrabold text-white mb-1">
                    €{plan.price}
                  </p>
                  <p className="text-xs text-blue-300">Valid for 12 months</p>
                </div>
                <ul className="flex flex-col gap-2 text-blue-100 text-sm mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#9135e2]">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSubscribe(plan.planId)}
                className="w-full cursor-pointer bg-gradient-to-r from-[#9135e2] to-[#6d28d9] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:from-[#a855f7] hover:to-[#7c3aed] transition-colors mt-4"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-60 backdrop-blur-sm">
            <div className="bg-[#000f26] text-white rounded-lg max-w-7xl w-11/12 md:w-3/5 p-4 sm:p-6 md:p-10 relative max-h-screen overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-300 text-xl sm:text-2xl"
                aria-label="Close Modal"
              >
                ✖
              </button>

              {/* Modal Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
                Choose Payment Method for {selectedPlan?.title}
              </h2>

              {/* Payment Type Selection */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="planType"
                    value="monthly"
                    defaultChecked
                    className="form-radio w-4 h-4 sm:w-5 sm:h-5 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-blue-100 text-sm sm:text-base md:text-lg font-medium">
                    Monthly
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="planType"
                    value="annual"
                    className="form-radio w-4 h-4 sm:w-5 sm:h-5 text-purple-600 focus:ring-purple-500 border-gray-300 cursor-pointer"
                  />
                  <span className="text-blue-100 text-sm sm:text-base md:text-lg font-medium">
                    Annual
                  </span>
                </label>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map((method, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0e1543] p-4 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl mb-2">
                      {method.icon}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-blue-200 mb-4">
                      {method.description}
                    </p>
                    <div className="flex justify-center">
                      <ul className="list-disc text-blue-100 text-sm flex flex-col gap-2">
                        {method.options.map((option, i) => (
                          <li key={i} className="text-start">
                            <Link
                              href={`/payment/${option
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="text-blue-300 hover:underline"
                            >
                              {option}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
