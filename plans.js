import { BASE_URL } from "@/utils/api_constants";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Plans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState("yearly"); // "monthly" or "yearly"
  const [subscription, setSubscription] = useState(null); // Store subscription details
  const [loading, setLoading] = useState(false);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  // Add both monthly and yearly prices and planIds
  const plans = [
    {
      title: "Startup",
      yearly: { price: 369, planId: "price_1RYpojDH8aTp5yNUY07sbktxG" },
      monthly: { price: 36, planId: "price_1RYpojDH8aTp5yNUY07bktxG" },
      content:
        "Perfect for early-stage teams and solo entrepreneurs beginning their compliance journey. Includes access to essential document analysis and reporting tools to ensure you meet basic regulatory requirements efficiently and cost-effectively.",
      features: ["3 uploads", "SOC 2 Lite", "referrals"],
    },
    {
      title: "SMB",
      yearly: { price: 2789, planId: "prod_SNncP6NFRlmCm4" },
      monthly: { price: 278, planId: "price_MONTHLY_SMB" },
      content:
        "Designed for growing small to medium-sized businesses needing more robust compliance and audit capabilities. This plan offers advanced document scanning, risk scoring, detailed compliance breakdowns, and team collaboration tools to streamline operations.",
      features: ["50 uploads", "PDF/CSV", "5 frameworks", "alert scheduler"],
    },
    {
      title: "Pro",
      yearly: { price: 5388, planId: "prod_SNndj3fL3wGK2U" },
      monthly: { price: 538, planId: "price_MONTHLY_PRO" },
      content:
        "Tailored for established businesses with higher data volume and more complex compliance workflows. Includes everything in the SMB plan, plus prioritized risk alerts, automated audit trail generation, and integration with your internal systems for seamless operation.",
      features: [
        "Unlimited uploads",
        "API",
        "ClauseCam™",
        "telemetry",
        "templates",
      ],
    },
    {
      title: "Enterprise",
      yearly: { price: 9999, planId: "prod_SNndH85KqeF7Qw" },
      monthly: { price: 999, planId: "price_MONTHLY_ENTERPRISE" },
      content:
        "Built for large enterprises and regulated industries. Offers full platform access with custom onboarding, dedicated account management, API access, unlimited document processing, and advanced reporting capabilities to meet enterprise- scale audit and security demands.",
      features: ["Dedicated Support", "Custom Solutions", "Unlimited Storage"],
    },
  ];

  async function subscribe(planId) {
    const token = localStorage.getItem("rg-token");
    const res = await fetch(`${BASE_URL}/create-checkout-session`, {
      method: "POST",
      body: JSON.stringify({ planId }),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  }

  useEffect(() => {
    getSubscriptionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getSubscriptionDetails() {
    const token = localStorage.getItem("rg-token");
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/subscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSubscription(data);
      setLoading(false);
    } catch (err) {
      setSubscription(null);
      setLoading(false);
    }
  }

  async function cancelSubscription() {
    if (!subscription?.subscription_id) return;
    const token = localStorage.getItem("rg-token");
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription_id: subscription.subscription_id }),
      });

      if (!response.ok) {
        alert('Failed to cancel subscription');
        setLoading(false);
        return;
      }
      alert('Subscription cancelled');
      await getSubscriptionDetails();
      setLoading(false);
    } catch (err) {
      alert('Failed to cancel subscription');
      setLoading(false);
    }
  }

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
        {/* Billing period toggle */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-lg font-semibold ${
              billingPeriod === "monthly"
                ? "bg-[#9135e2] text-white"
                : "bg-[#232e4d] text-blue-200"
            }`}
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-r-lg font-semibold ${
              billingPeriod === "yearly"
                ? "bg-[#9135e2] text-white"
                : "bg-[#232e4d] text-blue-200"
            }`}
            onClick={() => setBillingPeriod("yearly")}
          >
            Yearly
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const periodData = plan[billingPeriod];
            const isActive =
              subscription &&
              subscription.status === "active" &&
              subscription.price_id === periodData.planId;

            return (
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
                      €{periodData.price}
                    </p>
                    <p className="text-xs text-blue-300">
                      {billingPeriod === "yearly"
                        ? "Valid for 12 months"
                        : "Billed monthly"}
                    </p>
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
                {isActive ? (
                  <button
                    onClick={cancelSubscription}
                    disabled={loading}
                    className="w-full cursor-pointer bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors mt-4 disabled:opacity-60"
                  >
                    {loading ? "Cancelling..." : "Cancel Subscription"}
                  </button>
                ) : (
                  <button
                    onClick={() => subscribe(periodData.planId)}
                    className="w-full cursor-pointer bg-gradient-to-r from-[#9135e2] to-[#6d28d9] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:from-[#a855f7] hover:to-[#7c3aed] transition-colors mt-4"
                  >
                    Subscribe Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}