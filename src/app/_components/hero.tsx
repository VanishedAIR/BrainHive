"use client";

/**
 * Hero Component
 *
 * This component renders the hero section of the Study Group Finder application.
 * It includes a headline, subheading, image, and call-to-action buttons to engage users.
 *
 * Features:
 * - Displays a headline and subheading to introduce the application.
 * - Includes a responsive image for visual appeal.
 * - Provides two call-to-action buttons:
 *   - "JOIN NOW FOR FREE" opens a sign-up modal.
 *   - "LEARN MORE!" scrolls to the overview section.
 *
 * Components:
 * - `SignUpButton`: A button from the Clerk library for user sign-up.
 *
 * Styling:
 * - Uses Tailwind CSS for responsive design and hover effects.
 * - Includes gradient text and layouts optimized for mobile and desktop.
 *
 * Accessibility:
 * - The image includes an `alt` attribute for screen readers.
 * - Buttons are styled for clear visibility and interaction.
 *
 * Behavior:
 * - Encourages user engagement with visually appealing design and interactive buttons.
 * - Smooth scrolling to the "overview" section when the "LEARN MORE!" button is clicked.
 */

import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center w-[100%] min-h-[85vh] px-6 md:px-12 max-w-[80%] mx-auto">
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-12 mt-36">
        <div className="flex-1 flex flex-col items-start justify-center max-w-2xl space-y-10">
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 leading-[1.4] tracking-tight pb-2">
              Find Your Hive. Study Smarter, Together.
            </h1>
          </div>
          <div className="w-full">
            <h2 className="text-md md:text-xl text-amber-800/90 font-medium leading-relaxed tracking-wide">
              Join a buzzing community of learners. Connect with study groups,
              collaborate, and achieve more—together.
            </h2>
          </div>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center md:ml-8 lg:ml-16">
          <img
            src="/hero-honeycomb.png"
            alt="Study Hive Hero"
            draggable="false"
            className="w-auto h-[300px] lg:h-[400px] object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12">
        <SignUpButton mode="modal">
          <button className="min-w-[137px] bg-primary hover:bg-[#d97706] text-white px-8 md:px-12 py-4 rounded-lg transition-all duration-300 font-bold text-sm md:text-lg lg:text-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            JOIN NOW FOR FREE
          </button>
        </SignUpButton>
        <button
          className="min-w-[137px] bg-transparent hover:bg-[#d97706] border-3 border-primary hover:border-[#d97706] text-primary dark:text-white hover:text-white px-8 md:px-12 py-4 rounded-lg transition-all duration-300 font-bold text-md md:text-lg lg:text-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => {
            document
              .getElementById("overview")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          LEARN MORE!
        </button>
      </div>
    </div>
  );
}
