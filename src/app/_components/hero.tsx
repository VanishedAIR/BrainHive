"use client";

export default function Hero() {
  return (
    <div className="relative flex flex-row items-center justify-between w-[full] min-h-[80vh] px-12 py-16 max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col items-start justify-center max-w-2xl space-y-10 pr-16">
        <div className="w-full">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 leading-[1.4] tracking-tight pb-2">
            Find Your Hive. Study Smarter, Together.
          </h1>
        </div>
        <div className="w-full">
          <h2 className="text-xl text-amber-800/90 font-medium leading-relaxed tracking-wide">
            Join a buzzing community of learners. Connect with study groups,
            collaborate, and achieve more—together.
          </h2>
        </div>
        <button className="mt-4 bg-amber-600 text-white px-12 py-4 rounded-lg hover:bg-amber-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          JOIN NOW FOR FREE
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center ml-16">
        <img
          src="/hero-honeycomb.png"
          alt="Study Hive Hero"
          className="w-[auto] h-[400px]"
        />
      </div>
    </div>
  );
}
