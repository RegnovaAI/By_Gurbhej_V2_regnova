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

  const paymentMethods = [
    {
      title: "Bank",
      icon: "🏦",
      description:
        "Secure bank payments via trusted financial institutions and critical for B2B, invoicing models.",
      options: ["ACH (US)", "SEPA (EU)", "FPS (UK)", "UPI (India)"],
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-[#1a2543] shadow-lg rounded-xl p-8 hover:shadow-2xl border border-[#0d276b] hover:shadow-blue-800 transition-all duration-300"
            >
              <h2 className="text-2xl text-white font-bold text-gray-800 mb-4 text-center">
                {plan.title}
              </h2>
              <p className="text-lg text-white font-normal text-[#000f26] mb-6 text-center">
                {plan.content}
              </p>
              <div className="flex flex-col items-center mb-6">
                <div>
                  <p className="text-lg text-white flex font-normal text-[#000f26] mb-0">
                    <strong className="font-bold min-w-24 text-start">
                      Monthly:
                    </strong>{" "}
                    €{plan.monthPrice}
                  </p>
                  <p className="text-lg text-white flex font-normal text-[#000f26] mb-6">
                    <strong className="font-bold min-w-24 text-start">
                      Yearly:
                    </strong>{" "}
                    €{plan.monthPrice * 10}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openModal(plan)}
                className="bg-[#9135e2] text-white py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors"
              >
                Select This Plan
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
