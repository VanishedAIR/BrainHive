"use client";

import Link from "next/link";

export default function Hero() {
  const scrollToOverview = () => {
    const overviewSection = document.querySelector("#overview");
    if (overviewSection) {
      overviewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[75vh] top-[50%]">
      <div className="flex flex-col items-center justify-center mb-[4vh]">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 text-center leading-tight drop-shadow-lg p-2">
            Find Your Hive. Study Smarter, Together.
          </h1>
        </div>
        <div>
          <h2 className="text-xl text-amber-800 text-center max-w-2xl font-medium leading-relaxed">
            Join a buzzing community of learners. Connect with study groups,
            collaborate, and achieve more—together.
          </h2>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-[15%] h-fit gap-4">
        <button>Get Started</button>
        <button onClick={scrollToOverview}>Learn More</button>
      </div>
    </div>
  );
}
