// import { BASE_URL } from "@/utils/api_constants";
// import { loadStripe } from "@stripe/stripe-js";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// export default function Plans() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [billingPeriod, setBillingPeriod] = useState("yearly");
//   const [subscription, setSubscription] = useState(null);
//   const [loadingPlanId, setLoadingPlanId] = useState(null); // 🔁 Track loading per plan
//   const [cancelling, setCancelling] = useState(false);

//   const openModal = (plan) => {
//     setSelectedPlan(plan);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPlan(null);
//   };

//   const plans = [
//     {
//       title: "Essential",
//       yearly: { price: 369, planId: "price_1RZCI8QZZmKBfiwEam2eiKih" },
//       monthly: { price: 36, planId: "price_1RZCHMQZZmKBfiwEuP6npVF6" },
//       content:
//         "Perfect for early-stage teams and solo entrepreneurs beginning their compliance journey. Includes access to essential document analysis and reporting tools to ensure you meet basic regulatory requirements efficiently and cost-effectively.",
//       features: ["2 Audits", "50 AI Risk Reports", "Policy check", "PDF output", "Free 30 days trial"],
//     },
//     {
//       title: "Team",
//       yearly: { price: 2499, planId: "price_1RaDPEQZZmKBfiwEezQkOHdu" },
//       monthly: { price: 278, planId: "price_1RZCJJQZZmKBfiwEfrMW6IvY" },
//       content:
//         "Designed for growing small to medium-sized businesses needing more robust compliance and audit capabilities. This plan offers advanced document scanning, risk scoring, detailed compliance breakdowns, and team collaboration tools to streamline operations.",
//       features: ["4 Audits", "250 AI Risk Reports", "Policy check", "Validation check", "PDF/CSV output", "Free 7 days trial"],
//     },
//     {
//       title: "Pro",
//       yearly: { price: 5499, planId: "price_1RaDQKQZZmKBfiwEohFw1u2i" },
//       monthly: { price: 538, planId: "price_1RZCKUQZZmKBfiwEmEdHGAhE" },
//       content:
//         "Tailored for established businesses with higher data volume and more complex compliance workflows. Includes everything in the SMB plan, plus prioritized risk alerts, automated audit trail generation, and integration with your internal systems for seamless operation.",
//       features: [
//         "8 Audits",
//         "750 AI Risk Reports",
//         "Policy check", "Validation check", "RegnovaPilot™",
//         "PDF/CSV/JSON output",
//         "Alert Scheduler",
//       ],
//     },
//     {
//       title: "Enterprise",
//       yearly: { price: 9999, planId: "price_1RZCMBQZZmKBfiwEcQRN5FBF" },
//       monthly: { price: 999, planId: "price_1RZCMBQZZmKBfiwEEME3SJNl" },
//       content:
//         "Built for large enterprises and regulated industries. Offers full platform access with custom onboarding, dedicated account management, API access, unlimited document processing, and advanced reporting capabilities to meet enterprise-scale audit and security demands.",
//       features: ["10+ Audits","2000+ AI Risk Reports", "Policy Check", "Validation Check", "RegnovaPilot™", "PDF/CSV/JSON output", "Alert Scheduler", "API", "Account Manager", "Full customisation"],
//     },
//   ];

//   async function subscribe(planId) {
//     const token = localStorage.getItem("rg-token");
//     try {
//       setLoadingPlanId(planId);
//       const res = await fetch(`${BASE_URL}/create-checkout-session`, {
//         method: "POST",
//         body: JSON.stringify({ planId }),
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const { sessionId } = await res.json();
//       const stripe = await stripePromise;
//       await stripe?.redirectToCheckout({ sessionId });
//     } catch (error) {
//       alert("Failed to initiate checkout");
//     } finally {
//       setLoadingPlanId(null);
//     }
//   }

//   useEffect(() => {
//     getSubscriptionDetails();
//   }, []);

//   async function getSubscriptionDetails() {
//     const token = localStorage.getItem("rg-token");
//     try {
//       const response = await fetch(`${BASE_URL}/subscription`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         setSubscription(null);
//         return;
//       }

//       const data = await response.json();
//       setSubscription(data);
//     } catch (err) {
//       setSubscription(null);
//     }
//   }

//   async function cancelSubscription() {
//     if (!subscription?.subscription_id) return;
//     const token = localStorage.getItem("rg-token");
//     try {
//       setCancelling(true);
//       const response = await fetch(`${BASE_URL}/cancel-subscription`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ subscription_id: subscription.subscription_id }),
//       });

//       if (!response.ok) {
//         alert("Failed to cancel subscription");
//         return;
//       }

//       alert("Subscription cancelled");
//       await getSubscriptionDetails();
//     } catch (err) {
//       alert("Failed to cancel subscription");
//     } finally {
//       setCancelling(false);
//     }
//   }

//   const router = useRouter();
//   const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("rg-token");

//   return (
//     <div
//       className="pt-32 min-h-screen flex flex-col justify-center items-center text-white px-4 py-10"
//       style={{
//         backgroundImage: "url(/bg-hero.png)",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <div className="pricing-container mx-auto text-center mb-10">
//         <h1 className="text-4xl font-bold text-center text-white mb-10">Membership Plans</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//           {plans.map((plan, index) => {
//             const periodData = plan[billingPeriod];
//             const isActive =
//               subscription &&
//               subscription.status === "active" &&
//               subscription.price_id === periodData.planId;

//             return (
//               <div
//                 key={index}
//                 className={`
//                   relative bg-gradient-to-br from-[#1a2543] via-[#232e4d] to-[#2d3a5c]
//                   shadow-xl rounded-2xl p-8 border border-[#2e3a5c]
//                   hover:shadow-2xl hover:-translate-y-2 hover:border-[#9135e2]
//                   transition-all duration-300 group
//                   flex flex-col justify-between
//                 `}
//               >
//                 <div>
//                   <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-wide">
//                     {plan.title}
//                   </h2>
//                   <div className="text-center mb-4 border-b border-blue-900 pb-4">
//                     <p className="text-4xl font-extrabold text-white mb-1">
//                       ${periodData.price}
//                     </p>
//                     <p className="text-xs text-blue-300">
//                       {billingPeriod === "yearly" ? "Valid for 12 months" : "Billed monthly"}
//                     </p>
//                   </div>
//                   <ul className="flex flex-col gap-2 text-blue-100 text-sm mb-6">
//                     {plan.features.map((feature, i) => (
//                       <li key={i} className="flex items-center gap-2">
//                         <span className="text-[#9135e2]">✔</span>
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {isLoggedIn ? (
//                   <>
//                     {isActive ? (
//                       <button
//                         onClick={cancelSubscription}
//                         disabled={cancelling}
//                         className="w-full cursor-pointer bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors mt-4 disabled:opacity-60 flex items-center justify-center gap-2"
//                       >
//                         {cancelling ? (
//                           <>
//                             <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                             Cancelling...
//                           </>
//                         ) : (
//                           "Cancel Subscription"
//                         )}
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => subscribe(periodData.planId)}
//                         disabled={loadingPlanId === periodData.planId}
//                         className="w-full cursor-pointer bg-gradient-to-r from-[#9135e2] to-[#6d28d9] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:from-[#a855f7] hover:to-[#7c3aed] transition-colors mt-4 disabled:opacity-60 flex items-center justify-center gap-2"
//                       >
//                         {loadingPlanId === periodData.planId ? (
//                           <>
//                             <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                             Processing...
//                           </>
//                         ) : (
//                           "Subscribe Now"
//                         )}
//                       </button>
//                     )}
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => router.push("/login")}
//                     className="w-full cursor-pointer bg-gradient-to-r from-[#9135e2] to-[#6d28d9] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:from-[#a855f7] hover:to-[#7c3aed] transition-colors mt-4"
//                   >
//                     Subscribe Now
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }






import { BASE_URL } from "@/utils/api_constants";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Plans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState("yearly");
  const [subscription, setSubscription] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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
      title: "Essential",
      comingSoon: false,
      yearly: { price: 369, planId: "price_1RZCI8QZZmKBfiwEam2eiKih" },
      monthly: { price: 36, planId: "price_1RZCHMQZZmKBfiwEuP6npVF6" },
      content: "Perfect for early-stage teams...",
      features: ["3 Audits", "50 AI Risk Reports", "Policy check", "PDF output", "Free 30 days trial"]
    },
    {
      title: "Team",
      comingSoon: true,
      yearly: { price: 2499, planId: "price_1RaDPEQZZmKBfiwEezQkOHdu" },
      monthly: { price: 278, planId: "price_1RZCJJQZZmKBfiwEfrMW6IvY" },
      content: "Designed for growing SMBs...",
      features: ["7 Audits", "250 AI Risk Reports", "Policy check", "Validation check", "PDF/CSV output", "Free 7 days trial"]
    },
    {
      title: "Pro",
      comingSoon: true,
      yearly: { price: 5499, planId: "price_1RaDQKQZZmKBfiwEohFw1u2i" },
      monthly: { price: 538, planId: "price_1RZCKUQZZmKBfiwEmEdHGAhE" },
      content: "Tailored for established businesses...",
      features: ["10 Audits", "750 AI Risk Reports", "Policy check", "Validation check", "RegnovaPilot™", "PDF/CSV/JSON output", "Alert Scheduler"]
    },
    {
      title: "Enterprise",
      comingSoon: true,
      yearly: { price: null, planId: "price_1RZCMBQZZmKBfiwEcQRN5FBF" },
      monthly: { price: null, planId: "price_1RZCMBQZZmKBfiwEEME3SJNl" },
      contactOnly: true,
      content: "Built for large enterprises and regulated industries...",
      features: [
        "10+ Audits",
        "2000+ AI Risk Reports",
        "Policy Check",
        "Validation Check",
        "RegnovaPilot™",
        "PDF/CSV/JSON output",
        "Alert Scheduler",
        "API",
        "Account Manager",
        "Full customisation"
      ]
    }
  ];

  async function subscribe(planId) {
    const token = localStorage.getItem("rg-token");
    try {
      setLoadingPlanId(planId);
      const res = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify({ planId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      alert("Failed to initiate checkout");
    } finally {
      setLoadingPlanId(null);
    }
  }

  useEffect(() => {
    getSubscriptionDetails();
  }, []);

  async function getSubscriptionDetails() {
    const token = localStorage.getItem("rg-token");
    try {
      const response = await fetch(`${BASE_URL}/subscription`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setSubscription(null);
        return;
      }
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setSubscription(null);
    }
  }

  async function cancelSubscription() {
    if (!subscription?.subscription_id) return;
    const token = localStorage.getItem("rg-token");
    try {
      setCancelling(true);
      const response = await fetch(`${BASE_URL}/cancel-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription_id: subscription.subscription_id }),
      });
      if (!response.ok) {
        alert("Failed to cancel subscription");
        return;
      }
      alert("Subscription cancelled");
      await getSubscriptionDetails();
    } catch (err) {
      alert("Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  }

  const router = useRouter();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("rg-token");

  return (
    <div className="pt-32 min-h-screen flex flex-col justify-center items-center text-white px-4 py-10"
      style={{ backgroundImage: "url(/bg-hero.png)", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <div className="pricing-container mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-center text-white mb-10">Membership Plans</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const periodData = plan[billingPeriod];
            const isActive = subscription && subscription.status === "active" && subscription.price_id === periodData.planId;
            return (
              <div key={index} className="relative bg-gradient-to-br from-[#1a2543] via-[#232e4d] to-[#2d3a5c] shadow-xl rounded-2xl p-8 border border-[#2e3a5c] hover:shadow-2xl hover:-translate-y-2 hover:border-[#9135e2] transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-wide">{plan.title}</h2>
                  <div className="text-center mb-4 border-b border-blue-900 pb-4">
                      {plan.title === "Enterprise" ? (
                        <a
                          href="https://www.regnovaai.com/contact"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-bold text-yellow-400 mb-1 hover:underline"
                        >
                          Contact Us
                        </a>
                      ) : (
                        <p className="text-4xl font-extrabold text-white mb-1">${periodData.price}</p>
                      )}


                    {plan.title !== "Enterprise" && (
                        <p className="text-xs text-blue-300">
                          {billingPeriod === "yearly" ? "Valid for 12 months" : "Billed monthly"}
                        </p>
                      )}

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
                {plan.comingSoon ? (
                  <button disabled className="w-full cursor-not-allowed bg-gray-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md opacity-70 mt-4">Launching Soon</button>
                ) : isLoggedIn ? (
                  isActive ? (
                    <button onClick={cancelSubscription} disabled={cancelling} className="w-full bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-red-700 transition-colors mt-4 disabled:opacity-60">
                      {cancelling ? "Cancelling..." : "Cancel Subscription"}
                    </button>
                  ) : (
                    <button onClick={() => subscribe(periodData.planId)} disabled={loadingPlanId === periodData.planId} className="w-full bg-gradient-to-r from-[#9135e2] to-[#6d28d9] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:from-[#a855f7] hover:to-[#7c3aed] transition-colors mt-4">
                      {loadingPlanId === periodData.planId ? "Processing..." : "Get Started – Instant Access"}
                    </button>
                  )
                ) : (
                  <button onClick={() => router.push("/login")} className="w-full bg-gradient-to-r from-[#9135e2] to-[#6d28d9] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:from-[#a855f7] hover:to-[#7c3aed] transition-colors mt-4">
                    Get Started – Instant Access
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
