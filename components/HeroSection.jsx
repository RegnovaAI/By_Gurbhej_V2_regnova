import React, { useEffect, useState } from "react";

const messages = [
  "AI-Powered Risk Intelligence for the Next Generation of Unicorns",
  "Turn Regulatory Burden into a Competitive Advantage",
  "From Documents to Decisions — In Seconds",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 flex items-center justify-center text-center text-xl font-normal transition-all duration-700 ease-in-out">
      <p className="soft-landing">{messages[index]}</p>
    </div>
  );
}